# CLAUDE.md: project guide

Orientation for AI assistants (and humans) working on this repository.

## What this is

The personal portfolio website of Eza Nanda, a Quality Assurance Engineer (Mekari / Flexidev / Digilogik).
It is a single-page static site: one `index.html`, one stylesheet, one script. It is deployed as static
files (GitHub Pages style) and must keep working with no build step, no framework, and no bundler.
`index.html` must stay directly openable in a browser.

**The content is this person's real résumé.** Never invent, embellish, or "fix" job titles, dates, employers,
certifications, or project claims. If content looks wrong, ask the owner instead of guessing.

## File map

| File | What lives there |
|---|---|
| `index.html` | Everything, in order: head/SEO → header/nav → `#home` hero → `#about` → `#skills` (chip grid) → `#experience` (2-column timeline) → `#projects` (4-per-row cards) → `#education` → `#certificates` + `#courses` (both use the shared `.cards-2` / `.info-card` component) → `#contact` (EmailJS form) → footer → all modals at the end of `<body>`. Nav link order must match section order, because the scroll-spy derives the section list from the nav links |
| `Assets/style.css` | Single stylesheet with a numbered table of contents at the top. Design tokens (colors, glows) are CSS custom properties in `:root`. Change colors there, not inline |
| `Assets/main.js` | All interactions, loaded with `defer`. Sections: typed.js guard → modal system → lightbox → keyboard handling → scroll-spy → contact form → footer year |
| `Assets/Images/` | Web-compressed images only (≤1200px). Kebab-case filenames |
| `_originals/` | Untracked local folder with the uncompressed originals. Never commit it |

## Architecture contracts (main.js ↔ index.html)

These `data-` attributes wire everything; keep them consistent:

- Open a modal: any element with `data-modal-target="#modal-id"`. One delegated click handler on
  `document` handles all of them; the *innermost* target wins (an icon inside a clickable card can open a
  different modal than the card).
- Close a modal: `<button type="button" data-modal-close>` inside the modal, clicking the dark backdrop,
  or Escape. Modals stack (the lightbox opens on top of a gallery modal); Escape closes the top one first.
- The open state is the `.modal.is-open` class. Never toggle `style.display` directly.
- Lazy galleries: images inside modal `.gallery-grid`s use `data-src` (plus a tiny inline-SVG placeholder
  `src` for HTML validity). They are hydrated to `src` the first time their modal opens. Never put a real
  `src` on a gallery image; that would re-introduce a multi-MB initial page load. `loading="lazy"` alone
  does NOT work inside `display:none` containers, so the `data-src` swap is deliberate.
- Real links (`href` other than `"#"`, without `data-modal-target`) are always allowed through the
  delegated handler. External icons inside modal-trigger cards work because of this rule.
- Shared "artifacts unavailable" dialog: `#missing-file-modal`. Reuse it, don't add per-card copies.
- The contact form posts through EmailJS; feedback goes to `#form-status` (`aria-live`), never `alert()`.
  The EmailJS public key in `main.js` is public by design (browser SDK), not a leaked secret.
- Nav highlighting is a scroll-spy (`updateOnScroll` in `main.js`) toggling `.active` on `.navbar a`. It
  measures each section's position against a line 28% down the viewport, rather than using an
  IntersectionObserver band. Short sections (`#education` is ~330px) are smaller than a mid-viewport band and
  were being overwritten by the following section. It also force-selects the last link at page bottom, since
  the footer stops `#contact` from ever reaching the line. Don't "simplify" it back to an observer band.

## Conventions

- kebab-case for ids, classes, and image filenames; double-quoted HTML attributes; 4-space indent.
- Element `id`s are unique. This was once broken, and validators and the modal system rely on uniqueness.
- Heading hierarchy: one `<h1>` (hero name); each section title is `<h2>`; card/entry titles are `<h3>`/`<h4>`.
- Dates use `<p class="date">` with en dashes ("June 2023 – August 2023"). Everywhere else, prose does not
  use em or en dashes.
- Inline `style="--i:N"` attributes are staggered animation delays consumed by `calc(.2s * var(--i))`. They
  are intentional, as are inline brand colors on skill-chip icons.
- Accent color: use `var(--accent)` (defined in `:root`). Don't hardcode `cyan`/`#0ef`.
- All `target="_blank"` links need `rel="noopener noreferrer"`.
- CDN `<script>`/`<link>` tags are version-pinned with SRI `integrity` hashes. If you bump a version, you must
  recompute the sha384 hash (fetch the file, `openssl dgst -sha384 -binary | openssl base64 -A`) or the
  browser will refuse to load it.

## Recipes

**Add a project card** (in `#projects`, inside the single `.serv-container`. All cards live in one flex-wrap
row set to 4 per row via the `--cards-per-row` custom property, dropping to 2 below 1100px and 1 below 700px;
flexbox is used rather than grid so a final incomplete row centers itself. The card front shows what the
product *is*, the hover overlay shows what *you did*):

```html
<div class="row">  <!-- add data-modal-target="#some-modal" to make the whole card open a gallery -->
    <img src="./Assets/Images/name.jpg" alt="What the image shows" loading="lazy">
    <div class="layer">
        <h5>My QA Work</h5>
        <p>What you did on this project (1–2 sentences, ~20 words).</p>
        <a href="https://…" target="_blank" rel="noopener noreferrer" aria-label="…">
            <i class="bx bxs-send accent-icon"></i></a>
        <span class="layer-hint">Click the icon to …</span>
    </div>
    <div class="center-text">
        <h3 class="project-title">Project Name</h3>
        <p class="project-summary">One sentence: what the product is, so any visitor understands it.</p>
    </div>
</div>
```

**Add an experience entry** (in `#experience`, inside `.timeline`, newest first. Grid auto-placement
alternates the cards left/right of the center line, and it collapses to one column below 900px):

```html
<article class="timeline-item">
    <div class="timeline-card">
        <header class="timeline-head">
            <img class="timeline-logo" src="./Assets/Images/company.png" alt="Company logo" loading="lazy">
            <div>
                <h3 class="timeline-role">Job Title</h3>
                <a class="timeline-company" href="https://…" target="_blank" rel="noopener noreferrer">Company</a>
                <p class="timeline-date">Month Year – Month Year</p>
            </div>
        </header>
        <ul class="timeline-points">
            <li>What you did: one concrete achievement per bullet, 3–5 bullets max.</li>
        </ul>
        <ul class="timeline-tags">
            <li>Tool or skill</li>
        </ul>
    </div>
</article>
```

**Add a certificate or a course.** Both sections share one component, so the markup is identical
(`.cards-2` is a 2-column grid collapsing to 1 below 700px). Use `<img class="info-card-logo">` for a
certificate issuer's logo, or `<i class="bx … info-card-icon">` for a course:

```html
<article class="info-card">
    <header class="info-card-head">
        <img class="info-card-logo" src="./Assets/Images/issuer.png" alt="Issuer logo" loading="lazy">
        <div>
            <h3 class="info-card-title">Certificate or course name</h3>
            <p class="info-card-issuer">Who issued it</p>
        </div>
    </header>
    <p class="info-card-meta">Credential ID · 1234</p>   <!-- optional -->
    <p class="date">Issued Month Year</p>
    <a class="info-card-link" href="…" target="_blank" rel="noopener noreferrer">
        View certificate <i class="bx bx-link-external"></i></a>
</article>
```

**Add a gallery image:** resize first (`npx sharp-cli resize 1200 -i shot.png -o Assets/Images/ --format jpeg --quality 80`),
drop the original in `_originals/`, then add inside the modal's `.gallery-grid`:

```html
<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3C/svg%3E"
     data-src="./Assets/Images/name-1.jpg" alt="Name screenshot N" loading="lazy" decoding="async">
```

**Verify changes:**

```
npx serve .                      # serve locally (python here is the MS Store stub, don't use it)
npx html-validate index.html     # 0 errors expected (inline-style rule is a known, intentional exception)
```

Click through: nav scroll-spy, the three gallery modals (Suncorp/Duo/Referit), lightbox arrows + Escape,
a "missing file" card icon, and the contact form (block `api.emailjs.com` in DevTools to test the error path).

## Known facts (do not "fix" these)

- Overlapping "Present" dates across Mekari / Digilogik are real (freelance + full-time overlap).
- Both PT Javan Cipta Solusi entries are correct: an internship (Jul–Aug 2023) that became a contract role
  (Sep 2023 – Jan 2025). Two separate timeline cards, contract listed above intern.
- Mekari Qontak appears twice on purpose: as the current job in Experience, and as a project card
  (`#projects`, first card) describing the Chatpanel product. Both are owner-supplied and factual.
- Suncorp and Duo are private client sites, so their cards deliberately open a "private" notice instead of
  linking out.
- The `Poppins` font-family is declared but no webfont is loaded; the site intentionally renders with the
  system sans-serif fallback. Adding the Google Fonts link is a decision for the owner (adds a render-blocking request).
- Git history still contains ~40 MB of pre-compression images. Cleaning it requires history rewriting
  (`git filter-repo`), which is destructive, so only do it with the owner's explicit go-ahead.
- No `og:image`/`canonical` tags: the final deployed URL isn't recorded here. Add them once the owner
  confirms the production URL.
- The `#about` bio is three paragraphs sourced from the owner's own CV summary (3+ years, Playwright/Cypress/
  Selenium, CI/CD in Jenkins/Azure DevOps/GitLab, AI-assisted tooling, remote availability). It closes with an
  availability statement that is deliberate, not filler. Keep the Skills chips in sync with whatever the bio
  claims: every tool named there has a chip.
- Selenium's chip uses the boxicons `bx-test-tube` glyph in Selenium green: no Selenium logo is served by the
  usual logo CDNs (all 404), so don't waste a round trip trying to fetch one.
