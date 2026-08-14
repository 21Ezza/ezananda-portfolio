# Eza Nanda, QA Engineer Portfolio

Personal portfolio website of Eza Nanda, Quality Assurance Engineer.
Live sections: Home · About · Skills · Education · Experience · Projects · Certificates · Courses · Contact.

## Tech

Static HTML, CSS, and vanilla JavaScript. No framework, no build step. The site works if you open
`index.html` directly, or if you serve the folder from any static host (GitHub Pages, Netlify, and so on).

Three CDN dependencies, all pinned with [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
hashes: [Boxicons](https://boxicons.com/) for icons, [typed.js](https://github.com/mattboldt/typed.js) for the
hero typing effect, and [EmailJS](https://www.emailjs.com/) for the contact form.

## Project structure

```
index.html          the whole site (single page)
Assets/
  style.css         single stylesheet, organized with a table of contents + CSS custom properties
  main.js           interactions: modals, lazy galleries, lightbox, scroll-spy, contact form
  Images/           compressed, web-sized images (see "Images" below)
CLAUDE.md           orientation guide for AI coding assistants
.gitignore
```

## Run locally

Any static server works. With Node installed:

```
npx serve .
# or
npx http-server -p 8080
```

Then open the printed URL. (Opening `index.html` straight from disk also works.)

## Validate

```
npx html-validate index.html
```

## Images

Gallery screenshots inside modals use `data-src` and are only downloaded when a gallery is opened, so the
initial page load stays around 1 MB.

All committed images are resized and recompressed for the web (≤1200px, JPEG/WebP). The uncompressed
originals live in the untracked `_originals/` folder locally. To add a new screenshot, resize it first, e.g.:

```
npx sharp-cli resize 1200 -i screenshot.png -o Assets/Images/ --format jpeg --quality 80
```

> Note: git *history* still contains the old full-size images (~40 MB), so fresh clones are heavier than
> the working tree. Rewriting history (`git filter-repo`) would fix this but changes all commit hashes.

## Contact form

The form sends through EmailJS using a public key. That is how EmailJS's browser SDK is meant to work, so
the key is not a secret. Status feedback appears inline under the Send button.
