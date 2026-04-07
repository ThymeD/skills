# 示例（summary-qa）

以下为**虚构短文**的演示，展示字段形态；真实使用时应替换为用户的材料与真实出处摘录。

---

## 示例 1：单选题

**材料片段（假设）**  
小节标题：《缓存失效的三种策略》  
正文：「主动失效适用于变更可预期的场景；TTL 适用于可容忍短期不一致的业务……」

**题目**

- `id`: `q-demo-1`
- `type`: `single`
- `stem`: 在变更可预期、需要尽快保持一致时，文中更侧重采用哪种方式？
- `options`:  
  - A：仅依赖 TTL 到期  
  - B：主动失效  
  - C：永远不做失效  
  - D：随机失效  
- `correct`: `B`
- `explanation`: 文中将「主动失效」与「变更可预期」对应；TTL 侧重点是可容忍短期不一致，与题干条件不符。
- `source_ref`:  
  - `section_title`: 《缓存失效的三种策略》  
  - `excerpt`: 「主动失效适用于变更可预期的场景；TTL 适用于可容忍短期不一致的业务……」

---

## 示例 2：判断题

**题目**

- `id`: `q-demo-2`
- `type`: `boolean`
- `stem`: 根据上文，TTL 策略适用于「绝对不能容忍任何不一致」的金融实时对账场景。（判断正误）
- `correct`: `false`
- `explanation`: 文中写明 TTL 适用于可容忍短期不一致；与「绝对不能容忍不一致」矛盾。
- `source_ref`: 同上摘录。

---

## 示例 3：Coverage（部分覆盖）

当仅能处理文章前半部分时，在学习包中增加：

```yaml
coverage:
  status: partial
  covered_sections: ["一、背景", "二、缓存失效的三种策略"]
  not_covered: ["三、部署案例（篇幅与上下文限制，未纳入出题）"]
```

---

## 示例 4：feedback.jsonl 一行

```json
{"pack_id":"demo-pack-001","question_id":"q-demo-1","ts":"2026-04-08T12:00:00+08:00","rating":"down","issue_targets":["stem"],"issue_types":["unclear"],"comment":"","missing_topic":""}
```
