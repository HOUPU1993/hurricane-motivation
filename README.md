# Motivation-centered Framework for Hurricane Evacuation

Live site: https://houpu1993.github.io/hurricane-motivation/

A static, dependency-free website that documents mechanisms driving hurricane evacuation motivation: hypothesized causal chains, metrics, data sources and evidence.

## Structure

```
index.html              # page shell
assets/style.css        # dark theme (palette follows the Anatomy skill)
assets/app.js           # renderer: flow figure, decomposition tree, inspector, link viewer, references
content/manifest.js     # site title/intro + list of content files to load
content/references.js   # bibliography (HM.references) and data sources (HM.sources)
content/m1-*.js ...     # one file per mechanism (HM.mechanism)
```

## Editing content

- Edit text in `content/*.js`. The schema is documented at the top of `content/m1-experience.js`.
- Cite a work with `[@key]` (key defined in `content/references.js`); use `**bold**` for emphasis.
- References are stored as structured APA 7 fields (authors, year, title, journal, volume, issue, pages, doi). The in-text label (e.g. "Stein et al. (2010)") and the reference list are generated automatically.
- Each mechanism is a tree of nodes (`dimension` → `group` → `metric`). A node can hold `hypotheses`, `metric`, `evidence`, `table`, `note` and `children`; set `open: false` to start it collapsed.
- Write chains as `a(+) → b(+) → evacuation motivation(-)` and set `dir` to `pos`, `neg` or `ns`.
- Links open in an in-site viewer. Most publishers block embedding, so those show a summary card with an "open original" button; set `embed: true/false` on a reference to override.
- Add a mechanism: create `content/m7-xxx.js` and add it to `files` in `content/manifest.js`.

## Preview locally

Open `index.html` directly in a browser, or run:

```bash
python -m http.server 8000
```

## Deploy

```bash
git add .
git commit -m "Update content"
git push
```

GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root) rebuilds in 1–2 minutes.
