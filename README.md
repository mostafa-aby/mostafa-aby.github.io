# mostafa-aby.github.io

My personal academic website. Plain HTML — nothing to install.

**Live:** https://mostafa-aby.github.io

---

## First-time setup (do this once)

The site isn't online until three things exist. In order:

1. **Create the GitHub repo.** It must be named exactly
   `mostafa-aby.github.io` — GitHub Pages only serves a user site from a
   repo named after the account. Public, because Pages only serves public repos
   on the free plan.

2. **Push this folder into it:**

   ```powershell
   cd "G:\My Drive\Mostafa's Documents\CV & Resume\CV and Resume\website"
   git init
   git add -A
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/mostafa-aby/mostafa-aby.github.io.git
   git push -u origin main
   ```

   Then **Settings → Pages → Source: Deploy from a branch → main / (root)**.
   Live in about a minute.

3. **Optional, same pattern:** `git init` inside `../cv-typst` and
   `../resume-typst` too, each with its own repo. `publish.sh` pushes any of the
   three that is a repo and skips the ones that aren't, so this is genuinely
   optional — it just gives the PDFs their own version history.

### Then, once it's live

| Task | Where |
|---|---|
| Submit the sitemap | [Google Search Console](https://search.google.com/search-console) → add `https://mostafa-aby.github.io` → paste the verification token into `GOOGLE_SITE_VERIFICATION` in `build.js`, rebuild, push, Verify |
| Same for Bing | [Bing Webmaster Tools](https://www.bing.com/webmasters) → import from Google, or use `BING_SITE_VERIFICATION` |
| Get an ORCID | https://orcid.org/register — paste the URL into `ORCID` in `build.js` |
| Tell Bing/Yandex about new pages | `node submit-indexnow.js` |

---

## To change anything

Edit **`assets/data.js`**. That is the only file with content in it.

Then:

```powershell
node build.js
git add -A
git commit -m "what changed" ; git push
```

Live in about a minute.

---

## Things left to fill in

Search `assets/data.js` for these — they're marked in comments:

- **Zenodo DOIs** for the two WASET / *IJCEE* papers, and the **DalSpace link**
  for the M.A.Sc. thesis.
- **`code`** is empty. The section prints nothing until you add a repo.
- **`research`** describes the three published papers. Once you know what your
  Maryland project actually is, add a fourth entry with `hidden: true` and drop
  that line when the work goes public.
- An **ORCID** in `build.js` — see the setup table above.

---

## Add a paper

Paste into the `publications` list in `assets/data.js`, at the top of its own
group:

```js
{
  slug: "short-name",                    // the URL: /pub/short-name/
  group: "peer-reviewed",                // peer-reviewed | conference
  title: "Full Paper Title",
  authors: "<strong>M. Jafarian Abyaneh</strong>, V. Toufigh",
  venues: ["Journal Name — 2026"],
  status: "published",                   // published | review | revision | preprint | prep
  links: [{ label: "DOI", url: "https://doi.org/..." }],
  abstract: `Paste the real published abstract here, or leave it null.`,
},
```

`abstract: null` means no detail page is generated for that paper.

**On abstracts:** none of your published papers is open access, so don't paste
the publisher's typeset abstract — ASCE and ACI hold that copyright. What you
*can* post is your own accepted-manuscript abstract, which is your text. Every
paper currently has `abstract: null`, so no detail pages exist yet.

### How papers are grouped

The site mirrors the CV's sections instead of showing one flat list. `group`
picks the section; `pubSections` names them and sets their order:

| `group` | Section on the page |
|---|---|
| `peer-reviewed` | Publications — journal articles and the thesis |
| `conference` | Conference Papers — proceedings |

Entries render in the order you write them, so keep each group
reverse-chronological, exactly as the CV lists them. A group with nothing in it
prints no heading at all — which means you can add a `working` group to
`pubSections` before you have anything under review.

## Add a research project (the section with figures)

Entries live in `research` in `assets/data.js`:

```js
{
  id: "short-name",
  title: "Plain-language title, not the paper title",
  status: "published",                  // published | review | preprint | prep
  hook: "One line that makes a stranger care. This is the sentence that has to land.",
  points: [                             // two to four, one line each
    "A fact with a number in it.",
    "What is actually new about it.",
  ],
  image: {                              // optional — see the rule below
    src: "assets/img/my-figure.jpg", width: 1200, height: 618,
    alt: "What the picture shows, for a screen reader.",
    caption: `Caption, with attribution to the paper it came from.`,
  },
  stats: [{ value: "4.0", label: "GPA" }],  // optional
  links: [{ label: "Paper", url: "https://doi.org/..." }],
},
```

**The figure rule:** a figure goes on this page only if the paper it comes from
is already public **and you have the right to repost it** — open access, a
preprint, or a figure you regenerate yourself from your own model output. None
of your three journal papers is open access, so their typeset figures cannot go
here; make new ones instead. Nothing from a manuscript under review or in
preparation, however good it looks. Entries with no figure fall back to `stats`,
or to the paragraph alone.

Prepare a figure for the web before adding it (roughly 1200px wide, JPEG):

```
python -c "from PIL import Image; im=Image.open(r'SOURCE.png').convert('RGB'); w,h=im.size; im=im.resize((1200,round(h*1200/w))); im.save('assets/img/NAME.jpg','JPEG',quality=86,optimize=True,progressive=True)"
```

## Add a talk or poster

Talks live in their own `presentations` list, kept out of the paper list:

```js
{
  type: "conference",                    // conference | workshop
  title: "Talk Title",
  authors: "<strong>M. Jafarian Abyaneh</strong>, V. Toufigh",
  venue: "Meeting Name, City, ST",
  date: "Jun. 2026",
  note: "Poster presentation",
},
```

`talkSections` names those two sections the same way `pubSections` does. The
list is empty right now, so neither section prints.

## The site is three kinds of page

| Page | Answers | Built from |
|---|---|---|
| `/` | "Who is this and is he any good?" — 30 seconds | `homeSections()` |
| `/cv/` | "Give me the complete record." | `cvSections()` |
| `/pub/<slug>/` | one paper, its abstract, where to read it | any publication with an `abstract` |

The homepage is a funnel: masthead → Selected Research → Publications →
Conference Papers → Code → News → Education → Experience (compact) → a link to
`/cv/`. News sits below the papers deliberately — dated one-liners are the
weakest content on the page and should not be the first thing a stranger reads.
Experience on the homepage shows roles and dates only; the bullets are on
`/cv/`, driven by the same data and the same renderer.

## Page order and the jump nav

`homeSections()` and `cvSections()` in `build.js` are the two pages: one line
per section, in the order they appear. The row of jump links under the photo is
generated from that same list, so a section can never be missing from the nav,
and an empty section (no data) prints neither a heading nor a link. To move a
section, move its line; to rename it, change the title there; the anchor
(`#conference-papers`) follows the short nav label automatically.

## Add a news item

```js
{ date: "2026-10-01", text: `Passed my <strong>qualifying exam</strong>.` },
```

Sorts newest-first on its own.

## New CV or resume PDF

Edit the `.typ` file, then from `CV and Resume`:

```
bash publish.sh
```

Or double-click **PUBLISH.cmd**. It recompiles whatever changed, copies the PDFs
into the site, rebuilds, and pushes every repo that changed. Safe to run any
time — if nothing changed, it does nothing.

Give it a commit message and every repo it pushes uses that message instead of
the dated default:

```
bash publish.sh "Add the Maryland advisor"
```

| Flag | Effect |
|---|---|
| `"message"` or `-m "message"` | commit message for this run (default: `Update site (date)`) |
| `--dry` | show what it would do, change nothing |
| `--check` | also test every link (slower, needs network) |

To switch which resume the site serves, edit `SITE_RESUME` at the top of
`publish.sh`. There are two tracks:

| File | For |
|---|---|
| `resume-typst_Simulation_FEA.pdf` | FEA / simulation / R&D engineer roles |
| `resume-typst_ML_Data.pdf` | ML / data science roles |

---

## Other commands

| Command | What it does |
|---|---|
| `python -m http.server 8765` | Preview at localhost:8765 before pushing |
| `node check-links.js` | Test every link on the site |
| `node submit-indexnow.js` | Tell Bing and Yandex about new pages |

---

## Notes

- Repo is public because GitHub Pages only serves public repos on the free plan.
- `index.html`, everything in `pub/`, `sitemap.xml` and `robots.txt` are
  generated. Don't hand-edit them; `node build.js` overwrites them.
- `2f99fa9eca8a5a4dffe443ee83aa688c.txt` is the IndexNow ownership key. It has
  to stay at the site root, exactly as it is.
- Dark mode is the default. The button top-right switches to light.
