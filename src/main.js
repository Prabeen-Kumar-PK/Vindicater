import './style.css'
import 'lenis/dist/lenis.css'
import Lenis from 'lenis'

// Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
});

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
  console.log(e);
});



const navBox = document.querySelector('.nav-box');
const menuButton = document.querySelector('.menu-btn');
const mobileNav = document.querySelector('#mobile-nav');
const navLinks = document.querySelectorAll('#mobile-nav .nav-items');
const mobileBreakpoint = window.matchMedia('(max-width: 768px)');

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
