# NANDAN AI — All In One AI Tools Directory

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**NANDAN AI** is a modern, scalable, SEO-friendly AI Tool Directory (inspired by Futurepedia, Toolify, and There's An AI For That). Built with a dark mode glassmorphism UI, smooth video background integration (`background.mp4`), real-time search, category filters, static page generator, and rich JSON-LD structured metadata.

---

## 🌟 Key Features

- **Centralized Data Architecture**: Driven by `tools-data.json` containing full details (features, pros/cons, use cases, FAQs, video demos, related tools, and platforms) for all 70+ cataloged AI tools.
- **Static Page Generator**: Automatically renders dedicated SEO pages (`/tools/{slug}/index.html`), category listings (`/category/{slug}/index.html`), `sitemap.xml`, `robots.txt`, and `404.html`.
- **24-Section Tool Details Page**: Deep tool pages featuring breadcrumbs, cover banners, pros/cons, key features, FAQs, side-by-side tool comparison tables, previous/next navigation, social sharing, and a **bottom-only "Visit Official Website" button**.
- **Glassmorphism & Micro-animations**: Sleek, futuristic UI preserving 100% of existing animations, Tailwind CSS color tokens, and Lucide icons.
- **Live Video Background**: HD looping video background (`background.mp4`).
- **Interactive Search & Filters**: Live client-side and server-rendered search filtering across categories (*Chatbots*, *Image Generation*, *Developer*, *Writing*, *Video*, *Music*, *Productivity*, etc.) and pricing models (*Free*, *Freemium*, *Paid*).
- **SEO & JSON-LD Schemas**: Automated `SoftwareApplication`, `BreadcrumbList`, `Organization`, and `WebSite` schemas for maximum search visibility.

---

## 🚀 Quick Start (Local Development)

### 1. Build Static Pages
Generate all 70+ tool pages, category pages, sitemap, and robots.txt:

```powershell
.\build.ps1
# or with Node.js
npm run build
```

### 2. Run Local Development Server

#### Option A: Using PowerShell Server Script (Port 5000)
```powershell
.\server.ps1
```
Open [http://localhost:5000](http://localhost:5000) in your browser.

#### Option B: Using Node / serve (Port 3000)
```bash
npm run dev
```

---

## ➕ How to Add a New AI Tool

Adding a tool requires **zero manual page design**. Simply add a new tool object to `tools-data.json` and run the build generator.

See the complete guide in [ADDING_TOOLS.md](file:///c:/Users/Admin/Downloads/ezgif-7ba4c5d3ec3bd8dd-jpg/ADDING_TOOLS.md).

---

## ☁️ Deployment

Pre-configured for zero-configuration instant deployment on **Cloudflare Pages** and **[Vercel](https://vercel.com/)**.

---

## 🛠️ Built With

- **HTML5, Vanilla JavaScript (ES6+), PowerShell / Node Generator**
- **Tailwind CSS** (via CDN)
- **Lucide Icons**
- **JSON-LD & Schema.org**

