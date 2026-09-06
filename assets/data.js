/* ============================================================
   SITE CONTENT — this is the only file you normally edit.
   Add a publication, a news item, an award: edit the arrays below.
   Then run `node build.js` and push.
   ============================================================ */

const profile = {
  name: "Mostafa Jafarian Abyaneh",
  title: "PhD Student, Civil Engineering",
  // Shown beside the title and handed to search engines. Someone reading a
  // search result wants to know where you are before almost anything else.
  location: "College Park, Maryland",
  // Goes into the <title> of every page. Your name alone loses to several other
  // Mostafa Jafarians with older, better-linked pages; the institution is the
  // word that tells a search engine (and a human) which one you are.
  affiliation: "University of Maryland",
  image: "assets/profile.jpg",
  // The prior-institutions sentence is parked below, not deleted. Naming UConn
  // and two master's degrees in the opening paragraph invites "why so many
  // places?" before anyone has read a word about the research. The Education
  // section further down still lists every one of them, in date order, where
  // the context answers the question instead of raising it.
  //
  // To put it back, paste this at the end of `bio`:
  //   Before Maryland I spent a year of doctoral research at the University of
  //   Connecticut, and earned master's degrees at Dalhousie University and the
  //   Sharif University of Technology.
  bio: `I am a PhD student in Civil Engineering at the
        University of Maryland, College Park, working with
        Prof. Yunfeng Zhang
        in the Structural Engineering Laboratory.`,
  // Deliberately does NOT restate the Research Interests tags directly above it.
  // The tags name the fields; this says what is actually done, and with what.
  // One short line, then three bullets. The sentence is what a skimmer reads;
  // the bullets are what they scan. Keep each bullet to ONE line at the 38rem
  // masthead measure (~82 characters) — a bullet that wraps is a sentence
  // wearing a dot, and the point of the list is that the eye takes each one in
  // whole. If a bullet needs more, cut a word; do not widen the column again.
  // No lead-in sentence. Anything general enough to introduce the bullets either
  // restates the interest tags above or reads as a slogan; the bullets say what
  // the work is without help.
  research: ``,
  researchPoints: [
    `Constitutive modeling of metals, composites and granular materials`,
    `Nonlinear finite element analysis in Abaqus and Ansys, geometry in SolidWorks`,
    `Neural networks predicting material behavior from simulation and test data`,
  ],
};

const links = [
  // The .edu address is the right one to show while you are at Maryland — it is
  // the one that says you are there. It stops working when you graduate, so
  // swap in the personal one then: mailto:mjafarian13@gmail.com
  { name: "Email",    url: "mailto:mjafaria@umd.edu" },
  { name: "Scholar",  url: "https://scholar.google.com/citations?user=bxRWCD4AAAAJ&hl=en" },
  { name: "GitHub",   url: "https://github.com/mostafa-aby" },
  { name: "LinkedIn", url: "https://linkedin.com/in/mostafa-aby" },
  // ONE document, and clicking it gives you that document. A recruiter clicking
  // "CV" wants the file to read, print or attach — not a web page they then have
  // to find a download button on. The web version of the CV is still there and
  // still indexed; it is reached from "Full CV" in the nav row and from the link
  // at the bottom of the page, where someone browsing will look for it.
  //
  // "Resume" used to sit here too. Two links a recruiter reads as synonyms is a
  // decision you are making them make. The resume is also tailored per
  // application, so publishing one fixed version helps nobody — attach the right
  // one to the application instead. To put it back:
  //   { name: "Resume", url: "assets/resume.pdf" },
  // and restore the copy_if_diff line for resume.pdf in publish.sh.
  { name: "CV (PDF)", url: "assets/cv.pdf" },
];

const interests = [
  "Computational Solid Mechanics",
  "Nonlinear Finite Element Analysis",
  "Constitutive Modeling of Materials",
  "Composite &amp; Damage Mechanics",
  // Two tags, not one: the first is the keyword an AI/ML reader scans for and
  // will not find inside a domain-qualified phrase; the second keeps the claim
  // anchored to work he can actually evidence. Dropping the second would leave a
  // bare "Machine Learning" that any candidate can write.
  "Machine Learning &amp; Deep Learning",
  "Data-Driven Materials Modeling",
];

/* Publications.
   group         -> which section the entry appears under, keyed to pubSections
                    below. Mirrors the CV: archival journal work first, then
                    conference proceedings.
   status        -> colored badge: "published" | "review" | "revision" | "preprint" | "prep"
   slug          -> the permalink, e.g. /pub/cfft-piles-sand/
   abstract      -> VERBATIM published abstract, or null.
                    null means no detail page is generated for this paper.
                    NEVER paraphrase here — paste the real text or leave it null.
   abstractSource-> where the abstract text came from, shown as attribution.

   Order matters: entries render in the order written, so keep each group
   reverse-chronological, exactly as the CV lists them.                      */
const publications = [
  {
    slug: "cfft-piles-sand",
    group: "peer-reviewed",
    title: "Numerical Modeling of the Lateral Behavior of Concrete-Filled FRP Tube Piles in Sand",
    authors: "<strong>M. Jafarian Abyaneh</strong>, H. El Naggar, P. Sadeghian",
    venues: ["ASCE International Journal of Geomechanics, Vol. 20, No. 8, 04020108 — 2020"],
    status: "published",
    links: [
      { label: "DOI", url: "https://doi.org/10.1061/(ASCE)GM.1943-5622.0001725" },
      { label: "Full text (DalSpace)", url: "https://hdl.handle.net/10222/79694" },
      { label: "Scholar", url: "https://scholar.google.com/citations?user=bxRWCD4AAAAJ&hl=en" },
    ],
    // Paywalled at ASCE, so no abstract is reproduced here. If you want a
    // detail page for this paper, paste YOUR OWN accepted-manuscript abstract
    // (you hold the right to it) between backticks and rebuild. Never paste the
    // publisher's typeset text.
    abstract: null,
  },
  {
    slug: "rock-softening",
    group: "peer-reviewed",
    title: "Softening Behavior and Volumetric Deformation of Rocks",
    authors: "<strong>M. Jafarian Abyaneh</strong>, V. Toufigh",
    venues: ["ASCE International Journal of Geomechanics, Vol. 18, No. 8, 04018084 — 2018"],
    status: "published",
    links: [
      { label: "DOI", url: "https://doi.org/10.1061/(ASCE)GM.1943-5622.0001200" },
      { label: "Scholar", url: "https://scholar.google.com/citations?user=bxRWCD4AAAAJ&hl=en" },
    ],
    abstract: null,
  },
  {
    slug: "concrete-triaxial",
    group: "peer-reviewed",
    title: "Study of Behavior of Concrete under Axial and Triaxial Compression",
    authors: "V. Toufigh, <strong>M. Jafarian Abyaneh</strong>, K. Jafari",
    venues: ["ACI Materials Journal, Vol. 114, No. 4, pp. 619–629 — 2017"],
    status: "published",
    links: [
      { label: "DOI", url: "https://doi.org/10.14359/51689716" },
      { label: "ACI", url: "https://www.concrete.org/publications/internationalconcreteabstractsportal.aspx?m=details&i=51689716" },
    ],
    abstract: null,
  },
  {
    slug: "concrete-uniaxial-experimental",
    group: "peer-reviewed",
    title: "Experimental Study of Different Types of Concrete in Uniaxial Compression Test",
    authors: "K. Jafari, <strong>M. Jafarian Abyaneh</strong>, V. Toufigh",
    venues: ["International Journal of Civil and Environmental Engineering, Vol. 10, No. 12, pp. 1647–1651 — 2017"],
    status: "published",
    // WASET papers usually carry a Zenodo DOI. Find yours (search the title on
    // zenodo.org) and add it here: { label: "DOI", url: "https://doi.org/10.5281/zenodo...." }
    links: [],
    abstract: null,
  },
  {
    slug: "concrete-constitutive-uniaxial",
    group: "peer-reviewed",
    title: "Constitutive Modeling of Different Types of Concrete under Uniaxial Compression",
    authors: "<strong>M. Jafarian Abyaneh</strong>, K. Jafari, V. Toufigh",
    venues: ["International Journal of Civil and Environmental Engineering, Vol. 10, No. 12, pp. 1483–1486 — 2016"],
    status: "published",
    // Same as above — a Zenodo DOI probably exists for this one.
    links: [],
    abstract: null,
  },
  {
    slug: "masc-thesis",
    group: "peer-reviewed",
    title: "Numerical Modeling of Concrete-Filled Fiber-Reinforced Polymer Piles",
    authors: "<strong>M. Jafarian Abyaneh</strong>",
    // Google Scholar dates the deposit 2019; the degree completed in 2020.
    venues: ["Master's thesis, Dalhousie University — 2019"],
    status: "published",
    links: [{ label: "Full text (DalSpace)", url: "https://hdl.handle.net/10222/76578" }],
    abstract: null,
  },
  {
    slug: "frp-pile-soil-interaction-csce",
    group: "conference",
    title: "Soil–Structure Interaction Modeling of FRP Composite Piles",
    authors: "<strong>M. Jafarian Abyaneh</strong>, H. El Naggar, P. Sadeghian",
    venues: ["CSCE Annual Conference, Fredericton, NB, Canada — 2018"],
    status: "published",
    links: [{ label: "Full text (DalSpace)", url: "https://hdl.handle.net/10222/74111" }],
    abstract: null,
  },
  {
    slug: "tire-derived-aggregate-bridges",
    group: "conference",
    title: "Tire-Derived Aggregate Concrete for Bridge Applications",
    authors: "<strong>M. Jafarian Abyaneh</strong>, P. Sadeghian, H. El Naggar",
    venues: ["10th Int. Conference on Short and Medium Span Bridges (SMSB), CSCE, Quebec City, QC — 2018"],
    status: "published",
    links: [{ label: "Full text (DalSpace)", url: "https://hdl.handle.net/10222/74116" }],
    abstract: null,
  },
  {
    slug: "cfft-lateral-geoottawa",
    group: "conference",
    title: "Lateral Behaviour of Concrete-Filled FRP Tube Piles",
    authors: "<strong>M. Jafarian Abyaneh</strong>, H. El Naggar, P. Sadeghian",
    venues: ["GeoOttawa, Ottawa, ON, Canada — 2017"],
    status: "published",
    links: [{ label: "Full text (DalSpace)", url: "https://hdl.handle.net/10222/73400" }],
    abstract: null,
  },
];

/* The publication sections, in the order they appear on the page.
   Same split, same names as the CV. Add a "working" group here the day you
   have something under review:
     { key: "working", title: "Working Papers &amp; Under Review", short: "Working Papers" },
   A group with nothing in it prints no heading at all, so you can add the line
   before you have the paper. */
const pubSections = [
  { key: "peer-reviewed", title: "Publications", short: "Publications" },
  { key: "conference", title: "Conference Papers", short: "Conference" },
];

/* Talks and posters — kept apart from the publication list, as in the CV.
   type -> which section it belongs to, keyed to talkSections below.
   Empty for now; an empty section prints no heading and no nav link.

   {
     type: "conference",
     title: "Talk Title",
     authors: "<strong>M. Jafarian Abyaneh</strong>, ...",
     venue: "Meeting Name, City, ST",
     date: "Jun. 2018",
     note: "Poster presentation",
   },                                                                        */
const presentations = [];

const talkSections = [
  { key: "conference", title: "Conference Presentations", short: "Talks" },
  { key: "workshop", title: "Workshop Presentations", short: "Workshop" },
];

/* News is for things that are not already listed elsewhere on the page, or that
   a reader would want dated. Sorts newest-first on its own. */
const news = [
  { date: "2026-01-01", text: `Started my PhD in Civil Engineering at the University of Maryland, College Park, with Prof. Yunfeng Zhang.` },
  { date: "2024-09-01", text: `Began doctoral research at the University of Connecticut on composite constitutive modeling.` },
  { date: "2020-08-01", text: `Paper on concrete-filled FRP tube piles in sand published in the <em>ASCE International Journal of Geomechanics</em>.` },
  { date: "2018-08-01", text: `Paper on softening behavior and volumetric deformation of rocks published in the <em>ASCE International Journal of Geomechanics</em>.` },
];

/* ---- Selected research -------------------------------------------------
   The part of the page a stranger actually looks at. One entry per line of
   work: a one-line hook, then bullets — nobody reads a paragraph on a personal
   site. Keep each bullet to one line at reading width.

   RULE: an entry appears here only if the work behind it is already public —
   published, or posted as a preprint. That covers the figures AND the
   description: these cards explain how the method works, and that is not
   something to put on an indexed page before the paper is out.

   Entries for unpublished work stay in this file with `hidden: true`, written
   and ready. Delete that one line on the day the paper appears.

   FIGURES: none of the three published papers is open access, so their figures
   cannot be reposted here — ASCE and ACI hold that copyright. If you want a
   picture in one of these cards, make a NEW figure from your own model output
   rather than lifting one from the typeset PDF.                              */
const research = [
  {
    id: "cfft-piles",
    title: "What a composite pile actually does when you push it sideways",
    status: "published",
    hook: "Steel piles corrode. FRP tubes filled with concrete do not — but nobody could predict how they bend in soil.",
    points: [
      "A nonlinear finite element model built on the <em>disturbed state concept</em>, resolving the soil–FRP interface rather than assuming it away.",
      "Validated against <strong>full-scale field tests</strong> from a highway bridge on Route 40, Virginia.",
      "Handles material and geometric nonlinearity together, so the prediction holds at large lateral deflection.",
    ],
    links: [
      { label: "Paper", url: "https://doi.org/10.1061/(ASCE)GM.1943-5622.0001725" },
    ],
  },
  {
    id: "rock-softening",
    title: "Modeling rock after it has already started to fail",
    status: "published",
    hook: "Past its peak strength, rock keeps carrying load while it falls apart. Most models stop being useful exactly there.",
    points: [
      "Treats the material as an interpolation between a <em>relatively intact</em> and a <em>fully adjusted</em> state, with a disturbance function moving between them.",
      "Captures both the softening branch and the volumetric strain reversal that comes with it.",
      "Elastoplastic and disturbance parameters calibrated against triaxial test data for several rock types.",
    ],
    links: [
      { label: "Paper", url: "https://doi.org/10.1061/(ASCE)GM.1943-5622.0001200" },
    ],
  },
  {
    id: "concrete-triaxial",
    title: "Four kinds of concrete, squeezed from every direction",
    status: "published",
    hook: "Confine concrete and it gets stronger and far more ductile. How much depends on what the concrete is made of.",
    points: [
      "Uniaxial and triaxial compression testing of <strong>polymer concrete</strong> at three epoxy contents, ordinary cement concrete, lightweight concrete, and lime-mortar soil.",
      "Polymer concrete showed higher strength, ductility, and energy absorption than either ordinary or lightweight concrete.",
      "Constitutive parameters fitted to the measured stress–strain and volumetric-strain curves for each material.",
    ],
    links: [
      { label: "Paper", url: "https://doi.org/10.14359/51689716" },
    ],
  },
  {
    id: "cfrp-rve-composites",
    // HIDDEN until this work is published. Delete this one line then;
    // everything else is ready to go.
    hidden: true,
    title: "Randomized composite microstructures under damage",
    status: "prep",
    hook: "A carbon-fibre composite is never twice the same at the fibre scale. A model that ignores that predicts a part that does not exist.",
    points: [
      "Finite element simulation of the elastic–plastic response of randomized <strong>CFRP representative volume elements</strong>, including damage initiation and evolution.",
      "A Python pipeline generates geometry, mesh, and stochastic parameter sets, so hundreds of realizations run as one batch.",
      "<strong>Statistical sampling</strong> selects which realizations to run, covering the property space with far fewer simulations.",
    ],
    links: [],
  },
];

/* Public repositories worth a stranger's click.
   Empty for now — the Code section prints nothing until there is something in
   here. Add an entry when you push a repo:

   {
     name: "repo-name",
     url: "https://github.com/mostafa-aby/repo-name",
     lang: "Python",
     detail: "One line: what it does and who it is for.",
   },

   One repo may carry a `featured` block with a demo video; see your brother's
   data.js for the shape.                                                     */
const code = [];

const experience = [
  {
    role: "Doctoral Research Assistant",
    org: "University of Connecticut",
    location: "Storrs, CT",
    dates: "Sep. 2024 – Dec. 2025",
    points: [
      "Simulated the elastic–plastic response of randomized CFRP composite RVEs in Abaqus, resolving damage initiation and evolution.",
      "Automated the FE workflow in Python — geometry, meshing, stochastic parameter randomization — so many configurations run as one batch.",
      "Applied statistical sampling methods to the material randomization scheme, improving how well realizations span the property space.",
    ],
  },
  {
    role: "Data Analyst",
    org: "Freelance",
    location: "Fredericton, NB, Canada",
    dates: "Nov. 2020 – Aug. 2024",
    points: [
      "Delivered data preprocessing and standardization projects that improved client database accuracy and analytical reliability.",
      "Analyzed large-scale user datasets and turned the results into recommendations clients acted on.",
    ],
  },
  {
    role: "Graduate Research Assistant",
    org: "Dalhousie University",
    location: "Halifax, NS, Canada",
    dates: "Sep. 2017 – May 2020",
    points: [
      "Modeled the lateral behavior of concrete-filled FRP tube piles with a MATLAB nonlinear FE implementation, validated against full-scale field tests on a Virginia highway bridge.",
      "Modeled axial FRP pile behavior in multi-layered soil in PLAXIS 3D, including the soil–FRP interface.",
      "Ran uniaxial compression testing of tire-derived aggregate concrete specimens for bridge applications.",
    ],
  },
  {
    role: "Graduate Research Assistant",
    org: "Sharif University of Technology",
    location: "Tehran, Iran",
    dates: "Sep. 2014 – Jan. 2017",
    points: [
      "Investigated concrete behavior under uniaxial and triaxial compression across polymer, ordinary cement, lightweight, and lime-mortar materials.",
      "Developed a disturbed state concept constitutive model for the softening and volumetric response of rock under triaxial loading.",
      "Contributed to peer review for journal submissions in materials engineering.",
    ],
  },
];

/* Teaching gets its own section rather than a bullet inside Experience: for a
   faculty reader it is a category they look for. Empty prints nothing.

   {
     role: "Graduate Teaching Assistant",
     org: "University Name",
     location: "City, ST",
     dates: "Sep. 2026 – Dec. 2026",
     points: ["<strong>Course Name</strong> — what you actually did."],
   },                                                                        */
const teaching = [];

const education = [
  { degree: "Ph.D. in Civil Engineering", school: "University of Maryland, College Park", dates: "2026 – Present", note: `Advisor: Prof. Yunfeng Zhang · Structural Engineering Laboratory` },
  { degree: "Ph.D. in Civil / Structural Engineering", school: "University of Connecticut", dates: "2024 – 2025", note: "GPA 4.0/4.0 · Constitutive modeling of composite and soft materials" },
  { degree: "M.A.Sc. in Civil Engineering", school: "Dalhousie University", dates: "2017 – 2020", note: "GPA 3.4/4.0 · Thesis: Numerical modeling of concrete-filled fiber-reinforced polymer piles" },
  { degree: "M.Sc. in Civil / Structural Engineering", school: "Sharif University of Technology", dates: "2014 – 2017", note: "Thesis: Constitutive modeling of brittle materials under triaxial compression" },
  { degree: "B.Sc. in Civil Engineering", school: "Iran University of Science and Technology", dates: "2010 – 2014", note: "" },
];

/* Honors and Awards. Emptied 2026-09-06 to match the CV: its single entry was
   an NSERC grant to the lab, which is not a personal honour. An empty array
   prints no heading at all, so the section simply is not there. The Dalhousie
   education entry still records the funding, which is where it reads as fact
   rather than as an accolade. */
const awards = [];

/* Grants and awards that funded the research itself, as opposed to personal
   honors. Empty prints nothing. */
const funding = [];

/* Undergraduates you mentor, grouped by the program that funds the work.
   Empty prints nothing. See your brother's data.js for the shape.           */
const mentoring = [];

const affiliations = [];

/* Professional certifications, newest first. */
const certifications = [
  { name: "Complete TensorFlow 2 and Keras Deep Learning Bootcamp", issuer: "Udemy", date: "Aug. 2022" },
  { name: "Python for Machine Learning &amp; Data Science Masterclass", issuer: "Udemy", date: "Jun. 2022" },
  { name: "Improving Deep Neural Networks", issuer: "DeepLearning.AI on Coursera", date: "Apr. 2021" },
  { name: "Neural Networks and Deep Learning", issuer: "DeepLearning.AI on Coursera", date: "Apr. 2021" },
  { name: "Machine Learning", issuer: "Stanford University on Coursera", date: "Apr. 2021" },
  { name: "Python for Data Science and AI", issuer: "IBM on Coursera", date: "Sep. 2020" },
];

/* Standardised test scores. On the CV page only, never the homepage.
   Delete the entry (leave the array empty) once you are past the point where
   anyone asks — for a postdoc or an industry role, nobody does. */
/* Emptied 2026-09-06. Restore by pasting the entry back:
   "<strong>GRE General</strong> (Aug. 2022) — Total 314: Verbal 152, Quantitative 162, Analytical Writing 3.0" */
const testScores = [];

const skills = [
  { group: "Programming", items: "Python, MATLAB, SQL, LaTeX, Typst, Git" },
  { group: "Finite Element Packages", items: "Abaqus, Ansys Mechanical, PLAXIS 3D, SAP2000, ETABS" },
  { group: "Computer-Aided Design", items: "SolidWorks, Ansys SpaceClaim, AutoCAD" },
  // No "Molecular Dynamics" group and no "Bayesian Optimization": both were
  // retired from the skills list. They still appear in Experience, where they
  // describe work actually done rather than a capability being advertised.
  { group: "Machine Learning &amp; Data", items: "PyTorch, TensorFlow, Keras, Scikit-learn, Pandas, NumPy, SciPy" },
  // No "Methods" group: this section lists tools, and methods are what the
  // Experience and Publications sections already show. Kept out of all three
  // documents deliberately — see check-consistency.py.
];
