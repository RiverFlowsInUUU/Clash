<div align="center">

# 🛡️ Clash 配置模板

**🪶 懒人版 · 🧭 分流版**

*不绑节点，不绑订阅 · 让 DNS 无处可漏*

[![Clash](https://img.shields.io/badge/Clash-Meta%20%7C%20mihomo-1f6feb?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![Profiles](https://img.shields.io/badge/Profiles-lazy%20%7C%20routing-0969da?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![Rules](https://img.shields.io/badge/Rules-%E5%BE%85%E5%8F%91%E5%B8%83-8250df?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![DNS](https://img.shields.io/badge/DNS-Zero%20Leak-2ea043?style=flat-square)](https://github.com/RiverFlowsInUUU/Clash)
[![License](https://img.shields.io/badge/License-MIT-dfb317?style=flat-square)](LICENSE)

</div>

🚧 **尚未发布** —— 本仓目前只有骨架：两份配置、审计脚本与文档都在对标准备中。下面写的是**落地后的形态**，目录与文件**均未上传，暂无可用地址**。

## 📥 两份配置

与 [Surge](https://github.com/RiverFlowsInUUU/Surge) · [Egern](https://github.com/RiverFlowsInUUU/Egern) 同构：懒人版一个出口，分流版按应用 + 按地区。

| 形态 | 计划文件 | 用途 | 状态 |
|:-----|:---------|:-----|:-----|
| 🪶 懒人版 | `profiles/lazy.yaml` · `lazy.min.yaml` | 全部流量走一个出口 | 🔜 待发布 |
| 🧭 分流版 | `profiles/routing.yaml` · `routing.min.yaml` | 先按应用分，再按地区分 | 🔜 待发布 |

🔗 落地后的地址形式（按文件名替换即可）：

```
https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/profiles/<文件>
```

## 🪶 懒人版

🔜 骨架与 Surge / Egern 的懒人版对齐：一个主出口 + AI 独立出口 + 一个手动开关。组数与规则数待定，配置落地后回填。

## 🧭 分流版

🔜 骨架与 Surge / Egern 的分流版对齐：总入口 → 应用组 → 地区组 → 精选 → 兜底，组序与 Egern 对齐。组数与规则数待定，配置落地后回填。

## 📋 规则顺序

📐 拟定顺序（与两个姐妹仓一致），自上而下匹配，第一条命中即决定去向。

| # | 规则 | 去向 |
|:-:|:-----|:-----|
| 🛡️ | 白名单 | `DIRECT` |
| 🚫 | 广告拦截（Jinx + AWAvenue 两条清单） | `REJECT` |
| 🤖 | 按应用 | 对应应用组 |
| 🎮 | 游戏机主机名 | 主出口 |
| 🍎 | Apple 服务 | `DIRECT` |
| 🏠 | 内网 | `DIRECT` |
| 🇨🇳 | 国内域名 · 国内 IP | `DIRECT` |
| 🌐 | 兜底 | 总入口 |

⚠️ 白名单必须留在两条广告清单**之前** —— AWAvenue 与 Jinx 黑名单存在重叠域名，顺序颠倒会把它们误杀。

## 🌐 防泄露原理

明文 `UDP:53` 只有三条出口，与 Surge / Egern 同一套收口思路：

| 出口 | 机制 | 堵法 |
|:----:|:-----|:-----|
| 🚪 引导解析 | DNS 端点写成主机名时，必须先明文解析一次 | 端点写 IP 字面量 |
| 🚪 旁路设备 | 忽略代理 DNS 的设备直接发明文 `:53` | 由 dnsmasq / 内核接管 |
| 🚪 规则触发解析 | 不带 `no-resolve` 的 IP 规则会主动发起解析 | IP 类规则一律带 `no-resolve` |

## 📁 文件结构

```
Clash/
├── 📁 profiles/        # 4 份配置：懒人版 / 分流版 × 带注释 / 纯配置
├── 🖼️ icons/           # 策略组图标
├── 📚 docs/            # 专题文档
├── 📘 DetailsReadme/   # 完整技术文档
├── 🗓️ CHANGELOG.md
└── 🧪 skill/           # 审计脚本 + 回归测试
```

🔜 以上目录尚未创建，仅在 `profiles/` 与文档落地后补齐。

## 📚 规则来源

🔜 与两个姐妹仓同源，落地后逐项回填：

- 🛑 [Jinx](https://github.com/RiverFlowsInUUU/Jinx) —— 广告拦截 · 白名单
- 🍂 [TG-Twilight/AWAvenue-Ads-Rule](https://github.com/TG-Twilight/AWAvenue-Ads-Rule) —— 广告拦截（第二条清单）
- 🧩 [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script) —— 应用规则集
- 🗺️ [adysec/IP_database](https://github.com/adysec/IP_database) —— GeoIP 数据库

## 📖 更多文档

🔜 暂无。文档与配置同步发布；其间的原理与取舍可先看两个姐妹仓：

- 📘 [Surge](https://github.com/RiverFlowsInUUU/Surge) —— DNS 防泄露 · 分流版设计 · 审计读数
- 📘 [Egern](https://github.com/RiverFlowsInUUU/Egern) —— 加固清单 18 项 · 泄露机制推导

---

<div align="center">

MIT License · 不绑节点，不绑订阅

</div>
