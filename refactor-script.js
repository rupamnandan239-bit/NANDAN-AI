const fs = require('fs');
const path = require('path');

const jsFile = path.join(__dirname, 'build.js');
let jsCode = fs.readFileSync(jsFile, 'utf8');

// 1. Remove #section-directory from build.js homepage HTML
const dirSectionRegex = /<!-- DIRECTORY PAGE SECTION -->[\s\S]*?<!-- DIRECTORY PAGE SECTION END -->|<!-- DIRECTORY PAGE SECTION -->[\s\S]*?(?=<\/main>)/;
let dirSectionMatch = jsCode.match(dirSectionRegex);
if (!dirSectionMatch) {
    console.error("Could not find section-directory in build.js");
} else {
    // Keep it to create the tools/index.html
    const dirSectionHtml = dirSectionMatch[0];
    
    // Remove it from homepage HTML
    jsCode = jsCode.replace(dirSectionMatch[0], '');

    // Now, let's create the code block to append for generating tools/index.html
    const allToolsGeneration = `
// -------------------------------------------------------------
// X. GENERATE ALL TOOLS PAGE (/tools/index.html)
// -------------------------------------------------------------
console.log('Generating All Tools Page...');

const allToolsHTML = \`<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/jpeg" href="../logo.jpg">
  <title>All AI Tools Directory | NANDAN AI</title>
  <meta name="description" content="Explore our full directory of AI tools and software.">
  <link rel="canonical" href="\${DOMAIN}/tools">

  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: { extend: { screens: { xs: '475px' }, colors: { brand: { 50: '#eef2ff', 500: '#6366f1', 600: '#4f46e5' } } } }
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
    <source src="../background.mp4" type="video/mp4" />
  </video>

  <div class="app-viewport flex flex-col">
    \${generateHeaderHTML('../')}

    <div class="flex flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
      \${generateSidebarHTML('../', null)}

      <main class="flex-1 space-y-6 min-w-0">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-xs text-zinc-400 glass-panel px-4 py-3 rounded-xl border border-zinc-800/80 mb-4">
          <a href="../index.html" class="hover:text-white flex items-center gap-1">
            <i data-lucide="home" class="w-3.5 h-3.5"></i> Home
          </a>
          <span>&rsaquo;</span>
          <span class="text-white font-medium">All Tools</span>
        </nav>
        
        \${` + JSON.stringify(dirSectionHtml) + `}
      </main>
    </div>
  </div>

  \${generateFooterHTML('../')}
  \${generateSubmitModalHTML()}

  <script>
    const CATEGORIES = \${JSON.stringify(categories)};
    const TOOLS = \${JSON.stringify(tools)};
    let activeCategorySlug = null;
    let activePricingFilter = 'all';

    function initApp() {
      document.getElementById('section-directory').classList.remove('hidden');
      renderCategoryPills();
      renderDirectoryTools();

      const urlParams = new URLSearchParams(window.location.search);
      const searchQ = urlParams.get('search');
      if (searchQ) {
        const gh = document.getElementById('globalHeaderSearch');
        if (gh) gh.value = searchQ;
        const dh = document.getElementById('dirSearch');
        if (dh) dh.value = searchQ;
        renderDirectoryTools();
      }
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    
    function filterByCategory(slug) {
      activeCategorySlug = slug;
      renderCategoryPills();
      renderDirectoryTools();
      const cat = CATEGORIES.find(c => c.slug === slug);
      const titleEl = document.getElementById('dir-title');
      if (titleEl) titleEl.innerText = cat ? cat.name : "All AI Tools";
    }

    function renderCategoryPills() {
      const container = document.getElementById('category-pills');
      if (!container) return;
      const allActive = !activeCategorySlug;
      let html = \`
        <button type="button" onclick="filterByCategory(null)" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 touch-manipulation \${allActive ? 'bg-indigo-600 text-white' : 'bg-zinc-800/80 text-zinc-400 hover:text-white'}">
          All Categories
        </button>
      \`;
      html += CATEGORIES.map(cat => {
        const isActive = activeCategorySlug === cat.slug;
        return \`
          <button type="button" onclick="filterByCategory('\${cat.slug}')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 touch-manipulation \${isActive ? 'bg-indigo-600 text-white' : 'bg-zinc-800/80 text-zinc-400 hover:text-white'}">
            \${cat.name}
          </button>
        \`;
      }).join('');
      container.innerHTML = html;
    }

    function setPricingFilter(pricing) {
      activePricingFilter = pricing;
      renderDirectoryTools();
    }

    function handleGlobalSearch(query) {
      const dirSearch = document.getElementById('dirSearch');
      if (dirSearch) dirSearch.value = query;
      renderDirectoryTools();
    }

    function renderDirectoryTools() {
      const query = (document.getElementById('dirSearch') ? document.getElementById('dirSearch').value.toLowerCase() : '');
      const currentCat = CATEGORIES.find(c => c.slug === activeCategorySlug);

      const filtered = TOOLS.filter(t => {
        const matchesCategory = currentCat ? (t.categoryId === currentCat.id || t.categorySlug === currentCat.slug) : true;
        const matchesPricing = activePricingFilter === 'all' ? true : t.pricingModel.toLowerCase() === activePricingFilter.toLowerCase();
        const matchesSearch = t.name.toLowerCase().includes(query) || t.shortDescription.toLowerCase().includes(query);
        return matchesCategory && matchesPricing && matchesSearch;
      });

      document.getElementById('dir-count').innerText = \`\${filtered.length} \${filtered.length === 1 ? 'tool' : 'tools'} available\`;
      const grid = document.getElementById('directory-tools-grid');

      if (filtered.length > 0) {
        grid.innerHTML = filtered.map(createToolCardHTML).join('');
      } else {
        grid.innerHTML = \`
          <div class="col-span-full text-center py-16 glass-panel rounded-2xl border-dashed">
            <i data-lucide="search-x" class="w-10 h-10 text-zinc-500 mx-auto mb-3"></i>
            <h3 class="text-lg font-semibold text-white">No tools found</h3>
            <p class="text-xs text-zinc-400 mt-1">Try adjusting your category, pricing, or search term.</p>
          </div>
        \`;
      }
      lucide.createIcons();
    }
    
    function createToolCardHTML(tool) {
      const category = CATEGORIES.find(c => c.id === tool.categoryId || c.slug === tool.categorySlug);
      return \`
        <div onclick="window.location.href='../tools/\${tool.slug}/index.html'" class="cursor-pointer glass-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between group">
          <div>
            <div class="flex items-start justify-between gap-2 sm:gap-3 pb-2 sm:pb-3">
              <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <a href="../tools/\${tool.slug}/index.html" class="shrink-0">
                  <img src="../\${tool.logoUrl || tool.logo}" alt="\${tool.name}" loading="lazy" width="40" height="40"
                       class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-contain bg-zinc-900 border border-zinc-700/60 p-0.5 sm:p-1 shrink-0 group-hover:scale-105 transition-transform" 
                       onerror="this.src='../logo.jpg'" />
                </a>
                <div class="min-w-0">
                  <a href="../tools/\${tool.slug}/index.html" class="font-semibold text-sm sm:text-base text-white group-hover:text-indigo-400 transition-colors truncate block">\${tool.name}</a>
                  <span class="text-[11px] sm:text-xs text-zinc-400 block truncate">\${category ? category.name : ''}</span>
                </div>
              </div>
              <span class="text-[9px] sm:text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded font-medium shrink-0">\${tool.pricingModel}</span>
            </div>
            <p class="text-xs text-zinc-300 line-clamp-2 sm:line-clamp-3 leading-snug sm:leading-relaxed mt-0.5 sm:mt-1">\${tool.shortDescription}</p>
          </div>
          <div class="pt-2.5 sm:pt-4 mt-2 sm:mt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <div class="flex items-center gap-1 text-xs font-semibold text-amber-400">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
              <span>\${tool.rating}</span>
            </div>
            <div class="flex items-center gap-1.5 sm:gap-2">
              <a href="../tools/\${tool.slug}/index.html" class="bg-indigo-600/80 hover:bg-indigo-600 text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-colors">Try Now</a>
              <a href="../tools/\${tool.slug}/index.html" class="text-[11px] sm:text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5">Details &rsaquo;</a>
            </div>
          </div>
        </div>
      \`;
    }

    window.addEventListener('DOMContentLoaded', initApp);
  </script>
</body>
</html>\`;

ensureDir(path.join(__dirname, 'tools'));
fs.writeFileSync(path.join(__dirname, 'tools', 'index.html'), allToolsHTML, 'utf8');
console.log('Generated All Tools Page successfully.');
`;
    // Insert generation of allToolsHTML right before writing index.html
    jsCode = jsCode.replace("fs.writeFileSync(path.join(__dirname, 'index.html'), homeHTML, 'utf8');", allToolsGeneration + "\n\nfs.writeFileSync(path.join(__dirname, 'index.html'), homeHTML, 'utf8');");

    // Let's modify the JS script inside homeHTML string:
    // we want to strip the directory rendering functions, and just do `window.location.href='tools/index.html?search='` for search.
    const homepageScriptReplacement = `  <script>
    function initApp() {
      const urlParams = new URLSearchParams(window.location.search);
      const searchQ = urlParams.get('search');
      if (searchQ) {
        const gh = document.getElementById('globalHeaderSearch') || document.getElementById('globalSearch');
        if (gh) gh.value = searchQ;
      }
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    window.addEventListener('DOMContentLoaded', initApp);
  </script>`;
    
    // Find the <script> block at the end of homeHTML
    const jsScriptRegex = /<script>\s*const CATEGORIES[\s\S]*?<\/script>/;
    jsCode = jsCode.replace(jsScriptRegex, homepageScriptReplacement);
    
    // Also, remove `<div id="section-home" class="hidden md:block space-y-8">` wrapper and its closing </div>
    // Actually, just remove the `id="section-home" class="hidden md:block space-y-8"` and replace with `class="space-y-8"`
    jsCode = jsCode.replace(/<div id="section-home" class="hidden md:block space-y-8">/, '<div class="space-y-8">');

    // Also remove Explore All Tools button's showSection call in homeHTML, make it link to tools/index.html
    jsCode = jsCode.replace(/onclick="showSection\('directory'\)"/g, 'onclick="window.location.href=\'tools/index.html\'"');

    // We must fix `createToolCardHTML(t)` call inside homeHTML since we removed it from the script section!
    // Inside homeHTML, there's a map call to createToolCardHTML(t) for preview tools:
    // \${tools.slice(0, 6).map(t => createToolCardHTML(t)).join('')}
    // We should replace that with the literal HTML block inside the Node build script.
    
    const nodeToolCardFunc = `
function getToolCardPreviewHTML(tool) {
  const category = categories.find(c => c.id === tool.categoryId || c.slug === tool.categorySlug);
  return \`
    <div onclick="window.location.href='tools/\${tool.slug}/index.html'" class="cursor-pointer glass-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between group">
      <div>
        <div class="flex items-start justify-between gap-2 sm:gap-3 pb-2 sm:pb-3">
          <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <a href="tools/\${tool.slug}/index.html" class="shrink-0">
              <img src="\${tool.logoUrl || tool.logo}" alt="\${tool.name}" loading="lazy" width="40" height="40"
                   class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-contain bg-zinc-900 border border-zinc-700/60 p-0.5 sm:p-1 shrink-0 group-hover:scale-105 transition-transform" 
                   onerror="this.src='logo.jpg'" />
            </a>
            <div class="min-w-0">
              <a href="tools/\${tool.slug}/index.html" class="font-semibold text-sm sm:text-base text-white group-hover:text-indigo-400 transition-colors truncate block">\${tool.name}</a>
              <span class="text-[11px] sm:text-xs text-zinc-400 block truncate">\${category ? category.name : ''}</span>
            </div>
          </div>
          <span class="text-[9px] sm:text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded font-medium shrink-0">\${tool.pricingModel}</span>
        </div>
        <p class="text-xs text-zinc-300 line-clamp-2 sm:line-clamp-3 leading-snug sm:leading-relaxed mt-0.5 sm:mt-1">\${tool.shortDescription}</p>
      </div>
      <div class="pt-2.5 sm:pt-4 mt-2 sm:mt-3 border-t border-zinc-800/80 flex items-center justify-between">
        <div class="flex items-center gap-1 text-xs font-semibold text-amber-400">
          <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
          <span>\${tool.rating}</span>
        </div>
        <div class="flex items-center gap-1.5 sm:gap-2">
          <a href="tools/\${tool.slug}/index.html" class="bg-indigo-600/80 hover:bg-indigo-600 text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-colors">Try Now</a>
          <a href="tools/\${tool.slug}/index.html" class="text-[11px] sm:text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5">Details &rsaquo;</a>
        </div>
      </div>
    </div>
  \`;
}
`;
    // Insert nodeToolCardFunc right before `const homeHTML = \`<!DOCTYPE html>`
    jsCode = jsCode.replace('const homeHTML = `<!DOCTYPE html>', nodeToolCardFunc + '\nconst homeHTML = `<!DOCTYPE html>');
    // Replace the call inside the template
    jsCode = jsCode.replace(/\$\{tools\.slice\(0,\s*6\)\.map\(t => createToolCardHTML\(t\)\)\.join\(''\)\}/, '${tools.slice(0, 6).map(t => getToolCardPreviewHTML(t)).join(\'\')}');
    // For some reason build.js had it duplicated like: 
    // ${tools.slice(0, 6).map(t => `
    // ${tools.slice(0, 6).map(t => createToolCardHTML(t)).join('')}
    // We should clean that up
    jsCode = jsCode.replace(/\$\{tools\.slice\(0,\s*6\)\.map\(t\s*=>\s*`\s*\$\{tools\.slice\(0,\s*6\)\.map\(t\s*=>\s*createToolCardHTML\(t\)\)\.join\(''\)\}/, '${tools.slice(0, 6).map(t => getToolCardPreviewHTML(t)).join(\'\')}');

    fs.writeFileSync(jsFile, jsCode);
    console.log("Updated build.js successfully.");
}

// 2. Now let's do the exact same for build.ps1
const ps1File = path.join(__dirname, 'build.ps1');
let psCode = fs.readFileSync(ps1File, 'utf8');

const psDirSectionRegex = /<!-- DIRECTORY PAGE SECTION -->[\s\S]*?<!-- DIRECTORY PAGE SECTION END -->|<!-- DIRECTORY PAGE SECTION -->[\s\S]*?(?=<\/main>)/;
let psDirSectionMatch = psCode.match(psDirSectionRegex);
if (!psDirSectionMatch) {
    console.error("Could not find section-directory in build.ps1");
} else {
    // We will extract it. In powershell variables like $($tools.Count) need to be correctly interpolated or just literal text, but it's okay because we'll just write it manually like in node.
    let psDirHtml = psDirSectionMatch[0];
    psCode = psCode.replace(psDirHtml, '');

    // The script block for homepage in ps1:
    const psScriptRegex = /<script>[\s\S]*?const CATEGORIES = \$categoriesJson;[\s\S]*?<\/script>/;
    psCode = psCode.replace(psScriptRegex, homepageScriptReplacement);
    
    psCode = psCode.replace(/<div id="section-home" class="hidden md:block space-y-8">/, '<div class="space-y-8">');
    psCode = psCode.replace(/onclick="showSection\('directory'\)"/g, 'onclick="window.location.href=\'tools/index.html\'"');

    const psAllToolsGeneration = `
# -------------------------------------------------------------
# X. GENERATE ALL TOOLS PAGE (/tools/index.html)
# -------------------------------------------------------------
Write-Host "Generating All Tools Page..."

` + "$allToolsHTML = @\"" + `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/jpeg" href="../logo.jpg">
  <title>All AI Tools Directory | NANDAN AI</title>
  <meta name="description" content="Explore our full directory of AI tools and software.">
  <link rel="canonical" href="` + "$DOMAIN" + `/tools">

  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: { extend: { screens: { xs: '475px' }, colors: { brand: { 50: '#eef2ff', 500: '#6366f1', 600: '#4f46e5' } } } }
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
    <source src="../background.mp4" type="video/mp4" />
  </video>

  <div class="app-viewport flex flex-col">
    ` + "$(Get-HeaderHTML '../')" + `

    <div class="flex flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
      ` + "$(Get-SidebarHTML '../' $null)" + `

      <main class="flex-1 space-y-6 min-w-0">
        <nav class="flex items-center gap-2 text-xs text-zinc-400 glass-panel px-4 py-3 rounded-xl border border-zinc-800/80 mb-4">
          <a href="../index.html" class="hover:text-white flex items-center gap-1">
            <i data-lucide="home" class="w-3.5 h-3.5"></i> Home
          </a>
          <span>&rsaquo;</span>
          <span class="text-white font-medium">All Tools</span>
        </nav>
        
` + psDirHtml + `
      </main>
    </div>
  </div>

  ` + "$(Get-FooterHTML '../')" + `
  ` + "$(Get-SubmitModalHTML)" + `

  <script>
    const CATEGORIES = ` + "$categoriesJson;" + `
    const TOOLS = ` + "$toolsJson;" + `
    let activeCategorySlug = null;
    let activePricingFilter = 'all';

    function initApp() {
      document.getElementById('section-directory').classList.remove('hidden');
      renderCategoryPills();
      renderDirectoryTools();

      const urlParams = new URLSearchParams(window.location.search);
      const searchQ = urlParams.get('search');
      if (searchQ) {
        const gh = document.getElementById('globalHeaderSearch');
        if (gh) gh.value = searchQ;
        const dh = document.getElementById('dirSearch');
        if (dh) dh.value = searchQ;
        renderDirectoryTools();
      }
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    
    function filterByCategory(slug) {
      activeCategorySlug = slug;
      renderCategoryPills();
      renderDirectoryTools();
      const cat = CATEGORIES.find(c => c.slug === slug);
      const titleEl = document.getElementById('dir-title');
      if (titleEl) titleEl.innerText = cat ? cat.name : "All AI Tools";
    }

    function renderCategoryPills() {
      const container = document.getElementById('category-pills');
      if (!container) return;
      const allActive = !activeCategorySlug;
      let html = \`
        <button type="button" onclick="filterByCategory(null)" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 touch-manipulation \${allActive ? 'bg-indigo-600 text-white' : 'bg-zinc-800/80 text-zinc-400 hover:text-white'}">
          All Categories
        </button>
      \`;
      html += CATEGORIES.map(cat => {
        const isActive = activeCategorySlug === cat.slug;
        return \`
          <button type="button" onclick="filterByCategory('\${cat.slug}')" class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 touch-manipulation \${isActive ? 'bg-indigo-600 text-white' : 'bg-zinc-800/80 text-zinc-400 hover:text-white'}">
            \${cat.name}
          </button>
        \`;
      }).join('');
      container.innerHTML = html;
    }

    function setPricingFilter(pricing) {
      activePricingFilter = pricing;
      renderDirectoryTools();
    }

    function handleGlobalSearch(query) {
      const dirSearch = document.getElementById('dirSearch');
      if (dirSearch) dirSearch.value = query;
      renderDirectoryTools();
    }

    function renderDirectoryTools() {
      const query = (document.getElementById('dirSearch') ? document.getElementById('dirSearch').value.toLowerCase() : '');
      const currentCat = CATEGORIES.find(c => c.slug === activeCategorySlug);

      const filtered = TOOLS.filter(t => {
        const matchesCategory = currentCat ? (t.categoryId === currentCat.id || t.categorySlug === currentCat.slug) : true;
        const matchesPricing = activePricingFilter === 'all' ? true : t.pricingModel.toLowerCase() === activePricingFilter.toLowerCase();
        const matchesSearch = t.name.toLowerCase().includes(query) || t.shortDescription.toLowerCase().includes(query);
        return matchesCategory && matchesPricing && matchesSearch;
      });

      document.getElementById('dir-count').innerText = \`\${filtered.length} \${filtered.length === 1 ? 'tool' : 'tools'} available\`;
      const grid = document.getElementById('directory-tools-grid');

      if (filtered.length > 0) {
        grid.innerHTML = filtered.map(createToolCardHTML).join('');
      } else {
        grid.innerHTML = \`
          <div class="col-span-full text-center py-16 glass-panel rounded-2xl border-dashed">
            <i data-lucide="search-x" class="w-10 h-10 text-zinc-500 mx-auto mb-3"></i>
            <h3 class="text-lg font-semibold text-white">No tools found</h3>
            <p class="text-xs text-zinc-400 mt-1">Try adjusting your category, pricing, or search term.</p>
          </div>
        \`;
      }
      lucide.createIcons();
    }
    
    function createToolCardHTML(tool) {
      const category = CATEGORIES.find(c => c.id === tool.categoryId || c.slug === tool.categorySlug);
      return \`
        <div onclick="window.location.href='../tools/\${tool.slug}/index.html'" class="cursor-pointer glass-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between group">
          <div>
            <div class="flex items-start justify-between gap-2 sm:gap-3 pb-2 sm:pb-3">
              <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <a href="../tools/\${tool.slug}/index.html" class="shrink-0">
                  <img src="../\${tool.logoUrl || tool.logo}" alt="\${tool.name}" loading="lazy" width="40" height="40"
                       class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl object-contain bg-zinc-900 border border-zinc-700/60 p-0.5 sm:p-1 shrink-0 group-hover:scale-105 transition-transform" 
                       onerror="this.src='../logo.jpg'" />
                </a>
                <div class="min-w-0">
                  <a href="../tools/\${tool.slug}/index.html" class="font-semibold text-sm sm:text-base text-white group-hover:text-indigo-400 transition-colors truncate block">\${tool.name}</a>
                  <span class="text-[11px] sm:text-xs text-zinc-400 block truncate">\${category ? category.name : ''}</span>
                </div>
              </div>
              <span class="text-[9px] sm:text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded font-medium shrink-0">\${tool.pricingModel}</span>
            </div>
            <p class="text-xs text-zinc-300 line-clamp-2 sm:line-clamp-3 leading-snug sm:leading-relaxed mt-0.5 sm:mt-1">\${tool.shortDescription}</p>
          </div>
          <div class="pt-2.5 sm:pt-4 mt-2 sm:mt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <div class="flex items-center gap-1 text-xs font-semibold text-amber-400">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-current"></i>
              <span>\${tool.rating}</span>
            </div>
            <div class="flex items-center gap-1.5 sm:gap-2">
              <a href="../tools/\${tool.slug}/index.html" class="bg-indigo-600/80 hover:bg-indigo-600 text-white px-2.5 py-1 sm:px-3 sm:py-1 rounded-md text-[11px] sm:text-xs font-semibold transition-colors">Try Now</a>
              <a href="../tools/\${tool.slug}/index.html" class="text-[11px] sm:text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5">Details &rsaquo;</a>
            </div>
          </div>
        </div>
      \`;
    }

    window.addEventListener('DOMContentLoaded', initApp);
  </script>
</body>
</html>
"@

Ensure-Directory (Join-Path $rootDir "tools")
Set-Content -Path (Join-Path $rootDir "tools\index.html") -Value $allToolsHTML -Encoding UTF8
Write-Host "Generated tools\index.html successfully."
`;

    // Insert allToolsGeneration before Set-Content of index.html
    const psWriteIndexHtml = `Set-Content -Path (Join-Path $rootDir "index.html") -Value $homepageHtml -Encoding UTF8`;
    psCode = psCode.replace(psWriteIndexHtml, psAllToolsGeneration + "\n" + psWriteIndexHtml);

    fs.writeFileSync(ps1File, psCode);
    console.log("Updated build.ps1 successfully.");
}
