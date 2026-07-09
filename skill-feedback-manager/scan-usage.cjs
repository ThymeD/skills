#!/usr/bin/env node
/**
 * scan-usage.cjs — 增量扫描 CodeAgentCLI 会话日志，提取 Skill 调用记录
 *
 * 输出 JSON 到 stdout：
 *   成功: { ok: true, scanTime, newCalls, totalCalls, byDate, projectsDir }
 *   失败: { ok: false, error, hint }
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOME = os.homedir();
const PROJECTS_DIR = path.join(HOME, '.claude', 'projects');
const DATA_FILE = path.join(HOME, '.claude', 'skill-feedback-data.json');
const SCRIPT_PATH = __filename;

function fail(error) {
  const hint = [
    '技能看板的调用扫描脚本执行出错，请帮我修复。',
    '',
    '脚本路径: ' + SCRIPT_PATH,
    '数据文件: ' + DATA_FILE,
    '扫描目录: ' + PROJECTS_DIR,
    '',
    '错误信息:',
    error,
    '',
    '请阅读脚本源码，分析错误原因并修复。可能的原因：',
    '1. 会话日志文件格式变化（字段名、结构等）',
    '2. 目录结构变化（projects 目录布局改变）',
    '3. 数据文件损坏或格式不兼容',
    '4. Node.js API 兼容性问题',
  ].join('\n');

  const result = { ok: false, error, hint };
  process.stdout.write(JSON.stringify(result));
  process.exit(0);
}

try {
  main();
} catch (e) {
  fail(e.stack || e.message || String(e));
}

function main() {
  // 1. Read feedback data
  let data;
  try {
    if (!fs.existsSync(DATA_FILE)) {
      data = { categories: {}, skills: {} };
    } else {
      data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (e) {
    fail('读取数据文件失败: ' + (e.message || e));
    return;
  }

  const prevState = data.usageScanState || { processedFiles: {} };
  const processedFiles = prevState.processedFiles || {};

  // 2. Scan all project directories
  if (!fs.existsSync(PROJECTS_DIR)) {
    // No projects directory yet, nothing to scan
    const result = {
      ok: true,
      scanTime: new Date().toISOString(),
      newCalls: 0,
      totalCalls: buildTotalCalls(data),
      byDate: data.usageByDate || {},
      projectsDir: PROJECTS_DIR,
    };
    process.stdout.write(JSON.stringify(result));
    return;
  }

  const projectDirs = fs.readdirSync(PROJECTS_DIR).filter(name => {
    const full = path.join(PROJECTS_DIR, name);
    try { return fs.statSync(full).isDirectory(); } catch { return false; }
  });

  // 3. Collect Skill calls from session files
  const newCalls = []; // { skillName, toolId, timestamp }
  const updatedFiles = {};

  for (const projDir of projectDirs) {
    const projPath = path.join(PROJECTS_DIR, projDir);
    let files;
    try {
      files = fs.readdirSync(projPath).filter(f => f.endsWith('.jsonl'));
    } catch { continue; }

    for (const file of files) {
      const fullPath = path.join(projPath, file);
      const relKey = projDir + '/' + file; // e.g., "C--Users-d00576641/abc.jsonl"

      let stat;
      try { stat = fs.statSync(fullPath); } catch { continue; }

      const prevInfo = processedFiles[relKey];
      const currentSize = stat.size;

      if (prevInfo && prevInfo.size === currentSize) {
        // File unchanged, skip
        updatedFiles[relKey] = prevInfo;
        continue;
      }

      // Read file (incremental: from last byte offset if growing, or from start if new)
      const startOffset = (prevInfo && prevInfo.size < currentSize) ? prevInfo.size : 0;

      let content;
      try {
        if (startOffset > 0) {
          const fd = fs.openSync(fullPath, 'r');
          const buf = Buffer.alloc(currentSize - startOffset);
          fs.readSync(fd, buf, 0, buf.length, startOffset);
          fs.closeSync(fd);
          content = buf.toString('utf-8');
        } else {
          content = fs.readFileSync(fullPath, 'utf-8');
        }
      } catch (e) {
        // Skip unreadable files
        updatedFiles[relKey] = { size: currentSize };
        continue;
      }

      // Parse lines and extract Skill tool_use
      const lines = content.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const obj = JSON.parse(line);
          if (obj.message && obj.message.role === 'assistant' && Array.isArray(obj.message.content)) {
            for (const block of obj.message.content) {
              if (block.type === 'tool_use' && block.name === 'Skill' && block.input && block.input.skill) {
                newCalls.push({
                  skillName: block.input.skill,
                  toolId: block.id || '',
                  timestamp: obj.timestamp || '',
                });
              }
            }
          }
        } catch { /* skip malformed lines */ }
      }

      updatedFiles[relKey] = { size: currentSize };
    }
  }

  // 4. Deduplicate by toolId (across all scans)
  const seenIds = new Set();
  // Rebuild seen IDs from existing data
  const existingByDate = data.usageByDate || {};
  // We track seen toolIds in usageScanState.seenToolIds
  const seenToolIds = new Set(prevState.seenToolIds || []);

  const dedupedCalls = [];
  for (const call of newCalls) {
    if (call.toolId && seenToolIds.has(call.toolId)) continue;
    if (call.toolId) seenToolIds.add(call.toolId);
    dedupedCalls.push(call);
  }

  // 5. Update usageByDate
  const byDate = { ...(data.usageByDate || {}) };
  for (const call of dedupedCalls) {
    const name = call.skillName;
    if (!byDate[name]) byDate[name] = {};
    const dateStr = call.timestamp ? call.timestamp.substring(0, 10) : 'unknown';
    byDate[name][dateStr] = (byDate[name][dateStr] || 0) + 1;
  }

  // 6. Update autoCount for each skill
  for (const [skillName, dateCounts] of Object.entries(byDate)) {
    if (!data.skills[skillName]) data.skills[skillName] = {};
    data.skills[skillName].autoCount = Object.values(dateCounts).reduce((a, b) => a + b, 0);
  }

  // 7. Update scan state
  data.usageScanState = {
    lastScanTime: new Date().toISOString(),
    processedFiles: updatedFiles,
    seenToolIds: [...seenToolIds],
  };
  data.usageByDate = byDate;

  // 8. Write back
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    fail('写入数据文件失败: ' + (e.message || e));
    return;
  }

  // 9. Output result
  const result = {
    ok: true,
    scanTime: data.usageScanState.lastScanTime,
    newCalls: dedupedCalls.length,
    totalCalls: buildTotalCalls(data),
    byDate,
    projectsDir: PROJECTS_DIR,
  };
  process.stdout.write(JSON.stringify(result));
}

function buildTotalCalls(data) {
  const totals = {};
  const byDate = data.usageByDate || {};
  for (const [name, dateCounts] of Object.entries(byDate)) {
    totals[name] = Object.values(dateCounts).reduce((a, b) => a + b, 0);
  }
  return totals;
}