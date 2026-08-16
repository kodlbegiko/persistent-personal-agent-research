const NAV_SELECTOR = '.sidebar nav a[href^="#"]';

function syncSidebarNavigation() {
  const current = window.location.hash || '#overview';
  const links = document.querySelectorAll(NAV_SELECTOR);
  if (!links.length) return false;

  links.forEach((link) => {
    const active = link.getAttribute('href') === current;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  return true;
}

function installNavigationSync() {
  syncSidebarNavigation();

  const observer = new MutationObserver(() => {
    if (syncSidebarNavigation()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('hashchange', syncSidebarNavigation, { passive: true });
  window.addEventListener('pageshow', syncSidebarNavigation, { passive: true });

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.(NAV_SELECTOR);
    if (!link) return;
    window.setTimeout(syncSidebarNavigation, 0);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', installNavigationSync, { once: true });
} else {
  installNavigationSync();
}
