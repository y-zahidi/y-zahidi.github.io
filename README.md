# y-zahidi.github.io

Personal portfolio of [Yassir Zahidi](https://github.com/y-zahidi) — Computer Engineering student & Specialized Technician in Cybersecurity.

Live site → **<https://y-zahidi.github.io>**

## Stack

Pure HTML, CSS, and a tiny bit of JS. No bundler, no framework, no build step. Hosted on GitHub Pages straight from `main`.

```
.
├── index.html             ← single-page portfolio
├── 404.html               ← branded error page
├── robots.txt             ← allows everyone (humans, search bots, AI crawlers)
├── sitemap.xml            ← discoverable structure
├── humans.txt             ← old-school credits
├── .well-known/
│   └── security.txt       ← RFC 9116 contact for vuln reports
└── assets/
    ├── style.css
    ├── main.js
    ├── favicon.svg
    ├── og-image.png       ← 1200×630 social card
    └── cv-en.pdf          ← drop the latest CV here, the page picks it up
```

## SEO / share-card checklist

| Asset | Purpose |
|---|---|
| `og-image.png` | LinkedIn / Twitter / Slack preview |
| `sitemap.xml` | feeds Google Search Console |
| `robots.txt` | explicitly allows GPTBot, ClaudeBot, PerplexityBot |
| `JSON-LD Person + WebSite` | rich-result eligibility |
| `404.html` | terminal-themed branded error page |

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## License

Content is mine. Code can be reused freely (MIT spirit) — feel free to fork the structure for your own portfolio.
