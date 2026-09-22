# 更新日志

本文件按 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范编写。

---

## 2026-09-22

### 新增

- 🎉 **仓库初始化** —— `README.md` + `LICENSE`（MIT）。定位 Clash 配置模板，交付懒人版与分流版两份配置。
- 🪶 **懒人版配置落地** —— `profiles/lazy.yaml`（带注释）/ `profiles/lazy.min.yaml`（纯配置）：
  - 🧩 **3 个策略组**：`Proxy`（主出口）· `AI`（AI 流量独立出口）· `AD`（手动开关，`REJECT` / `PASS` / `DIRECT`）；
  - 📋 **9 条规则**，自上而下：白名单 → 广告拦截 ×2 → 内网 → AI → 国内 → 兜底；
  - ✈️ `proxies` 一条 vless + reality 节点占位；`proxy-providers.Airport` 订阅槽位（含健康检查），两个策略组均以 `use: [Airport]` 引入；
  - 🔧 `.min.yaml` 由 `build_clash_lazy.py` 从带注释版剥离生成，两份解析后数据完全一致（脚本断言守着）。
- 🗓️ **更新日志** —— 本文件，自建仓起记账。
- 📘 **技术文档立项** —— 新建 `DetailsReadme/DetailsReadme.md`：防泄露三条出口的逐条推导、`dns` 段 15 键逐键说明、五个解析器键的分工、`tun` 段与 `dns-hijack` 语义、明文泄露面实测读数、已知取舍。

### 变更

- 🌐 **DNS 段改为加密解析** —— 解析器此前写 `system`（即交给操作系统 / ISP 的明文递归），现全部换成加密端点：

| 键 | 解析器 | 用途 |
|:--|:--|:--|
| 🧭 `nameserver` | `dns.cloudflare.com` · `dns.google` | 主解析器 |
| 🎯 `nameserver-policy` | `geosite:private,cn` → 国内 DoH | 按域名换解析器 |
| ✈️ `proxy-server-nameserver` | 国内 DoH | 代理节点域名 |
| 🚪 `direct-nameserver` | 国内 DoH | `DIRECT` 出站的域名 |
| 🥾 `default-nameserver` | `223.5.5.5` · `119.29.29.29` | 仅引导 DoH 端点自身的域名 |

  同时补齐 `ipv6: false` · `listen` · `prefer-h3: false` · `respect-rules: true` · `use-hosts` · `use-system-hosts: false` · `fake-ip-range` · 15 条 `fake-ip-filter`。

  - ✅ **明文泄露面实测**（本地 mihomo 内核 + 本机 DNS sink，2026-09-22）：把唯一走明文 UDP 的
    `default-nameserver` 顶到本机 sink 上跑真实解析，**明文 `UDP:53` 只出现在
    `dns.google` / `dns.cloudflare.com` 两个 DoH 端点域名上**（解析端点自身所需的引导），
    业务域名与节点域名全部走 `443` 加密端点。
  - ✅ 四个 DoH 端点按 DNS-over-HTTPS 协议实发查询，均回 `200` + `application/dns-message`。

- 📝 **README 门面化** —— 首页「防泄露原理」整节改为 **DNS 防泄漏能力清单**。README 是产品门面，只讲「得到什么」：明文 `:53` 本地接管不出网 / 本地不做真实解析 / 节点域名独立通道 / 解析器全为加密端点 / 锁死 TUN / 实测零业务域名；不讲机制推导，也不出现内核实现键。
- ✂️ **README 瘦身** —— 首页只讲「是什么」：`dns` 逐键、解析器分工、`respect-rules` 连带要求、实测推导全部下沉 `DetailsReadme`，首页只留结论与指路。
- 🔗 **README「文件结构」改为可点击跳转** —— 原先是 fenced code block 里的目录树，而 GitHub **不解析代码块内的 markdown**，那些路径一个都点不动、只能靠手翻。改为表格（图标 / 路径 / 说明），路径列写成相对链接，点一下直达对应目录或文件。未创建的目录（`icons/`、`docs/`、`skill/`）**不装链接** —— 装了就是 404，改用行内代码并在表下给一句图例。三仓同步同一版式。
- 🧭 **首页下沉规则集信息，新开专题承接** —— 首页原有两处规则集层面的内容：「📋 规则顺序」（表里是 `jinx-white-guard` · `jinx-ads` · `AWAvenue-Ads` · `GEOIP,cn` 这类规则集名与规则类型）与「📚 规则来源」整节（来源仓库清单）。规则集属**实现侧**，读者只关心「能实现怎样的分流」，于是：
  - 📋 「规则顺序」改为 **「分流顺序」** —— 列「匹配什么 → 去向」（白名单域名 / 广告域名 / 内网 / AI 服务 / 国内 / 其余全部），首页不再出现任何规则集文件名；
  - 📚 「规则来源」整节撤下首页；
  - 🆕 新开 [`docs/01-规则集与来源.md`](docs/01-规则集与来源.md) —— 3 份规则集的格式 / 行为 / 去向 / 来源、6 条原生规则、刷新与落盘机制（`path` 先落盘再解析、`interval: 86400`、`.mrs` 格式取舍）、逐条匹配顺序、五条排序约束、素材与许可；
  - 🔗 首页只在「文件结构」与「更多文档」里各留一个入口；
  - ✅ 首页外链随之收敛为**徽章 + 本仓地址**，第三方来源链接全部随之下沉（新增断言守着）。
- 🚧 **顶部「部分发布」口径更新** —— `docs/` 已有首篇专题，不再列为「准备中」。

### 修复

- ✂️ **README 去掉三处跨仓比对 / 跨仓导流** —— 开头「与 Surge · Egern 同构」整句、分流版「组序与 Egern 对齐」、末尾导流两个姊妹仓的「更多文档」整节。
- ✏️ **`fake-ip-filter` 注释写准通配语义** —— 实测（`+.example.com` 命中 `example.com` 本域；`*.lan` 不命中 `a.b.lan`）后改为「`+.` 含本域与任意层子域；`*` / `*.` 只匹配一层」，此前只笼统写「含子域」。
