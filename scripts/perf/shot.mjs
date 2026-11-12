/**
 * Captures full-page screenshots of one or more viewports for UI comparison.
 * Usage: node scripts/perf/shot.mjs <url> <outPrefix>
 */
const CDP_PORT = process.env.CDP_PORT || 9333;
const [, , url, prefix] = process.argv;
if (!url || !prefix) {
  console.error("usage: node scripts/perf/shot.mjs <url> <outPrefix>");
  process.exit(1);
}

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

  const viewports = [
    { name: "desktop", width: 1440, height: 1000, dsf: 1, mobile: false },
    { name: "mobile", width: 412, height: 915, dsf: 2, mobile: true },
  ];

  const fs = await import("node:fs/promises");
  for (const vp of viewports) {
    await send(
      "Emulation.setDeviceMetricsOverride",
      { width: vp.width, height: vp.height, deviceScaleFactor: vp.dsf, mobile: vp.mobile },
      sessionId
    );
    await send("Page.navigate", { url }, sessionId);
    await new Promise((r) => setTimeout(r, 10000));
    const { data } = await send(
      "Page.captureScreenshot",
      { format: "png", captureBeyondViewport: true },
      sessionId
    );
    const file = `scripts/perf/out/${prefix}-${vp.name}.png`;
    await fs.writeFile(file, Buffer.from(data, "base64"));
    console.log("saved", file);
  }
  await send("Target.closeTarget", { targetId });
  ws.close();
}

main().catch((e) => {
  console.error("shot failed:", e.message);
  process.exit(1);
});
