#!/usr/bin/env node
/**
 * Skill Feedback Manager - Local Server
 * 扫描全局 skills，提供 REST API 供前端页面管理反馈数据
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const HOME = os.homedir();
const SKILLS_DIR = path.join(HOME, '.claude', 'skills');
const DATA_FILE = path.join(HOME, '.claude', 'skill-feedback-data.json');
const PLUGINS_CONFIG = path.join(HOME, '.claude', 'plugins', 'installed_plugins.json');

// ---- Skills Scanner ----

function scanSkillsFromDir(dir) {
  const skills = [];
  if (!fs.existsSync(dir)) return skills;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillDir = path.join(dir, entry.name);
    const skillFile = path.join(skillDir, 'SKILL.md');
    const offFile = path.join(skillDir, 'SKILL.md.off');
    // Prefer active SKILL.md; fall back to SKILL.md.off (shielded)
    let filePath = null;
    let shielded = false;
    if (fs.existsSync(skillFile)) {
      filePath = skillFile;
      shielded = false;
    } else if (fs.existsSync(offFile)) {
      filePath = offFile;
      shielded = true;
    } else {
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const fm = parseFrontmatter(content);
      const stat = fs.statSync(filePath);
      // Extract Chinese alias from description: first Chinese phrase, max 16 chars
      const desc = fm.description || '';
      const aliasMatch = desc.match(/[\u4e00-\u9fff][\u4e00-\u9fff\w·\-]*/);
      let alias = aliasMatch ? aliasMatch[0].trim() : '';
      if (alias.length > 16) alias = alias.substring(0, 16) + '…';
      skills.push({
        id: entry.name,
        name: fm.name || entry.name,
        alias: alias,
        description: desc,
        version: (fm.metadata && fm.metadata.version) || fm.version || '',
        lastModified: stat.mtime.toISOString(),
        directory: skillDir,
        shielded: shielded,
      });
    } catch (e) {
      // skip unreadable
    }
  }
  return skills;
}

// ---- Plugin Skill Discovery ----
function discoverPluginSkillDirs() {
  const dirs = [];
  try {
    if (!fs.existsSync(PLUGINS_CONFIG)) return dirs;
    const config = JSON.parse(fs.readFileSync(PLUGINS_CONFIG, 'utf8'));
    const plugins = config.plugins || {};
    for (const [pluginKey, versions] of Object.entries(plugins)) {
      if (!Array.isArray(versions) || versions.length === 0) continue;
      const install = versions[0];
      const installPath = install.installPath;
      if (!installPath) continue;
      const candidates = [
        path.join(installPath, 'skills'),
        path.join(installPath, '.claude', 'skills'),
      ];
      for (const cand of candidates) {
        if (fs.existsSync(cand) && fs.statSync(cand).isDirectory()) {
          dirs.push(cand);
        }
      }
    }
  } catch (e) {
    // ignore
  }
  return dirs;
}

function scanSkills() {
  // Collect scan directories from feedback data
  const data = readFeedback();
  const dirs = data.scanDirs || [SKILLS_DIR];
  // Auto-discover skills from installed plugins
  const pluginDirs = discoverPluginSkillDirs();
  for (const pd of pluginDirs) {
    if (!dirs.some(d => path.resolve(d) === path.resolve(pd))) {
      dirs.push(pd);
    }
  }
  const preferences = data.skillPreference || {};

  // Group all skills by id across directories
  const idGroups = {};
  for (const dir of dirs) {
    const skills = scanSkillsFromDir(dir);
    for (const s of skills) {
      if (!idGroups[s.id]) idGroups[s.id] = [];
      idGroups[s.id].push(s);
    }
  }

  // Resolve duplicates using preferences
  const allSkills = [];
  for (const [id, group] of Object.entries(idGroups)) {
    if (group.length === 1) {
      allSkills.push(group[0]);
    } else {
      // Use preference if set and directory still exists
      const pref = preferences[id];
      const preferred = pref ? group.find(s => s.directory === pref) : null;
      allSkills.push(preferred || group[0]);
    }
  }
  return allSkills.sort((a, b) => a.name.localeCompare(b.name));
}

// ---- Frontmatter Parser ----

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const fm = {};
  const lines = match[1].split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^(\w+):\s*(.*)/);

    if (!m) { i++; continue; }

    const key = m[1];
    let val = m[2].trim().replace(/^['"]|['"]$/g, '');

    if (val === '|') {
      // YAML literal block scalar: read following indented lines
      const blockLines = [];
      i++;
      while (i < lines.length && (lines[i].startsWith('  ') || lines[i].startsWith('\t') || lines[i] === '')) {
        blockLines.push(lines[i].replace(/^\s{2}/, ''));
        i++;
      }
      fm[key] = blockLines.join('\n').trim();
      continue;
    } else if (val === '') {
      // Check if next line is indented
      if (i + 1 < lines.length && (lines[i + 1].startsWith('  ') || lines[i + 1].startsWith('\t'))) {
        // Peek ahead: if indented lines contain key: value patterns, it's a nested object
        // Otherwise it's a multiline string (block scalar without | marker)
        let isNested = false;
        for (let j = i + 1; j < lines.length && (lines[j].startsWith('  ') || lines[j].startsWith('\t')); j++) {
          if (/^\s+\w+:\s+/.test(lines[j])) { isNested = true; break; }
        }

        if (isNested) {
          const nestedObj = {};
          i++;
          while (i < lines.length && (lines[i].startsWith('  ') || lines[i].startsWith('\t'))) {
            const nm = lines[i].match(/^\s+(\w+):\s*(.*)/);
            if (nm) nestedObj[nm[1]] = nm[2].trim().replace(/^['"]|['"]$/g, '');
            i++;
          }
          fm[key] = nestedObj;
          continue;
        } else {
          // Multiline string without | marker
          const blockLines = [];
          i++;
          while (i < lines.length && (lines[i].startsWith('  ') || lines[i].startsWith('\t') || lines[i] === '')) {
            blockLines.push(lines[i].replace(/^\s{2}/, ''));
            i++;
          }
          fm[key] = blockLines.join('\n').trim();
          continue;
        }
      }
      // Empty value, just set to empty string
      fm[key] = val;
    } else {
      fm[key] = val;
    }
    i++;
  }
  return fm;
}

// ---- Dependency Scanner ----

function scanDependencies() {
  const allSkills = scanSkills();
  const skillIds = new Set(allSkills.map(s => s.id));
  const shieldedMap = {};
  for (const s of allSkills) {
    shieldedMap[s.id] = s.shielded;
  }

  // Build children map: skillId -> Set of skillIds it depends on
  const childrenMap = {};

  for (const skill of allSkills) {
    const skillDir = skill.directory;
    const skillFile = path.join(skillDir, 'SKILL.md');
    const offFile = path.join(skillDir, 'SKILL.md.off');
    let filePath = fs.existsSync(skillFile) ? skillFile : (fs.existsSync(offFile) ? offFile : null);
    if (!filePath) continue;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const deps = new Set();

      // Pattern 1: table rows with backtick-quoted skill names (any column)
      const tableRows = content.matchAll(/\|\s*`([a-zA-Z][a-zA-Z0-9_-]*)`\s*\|/g);
      for (const m of tableRows) {
        const name = m[1];
        if (name.includes('/') || name.includes('\\')) continue;
        if (skillIds.has(name) && name !== skill.id) deps.add(name);
      }

      // Pattern 2: 调用 `skill-name`
      const callPatterns = content.matchAll(/调用\s*`([^`]+)`/g);
      for (const m of callPatterns) {
        const name = m[1];
        if (skillIds.has(name) && name !== skill.id) deps.add(name);
      }

      // Pattern 3: 调用 skill-name 技能
      const callSkillPatterns = content.matchAll(/调用\s+(\S+)\s+技能/g);
      for (const m of callSkillPatterns) {
        const name = m[1];
        if (skillIds.has(name) && name !== skill.id) deps.add(name);
      }

      // Pattern 4: namespace:skill-id format (e.g., superpowers:brainstorming)
      const nsPattern = /(?:^|[^\w\/\\])([a-zA-Z][a-zA-Z0-9_-]*):([a-zA-Z][a-zA-Z0-9_-]*)(?=[^\w\/\\]|$)/g;
      let nsMatch;
      while ((nsMatch = nsPattern.exec(content)) !== null) {
        const refId = nsMatch[2];
        if (skillIds.has(refId) && refId !== skill.id) deps.add(refId);
      }

      // Pattern 5: bare `skill-id` in prose (only match hyphenated names to avoid false positives)
      const btPattern = content.matchAll(/`([a-zA-Z][a-zA-Z0-9]*-[a-zA-Z0-9_-]*)`/g);
      for (const m of btPattern) {
        const name = m[1];
        if (name.includes('/') || name.includes('\\')) continue;
        if (skillIds.has(name) && name !== skill.id) deps.add(name);
      }

      if (deps.size > 0) {
        childrenMap[skill.id] = [...deps];
      }
    } catch (e) {
      // skip unreadable
    }
  }

  // ---- Structural: plugin directory containment ----
  // Skills inside a plugin's skills directory are children of that plugin's root skill
  // Supports both .../plugin/.claude/skills/ and .../plugin/skills/ patterns
  try {
    const skillsDirGroups = {};
    for (const skill of allSkills) {
      const dir = skill.directory.replace(/\\/g, '/');
      // Try both patterns: /.claude/skills/ and /skills/ (under plugin cache)
      let skillsParent = null;
      for (const pattern of ['/.claude/skills/', '/skills/']) {
        const idx = dir.indexOf(pattern);
        if (idx >= 0) {
          skillsParent = dir.substring(0, idx + pattern.length - 1); // strip trailing /
          break;
        }
      }
      if (!skillsParent) continue;
      // Only consider plugin directories (under cache/ or marketplaces/)
      if (!skillsParent.includes('/plugins/')) continue;
      if (!skillsDirGroups[skillsParent]) skillsDirGroups[skillsParent] = [];
      skillsDirGroups[skillsParent].push(skill);
    }

    // For each group, find the namespace root and link children to it
    for (const [skillsParent, group] of Object.entries(skillsDirGroups)) {
      if (group.length < 2) continue; // need at least 2 to have a containment relationship

      // Extract candidate namespace names from path components above skills/
      const above = path.dirname(skillsParent).replace(/\\/g, '/').split('/').filter(Boolean);
      // Candidate names: directory segments above (reversed for priority — closer dirs first)
      const namespaceCandidates = [...above].reverse();

      // Find the root skill: bidirectional match with namespace candidates
      let rootId = null;
      for (const candidate of namespaceCandidates) {
        // Exact match
        let match = group.find(s => s.id === candidate);
        // Skill id contains candidate (e.g. "using-superpowers" ⊃ "superpowers")
        if (!match) match = group.find(s => s.id.includes(candidate));
        // Candidate contains skill id (e.g. "chrome-devtools-mcp" ⊃ "chrome-devtools")
        if (!match) match = group.find(s => candidate.includes(s.id));
        // Strip -skill suffix
        if (!match) {
          const stripped = candidate.replace(/-skill$/, '');
          match = group.find(s => s.id === stripped || s.id.includes(stripped) || stripped.includes(s.id));
        }
        if (match) { rootId = match.id; break; }
      }
      // Fallback: use the group member whose id matches the deepest directory above
      if (!rootId && above.length > 0) {
        const deepest = above[above.length - 1];
        const fallback = group.find(s => s.id === deepest || s.id.includes(deepest) || deepest.includes(s.id));
        if (fallback) rootId = fallback.id;
      }

      if (rootId) {
        if (!childrenMap[rootId]) childrenMap[rootId] = [];
        for (const child of group) {
          if (child.id !== rootId && !childrenMap[rootId].includes(child.id)) {
            childrenMap[rootId].push(child.id);
            // Dedup: if content already says child→root (reverse edge), remove it.
            // Structural containment is authoritative within a plugin; content
            // references like "调用 root-skill" are implicit and redundant here.
            if (childrenMap[child.id]) {
              const idx = childrenMap[child.id].indexOf(rootId);
              if (idx >= 0) {
                childrenMap[child.id].splice(idx, 1);
                if (childrenMap[child.id].length === 0) delete childrenMap[child.id];
              }
            }
          }
        }
      }
    }
  } catch (e) { /* skip structural analysis on error */ }

  // Build parents map by reversing childrenMap
  const parentsMap = {};
  for (const [parentId, children] of Object.entries(childrenMap)) {
    for (const childId of children) {
      if (!parentsMap[childId]) parentsMap[childId] = [];
      if (!parentsMap[childId].includes(parentId)) parentsMap[childId].push(parentId);
    }
  }

  // Build final dependency data with shielded info
  const dependencies = {};
  for (const skill of allSkills) {
    const children = (childrenMap[skill.id] || []).map(id => ({
      id,
      shielded: !!shieldedMap[id],
    }));
    const parents = (parentsMap[skill.id] || []).map(id => ({
      id,
      shielded: !!shieldedMap[id],
    }));
    dependencies[skill.id] = { children, parents };
  }

  return dependencies;
}

// ---- Feedback Data ----

function readFeedback() {
  if (!fs.existsSync(DATA_FILE)) return { categories: {}, skills: {} };
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return { categories: {}, skills: {} };
  }
}

function writeFeedback(data) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ---- HTTP Helpers ----

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

// ---- Server ----

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  try {
    // Serve index.html
    if (req.method === 'GET' && url.pathname === '/') {
      const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }

    // Scan skills
    if (req.method === 'GET' && url.pathname === '/api/skills') {
      return sendJSON(res, { skills: scanSkills() });
    }

    // Get skill dependencies
    if (req.method === 'GET' && url.pathname === '/api/skill-dependencies') {
      return sendJSON(res, { dependencies: scanDependencies() });
    }

    // Get skill Chinese translations
    if (req.method === 'GET' && url.pathname === '/api/skill-translations') {
      const zhFile = path.join(__dirname, 'skill-zh.json');
      if (fs.existsSync(zhFile)) {
        try {
          const translations = JSON.parse(fs.readFileSync(zhFile, 'utf-8'));
          return sendJSON(res, translations);
        } catch (e) {
          return sendJSON(res, {});
        }
      }
      return sendJSON(res, {});
    }

    // Read feedback
    if (req.method === 'GET' && url.pathname === '/api/feedback') {
      return sendJSON(res, readFeedback());
    }

    // Save feedback (smart merge to prevent overwriting manual edits)
    if (req.method === 'POST' && url.pathname === '/api/feedback') {
      const incoming = await parseBody(req);
      // Read current file to preserve manual edits the client may not know about
      const current = readFeedback();
      // Smart merge categoryMeta: if disk has a custom icon (!= 📁) but incoming
      // still has the default 📁, keep the disk version (likely a manual edit)
      if (incoming.categoryMeta && current.categoryMeta) {
        for (const [cat, curMeta] of Object.entries(current.categoryMeta)) {
          const incMeta = incoming.categoryMeta[cat];
          if (incMeta && curMeta.icon && curMeta.icon !== '📁' && incMeta.icon === '📁') {
            incMeta.icon = curMeta.icon;
          }
        }
      }
      writeFeedback(incoming);
      return sendJSON(res, { ok: true });
    }

    // Open skill folder in file explorer
    if (req.method === 'POST' && url.pathname === '/api/open-folder') {
      const { directory } = await parseBody(req);
      if (!directory || !fs.existsSync(directory)) {
        return sendJSON(res, { error: 'Directory not found' }, 400);
      }
      const cmd = os.platform() === 'win32' ? `explorer "${directory}"`
                : os.platform() === 'darwin' ? `open "${directory}"`
                : `xdg-open "${directory}"`;
      exec(cmd, (err) => {
        if (err) return sendJSON(res, { error: err.message }, 500);
        sendJSON(res, { ok: true });
      });
      return;
    }

    // Get scan directories with skill counts
    if (req.method === 'GET' && url.pathname === '/api/scan-dirs') {
      const data = readFeedback();
      const userDirs = data.scanDirs || [SKILLS_DIR];
      const pluginDirs = discoverPluginSkillDirs();
      // Merge: user dirs + auto-discovered plugin dirs (no duplicates)
      const allDirs = [...userDirs];
      for (const pd of pluginDirs) {
        if (!allDirs.some(d => path.resolve(d) === path.resolve(pd))) {
          allDirs.push(pd);
        }
      }
      const preferences = data.skillPreference || {};

      // Build active directory map: for each skill id, which directory is preferred
      const allByDir = allDirs.map(dir => scanSkillsFromDir(dir));
      const idDirs = {}; // id -> [dir paths]
      for (let i = 0; i < allDirs.length; i++) {
        for (const s of allByDir[i]) {
          if (!idDirs[s.id]) idDirs[s.id] = [];
          idDirs[s.id].push(allDirs[i]);
        }
      }

      const result = allDirs.map((dir, idx) => {
        const dirSkills = allByDir[idx];
        const skillsWithStatus = dirSkills.map(s => {
          // Only mark inactive if this skill id exists in multiple dirs and this isn't the preferred one
          const conflicted = idDirs[s.id] && idDirs[s.id].length > 1;
          let active = true;
          if (conflicted) {
            const preferredDir = preferences[s.id]
              ? path.resolve(preferences[s.id])
              : idDirs[s.id][0];
            active = path.resolve(s.directory) === path.resolve(preferredDir);
          }
          return { id: s.id, name: s.name, shielded: s.shielded, active, conflicted: !!conflicted };
        });
        const enabled = skillsWithStatus.filter(s => s.active && !s.shielded).length;
        const shielded = skillsWithStatus.filter(s => s.shielded).length;
        const inactive = skillsWithStatus.filter(s => !s.active && !s.shielded).length;
        // Mark auto-discovered plugin dirs vs user-added dirs
        const isAuto = pluginDirs.some(d => path.resolve(d) === path.resolve(dir));
        return { path: dir, count: dirSkills.length, enabled, shielded, inactive, skills: skillsWithStatus, auto: isAuto };
      });

      // Detect duplicates: same id across dirs, or same name with different ids
      const idMap = {};   // id -> [{dir, skill}]
      const nameMap = {}; // name -> [{dir, skill}]
      for (let i = 0; i < allDirs.length; i++) {
        for (const s of allByDir[i]) {
          const entry = { dir: allDirs[i], skill: s };
          if (!idMap[s.id]) idMap[s.id] = [];
          idMap[s.id].push(entry);
          if (!nameMap[s.name]) nameMap[s.name] = [];
          nameMap[s.name].push(entry);
        }
      }
      const duplicates = [];
      // Same id in different dirs
      for (const [id, entries] of Object.entries(idMap)) {
        if (entries.length > 1) {
          duplicates.push({ type: 'id', key: id, locations: entries.map(e => ({ dir: e.dir, id: e.skill.id, name: e.skill.name, directory: e.skill.directory })) });
        }
      }
      // Same name but different ids
      for (const [name, entries] of Object.entries(nameMap)) {
        if (entries.length > 1) {
          const ids = [...new Set(entries.map(e => e.skill.id))];
          if (ids.length > 1) {
            duplicates.push({ type: 'name', key: name, locations: entries.map(e => ({ dir: e.dir, id: e.skill.id, name: e.skill.name, directory: e.skill.directory })) });
          }
        }
      }

      return sendJSON(res, { dirs: result, defaultDir: SKILLS_DIR, duplicates });
    }

    // Add a scan directory
    if (req.method === 'POST' && url.pathname === '/api/scan-dirs') {
      const { dirPath } = await parseBody(req);
      if (!dirPath || !fs.existsSync(dirPath)) {
        return sendJSON(res, { error: '路径不存在' }, 400);
      }
      const resolved = path.resolve(dirPath);
      const data = readFeedback();
      if (!data.scanDirs) data.scanDirs = [SKILLS_DIR];
      if (data.scanDirs.includes(resolved)) {
        return sendJSON(res, { error: '该路径已存在' }, 400);
      }
      data.scanDirs.push(resolved);
      writeFeedback(data);
      const skills = scanSkillsFromDir(resolved);
      return sendJSON(res, { ok: true, newSkills: skills.length, path: resolved });
    }

    // Remove a scan directory
    if (req.method === 'POST' && url.pathname === '/api/scan-dirs/remove') {
      const { dirPath } = await parseBody(req);
      const data = readFeedback();
      if (!data.scanDirs) data.scanDirs = [SKILLS_DIR];
      const idx = data.scanDirs.indexOf(dirPath);
      if (idx < 0) return sendJSON(res, { error: '路径不存在' }, 400);
      if (dirPath === SKILLS_DIR) return sendJSON(res, { error: '不能移除默认扫描目录' }, 400);
      data.scanDirs.splice(idx, 1);
      writeFeedback(data);
      return sendJSON(res, { ok: true });
    }

    // Preview: scan a path without adding it
    if (req.method === 'POST' && url.pathname === '/api/scan-preview') {
      const { dirPath } = await parseBody(req);
      if (!dirPath || !fs.existsSync(dirPath)) {
        return sendJSON(res, { error: '路径不存在' }, 400);
      }
      const resolved = path.resolve(dirPath);
      const skills = scanSkillsFromDir(resolved);
      const current = scanSkills();
      const currentIds = new Set(current.map(s => s.id));
      const currentNames = new Set(current.map(s => s.name));

      const newSkills = [];
      const dupById = [];
      const dupByName = [];
      for (const s of skills) {
        if (currentIds.has(s.id)) {
          const existing = current.find(c => c.id === s.id);
          dupById.push({ id: s.id, name: s.name, existingDir: existing ? existing.directory : '' });
        } else if (currentNames.has(s.name)) {
          const existing = current.find(c => c.name === s.name);
          dupByName.push({ id: s.id, name: s.name, existingDir: existing ? existing.directory : '' });
        } else {
          newSkills.push({ id: s.id, name: s.name });
        }
      }
      return sendJSON(res, {
        total: skills.length,
        newCount: newSkills.length,
        dupByIdCount: dupById.length,
        dupByNameCount: dupByName.length,
        resolved,
        newSkills,
        dupById,
        dupByName,
      });
    }

    // Get skill conflicts (duplicates across scan dirs)
    if (req.method === 'GET' && url.pathname === '/api/skill-conflicts') {
      const data = readFeedback();
      const dirs = data.scanDirs || [SKILLS_DIR];
      const preferences = data.skillPreference || {};

      // Group all skills by id across directories
      const idGroups = {};
      for (const dir of dirs) {
        const skills = scanSkillsFromDir(dir);
        for (const s of skills) {
          if (!idGroups[s.id]) idGroups[s.id] = [];
          idGroups[s.id].push(s);
        }
      }

      // Only return groups with conflicts (same id in multiple dirs)
      const conflicts = [];
      for (const [id, group] of Object.entries(idGroups)) {
        if (group.length > 1) {
          // Normalize preference path for reliable comparison
          const rawPref = preferences[id] || group[0].directory;
          const normalizedPref = path.resolve(rawPref);
          conflicts.push({
            id,
            name: group[0].name,
            preference: normalizedPref,
            locations: group.map(s => ({
              directory: s.directory,
              lastModified: s.lastModified,
              version: s.version,
            })),
          });
        }
      }
      return sendJSON(res, { conflicts });
    }

    // Save skill preference (which directory to use for a duplicate)
    if (req.method === 'POST' && url.pathname === '/api/skill-preference') {
      const { id, directory } = await parseBody(req);
      if (!id || !directory) {
        return sendJSON(res, { error: '缺少参数' }, 400);
      }
      const data = readFeedback();
      if (!data.skillPreference) data.skillPreference = {};
      // Normalize path separators for reliable comparison
      data.skillPreference[id] = path.resolve(directory);
      writeFeedback(data);
      return sendJSON(res, { ok: true });
    }

    // Shield/unshield a skill (rename SKILL.md <-> SKILL.md.off)
    if (req.method === 'POST' && url.pathname === '/api/skill-shield') {
      const { id, shielded } = await parseBody(req);
      if (!id) {
        return sendJSON(res, { error: '缺少技能 ID' }, 400);
      }
      // Find the skill directory from scan results
      const allSkills = scanSkills();
      const skill = allSkills.find(s => s.id === id);
      if (!skill) {
        return sendJSON(res, { error: '未找到技能' }, 404);
      }
      const skillDir = skill.directory;
      const skillFile = path.join(skillDir, 'SKILL.md');
      const offFile = path.join(skillDir, 'SKILL.md.off');

      // Compute dependents (skills that depend on this one) before shielding
      let dependents = [];
      if (shielded) {
        const deps = scanDependencies();
        const depInfo = deps[id];
        if (depInfo && depInfo.parents && depInfo.parents.length > 0) {
          dependents = depInfo.parents.filter(p => !p.shielded).map(p => p.id);
        }
      }

      if (shielded) {
        // Shield: SKILL.md -> SKILL.md.off
        if (fs.existsSync(offFile)) {
          // Already shielded at file level, skip rename
        } else if (fs.existsSync(skillFile)) {
          fs.renameSync(skillFile, offFile);
        }
        // else: neither file exists, just update feedback data
      } else {
        // Unshield: SKILL.md.off -> SKILL.md
        if (fs.existsSync(skillFile)) {
          // Already unshielded at file level, skip rename
        } else if (fs.existsSync(offFile)) {
          fs.renameSync(offFile, skillFile);
        }
        // else: neither file exists, just update feedback data
      }

      // Persist shielded state in feedback data
      const data = readFeedback();
      if (!data.skills[id]) data.skills[id] = {};
      data.skills[id].shielded = !!shielded;
      writeFeedback(data);

      return sendJSON(res, { ok: true, shielded: !!shielded, dependents: dependents || [] });
    }

    // Run usage scan script
    if (req.method === 'POST' && url.pathname === '/api/usage-scan') {
      const scriptPath = path.join(__dirname, 'scan-usage.cjs');
      if (!fs.existsSync(scriptPath)) {
        return sendJSON(res, { ok: false, error: 'scan-usage.cjs not found' }, 500);
      }
      const { spawn } = require('child_process');
      const child = spawn('node', [scriptPath], { cwd: __dirname });
      let stdout = '';
      let stderr = '';
      child.stdout.on('data', (chunk) => { stdout += chunk; });
      child.stderr.on('data', (chunk) => { stderr += chunk; });
      child.on('close', (code) => {
        if (code !== 0 && !stdout.trim()) {
          return sendJSON(res, { ok: false, error: stderr || 'Process exited with code ' + code }, 500);
        }
        try {
          const result = JSON.parse(stdout.trim());
          return sendJSON(res, result);
        } catch (e) {
          return sendJSON(res, { ok: false, error: 'Invalid JSON output: ' + (stdout.substring(0, 200)) }, 500);
        }
      });
      child.on('error', (err) => {
        sendJSON(res, { ok: false, error: err.message }, 500);
      });
      return;
    }

    // Get home directory (for usage scan info display)
    if (req.method === 'GET' && url.pathname === '/api/home-dir') {
      return sendJSON(res, { homeDir: HOME });
    }

    res.writeHead(404);
    res.end('Not Found');
  } catch (err) {
    console.error(err);
    sendJSON(res, { error: err.message }, 500);
  }
});

const DEFAULT_PORT = 6641;

function isPortInUse(port) {
  return new Promise((resolve) => {
    const tester = require('net').createServer();
    tester.once('error', () => resolve(true));
    tester.once('listening', () => { tester.close(); resolve(false); });
    tester.listen(port);
  });
}

function openBrowser(url) {
  const platform = os.platform();
  let cmd;
  if (platform === 'win32') cmd = `start ${url}`;
  else if (platform === 'darwin') cmd = `open ${url}`;
  else cmd = `xdg-open ${url}`;

  exec(cmd, (err) => {
    if (err) console.log(`  Please open ${url} in your browser.`);
  });
}

(async () => {
  const portInUse = await isPortInUse(DEFAULT_PORT);

  if (portInUse) {
    const url = `http://localhost:${DEFAULT_PORT}`;
    console.log(`\n  Port ${DEFAULT_PORT} is already in use — server likely running.`);
    console.log(`  Opening existing page: ${url}\n`);
    openBrowser(url);
    process.exit(0);
  }

  server.listen(DEFAULT_PORT, () => {
    const url = `http://localhost:${DEFAULT_PORT}`;
    console.log(`\n  Skill Feedback Manager is running at:\n  ${url}\n`);
    console.log(`  Scanning : ${SKILLS_DIR}`);
    console.log(`  Data file: ${DATA_FILE}\n`);
    console.log('  Press Ctrl+C to stop.\n');
    openBrowser(url);
  });
})();