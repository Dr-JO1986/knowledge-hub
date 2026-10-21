// ui.js — ฟังก์ชันช่วยเหลือ + UI ทั่วไป

/* ---------- helpers ---------- */
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));

export const safeUrl = u => /^https?:\/\//i.test(u) ? u : '#';

/* ---------- lightbox ---------- */
const lb    = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
const lbBtn = lb.querySelector('button');

export function openLightbox(src){
  if(!src || src === '#') return;
  lbImg.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  lbBtn.focus();
}
export function closeLightbox(){
  lb.classList.remove('open');
  lbImg.src = '';
  document.body.style.overflow = '';
}
lbBtn.addEventListener('click', closeLightbox);
lb.addEventListener('click', e => { if(e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
});

/* ---------- initUI ---------- */
export function initUI(){
  /* ปุ่มกลับขึ้นด้านบน */
  const toTop = document.getElementById('toTop');
  addEventListener('scroll', () =>
    toTop.classList.toggle('show', scrollY > 600), {passive:true});
  toTop.addEventListener('click', () =>
    scrollTo({top:0, behavior:'smooth'}));

  /* scroll spy */
  const links = [...document.querySelectorAll('nav a[href^="#"], .toc a[href^="#"]')];
  const secs  = links
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(en.isIntersecting){
        links.forEach(a =>
          a.classList.toggle('active',
            a.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px'});
  secs.forEach(s => io.observe(s));

  /* fallback: section สุดท้าย */
  addEventListener('scroll', () => {
    if (innerHeight + scrollY >= document.body.scrollHeight - 4) {
      const last = secs[secs.length - 1];
      if (last) {
        links.forEach(a =>
          a.classList.toggle('active',
            a.getAttribute('href') === '#' + last.id));
      }
    }
  }, {passive:true});
}