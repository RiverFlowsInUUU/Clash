<div align="center">

# 🛡️ Clash 配置模板

*让 DNS 无处可漏*

[![Clash](https://img.shields.io/badge/Clash-Meta%20%7C%20mihomo-1f6feb?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![Profiles](https://img.shields.io/badge/Profiles-lazy%20%7C%20routing-0969da?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![Rules](https://img.shields.io/badge/Rules-9-8250df?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![DNS](https://img.shields.io/badge/DNS-Zero%20Leak-2ea043?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![License](https://img.shields.io/badge/License-MIT-dfb317?style=flat-square)](LICENSE)

</div>

🚧 **部分发布** —— 懒人版配置、更新日志、专题文档与技术文档已上线，分流版与审计脚本在准备中。

## 📥 两全其美，皆合心意

🪶 **懒人版** · 至简 · 省心

```
https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/profiles/lazy.min.yaml
```

🧭 **分流版** · 可控 · 随心

🔜 待发布。

## 🧭 井然有序

懒人版 3 组，自上而下：

| 组 | 🪶 懒人版 | 🧭 分流版 |
|:---|:---:|:---:|
| 🚀 `Proxy` | ✅ | - |
| 🤖 `AI` | ✅ | - |
| 🛑 `AD` | ✅ | - |

> 🪶 懒人版含 1 个订阅槽位（`Airport`，换 `url` 即用）与 1 条节点占位，长期沿用无版本号。
> 🔜 分流版（按应用 + 按地区）待发布，组结构与选路见 [DetailsReadme](DetailsReadme/DetailsReadme.md)。

## 📋 分流顺序

流量自上而下匹配，第一条命中即决定去向。

| # | 匹配什么 | 去向 |
|:-:|:-----|:-----|
| 🛡️ | 白名单域名 | `DIRECT` |
| 🚫 | 广告域名 | `AD` |
| 🏠 | 内网地址 | `DIRECT` |
| 🤖 | AI 服务 | `AI` |
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
| 📁 | [`profiles/`](profiles/) | 配置：懒人版 ×2（带注释 / 纯配置）；分流版待发布 |
| 🖼️ | `icons/` | 策略组图标 |
| 📚 | [`docs/`](docs/) | 1 篇专题：规则集与来源 |
| 📘 | [`DetailsReadme/`](DetailsReadme/DetailsReadme.md) | 完整技术文档 |
| 🗓️ | [`CHANGELOG.md`](CHANGELOG.md) | 版本记录 |
| 🧪 | `skill/` | 审计脚本 + 回归测试 |

路径为链接者可直接点开跳转；显示为行内代码者尚未创建。

## 📖 更多文档

- 📘 [`DetailsReadme/`](DetailsReadme/DetailsReadme.md) —— 逐段详解 · 原理推导 · 实测读数 · 已知取舍
- 📚 [`docs/01`](docs/01-规则集与来源.md) —— 规则集与来源
- 🗓️ [`CHANGELOG.md`](CHANGELOG.md)

---

<div align="center">

MIT License · 不绑节点，不绑订阅

</div>
