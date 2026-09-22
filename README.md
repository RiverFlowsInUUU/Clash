<div align="center">

# 🛡️ Clash 配置模板

**🪶 懒人版 · 🧭 分流版**

*不绑节点，不绑订阅 · 让 DNS 无处可漏*

[![Clash](https://img.shields.io/badge/Clash-Meta%20%7C%20mihomo-1f6feb?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![Profiles](https://img.shields.io/badge/Profiles-lazy%20%7C%20routing-0969da?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![Rules](https://img.shields.io/badge/Rules-9-8250df?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![DNS](https://img.shields.io/badge/DNS-Zero%20Leak-2ea043?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![License](https://img.shields.io/badge/License-MIT-dfb317?style=flat-square)](LICENSE)

</div>

🚧 **部分发布** —— 懒人版配置、更新日志与技术文档已上线，分流版、专题文档与审计脚本在准备中。

## 📥 两份配置

🪶 **懒人版** · 一个出口

```
https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/profiles/lazy.min.yaml
```

🧭 **分流版** · 按应用 + 按地区

🔜 待发布。

选中一条，点右上角复制 → 客户端的「从 URL 导入 / 新建配置」→ 粘贴。

## 🪶 懒人版

`profiles/lazy.yaml` · `profiles/lazy.min.yaml`

3 组 / 9 条规则。全部流量走一个出口。

| | |
|:--|:--|
| ✈️ 节点 | `proxies` 里一条 vless + reality 占位 |
| 📡 订阅 | `Airport` —— `proxy-providers` 订阅槽位，换掉 `url` 即用 |
| 🧭 `Proxy` | 主出口 |
| 🤖 `AI` | AI 流量独立出口 |
| 🛑 `AD` | 手动开关（`REJECT` / `PASS` / `DIRECT`） |

## 🧭 分流版

🔜 待发布。结构：总入口 → 应用组 → 地区组 → 精选 → 兜底；组数与规则数待配置落地后回填。

## 📋 规则顺序

懒人版自上而下匹配，第一条命中即决定去向。

| # | 规则 | 去向 |
|:-:|:-----|:-----|
| 🛡️ | 白名单 `jinx-white-guard` | `DIRECT` |
| 🚫 | 广告拦截 `jinx-ads` | `AD` |
| 🚫 | 广告拦截 `AWAvenue-Ads` | `AD` |
| 🏠 | 内网 `GEOIP,private` · `GEOSITE,private` | `DIRECT` |
| 🤖 | AI 域名 `GEOSITE,category-ai-chat-!cn` | `AI` |
| 🇨🇳 | 国内域名 `GEOSITE,cn` · 国内 IP `GEOIP,cn` | `DIRECT` |
| 🌐 | 兜底 `MATCH` | `Proxy` |

⚠️ 白名单必须留在两条广告清单**之前** —— AWAvenue 与 Jinx 黑名单存在重叠域名，顺序颠倒会把它们误杀。

## 🌐 DNS 防泄漏

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
| 📚 | `docs/` | 专题文档 |
| 📘 | [`DetailsReadme/`](DetailsReadme/DetailsReadme.md) | 完整技术文档 |
| 🗓️ | [`CHANGELOG.md`](CHANGELOG.md) | 版本记录 |
| 🧪 | `skill/` | 审计脚本 + 回归测试 |

路径为链接者可直接点开跳转；显示为行内代码者尚未创建。

## 📚 规则来源

- 🛑 [Jinx](https://github.com/RiverFlowsInUUU/Jinx) —— 广告拦截 · 白名单
- 🍂 [TG-Twilight/AWAvenue-Ads-Rule](https://github.com/TG-Twilight/AWAvenue-Ads-Rule) —— 广告拦截（第二条，**`.mrs` 版**）
- 🗺️ [MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat) —— `GEOIP` · `GEOSITE` 数据库
- 🧩 [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script) —— 应用规则集（分流版待用）
- 🎨 [Koolson/Qure](https://github.com/Koolson/Qure) · [lobehub/lobe-icons](https://github.com/lobehub/lobe-icons) —— 策略组图标

---

<div align="center">

MIT License · 不绑节点，不绑订阅

</div>
