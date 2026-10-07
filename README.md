<div align="center">

# 🛡️ Clash 配置模板

*让 DNS 无处可漏*

[![Clash](https://img.shields.io/badge/Clash-Meta%20%7C%20mihomo-1f6feb?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![Profiles](https://img.shields.io/badge/Profiles-lazy%20%7C%20routing-0969da?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![Rules](https://img.shields.io/badge/Rules-All%20MRS-8250df?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![DNS](https://img.shields.io/badge/DNS-Zero%20Leak-2ea043?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![License](https://img.shields.io/badge/License-MIT-dfb317?style=flat-square)](LICENSE)
[![CI](https://github.com/RiverFlowsInUUU/Clash/actions/workflows/ci.yml/badge.svg)](https://github.com/RiverFlowsInUUU/Clash/actions/workflows/ci.yml)

</div>

## 📥 两者取一，各取所需

🪶 **懒人版** · 至简 · 省心

```
https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/profiles/lazy.min.yaml
```

不想改配置？用覆写脚本挂到自己的订阅上，输出与本文件一致：

```
https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/override/my_clash_lazy.js
```

🧭 **分流版** · 可控 · 随心

```
https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/profiles/routing.min.yaml
```


## 🧭 井然有序

懒人版 3 组、分流版 25 组，自上而下：

| 组 | 🪶 懒人版 | 🧭 分流版 |
|:---|:---:|:---:|
| 🚀 `Proxy` | ✅ | ✅ |
| 🧠 `Smart` | - | ✅ |
| 🎯 `Select`（手动） | - | - |
| 🤖 `AI` | ✅ | ✅ |
| 🛑 `AD` | ✅ | ✅ |
| 📱 应用组（Claude / AI / YouTube / Spotify …） | - | ✅ ×10 |
| 🌍 地区组（香港 / 美国 / 日本 …） | - | ✅ ×6 |
| 🧩 `Final` | - | - |

> 🪶 懒人版含 1 个订阅槽位（`Airport`，换 `url` 即用）与 2 条节点占位，长期沿用无版本号。
> 🧭 分流版按应用 + 按地区选路，组结构与选路见 [DetailsReadme](DetailsReadme/DetailsReadme.md)。

## 🔗 覆写脚本 · 把任意订阅改造成分流版

分流版配置 [`profiles/routing.yaml`](profiles/routing.yaml) 即由本脚本生成，
两者结构**逐位一致**（20 个策略组 / 20 份规则集 / 26 条规则）。

想让**自己的订阅**也长成这样，不必手动改配置 —— 挂上脚本即可：

```
https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/override/my_clash.js
```

| | 做法 |
|:--|:-----|
| 🛑 **广告拦截前移** | `fake-ip-filter` 让广告域名跳过 fake-ip，`nameserver-policy` 对其返回 `rcode://success`；广告**在 DNS 层就被拦死**，连接根本建立不起来。规则层 `AD` 组保留作兜底（IP 直连 / DoH / 缓存解析） |
| 🧩 **规则集全 MRS** | 20 份 `.mrs` / 远程集合，`rules` 不引用 `GEOSITE` / `GEOIP` |
| ⚡ **倍率优先** | `Smart` 为 `fallback`，成员按节点名里的倍率升序排列（0.01 → 0.1 → 0.5 → 正常），脚本动态算出 |
| 🔗 **节点来源** | `include-all-proxies`（订阅节点直接入组，无需额外槽位）；若订阅带 `proxy-providers` 则自动改用 `include-all` |

> ⚠️ 双层广告拦截有个**必要条件**：`nameserver-policy` 里返回 `rcode` 的域名，**必须同时在 `fake-ip-filter` 中列一遍**。
> 否则 `withFakeIP` 中间件对 A / AAAA 查询直接返回假 IP，请求永远到不了 `nameserver-policy`。
> 另：广告 policy 必须写在 `rule-set:private,cn` **之前**，否则先命中 `cn` 就拿不到空回答。
> 机制推导见 [Discussion #668](https://github.com/MetaCubeX/mihomo/discussions/668)。
>
> 📖 脚本用法与实测读数见 [`override/`](override/README.md)。

## 📋 分流顺序

流量自上而下匹配，第一条命中即决定去向。

| # | 匹配什么 | 去向 |
|:-:|:-----|:-----|
| 🛡️ | 白名单域名 | `DIRECT` |
| 🚫 | 广告域名 | `AD` |
| 🏠 | 内网地址 | `DIRECT` |
| 🤖 | AI 服务（OpenAI / Gemini / Claude / AI 全家桶） | 各自应用组 |
| 📱 | 应用分流（Spotify / YouTube / GitHub / Google …） | 各自应用组 |
| 🍎 | Apple 服务（分流版全量） | `DIRECT` |
| 💬 | 微信 | `DIRECT` |
| 🇨🇳 | 国内域名 · 国内 IP | `DIRECT` |
| 🌐 | 其余全部 | `Proxy` |

⚠️ 白名单必须留在两条广告清单**之前** —— 两份黑名单存在重叠域名，顺序颠倒会把它们误杀。


## 🌐 隐私至上 · 无 DNS 泄露

不依赖系统 DNS 设置 —— 明文查询在这一层就断掉。

| | |
|:--|:--|
| 🚫 应用直发的明文 `:53` | 本地接管，不出网 |
| 🎭 代理域名 | 本地不做真实解析，解析在落地侧完成 |
| 🧭 节点域名 | 独立解析通道，不与业务解析混用 |
| 🔐 解析器 | 全部为加密端点（DoH） |
| 🔒 路由 | 锁死 TUN，绕行无门 |
| 📋 实测 | 明文查询清单中零业务域名 |

> 🔍 逐条推导、逐键说明与完整实测读数见 [`DetailsReadme`](DetailsReadme/DetailsReadme.md)。

## 📁 文件结构

| | 路径 | 内容 |
|:--:|:-----|:-----|
| 📁 | [`profiles/`](profiles/) | 配置：懒人版 ×2 + 分流版 ×2（各带注释 / 纯配置） |
| 🔗 | [`override/`](override/my_clash.js) | JS 覆写脚本：分流版 `my_clash.js` + 懒人版 `my_clash_lazy.js`，把任意订阅改造成对应结构 |
| 🖼️ | [`icons/`](icons/) | 策略组图标（本仓自带，与姊妹仓 [Self-Configuration](https://github.com/RiverFlowsInUUU/Self-Configuration/tree/main/icons) 同源） |
| 📚 | [`docs/`](docs/) | 1 篇专题：规则集与来源 |
| 📘 | [`DetailsReadme/`](DetailsReadme/DetailsReadme.md) | 完整技术文档 |
| 🗓️ | [`CHANGELOG.md`](CHANGELOG.md) | 版本记录 |
| 🧪 | [`skill/`](skill/SKILL.md) | 维护手册 + 4 项门禁（脚本/静态对拍 · 结构 · min 版一致 · 远程 URL 存活） |
| ⚙️ | [`.github/`](.github/workflows/ci.yml) | CI：push 与每周一自动跑全部门禁 |

路径为链接者可直接点开跳转；显示为行内代码者尚未创建。

## 📖 更多文档

- 📘 [`DetailsReadme/`](DetailsReadme/DetailsReadme.md) —— 逐段详解 · 原理推导 · 实测读数 · 已知取舍
- 📚 [`docs/01`](docs/01-规则集与来源.md) —— 规则集与来源
- 🗓️ [`CHANGELOG.md`](CHANGELOG.md)

---

<div align="center">

MIT License · 不绑节点，不绑订阅

</div>
