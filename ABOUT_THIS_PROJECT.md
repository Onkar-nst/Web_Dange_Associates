# About This Project: Dange Associates Website

A complete guide for anyone new to this codebase, whether you're a developer or an AI assistant. Read this before changing anything. It explains what the site is, where every piece of data lives, where form submissions go, and which parts are fragile.

> **Snapshot date:** 25 September 2026. This describes the `feature/project-detail-pages` branch (commit `b3e9c77`). The `main` branch does **not** yet have the project detail pages, the 3D fly-through, the motion components or `lib/projects.js`. See [Branches](#12-git-branches-and-deployment).

---

## 1. What this is

**Dange Associates** is a real estate company in Kalmeshwar, near Nagpur, Maharashtra. It develops **residential plotted layouts**: land divided into legally sanctioned, clear-title plots that families buy to build homes on. It also sells some ready-to-move homes. The company says it has been running since 2006/2007 (the site states both years; see known issues). The founder is **Pramod Dange**, and **Vedant Dange** is the contact person for enquiries.

This repo is the company's **marketing website**. Its job is to:

1. Show the company's projects (current, ready-to-move, completed).
2. Build trust by stressing clear titles, transparent paperwork and a long track record.
3. **Generate leads**: get visitors to call, WhatsApp or submit a form.

The site is **bilingual**: English and Marathi, switched with a button in the navbar.

| Quick facts | |
|---|---|
| Framework | Next.js 16 (App Router), React, JavaScript (a few `.ts`/`.tsx` files) |
| Styling | Tailwind CSS 3 |
| Animation | framer-motion, Lenis smooth scroll, Three.js for the 3D fly-through |
| Database | Supabase (hosted Postgres), used **only** to store form submissions |
| Hosting | Vercel (project name `dange-developers`) |
| Custom backend or API routes | **None.** The browser writes to Supabase directly. |
| Tests | None |
| GitHub | https://github.com/Onkar-nst/Web_Dange_Associates |

---

## 2. Run it locally

```bash
cd dange-developers
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also a quick check that everything compiles)
npm run start      # serve the production build
```

- You don't need any environment variables. The Supabase URL and key are hardcoded in `lib/supabaseClient.js` (see [Security notes](#14-security-notes)).
- `.env.local` contains only a `VERCEL_OIDC_TOKEN`, created by the Vercel CLI (`vercel env pull`). The app doesn't read it. It is gitignored. Never commit it.
- `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so type errors will **not** fail the build.
- Installed versions at time of writing: next 16.1.1, react 18.3.1, three 0.186.1, framer-motion 12.5.0, lenis 1.3.26, @supabase/supabase-js 2.89.0, tailwindcss 3.4.17. Node 23 was used locally.

---

## 3. Folder map

```
dange-developers/
├── app/                          ← Next.js App Router: every folder = a URL
│   ├── layout.jsx                ← Root HTML shell: fonts, smooth scroll, scroll bar, LanguageProvider
│   ├── template.jsx              ← Wraps every page in a fade-in transition
│   ├── globals.css               ← Tailwind + Lenis CSS + custom keyframes (THE stylesheet in use)
│   ├── page.jsx                  ← "/"            Home page
│   ├── about-us/page.jsx         ← "/about-us"    Our Story page
│   ├── contact/page.jsx          ← "/contact"     Contact page + contact form
│   └── projects/
│       ├── page.jsx              ← "/projects"    All projects with filter tabs
│       └── [slug]/page.jsx       ← "/projects/<slug>"  One project's detail page (statically generated)
│
├── components/                   ← All UI. Almost everything is a client component ("use client").
│   ├── Navbar.jsx                ← Top nav + English/मराठी toggle button
│   ├── Footer.jsx                ← Footer: phones, email, address, map link, hours
│   ├── LanguageContext.jsx       ← Global "en" | "mr" state
│   ├── HeroSection.jsx           ← Home: headline, CTAs, stats
│   ├── BrandStatement.jsx        ← Home: "Building Trust" block
│   ├── ProjectShowcase.jsx       ← Home: 3 featured project cards (own hardcoded list!)
│   ├── TrustSection.jsx          ← Home: 4 trust pillars
│   ├── ProcessTimeline.jsx       ← Home: 5-step buying process
│   ├── ImpactStats.jsx           ← Home: 18+ / 12+ / 1200+ counters
│   ├── Testimonials.jsx          ← Home: scrolling review cards (hardcoded)
│   ├── HomeEnquiry.jsx           ← Home: WhatsApp button + "call back" form → Supabase
│   ├── AboutUs.jsx               ← Entire About page body (founder story, mission, vision)
│   ├── Projects.jsx              ← Entire /projects page body (reads lib/projects.js)
│   ├── SiteVisitEnquiry.jsx      ← "Plan your site visit" block (call/WhatsApp; list is NOT a form)
│   ├── Contactform.jsx           ← Contact page form → Supabase
│   ├── project-detail/
│   │   └── ProjectDetail.jsx     ← Whole project detail page (hero, overview, amenities, map, …)
│   ├── project3d/                ← The Three.js 3D fly-through (Shree Ram Nagri-1 only)
│   │   ├── LayoutFlythrough.jsx  ← React wrapper: scroll tracking, chapter text overlays, fallback
│   │   ├── LayoutScene.js        ← Three.js scene class (~1,600 lines): builds and animates the world
│   │   ├── layoutPlan.js         ← Geometry constants: plot sizes, road positions, amenity zones
│   │   └── textures.js           ← Procedurally drawn textures (canvas → texture), colours
│   ├── motion/                   ← Small reusable animation helpers
│   │   ├── Reveal.jsx            ← Fade/slide in on scroll; exports `stagger`, `rise` variants
│   │   ├── CountUp.jsx           ← Animates "1200+" from 0 when visible
│   │   ├── TiltCard.jsx          ← Pointer-following 3D tilt card
│   │   ├── PageTransition.jsx    ← Opacity fade used by app/template.jsx
│   │   ├── ScrollProgress.jsx    ← Thin gradient progress bar at top of the page
│   │   └── SmoothScroll.jsx      ← Starts Lenis; exposes it as window.__lenis
│   └── ui/                       ← shadcn/ui primitives (button, input, textarea), used only by Contactform
│
├── lib/
│   ├── projects.js               ← ★ Single source of truth for project data (bilingual)
│   ├── supabaseClient.js         ← Creates the Supabase client (URL + anon key hardcoded)
│   └── utils.ts                  ← `cn()` class-name merge helper for shadcn components
│
├── public/                       ← Static images served at "/<filename>"
│   ├── navbar-logo-removebg-preview.png   ← Logo
│   ├── hero-bg.png, hero-legacy.png, hero-transparency.png  ← Big section images (~0.7–1 MB each)
│   ├── project-imgg.jpg          ← Shree Ram Nagri-1 master layout image (reused as a placeholder elsewhere)
│   ├── ghar.jpg                  ← Ready-to-move homes photo
│   └── pramod.jpeg               ← Founder photo
│
├── styles/globals.css            ← UNUSED leftover. Nothing imports it; edit app/globals.css instead.
├── tailwind.config.js            ← Brand colours, Poppins font, fadeIn/float/shimmer animations
├── next.config.mjs               ← Ignores TS build errors, unoptimized images, optional v0 config merge
├── components.json               ← shadcn/ui config (references tailwind.config.ts, which doesn't exist; harmless)
├── .vercel/project.json          ← Links this folder to the Vercel project (gitignored)
└── package.json                  ← Package is still named "my-v0-project" (originally scaffolded with v0.dev)
```

---

## 4. Pages and how each is built

| URL | Route file | What renders it | Rendering |
|---|---|---|---|
| `/` | `app/page.jsx` | Navbar → HeroSection → BrandStatement → ProjectShowcase → TrustSection → ProcessTimeline → ImpactStats → Testimonials → HomeEnquiry → Footer | Client component, prerendered at build |
| `/about-us` | `app/about-us/page.jsx` | Navbar → AboutUs → Footer | Client component |
| `/projects` | `app/projects/page.jsx` | `components/Projects.jsx` (includes its own Navbar, hero, filter tabs, grid, SiteVisitEnquiry, Footer) | Client component |
| `/projects/[slug]` | `app/projects/[slug]/page.jsx` | `components/project-detail/ProjectDetail.jsx` | **Server** route file: `generateStaticParams()` pre-builds one page per project in `lib/projects.js`, `generateMetadata()` sets the page title and description, unknown slugs return 404 via `notFound()`. The page body itself is a client component. |
| `/contact` | `app/contact/page.jsx` | Contact cards (address, phone, email) + `Contactform` | Client component |

**Every page wraps its own `<Navbar />` and `<Footer />`.** They are not in the root layout. A new page must include them itself.

**Shell applied to every page** (`app/layout.jsx` + `app/template.jsx`):
`<html>` → Poppins font from Google Fonts → `SmoothScroll` (Lenis) → `ScrollProgress` bar → `LanguageProvider` → `PageTransition` fade → page.

**Detail page sections** (`ProjectDetail.jsx`, in order):
Hero (image, status badge, breadcrumbs, stats) → *[only if `has3D`]* FlythroughIntro + LayoutFlythrough → Overview (long description, facts, highlights, call/WhatsApp) → Amenities → Gallery (only if `gallery` has entries; opens a lightbox) → Location (embedded Google Map + connectivity list + "Get directions") → Other projects → SiteVisitEnquiry → Footer.

Project slugs: `shree-ram-nagri-1`, `ready-to-move-homes`, `dange-layout-1`, `dange-layout-2`, `dange-layout-3`, `dange-layout-4`, `om-sai-ram-nagar-1`, `om-sai-ram-nagar-2`.

---

## 5. Where the data comes from

There is **no CMS and no database reads**. All content is hardcoded in source files. It lives in three kinds of places.

### 5a. `lib/projects.js`: the project database (the good path)

This is the single source of truth for the `/projects` list and every `/projects/[slug]` page. It exports:

- `projects`: an array of project objects.
- `getProject(slug)`: finds one project by slug.
- `t(field, language)`: reads a bilingual field. Returns `field[language]`, falls back to `field.en`, and returns plain strings unchanged.

Shape of one project (every text field is `{ en, mr }`):

```js
{
  slug: "shree-ram-nagri-1",        // URL segment, must be unique
  has3D: true,                      // only Shree Ram Nagri-1; shows the 3D fly-through
  statusType: "current",            // "current" | "ready" | "completed" → filter tabs + badge colour
  status:   { en, mr },             // badge text
  name:     { en, mr },
  location: { en, mr },
  mapQuery: "State Highway 250, …", // plain string sent to Google Maps (search, embed, directions)
  image:     "/project-imgg.jpg",   // card image (local /public path or full URL)
  heroImage: "/project-imgg.jpg",   // detail page hero background
  tagline:     { en, mr },          // also used in <meta description>
  description: { en, mr },          // short card text
  longDescription: { en: [para, …], mr: [para, …] },
  stats:        [{ value: "140+", label: { en, mr } }],   // value may be numeric-ish ("140+") → CountUp animates it
  facts:        [{ label: { en, mr }, value: { en, mr } }],
  highlights:   [{ en, mr }],
  amenities:    [{ icon: "pool", label: { en, mr } }],     // icon key must exist in ICONS map (see below)
  connectivity: [{ icon: "highway", label: { en, mr }, note: { en, mr } }],
  gallery:      [{ src, caption: { en, mr } }],            // optional; Gallery section hidden if empty
}
```

**Valid `icon` keys** (defined in the `ICONS` map in `ProjectDetail.jsx`, mapped to lucide-react icons): `entrance, road, trees, light, garden, walk, kids, club, pool, sports, fence, water, home, docs, school, shop, highway, town, industry, city`. An unknown key will break rendering of that item. Add it to `ICONS` first.

> The file's own header note says the plot counts, amenities and landmarks were written from what was already on the site and **must be checked against the sanctioned layouts before publishing**.

### 5b. Hardcoded copy inside components

Everything else (headlines, paragraphs, testimonials, stats, contact details) is written inline in the component files as:

```jsx
{language === "en" ? "English text" : "मराठी मजकूर"}
```

| Content | File |
|---|---|
| Home hero headline, subtext, CTAs, "18+" / "1200+" stats | `HeroSection.jsx` |
| "Building Trust" statement, "Established Since 2006" | `BrandStatement.jsx` |
| Trust pillars (Document Transparency, Guaranteed Registry, …) | `TrustSection.jsx` |
| 5-step buying process | `ProcessTimeline.jsx` |
| 18+ years / 12+ layouts / 1200+ families | `ImpactStats.jsx` **and again** in `AboutUs.jsx`, `HeroSection.jsx`, `TrustSection.jsx` |
| Testimonials (6 named reviews) | `Testimonials.jsx` |
| Founder bio, journey, mission, vision, "Established 2007" | `AboutUs.jsx` |
| Page SEO title/description for the whole site | `app/layout.jsx` (`metadata`) |
| 3D fly-through chapter text | `project3d/LayoutFlythrough.jsx` (`CHAPTERS`, `STAGES`, `LABELS`) |

### 5c. Duplicated project lists (watch out)

Two components **do not** read `lib/projects.js`. They keep their own copies:

| File | What it holds | Risk |
|---|---|---|
| `ProjectShowcase.jsx` (home page) | 3 featured projects with slug, name, location, status, image | Already out of sync: says Om Sai Ram Nagar 1 is **"Few Plots Left"**, while `lib/projects.js` says **"Completed"**. |
| `SiteVisitEnquiry.jsx` | List of 8 project names with short IDs (`SRN1`, `DL1`, …) | Must be updated by hand when a project is added. |

When you add, rename or change the status of a project, update `lib/projects.js` **and** these two files.

### 5d. Contact details (hardcoded in many places)

| Detail | Value | Files |
|---|---|---|
| Main phone / WhatsApp | +91 7774882844 (`tel:+917774882844`, `https://wa.me/917774882844`) | `Footer.jsx`, `HomeEnquiry.jsx`, `SiteVisitEnquiry.jsx`, `app/contact/page.jsx`, `project-detail/ProjectDetail.jsx`, `project3d/LayoutFlythrough.jsx` |
| Second phone | +91 9112379641 | `Footer.jsx` |
| Email | vedantdange18@gmail.com | `Footer.jsx`, `app/contact/page.jsx` |
| Office address | Block No. 7, Khadi Gram Sankul, beside ICICI Bank, Kalmeshwar, Maharashtra 441501 | `Footer.jsx`, `app/contact/page.jsx` |
| Google Maps listing | https://maps.app.goo.gl/rY8LgCF5mFvbzYpRA | `Footer.jsx`, `Testimonials.jsx` ("Review us on Google") |
| Working hours | Mon–Sat, 09:00 AM – 06:00 PM | `Footer.jsx` |

To change a phone number, search the whole repo for `7774882844`.

---

## 6. Where the data goes: the "backend"

### 6a. The short version

There is **no server code** in this project: no `app/api/` routes, no server actions, no middleware. The only backend is **Supabase**, and the browser talks to it directly.

```
Visitor's browser
   │  fills a form (HomeEnquiry or Contactform)
   ▼
supabase.from("contact_form").insert([formData])      ← lib/supabaseClient.js (anon key)
   │  HTTPS request straight from the browser
   ▼
Supabase project  https://iwhdfmxogattudshufqe.supabase.co
   └── Postgres table: public.contact_form            ← leads are stored here
         │
         ▼
   Someone opens the Supabase dashboard → Table Editor → contact_form to read the leads
```

**Nothing else happens after the insert.** The code sends no email, WhatsApp or SMS notification, and there is no webhook. Unless a Supabase database webhook or trigger was set up in the dashboard (it can't be seen from this repo), the team has to check the table by hand.

### 6b. The two forms that write data

| Form | Where it appears | Fields sent | Validation | Success message |
|---|---|---|---|---|
| **Call-back form**: `components/HomeEnquiry.jsx` | Home page, section `#contact-section` (the hero's "Book Free Site Visit" button scrolls here) | `{ name, phone, project }`. `project` is actually a **location** from a dropdown: `Kalmeshwar`, `Wardha Road`, `Hingna`, or empty. | HTML `required` on name and phone | "✓ Success! Our team will contact you in 30 minutes." |
| **Contact form**: `components/Contactform.jsx` | `/contact` page | `{ name, email, phone, message }` | JS check: name and email required | "Submitted successfully!" |

Both insert into the **same table**, `contact_form`. So the table must have (at least) these columns, all nullable except as the database defines:
`name`, `email`, `phone`, `message`, `project`, plus whatever Supabase adds by default (such as `id`, `created_at`).

> The table schema and Row Level Security (RLS) policies live in the Supabase dashboard, **not in this repo** (there are no migrations). For the forms to work, RLS must allow the `anon` role to `INSERT` into `contact_form`. It should **not** allow `anon` to `SELECT`, because the anon key is public and anyone could read every lead. Verify this in the dashboard.

On error, both forms log to the browser console and show a "failed / try again" message.

### 6c. Things that look like forms but aren't

- **`SiteVisitEnquiry.jsx`**: the "Select a Project" list only highlights the clicked project in local state. **It submits nothing and stores nothing.** The real actions are its "Call Executive" (`tel:`) and "WhatsApp Us" (`wa.me`) buttons.
- **Call / WhatsApp buttons** across the site: plain links to `tel:+917774882844` and `https://wa.me/917774882844`. Nothing is tracked.

### 6d. Other external services the site calls

| Service | Used for | Where |
|---|---|---|
| Google Fonts | Poppins font (`<link>` in `<head>`) | `app/layout.jsx` |
| Google Maps | Search links, `<iframe>` embed (`maps.google.com/maps?q=…&output=embed`), directions links, all built from `project.mapQuery` | `Projects.jsx`, `ProjectDetail.jsx` |
| Unsplash | Some background/section images and Dange Layout 4's image, hotlinked | `AboutUs.jsx`, `lib/projects.js` |
| Wikimedia | Google Maps icon in the testimonials badge | `Testimonials.jsx` |
| WhatsApp (`wa.me`) | Chat links | several |
| Vercel | Hosting and deploys | outside the code |

There is **no analytics**: no Google Analytics, Meta Pixel or Vercel Analytics.

---

## 7. The language system (English / Marathi)

- **State:** `components/LanguageContext.jsx` holds `language`, either `"en"` or `"mr"`, and `toggleLanguage()`. The default is `"en"`.
- **Provider:** wrapped around every page in `app/layout.jsx`, so the choice **survives client-side navigation** (clicking links).
- **Not persisted:** it isn't saved in localStorage, a cookie or the URL. A full page reload or opening a link in a new tab goes back to English. Search engines only see English (`<html lang="en">`).
- **Toggle button:** in `Navbar.jsx`. It shows "मराठी" when in English and "English" when in Marathi.
- **Reading text in components:** `const { language } = useLanguage();` then either `language === "en" ? "…" : "…"` (older components) or `t(field, language)` for data from `lib/projects.js`. The 3D component uses its own tiny `L(field)` helper.
- **Rule:** every piece of visible text must have both English and Marathi. The Marathi was not professionally reviewed. For example, "clear title" is translated as "स्पष्ट शीर्षक", which literally means a clear *heading*, not a legal title.

---

## 8. Motion and scrolling

| Piece | What it does | Notes |
|---|---|---|
| `SmoothScroll.jsx` | Starts **Lenis** inertial scrolling site-wide; stores the instance on `window.__lenis`; jumps to top on route change; anchor links offset by 96px (navbar height) | Skipped if the user prefers reduced motion. `app/globals.css` has the required Lenis CSS. |
| `ScrollProgress.jsx` | 3px blue→orange bar at the top showing scroll progress | Fixed, `z-[60]` |
| `PageTransition.jsx` + `app/template.jsx` | Fades each page in | **Opacity only on purpose:** a transform would break `position: fixed/sticky` children (navbar, 3D stage). |
| `Reveal.jsx` | Wrap anything to fade/slide it in on scroll. Also exports `stagger()` and `rise` variants for lists. | Used in newer components |
| `CountUp.jsx` | Animates the number inside strings like `"1200+"` when visible | Non-numeric values ("SH-250", "✓") display unchanged |
| `TiltCard.jsx` | Pointer-following tilt + glare on project cards | Mouse only; touch gets a flat card |

Older components (AboutUs, Testimonials, etc.) call framer-motion directly instead of using these helpers.

---

## 9. The 3D fly-through (Shree Ram Nagri-1)

The most complex part of the codebase. It appears on `/projects/shree-ram-nagri-1` because that project has `has3D: true`.

**What the visitor sees:** a very tall section (`height: 900vh`) with a sticky full-screen canvas. As they scroll, the camera flies over a 3D model of the layout: master plan from above → highway frontage → drive in through the gate → numbered plots → amenities (garden, clubhouse, pool, court) → a highlighted "hero plot" → a house being built on it in stages → a finished neighbourhood at dusk. Text "chapters" fade in and out on top, and a chapter rail lets users jump between them.

**How it's wired:**

```
ProjectDetail.jsx
  └─ dynamic(() => import("../project3d/LayoutFlythrough"), { ssr: false })   ← client only, code-split
        LayoutFlythrough.jsx  (React)
          ├─ checks WebGL support → if none, shows a fallback: the master layout image
          ├─ lazy-imports LayoutScene.js and calls scene.init() (builds the world step by step, reports load %)
          ├─ scroll listener → progress p (0…1) = how far through the 900vh section → scene.setProgress(p)
          ├─ IntersectionObserver → scene.start()/stop() so it only renders while on screen
          ├─ ResizeObserver → scene.resize(); pauses when the tab is hidden
          ├─ CHAPTERS / STAGES / LABELS arrays → text overlays keyed to progress ranges
          └─ jumpTo(i) → scrolls (via window.__lenis if present) to a chapter
        LayoutScene.js  (plain Three.js class, no React)
          ├─ TIMELINE {sweep, markerIn, markerOut, build, society, dusk} progress ranges
          ├─ build*() methods: environment, ground, roads/walls, plot blocks, amenities, trees,
          │   vehicles, "society" (houses), hero plot, markers, camera path
          ├─ Batch class merges many small meshes into one draw call (performance)
          └─ update() per frame: camera along keyframed path, dusk lighting, house build-up, labels
        layoutPlan.js   → all geometry numbers: plot 9×15 units (≈30×50 ft), road widths, 5 rows,
                          8 west + 6 east columns, positions of gate, park, club, pool, court, highway;
                          picks `heroPlot`; small maths helpers (lerp, easing, seeded rng)
        textures.js     → every texture drawn on a <canvas> at runtime (grass, site plan, highway,
                          signboard, etc.) + the COLORS palette. No image files are loaded.
```

**Important rules:**

- **The chapter progress ranges in `LayoutFlythrough.jsx` (`CHAPTERS[].range`) must line up with `TIMELINE` and the camera keyframes in `LayoutScene.js`.** Both files have comments saying so. Change one and you must change the other.
- The 3D content is **hardcoded for Shree Ram Nagri-1**: its name, "140+ plots" and SH-250 are in the chapter text, and the geometry lives in `layoutPlan.js`. Setting `has3D: true` on another project would show *this same model*. A real 3D view for another layout needs its own plan data and text.
- Mobile gets lower quality automatically: no shadows, pixel ratio capped at 1.5. Reduced-motion users are respected.
- The model is illustrative. It is not surveyed from the actual sanctioned layout.

---

## 10. Styling

- **Tailwind CSS 3**, configured in `tailwind.config.js`. Brand colours: `primary` = `#1e40af` (blue-700), `secondary` = `#f97316` (orange-500). Font utility: `font-poppins`. Custom animations: `animate-fade-in`, `animate-float`, `animate-shimmer`.
- **The live stylesheet is `app/globals.css`.** It contains Tailwind directives, CSS variables, Lenis styles and extras. `styles/globals.css` is an unused leftover.
- The design language uses big bold headings, rounded-2xl/3xl cards, soft shadows, blue + orange accents and slate neutrals.
- `components/ui/*` are shadcn/ui components. They're used only by `Contactform.jsx`.
- `Inter` is imported in `app/layout.jsx` but not applied. Poppins is the actual font.

---

## 11. Images

- Local images are in `public/` and referenced as `/filename.jpg`.
- `next.config.mjs` sets `images.unoptimized: true`, so `next/image` does **not** resize or compress. The hero PNGs are 0.7–1 MB each and are served as-is.
- Several projects reuse `/project-imgg.jpg` or hero PNGs as **placeholders** because real photos for those layouts don't exist yet.
- Dange Layout 4 and parts of About Us use hotlinked Unsplash stock images.

---

## 12. Git branches and deployment

| Branch | Contents |
|---|---|
| `main` | Production code as of April 2026. It has the home, about, projects list and contact pages. |
| `feature/project-detail-pages` | Everything in `main` **plus** `/projects/[slug]` detail pages, the 3D fly-through, `lib/projects.js`, the motion components, `app/template.jsx`, and refreshed home sections. Pushed 25 Sep 2026 and **not yet merged**. |

- **Hosting:** Vercel, project `dange-developers` (linked via `.vercel/project.json`). Vercel normally deploys the production branch (usually `main`) automatically and makes preview deploys for other branches. Confirm the setup in the Vercel dashboard.
- **To ship the feature branch:** open a PR into `main` and check the Vercel preview first.
- History: started in March 2025 by Sumit Nayak and Onkar Dange (`Onkar-nst`). The Marathi toggle was added in May 2025 ("language button added by deeptanu"). The UI was redesigned in Feb 2026, dependencies were pruned in April 2026, and the detail pages and 3D view were added in Sep 2026.

---

## 13. Common tasks: which file to edit

| I want to… | Edit |
|---|---|
| Add a new project | 1) Add an object to `lib/projects.js` (unique `slug`, all `{en, mr}` fields, valid `icon` keys). The `/projects` grid and `/projects/<slug>` page appear automatically. 2) Add it to `SiteVisitEnquiry.jsx`'s list. 3) If it should be featured on the home page, add it to `ProjectShowcase.jsx`. 4) Put images in `public/`. |
| Change a project's status | `lib/projects.js` (`statusType` + `status` + the Status `fact`) **and** `ProjectShowcase.jsx` if it's featured |
| Change a phone number or email | Search the repo for the old value (see §5d); it appears in up to 6 files |
| Change home page text | The matching component in §5b, in both languages |
| Change "18+ years", "12+ layouts" or "1200+ families" | `ImpactStats.jsx`, `AboutUs.jsx`, `HeroSection.jsx`, `TrustSection.jsx` |
| Change the browser tab title / SEO description | `app/layout.jsx` (site-wide); detail pages build theirs in `app/projects/[slug]/page.jsx` |
| Add a new page | Create `app/<name>/page.jsx`, include `<Navbar />` and `<Footer />`, use `useLanguage()` for text, add a link in `Navbar.jsx`'s `navLinks` (and the footer if needed) |
| Add a nav link | `navLinks` array in `Navbar.jsx` |
| See form submissions (leads) | Supabase dashboard → project `iwhdfmxogattudshufqe` → Table Editor → `contact_form` |
| Add a field to a form | Add the input + state in the component **and** add the column to `contact_form` in Supabase first, or the insert will fail |
| Get notified of new leads | Not built. Options: a Supabase Database Webhook → email/WhatsApp service, or move the insert into a Next.js API route that also sends a notification. |

---

## 14. Security notes

- **The Supabase anon key is hardcoded** in `lib/supabaseClient.js` and committed to Git. Supabase anon keys are *designed* to be public, but **only if RLS is set up correctly**. Make sure `contact_form` allows anonymous `INSERT` only, never `SELECT`, `UPDATE` or `DELETE`. It would still be cleaner to move the URL and key to `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars in Vercel.
- **Never commit** `.env.local` or anything in `.vercel/`. Both are gitignored.
- The forms have no spam protection (no captcha and no rate limit), and the call-back form accepts any phone format.
- Leads are personal data (name, phone, email). A privacy policy page is linked in the footer but **doesn't exist yet** (see below).

---

## 15. Known issues and gotchas

Found while reading the code and during a brand review. **None have been fixed yet.** Confirm with the owner before "fixing" any business facts.

**Broken or missing**
- Footer links `/privacy-policy`, `/terms` and "Sitemap" (`#`) go nowhere. Those pages don't exist. The label also says "Term of Use" instead of "Terms of Use".
- The footer social icons (Facebook, Instagram, YouTube, LinkedIn) all link to `#`.
- The home "Building Trust," heading ends with a stray comma. The rest of the sentence is missing, in both languages (`BrandStatement.jsx`).
- The "Select a Project" list in `SiteVisitEnquiry.jsx` does nothing when clicked.
- The call-back form promises a reply "in 30 minutes", but nothing notifies the team.

**Data that disagrees**
- Founding year: "Established Since 2006" (`BrandStatement.jsx`) vs "Established 2007" / "since 2007" (`AboutUs.jsx`, `Projects.jsx`).
- Om Sai Ram Nagar 1: "Few Plots Left" (home) vs "Completed" (projects).
- The town is spelled **"Kalemshwar"** in project locations and `mapQuery` strings but **"Kalmeshwar"** elsewhere. The official spelling is Kalmeshwar, and the misspelling can affect map searches.
- The site claims "12+ completed layouts" but lists 6 completed projects.
- The call-back form's locations (Wardha Road, Hingna) don't match any listed project, and they are saved into a column named `project`.
- The site title reads "Land Associate by Dange Associate", and `generator: "v0.dev"` is still in `app/layout.jsx`.
- The brand statement mentions "flats" and "townships", which the company doesn't list.

**Legal/compliance (needs a human decision)**
- No MahaRERA registration numbers are shown for projects still being sold. Real estate ads in Maharashtra normally must show them.
- The site uses guarantee language ("100% legal guarantee", "Guaranteed Registry") and investment claims ("gold standard for investment", a testimonial saying "rates have doubled").
- The testimonials are hardcoded. Confirm they're real and that the people consented.

**Technical**
- `typescript.ignoreBuildErrors: true` hides type errors.
- Images are unoptimized and some are ~1 MB PNGs.
- `LanguageContext.jsx` imports an unused `use` from React.
- `app/contact/page.jsx` uses the class `hover:scale-195`, which isn't a real Tailwind value and so has no effect.
- The language choice resets on reload.
- `styles/globals.css` is dead code, and `Inter` is imported but unused.
- There are no tests, no linter config and no CI.

---

## 16. Guidance for AI assistants and new contributors

1. **Project data belongs in `lib/projects.js`.** Don't add new hardcoded project lists. If you touch `ProjectShowcase.jsx` or `SiteVisitEnquiry.jsx`, consider making them read from `lib/projects.js` (with the owner's OK).
2. **Always write both languages.** New visible text needs an `en` and an `mr` version. Flag Marathi you're unsure of for a native speaker.
3. **Don't change business facts** (years, counts, statuses, prices, legal claims, phone numbers) without confirmation from the Dange Associates team. Several are known to be inconsistent (§15). Ask which value is correct.
4. **Keep the 3D timeline in sync.** Edit `CHAPTERS` in `LayoutFlythrough.jsx` and `TIMELINE` / camera keyframes in `LayoutScene.js` together.
5. **Don't add transforms to `PageTransition`.** It would break the fixed navbar and the sticky 3D stage.
6. **Forms write straight to Supabase.** Adding a form field needs a matching column in the `contact_form` table.
7. **Run `npm run build` before pushing.** TypeScript errors won't stop the build, but JSX and import errors will.
8. **Don't push directly to `main`** without the owner's go-ahead. It probably deploys to the live site.
9. **Never commit secrets.** Keep `.env.local` and `.vercel/` out of Git.
10. **Update this file** when you change the architecture, the data flow or the Supabase setup.
