const fs=require('fs');
eval(fs.readFileSync('override/my_clash.js','utf8'));
const out=main({proxies:[{name:'X'}],'proxy-groups':[],rules:[],dns:{}});
const gs=out['proxy-groups'];
console.log('组数',gs.length);
console.log(gs.map(g=>g.name).join(' | '));
const o=gs.find(g=>g.name==='Other Regions');
console.log('\nOther Regions:', JSON.stringify(o,null,1));
// 测负向断言
const re=new RegExp(o.filter);
const cases=['香港 01','台湾 02','日本 JP','新加坡 SG','美国 US','俄罗斯 RU','德国 DE','英国 UK','剩余流量','官网','倍率 1x','韩国 KR'];
console.log('\n--- filter 判别测试 ---');
for(const c of cases) console.log('  ', (re.test(c)?'命中  ':'排除  '), c);
