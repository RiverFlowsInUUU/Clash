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

- 📝 **README 同步重写** —— 「防泄露原理」按 mihomo 自身机制（TUN 收口 + fake-ip + 解析器分离）重写，并补四个解析器键的分工表。

### 修复

- ✂️ **README 去掉三处跨仓比对 / 跨仓导流** —— 开头「与 Surge · Egern 同构」整句、分流版「组序与 Egern 对齐」、末尾导流两个姊妹仓的「更多文档」整节。
