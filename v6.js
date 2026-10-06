const fs=require('fs');
eval(fs.readFileSync('override/my_clash.js','utf8'));
const out=main({proxies:[{name:'X'}],'proxy-groups':[],rules:[],dns:{}});
const gs=out['proxy-groups'];
const regions=gs.filter(g=>['Hong Kong','Taiwan','Japan','Singapore','United States','Other Regions'].includes(g.name));
const names=['香港 01','台湾 02','日本 JP','新加坡 SG','美国 US','俄罗斯 RU','德国 DE','英国 UK','韩国 KR','剩余流量','官网','洛杉矶 LAX','东京 NRT'];
console.log('地区组互斥性检查：');
let dup=0;
for(const n of names){
  const hit=regions.filter(g=>new RegExp(g.filter).test(n)).map(g=>g.name);
  if(hit.length>1) dup++;
  console.log('  ', n.padEnd(12), '->', hit.length?hit.join(','):'(无)');
}
console.log('\n重叠的节点数:', dup, dup? '⚠️':'✅');
// 悬空引用
const nm=new Set(gs.map(g=>g.name)); const SP=new Set(['DIRECT','REJECT','PASS','GLOBAL']);
let bad=[]; for(const g of gs) for(const p of (g.proxies||[])) if(!nm.has(p)&&!SP.has(p)) bad.push(g.name+'->'+p);
console.log('悬空引用:', bad.length?bad:'无');
