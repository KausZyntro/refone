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

await send("Page.navigate", { url: "http://localhost:3000/allProduct" });
await sleep(7000);
console.log("links:", await ev(`JSON.stringify([...document.querySelectorAll('a[href*="product"]')].map(a=>a.getAttribute('href')).slice(0,5))`));
ws.close(); process.exit(0);
