import './style.css'
import 'lenis/dist/lenis.css'
import Lenis from 'lenis'

const lenis = new Lenis({
  autoRaf: false,
  smoothWheel: true,
  smoothTouch: true,
  syncTouch: true,
  duration: 1.35,
  lerp: 0.06,
  wheelMultiplier: 0.9,
  anchors: true,
  easing: (t) => 1 - Math.pow(1 - t, 4),
});

const raf = (time) => {
  lenis.raf(time);
  requestAnimationFrame(raf);
};

requestAnimationFrame(raf);

const navBox = document.querySelector('.nav-box');
const menuButton = document.querySelector('.menu-btn');
const mobileNav = document.querySelector('#mobile-nav');
const navLinks = document.querySelectorAll('#mobile-nav .nav-items');
const pageAnchors = document.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll('section:not(#footer)');
const navSections = document.querySelectorAll('section');
const mobileBreakpoint = window.matchMedia('(max-width: 768px)');
const parallaxBreakpoint = window.matchMedia('(min-width: 901px)');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const getTargetIdFromHref = (href) => {
  if (!href || href === '#') return 'hero';
  return href.replace('#', '');
};

const closeMobileNav = () => {
  navBox?.classList.remove('nav-open');
  menuButton?.setAttribute('aria-expanded', 'false');
};

const toggleMobileNav = () => {
  if (!navBox || !menuButton || !mobileBreakpoint.matches) return;

  const isOpen = navBox.classList.toggle('nav-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
};

menuButton?.addEventListener('click', toggleMobileNav);

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    closeMobileNav();
  });
});

document.addEventListener('click', (event) => {
  if (!mobileBreakpoint.matches || !navBox?.classList.contains('nav-open')) return;
  if (navBox.contains(event.target)) return;

  closeMobileNav();
});

window.addEventListener('resize', () => {
  if (!mobileBreakpoint.matches) {
    closeMobileNav();
  }
});

mobileNav?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMobileNav();
  }
});

const getHeaderOffset = () => {
  const navHeight = navBox?.offsetHeight ?? 0;
  return -(navHeight + 12);
};

const setActiveNavLink = (activeId) => {
  navLinks.forEach((link) => {
    const targetId = getTargetIdFromHref(link.getAttribute('href'));
    link.classList.toggle('active', targetId === activeId);
  });
};

pageAnchors.forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    const targetId = getTargetIdFromHref(href);

    const target = document.querySelector(`#${targetId}`);
    if (!target) return;

    event.preventDefault();
    closeMobileNav();
    setActiveNavLink(targetId);

    lenis.scrollTo(target, {
      offset: getHeaderOffset(),
      duration: 1.35,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
  });
});

const resetParallax = () => {
  sections.forEach((section) => {
    section.style.setProperty('--section-parallax', '0px');
    section.style.setProperty('--section-bg-parallax', '0px');
  });
};

const updateSectionParallax = () => {
  if (!parallaxBreakpoint.matches || prefersReducedMotion.matches) {
    resetParallax();
    return;
  }

  const viewportCenter = window.innerHeight / 2;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + (rect.height / 2);
    const progress = (sectionCenter - viewportCenter) / window.innerHeight;
    const clampedProgress = Math.max(-1, Math.min(1, progress));

    section.style.setProperty('--section-parallax', `${clampedProgress * -28}px`);
    section.style.setProperty('--section-bg-parallax', `${clampedProgress * 42}px`);
  });
};

const updateActiveSection = () => {
  const currentScroll = window.scrollY + (navBox?.offsetHeight ?? 0) + 80;
  let activeSectionId = 'hero';

  navSections.forEach((section) => {
    if (section.offsetTop <= currentScroll) {
      activeSectionId = section.id;
    }
  });

  setActiveNavLink(activeSectionId);
};

lenis.on('scroll', () => {
  updateSectionParallax();
  updateActiveSection();
});
window.addEventListener('resize', () => {
  updateSectionParallax();
  updateActiveSection();
});

updateSectionParallax();
updateActiveSection();
