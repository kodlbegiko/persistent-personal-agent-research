const NAV_SELECTOR = '.sidebar nav a[href^="#"]';
const SCROLL_OFFSET = 118;

function getLinks() {
  return [...document.querySelectorAll(NAV_SELECTOR)];
}

function setActiveLink(href) {
  const links = getLinks();
  if (!links.length) return false;

  links.forEach((link) => {
    const active = link.getAttribute('href') === href;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  return true;
}

function resolveActiveSection() {
  const links = getLinks();
  if (!links.length) return '#overview';

  const probe = window.scrollY + SCROLL_OFFSET;
  let active = '#overview';

  for (const link of links) {
    const href = link.getAttribute('href');
    const id = href?.slice(1);
    if (!id) continue;
    const section = document.getElementById(id);
    if (!section) continue;
    if (section.offsetTop <= probe) active = href;
  }

  return active;
}

function syncSidebarToScroll() {
  return setActiveLink(resolveActiveSection());
}

function installNavigationSync() {
  const initialHash = window.location.hash;
  if (initialHash) setActiveLink(initialHash);
  else syncSidebarToScroll();

  const observer = new MutationObserver(() => {
    if (getLinks().length) {
      if (window.location.hash) setActiveLink(window.location.hash);
      else syncSidebarToScroll();
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      syncSidebarToScroll();
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener('resize', syncSidebarToScroll, { passive: true });
  window.addEventListener('pageshow', syncSidebarToScroll, { passive: true });
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash) setActiveLink(hash);
    window.setTimeout(syncSidebarToScroll, 360);
  }, { passive: true });

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.(NAV_SELECTOR);
    if (!link) return;
    setActiveLink(link.getAttribute('href'));
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', installNavigationSync, { once: true });
} else {
  installNavigationSync();
}
