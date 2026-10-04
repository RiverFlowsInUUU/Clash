// ============================================================================
//  my_clash 覆写脚本 — 把任意订阅改造成「自用版」结构
// ============================================================================
//
//  作用
//    对任意 mihomo 订阅配置做整体覆写，使其与本仓库 profiles/my_clash.yaml 一致：
//      · 23 个策略组（Smart / Select / MAX / Fallback + 5 地区组 + 11 应用组）
//      · 20 份 MRS 规则集 + 26 条规则
//      · DNS 双层广告拦截（fake-ip-filter + nameserver-policy rcode://success）
//      · 订阅内的节点直接成为组内成员 —— 不再需要 Airport 订阅组
//
//  与静态模板的唯一区别
//    静态模板用 `use: [Airport]` 引入订阅；本脚本改用 `include-all-proxies: true`，
//    让订阅里已有的 `proxies` 直接入组。二者等价，但后者无需额外订阅槽位。
//
//  用法（Mihomo Party / Mihomo Purity 等支持 JS 覆写的客户端）
//    1) 把本文件放到可访问的 URL（或本地导入）；
//    2) 在客户端的「覆写」中导入，再绑到目标订阅上。
//
//  注意
//    · 本脚本会**整体替换** proxy-groups / rule-providers / rules / dns，
//      订阅自带的同名配置将被丢弃（节点 proxies 保留）；
//    · port / mixed-port 等入站端口不覆盖，交给客户端决定。
// ============================================================================

function main(config) {
  // ── 0. 兜底：确保关键字段存在 ──────────────────────────────────────────
  if (!config.proxies) config.proxies = [];
  if (!config["proxy-groups"]) config["proxy-groups"] = [];
  if (!config["rule-providers"]) config["rule-providers"] = {};

  // 排除「直连」类节点（与静态模板的 nodirect 一致）
  const NODIRECT = "^((?!(直连|DIRECT)).)*$";

  // 通用健康检查参数
  const HC_URL = "https://www.gstatic.com/generate_204";
  const HC_INT = 300;

  // 节点来源开关：
  //   include-all-proxies 引入内联 proxies（订阅转换后的常见形态）；
  //   若订阅额外带了 proxy-providers，则 include-all-proxies 不会包含它们，
  //   此时改用 include-all（= proxies + providers）避免节点成孤儿。
  const HAS_PROVIDERS =
    config["proxy-providers"] && Object.keys(config["proxy-providers"]).length > 0;
  const ALL_KEY = HAS_PROVIDERS ? "include-all" : "include-all-proxies";
  const allNodes = {};
  allNodes[ALL_KEY] = true;

  // ── 1. 策略组 ─────────────────────────────────────────────────────────
  // 说明：
  //   · 用 include-all-proxies 引入订阅的全部节点（等价于静态模板的 use: [Airport]）
  //   · 组间引用走 proxies 字段；节点由 include-all-proxies 注入
  //   · filter 同时作用于 include-all-proxies，故地区组直接靠 filter 筛选
  config["proxy-groups"] = [
    {
      name: "Proxy",
      type: "select",
      proxies: [
        "Fallback", "MAX", "Smart", "Select",
        "HongKong", "Taiwan", "Japan", "Singapore", "United States",
      ],
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png",
    },
    {
      name: "Fallback",
      type: "fallback",
      proxies: ["MAX", "Smart", "Select"],
      url: HC_URL,
      interval: HC_INT,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Bypass.png",
    },
    {
      name: "Smart",
      type: "url-test",
      ...allNodes,
      filter: NODIRECT,
      url: HC_URL,
      interval: HC_INT,
      tolerance: 50,
      "exclude-type": "Direct",
      hidden: true,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Auto.png",
    },
    {
      name: "Select",
      type: "select",
      ...allNodes,
      filter: NODIRECT,
      "exclude-type": "Direct",
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Static.png",
    },
    {
      name: "Anthropic",
      type: "select",
      proxies: ["Taiwan", "Select"],
      icon: "https://raw.githubusercontent.com/RiverFlowsInUUU/Rule/refs/heads/main/appleanthropic.png",
    },
    {
      name: "AI",
      type: "select",
      proxies: ["Taiwan", "Select", "Japan", "Singapore", "United States", "Proxy", "Smart"],
      icon: "https://www.edigitalagency.com.au/wp-content/uploads/new-ChatGPT-icon-black-background-png-2600x2600.png",
    },
    {
      name: "Emby",
      type: "select",
      proxies: ["Select", "Smart", "United States", "Taiwan"],
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Emby.png",
    },
    {
      name: "Google",
      type: "select",
      proxies: ["AI", "Proxy", "HongKong", "Taiwan", "Japan", "Singapore", "United States"],
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google_Search.png",
    },
    {
      name: "YouTube",
      type: "select",
      proxies: ["Proxy", "HongKong", "Taiwan", "Japan", "Singapore", "United States"],
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png",
    },
    {
      name: "YouTube Music",
      type: "select",
      proxies: ["Proxy", "HongKong", "Taiwan", "Japan", "Singapore", "United States", "Select"],
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube_Music.png",
    },
    {
      name: "Spotify",
      type: "select",
      proxies: ["United States", "HongKong", "Taiwan", "Japan", "Singapore"],
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Spotify.png",
    },
    {
      name: "Microsoft",
      type: "select",
      proxies: ["DIRECT", "Proxy", "Taiwan", "Japan", "Singapore", "United States", "Select"],
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Microsoft.png",
    },
    {
      name: "Telegram",
      type: "select",
      proxies: ["Proxy", "HongKong", "Taiwan", "Japan", "Singapore", "United States", "Select"],
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png",
    },
    {
      name: "Apple",
      type: "select",
      proxies: ["DIRECT", "Proxy"],
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple.png",
    },
    {
      name: "Final",
      type: "select",
      proxies: ["Proxy", "HongKong", "Taiwan", "Japan", "Singapore", "United States", "Select", "DIRECT"],
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png",
    },
    {
      name: "HongKong",
      type: "url-test",
      ...allNodes,
      filter: "(?=.*(港|HK|(?i)Hong))^((?!(台|日|韩|新|美)).)*$",
      url: HC_URL,
      interval: HC_INT,
      tolerance: 50,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Hong_Kong.png",
    },
    {
      name: "Japan",
      type: "url-test",
      ...allNodes,
      filter: "(?=.*(日|JP|(?i)Japan))^((?!(港|台|韩|新|美)).)*$",
      url: HC_URL,
      interval: HC_INT,
      tolerance: 50,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Japan.png",
    },
    {
      name: "Singapore",
      type: "url-test",
      ...allNodes,
      filter: "(?=.*(新加坡|坡|狮城|SG|Singapore))^((?!(台|日|韩|深|美)).)*$",
      url: HC_URL,
      interval: HC_INT,
      tolerance: 50,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Singapore.png",
    },
    {
      name: "Taiwan",
      type: "url-test",
      ...allNodes,
      filter: "(?=.*(台|TW|(?i)Taiwan|Tai))^((?!(港|韩|新|美|日)).)*$",
      url: HC_URL,
      interval: HC_INT,
      tolerance: 50,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Taiwan.png",
    },
    {
      name: "United States",
      type: "url-test",
      ...allNodes,
      filter: "(?=.*(美|US|(?i)States|America))^((?!(港|台|韩|新|日)).)*$",
      url: HC_URL,
      interval: HC_INT,
      tolerance: 50,
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/United_States.png",
    },
    {
      name: "Apple Update",
      type: "select",
      proxies: ["REJECT", "PASS", "DIRECT"],
      icon: "https://raw.githubusercontent.com/RiverFlowsInUUU/Rule/main/appleupdateicon.png",
    },
    {
      name: "AD",
      type: "select",
      proxies: ["REJECT", "PASS", "DIRECT"],
      icon: "https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Advertising.png",
    },
    {
      name: "MAX",
      type: "url-test",
      ...allNodes,
      filter: "^(?=.*(0\\.1|0\\.01))((?!剩余|流量|到期|有效).)*$",
      url: HC_URL,
      interval: HC_INT,
      tolerance: 50,
      hidden: true,
      icon: "https://fastly.jsdelivr.net/gh/AIsouler/MyClash@main/Icons/svg/RoundRobin.svg",
    },
  ];

  // ── 2. 规则集（全部 MRS）────────────────────────────────────────────────
  const JS = "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo";
  const rp = config["rule-providers"];

  // 13 个 geosite 域分类
  [
    "apple-update", "spotify", "private", "anthropic", "category-ai-chat-!cn",
    "github", "youtube", "google", "microsoft", "apple", "telegram", "gfw", "cn",
  ].forEach(function (c) {
    rp[c] = {
      type: "http",
      behavior: "domain",
      format: "mrs",
      url: JS + "/geosite/" + c + ".mrs",
      path: "./rule_provider/" + c + ".mrs",
      interval: 86400,
    };
  });

  // 4 个 geoip 分类（IP 兜底用）
  ["private", "google", "telegram", "cn"].forEach(function (c) {
    rp["geoip-" + c] = {
      type: "http",
      behavior: "ipcidr",
      format: "mrs",
      url: JS + "/geoip/" + c + ".mrs",
      path: "./rule_provider/geoip-" + c + ".mrs",
      interval: 86400,
    };
  });

  // 自定义清单（上游没有对应 geosite 分类）
  rp["AWAvenue-Ads"] = {
    type: "http",
    behavior: "domain",
    format: "mrs",
    url: "https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Clash.mrs",
    path: "./rule_provider/AWAvenue-Ads-Rule-Clash.mrs",
    interval: 86400,
  };
  rp["jinx-white-guard"] = {
    type: "http",
    behavior: "classical",
    format: "yaml",
    url: "https://raw.githubusercontent.com/RiverFlowsInUUU/Jinx/main/mihomo-white-guard.yaml",
    path: "./rule_provider/jinx-white-guard.yaml",
    interval: 86400,
  };
  rp["jinx-ads-delta"] = {
    type: "http",
    behavior: "classical",
    format: "yaml",
    url: "https://raw.githubusercontent.com/RiverFlowsInUUU/Jinx/main/mihomo-ads.yaml",
    path: "./rule_provider/jinx-ads-delta.yaml",
    interval: 86400,
  };

  // ── 3. 分流规则 ────────────────────────────────────────────────────────
  config.rules = [
    "RULE-SET,jinx-white-guard,DIRECT",
    "RULE-SET,AWAvenue-Ads,AD",
    "RULE-SET,jinx-ads-delta,AD",
    "RULE-SET,apple-update,Apple Update",
    "DOMAIN-SUFFIX,okemby.org,Emby",
    "DOMAIN-SUFFIX,lilyemby.com,Emby",
    "DOMAIN-SUFFIX,lilyemby.app,Emby",
    "DOMAIN-SUFFIX,bangumi.ca,Emby",
    "RULE-SET,geoip-private,DIRECT,no-resolve",
    "RULE-SET,private,DIRECT",
    "RULE-SET,anthropic,Anthropic",
    "RULE-SET,category-ai-chat-!cn,AI",
    "DOMAIN-SUFFIX,music.youtube.com,YouTube Music",
    "RULE-SET,github,Proxy",
    "RULE-SET,youtube,YouTube",
    "RULE-SET,google,Google",
    "RULE-SET,spotify,Spotify",
    "RULE-SET,microsoft,Microsoft",
    "RULE-SET,apple,DIRECT",
    "RULE-SET,telegram,Telegram",
    "RULE-SET,geoip-google,Google",
    "RULE-SET,geoip-telegram,Telegram",
    "RULE-SET,gfw,Proxy",
    "RULE-SET,cn,DIRECT",
    "RULE-SET,geoip-cn,DIRECT",
    "MATCH,Final",
  ];

  // ── 4. DNS（含双层广告拦截）────────────────────────────────────────────
  // 关键：广告域名必须同时出现在
  //   ① fake-ip-filter  —— 否则 withFakeIP 对 A/AAAA 直接返回假 IP，
  //                        请求永远到不了 nameserver-policy；
  //   ② nameserver-policy = rcode://success —— 返回空回答，DNS 层拦截。
  // 且 nameserver-policy 中广告项必须写在 rule-set:private,cn 之前。
  config.dns = {
    enable: true,
    listen: "0.0.0.0:7874",
    ipv6: true,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "respect-rules": true,
    "use-hosts": true,
    "use-system-hosts": false,
    "prefer-h3": false,

    "default-nameserver": ["223.5.5.5", "119.29.29.29"],

    "direct-nameserver": [
      "https://doh.18bit.cn/dns-query",
      "https://dns.alidns.com/dns-query",
    ],
    "proxy-server-nameserver": [
      "https://doh.18bit.cn/dns-query",
      "https://dns.alidns.com/dns-query",
    ],

    nameserver: [
      "https://dns.cloudflare.com/dns-query",
      "https://dns.google/dns-query",
    ],
    fallback: [
      "https://dns.cloudflare.com/dns-query",
      "https://dns.google/dns-query",
    ],
    "fallback-filter": { geoip: true },

    "nameserver-policy": {
      "rule-set:AWAvenue-Ads": "rcode://success",
      "rule-set:jinx-ads-delta": "rcode://success",
      "rule-set:private,cn": [
        "https://doh.18bit.cn/dns-query",
        "https://dns.alidns.com/dns-query",
      ],
    },

    "fake-ip-filter": [
      "*.lan",
      "*.local",
      "*.localdomain",
      "*.home.arpa",
      "+.msftconnecttest.com",
      "+.msftncsi.com",
      "localhost.ptlogin2.qq.com",
      "+.srv.nintendo.net",
      "+.stun.playstation.net",
      "+.xboxlive.com",
      "stun.*",
      "time.*.com",
      "ntp.*.com",
      "+.pool.ntp.org",
      "+.market.xiaomi.com",
      "rule-set:AWAvenue-Ads",
      "rule-set:jinx-ads-delta",
    ],
  };

  return config;
}
