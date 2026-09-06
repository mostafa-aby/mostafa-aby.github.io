/* ============================================================
   BUILD SCRIPT  —  run:  node build.js

   Reads assets/data.js and writes real, static HTML files:
     index.html               the homepage
     pub/<slug>/index.html    one indexable page per publication
     sitemap.xml              the list of URLs for Google

   Why this exists: search engines and link previewers (LinkedIn, X,
   Slack) do not reliably run JavaScript. Pre-rendering means your
   name and your papers are in the HTML itself, so they get indexed.

   You edit assets/data.js, then run `node build.js`, then push.
   ============================================================ */

const fs = require("fs");
const path = require("path");

/* ---- CHANGE THIS if you buy a custom domain --------------- */
const SITE_URL = "https://mostafa-aby.github.io";
/* e.g. "https://mostafajafarian.com"  — no trailing slash.
   This must match your GitHub username: a repo named
   <username>.github.io is served at https://<username>.github.io  */

/* ---- ORCID -------------------------------------------------
   Free, takes five minutes: https://orcid.org/register
   Worth doing — it is how a search engine ties your name to your
   publication record, and it disambiguates you from every other
   Jafarian in the index. Paste the full URL here when you have it,
   e.g. "https://orcid.org/0000-0002-1825-0097".                 */
const ORCID = "";

/* ---- Search engine site verification ----------------------
   Google Search Console → Add property → URL prefix → HTML tag.
   It shows: <meta name="google-site-verification" content="XXXX" />
   Paste ONLY the XXXX part below, rebuild, push, then click Verify.
   Bing Webmaster Tools works the same way (or just import from Google).
   Leave them empty until then; the tags are simply omitted. */
const GOOGLE_SITE_VERIFICATION = "9kJ1f3rlbHIawG54Ox-4wJyTbSjuPdr8UbL9Itcdh6A";
const BING_SITE_VERIFICATION = "";

/* ---- Cache busting ----------------------------------------
   Browsers cache CSS and JS hard. Without this, editing style.css and
   pushing leaves visitors — and you — looking at the old design until the
   cache expires. Appending a hash of the file's own contents means the URL
   changes only when the file changes, so updates appear immediately and
   unchanged files stay cached. */
const crypto = require("crypto");
const assetHash = (rel) => {
  try {
    const buf = fs.readFileSync(path.join(__dirname, rel));
    return crypto.createHash("sha1").update(buf).digest("hex").slice(0, 8);
  } catch {
    return "0";
  }
};
const CSS_V = assetHash("assets/style.css");
const JS_V = assetHash("assets/site.js");

/* ---- Load data.js as the single source of truth ----------- */
const src = fs.readFileSync(path.join(__dirname, "assets", "data.js"), "utf8");
const load = new Function(
  src +
    "\nreturn {profile,links,interests,publications,pubSections,presentations,talkSections," +
    "research,code,news,experience,teaching,education,awards,funding,mentoring," +
    "affiliations,certifications,testScores,skills};"
);
const D = load();

/* ---- Helpers ---------------------------------------------- */
const stripTags = (s) => String(s).replace(/<[^>]*>/g, "");
// JSON-LD holds plain text, not HTML — turn &amp; back into & etc.
const unescapeHtml = (s) =>
  String(s)
    .replace(/&amp;/g, "&")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&middot;/g, "·")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
const collapse = (s) => unescapeHtml(stripTags(s)).replace(/\s+/g, " ").trim();
// Same whitespace tidy-up, but for text that goes straight into the page and is
// allowed to carry its own <strong>/<em>. collapse() is for plain-text slots
// (JSON-LD, meta tags) and would strip that emphasis out.
const tidy = (s) => String(s).replace(/\s+/g, " ").trim();
const attr = (s) =>
  collapse(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const BADGE_LABEL = {
  published: "Published",
  review: "Under Review",
  revision: "In Revision",
  preprint: "Preprint",
  prep: "In Prep",
};

const badge = (status) =>
  status && BADGE_LABEL[status]
    ? `<span class="badge badge-${status}">${BADGE_LABEL[status]}</span>`
    : "";

const fmtDate = (iso) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
};

const paragraphs = (text) =>
  String(text)
    .split(/\n\s*\n/)
    .map((p) => p.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .map((p) => `<p>${p}</p>`)
    .join("");

/* ---- Section renderers ------------------------------------ */
function masthead(base) {
  const linkHtml = D.links
    .map((l, i) => {
      const absolute = /^https?:/.test(l.url);
      const mail = l.url.startsWith("mailto:");
      // Anything else — assets/cv.pdf, cv/ — is ours, so it takes the page's base.
      const url = absolute || mail ? l.url : base + l.url;
      // Absolute links leave the site, and so does a PDF - both get their own
      // tab, so a recruiter reading the CV has not lost the page behind it.
      const newTab = absolute || /\.pdf$/i.test(l.url);
      const attrs = newTab ? ` target="_blank" rel="noopener noreferrer"` : "";
      const sep = i < D.links.length - 1 ? `<span class="sep"> &middot; </span>` : "";
      return `<a href="${url}"${attrs}>${l.name}</a>${sep}`;
    })
    .join("");

  return `
    <header class="masthead">
      <img class="avatar" src="${base}${D.profile.image}" alt="${attr(D.profile.name)}" width="280" height="420">
      <div class="identity">
        <h1>${D.profile.name}</h1>
        <div class="subtitle">${D.profile.title}${
          D.profile.location ? ` <span class="sep">&middot;</span> ${D.profile.location}` : ""
        }</div>
        <p>${D.profile.bio}</p>
        <p>${D.profile.research}</p>
        <div class="linkrow">${linkHtml}</div>
      </div>
    </header>`;
}

/* Each renderer below returns only what goes INSIDE a section. The section
   wrapper, its id and its <h2> are added once, in homeSections(), so the jump
   nav and the page can never drift apart.

   Every renderer must return "" — not an empty <ul> — when it has no data, so
   that an empty section prints neither a heading nor a nav link. */
const interests = () =>
  D.interests.length
    ? `<div class="tags">${D.interests.map((i) => `<span class="tag">${i}</span>`).join("")}</div>`
    : "";

/* A paper gets its own page only when it has a real abstract to show. */
const hasPage = (p) => Boolean(p.abstract && String(p.abstract).trim());

function pubItem(p, base) {
  const href = `${base}pub/${p.slug}/`;
  const parts = (p.links || []).map(
    (l) => `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label}</a>`
  );
  if (hasPage(p)) parts.push(`<a href="${href}">Abstract</a>`);

  // Only link the title somewhere real: our page, else the first external link.
  const titleHtml = hasPage(p)
    ? `<a href="${href}">${p.title}</a>`
    : p.links && p.links.length
    ? `<a href="${p.links[0].url}" target="_blank" rel="noopener noreferrer">${p.title}</a>`
    : p.title;

  const note = p.note ? ` <span class="muted">(${p.note})</span>` : "";
  const linkLine = parts.length
    ? `<div class="pub-links">${parts.join(`<span class="sep"> &middot; </span>`)}</div>`
    : "";

  return `
        <li>
          <div class="pub-title">${titleHtml}${badge(p.status)}</div>
          <div class="pub-authors">${p.authors}</div>
          <div class="pub-venue">${p.venues.join(" &middot; ")}${note}</div>
          ${linkLine}
        </li>`;
}

/* One list per group, in the order pubSections gives them, so the page reads
   the way the CV does instead of as one undifferentiated pile. */
const pubList = (key, base) => {
  const items = D.publications.filter((p) => p.group === key);
  return items.length ? `<ul class="pubs">${items.map((p) => pubItem(p, base)).join("")}</ul>` : "";
};

/* Talks and posters. Same shape as the papers, minus links and badges —
   these are events, not artifacts anyone can download. */
const talkList = (key) => {
  const items = D.presentations.filter((t) => t.type === key);
  if (!items.length) return "";
  const li = items
    .map(
      (t) => `
        <li>
          <div class="pub-title">${t.title}</div>
          <div class="pub-authors">${t.authors}</div>
          <div class="pub-venue">${t.venue} &middot; ${t.date}${
            t.note ? ` <span class="muted">(${t.note})</span>` : ""
          }</div>
        </li>`
    )
    .join("");
  return `<ul class="pubs">${li}</ul>`;
};

const news = () => {
  if (!D.news.length) return "";
  const items = [...D.news]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(
      (n) =>
        `<li><span class="when">${fmtDate(n.date)}</span><span class="what">${n.text}</span></li>`
    )
    .join("");
  return `<ul class="news">${items}</ul>`;
};

/* Dated role blocks — Experience and Teaching are the same shape.
   compact: heading line only. The homepage wants the trajectory at a glance;
   the CV page wants the bullets. */
const roles = (items, compact) =>
  items
    .map(
      (e) => `
      <div class="entry">
        <div class="entry-head">
          <span class="entry-role">${e.role}</span>
          <span class="entry-when">${e.dates}</span>
        </div>
        <div class="entry-org">${e.org} &middot; ${e.location}</div>
        ${compact ? "" : `<ul>${e.points.map((p) => `<li>${p}</li>`).join("")}</ul>`}
      </div>`
    )
    .join("");

const experience = (compact) => roles(D.experience, compact);
const teaching = () => roles(D.teaching);

const education = () =>
  D.education
    .map(
      (e) => `
      <div class="entry">
        <div class="entry-head">
          <span class="entry-role">${e.degree}</span>
          <span class="entry-when">${e.dates}</span>
        </div>
        <div class="entry-org">${e.school}${e.note ? " &middot; " + e.note : ""}</div>
      </div>`
    )
    .join("");

/* Mentees grouped under the program that funds them, so a reader can tell the
   funded students from the volunteer teams at a glance. */
const mentoring = () =>
  D.mentoring
    .map(
      (g) => `
      <div class="entry">
        <div class="entry-head">
          <span class="entry-role">${g.program}</span>
          <span class="entry-when">${g.dates}</span>
        </div>
        <ul>${g.entries
          .map((m) => `<li><strong>${m.name}</strong> &mdash; ${m.detail}</li>`)
          .join("")}</ul>
      </div>`
    )
    .join("");

/* Certifications read as name / issuer / date — the same three-part shape as a
   degree, so they get the same entry treatment rather than a flat bullet list. */
const certifications = () =>
  D.certifications
    .map(
      (c) => `
      <div class="entry">
        <div class="entry-head">
          <span class="entry-role">${c.name}</span>
          <span class="entry-when">${c.date}</span>
        </div>
        <div class="entry-org">${c.issuer}</div>
      </div>`
    )
    .join("");

// Returns "" for an empty array, so the section disappears entirely.
const list = (arr) => (arr.length ? `<ul>${arr.map((x) => `<li>${x}</li>`).join("")}</ul>` : "");

const skills = () =>
  D.skills
    .map(
      (s) =>
        `<div class="skill-row"><span class="skill-group">${s.group}:</span> ${s.items}</div>`
    )
    .join("");

/* Section ids come from the nav label, so the URL of an anchor reads the way
   the link does: #conference-papers, not #conference. */
const slugId = (label) =>
  collapse(label).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* Selected research. Each entry is a figure (when the work is public), a short
   plain-language paragraph, and links. Entries with neither figure nor stats
   still read correctly — the figure block is simply absent. */
const researchLinks = (r, base) =>
  (r.links || []).length
    ? `<div class="pub-links">${r.links
        .map((l) => {
          const internal = !/^https?:/.test(l.url);
          const href = internal ? base + l.url : l.url;
          const attrs = internal ? "" : ` target="_blank" rel="noopener noreferrer"`;
          return `<a href="${href}"${attrs}>${l.label}</a>`;
        })
        .join(`<span class="sep"> &middot; </span>`)}</div>`
    : "";

/* Three headline numbers, for a project that has results but no public figure.
   Plain text in the page's own ink — a number is not a series, so it gets no
   colour of its own. */
const statRow = (stats) =>
  `<div class="stats">${stats
    .map(
      (t) =>
        `<div class="stat"><div class="stat-value">${t.value}</div><div class="stat-label">${t.label}</div></div>`
    )
    .join("")}</div>`;

const researchList = (base) =>
  D.research
    .filter((r) => !r.hidden)
    .map((r) => {
      const fig = r.image
        ? `<figure class="fig">
          <img src="${base}${r.image.src}" alt="${attr(r.image.alt)}" width="${r.image.width}" height="${r.image.height}" loading="lazy" decoding="async">
          <figcaption>${r.image.caption}</figcaption>
        </figure>`
        : "";
      return `
      <article class="project">
        <h3>${r.title}${badge(r.status)}</h3>
        <p class="hook">${tidy(r.hook)}</p>
        <ul class="points">${(r.points || [])
          .map((p) => `<li>${tidy(p)}</li>`)
          .join("")}</ul>
        ${r.stats ? statRow(r.stats) : ""}
        ${fig}
        ${researchLinks(r, base)}
      </article>`;
    })
    .join("");

/* Public repositories. One may carry a demo and lead the section; the rest stay
   terse — a name, what it is, what it is written in. */
const featuredTool = (f, base) => {
  const v = f.video;
  return `
      <article class="tool">
        <h3>${f.title}</h3>
        <p class="hook">${tidy(f.hook)}</p>
        ${f.note ? `<div class="tool-note">${tidy(f.note)}</div>` : ""}
        <div class="pub-venue">${f.meta}</div>
        <figure class="fig">
          <video class="demo" src="${base}${v.src}" poster="${base}${v.poster}"
            width="${v.width}" height="${v.height}" aria-label="${attr(v.alt)}"
            autoplay muted loop playsinline preload="metadata"></video>
        </figure>
        <div class="pub-links">${f.links
          .map(
            (l) =>
              `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label}</a>`
          )
          .join(`<span class="sep"> &middot; </span>`)}</div>
      </article>`;
};

const codeList = (base) => {
  if (!D.code.length) return "";
  const lead = D.code.filter((c) => c.featured);
  const rest = D.code.filter((c) => !c.featured);
  return (
    lead.map((c) => featuredTool(c.featured, base)).join("") +
    (rest.length
      ? `<ul class="repos">${rest
          .map(
            (c) => `
        <li>
          <div class="pub-title"><a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name}</a></div>
          <div class="pub-authors">${c.detail}</div>
          <div class="pub-venue">${c.lang}</div>
        </li>`
          )
          .join("")}</ul>`
      : "")
  );
};

/* ---- The page, as one ordered list of sections -------------
   `short` is the label used in the jump nav. A section whose renderer returned
   "" is dropped here, so it prints neither a heading nor a nav link. */
function collect(fn) {
  const out = [];
  fn((id, title, inner, short) => {
    if (inner) out.push({ id, title, inner, short: short || title });
  });
  return out;
}

/* THE page. There is only one, and it is the CV.

   An earlier version split this in two: a homepage that pitched the work and a
   /cv/ page holding the record. That split made a visitor choose between two
   links that sound like the same thing, and the PDF in the link row already
   serves anyone who just wants the document. So the record lives here, in CV
   order, and the PDF is one click away for anyone who wants to print it.

   News is last on purpose: it is the only thing here that is not CV content.
   Delete its line if you would rather not have it at all. */
const homeSections = (base) =>
  collect((add) => {
    add("education", "Education", education());
    add("interests", "Research Interests", interests(), "Interests");
    add("experience", "Experience", experience(false));
    add("teaching", "Teaching", teaching());
    D.pubSections.forEach((g) => add(slugId(g.short), g.title, pubList(g.key, base), g.short));
    D.talkSections.forEach((g) => add(slugId(g.short), g.title, talkList(g.key), g.short));
    add("funding", "Research Funding", list(D.funding), "Funding");
    add("mentoring", "Mentoring", mentoring());
    add("awards", "Honors and Awards", list(D.awards), "Awards");
    add("certifications", "Certifications", certifications(), "Certifications");
    add("affiliations", "Professional Affiliations", list(D.affiliations), "Affiliations");
    add("code", "Code", codeList(base));
    add("skills", "Technical Skills", skills(), "Skills");
    add("test-scores", "Test Scores", list(D.testScores), "Test Scores");
    add("news", "News", news());
  });


/* One row of jump links. The page is long enough that landing on it with no map
   is a worse experience than the extra row costs. */
const sectionNav = (sections, extra) =>
  `<nav class="sectionnav" aria-label="Sections">${[
    ...sections.map((x) => `<a href="#${x.id}">${x.short}</a>`),
    ...(extra || []),
  ].join(`<span class="sep"> &middot; </span>`)}</nav>`;

const sectionHtml = (x) =>
  `<section id="${x.id}"><h2>${x.title}</h2>${x.inner}</section>`;

const footer = () =>
  `<footer>&copy; ${new Date().getFullYear()} ${D.profile.name}. Built with plain HTML, CSS, and JavaScript.</footer>`;

/* ---- Structured data: tells Google you are a person -------- */
function personJsonLd() {
  // ORCID is not in the visible link row — almost nobody clicks it — but it
  // still belongs here: this is how a search engine ties your name to your
  // publication record. Machines read sameAs; people read the link row.
  const sameAs = [
    ...new Set([...D.links.filter((l) => /^https?:/.test(l.url)).map((l) => l.url), ORCID]),
  ].filter(Boolean);

  // Your papers are indexed under three different forms of your name. Listing
  // them here is what lets a search engine merge them into one person.
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: D.profile.name,
      // Your papers are indexed under several forms of your name, and there are
      // other researchers called Mostafa Jafarian. Listing every form you
      // actually publish under is how a search engine merges them into one
      // person instead of scattering them across several.
      alternateName: [
        "Mostafa Jafarian Abyaneh",
        "M. Jafarian Abyaneh",
        "Mostafa J. Abyaneh",
        "M. J. Abyaneh",
        "Mostafa Jafarian",
      ],
      url: SITE_URL + "/",
      image: SITE_URL + "/" + D.profile.image,
      jobTitle: D.profile.title,
      ...(D.profile.location
        ? { homeLocation: { "@type": "Place", name: D.profile.location } }
        : {}),
      description: collapse(D.profile.bio),
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "University of Maryland, College Park",
        url: "https://www.umd.edu/",
      },
      // Past institutions only, de-duplicated — the current one is `affiliation`.
      alumniOf: [...new Set(D.education.map((e) => e.school))]
        .filter((s) => s !== "University of Maryland, College Park")
        .map((name) => ({ "@type": "CollegeOrUniversity", name })),
      knowsAbout: D.interests.map(collapse),
      sameAs,
    },
    null,
    2
  );
}

function articleJsonLd(p) {
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      headline: collapse(p.title),
      author: collapse(p.authors)
        .split(",")
        .map((a) => ({ "@type": "Person", name: a.trim() })),
      publisher: collapse(p.venues[0]),
      abstract: collapse(p.abstract).slice(0, 500),
      url: `${SITE_URL}/pub/${p.slug}/`,
      ...(p.links && p.links[0] ? { sameAs: p.links[0].url } : {}),
    },
    null,
    2
  );
}

/* ---- Page shell ------------------------------------------- */
function page({ title, description, canonical, body, base, jsonLd, ogType }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>${attr(title)}</title>
    <meta name="description" content="${attr(description)}" />
    <meta name="author" content="${attr(D.profile.name)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${canonical}" />
${
  GOOGLE_SITE_VERIFICATION
    ? `    <meta name="google-site-verification" content="${GOOGLE_SITE_VERIFICATION}" />\n`
    : ""
}${
      BING_SITE_VERIFICATION
        ? `    <meta name="msvalidate.01" content="${BING_SITE_VERIFICATION}" />\n`
        : ""
    }

    <meta property="og:type" content="${ogType || "website"}" />
    <meta property="og:site_name" content="${attr(D.profile.name)}" />
    <meta property="og:title" content="${attr(title)}" />
    <meta property="og:description" content="${attr(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE_URL}/${D.profile.image}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${attr(title)}" />
    <meta name="twitter:description" content="${attr(description)}" />
    <meta name="twitter:image" content="${SITE_URL}/${D.profile.image}" />

    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏗️</text></svg>" />
    <link rel="stylesheet" href="${base}assets/style.css?v=${CSS_V}" />

    <script type="application/ld+json">
${jsonLd}
    </script>

    <script>
      // Apply the saved theme before first paint, so the page never flashes.
      (function () {
        try {
          var t = localStorage.getItem("theme");
          if (t === "light" || t === "dark")
            document.documentElement.setAttribute("data-theme", t);
        } catch (e) {}
      })();
    </script>
  </head>

  <body>
    <button id="theme-toggle" type="button">
      <span class="when-dark">&#9728;&#65038; Light Mode</span>
      <span class="when-light">&#9789; Dark Mode</span>
    </button>
    <main class="container">
${body}
    </main>
    <script src="${base}assets/site.js?v=${JS_V}"></script>
  </body>
</html>
`;
}

/* ---- Write the homepage ----------------------------------- */
const homeDescription = collapse(D.profile.bio).slice(0, 300);

fs.writeFileSync(
  path.join(__dirname, "index.html"),
  page({
    title: `${D.profile.name} — ${D.profile.title}${D.profile.affiliation ? ", " + D.profile.affiliation : ""}`,
    description: homeDescription,
    canonical: SITE_URL + "/",
    base: "",
    jsonLd: personJsonLd(),
    body: (() => {
      const sections = homeSections("");
      return [
        masthead(""),
        sectionNav(sections),
        ...sections.map(sectionHtml),
        footer(),
      ].join("\n");
    })(),
  })
);

/* ---- /cv/ is now a redirect, not a page -------------------
   The CV used to live at /cv/. It is on the homepage now, but that URL was
   submitted to Google and may be in someone bookmarks, so it must not simply
   404. This stub sends both people and crawlers to the homepage and declares
   the homepage as the canonical address, which is how the two get merged in
   the index rather than competing. It is deliberately kept out of sitemap.xml.  */
const cvDir = path.join(__dirname, "cv");
fs.mkdirSync(cvDir, { recursive: true });

fs.writeFileSync(
  path.join(cvDir, "index.html"),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>CV - ${attr(D.profile.name)}</title>
    <link rel="canonical" href="${SITE_URL}/" />
    <meta name="robots" content="noindex, follow" />
    <meta http-equiv="refresh" content="0; url=${SITE_URL}/" />
  </head>
  <body>
    <p>The CV now lives on the <a href="${SITE_URL}/">home page</a>.</p>
  </body>
</html>
`
);


/* ---- Write one page per publication ----------------------- */
const pubDir = path.join(__dirname, "pub");
fs.rmSync(pubDir, { recursive: true, force: true });

const paged = D.publications.filter(hasPage);

paged.forEach((p) => {
  const dir = path.join(pubDir, p.slug);
  fs.mkdirSync(dir, { recursive: true });

  const base = "../../";
  const linkHtml = (p.links || [])
    .map(
      (l) =>
        `<p><a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label} &rarr;</a></p>`
    )
    .join("");

  const body = `
    <article class="paper">
      <p class="paper-back"><a href="${base}">&larr; ${D.profile.name}</a></p>
      <h1>${p.title}${badge(p.status)}</h1>
      <div class="pub-authors">${p.authors}</div>
      <div class="pub-venue" style="margin-bottom:.75rem">${p.venues.join(" &middot; ")}${
    p.note ? ` <span class="muted">(${p.note})</span>` : ""
  }</div>
      ${linkHtml}
      <h2>Abstract</h2>
      <div class="abstract">${paragraphs(p.abstract)}</div>
      ${
        p.abstractSource
          ? `<p class="abstract-source muted">Abstract as published in <a href="${p.abstractSource.url}" target="_blank" rel="noopener noreferrer">${p.abstractSource.label}</a>.</p>`
          : ""
      }
      ${footer()}
    </article>`;

  fs.writeFileSync(
    path.join(dir, "index.html"),
    page({
      title: `${collapse(p.title)} — ${D.profile.name}`,
      description: collapse(p.abstract).slice(0, 300),
      canonical: `${SITE_URL}/pub/${p.slug}/`,
      base,
      jsonLd: articleJsonLd(p),
      ogType: "article",
      body,
    })
  );
});

/* ---- sitemap.xml + robots.txt ------------------------------ */
const today = new Date().toISOString().slice(0, 10);
const urls = [`${SITE_URL}/`].concat(paged.map((p) => `${SITE_URL}/pub/${p.slug}/`));

fs.writeFileSync(
  path.join(__dirname, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u, i) =>
      `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${
        i === 0 ? "1.0" : "0.8"
      }</priority>\n  </url>`
  )
  .join("\n")}
</urlset>
`
);

fs.writeFileSync(
  path.join(__dirname, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
);

console.log(`Built for ${SITE_URL}`);
console.log(`  index.html`);
console.log(`  cv/index.html          (redirect to /)`);
console.log(`  pub/<slug>/index.html   x${paged.length} of ${D.publications.length} (only papers with a real abstract)`);
console.log(`  sitemap.xml             ${urls.length} URLs`);
console.log(`  robots.txt`);
