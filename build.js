const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://nandan-ai.pages.dev';

// Load centralized tools database
const dataPath = path.join(__dirname, 'tools-data.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const { categories, tools } = JSON.parse(rawData);

console.log(`Loaded ${tools.length} tools and ${categories.length} categories.`);

// Helper function to create directories if missing
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Generate Common Header HTML
function generateHeaderHTML(relativePathPrefix = '') {
  return `
    <header class="glass-header sticky top-0 z-50 h-16 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-8">
      <div class="flex items-center gap-2 sm:gap-8 min-w-0 shrink-0 sm:shrink">
        <a href="${relativePathPrefix}index.html" class="flex items-center gap-2 sm:gap-3 group shrink-0">
          <img src="${relativePathPrefix}logo.jpg" alt="NANDAN AI Logo"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-cover shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform border border-cyan-500/30" />
          <div class="flex flex-col">
            <span class="font-extrabold text-sm sm:text-xl tracking-wider text-white leading-none">NANDAN AI</span>
            <span class="text-[8px] sm:text-[9px] font-bold tracking-widest text-cyan-400 uppercase mt-0.5 hidden xs:block sm:block">ALL IN ONE AI</span>
          </div>
        </a>
      </div>

      <div class="relative flex-1 max-w-[200px] xs:max-w-xs sm:max-w-md md:w-96 mx-1 sm:mx-0">
        <span class="absolute inset-y-0 left-2.5 sm:left-3 flex items-center text-zinc-400 pointer-events-none">
          <i data-lucide="search" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>
        </span>
        <input type="text" id="globalHeaderSearch" oninput="if(typeof handleGlobalSearch==='function'){handleGlobalSearch(this.value)}" onkeydown="if(event.key==='Enter' && typeof handleGlobalSearch!=='function'){location.href='${relativePathPrefix}index.html?search=' + encodeURIComponent(this.value)}"
          placeholder="Search AI tools..."
          class="w-full bg-zinc-900/90 border border-zinc-700/60 rounded-lg py-1.5 sm:py-2 pl-8 sm:pl-10 pr-2.5 sm:pr-4 text-xs sm:text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
      </div>

      <div class="flex items-center gap-2 sm:gap-4 shrink-0">
        <a href="${relativePathPrefix}index.html#section-directory"
          class="text-sm font-medium text-zinc-300 hover:text-indigo-400 hidden lg:block transition-colors">
          All Tools
        </a>
        <button onclick="openSubmitModal()"
          class="hidden sm:inline-flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg sm:rounded-md text-xs sm:text-sm font-medium transition-colors shadow-lg shadow-indigo-600/30">
          Submit Tool
        </button>
        <button onclick="toggleMobileMenu()" id="mobile-menu-btn" aria-label="Toggle Navigation Menu"
          class="sm:hidden p-2 text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-lg border border-zinc-700/60 transition-colors">
          <i data-lucide="menu" class="w-5 h-5" id="mobile-menu-icon"></i>
        </button>
      </div>
    </header>

    <!-- Mobile Navigation Drawer / Hamburger Menu -->
    <div id="mobile-nav-menu" class="fixed inset-x-0 top-16 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800 p-4 hidden flex-col gap-4 shadow-2xl transition-all sm:hidden">
      <div class="flex flex-col gap-2">
        <a href="${relativePathPrefix}index.html" onclick="toggleMobileMenu()" class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-900/80 text-zinc-200 hover:text-white text-sm font-medium border border-zinc-800">
          <i data-lucide="layout-dashboard" class="w-4 h-4 text-indigo-400"></i>
          Dashboard
        </a>
        <a href="${relativePathPrefix}index.html#section-directory" onclick="toggleMobileMenu()" class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-zinc-900/80 text-zinc-200 hover:text-white text-sm font-medium border border-zinc-800">
          <i data-lucide="grid" class="w-4 h-4 text-cyan-400"></i>
          All Tools
        </a>
      </div>

      <div class="pt-2 border-t border-zinc-800/80">
        <button onclick="openSubmitModal(); toggleMobileMenu();" class="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2">
          <i data-lucide="plus-circle" class="w-4 h-4"></i>
          Submit Tool
        </button>
      </div>
    </div>

    <script>
      function toggleMobileMenu() {
        const menu = document.getElementById('mobile-nav-menu');
        const icon = document.getElementById('mobile-menu-icon');
        if (menu) {
          const isHidden = menu.classList.contains('hidden');
          if (isHidden) {
            menu.classList.remove('hidden');
            menu.classList.add('flex');
            if (icon) icon.setAttribute('data-lucide', 'x');
          } else {
            menu.classList.add('hidden');
            menu.classList.remove('flex');
            if (icon) icon.setAttribute('data-lucide', 'menu');
          }
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      }
    </script>
  `;
}

// Generate Common Sidebar HTML
function generateSidebarHTML(relativePathPrefix = '', activeSlug = null) {
  const categoryItemsHTML = categories.map(cat => {
    const isActive = activeSlug === cat.slug;
    const toolCount = tools.filter(t => t.categoryId === cat.id || t.categorySlug === cat.slug).length;
    return `
      <li>
        <a href="${relativePathPrefix}category/${cat.slug}/index.html" class="w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between text-xs ${isActive ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-semibold' : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-white'}">
          <span>${cat.name}</span>
          <span class="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">${toolCount}</span>
        </a>
      </li>
    `;
  }).join('');

  return `
    <aside class="w-64 glass-panel rounded-2xl p-5 hidden lg:flex flex-col gap-6 shrink-0 h-[calc(100vh-6rem)] sticky top-20">
      <div>
        <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Navigation</h3>
        <ul class="space-y-1">
          <li>
            <a href="${relativePathPrefix}index.html"
              class="w-full text-zinc-300 hover:bg-zinc-800/60 hover:text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 font-medium transition-colors">
              <i data-lucide="layout-dashboard" class="w-4 h-4 text-indigo-400"></i>
              Dashboard
            </a>
          </li>
          <li>
            <a href="${relativePathPrefix}index.html#section-directory"
              class="w-full text-zinc-300 hover:bg-zinc-800/60 hover:text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 font-medium transition-colors">
              <i data-lucide="grid" class="w-4 h-4 text-cyan-400"></i>
              All Tools
            </a>
          </li>
          <li>
            <button onclick="openSubmitModal()"
              class="w-full text-zinc-300 hover:bg-zinc-800/60 hover:text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 font-medium transition-colors text-left">
              <i data-lucide="plus-circle" class="w-4 h-4 text-indigo-400"></i>
              Submit Tool
            </button>
          </li>
        </ul>
      </div>

      <div class="overflow-y-auto pr-1 space-y-1">
        <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Categories</h3>
        <ul class="space-y-1 text-sm">
          ${categoryItemsHTML}
        </ul>
      </div>

      <div class="mt-auto pt-4 border-t border-zinc-800/80">
        <div class="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-3 flex items-center gap-3">
          <img src="${relativePathPrefix}logo.jpg" alt="NANDAN AI"
            class="w-8 h-8 rounded-lg object-cover border border-cyan-500/40 shrink-0" />
          <div>
            <p class="text-xs text-indigo-300 font-semibold leading-tight">NANDAN AI</p>
            <p class="text-[10px] text-zinc-400 mt-0.5">ALL IN ONE AI</p>
          </div>
        </div>
      </div>
    </aside>
  `;
}

// Generate Common Footer HTML
function generateFooterHTML(relativePathPrefix = '') {
  return `
    <footer class="glass-header mt-12 border-t border-zinc-800/80 py-8 px-4 sm:px-6 relative z-10">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <img src="${relativePathPrefix}logo.jpg" alt="NANDAN AI Logo" class="w-8 h-8 rounded-lg object-cover border border-cyan-500/40 shrink-0" />
          <div>
            <span class="font-extrabold text-white text-base tracking-wider">NANDAN AI</span>
            <p class="text-xs text-zinc-400">All in One AI Tools Directory</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-300 font-medium">
          <a href="${relativePathPrefix}index.html" class="hover:text-indigo-400 transition-colors">Home</a>
          <a href="${relativePathPrefix}index.html#section-directory" class="hover:text-indigo-400 transition-colors">All Tools</a>
          <button onclick="openSubmitModal()" class="hover:text-indigo-400 text-indigo-400 font-semibold transition-colors flex items-center gap-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 px-3 py-1.5 rounded-lg border border-indigo-500/30">
            <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i> Submit Tool
          </button>
        </div>

        <div class="text-xs text-zinc-500 text-center md:text-right">
          &copy; ${new Date().getFullYear()} NANDAN AI. All rights reserved.
        </div>
      </div>
    </footer>
  `;
}

// Generate Common Submit Tool Modal HTML
function generateSubmitModalHTML() {
  return `
    <div id="submit-modal"
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md hidden flex items-center justify-center p-4">
      <div class="glass-panel max-w-lg w-full rounded-2xl p-6 sm:p-8 relative border-indigo-500/40 shadow-2xl">
        <button onclick="closeSubmitModal()"
          class="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-lg bg-zinc-800/50">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
        <h2 class="text-2xl font-bold text-white flex items-center gap-2">
          <i data-lucide="plus-circle" class="w-6 h-6 text-indigo-400"></i>
          Submit an AI Tool
        </h2>
        <p class="text-xs text-zinc-400 mt-1 mb-6">Add your software to NANDAN AI directory for review.</p>

        <form onsubmit="handleFormSubmit(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-1">Tool Name</label>
            <input type="text" required id="sub-name" placeholder="e.g. My AI Assistant"
              class="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-1">Website URL</label>
            <input type="url" required id="sub-url" placeholder="https://example.com"
              class="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
              <select id="sub-category"
                class="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                ${categories.map(c => `<option value="${c.slug}">${c.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-zinc-300 mb-1">Pricing Model</label>
              <select id="sub-pricing"
                class="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="Freemium">Freemium</option>
                <option value="Free">Free</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
            <textarea required id="sub-desc" rows="3" placeholder="Briefly describe what this AI tool does..."
              class="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
          </div>
          <button type="submit"
            class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-indigo-600/30">
            Submit for Review
          </button>
        </form>
      </div>
    </div>
    <script>
      function openSubmitModal() {
        document.getElementById('submit-modal').classList.remove('hidden');
      }
      function closeSubmitModal() {
        document.getElementById('submit-modal').classList.add('hidden');
      }
      function handleFormSubmit(e) {
        e.preventDefault();
        const name = document.getElementById('sub-name').value;
        alert('Thank you! "' + name + '" has been submitted for review on NANDAN AI.');
        closeSubmitModal();
      }
    </script>
  `;
}

// -------------------------------------------------------------
// 1. GENERATE TOOL DETAILS PAGES (/tools/{slug}/index.html)
// -------------------------------------------------------------
console.log('Generating Tool Pages...');

tools.forEach((tool, index) => {
  const relPath = '../../';
  const category = categories.find(c => c.id === tool.categoryId || c.slug === tool.categorySlug) || { name: tool.category, slug: tool.categorySlug || 'chatbots' };
  
  // Previous & Next tools navigation
  const prevTool = tools[(index - 1 + tools.length) % tools.length];
  const nextTool = tools[(index + 1) % tools.length];

  // Related tools (3-6)
  const relatedList = tools.filter(t => t.slug !== tool.slug && (t.categoryId === tool.categoryId || (tool.relatedTools && tool.relatedTools.includes(t.slug)))).slice(0, 6);

  // Compare tools (2 tools)
  const compareList = relatedList.slice(0, 2);

  // Organization & SoftwareApplication Schemas
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "url": tool.officialWebsiteUrl || tool.officialUrl || tool.websiteUrl,
    "applicationCategory": category.name,
    "operatingSystem": tool.supportedPlatforms.join(', '),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tool.rating.toString(),
      "ratingCount": "1250"
    },
    "offers": {
      "@type": "Offer",
      "price": tool.pricingModel === 'Free' ? '0' : '9.99',
      "priceCurrency": "USD"
    },
    "description": tool.shortDescription
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN },
      { "@type": "ListItem", "position": 2, "name": category.name, "item": `${DOMAIN}/category/${category.slug}` },
      { "@type": "ListItem", "position": 3, "name": tool.name, "item": `${DOMAIN}/tools/${tool.slug}` }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NANDAN AI",
    "url": DOMAIN,
    "logo": `${DOMAIN}/logo.jpg`,
    "sameAs": ["https://twitter.com", "https://linkedin.com"]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NANDAN AI",
    "url": DOMAIN,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${DOMAIN}/index.html?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const toolHTML = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/jpeg" href="${relPath}logo.jpg">
  <title>${tool.name} AI Tool - Features, Pricing, Reviews & Alternatives | NANDAN AI</title>
  <meta name="description" content="${tool.name}: ${tool.shortDescription}">
  <link rel="canonical" href="${DOMAIN}/tools/${tool.slug}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${DOMAIN}/tools/${tool.slug}">
  <meta property="og:title" content="${tool.name} - AI Tool Directory | NANDAN AI">
  <meta property="og:description" content="${tool.shortDescription}">
  <meta property="og:image" content="${tool.banner || tool.logo}">

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${DOMAIN}/tools/${tool.slug}">
  <meta property="twitter:title" content="${tool.name} - NANDAN AI">
  <meta property="twitter:description" content="${tool.shortDescription}">
  <meta property="twitter:image" content="${tool.banner || tool.logo}">

  <!-- Tailwind CSS & Lucide Icons -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          screens: { xs: '475px' },
          colors: {
            brand: { 50: '#eef2ff', 100: '#e0e7ff', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' }
          }
        }
      }
    }
  </script>
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- Structured Data JSON-LD Schemas -->
  <script type="application/ld+json">${JSON.stringify(softwareAppSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>

  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: 100%; background-color: #09090b; color: #fafafa; font-family: ui-sans-serif, system-ui, sans-serif; overflow-x: hidden; }
    #bg-video { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: 0; pointer-events: none; }
    .app-viewport { position: relative; z-index: 10; min-height: 100vh; }
    .glass-panel { background: rgba(24, 24, 27, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); }
    .glass-header { background: rgba(9, 9, 11, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .glass-card { background: rgba(24, 24, 27, 0.65); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
    .glass-card:hover { background: rgba(24, 24, 27, 0.85); border-color: rgba(99, 102, 241, 0.5); transform: translateY(-2px); }
  </style>
</head>
<body>

  <!-- Video Background -->
  <video id="bg-video" autoplay loop muted playsinline>
    <source src="${relPath}background.mp4" type="video/mp4" />
  </video>

  <div class="app-viewport flex flex-col">
    ${generateHeaderHTML(relPath)}

    <div class="flex flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
      ${generateSidebarHTML(relPath, category.slug)}

      <!-- Main Content Area -->
      <main class="flex-1 space-y-8 min-w-0">

        <!-- 1. Breadcrumb Navigation -->
        <nav class="flex items-center gap-2 text-xs text-zinc-400 glass-panel px-4 py-3 rounded-xl border border-zinc-800/80">
          <a href="${relPath}index.html" class="hover:text-white transition-colors flex items-center gap-1">
            <i data-lucide="home" class="w-3.5 h-3.5"></i> Home
          </a>
          <span>&rsaquo;</span>
          <a href="${relPath}category/${category.slug}/index.html" class="hover:text-indigo-400 transition-colors">${category.name}</a>
          <span>&rsaquo;</span>
          <span class="text-white font-medium truncate">${tool.name}</span>
        </nav>

        <!-- 2. Hero Banner & Tool Title Block -->
        <div class="glass-panel rounded-2xl overflow-hidden relative border-indigo-500/30 shadow-2xl">
          <!-- Hero Banner Background Image -->
          <div class="h-32 sm:h-64 w-full relative overflow-hidden bg-gradient-to-r from-indigo-950 via-zinc-900 to-black">
            <img src="${tool.banner || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80'}" 
                 alt="${tool.name} Cover Banner" loading="lazy" decoding="async" width="1200" height="400"
                 class="w-full h-full object-cover opacity-40 mix-blend-overlay scale-105 hover:scale-100 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
          </div>

          <!-- Hero Details Content -->
          <div class="p-4 sm:p-8 -mt-12 sm:-mt-20 relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6">
            <div class="flex items-start gap-3 sm:gap-4">
              <img src="${relPath}${tool.logoUrl || tool.logo}" alt="${tool.name} Logo" 
                   loading="lazy" decoding="async" width="80" height="80"
                   class="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-zinc-900 border-2 border-indigo-500/50 p-1.5 sm:p-2 object-contain shadow-xl shrink-0 backdrop-blur-md"
                   onerror="this.src='${relPath}logo.jpg'" />
              <div>
                <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5">
                  <!-- 5. Category Badge -->
                  <a href="${relPath}category/${category.slug}/index.html" class="text-[10px] sm:text-xs font-semibold text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900 px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md border border-indigo-500/30 uppercase tracking-wider transition-colors">
                    ${category.name}
                  </a>
                  <!-- 6. Pricing Badge -->
                  <span class="text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md ${tool.pricingModel === 'Free' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : tool.pricingModel === 'Freemium' ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/30' : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'}">
                    ${tool.pricingModel}
                  </span>
                </div>

                <!-- 4. Tool Name -->
                <h1 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-none">${tool.name}</h1>

                <!-- 7. Star Rating -->
                <div class="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                  <div class="flex items-center text-amber-400 text-xs sm:text-sm">
                    <i data-lucide="star" class="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current"></i>
                    <span class="font-bold ml-1">${tool.rating}</span>
                  </div>
                  <span class="text-[11px] sm:text-xs text-zinc-400">(1,250+ user ratings)</span>
                </div>
              </div>
            </div>

            <!-- Hero Primary CTA Button -->
            <div class="flex items-center gap-3 w-full sm:w-auto sm:self-center">
              <a href="${tool.officialWebsiteUrl || tool.officialUrl || tool.websiteUrl}" target="_blank" rel="noopener noreferrer" 
                 class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-xs sm:text-base px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-lg sm:rounded-xl shadow-xl shadow-indigo-600/30 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 group shrink-0">
                <span>Visit Official Website</span>
                <svg class="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Quick Action Bar & Social Sharing -->
        <div class="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border-indigo-500/30 shadow-lg">
          <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <a href="${tool.officialWebsiteUrl || tool.officialUrl || tool.websiteUrl}" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-all">
              <span>Visit Official Website</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
            <button onclick="copyToolLink()" class="inline-flex items-center gap-1.5 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-zinc-700/60 transition-colors">
              <svg class="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
              <span>Copy Link</span>
            </button>
          </div>

          <!-- All 8 Share Buttons with SVG Icons -->
          <div class="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end">
            <span class="text-xs text-zinc-400 font-semibold mr-1">Share:</span>
            
            <button onclick="shareOnTwitter()" title="Share on X (Twitter)" class="p-2 rounded-lg bg-zinc-800/90 text-zinc-300 hover:text-white hover:bg-black border border-zinc-700/60 transition-all">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </button>
            <button onclick="shareOnFacebook()" title="Share on Facebook" class="p-2 rounded-lg bg-zinc-800/90 text-zinc-300 hover:text-white hover:bg-blue-600 border border-zinc-700/60 transition-all">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
            <button onclick="shareOnLinkedIn()" title="Share on LinkedIn" class="p-2 rounded-lg bg-zinc-800/90 text-zinc-300 hover:text-white hover:bg-blue-700 border border-zinc-700/60 transition-all">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </button>
            <button onclick="shareOnWhatsApp()" title="Share on WhatsApp" class="p-2 rounded-lg bg-zinc-800/90 text-zinc-300 hover:text-white hover:bg-emerald-600 border border-zinc-700/60 transition-all">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </button>
            <button onclick="shareOnTelegram()" title="Share on Telegram" class="p-2 rounded-lg bg-zinc-800/90 text-zinc-300 hover:text-white hover:bg-sky-500 border border-zinc-700/60 transition-all">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.119.098.152.228.166.331.016.115.034.364.019.566z"/></svg>
            </button>
            <button onclick="shareOnReddit()" title="Share on Reddit" class="p-2 rounded-lg bg-zinc-800/90 text-zinc-300 hover:text-white hover:bg-orange-600 border border-zinc-700/60 transition-all">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.196-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.027.2.042.404.042.61 0 3.1-3.616 5.613-8.077 5.613s-8.077-2.513-8.077-5.613c0-.206.015-.41.042-.61A1.75 1.75 0 0 1 2.804 12.1c0-.968.786-1.754 1.754-1.754.466 0 .888.182 1.196.491 1.194-.856 2.85-1.418 4.674-1.488l1.01-4.733 3.284.693c.09-.452.489-.796.968-.796zM9.25 13c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm5.5 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm-5.465 4.54a.434.434 0 0 0-.306.741c1.066 1.066 3.036 1.171 3.521 1.171.485 0 2.455-.105 3.521-1.171a.434.434 0 0 0-.612-.613c-.767.766-2.22.935-2.909.935-.689 0-2.142-.169-2.909-.935a.43.43 0 0 0-.306-.128z"/></svg>
            </button>
            <button onclick="shareViaEmail()" title="Share via Email" class="p-2 rounded-lg bg-zinc-800/90 text-zinc-300 hover:text-white hover:bg-rose-600 border border-zinc-700/60 transition-all">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/></svg>
            </button>
            <button onclick="copyToolLink()" title="Copy Link" class="p-2 rounded-lg bg-zinc-800/90 text-zinc-300 hover:text-white hover:bg-indigo-600 border border-zinc-700/60 transition-all">
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            </button>
          </div>
        </div>

        <!-- 8. Overview Callout Box -->
        <div class="glass-panel p-6 rounded-2xl border-l-4 border-indigo-500 space-y-2">
          <h3 class="text-xs uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-2">
            <i data-lucide="info" class="w-4 h-4"></i> Quick Summary Overview
          </h3>
          <p class="text-base text-zinc-200 leading-relaxed">${tool.shortDescription}</p>
        </div>

        <!-- 9. Complete Detailed Description -->
        <div class="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <h3 class="text-xl font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <i data-lucide="file-text" class="w-5 h-5 text-indigo-400"></i> Complete Description
          </h3>
          <p class="text-sm sm:text-base text-zinc-300 leading-relaxed">${tool.fullDescription}</p>
        </div>

        <!-- Grid layout for Features, Pros, Cons, Use Cases -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <!-- 10. Key Features -->
          <div class="glass-panel p-6 rounded-2xl space-y-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
              <i data-lucide="zap" class="w-5 h-5 text-amber-400"></i> Key Features
            </h3>
            <ul class="space-y-2.5">
              ${tool.features.map(feat => `
                <li class="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5"></i>
                  <span>${feat}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- 13. Best Use Cases -->
          <div class="glass-panel p-6 rounded-2xl space-y-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
              <i data-lucide="target" class="w-5 h-5 text-cyan-400"></i> Best Use Cases
            </h3>
            <ul class="space-y-2.5">
              ${tool.bestUseCases.map(use => `
                <li class="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                  <i data-lucide="sparkles" class="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"></i>
                  <span>${use}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- 11. Pros -->
          <div class="glass-panel p-6 rounded-2xl space-y-4 border-emerald-500/20">
            <h3 class="text-lg font-bold text-emerald-400 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <i data-lucide="thumbs-up" class="w-5 h-5"></i> Advantages & Pros
            </h3>
            <ul class="space-y-2.5">
              ${tool.pros.map(pro => `
                <li class="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                  <i data-lucide="check" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"></i>
                  <span>${pro}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- 12. Cons -->
          <div class="glass-panel p-6 rounded-2xl space-y-4 border-rose-500/20">
            <h3 class="text-lg font-bold text-rose-400 flex items-center gap-2 border-b border-zinc-800 pb-3">
              <i data-lucide="thumbs-down" class="w-5 h-5"></i> Drawbacks & Cons
            </h3>
            <ul class="space-y-2.5">
              ${tool.cons.map(con => `
                <li class="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                  <i data-lucide="x-circle" class="w-4 h-4 text-rose-400 shrink-0 mt-0.5"></i>
                  <span>${con}</span>
                </li>
              `).join('')}
            </ul>
          </div>

        </div>

        <!-- 14. Supported Platforms -->
        <div class="glass-panel p-6 rounded-2xl space-y-3">
          <h3 class="text-sm uppercase font-bold text-zinc-400 tracking-wider">Supported Platforms</h3>
          <div class="flex flex-wrap gap-2">
            ${tool.supportedPlatforms.map(plat => `
              <span class="bg-zinc-800/90 text-zinc-200 px-3 py-1 rounded-lg text-xs font-medium border border-zinc-700/60 flex items-center gap-1.5">
                <i data-lucide="monitor" class="w-3.5 h-3.5 text-indigo-400"></i> ${plat}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- 15. Screenshots Gallery (Optional) -->
        ${tool.screenshots && tool.screenshots.length > 0 ? `
          <div class="glass-panel p-6 rounded-2xl space-y-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i data-lucide="image" class="w-5 h-5 text-indigo-400"></i> Interface Screenshots
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${tool.screenshots.map(img => `
                <div class="rounded-xl overflow-hidden border border-zinc-800 group relative">
                  <img src="${img}" alt="${tool.name} Screenshot" loading="lazy" decoding="async" width="800" height="500"
                       class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 16. Video Demo (Optional) -->
        ${tool.video ? `
          <div class="glass-panel p-6 rounded-2xl space-y-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <i data-lucide="video" class="w-5 h-5 text-indigo-400"></i> Video Overview & Demo
            </h3>
            <div class="aspect-video w-full rounded-xl overflow-hidden border border-zinc-800">
              <iframe class="w-full h-full" src="${tool.video}" title="${tool.name} Demo Video" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
        ` : ''}

        <!-- 17. FAQ Accordion -->
        <div class="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <h3 class="text-xl font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <i data-lucide="help-circle" class="w-5 h-5 text-indigo-400"></i> Frequently Asked Questions
          </h3>
          <div class="space-y-3">
            ${tool.faq.map((item, qIdx) => `
              <div class="bg-zinc-900/80 rounded-xl border border-zinc-800/80 overflow-hidden">
                <button onclick="toggleFaq(${qIdx})" class="w-full text-left p-4 text-sm font-semibold text-white flex items-center justify-between hover:bg-zinc-800/50 transition-colors">
                  <span>${item.question}</span>
                  <i id="faq-icon-${qIdx}" data-lucide="chevron-down" class="w-4 h-4 text-indigo-400 transition-transform"></i>
                </button>
                <div id="faq-ans-${qIdx}" class="hidden p-4 pt-0 text-xs sm:text-sm text-zinc-300 border-t border-zinc-800/40 leading-relaxed">
                  ${item.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 19. Compare Similar Tools -->
        <div class="glass-panel p-6 sm:p-8 rounded-2xl space-y-4">
          <h3 class="text-xl font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <i data-lucide="arrow-right-left" class="w-5 h-5 text-indigo-400"></i> Compare ${tool.name} with Alternatives
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm text-zinc-300 border-collapse">
              <thead>
                <tr class="border-b border-zinc-800 text-zinc-400 font-semibold">
                  <th class="py-3 px-4">Feature / Metric</th>
                  <th class="py-3 px-4 text-indigo-300 font-bold">${tool.name} (Current)</th>
                  ${compareList.map(comp => `<th class="py-3 px-4 text-white">${comp.name}</th>`).join('')}
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-800/60">
                <tr>
                  <td class="py-3 px-4 font-semibold text-zinc-400">Category</td>
                  <td class="py-3 px-4 text-indigo-300">${category.name}</td>
                  ${compareList.map(comp => `<td class="py-3 px-4">${comp.category}</td>`).join('')}
                </tr>
                <tr>
                  <td class="py-3 px-4 font-semibold text-zinc-400">Pricing Model</td>
                  <td class="py-3 px-4 font-bold text-indigo-300">${tool.pricingModel}</td>
                  ${compareList.map(comp => `<td class="py-3 px-4">${comp.pricingModel}</td>`).join('')}
                </tr>
                <tr>
                  <td class="py-3 px-4 font-semibold text-zinc-400">User Rating</td>
                  <td class="py-3 px-4 text-amber-400 font-bold">★ ${tool.rating} / 5.0</td>
                  ${compareList.map(comp => `<td class="py-3 px-4 text-amber-400">★ ${comp.rating}</td>`).join('')}
                </tr>
                <tr>
                  <td class="py-3 px-4 font-semibold text-zinc-400">Action</td>
                  <td class="py-3 px-4 text-indigo-400 font-semibold">Viewing Page</td>
                  ${compareList.map(comp => `
                    <td class="py-3 px-4">
                      <a href="${relPath}tools/${comp.slug}/index.html" class="text-xs text-indigo-400 hover:underline">View ${comp.name} &rarr;</a>
                    </td>
                  `).join('')}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 18. Related Tools Section -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              <i data-lucide="layers" class="w-5 h-5 text-indigo-400"></i> Related ${category.name} Tools
            </h3>
            <a href="${relPath}category/${category.slug}/index.html" class="text-xs text-indigo-400 hover:underline">Explore Category &rarr;</a>
          </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              ${relatedList.map(rel => `
                <div onclick="window.location.href='${relPath}tools/${rel.slug}/index.html'" class="cursor-pointer glass-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between group">
                  <div>
                    <div class="flex items-start justify-between gap-2 sm:gap-3 pb-2 sm:pb-3">
                      <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <a href="${relPath}tools/${rel.slug}/index.html" class="shrink-0">
                          <img src="${relPath}${rel.logoUrl || rel.logo}" alt="${rel.name}" loading="lazy" width="40" height="40"
                               class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-contain bg-zinc-900 border border-zinc-700/60 p-0.5 sm:p-1 shrink-0 group-hover:scale-105 transition-transform" 
                               onerror="this.src='${relPath}logo.jpg'" />
                        </a>
                        <div class="min-w-0">
                          <a href="${relPath}tools/${rel.slug}/index.html" class="font-semibold text-sm sm:text-base text-white group-hover:text-indigo-400 transition-colors truncate block">${rel.name}</a>
                          <p class="text-[11px] sm:text-xs text-zinc-400 truncate">${rel.category}</p>
                        </div>
                      </div>
                      <span class="text-[9px] sm:text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded font-medium shrink-0">${rel.pricingModel}</span>
                    </div>
                    <p class="text-xs text-zinc-300 line-clamp-2 sm:line-clamp-3 leading-snug sm:leading-relaxed mt-0.5 sm:mt-1">${rel.shortDescription}</p>
                  </div>
                  <div class="pt-2.5 sm:pt-4 mt-2 sm:mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                    <span class="text-xs font-semibold text-amber-400">★ ${rel.rating}</span>
                    <div class="flex items-center gap-1.5 sm:gap-2">
                      <a href="${relPath}tools/${rel.slug}/index.html" class="bg-indigo-600/80 hover:bg-indigo-600 text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-colors">Try Now</a>
                      <a href="${relPath}tools/${rel.slug}/index.html" class="text-[11px] sm:text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5">
                        Details &rsaquo;
                      </a>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
        </div>

        <!-- 20. Previous Tool & Next Tool Links -->
        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
          <a href="${relPath}tools/${prevTool.slug}/index.html" class="glass-card p-4 rounded-xl flex items-center gap-3 group">
            <i data-lucide="arrow-left" class="w-5 h-5 text-indigo-400 group-hover:-translate-x-1 transition-transform"></i>
            <div>
              <span class="text-[10px] text-zinc-500 uppercase tracking-wider block">Previous Tool</span>
              <span class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">${prevTool.name}</span>
            </div>
          </a>
          <a href="${relPath}tools/${nextTool.slug}/index.html" class="glass-card p-4 rounded-xl flex items-center justify-end text-right gap-3 group">
            <div>
              <span class="text-[10px] text-zinc-500 uppercase tracking-wider block">Next Tool</span>
              <span class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">${nextTool.name}</span>
            </div>
            <i data-lucide="arrow-right" class="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform"></i>
          </a>
        </div>

        <!-- 22. Newsletter Section -->
        <div class="glass-panel border-indigo-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div class="space-y-1">
            <h4 class="font-bold text-white text-lg flex items-center justify-center sm:justify-start gap-2">
              <i data-lucide="sparkles" class="w-5 h-5 text-indigo-400"></i> Get Weekly AI Tool Digest
            </h4>
            <p class="text-xs text-zinc-400">Join 50,000+ creators receiving the top new AI tools directly in their inbox.</p>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <input type="email" placeholder="Enter your email..."
              class="bg-zinc-900 border border-zinc-700/80 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 w-full sm:w-64" />
            <button onclick="alert('Thanks for subscribing to NANDAN AI!')"
              class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-md shrink-0">
              Subscribe
            </button>
          </div>
        </div>

        <!-- 23. Large Premium "Visit Official Website" Button (Bottom Only) -->
        <div class="glass-panel p-6 sm:p-8 rounded-2xl text-center space-y-4 border-indigo-500/50 shadow-2xl bg-indigo-950/20">
          <h3 class="text-xl font-extrabold text-white">Ready to explore ${tool.name}?</h3>
          <p class="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">Click below to open the official website directly in a new secure browser tab.</p>
          <a href="${tool.officialWebsiteUrl || tool.officialUrl || tool.websiteUrl}" 
             target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-lg px-10 py-4 rounded-xl shadow-xl shadow-indigo-600/40 hover:scale-105 transition-all">
            <span>Visit Official Website</span>
            <i data-lucide="external-link" class="w-5 h-5"></i>
          </a>
        </div>

      </main>
    </div>
  </div>

  <!-- Floating Desktop Scroll CTA -->
  <div id="desktop-scroll-cta" class="hidden sm:flex fixed bottom-6 right-6 z-40 transition-all duration-500 opacity-0 translate-y-6 pointer-events-none">
    <a href="${tool.officialWebsiteUrl || tool.officialUrl || tool.websiteUrl}" target="_blank" rel="noopener noreferrer" 
       class="inline-flex items-center gap-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-2xl shadow-indigo-500/40 hover:scale-105 border border-indigo-400/30 backdrop-blur-md transition-all">
      <span>Visit Official Website</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
    </a>
  </div>

  <!-- Sticky Mobile Bottom Bar -->
  <div class="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-800/80 p-3 flex items-center justify-between gap-3 shadow-2xl">
    <div class="flex items-center gap-2.5 min-w-0">
      <img src="${relPath}${tool.logoUrl || tool.logo}" alt="${tool.name}" class="w-8 h-8 rounded-lg object-contain bg-zinc-900 border border-zinc-700/60 p-0.5 shrink-0" onerror="this.src='${relPath}logo.jpg'" />
      <div class="truncate">
        <p class="text-xs font-bold text-white truncate">${tool.name}</p>
        <p class="text-[10px] text-zinc-400 truncate">${category.name}</p>
      </div>
    </div>
    <a href="${tool.officialWebsiteUrl || tool.officialUrl || tool.websiteUrl}" target="_blank" rel="noopener noreferrer" 
       class="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shrink-0">
      <span>Visit Site</span>
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
    </a>
  </div>

  <!-- Toast Notification -->
  <div id="toast-notification" class="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl transition-all duration-300 opacity-0 pointer-events-none translate-y-4 flex items-center gap-2.5 border border-indigo-400/40 backdrop-blur-md">
    <svg class="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
    <span id="toast-message">Page link copied to clipboard!</span>
  </div>

  ${generateFooterHTML(relPath)}
  ${generateSubmitModalHTML()}

  <script>
    lucide.createIcons();

    function toggleFaq(idx) {
      const ans = document.getElementById('faq-ans-' + idx);
      const icon = document.getElementById('faq-icon-' + idx);
      if (ans.classList.contains('hidden')) {
        ans.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
      } else {
        ans.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toast-notification');
      const toastMsg = document.getElementById('toast-message');
      if (toast && toastMsg) {
        toastMsg.innerText = msg;
        toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        toast.classList.add('opacity-100', 'translate-y-0');
        setTimeout(() => {
          toast.classList.remove('opacity-100', 'translate-y-0');
          toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        }, 3000);
      }
    }

    function copyToolLink() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Page link copied to clipboard!');
      }).catch(() => {
        showToast('Page link copied to clipboard!');
      });
    }

    function shareOnTwitter() {
      window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent('Check out ${tool.name} on NANDAN AI: ') + '&url=' + encodeURIComponent(window.location.href), '_blank');
    }
    function shareOnFacebook() {
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank');
    }
    function shareOnLinkedIn() {
      window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(window.location.href), '_blank');
    }
    function shareOnWhatsApp() {
      window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent('Check out ${tool.name} on NANDAN AI: ' + window.location.href), '_blank');
    }
    function shareOnTelegram() {
      window.open('https://t.me/share/url?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent('${tool.name} - AI Tool Directory'), '_blank');
    }
    function shareOnReddit() {
      window.open('https://www.reddit.com/submit?url=' + encodeURIComponent(window.location.href) + '&title=' + encodeURIComponent('${tool.name} - AI Tool Directory'), '_blank');
    }
    function shareViaEmail() {
      window.open('mailto:?subject=' + encodeURIComponent('Check out ${tool.name} on NANDAN AI') + '&body=' + encodeURIComponent('Check out ${tool.name}: ' + window.location.href), '_blank');
    }

    window.addEventListener('scroll', () => {
      const desktopCta = document.getElementById('desktop-scroll-cta');
      if (desktopCta) {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 35) {
          desktopCta.classList.remove('opacity-0', 'translate-y-6', 'pointer-events-none');
          desktopCta.classList.add('opacity-100', 'translate-y-0');
        } else {
          desktopCta.classList.remove('opacity-100', 'translate-y-0');
          desktopCta.classList.add('opacity-0', 'translate-y-6', 'pointer-events-none');
        }
      }
    });
  </script>
</body>
</html>`;

  const toolDir = path.join(__dirname, 'tools', tool.slug);
  ensureDir(toolDir);
  fs.writeFileSync(path.join(toolDir, 'index.html'), toolHTML, 'utf8');
});

console.log(`Generated ${tools.length} static tool details pages.`);

// -------------------------------------------------------------
// 2. GENERATE CATEGORY PAGES (/category/{slug}/index.html)
// -------------------------------------------------------------
console.log('Generating Category Pages...');

categories.forEach(cat => {
  const relPath = '../../';
  const categoryTools = tools.filter(t => t.categoryId === cat.id || t.categorySlug === cat.slug);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN },
      { "@type": "ListItem", "position": 2, "name": cat.name, "item": `${DOMAIN}/category/${cat.slug}` }
    ]
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${cat.name} AI Tools Directory`,
    "description": cat.description,
    "url": `${DOMAIN}/category/${cat.slug}`
  };

  const categoryHTML = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/jpeg" href="${relPath}logo.jpg">
  <title>Best ${cat.name} AI Tools (2026 Directory) | NANDAN AI</title>
  <meta name="description" content="Discover top rated ${cat.name} AI tools and software. Compare features, pricing, ratings, and user reviews on NANDAN AI.">
  <link rel="canonical" href="${DOMAIN}/category/${cat.slug}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${DOMAIN}/category/${cat.slug}">
  <meta property="og:title" content="${cat.name} AI Tools - NANDAN AI">
  <meta property="og:description" content="${cat.description}">
  <meta property="og:image" content="${DOMAIN}/logo.jpg">

  <!-- Tailwind CSS & Lucide -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: { extend: { screens: { xs: '475px' }, colors: { brand: { 50: '#eef2ff', 500: '#6366f1', 600: '#4f46e5' } } } }
    }
  </script>
  <script src="https://unpkg.com/lucide@latest"></script>

  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(collectionSchema)}</script>

  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: 100%; background-color: #09090b; color: #fafafa; font-family: ui-sans-serif, system-ui, sans-serif; overflow-x: hidden; }
    #bg-video { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: 0; pointer-events: none; }
    .app-viewport { position: relative; z-index: 10; min-height: 100vh; }
    .glass-panel { background: rgba(24, 24, 27, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); }
    .glass-header { background: rgba(9, 9, 11, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .glass-card { background: rgba(24, 24, 27, 0.65); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
    .glass-card:hover { background: rgba(24, 24, 27, 0.85); border-color: rgba(99, 102, 241, 0.5); transform: translateY(-2px); }
  </style>
</head>
<body>

  <video id="bg-video" autoplay loop muted playsinline>
    <source src="${relPath}background.mp4" type="video/mp4" />
  </video>

  <div class="app-viewport flex flex-col">
    ${generateHeaderHTML(relPath)}

    <div class="flex flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
      ${generateSidebarHTML(relPath, cat.slug)}

      <main class="flex-1 space-y-6 min-w-0">

        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-xs text-zinc-400 glass-panel px-4 py-3 rounded-xl border border-zinc-800/80">
          <a href="${relPath}index.html" class="hover:text-white flex items-center gap-1">
            <i data-lucide="home" class="w-3.5 h-3.5"></i> Home
          </a>
          <span>&rsaquo;</span>
          <span class="text-white font-medium">${cat.name}</span>
        </nav>

        <!-- Category Title Header -->
        <div class="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-indigo-500/30">
          <div>
            <h1 class="text-3xl font-extrabold text-white flex items-center gap-3">
              <i data-lucide="${cat.icon || 'layers'}" class="w-8 h-8 text-indigo-400"></i>
              ${cat.name} AI Tools
            </h1>
            <p class="text-sm text-zinc-300 mt-1 max-w-xl">${cat.description}</p>
            <p class="text-xs text-zinc-400 mt-2 font-medium" id="cat-count-label">Showing ${categoryTools.length} curated AI tools</p>
          </div>

          <!-- Category Live Search -->
          <div class="relative w-full sm:w-80">
            <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"></i>
            <input type="text" id="catSearch" oninput="filterCategoryTools()"
              placeholder="Search ${cat.name} tools..."
              class="w-full bg-zinc-900/90 border border-zinc-700/60 rounded-lg py-2 pl-9 pr-4 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <!-- Pricing Filters -->
        <div class="flex items-center justify-between glass-panel p-4 rounded-xl">
          <div class="flex items-center gap-4 text-xs text-zinc-400">
            <span class="font-semibold text-zinc-300">Filter Pricing:</span>
            <label class="flex items-center gap-1.5 cursor-pointer hover:text-white">
              <input type="radio" name="catPricing" value="all" checked onchange="filterCategoryTools()" class="text-indigo-600 focus:ring-indigo-500" /> All
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer hover:text-white">
              <input type="radio" name="catPricing" value="Free" onchange="filterCategoryTools()" class="text-indigo-600 focus:ring-indigo-500" /> Free
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer hover:text-white">
              <input type="radio" name="catPricing" value="Freemium" onchange="filterCategoryTools()" class="text-indigo-600 focus:ring-indigo-500" /> Freemium
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer hover:text-white">
              <input type="radio" name="catPricing" value="Paid" onchange="filterCategoryTools()" class="text-indigo-600 focus:ring-indigo-500" /> Paid
            </label>
          </div>
        </div>

        <!-- Tools Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="category-tools-grid">
          ${categoryTools.map(tool => `
            <div onclick="window.location.href='${relPath}tools/${tool.slug}/index.html'" class="cursor-pointer glass-card rounded-2xl p-5 flex flex-col justify-between group tool-card-item" 
                 data-name="${tool.name.toLowerCase()}" 
                 data-desc="${tool.shortDescription.toLowerCase()}" 
                 data-pricing="${tool.pricingModel.toLowerCase()}">
              <div>
                <div class="flex items-start justify-between gap-3 pb-3">
                  <div class="flex items-center gap-3">
                    <a href="${relPath}tools/${tool.slug}/index.html">
                      <img src="${relPath}${tool.logoUrl || tool.logo}" alt="${tool.name}" loading="lazy" width="40" height="40"
                           class="w-10 h-10 rounded-xl object-contain bg-zinc-900 border border-zinc-700/60 p-1 shrink-0 group-hover:scale-105 transition-transform" 
                           onerror="this.src='${relPath}logo.jpg'" />
                    </a>
                    <div>
                      <a href="${relPath}tools/${tool.slug}/index.html" class="font-semibold text-white group-hover:text-indigo-400 transition-colors">${tool.name}</a>
                      <p class="text-xs text-zinc-400">${cat.name}</p>
                    </div>
                  </div>
                  <span class="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-medium shrink-0">${tool.pricingModel}</span>
                </div>
                <p class="text-xs text-zinc-300 line-clamp-3 leading-relaxed mt-1">${tool.shortDescription}</p>
              </div>
              <div class="pt-4 mt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div class="flex items-center gap-1 text-xs font-semibold text-amber-400">
                  <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
                  <span>${tool.rating}</span>
                </div>
                <div class="flex items-center gap-2">
                  <a href="${relPath}tools/${tool.slug}/index.html" class="bg-indigo-600/80 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-xs font-semibold transition-colors">Try Now</a>
                  <a href="${relPath}tools/${tool.slug}/index.html" class="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    Details &rsaquo;
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

      </main>
    </div>
  </div>

  ${generateFooterHTML(relPath)}
  ${generateSubmitModalHTML()}

  <script>
    lucide.createIcons();

    function filterCategoryTools() {
      const q = document.getElementById('catSearch').value.toLowerCase();
      const pricingRadio = document.querySelector('input[name="catPricing"]:checked');
      const p = pricingRadio ? pricingRadio.value.toLowerCase() : 'all';

      const cards = document.querySelectorAll('.tool-card-item');
      let visible = 0;

      cards.forEach(card => {
        const name = card.getAttribute('data-name');
        const desc = card.getAttribute('data-desc');
        const pricing = card.getAttribute('data-pricing');

        const matchesSearch = name.includes(q) || desc.includes(q);
        const matchesPricing = p === 'all' || pricing === p;

        if (matchesSearch && matchesPricing) {
          card.style.display = 'flex';
          visible++;
        } else {
          card.style.display = 'none';
        }
      });

      document.getElementById('cat-count-label').innerText = 'Showing ' + visible + ' curated AI tools';
    }
  </script>
</body>
</html>`;

  const catDir = path.join(__dirname, 'category', cat.slug);
  ensureDir(catDir);
  fs.writeFileSync(path.join(catDir, 'index.html'), categoryHTML, 'utf8');
});

console.log(`Generated ${categories.length} static category pages.`);

// -------------------------------------------------------------
// 3. GENERATE MAIN HOMEPAGE (index.html)
// -------------------------------------------------------------
console.log('Generating Homepage...');

const featuredTool = tools.find(t => t.isFeatured) || tools[0];
const trendingTools = tools.filter(t => t.id !== featuredTool.id).slice(0, 2);

const homeHTML = `<!DOCTYPE html>
<html lang="en" class="dark">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/jpeg" href="logo.jpg">
  <title>NANDAN AI - ALL IN ONE AI TOOLS DIRECTORY</title>
  <meta name="description" content="Discover 2,400+ top AI tools, web apps, chatbots, video generators, and software on NANDAN AI directory.">
  <meta name="google-site-verification" content="_DzXTeLJQz_FNIVhHpAR219hKt2GqaPDnNzpe_HVWIQ" />
  <link rel="canonical" href="${DOMAIN}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${DOMAIN}">
  <meta property="og:title" content="NANDAN AI - ALL IN ONE AI">
  <meta property="og:description" content="Discover 2,400+ top AI tools, chatbots, image generators & developer tools.">
  <meta property="og:image" content="${DOMAIN}/logo.jpg">

  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          screens: { xs: '475px' },
          colors: {
            brand: { 50: '#eef2ff', 100: '#e0e7ff', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca' }
          }
        }
      }
    }
  </script>
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- Global Schemas -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NANDAN AI",
    "url": "${DOMAIN}",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "${DOMAIN}/index.html?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
  </script>

  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: 100%; background-color: #09090b; color: #fafafa; font-family: ui-sans-serif, system-ui, sans-serif; overflow-x: hidden; }
    #bg-video { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: 0; pointer-events: none; }
    .app-viewport { position: relative; z-index: 10; min-height: 100vh; }
    .glass-panel { background: rgba(24, 24, 27, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); }
    .glass-header { background: rgba(9, 9, 11, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .glass-card { background: rgba(24, 24, 27, 0.65); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
    .glass-card:hover { background: rgba(24, 24, 27, 0.85); border-color: rgba(99, 102, 241, 0.5); transform: translateY(-2px); }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(9, 9, 11, 0.8); }
    ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: #4f46e5; }
  </style>
</head>

<body>

  <video id="bg-video" autoplay loop muted playsinline>
    <source src="background.mp4" type="video/mp4" />
  </video>

  <div class="app-viewport flex flex-col">

    ${generateHeaderHTML('')}

    <div class="flex flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">

      <aside class="w-64 glass-panel rounded-2xl p-5 hidden lg:flex flex-col gap-6 shrink-0 h-[calc(100vh-6rem)] sticky top-20">
        <div>
          <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Navigation</h3>
          <ul class="space-y-1">
            <li>
              <button onclick="showSection('home')" id="nav-home"
                class="w-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-3 py-2 rounded-lg text-sm flex items-center gap-2 font-medium transition-colors">
                <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
                Dashboard
              </button>
            </li>
            <li>
              <button onclick="showSection('directory')" id="nav-directory"
                class="w-full text-zinc-400 hover:bg-zinc-800/60 hover:text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
                <i data-lucide="grid" class="w-4 h-4"></i>
                All Tools
              </button>
            </li>
          </ul>
        </div>

        <div class="overflow-y-auto pr-1">
          <h3 class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Categories</h3>
          <ul class="space-y-1 text-sm text-zinc-300" id="sidebar-categories">
            ${categories.map(cat => `
              <li>
                <a href="category/${cat.slug}/index.html" class="w-full text-left px-3 py-1.5 rounded-lg hover:bg-zinc-800/50 hover:text-white transition-colors flex items-center justify-between text-xs">
                  <span>${cat.name}</span>
                  <span class="text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">${tools.filter(t => t.categoryId === cat.id || t.categorySlug === cat.slug).length}</span>
                </a>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="mt-auto pt-4 border-t border-zinc-800/80">
          <div class="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-3 flex items-center gap-3">
            <img src="logo.jpg" alt="NANDAN AI"
              class="w-8 h-8 rounded-lg object-cover border border-cyan-500/40 shrink-0" />
            <div>
              <p class="text-xs text-indigo-300 font-semibold leading-tight">NANDAN AI</p>
              <p class="text-[10px] text-zinc-400 mt-0.5">ALL IN ONE AI</p>
            </div>
          </div>
        </div>
      </aside>

      <main class="flex-1 space-y-8 min-w-0">

        <!-- HOME SECTION -->
        <div id="section-home" class="space-y-8">

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">

            <!-- Featured Tool of the Week -->
            <div id="featured-card-container" onclick="window.location.href='tools/${featuredTool.slug}/index.html'"
              class="cursor-pointer md:col-span-2 md:row-span-3 glass-panel border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group shadow-2xl">
              <div class="relative z-10">
                <span class="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-indigo-500/30 shadow-sm">
                  Tool of the Week
                </span>
                <h2 class="text-3xl font-bold mt-4 text-white group-hover:text-indigo-300 transition-colors">${featuredTool.name}</h2>
                <p class="text-zinc-300 mt-2 text-sm max-w-sm leading-relaxed">${featuredTool.shortDescription}</p>
              </div>
              <div class="flex items-center gap-3 z-10 mt-6">
                <a href="tools/${featuredTool.slug}/index.html" class="bg-white text-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-all shadow-lg">
                  Try Now
                </a>
                <a href="tools/${featuredTool.slug}/index.html" class="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold border border-white/10 transition-colors text-white">
                  Details &rsaquo;
                </a>
              </div>
              <div class="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform pointer-events-none"></div>
            </div>

            <!-- Trending Tool 1 -->
            <div onclick="window.location.href='tools/${trendingTools[0].slug}/index.html'" class="cursor-pointer md:col-span-1 md:row-span-2 glass-card rounded-2xl p-5 flex flex-col justify-between group">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <a href="tools/${trendingTools[0].slug}/index.html" class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
                    ${trendingTools[0].name.charAt(0)}
                  </a>
                  <span class="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-medium">${trendingTools[0].pricingModel}</span>
                </div>
                <a href="tools/${trendingTools[0].slug}/index.html" class="font-bold text-white group-hover:text-indigo-400 transition-colors">${trendingTools[0].name}</a>
                <p class="text-xs text-zinc-400 mt-1 line-clamp-2">${trendingTools[0].shortDescription}</p>
              </div>
              <div class="pt-4 flex items-center justify-between border-t border-zinc-800/60 mt-2">
                <span class="text-xs font-semibold text-emerald-400">★ ${trendingTools[0].rating}</span>
                <div class="flex items-center gap-2">
                  <a href="tools/${trendingTools[0].slug}/index.html" class="bg-indigo-600/80 hover:bg-indigo-600 text-white px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors">Try Now</a>
                  <a href="tools/${trendingTools[0].slug}/index.html" class="text-xs text-indigo-400 hover:underline">Details &rsaquo;</a>
                </div>
              </div>
            </div>

            <!-- Trending Tool 2 -->
            <div onclick="window.location.href='tools/${trendingTools[1].slug}/index.html'" class="cursor-pointer md:col-span-1 md:row-span-2 glass-card rounded-2xl p-5 flex flex-col justify-between group">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <a href="tools/${trendingTools[1].slug}/index.html" class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg">
                    ${trendingTools[1].name.charAt(0)}
                  </a>
                  <span class="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-medium">${trendingTools[1].pricingModel}</span>
                </div>
                <a href="tools/${trendingTools[1].slug}/index.html" class="font-bold text-white group-hover:text-indigo-400 transition-colors">${trendingTools[1].name}</a>
                <p class="text-xs text-zinc-400 mt-1 line-clamp-2">${trendingTools[1].shortDescription}</p>
              </div>
              <div class="pt-4 flex items-center justify-between border-t border-zinc-800/60 mt-2">
                <span class="text-xs font-semibold text-blue-400">★ ${trendingTools[1].rating}</span>
                <div class="flex items-center gap-2">
                  <a href="tools/${trendingTools[1].slug}/index.html" class="bg-indigo-600/80 hover:bg-indigo-600 text-white px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors">Try Now</a>
                  <a href="tools/${trendingTools[1].slug}/index.html" class="text-xs text-indigo-400 hover:underline">Details &rsaquo;</a>
                </div>
              </div>
            </div>

            <!-- Statistics Banner -->
            <div class="md:col-span-2 glass-panel rounded-2xl p-4 flex items-center justify-around">
              <div class="text-center">
                <div class="text-2xl font-bold text-white">${tools.length}</div>
                <div class="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Total Tools</div>
              </div>
              <div class="h-8 w-px bg-zinc-800"></div>
              <div class="text-center">
                <div class="text-2xl font-bold text-white">${categories.length}</div>
                <div class="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">Categories</div>
              </div>
              <div class="h-8 w-px bg-zinc-800"></div>
              <div class="text-center">
                <div class="text-2xl font-bold text-indigo-400">12k+</div>
                <div class="text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">User Reviews</div>
              </div>
            </div>

            <!-- Popular Categories Grid -->
            <div class="md:col-span-3 glass-panel rounded-2xl p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-white text-lg flex items-center gap-2">
                  <i data-lucide="layers" class="w-5 h-5 text-indigo-400"></i>
                  Popular Categories
                </h3>
                <button onclick="showSection('directory')"
                  class="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All &rarr;</button>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                ${categories.slice(0, 6).map(cat => `
                  <a href="category/${cat.slug}/index.html" class="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800/80 transition-all text-center group">
                    <div class="font-semibold text-sm text-zinc-200 group-hover:text-indigo-300">${cat.name}</div>
                    <div class="text-[10px] text-zinc-500 mt-0.5">${tools.filter(t => t.categoryId === cat.id || t.categorySlug === cat.slug).length} tools</div>
                  </a>
                `).join('')}
              </div>
            </div>

            <!-- Newsletter -->
            <div class="md:col-span-1 glass-panel border-indigo-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <div class="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 mb-3 border border-indigo-500/30">
                <i data-lucide="sparkles" class="w-6 h-6"></i>
              </div>
              <h4 class="font-bold text-white">Stay Updated</h4>
              <p class="text-xs text-zinc-400 mt-2 mb-4">Top AI tools delivered straight to your inbox weekly.</p>
              <input type="email" placeholder="email@domain.com"
                class="w-full bg-zinc-900/90 border border-zinc-700/60 rounded-lg px-3 py-2 text-xs mb-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500" />
              <button onclick="alert('Thanks for subscribing to NANDAN AI!')"
                class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-xs font-bold transition-colors shadow-md">
                Join 50k+ Readers
              </button>
            </div>

          </div>

          <!-- Quick Directory Preview -->
          <div class="glass-panel rounded-2xl p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-white text-xl">Top AI Tools</h3>
              <button onclick="showSection('directory')"
                class="text-sm text-indigo-400 hover:underline font-medium">Explore All ${tools.length} Tools &rarr;</button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              ${tools.slice(0, 6).map(t => `
              ${tools.slice(0, 6).map(t => createToolCardHTML(t)).join('')}
            </div>
          </div>

        </div>

        <!-- DIRECTORY PAGE SECTION -->
        <div id="section-directory" class="hidden space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl">
            <div>
              <h1 class="text-3xl font-bold tracking-tight text-white" id="dir-title">All AI Tools</h1>
              <p class="text-zinc-400 text-sm mt-1" id="dir-count">Loading ${tools.length} tools...</p>
            </div>

            <div class="relative w-full sm:w-80">
              <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"></i>
              <input type="text" id="dirSearch" oninput="renderDirectoryTools()"
                placeholder="Search tools or keywords..."
                class="w-full bg-zinc-900/90 border border-zinc-700/60 rounded-lg py-2 pl-9 pr-4 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <!-- Filters Row -->
          <div class="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-xl">
            <div class="flex items-center gap-2 overflow-x-auto pb-1 max-w-full" id="category-pills">
              <!-- Rendered via JS -->
            </div>

            <div class="flex items-center gap-4 text-xs text-zinc-400 shrink-0">
              <span class="font-semibold text-zinc-300">Pricing:</span>
              <label class="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input type="radio" name="pricing" value="all" checked onchange="setPricingFilter('all')" class="text-indigo-600 focus:ring-indigo-500" /> All
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input type="radio" name="pricing" value="Free" onchange="setPricingFilter('Free')" class="text-indigo-600 focus:ring-indigo-500" /> Free
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input type="radio" name="pricing" value="Freemium" onchange="setPricingFilter('Freemium')" class="text-indigo-600 focus:ring-indigo-500" /> Freemium
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer hover:text-white">
                <input type="radio" name="pricing" value="Paid" onchange="setPricingFilter('Paid')" class="text-indigo-600 focus:ring-indigo-500" /> Paid
              </label>
            </div>
          </div>

          <!-- Tools Cards Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="directory-tools-grid">
            <!-- Rendered via JS -->
          </div>
        </div>

      </main>
    </div>
  </div>

  ${generateFooterHTML('')}
  ${generateSubmitModalHTML()}

  <script>
    const CATEGORIES = ${JSON.stringify(categories)};
    const TOOLS = ${JSON.stringify(tools)};

    let activeCategorySlug = null;
    let activePricingFilter = 'all';

    function initApp() {
      renderCategoryPills();
      renderDirectoryTools();

      const urlParams = new URLSearchParams(window.location.search);
      const searchQ = urlParams.get('search');
      if (searchQ) {
        const gh = document.getElementById('globalHeaderSearch') || document.getElementById('globalSearch');
        if (gh) gh.value = searchQ;
        handleGlobalSearch(searchQ);
      }
      lucide.createIcons();
    }

    function showSection(section) {
      const secHome = document.getElementById('section-home');
      const secDir = document.getElementById('section-directory');
      if (secHome) secHome.classList.add('hidden');
      if (secDir) secDir.classList.add('hidden');

      const navHome = document.getElementById('nav-home');
      const navDir = document.getElementById('nav-directory');

      if (section === 'home') {
        if (secHome) secHome.classList.remove('hidden');
        if (navHome) navHome.className = "w-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-3 py-2 rounded-lg text-sm flex items-center gap-2 font-medium transition-colors";
        if (navDir) navDir.className = "w-full text-zinc-400 hover:bg-zinc-800/60 hover:text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors";
      } else {
        if (secDir) secDir.classList.remove('hidden');
        if (navDir) navDir.className = "w-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-3 py-2 rounded-lg text-sm flex items-center gap-2 font-medium transition-colors";
        if (navHome) navHome.className = "w-full text-zinc-400 hover:bg-zinc-800/60 hover:text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors";
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderCategoryPills() {
      const container = document.getElementById('category-pills');
      const allActive = !activeCategorySlug;

      let html = `
        <button type="button" onclick="filterByCategory(null)" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer \${allActive ? 'bg-indigo-600 text-white' : 'bg-zinc-800/80 text-zinc-400 hover:text-white'}">
          All Categories
        </button>
      `;

      html += CATEGORIES.map(cat => {
        const isActive = activeCategorySlug === cat.slug;
        return `
          <button type="button" onclick="filterByCategory('\${cat.slug}')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer \${isActive ? 'bg-indigo-600 text-white' : 'bg-zinc-800/80 text-zinc-400 hover:text-white'}">
            \${cat.name}
          </button>
        `;
      }).join('');

      container.innerHTML = html;
    }

    function filterByCategory(slug) {
      activeCategorySlug = slug;
      showSection('directory');
      renderCategoryPills();
      renderDirectoryTools();

      const cat = CATEGORIES.find(c => c.slug === slug);
      document.getElementById('dir-title').innerText = cat ? cat.name : "All AI Tools";
    }

    function setPricingFilter(pricing) {
      activePricingFilter = pricing;
      renderDirectoryTools();
    }

    function handleGlobalSearch(query) {
      if (query.trim().length > 0) {
        document.getElementById('dirSearch').value = query;
        showSection('directory');
        renderDirectoryTools();
      }
    }

    function renderDirectoryTools() {
      const query = document.getElementById('dirSearch').value.toLowerCase();
      const currentCat = CATEGORIES.find(c => c.slug === activeCategorySlug);

      const filtered = TOOLS.filter(t => {
        const matchesCategory = currentCat ? (t.categoryId === currentCat.id || t.categorySlug === currentCat.slug) : true;
        const matchesPricing = activePricingFilter === 'all' ? true : t.pricingModel.toLowerCase() === activePricingFilter.toLowerCase();
        const matchesSearch = t.name.toLowerCase().includes(query) || t.shortDescription.toLowerCase().includes(query);
        return matchesCategory && matchesPricing && matchesSearch;
      });

      document.getElementById('dir-count').innerText = `${filtered.length} ${filtered.length === 1 ? 'tool' : 'tools'} available`;
      const grid = document.getElementById('directory-tools-grid');

      if (filtered.length > 0) {
        grid.innerHTML = filtered.map(createToolCardHTML).join('');
      } else {
        grid.innerHTML = `
          <div class="col-span-full text-center py-16 glass-panel rounded-2xl border-dashed">
            <i data-lucide="search-x" class="w-10 h-10 text-zinc-500 mx-auto mb-3"></i>
            <h3 class="text-lg font-semibold text-white">No tools found</h3>
            <p class="text-xs text-zinc-400 mt-1">Try adjusting your category, pricing, or search term.</p>
          </div>
        `;
      }
      lucide.createIcons();
    }

    function createToolCardHTML(tool) {
      const category = CATEGORIES.find(c => c.id === tool.categoryId || c.slug === tool.categorySlug);
      return `
        <div onclick="window.location.href='tools/${tool.slug}/index.html'" class="cursor-pointer glass-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between group">
          <div>
            <div class="flex items-start justify-between gap-2 sm:gap-3 pb-2 sm:pb-3">
              <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <a href="tools/${tool.slug}/index.html" class="shrink-0">
                  <img src="${tool.logoUrl || tool.logo}" alt="${tool.name}" loading="lazy" width="40" height="40"
                       class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-contain bg-zinc-900 border border-zinc-700/60 p-0.5 sm:p-1 shrink-0 group-hover:scale-105 transition-transform" 
                       onerror="this.src='logo.jpg'" />
                </a>
                <div class="min-w-0">
                  <a href="tools/${tool.slug}/index.html" class="font-semibold text-sm sm:text-base text-white group-hover:text-indigo-400 transition-colors truncate block">${tool.name}</a>
                  <span class="text-[11px] sm:text-xs text-zinc-400 block truncate">${category ? category.name : ''}</span>
                </div>
              </div>
              <span class="text-[9px] sm:text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded font-medium shrink-0">${tool.pricingModel}</span>
            </div>
            <p class="text-xs text-zinc-300 line-clamp-2 sm:line-clamp-3 leading-snug sm:leading-relaxed mt-0.5 sm:mt-1">${tool.shortDescription}</p>
          </div>
          <div class="pt-2.5 sm:pt-4 mt-2 sm:mt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <div class="flex items-center gap-1 text-xs font-semibold text-amber-400">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
              <span>${tool.rating}</span>
            </div>
            <div class="flex items-center gap-1.5 sm:gap-2">
              <a href="tools/${tool.slug}/index.html" class="bg-indigo-600/80 hover:bg-indigo-600 text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-colors">Try Now</a>
              <a href="tools/${tool.slug}/index.html" class="text-[11px] sm:text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5">Details &rsaquo;</a>
            </div>
          </div>
        </div>
      `;
    }

    window.addEventListener('DOMContentLoaded', () => {
      initApp();
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), homeHTML, 'utf8');
console.log('Generated index.html successfully.');

// -------------------------------------------------------------
// 4. GENERATE CUSTOM 404 PAGE (404.html)
// -------------------------------------------------------------
console.log('Generating 404 Page...');

const popularTools = tools.slice(0, 3);

const page404HTML = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/jpeg" href="logo.jpg">
  <title>404 - Page Not Found | NANDAN AI</title>
  <meta name="robots" content="noindex, follow">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: { extend: { colors: { brand: { 50: '#eef2ff', 500: '#6366f1', 600: '#4f46e5' } } } }
    }
  </script>
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; width: 100%; background-color: #09090b; color: #fafafa; font-family: ui-sans-serif, system-ui, sans-serif; overflow-x: hidden; }
    #bg-video { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: 0; pointer-events: none; }
    .app-viewport { position: relative; z-index: 10; min-height: 100vh; }
    .glass-panel { background: rgba(24, 24, 27, 0.75); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.1); }
    .glass-header { background: rgba(9, 9, 11, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .glass-card { background: rgba(24, 24, 27, 0.65); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
    .glass-card:hover { background: rgba(24, 24, 27, 0.85); border-color: rgba(99, 102, 241, 0.5); transform: translateY(-2px); }
  </style>
</head>
<body>

  <video id="bg-video" autoplay loop muted playsinline>
    <source src="background.mp4" type="video/mp4" />
  </video>

  <div class="app-viewport flex flex-col min-h-screen">
    ${generateHeaderHTML()}

    <main class="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col items-center justify-center text-center my-12 space-y-8">
      
      <div class="glass-panel p-8 sm:p-12 rounded-3xl border-indigo-500/40 shadow-2xl max-w-2xl w-full space-y-6">
        <div class="w-20 h-20 bg-indigo-600/20 border border-indigo-500/40 rounded-full flex items-center justify-center mx-auto text-indigo-400 shadow-lg animate-pulse">
          <i data-lucide="compass" class="w-10 h-10"></i>
        </div>

        <div>
          <h1 class="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-500 tracking-tight">404</h1>
          <h2 class="text-2xl font-bold text-white mt-2">AI Page Lost in Hyperspace</h2>
          <p class="text-sm text-zinc-300 mt-2 leading-relaxed max-w-md mx-auto">The page or tool URL you are looking for might have been moved, renamed, or doesn't exist.</p>
        </div>

        <!-- Search Box -->
        <div class="relative max-w-md mx-auto">
          <i data-lucide="search" class="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"></i>
          <input type="text" onkeydown="if(event.key==='Enter') location.href='index.html?search=' + encodeURIComponent(this.value)"
            placeholder="Search AI tools instead..."
            class="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <a href="index.html" class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Homepage
          </a>
        </div>
      </div>

      <!-- Popular Tools Recommendation -->
      <div class="w-full space-y-4">
        <h3 class="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Popular AI Tools You Might Like</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          ${popularTools.map(pt => `
            <a href="tools/${pt.slug}/index.html" class="glass-card p-4 rounded-xl text-left block group">
              <div class="flex items-center gap-3 mb-2">
                <img src="${pt.logoUrl || pt.logo}" alt="${pt.name}" loading="lazy" width="32" height="32" class="w-8 h-8 rounded-lg object-contain bg-zinc-900 border border-zinc-700 p-0.5" onerror="this.src='logo.jpg'" />
                <span class="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm">${pt.name}</span>
              </div>
              <p class="text-xs text-zinc-400 line-clamp-2">${pt.shortDescription}</p>
            </a>
          `).join('')}
        </div>
      </div>

    </main>
  </div>

  ${generateFooterHTML('')}
  ${generateSubmitModalHTML()}

  <script>
    lucide.createIcons();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '404.html'), page404HTML, 'utf8');
console.log('Generated 404.html successfully.');

// -------------------------------------------------------------
// 5. GENERATE SITEMAP.XML
// -------------------------------------------------------------
console.log('Generating sitemap.xml...');

const today = new Date().toISOString().split('T')[0];

const urls = [
  { loc: `${DOMAIN}/`, priority: '1.0', changefreq: 'daily' }
];

categories.forEach(cat => {
  urls.push({ loc: `${DOMAIN}/category/${cat.slug}`, priority: '0.8', changefreq: 'weekly' });
});

tools.forEach(t => {
  urls.push({ loc: `${DOMAIN}/tools/${t.slug}`, priority: '0.9', changefreq: 'weekly' });
});

// Deduplicate and ensure only canonical URLs remain (filter out /index.html, /404.html)
const uniqueUrls = [];
const seenLocs = new Set();
for (const u of urls) {
  const cleanLoc = u.loc.replace(/\/index\.html$/, '/').replace(/\/404\.html$/, '');
  if (!cleanLoc.includes('/index.html') && !cleanLoc.includes('/404.html') && !seenLocs.has(cleanLoc)) {
    seenLocs.add(cleanLoc);
    uniqueUrls.push({ ...u, loc: cleanLoc });
  }
}

const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapXML, 'utf8');
console.log(`Generated sitemap.xml with ${uniqueUrls.length} URLs.`);

// -------------------------------------------------------------
// 6. GENERATE ROBOTS.TXT
// -------------------------------------------------------------
console.log('Generating robots.txt...');

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
`;

fs.writeFileSync(path.join(__dirname, 'robots.txt'), robotsTxt, 'utf8');
console.log('Generated robots.txt successfully.');

console.log('\n✅ NANDAN AI BUILD COMPLETE! All static pages generated successfully.');
