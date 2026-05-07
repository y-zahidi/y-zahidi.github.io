# y-zahidi.github.io

Source of <https://y-zahidi.github.io>. Single-page, no framework, dark cybersec aesthetic. GitHub Pages.

## Tech

- HTML, CSS, vanilla JS — no build step.
- Schema.org JSON-LD (Person + WebSite).
- OG + Twitter cards (1200×630).
- `humans.txt`, `sitemap.xml`, `robots.txt`, `404.html`, `.well-known/security.txt`.
- Inter + JetBrains Mono via Google Fonts (preconnected).

## Structure

```
.
├── index.html
├── 404.html
├── humans.txt
├── robots.txt
├── sitemap.xml
├── .well-known/security.txt
└── assets/
    ├── style.css
    ├── favicon.svg
    ├── og-image.png        (1200×630)
    ├── avatar.jpg          (self-hosted, 400×400)
    └── cv-en.pdf
```

## Local preview

```bash
python3 -m http.server 4000
open http://localhost:4000
```

## Deployment

Pushes to `main` ship live via GitHub Pages.

## License

MIT for the source. Content (project descriptions, bio) © Yassir Zahidi.

— [portfolio](https://y-zahidi.github.io) · [linkedin](https://www.linkedin.com/in/yassir-zahidi/)
