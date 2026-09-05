/* ============================================================
   INDEXNOW  —  run:  node submit-indexnow.js

   Pushes every URL in sitemap.xml to the IndexNow API, which
   notifies Bing, Yandex, Seznam and others instantly. Free, no
   account, no login.

   Google does NOT use IndexNow — for Google you submit the sitemap
   once in Search Console (see README). This covers everyone else.

   Re-run it after adding a publication.
   ============================================================ */

const fs = require("fs");
const path = require("path");

const HOST = "mostafa-aby.github.io";
const SITE_URL = "https://" + HOST;

// The key file must be reachable at https://<host>/<key>.txt and contain
// exactly the key — that is how IndexNow proves you own the site.
const keyFile = fs
  .readdirSync(__dirname)
  .find((f) => /^[0-9a-f]{8,128}\.txt$/.test(f));

if (!keyFile) {
  console.error("No IndexNow key file found in this folder. Expected <hexkey>.txt");
  process.exit(1);
}
const key = path.basename(keyFile, ".txt");

const sitemap = fs.readFileSync(path.join(__dirname, "sitemap.xml"), "utf8");
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (!urlList.length) {
  console.error("No URLs found in sitemap.xml — run `node build.js` first.");
  process.exit(1);
}

(async () => {
  // Confirm the key file is actually live before submitting, otherwise
  // IndexNow rejects the whole batch with 403.
  const keyUrl = `${SITE_URL}/${key}.txt`;
  try {
    const probe = await fetch(keyUrl);
    const body = (await probe.text()).trim();
    if (probe.status !== 200 || body !== key) {
      console.error(`Key file not live yet at ${keyUrl} (status ${probe.status}).`);
      console.error("Commit and push first, wait ~1 minute, then re-run.");
      process.exit(1);
    }
    console.log(`Key verified at ${keyUrl}`);
  } catch (e) {
    console.error(`Could not reach ${keyUrl}: ${e.message}`);
    process.exit(1);
  }

  const payload = { host: HOST, key, keyLocation: keyUrl, urlList };
  console.log(`Submitting ${urlList.length} URLs...`);
  urlList.forEach((u) => console.log("  " + u));

  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  // 200 = accepted, 202 = accepted, key validation pending.
  console.log(`\nIndexNow responded ${res.status} ${res.statusText}`);
  if (res.status === 200 || res.status === 202) {
    console.log("Accepted. Bing and Yandex will crawl these shortly.");
  } else {
    console.log("Body:", (await res.text()).slice(0, 500));
  }
})();
