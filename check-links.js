/* ============================================================
   LINK CHECKER  —  run:  node check-links.js

   Walks every generated HTML file, collects every href/src, then:
     - resolves local links against the file system
     - requests every external link over the network
   Reports anything that does not resolve or does not return OK.

   Run this before pushing, whenever you add links to data.js.
   ============================================================ */

const fs = require("fs");
const path = require("path");

const SKIP_DIRS = new Set([".git", "node_modules", ".playwright-mcp"]);

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (!SKIP_DIRS.has(name)) walk(p, acc);
    } else if (name.endsWith(".html")) {
      acc.push(p);
    }
  }
  return acc;
}

const files = walk(__dirname);
const links = new Map(); // url -> Set of pages containing it

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(__dirname, file).split(path.sep).join("/");
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (url.startsWith("data:")) continue;
    if (!links.has(url)) links.set(url, new Set());
    links.get(url).add(rel);
  }
}

const local = [];
const remote = [];
const mailto = [];
for (const [url, pages] of links) {
  if (/^https?:/i.test(url)) remote.push([url, [...pages]]);
  else if (/^mailto:/i.test(url)) mailto.push([url, [...pages]]);
  else local.push([url, [...pages]]);
}

console.log(
  `Scanned ${files.length} HTML files — ${links.size} distinct URLs ` +
    `(${local.length} local, ${remote.length} external, ${mailto.length} mailto)\n`
);

/* ---- Local links resolve against the file system ----------- */
let localBad = 0;
console.log("LOCAL");
for (const [url, pages] of local.sort()) {
  for (const page of pages) {
    const dir = path.dirname(path.join(__dirname, page));
    let target = path.normalize(path.join(dir, url.split("#")[0].split("?")[0]));
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      target = path.join(target, "index.html");
    }
    const ok = fs.existsSync(target);
    if (!ok) localBad++;
    console.log(`  ${ok ? "ok  " : "MISS"}  ${url}${ok ? "" : `   <- ${page}`}`);
  }
}

/* ---- mailto sanity ---------------------------------------- */
console.log("\nMAILTO");
let mailBad = 0;
for (const [url] of mailto) {
  const addr = url.replace(/^mailto:/i, "");
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr);
  if (!ok) mailBad++;
  console.log(`  ${ok ? "ok  " : "BAD "}  ${addr}`);
}

/* ---- External links get a real request --------------------- */
(async () => {
  console.log("\nEXTERNAL");
  let remoteBad = 0;

  for (const [url, pages] of remote.sort()) {
    let status = null;
    let note = "";
    try {
      // HEAD first; some publishers reject it, so fall back to GET.
      let r = await fetch(url, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0" } });
      if (r.status === 405 || r.status === 501) {
        r = await fetch(url, { method: "GET", headers: { "User-Agent": "Mozilla/5.0" } });
      }
      status = r.status;
      if (r.url && r.url !== url) note = ` -> ${r.url}`;
    } catch (e) {
      note = ` (${e.message})`;
    }

    // 403 from Cloudflare-protected publishers means "no bots", not "broken".
    const ok = status !== null && (status < 400 || status === 403);
    if (!ok) remoteBad++;
    const flag = status === 403 ? "bot?" : ok ? "ok  " : "FAIL";
    console.log(`  ${flag}  ${status || "ERR"}  ${url}${note}`);
    if (!ok) console.log(`          on: ${pages.join(", ")}`);
    await new Promise((r) => setTimeout(r, 350));
  }

  console.log(
    `\nSUMMARY  local-missing:${localBad}  mailto-bad:${mailBad}  external-failed:${remoteBad}`
  );
  process.exit(localBad + mailBad + remoteBad ? 1 : 0);
})();
