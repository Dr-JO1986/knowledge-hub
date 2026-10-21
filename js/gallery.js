// gallery.js — โหลดและแสดงแกลเลอรีจาก data/gallery.json
import { esc, safeUrl, openLightbox } from './ui.js';

const GALLERY_LIMIT  = 24;
const GALLERY_JSON   = 'data/gallery.json';
const FALLBACK_COUNT = 6;

export async function loadGallery(){
  const grid   = document.getElementById('galleryGrid');
  const status = document.getElementById('galleryStatus');

  try{
    const res = await fetch(GALLERY_JSON, {cache:'no-store'});
    if(!res.ok) throw new Error('gallery.json not found');
    const items = (await res.json()).slice(0, GALLERY_LIMIT);
    if(!items.length) throw new Error('empty');

    renderGallery(items);
    status.textContent = `แสดง ${items.length} รูป`;
  }catch(err){
    console.warn('[gallery]', err.message);
    renderFallback(grid);
    status.textContent = 'ยังไม่มีรูปจริง — นี่คือรูปตัวอย่าง';
  }
}

function renderGallery(items){
  const grid = document.getElementById('galleryGrid');
  if(!items.length){
    grid.innerHTML = '<div class="empty">ยังไม่มีรูปในแกลเลอรี</div>';
    return;
  }
  grid.innerHTML = items.map((it, i) => `
    <figure data-src="${safeUrl(it.url)}"
            tabindex="0" role="button"
            aria-label="เปิดรูป ${esc(it.title || i+1)}">
      <img src="${safeUrl(it.thumb || it.url)}"
           alt="${esc(it.title || 'รูปภาพ')}"
           width="600" height="450" loading="lazy">
      ${it.title ? `<figcaption>${esc(it.title)}</figcaption>` : ''}
    </figure>`).join('');

  grid.querySelectorAll('figure').forEach(f => {
    f.addEventListener('click', () => openLightbox(f.dataset.src));
    f.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openLightbox(f.dataset.src);
      }
    });
  });
}

function renderFallback(grid){
  grid.innerHTML = '';
  for(let i = 1; i <= FALLBACK_COUNT; i++){
    const f = document.createElement('figure');
    f.innerHTML = `
      <img src="https://picsum.photos/seed/hub${i}/600/450"
           alt="ตัวอย่างรูป ${i}" width="600" height="450" loading="lazy">
      <figcaption>ตัวอย่างรูป ${i}</figcaption>`;
    grid.appendChild(f);
  }
}