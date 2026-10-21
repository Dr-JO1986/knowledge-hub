# Knowledge Development Hub

เว็บไซต์ส่วนตัว รวมผลงาน บทความ บทเรียน แกลเลอรี และประกาศงาน

## โครงสร้าง
- `index.html` — หน้าเดียว
- `css/style.css` — สไตล์ทั้งหมด
- `js/` — JavaScript แยกโมดูล (ES modules)
  - `main.js` — entry point
  - `ui.js` — helper + lightbox + scroll spy + to-top
  - `gallery.js` — แกลเลอรีจาก `data/gallery.json`
  - `jobs.js` — ประกาศงาน
  - `contact.js` — ฟอร์มติดต่อ
- `data/gallery.json` — รายการรูป (id, url, thumb, title)

## การตั้งค่า
1. **แกลเลอรี**: อัปโหลดรูปเข้า ImgBB → คัดลอก Direct link → ใส่ใน `data/gallery.json`
2. **ประกาศงาน**: ใส่ URL Apps Script ใน `js/jobs.js` → `API_URL`
3. **ฟอร์มติดต่อ**: ใส่ URL endpoint ใน `js/contact.js` → `FORM_ENDPOINT`
   - ทางเลือกที่ง่าย: ใช้ [Web3Forms](https://web3forms.com/) หรือ [Formspree](https://formspree.io/)
4. **SEO**: อัปเดต `canonical`, `og:image`, JSON-LD ใน `index.html` ให้เป็น URL จริง

## Deploy บน GitHub Pages
1. push ไฟล์ทั้งหมดขึ้น repo
2. Settings → Pages → Source: `main` branch, `/ (root)`
3. เข้าใช้งานที่ `https://<username>.github.io/<repo>/`

## หมายเหตุ
- ใช้ `type="module"` → ต้องเปิดผ่าน http(s) ไม่ใช่ `file://`
- `fetch('data/gallery.json')` จะทำงานได้บน GitHub Pages (same-origin)