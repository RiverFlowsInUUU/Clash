# Clash 仓维护手册

本文件记录**本仓特有的坑**与操作顺序。姊妹仓 `Self-Configuration`（Surge / Egern）
的通用经验见它自己的 `skill/SKILL.md`，那边讲的是双内核对齐；本仓讲的是
mihomo 单内核 + **一份配置两种交付形态**带来的独特问题。

---

## 1 · 本仓的结构特点（与姊妹仓最大的不同）

每份 profile 都有**两个交付形态**，它们必须是同一套配置：

| 形态 | 文件 | 用途 |
|:-----|:-----|:-----|
| 静态 | `profiles/lazy.yaml` / `profiles/routing.yaml` | 下载即用 |
| 脚本 | `override/my_clash_lazy.js` / `override/my_clash.js` | 挂到任意订阅上 |

**漂移即事故**：两边都能正常跑、都不报错，只有对拍才能发现。
⇒ 改任一侧都必须跑 `skill/tests/check_script_sync.py`。

### 一个已知且**有意**的差异

`Smart` 组：模板是三档 fallback（`Low Mult.` / `Auto` / `High Mult.`），
脚本是单组 fallback。原因是**内核机制**，不是失误：

- 模板用 `filter` 在**运行时**筛节点 —— 不需要生成期就知道节点名，所以能分档
- 脚本在**订阅加载时**执行一次，此时 provider 的节点还没拉取下来，看不到名字

⇒ 结论：**倍率分档只有模板能做到；脚本只有内联节点订阅下才能排序**。
判据见 `check_script_sync.py` 的 `EXPECTED_DIFF`，命中会打印提醒但不判负。

---

## 2 · 五条铁律

### ① 改脚本必须同步重生成静态 profile

`profiles/routing.yaml` 由脚本生成。改了 `override/my_clash.js` 之后必须重新生成，
并连带重生成 `.min.yaml`。否则用户照文档用脚本订阅、效果跟直接导入不一样。

### ② DNS 层广告拦截有两个必要条件，缺一即完全失效

```
a) nameserver-policy 里 rule-set: 广告集 → rcode://success
b) 同一个广告集在 fake-ip-filter 里再列一遍
```

只写 a 不写 b：`withFakeIP` 中间件对 A/AAAA 直接返回假 IP，
请求永远到不了 `nameserver-policy`，拦截静默失效。

且 **a 中的广告项必须排在 `private,cn` / `geosite:private,cn` 之前** ——
否则先命中 `cn` 就拿不到空回答。

**所有版本（4 份配置 + 2 份脚本）都必须具备**，由 `check_structure.py` 守。

⚠️ 但 **AD 组的成员数两版不同，别套错**：
- 分流版 `REJECT, DIRECT` —— 留了"放行"的口子
- 懒人版 **单成员 `REJECT`** —— 姊妹仓 893b406 有意收敛，定位极简

本仓踩过：把分流版口径套到懒人版上，加了多余的 `DIRECT`。

### ③ IPv6 必须显式关闭（顶层 + dns 两处）

`dns.ipv6: true` 时会返回 AAAA 记录，而本机真实 IPv6 未必被 TUN 完整接管，
双栈站点优先走 IPv6 ⇒ 出口 IP 与节点不符。

只关 `dns.ipv6` 不够，顶层 `ipv6: false` 也要写。姊妹仓两个内核同为显式关闭。

### ④ 远程规则集会**静默降级**

上游改名 / 删档后，rule-provider 拉不到就变成**空集**，没有任何报错 ——
该走 AD 的广告全进了兜底出口，配置看着跑得挺好，其实拦截没了。

本仓踩过两次：Jinx 上游把 `*-white-guard.*` 改名为 `*-direct.*`，
分流版修了，**懒人版一直挂着 404 死链没人发现**。

⇒ 靠 `check_remote_urls.py` + CI 每周定时跑来抓（push 时检查抓不到"上游悄悄变了"）。

### ⑤ 自托管规则集，不跨项目引用姊妹仓

`rules/` 下的 `emby.yaml` / `apple_system.yaml` / `AI_Domains.yaml`
内容可能与姊妹仓同源，但**各存一份**，理由与该仓注释一致：避免跨仓依赖。
⇒ 姊妹仓更新后需人工同步，这是已知代价。

---

## 3 · 改配置的顺序

```
① 改 override/*.js（或 profiles/*.yaml）
② 重新生成静态 profile + .min
③ python skill/tests/check_script_sync.py     ← 两边对拍
④ python skill/tests/check_structure.py       ← 悬空引用 / 广告拦截 / IPv6
⑤ python skill/tests/check_min_pair.py        ← .min 与完整版一致
⑥ python skill/tests/check_remote_urls.py     ← 死链（慢，可只在 push 前跑）
⑦ 提交并推送
```

CI（`.github/workflows/ci.yml`）会在 push 与每周一自动跑 ③④⑤⑥。

---

## 4 · 门禁脚本

| 脚本 | 守什么 |
|:-----|:-------|
| `tests/check_script_sync.py` | 脚本输出 vs 静态 profile 逐位一致 |
| `tests/check_structure.py`   | 悬空引用、规则指向、广告拦截双条件、IPv6 |
| `tests/check_min_pair.py`    | `.min` 与完整版配置本体一致 |
| `tests/check_remote_urls.py` | 远程规则集 / 图标 URL 全部可达 |

共用工具在 `scripts/clash/_clash_common.py`：
`find_node()`（Windows 下 subprocess 找不到 node）、
`run_main()`（输出含 emoji 走管道会被 cp936 炸掉，故落文件再读）、
`utf8_stdout()`（print 一个 ✅ 就 UnicodeEncodeError、以退出码 1 结束 = 假判负）。

---

## 5 · 与姊妹仓对齐时的注意

- 姊妹仓改了不会通知本仓。需要人工 `git pull` 后跑对比。
- 策略组子节点、规则次序、规则集命名都要比对；**规则集内容覆盖度也要比**
  （例：`category-ai-chat-!cn` 188 条 vs 姊妹仓 `AI.list` 271 条，重叠仅 178，
  漏的 93 条全是各家上游都不收的伴生域）。
- 图标：本仓 `icons/` 与姊妹仓字节一致，但**不会自动同步**，需人工复制。
- 机制差异不算不一致：地区组（`smart`+filter vs `url-test`+filter）、
  Airport（`external` vs proxy-provider）、Smart（见 §1）。
