// ============================================================================
//  my_clash 覆写脚本 — 把任意订阅改造成「自用版」结构
// ============================================================================
//
//  作用
//    对任意 mihomo 订阅配置做整体覆写，使其与本仓库 profiles/my_clash.yaml 一致：
//      · 22 个策略组（Smart / Select / MAX / Fallback + 5 地区组 + 12 应用组）
//      · 20 份规则集（17 份 MRS + 3 份 yaml）+ 26 条规则
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

  // 规则集整体重建：订阅自带的 rule-providers 一律丢弃，
  // 只保留本脚本定义的 20 份（避免残留无用 provider 与命名冲突）。
  config["rule-providers"] = {};

  // 节点筛选（官方 groupbase.go 的 GetProxies 中依次应用）：
  //   filter          —— 正向保留，作用于 include-all-proxies
  //   exclude-filter  —— 反向排除，作用于 include-all-proxies
  //   exclude-type    —— 按节点类型排除，仅作用于 proxies 字段
  // 这里用 filter 排掉「直连」类，用 exclude-filter 排掉机场常见的
  // 「剩余流量 / 套餐到期 / 官网」等信息节点（它们不可用，会污染测速池）。
  const NODIRECT = "^((?!(直连|DIRECT)).)*$";
  const NOJUNK = "剩余|流量|到期|过期|官网|订阅|重置|续费|Traffic|Expire|GB";

  // 通用健康检查参数
  const HC_URL = "https://www.gstatic.com/generate_204";
  const HC_INT = 300;

  // 图标基址（本仓库自带 icons/，与姊妹仓 Self-Configuration 同源）
  const ICON = "https://raw.githubusercontent.com/RiverFlowsInUUU/Clash/main/icons/";

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
        "Hong Kong", "Taiwan", "Japan", "Singapore", "United States",
      ],
      icon: ICON + "Proxy.png",
    },
    {
      name: "Fallback",
      type: "fallback",
      proxies: ["MAX", "Smart", "Select"],
      url: HC_URL,
      interval: HC_INT,
      icon: ICON + "Auto.png",
    },
    {
      name: "Smart",
      type: "url-test",
      ...allNodes,
      filter: NODIRECT,
      "exclude-filter": NOJUNK,
      url: HC_URL,
      interval: HC_INT,
      tolerance: 50,
      hidden: true,
      icon: ICON + "Auto.png",
    },
    {
      name: "Select",
      type: "select",
      ...allNodes,
      filter: NODIRECT,
      "exclude-filter": NOJUNK,
      icon: ICON + "Auto.png",
    },
    {
      name: "Anthropic",
      type: "select",
      proxies: ["Taiwan", "Select"],
      icon: ICON + "claude-color.png",
    },
    {
      name: "AI",
      type: "select",
      proxies: ["Taiwan", "Select", "Japan", "Singapore", "United States", "Proxy", "Smart"],
      icon: ICON + "grok.png",
    },
    {
      name: "YouTube",
      type: "select",
      proxies: ["Proxy", "Hong Kong", "Taiwan", "Japan", "Singapore", "United States"],
      icon: ICON + "YouTube.png",
    },

    {
      name: "Emby",
      type: "select",
      proxies: ["Select", "Smart", "United States", "Taiwan"],
      icon: ICON + "Emby.png",
    },

    {
      name: "Google",
      type: "select",
      proxies: ["AI", "Proxy", "Hong Kong", "Taiwan", "Japan", "Singapore", "United States"],
      icon: ICON + "Google.png",
    },

    {
      name: "Telegram",
      type: "select",
      proxies: ["Proxy", "Hong Kong", "Taiwan", "Japan", "Singapore", "United States", "Select"],
      icon: ICON + "Telegram.png",
    },

    {
      name: "YouTube Music",
      type: "select",
      proxies: ["Proxy", "Hong Kong", "Taiwan", "Japan", "Singapore", "United States", "Select"],
      icon: ICON + "YouTubeMusic.png",
    },

    {
      name: "Spotify",
      type: "select",
      proxies: ["United States", "Hong Kong", "Taiwan", "Japan", "Singapore"],
      icon: ICON + "Spotify.png",
    },

    {
      name: "Twitter",
      type: "select",
      proxies: ["Proxy", "Hong Kong", "Taiwan", "Japan", "Singapore", "United States", "Select"],
      icon: "https://raw.githubusercontent.com/RiverFlowsInUUU/Self-Configuration/main/icons/Twitter.png",
    },

    {
      name: "Microsoft",
      type: "select",
      proxies: ["DIRECT", "Proxy", "Taiwan", "Japan", "Singapore", "United States", "Select"],
      icon: ICON + "Microsoft.png",
    },
    {
      name: "Hong Kong",
      type: "url-test",
      ...allNodes,
      filter: "(?=.*(港|HK|(?i)Hong))^((?!(台|日|韩|新|美)).)*$",
      url: HC_URL,
      interval: HC_INT,
      tolerance: 50,
      icon: ICON + "HongKong.png",
    },

    {
      name: "Taiwan",
      type: "url-test",
      ...allNodes,
      filter: "(?=.*(台|TW|(?i)Taiwan|Tai))^((?!(港|韩|新|美|日)).)*$",
      url: HC_URL,
      interval: HC_INT,
      tolerance: 50,
      icon: ICON + "Taiwan.png",
    },

    {
      name: "Japan",
      type: "url-test",
      ...allNodes,
      filter: "(?=.*(日|JP|(?i)Japan))^((?!(港|台|韩|新|美)).)*$",
      url: HC_URL,
      interval: HC_INT,
      tolerance: 50,
      icon: ICON + "Japan.png",
    },

    {
      name: "Singapore",
      type: "url-test",
      ...allNodes,
      filter: "(?=.*(新加坡|坡|狮城|SG|Singapore))^((?!(台|日|韩|深|美)).)*$",
      url: HC_URL,
      interval: HC_INT,
      tolerance: 50,
      icon: ICON + "Singapore.png",
    },

    {
      name: "United States",
      type: "url-test",
      ...allNodes,
      filter: "(?=.*(美|US|(?i)States|America))^((?!(港|台|韩|新|日)).)*$",
      url: HC_URL,
      interval: HC_INT,
      tolerance: 50,
      icon: ICON + "UnitedStates.png",
    },
    {
      name: "Apple Update",
      type: "select",
      proxies: ["REJECT", "PASS", "DIRECT"],
      icon: ICON + "AppleUpdate.png",
    },
    {
      name: "AD",
      type: "select",
      proxies: ["REJECT", "PASS", "DIRECT"],
      icon: ICON + "AdBlock.png",
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
      icon: ICON + "Auto.png",
    },
  ];

  // ── 2. 规则集（全部 MRS）────────────────────────────────────────────────
  const JS = "https://cdn.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@meta/geo";
  const rp = config["rule-providers"];

  // 13 个 geosite 域分类
  [
    "apple-update", "spotify", "private", "anthropic", "category-ai-chat-!cn",
    "github", "youtube", "google", "microsoft", "apple-cn", "telegram", "twitter",
    "cn",
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
    url: "https://raw.githubusercontent.com/RiverFlowsInUUU/Jinx/main/mihomo-direct.yaml",
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
    "RULE-SET,twitter,Twitter",
    "RULE-SET,microsoft,Microsoft",
    "RULE-SET,apple-cn,DIRECT",
    "RULE-SET,telegram,Telegram",
    "RULE-SET,geoip-google,Google",
    "RULE-SET,geoip-telegram,Telegram",
    "RULE-SET,cn,DIRECT",
    "RULE-SET,geoip-cn,DIRECT",
    "MATCH,Proxy",
  ];

  // ── 4. DNS（含双层广告拦截）────────────────────────────────────────────
  // 关键：广告域名必须同时出现在
  //   ① fake-ip-filter  —— 否则 withFakeIP 对 A/AAAA 直接返回假 IP，
  //                        请求永远到不了 nameserver-policy；
  //   ② nameserver-policy = rcode://success —— 返回空回答，DNS 层拦截。
  // 且 nameserver-policy 中广告项必须写在 rule-set:private,cn 之前。
  config.dns = {
    enable: true,
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
