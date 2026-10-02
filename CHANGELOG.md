# 更新日志

本文件按 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范编写。

---

## 2026-10-02

### 新增

- 🧭 **分流版配置落地** —— `profiles/routing.yaml`（带注释）/ `profiles/routing.min.yaml`（纯配置）：
  - 🧩 **24 个策略组**：`Proxy`（总入口）· `Smart`（全节点池 url-test 自动择优）·
    12 个应用组（ChatGPT / Gemini / Claude / AI / Spotify / YouTubeMusic / YouTube /
    GitHub / Google / Microsoft / Telegram / Twitter）· `WeChat` · `AD` ·
    7 个地区组（Hong Kong / USA / Japan / Taiwan / Singapore / Korea / Other Regions）· `Final`；
  - 📋 **22 条规则**，自上而下：白名单 → 广告拦截 ×2 → 内网 ×2 → AI 厂商 ×3 → AI 兜底 →
    媒体 ×3 → 开发 ×3 → 社交 ×2 → Apple 全量直连 → 微信 → 国内 → 兜底；
  - 🧬 **结构对照 Self-Configuration 仓库 routing_v4.0.2**：组分工、占位节点（Node-A → Proxy、
    Node-B → AI）、地区组关键词、应用组默认取向逐项对齐；差异只在 mihomo 能力边界
    （见下方「变更」）。

### 变更

- 🌐 **懒人版规则选型升级为 GEOSITE 优先** —— `lazy.yaml` 重写，规则集由 3 份远程 + 6 条原生
  升级为「GEOSITE 优先 → MRS → 传统规则集」三级选型（与分流版同口径）：
  - 白名单 / 广告清单维持远程（Jinx 自托管 + AWAvenue 的 .mrs）；
  - AI 分流由 `GEOSITE,category-ai-chat-!cn` 承接，伴生域/宽后缀整合集收敛进数据库；
  - 规则数 9 → 11 条（补 Apple 系统服务直连 + AI 分流拆两条）。
- 🪶 **懒人版 Proxy 组改为 url-test 自动择优** —— 对齐蓝图的 smart 组语义：
  主出口按延迟自动选优，无需手动管；AI 组维持 select 手动钉死（账号风控对出口跳变敏感）。
- ✈️ **占位节点协议由 vless 改为 hysteria2** —— 与 Self-Configuration 双内核的占位节点同协议
  （`password` ≙ Egern 的 `auth` ≙ Surge 的 `password`），占位节点数 1 → 2
  （Node-A 归 Proxy、Node-B 归 AI）。
- 🖼️ **策略组图标统一引用姊妹仓的 `icons/`** —— 27 处（分流 24 + 懒人 3）从
  Qure / lobe-icons 的外链改为 [Self-Configuration · icons](https://github.com/RiverFlowsInUUU/Self-Configuration/tree/main/icons)
  （29 个图标，与两仓组名一一对应）。换的三个原因：
  ① 原先外链里 `UnitedStates.png` / `WorldMap.png` 两个文件名在 Qure 目录**不存在**（实测 404，
  面板上显示破图），正确名是 `United_States.png` / `World_Map.png`；
  ② lobe-icons 没有 `grok` / `gemini-color` / `claude-color` 这类，隔壁仓现成；
  ③ 两仓图标同源，风格统一，且省掉一份外部依赖。
  ⚠️ 教训：外部图标 URL 必须逐个 HEAD 实测 —— **404 在面板上表现为破图，语法校验发现不了**。
- 📌 **`proxies` / `proxy-providers` 提到配置文件最顶部** —— 两份配置统一为
  `proxies → proxy-providers → proxy-groups → rule-providers → rules → dns → tun`：
  导入前必改的两处（占位节点、订阅地址）开箱就在第一屏，不用翻到文件末尾。
- 🧩 **12 个应用组改为「订阅节点摊平」** —— ChatGPT / Gemini / Claude / AI / Spotify /
  YouTubeMusic / YouTube / GitHub / Google / Microsoft / Telegram / Twitter 全部补
  `use: [Airport]`，把订阅里的**节点**逐个拉进组当成员（首项仍是各自的默认取向）。
  效果对齐蓝本的 `flatten: true`（Egern）/ `include-other-group`（Surge）：面板上直接选节点，
  不用再点进 `Proxy` 组一层。实测印证：`use` 引入 3 个订阅节点后，组员 = `["Proxy", "T-Node-1",
  "T-Node-2", "T-Node-3"]`。
  ⚠️ mihomo **没有 `flatten` 字段**（那是 Egern 的概念），等价物就是 `use` ——
  上一版误用 `include-all-proxies: true`，且把它插在 `proxies:` 与列表项之间，
  把 12 个组写成了非法 YAML（`proxies:` 空值 + 悬空的 `- Proxy`），`routing.yaml` 无法加载。
- 🌐 **规则集换到 GeoSite.dat 原生类别，全部移除 blackmatrix7** —— Gemini / Claude /
  YouTubeMusic / WeChat 四类原先挂在 blackmatrix7 的 classical YAML 上，而该仓应用类目的
  最后更新停在 **2025-06-17**（`Surge/Anthropic` 更是 2024-02-02），已明显滞后。
  逐条解析 `geosite.dat`（1552 个类别）后改为：
  - `google-gemini`（46 条）→ `Gemini` 组；
  - `anthropic`（8 条）→ `Claude` 组；
  - YouTube Music：`geosite.dat` 确无独立类别，改用一条内联 `DOMAIN-SUFFIX,music.youtube.com`
    （它是 `youtube.com` 的子域，必须排在 `GEOSITE,youtube` 之前才不被抢走）；
  - WeChat：同样**没有独立类别**，先退到 `tencent`（683 条），随后换成远程 `.mrs`（见下条）。
  ⇒ 分流版远程规则集 **7 份 → 3 份**（`jinx-white-guard` / `jinx-ads` / `AWAvenue-Ads`）。
  ⚠️ 教训：`geosite.dat` 的类别名是**全大写**（`GOOGLE-GEMINI` / `ANTHROPIC` / `TENCENT`），
  用小写比对会把已有类别误判成「不存在」—— 这正是上一版绕道第三方的根因。
- 💬 **`WeChat` 组改用微信专属 `.mrs`（`Lanlan-WeChat`），不再用 `GEOSITE,tencent`** ——
  `MetaCubeX/meta-rules-dat` 的 `geo/geosite` 目录共 1904 个类别，逐个核过：
  `wechat` / `weixin` / `wx*` **一个都没有**；最接近的 `tencent`（682 条）是靠 `+.qq.com`
  泛化兜住微信的，微信专属域名在里头只有 10 条 —— 走它等于把 QQ / 腾讯云 / 腾讯视频
  一并拖进 `WeChat` 组。现改用 30 条纯微信域名的 `.mrs`：
  - **源**：[Lanlan13-14/Rules](https://github.com/Lanlan13-14/Rules) · `rules/Domain/WeChat.mrs`。
    横向比过 `Keviin560/Shunt_Rules`、`7ac9d42/Rules`（两家内容同源）、`ACL4SSR/ACL4SSR`
    （只有 `.list`、不提供 `.mrs`）；选 `Lanlan13-14` 是因为它被第三方配置模板引用最广；
  - **规则**：`- GEOSITE,tencent,WeChat` → `- RULE-SET,Lanlan-WeChat,WeChat`，位置不变
    （仍排在 `GEOSITE,cn` 之前，微信域名同属 `cn` 类，靠前才能先被摘出来）；
  - **实测**：`type: http` + `format: mrs` 加载后 `ruleCount = 30`、`behavior = Domain`、
    `vehicle = HTTP`；远程规则集 3 份 → **4 份**。
  ⚠️ 教训：找社区规则集别手工试三家就下「全社区没有」的结论 ——
  `gh search code "WeChat.mrs"` 一行扫出全部候选，抽样必然漏。

### 已知取舍

- ⚠️ **mihomo 无低倍率优先加权** —— Surge 的 `policy-priority` / Egern 的 `priorities` 能按节点名
  里的倍率标记给低倍率节点软加权，mihomo 的 url-test 没有对应机制。本配置选择「纯延迟择优」，
  想要低倍率优先可给对应组补 `filter` 硬筛（代价：硬过滤非软偏好，低倍率节点延迟再高也不让位）。
- ⚠️ **`WeChat` 组的语义是「腾讯」** —— `geosite.dat` 无独立 `wechat` 类，退用 `tencent`（683 条），
  因此腾讯全家桶（QQ / 腾讯视频 / 腾讯云）都会落进 `WeChat` 组。出口同为直连，扩宽无害；
  但它不再只是「微信」。

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
