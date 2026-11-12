/**
 * Measures real browser metrics for one URL using the Chrome DevTools Protocol.
 * Usage: node scripts/perf/measure.mjs <url> [--mobile|--desktop] [--json]
 */
const CDP_PORT = process.env.CDP_PORT || 9333;

const args = process.argv.slice(2);
const url = args.find((a) => a.startsWith("http"));
const mobile = !args.includes("--desktop");
if (!url) {
  console.error("usage: node scripts/perf/measure.mjs <url> [--desktop]");
  process.exit(1);
}

const initScript = `
window.__perf = { lcp: [], cls: 0, longTasks: 0, longTaskCount: 0, shifts: [] };
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) {
    window.__perf.lcp.push({
      time: e.startTime,
      size: e.size,
      url: e.url || null,
      tag: e.element ? e.element.tagName : null,
      id: e.element ? e.element.id : null,
      cls: e.element ? (e.element.className && e.element.className.toString ? e.element.className.toString() : '') : '',
      src: e.element && e.element.currentSrc ? e.element.currentSrc : (e.element && e.element.src) || null,
      text: e.element ? (e.element.textContent || '').slice(0, 120) : null,
      rect: e.element && e.element.getBoundingClientRect ? (() => { const r = e.element.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top) }; })() : null
    });
  }
}).observe({ type: 'largest-contentful-paint', buffered: true });
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) {
    if (!e.hadRecentInput) window.__perf.cls += e.value;
  }
}).observe({ type: 'layout-shift', buffered: true });
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) {
    window.__perf.longTasks += e.duration;
    window.__perf.longTaskCount += 1;
  }
}).observe({ type: 'longtask', buffered: true });
`;

async function main() {
  const version = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`)).json();
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
    }
  });
  await new Promise((r) => ws.addEventListener("open", r));
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const msgId = ++id;
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params, sessionId }));
    });

  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

  await send("Page.enable", {}, sessionId);
  await send("Runtime.enable", {}, sessionId);
  await send("Network.enable", {}, sessionId);
  await send("Network.setCacheDisabled", { cacheDisabled: true }, sessionId);
  await send("Page.addScriptToEvaluateOnNewDocument", { source: initScript }, sessionId);

  if (mobile) {
    await send(
      "Emulation.setDeviceMetricsOverride",
      { width: 412, height: 915, deviceScaleFactor: 1.75, mobile: true },
      sessionId
    );
    await send(
      "Emulation.setCPUThrottlingRate",
      { rate: 4 },
      sessionId
    );
    await send(
      "Network.emulateNetworkConditions",
      {
        offline: false,
        latency: 150,
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
      },
      sessionId
    );
  }

  const requests = [];
  const reqMeta = new Map();
  const bytesByType = {};
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.method === "Network.requestWillBeSent") {
      requests.push(msg.params.request.url);
      reqMeta.set(msg.params.requestId, msg.params.type);
    }
    if (msg.method === "Network.loadingFinished") {
      const type = reqMeta.get(msg.params.requestId) || "Other";
      bytesByType[type] = (bytesByType[type] || 0) + (msg.params.encodedDataLength || 0);
    }
  });

  const navStart = Date.now();
  await send("Page.navigate", { url }, sessionId);

  // Wait for the load event (or 25s), then let LCP settle.
  const loaded = new Promise((resolve) => {
    const onMsg = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.method === "Page.loadEventFired" && msg.sessionId === sessionId) {
        ws.removeEventListener("message", onMsg);
        resolve();
      }
    };
    ws.addEventListener("message", onMsg);
    setTimeout(resolve, 25000);
  });
  await loaded;
  await new Promise((r) => setTimeout(r, 2500));

  const evalRes = await send(
    "Runtime.evaluate",
    {
      expression: `(() => {
        const nav = performance.getEntriesByType('navigation')[0] || {};
        const paint = performance.getEntriesByType('paint');
        const fcp = (paint.find(p => p.name === 'first-contentful-paint') || {}).startTime || null;
        const res = performance.getEntriesByType('resource');
        const sum = (arr) => arr.reduce((a, r) => a + (r.transferSize || 0), 0);
        const js = res.filter(r => r.initiatorType === 'script' || /\\.js(\\?|$)/.test(r.name));
        const img = res.filter(r => r.initiatorType === 'img' || /\\.(png|jpg|jpeg|webp|avif|svg)/.test(r.name));
        const api = res.filter(r => /products?|api-auth/.test(r.name));
        const lcp = window.__perf.lcp;
        return {
          fcp,
          lcp: lcp.length ? lcp[lcp.length - 1] : null,
          lcpCandidates: lcp.map(l => ({ time: Math.round(l.time), tag: l.tag, cls: l.cls, size: Math.round(l.size), text: l.text, rect: l.rect, src: l.src })),
          cls: window.__perf.cls,
          tbt: window.__perf.longTasks,
          longTaskCount: window.__perf.longTaskCount,
          ttfb: nav.responseStart || null,
          domContentLoaded: nav.domContentLoadedEventEnd || null,
          load: nav.loadEventEnd || null,
          transferTotal: sum(res),
          requestCount: res.length,
          jsTransfer: sum(js),
          jsCount: js.length,
          imgTransfer: sum(img),
          imgCount: img.length,
          api: api.map(r => ({ name: r.name.replace(location.origin, ''), ms: Math.round(r.duration) })),
          htmlBytes: nav.transferSize || 0,
          titles: document.querySelectorAll('h1').length,
          href: location.href,
          readyState: document.readyState,
          bodyLen: document.body ? document.body.innerText.length : 0,
          bodyText: document.body ? document.body.innerText.slice(0, 200) : '',
          imgCountDom: document.querySelectorAll('img').length,
        };
      })()`,
      returnByValue: true,
      awaitPromise: false,
    },
    sessionId
  );

  const metrics = evalRes.result.value;
  const out = {
    url,
    mode: mobile ? "mobile (4x CPU, ~1.6Mbps, 150ms RTT)" : "desktop (no throttle)",
    wallMs: Date.now() - navStart,
    requests: requests.length,
    bytesByType,
    ...metrics,
  };
  console.log(JSON.stringify(out, null, 2));

  await send("Target.closeTarget", { targetId });
  ws.close();
}

main().catch((e) => {
  console.error("measure failed:", e.message);
  process.exit(1);
});
