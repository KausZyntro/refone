const PORT = 9333;
const t = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }).then(r => r.json());
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0; const p = new Map(); const host = "127.0.0.1:3000"; const log = [];
const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const item = {
  id: 555, customer_id: 1, product_id: 4, variant_id: 70, quantity: 1, item_total: 46963.99,
  product: { name: "SERVER CART ITEM", image: "https://pub-5e96f9530a7c4c18bb5736a581da8ede.r2.dev/x.png" },
  variant: [{ storage: "128GB", color: "PINK", images: [{ id: 1, variant_id: 70, image_url: "https://pub-5e96f9530a7c4c18bb5736a581da8ede.r2.dev/x.png" }] }],
  price: { selling_price: "46963.99" },
};
const summaryBody = { status: "SUCCESS", code: "200", message: "ok", data: { cart_items: [item], pricing: { subtotal: 46963.99, delivery_charge: 0, discount: 0, tax: 0, grand_total: 46963.99 } } };
ws.addEventListener("message", async e => {
  const m = JSON.parse(e.data);
  if (m.id && p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); }
  if (m.method === "Fetch.requestPaused") {
    const { requestId, request } = m.params;
    if (/checkout\/summary/.test(request.url)) {
      log.push("MOCK summary -> 200");
      await send("Fetch.fulfillRequest", { requestId, responseCode: 200, responseHeaders: [{ name: "Content-Type", value: "application/json" }, { name: "Access-Control-Allow-Origin", value: "*" }], body: Buffer.from(JSON.stringify(summaryBody)).toString("base64") });
    } else if (/cart\/add/.test(request.url)) {
      log.push("MOCK cart/add -> 200");
      await send("Fetch.fulfillRequest", { requestId, responseCode: 200, responseHeaders: [{ name: "Content-Type", value: "application/json" }, { name: "Access-Control-Allow-Origin", value: "*" }], body: Buffer.from(JSON.stringify({ status: "SUCCESS", code: "200", message: "Added", data: item })).toString("base64") });
    } else {
      await send("Fetch.continueRequest", { requestId });
    }
  }
  if (m.method === "Runtime.exceptionThrown") log.push("EXCEPTION: " + m.params.exceptionDetails.text);
});
await new Promise(r => ws.addEventListener("open", r, { once: true }));
await send("Runtime.enable"); await send("Page.enable");
await send("Fetch.enable", { patterns: [{ urlPattern: "*" , requestStage: "Request" }] });
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
const ev = async e => (await send("Runtime.evaluate", { expression: e, returnByValue: true, awaitPromise: true })).result?.result?.value;
const snap = async label => JSON.stringify({
  label,
  badge: await ev(`document.querySelector('.cart-badge')?.textContent??null`),
  cards: await ev(`document.querySelectorAll('.cart-item-card').length`),
  empty: await ev(`!!document.querySelector('.cart-empty-state')`),
  skeleton: await ev(`!!document.querySelector('.cart-loading')`),
});
await send("Page.navigate", { url: "http://localhost:3000/" });
await sleep(5000);
await ev(`localStorage.setItem('auth',JSON.stringify({token:'test-token',user:{id:1,name:'Cart Test',email:'cart-test@example.com'},expiry:Date.now()+86400000}))`);
await send("Page.navigate", { url: "http://localhost:3000/products/refurbished-iphone-15?variant=70" });
await sleep(7000);
console.log("add:", await ev(`(()=>{const b=[...document.querySelectorAll('button')].find(x=>/add to cart/i.test(x.textContent||'')&&x.getBoundingClientRect().width>0);if(!b)return 'no button';b.click();return 'clicked';})()`));
await sleep(2500);
console.log(await snap("after add"));
await send("Page.reload"); await sleep(7000);
console.log(await snap("after reload product page"));
await send("Page.navigate", { url: "http://localhost:3000/cart" }); await sleep(7000);
console.log(await snap("cart page"));
await send("Page.reload"); await sleep(7000);
console.log(await snap("cart page refresh"));
console.log("guest_cart after:", (await ev(`localStorage.getItem('guest_cart')`) || "").slice(0, 120));
console.log("LOG:", JSON.stringify(log));
ws.close(); process.exit(0);
