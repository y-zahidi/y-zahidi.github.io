# Yassir Zahidi — Personal Portfolio

> Source for [y-zahidi.github.io](https://y-zahidi.github.io), a single-page portfolio for security engineering, data systems, backend work, and practical product design.

![Portfolio source](https://img.shields.io/badge/status-live-5cf2c1?labelColor=0a0e14)
![Hosting](https://img.shields.io/badge/hosting-GitHub_Pages-5cf2c1?labelColor=0a0e14)
![Build](https://img.shields.io/badge/build-no_framework-5cf2c1?labelColor=0a0e14)

## Purpose

The site is the narrative layer above the GitHub portfolio. It introduces the person behind the projects, explains the working method, surfaces selected evidence, and gives visitors a direct path to the relevant case studies and professional contact points.

The public story is intentionally broader than a single job title: it connects security validation, detection engineering, databases, backend systems, Linux operations, data analysis, and practical product work.

## Design and implementation

- Semantic HTML, CSS, and vanilla JavaScript with no build step.
- Dark technical visual system with responsive behavior and accessible contrast.
- Schema.org JSON-LD for `Person` and `WebSite` entities.
- Open Graph and Twitter card metadata with a 1200×630 social image.
- Self-hosted avatar and local portfolio assets where appropriate.
- `humans.txt`, `sitemap.xml`, `robots.txt`, `404.html`, and `.well-known/security.txt`.
- Inter and JetBrains Mono typography with preconnected font delivery.

## Information architecture

```text
Identity and thesis
        │
        ▼
Selected evidence and project case studies
        │
        ▼
Technical interests and working method
        │
        ▼
Resume, GitHub, and professional contact
```

The page is designed to make the first screen useful, keep the evidence scannable, and give deeper readers a clear route to project details without overwhelming them with every repository.

## Structure

```text
.
├── index.html
├── 404.html
├── humans.txt
├── robots.txt
├── sitemap.xml
├── .well-known/security.txt
└── assets/
    ├── style.css
    ├── main.js
    ├── favicon.svg
    └── og-image.png
```

## Local preview

```bash
python3 -m http.server 4000
open http://localhost:4000
```

## Deployment

Pushing to `main` publishes the site through GitHub Pages. Before publishing, verify the production URL, social-card metadata, internal links, mobile layout, and the downloadable CV path.

## Quality checklist

- [ ] Test the first screen at narrow mobile width.
- [ ] Confirm every project link resolves.
- [ ] Confirm images have useful alternative text.
- [ ] Confirm the page remains readable without animation.
- [ ] Confirm contact and resume links are current.
- [ ] Confirm the public site does not reveal private implementation details.

## License and content

The source is MIT-licensed. Portfolio content, project descriptions, and personal materials are © Yassir Zahidi.

- [Live portfolio](https://y-zahidi.github.io)
- [GitHub profile](https://github.com/y-zahidi)
- [LinkedIn](https://www.linkedin.com/in/yassir-zahidi/)
