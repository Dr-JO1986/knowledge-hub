// main.js — entry point รวมทุกโมดูล
import { initUI }      from './ui.js';
import { loadGallery } from './gallery.js';
import { loadJobs }    from './jobs.js';
import { initContact } from './contact.js';

document.getElementById('yr').textContent = new Date().getFullYear();

initUI();        // scroll spy, ปุ่ม to-top, lightbox
loadGallery();   // แกลเลอรี
loadJobs();      // ประกาศงาน
initContact();   // ฟอร์มติดต่อ