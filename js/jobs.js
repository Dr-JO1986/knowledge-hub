// jobs.js — โหลดประกาศงานจาก API (ถ้ามี) หรือแสดงตัวอย่าง
import { esc, safeUrl } from './ui.js';

// ใส่ URL ของ Google Apps Script (Web App) ตรงนี้
const API_URL = '';

const SAMPLE = [
  {title:'ตัวอย่าง: นักพัฒนาซอฟต์แวร์', org:'หน่วยงานตัวอย่าง', type:'เอกชน', link:'#', deadline:'ตัวอย่างเท่านั้น'}
];

export async function loadJobs(){
  const el = document.getElementById('jobList');
  try{
    if(!API_URL) throw new Error('no api');
    const res = await fetch(API_URL, {cache:'no-store'});
    if(!res.ok) throw new Error('bad response');
    const jobs = await res.json();
    renderJobs(jobs);
  }catch{
    renderJobs(SAMPLE);
  }
}

function renderJobs(jobs){
  const el = document.getElementById('jobList');
  if(!jobs.length){
    el.innerHTML = '<li class="note">ตอนนี้ยังไม่มีประกาศที่เปิดรับ</li>';
    return;
  }
  el.innerHTML = jobs.map(j => `
    <li class="job">
      <div><b>${esc(j.title)}</b><span>${esc(j.org)} &middot; ${esc(j.type)}</span></div>
      <div>
        <span>ปิดรับ: ${esc(j.deadline)}</span>
        <a href="${esc(safeUrl(j.link))}" target="_blank" rel="noopener noreferrer">ดูรายละเอียดและสมัคร</a>
      </div>
    </li>`).join('');
}