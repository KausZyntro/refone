const PORT=9333;
const t=await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent("about:blank")}`,{method:"PUT"}).then(r=>r.json());
const ws=new WebSocket(t.webSocketDebuggerUrl);let id=0;const p=new Map();const logs=[];const net=[];
ws.addEventListener("message",e=>{const m=JSON.parse(e.data);
 if(m.id&&p.has(m.id)){p.get(m.id)(m);p.delete(m.id);}
 if(m.method==="Runtime.consoleAPICalled")logs.push(m.params.type+": "+m.params.args.map(a=>a.value??a.description??"").join(" "));
 if(m.method==="Runtime.exceptionThrown")logs.push("EXCEPTION: "+(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text));
 if(m.method==="Network.responseReceived"&&/cart|checkout|summary/.test(m.params.response.url))net.push(m.params.response.status+" "+m.params.response.url.replace('https://refones.com/ApiAuthUat/api',''));
});
const send=(method,params={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method,params}));});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await new Promise(r=>ws.addEventListener("open",r,{once:true}));
await send("Runtime.enable");await send("Page.enable");await send("Network.enable");
await send("Emulation.setDeviceMetricsOverride",{width:1440,height:1200,deviceScaleFactor:1,mobile:false});
const ev=async e=>(await send("Runtime.evaluate",{expression:e,returnByValue:true,awaitPromise:true})).result?.result?.value;

// seed auth while on localhost
await send("Page.navigate",{url:"http://localhost:3000/"});await sleep(4000);
await ev(`localStorage.setItem('auth',JSON.stringify({token:'test-token',user:{id:1,name:'Cart Test',email:'cart-test@example.com'},expiry:Date.now()+86400000}))`);
// direct load of the cart page
await send("Page.navigate",{url:"http://localhost:3000/cart"});await sleep(9000);
console.log("URL:",await ev(`location.href`));
console.log("containers:",await ev(`JSON.stringify([...document.querySelectorAll('[class*="cart"],[class*="skeleton"]')].slice(0,12).map(e=>e.tagName+'.'+(e.className||'').toString().slice(0,70)))`));
console.log("body slice:",JSON.stringify(await ev(`document.body.innerText.slice(0,700)`)));
console.log("NET:",JSON.stringify(net));
console.log("LOGS:",JSON.stringify(logs.filter(l=>/error|Error|EXCEPTION|warn/.test(l)),null,2));
ws.close();process.exit(0);
