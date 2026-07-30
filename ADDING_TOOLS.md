# How to Add a New AI Tool to NANDAN AI

Adding a new tool to **NANDAN AI** takes **less than 60 seconds** and requires **zero manual page building**. 

The entire directory operates on a single source of truth (`tools-data.json`). Adding a single JSON object automatically:

- Generates its dedicated SEO Tool Page (`/tools/{slug}/index.html`)
- Updates the Homepage Tool Showcase (`/index.html`)
- Updates Category listings (`/category/{category-slug}/index.html`)
- Updates Live Search across all pages
- Updates Category & Pricing Filter Pills
- Generates JSON-LD Schemas (`SoftwareApplication`, `BreadcrumbList`, etc.)
- Updates `sitemap.xml` and `robots.txt`
- Populates Related Tools recommendations on other tool pages

---

## 🚀 Quick Step-by-Step Guide

### Step 1: Open `tools-data.json`

Open `tools-data.json` located at the root of the repository.

### Step 2: Append a New Tool Object

Scroll to the `"tools"` array and add a new tool object with the following structure:

```json
{
  "id": 71,
  "name": "Super AI Tool",
  "slug": "super-ai-tool",
  "logo": "https://example.com/favicon.ico",
  "logoUrl": "https://example.com/favicon.ico",
  "banner": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
  "category": "Chatbots",
  "categoryId": 1,
  "categorySlug": "chatbots",
  "pricing": "Freemium",
  "pricingModel": "Freemium",
  "rating": 4.9,
  "shortDescription": "Next-generation AI assistant built for automated workflow acceleration.",
  "fullDescription": "Super AI Tool is an enterprise assistant engineered to handle complex reasoning, natural language writing, automated code generation, and multi-file data synthesis.",
  "features": [
    "Real-Time Natural Language Reasoning",
    "Automated Code Synthesis & Bug Fixing",
    "Multi-Language Translation",
    "Integrations with Slack and GitHub"
  ],
  "pros": [
    "Ultra-fast response latency under 200ms",
    "Intuitive conversational interface",
    "Generous free starter allowance"
  ],
  "cons": [
    "High volume API usage requires Pro plan"
  ],
  "bestUseCases": [
    "Rapid software prototyping & coding",
    "Enterprise team knowledge search",
    "Content drafting and email synthesis"
  ],
  "supportedPlatforms": ["Web", "iOS", "Android", "macOS", "API"],
  "screenshots": [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
  ],
  "video": "https://www.youtube.com/embed/out_of_the_box",
  "faq": [
    {
      "question": "Is Super AI Tool free to use?",
      "answer": "Yes! A free starter tier is provided for all new registered users."
    }
  ],
  "officialUrl": "https://example.com",
  "officialWebsiteUrl": "https://example.com",
  "websiteUrl": "https://example.com",
  "relatedTools": ["chatgpt", "claude", "perplexity"],
  "tags": ["Chatbot", "AI Assistant", "Automation"],
  "keywords": ["super ai tool", "ai workflow", "chat assistant"],
  "isFeatured": false
}
```

### Step 3: Run the Build Generator Script

Execute the build script in terminal:

#### Using PowerShell:
```powershell
.\build.ps1
```

#### Using Node.js:
```bash
npm run build
# or
node build.js
```

### Step 4: Preview and Deploy!

Test your new page locally:
```powershell
.\server.ps1
```
Open `http://localhost:5000/tools/super-ai-tool` in your browser.

Commit and push your changes to GitHub or Cloudflare Pages / Vercel. All static pages will deploy instantly with 100% SEO optimization!
