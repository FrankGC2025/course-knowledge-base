(function () {
  const STORAGE_KEY = 'course-kb-sidebar-collapsed';
  const MOBILE_BREAKPOINT = 900;

  const layout = document.querySelector('.layout');
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const backdrop = document.querySelector('.sidebar-backdrop');

  if (!layout || !sidebar || !toggle) return;

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function updateToggleIcon(expanded) {
    toggle.setAttribute('aria-expanded', String(expanded));
  }

  function closeMobileDrawer() {
    sidebar.classList.remove('mobile-open');
    document.body.classList.remove('mobile-drawer-open');
    backdrop?.classList.remove('active');
    document.body.style.overflow = '';
    updateToggleIcon(false);
  }

  function openMobileDrawer() {
    sidebar.classList.add('mobile-open');
    document.body.classList.add('mobile-drawer-open');
    backdrop?.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateToggleIcon(true);
    // Move focus to the first focusable element in the sidebar
    const firstLink = sidebar.querySelector('a, button');
    if (firstLink) firstLink.focus();
  }

  function collapseDesktop() {
    layout.classList.add('sidebar-collapsed');
    updateToggleIcon(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {}
  }

  function expandDesktop() {
    layout.classList.remove('sidebar-collapsed');
    updateToggleIcon(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function handleToggle() {
    if (isMobile()) {
      if (sidebar.classList.contains('mobile-open')) {
        closeMobileDrawer();
        toggle.focus();
      } else {
        openMobileDrawer();
      }
      return;
    }

    if (layout.classList.contains('sidebar-collapsed')) {
      expandDesktop();
    } else {
      collapseDesktop();
    }
  }

  function restoreDesktopState() {
    if (isMobile()) return;
    let collapsed = false;
    try {
      collapsed = localStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {}
    if (collapsed) {
      layout.classList.add('sidebar-collapsed');
      updateToggleIcon(false);
    } else {
      layout.classList.remove('sidebar-collapsed');
      updateToggleIcon(true);
    }
  }

  function handleResize() {
    if (isMobile()) {
      // Switching to mobile: clear desktop collapse state and ensure drawer is closed
      layout.classList.remove('sidebar-collapsed');
      closeMobileDrawer();
    } else {
      // Switching to desktop: close mobile drawer and restore desktop state
      closeMobileDrawer();
      restoreDesktopState();
    }
  }

  toggle.addEventListener('click', handleToggle);

  backdrop?.addEventListener('click', () => {
    closeMobileDrawer();
    toggle.focus();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
      closeMobileDrawer();
      toggle.focus();
    }
  });

  window.addEventListener('resize', handleResize);

  // Initialize
  if (isMobile()) {
    updateToggleIcon(false);
  } else {
    restoreDesktopState();
  }
})();
