// TELC Topbar Component - Single source of truth for navigation
(function() {
  'use strict';

  // Configuration
  const SECTIONS = [
    { id: 'start', label: 'Start', path: '/index.html', hash: '#start' },
    { id: 'grammatik', label: 'Grammatik', path: '/grammatik/index.html' },
    { id: 'texte', label: 'Texte', path: '/texte/index.html' },
    { id: 'notizen', label: 'Notizen', path: '/notizen/index.html' },
    { id: 'woerter', label: 'Wörter', path: '/woerter/index.html' },
    { id: 'pruefungen', label: 'Prüfungen', path: '/pruefungen/index.html' }
  ];

  const CTA_CONFIG = {
    label: 'Einstufung',
    path: '/tips/einfuehrung/index.html'
  };

  // Determine current section from path
  function getCurrentSection(pathname) {
    for (const section of SECTIONS) {
      if (section.id === 'start') {
        const isIndex = /\/index\.html$/.test(pathname);
        const isRoot = pathname === '/' || pathname === '';
        const notInOtherSection = !SECTIONS.slice(1).some(s => pathname.includes(`/${s.id}/`));
        if ((isIndex || isRoot) && notInOtherSection) return section.id;
      } else {
        if (pathname.includes(`/${section.id}/`)) return section.id;
      }
    }
    return 'start';
  }

  // Get section name for brand
  function getSectionName(pathname) {
    const currentSection = getCurrentSection(pathname);
    const section = SECTIONS.find(s => s.id === currentSection);
    return section ? section.label : 'Deutschprogramm';
  }

  // Calculate relative path from current page to target
  function getRelativePath(currentPath, targetPath) {
    // Get the directory of the current file
    const currentParts = currentPath.split('/').filter(p => p);
    // Remove the filename (last part) to get directory depth
    const currentDepth = currentParts.length - 1;
    
    // Build relative path
    if (currentDepth === 0) {
      // We're at root level
      return '.' + targetPath;
    } else {
      // Go up the required number of levels
      return '../'.repeat(currentDepth) + targetPath.substring(1);
    }
  }

  // Create topbar HTML
  function createTopbar() {
    const currentPath = window.location.pathname;
    const currentSection = getCurrentSection(currentPath);
    const sectionName = getSectionName(currentPath);
    
    console.log('[TELC Topbar] Current path:', currentPath);
    console.log('[TELC Topbar] Current section:', currentSection);

    const navLinks = SECTIONS.map(section => {
      const href = section.id === currentSection && section.id !== 'start'
        ? 'index.html'
        : getRelativePath(currentPath, section.path) + (section.hash || '');
      console.log(`[TELC Topbar] ${section.label} -> ${href}`);
      return `<a href="${href}">${section.label}</a>`;
    }).join('\n      ');

    const ctaHref = getRelativePath(currentPath, CTA_CONFIG.path);

    return `
  <header class="topbar">
    <div class="brand">
      <span class="brand-mark">TELC</span>
      <span class="brand-name">${sectionName}</span>
    </div>
    <nav class="nav">
      ${navLinks}
    </nav>
    <a class="cta" href="${ctaHref}">${CTA_CONFIG.label}</a>
  </header>`;
  }

  // Initialize topbar on page load
  function initTopbar() {
    // Check if topbar already exists in HTML (static version)
    const existingTopbar = document.querySelector('.topbar');
    
    if (!existingTopbar) {
      // Insert topbar at the beginning of body (dynamic version)
      const topbarHTML = createTopbar();
      document.body.insertAdjacentHTML('afterbegin', topbarHTML);
    } else {
      console.log('[TELC Topbar] Using existing static topbar from HTML');
    }

    // Initialize topbar controls (minimize, reset)
    initTopbarControls();
  }

  // Initialize topbar controls
  function initTopbarControls() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    const body = document.body;

    // Restore hidden state
    if (sessionStorage.getItem('telc_topbar_hidden') === '1') {
      body.classList.add('topbar-hidden');
    }

    // Check if controls already exist in HTML (static version)
    let hideBtn = topbar.querySelector('.topbar-hide');
    let resetBtn = topbar.querySelector('.topbar-reset');
    let showTrigger = document.querySelector('.topbar-show-trigger');

    // If controls don't exist, create them (dynamic version)
    if (!hideBtn || !resetBtn) {
      console.log('[TELC Topbar] Creating dynamic controls');
      
      // Get or create CTA element
      const cta = topbar.querySelector('.cta');

      // Create or get actions container
      let actions = topbar.querySelector('.topbar-actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'topbar-actions';
        topbar.appendChild(actions);
      }

      // Create hide button if it doesn't exist
      if (!hideBtn) {
        hideBtn = document.createElement('button');
        hideBtn.type = 'button';
        hideBtn.className = 'topbar-btn topbar-hide';
        hideBtn.title = 'Barra minimizar';
        hideBtn.setAttribute('aria-label', 'Barra minimizar');
        hideBtn.textContent = '−';
        actions.appendChild(hideBtn);
      }

      // Create reset button if it doesn't exist
      if (!resetBtn) {
        resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'topbar-btn topbar-reset';
        resetBtn.title = 'Reiniciar (olvidar posiciones)';
        resetBtn.setAttribute('aria-label', 'Reiniciar');
        resetBtn.textContent = '↺';
        actions.appendChild(resetBtn);
      }

      // Move CTA into actions if it exists and isn't already there
      if (cta && !actions.contains(cta)) {
        actions.appendChild(cta);
      }
    } else {
      console.log('[TELC Topbar] Using existing static controls from HTML');
    }

    // Create show trigger if it doesn't exist
    if (!showTrigger) {
      showTrigger = document.createElement('div');
      showTrigger.className = 'topbar-show-trigger';
      showTrigger.title = 'Mostrar barra';
      showTrigger.textContent = '▼';
      topbar.parentNode.insertBefore(showTrigger, topbar);
    }

    // Event handlers (always attach, whether controls are static or dynamic)
    hideBtn.onclick = () => {
      body.classList.add('topbar-hidden');
      body.classList.remove('topbar-auto-hidden');
      sessionStorage.setItem('telc_topbar_hidden', '1');
    };

    showTrigger.onclick = () => {
      body.classList.remove('topbar-hidden');
      body.classList.remove('topbar-auto-hidden');
      sessionStorage.removeItem('telc_topbar_hidden');
    };

    resetBtn.onclick = () => {
      const keys = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.indexOf('telc_') === 0) keys.push(key);
      }
      keys.forEach(k => sessionStorage.removeItem(k));
      location.reload();
    };
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTopbar);
  } else {
    initTopbar();
  }
})();
