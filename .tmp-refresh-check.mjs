const PORT=9333;
const t=await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent("about:blank")}`,{method:"PUT"}).then(r=>r.json());
const ws=new WebSocket(t.webSocketDebuggerUrl);let id=0;const p=new Map();
ws.addEventListener("message",e=>{const m=JSON.parse(e.data);if(m.id&&p.has(m.id)){p.get(m.id)(m);p.delete(m.id);}});
const send=(method,params={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method,params}));});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await new Promise(r=>ws.addEventListener("open",r,{once:true}));
await send("Runtime.enable");await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride",{width:1440,height:1200,deviceScaleFactor:1,mobile:false});
const ev=async e=>(await send("Runtime.evaluate",{expression:e,returnByValue:true,awaitPromise:true})).result?.result?.value;
const clickAdd=()=>ev(`(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Add to Cart'&&x.getBoundingClientRect().width>0);if(!b)return'no button';b.click();return'clicked';})()`);
const snap=async(label)=>JSON.stringify({label,badge:await ev(`document.querySelector('.cart-badge')?.textContent??null`),items:await ev(`document.querySelectorAll('.cart-item-card').length`),empty:await ev(`!!document.querySelector('.cart-empty-state')`),qty:await ev(`document.querySelector('.qty-value')?.textContent`),guest:await ev(`localStorage.getItem('guest_cart')`),txt:await ev(`document.body.innerText.slice(0,180)`)});

// ---------- GUEST ----------
await send("Page.navigate",{url:"http://localhost:3000/"});await sleep(4000);
await ev(`localStorage.removeItem('auth');localStorage.removeItem('guest_cart')`);
await send("Page.navigate",{url:"http://localhost:3000/products/iphone-15"});await sleep(6000);
console.log("guest add:",await clickAdd());await sleep(2200);
console.log("guest before reload:",JSON.stringify({badge:await ev(`document.querySelector('.cart-badge')?.textContent??null`),guest:!!(await ev(`localStorage.getItem('guest_cart')`))}));
// reload the same page (F5)
await send("Page.reload");await sleep(7000);
console.log("guest after reload product:",JSON.stringify({badge:await ev(`document.querySelector('.cart-badge')?.textContent??null`),guest:await ev(`localStorage.getItem('guest_cart')`)}));
await send("Page.navigate",{url:"http://localhost:3000/cart"});await sleep(6000);
console.log("guest cart after reload:",await snap("guest cart page"));
await send("Page.reload");await sleep(6000);
console.log("guest cart after 2nd refresh:",await snap("guest cart refreshed"));

// ---------- LOGGED IN ----------
await send("Page.navigate",{url:"http://localhost:3000/"});await sleep(3500);
await ev(`localStorage.setItem('auth',JSON.stringify({token:'test-token',user:{id:1,name:'Cart Test',email:'cart-test@example.com'},expiry:Date.now()+86400000}));localStorage.removeItem('guest_cart')`);
await send("Page.navigate",{url:"http://localhost:3000/products/iphone-15"});await sleep(6000);
console.log("user add:",await clickAdd());await sleep(2500);
console.log("user before reload:",JSON.stringify({badge:await ev(`document.querySelector('.cart-badge')?.textContent??null`)}));
await send("Page.reload");await sleep(7000);
console.log("user after reload product:",JSON.stringify({badge:await ev(`document.querySelector('.cart-badge')?.textContent??null`)}));
await send("Page.navigate",{url:"http://localhost:3000/cart"});await sleep(7000);
console.log("user cart page:",await snap("user cart page"));
await send("Page.reload");await sleep(7000);
console.log("user cart after 2nd refresh:",await snap("user cart refreshed"));
ws.close();process.exit(0);
