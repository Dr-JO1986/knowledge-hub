// contact.js — ฟอร์มติดต่อ (POST ไป Google Apps Script / Web3Forms)
// ใช้ API_URL เดียวกับ jobs หรือแยก endpoint ก็ได้
const FORM_ENDPOINT = '';  // เช่น 'https://script.google.com/macros/s/xxx/exec'

export function initContact(){
  const form = document.getElementById('contactForm');
  if(!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const status = document.getElementById('status');
    const btn    = form.querySelector('button[type=submit]');

    if(!FORM_ENDPOINT){
      status.textContent = 'ยังไม่ได้ตั้งค่า FORM_ENDPOINT ใน js/contact.js';
      return;
    }

    status.textContent = 'กำลังส่ง...';
    btn.disabled = true;

    try{
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body: new URLSearchParams(new FormData(form))
      });

      // ถ้า endpoint ตอบ JSON {ok:true} — เช็คให้ชัด, ถ้าไม่ตอบก็ถือว่า ok ถ้า res.ok
      const data = await res.json().catch(() => ({ok: res.ok}));
      if(!data.ok) throw new Error(data.error || 'server error');

      status.textContent = 'ส่งเรียบร้อย ขอบคุณครับ';
      form.reset();
    }catch(err){
      console.error('[contact]', err);
      status.textContent = 'ส่งไม่สำเร็จ ลองใหม่อีกครั้ง';
    }finally{
      btn.disabled = false;
    }
  });
}