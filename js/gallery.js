// gallery.js — โหลดและแสดงแกลเลอรีจาก data/gallery.json
import { esc, safeUrl, openLightbox } from './ui.js';

const GALLERY_LIMIT  = 24;
const GALLERY_JSON   = 'data/gallery.json';
const FALLBACK_COUNT = 6;

export async function loadGallery(){
  const grid   = document.getElementById('galleryGrid');
  const status = document.getElementById('galleryStatus');
  const controls = document.getElementById('galleryControls');

  try{
    const res = await fetch(GALLERY_JSON, {cache:'no-store'});
    if(!res.ok) throw new Error('gallery.json not found');
    const items = (await res.json()).slice(0, GALLERY_LIMIT);
    if(!items.length) throw new Error('empty');

    renderGallery(items, grid, controls, status);
  }catch(err){
    console.warn('[gallery]', err.message);
    renderFallback(grid);
    status.textContent = 'ยังไม่มีรูปจริง — นี่คือรูปตัวอย่าง';
  }
}

function renderGallery(items, grid, controls, status){
  if(!items.length){
    grid.innerHTML = '<div class="empty">ยังไม่มีรูปในแกลเลอรี</div>';
    return;
  }

  const categorizedItems = items.map(it => ({
    ...it,
    category: it.category || it.title || 'อื่น ๆ'
  }));
  const albumMap = new Map();
  categorizedItems.forEach(item => {
    if(!albumMap.has(item.category)){
      albumMap.set(item.category, {name:item.category, items:[]});
    }
    albumMap.get(item.category).items.push(item);
  });
  const albums = [...albumMap.values()];

  function showAlbums(){
    controls.replaceChildren();
    grid.innerHTML = albums.map((album, index) => {
      const cover = album.items[0];
      return `
        <button class="gallery-album" type="button" data-album-index="${index}"
                aria-label="เปิดอัลบั้ม ${esc(album.name)} มี ${album.items.length} รูป">
          <img src="${safeUrl(cover.thumb || cover.url)}"
               alt="ปกอัลบั้ม ${esc(album.name)}"
               width="600" height="450" loading="lazy">
          <span class="gallery-album-info">
            <span class="gallery-album-name">${esc(album.name)}</span>
            <span class="gallery-album-count">${album.items.length} รูป</span>
          </span>
        </button>`;
    }).join('');

    grid.querySelectorAll('.gallery-album').forEach(button => {
      button.addEventListener('click', () => showAlbum(Number(button.dataset.albumIndex)));
    });
    status.textContent = `${albums.length} อัลบั้ม`;
  }

  function showAlbum(index){
    const album = albums[index];
    if(!album) return;

    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'gallery-back';
    backButton.textContent = '← กลับไปหน้าอัลบั้ม';
    backButton.addEventListener('click', () => {
      showAlbums();
      const albumButton = grid.querySelector(`[data-album-index="${index}"]`);
      if(albumButton) albumButton.focus();
    });
    controls.replaceChildren(backButton);

    grid.innerHTML = album.items.map((it, i) => `
      <figure data-src="${safeUrl(it.url)}"
              tabindex="0" role="button"
              aria-label="เปิดรูป ${esc(it.title || `${album.name} ${i+1}`)}">
        <img src="${safeUrl(it.thumb || it.url)}"
             alt="${esc(it.title || album.name)}"
             width="600" height="450" loading="lazy">
        ${it.title ? `<figcaption>${esc(it.title)}</figcaption>` : ''}
      </figure>`).join('');

    grid.querySelectorAll('figure').forEach(figure => {
      figure.addEventListener('click', () => openLightbox(figure.dataset.src));
      figure.addEventListener('keydown', event => {
        if(event.key === 'Enter' || event.key === ' '){
          event.preventDefault();
          openLightbox(figure.dataset.src);
        }
      });
    });
    status.textContent = `${album.name} — ${album.items.length} รูป`;
    backButton.focus();
  }

  showAlbums();
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