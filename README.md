<div align="center">

<img src="https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/icons/Proxy.png" height="64" alt="Clash">&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/icons/Brand-Cross.png" height="64" alt="">&nbsp;&nbsp;&nbsp;<img src="https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/icons/Auto.png" height="64" alt="">

# 🛡️ Clash 配置模板

殊途同归 · 久用如一

[![Clash](https://img.shields.io/badge/Clash-Meta%20%7C%20mihomo-1f6feb?style=flat-square)](#-两者取一各取所需)
[![Profiles](https://img.shields.io/badge/Profiles-lazy%20%7C%20routing-0969da?style=flat-square)](#-两者取一各取所需)
[![Groups](https://img.shields.io/badge/Groups-3%20%7C%2022-8250df?style=flat-square)](#-井然有序)
[![Rules](https://img.shields.io/badge/Rules-11%20%7C%2027-dc3545?style=flat-square)](#-分流顺序)
[![DNS](https://img.shields.io/badge/DNS-Zero%20Leak-2ea043?style=flat-square)](#-隐私至上--无-dns-泄露)
[![License](https://img.shields.io/badge/License-MIT-dfb317?style=flat-square)](LICENSE)
[![CI](https://github.com/RiverFlowsInUUU/Clash/actions/workflows/ci.yml/badge.svg)](https://github.com/RiverFlowsInUUU/Clash/actions/workflows/ci.yml)

</div>

> 🤖 **AI agent 请从这里开始** → [`skill/SKILL.md`](skill/SKILL.md)：本仓特有的五条铁律，和改完必跑的命令。

## 📥 两者取一，各取所需

| <div align="center">形态</div> | 🪶 懒人版 · 至简 · 省心 | 🧭 分流版 · 可控 · 随心 |
|:--|:--|:--|
| 📄 **静态配置**（下载即用） | [`lazy.min.yaml`](https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/profiles/lazy.min.yaml) | [`routing.min.yaml`](https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/profiles/routing.min.yaml) |
| 🔗 **覆写脚本**（挂到自己的订阅） | [`my_clash_lazy.js`](https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/override/my_clash_lazy.js) | [`my_clash.js`](https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/override/my_clash.js) |

静态配置与脚本是**同一套配置**的两种交付形态 —— 脚本的输出就是静态文件的样子。
只填一个订阅 URL 即可导入，不需要手工补节点。

---

## 🧭 井然有序

🗂️ 各司其职，各安其序，无隙可乘。

| <div align="center">组</div> | 🪶 懒人版 | 🧭 分流版 |
|:---|:---:|:---:|
| 🚀 `Proxy` | ✅ | ✅ |
| ⚡ `Smart` | - | ✅ |
| 🤖 `ChatGPT` · `Gemini` · `Claude` · `AI` | 仅 `AI` | ✅ |
| ▶️ `YouTube` · 🎬 `Emby` · 🔎 `Google`<br>✈️ `Telegram` · 🐦 `Twitter` · 🪟 `Microsoft`<br>🎶 `YouTube Music` · 🎵 `Spotify` | - | ✅ |
| 🍎 `Apple Update` | - | ✅ |
| 🛑 `AD` | ✅ | ✅ |
| 🇭🇰 `Hong Kong` · 🇨🇳 `Taiwan` · 🇯🇵 `Japan`<br>🇸🇬 `Singapore` · 🇺🇸 `United States`<br>🇦🇶 `Other Regions` | - | ✅ |

> 分流版另有 3 个**隐藏**子组 `Low Mult.` / `Auto` / `High Mult.`，是 `Smart` 的倍率分档
> （详见 [🧠 Smart 三档](#-覆写脚本--把任意订阅改造成对应版本)）。两版均带 1 个订阅槽位 `Airport`。

---

## 🔗 覆写脚本 · 把任意订阅改造成对应版本

不想改配置？把脚本挂到自己的订阅上，输出与静态文件逐位一致。

```
# 分流版
https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/override/my_clash.js

# 懒人版
https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/override/my_clash_lazy.js
```

| | 做法 |
|:--|:-----|
| 🔁 **节点来源** | 订阅节点由 `include-all` 直接入组，无需额外订阅槽位 |
| 🛑 **广告拦截前移** | `fake-ip-filter` 让广告域名跳过 fake-ip，`nameserver-policy` 返回 `rcode://success` —— 广告**在 DNS 层就被拦死**，连接根本建立不起来。规则层 `AD` 组保留作兜底 |
| 🧩 **规则集全 MRS** | 25 份远程集（分流版），`rules` 不引用 `GEOSITE` / `GEOIP`，不再依赖 `geosite.dat` |
| 🔒 **IPv6 显式关闭** | 顶层 `ipv6: false` + `dns.ipv6: false`，双栈站点一律回落 IPv4 —— 否则本机真实 IPv6 会绕过 TUN 出网 |

### 🧠 Smart 三档（仅模板，脚本做不到）

`Smart` 是 `fallback`，依次回落到三个隐藏的 `url-test` 子组：

| 子组 | 收什么 | 意涵 |
|:-----|:-------|:-----|
| `Low Mult.` | 倍率 < 1 的节点（`0.01` / `0.1` / `0.5` …） | 最省钱，优先 |
| `Auto` | 正常倍率（节点名无倍率标记） | 常规 |
| `High Mult.` | 倍率 > 1 的节点（`1.5倍` / `2倍` / `3.0x` …） | 最贵，兜底 |

子组靠 `filter` 在**运行时**筛节点，不依赖生成期可见节点名 ——
这正是 provider 订阅下倍率分档只有模板能做到、而脚本做不到的原因。

---

## 📋 分流顺序

流量自上而下匹配，第一条命中即决定去向。

| # | 匹配什么 | 去向 |
|:-:|:-----|:-----|
| 🛡️ | 白名单域名 | `DIRECT` |
| 🚫 | 广告域名 ×2 | `AD` |
| 🍎 | Apple 更新 · Apple 系统服务 | `Apple Update` / `DIRECT` |
| 🏠 | 内网 IP · 内网域名 | `DIRECT` |
| 🤖 | AI 服务（ChatGPT / Gemini / Claude / AI 兜底 + 伴生域） | 各自应用组 |
| 🎶 | YouTube Music | `YouTube Music` |
| 📱 | 应用分流（GitHub / YouTube / Emby / Google / Spotify / Twitter / Microsoft / Telegram） | 各自应用组 |
| 🍎 | Apple 服务 | `DIRECT` |
| 🌐 | Google / Telegram 的 IP 兜底 | 各自应用组 |
| 🇨🇳 | 国内域名 · 国内 IP | `DIRECT` |
| 🌐 | 其余全部 | `Proxy` |

⚠️ 白名单必须留在两条广告清单**之前** —— 两份黑名单存在重叠域名，顺序颠倒会把它们误杀。

---

## 🌐 隐私至上 · 无 DNS 泄露

| | 做法 |
|:--|:--|
| 🚫 应用直发的明文 `:53` | `tun.dns-hijack: any:53` 本地接管，不出网 |
| 🔐 加密通道 | 主解析走 DoH（443），引导端点一律写 IP 字面量 |
| 🛡️ 明文回退 | `default-nameserver` 为引导解析器，其余全为加密端点 |
| 🎭 代理域名 | `enhanced-mode: fake-ip` 只回假 IP，真实解析在落地侧完成 |
| 🧭 节点域名 | `proxy-server-nameserver` 独立通道，不与业务解析混用 |
| ✂️ 规则克制 | IP 类规则一律 `no-resolve`；纯域名规则集**不写** |
| 🔒 路由锁死 | `auto-route` + `strict-route`，绕行无门 |
| 🔎 IPv6 | 显式关闭，杜绝真实 IPv6 绕过 TUN |
| 📋 自检读数 | 4 项门禁 + CI（push 与每周一定时） |

---

## 📁 文件结构

| | 路径 | 内容 |
|:--:|:-----|:-----|
| 📁 | [`profiles/`](profiles/) | 配置：懒人版 ×2 + 分流版 ×2（各带注释 / 纯配置） |
| 🔗 | [`override/`](override/) | JS 覆写脚本：分流版 `my_clash.js` + 懒人版 `my_clash_lazy.js` |
| 📦 | [`rules/`](rules/) | 本仓自托管规则集：`emby` / `apple_system` / `AI_Domains` |
| 🖼️ | [`icons/`](icons/) | 策略组图标 |
| 🧪 | [`skill/`](skill/SKILL.md) | 维护手册 + 4 项门禁（脚本/静态对拍 · 结构 · min 版一致 · 远程 URL 存活） |
| ⚙️ | [`.github/`](.github/workflows/ci.yml) | CI：push 与每周一自动跑全部门禁 |
| 📚 | [`docs/`](docs/) | 专题：规则集与来源 |
| 📘 | [`DetailsReadme/`](DetailsReadme/DetailsReadme.md) | 完整技术文档 |
| 🗓️ | [`CHANGELOG.md`](CHANGELOG.md) | 版本记录 |

---

## 📖 按需查阅

操作手册、逐键语义与审计判据已全部整合进 [`skill/SKILL.md`](skill/SKILL.md)。

---

<div align="center">

🐈 让 DNS 无处可漏 · MIT License

</div>
