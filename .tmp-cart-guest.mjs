const PORT = 9333;
const t = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }).then(r => r.json());
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0; const p = new Map();
ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
await new Promise(r => ws.addEventListener("open", r, { once: true }));
await send("Runtime.enable"); await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
const ev = async e => (await send("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true })).result?.result?.value;

await send("Page.navigate", { url: "http://localhost:3000/" });
await sleep(4000);
await ev(`localStorage.removeItem('auth');localStorage.removeItem('guest_cart')`);
await send("Page.navigate", { url: "http://localhost:3000/products/refurbished-iphone-15?variant=70" });
await sleep(6000);
console.log("add click:", await ev(`(()=>{const b=[...document.querySelectorAll('button')].find(x=>/add to cart/i.test(x.textContent||'')&&x.getBoundingClientRect().width>0);if(!b)return 'no button';b.click();return 'clicked';})()`));
await sleep(2500);
console.log("before reload:", JSON.stringify({
  badge: await ev(`document.querySelector('.cart-badge')?.textContent??null`),
  guest: (await ev(`localStorage.getItem('guest_cart')`) || "").slice(0, 300),
}));
await send("Page.reload");
await sleep(7000);
console.log("after reload (same page):", JSON.stringify({
  badge: await ev(`document.querySelector('.cart-badge')?.textContent??null`),
  guest: (await ev(`localStorage.getItem('guest_cart')`) || "").slice(0, 300),
}));
await send("Page.navigate", { url: "http://localhost:3000/cart" });
await sleep(6000);
console.log("cart page:", JSON.stringify({
  cards: await ev(`document.querySelectorAll('.cart-item-card').length`),
  empty: await ev(`!!document.querySelector('.cart-empty-state')`),
  guest: (await ev(`localStorage.getItem('guest_cart')`) || "").slice(0, 300),
  text: await ev(`document.body.innerText.slice(0,200)`),
}));
await send("Page.reload");
await sleep(6000);
console.log("cart page 2nd refresh:", JSON.stringify({
  cards: await ev(`document.querySelectorAll('.cart-item-card').length`),
  empty: await ev(`!!document.querySelector('.cart-empty-state')`),
  guest: (await ev(`localStorage.getItem('guest_cart')`) || "").slice(0, 300),
  text: await ev(`document.body.innerText.slice(0,200)`),
}));
ws.close(); process.exit(0);
