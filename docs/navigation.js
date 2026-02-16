// TELC Navigation System - Smart navigation with scroll preservation
(function() {
  'use strict';

  const SECTIONS = ['grammatik', 'texte', 'notizen', 'woerter', 'pruefungen', 'tips'];

  // Get section type from path
  function getSectionType(path) {
    for (const section of SECTIONS) {
      if (new RegExp(`\\/${section}\\/`).test(path)) return section;
    }
    return 'start';
  }

  // Check if path is section index
  function isSectionIndex(path, type) {
    if (type === 'start') {
      const isIndex = /\/index\.html$/.test(path);
      const notInSection = !SECTIONS.some(s => new RegExp(`\\/${s}\\/`).test(path));
      return isIndex && notInSection;
    }
    const pattern = new RegExp(`\\/${type}\\/index\\.html$|\\/${type}\\/?$`);
    return pattern.test(path);
  }

  // Scroll preservation
  const currentPath = location.pathname;
  const scrollKey = `telc_scroll_${currentPath}`;

  function saveScroll() {
    try {
      const scrollData = { x: scrollX, y: scrollY };
      sessionStorage.setItem(scrollKey, JSON.stringify(scrollData));
      
      const sectionType = getSectionType(currentPath);
      const fullPath = currentPath + (location.hash || '');
      sessionStorage.setItem(`telc_last_${sectionType}`, fullPath);
    } catch (e) {
      // Ignore storage errors
    }
  }

  function restoreScroll() {
    try {
      const saved = sessionStorage.getItem(scrollKey);
      if (saved) {
        const { x, y } = JSON.parse(saved);
        scrollTo(x, y);
      }
    } catch (e) {
      // Ignore storage errors
    }
  }

  function scheduleRestore() {
    requestAnimationFrame(() => {
      setTimeout(restoreScroll, 50);
      setTimeout(restoreScroll, 300);
    });
  }

  // Smart navigation handler
  function handleNavigation(event) {
    const link = event.target.closest('a');
    if (!link || !link.href) return;

    try {
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;

      saveScroll();

      const targetPath = url.pathname;
      const targetType = getSectionType(targetPath);
      const currentType = getSectionType(currentPath);

      // Check if target is a section index
      if (!isSectionIndex(targetPath, targetType)) return;

      // Same section navigation
      if (currentType === targetType) {
        event.preventDefault();
        if (isSectionIndex(currentPath, currentType)) {
          // Already on section index, just scroll to top
          scrollTo(0, 0);
        } else {
          // Navigate to section index and reset scroll
          sessionStorage.setItem(`telc_scroll_${targetPath}`, JSON.stringify({ x: 0, y: 0 }));
          location.href = location.origin + targetPath + (url.hash || '');
        }
        return;
      }

      // Cross-section navigation - check for last visited page
      const lastVisited = sessionStorage.getItem(`telc_last_${targetType}`);
      if (!lastVisited || lastVisited === (targetPath + (url.hash || ''))) {
        return; // Allow normal navigation
      }

      // Navigate to last visited page in target section
      event.preventDefault();
      location.href = location.origin + lastVisited;
    } catch (e) {
      // Allow normal navigation on error
    }
  }

  // Set up event listeners
  window.addEventListener('pagehide', saveScroll);
  window.addEventListener('beforeunload', saveScroll);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveScroll();
  });
  document.addEventListener('click', handleNavigation, true);

  // Restore scroll on page load
  if (document.readyState === 'complete') {
    scheduleRestore();
  } else {
    window.addEventListener('load', scheduleRestore);
  }
  window.addEventListener('pageshow', scheduleRestore);

  // Prevent browser's default scroll restoration
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
})();
