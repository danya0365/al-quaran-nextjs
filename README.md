# Al-Quran (Next.js)

แอปอ่านอัลกุรอานบนเว็บ สร้างด้วย Next.js (App Router) + TypeScript โฟกัสประสิทธิภาพ, SEO ผ่าน Server Components และ UI ที่สวยงามอ่านสบาย

## คุณสมบัติหลัก

- **รายการซูเราะห์ครบ 114 บท** แสดงชื่ออังกฤษ/อาหรับ ประเภทการประทาน และจำนวนอายะห์
- **อ่านซูเราะห์** ตัวอักษรอาหรับสวยงาม ปรับฟอนต์/ขนาดตัวอักษรได้ แสดงคำแปล และตัวช่วยทัจญ์วีด
- **เสียงอ่าน** เล่นเสียงรายอายะห์ (ตาม Qari/Reciter ที่เลือก)
- **บุ๊กมาร์ก** เซฟอายะห์ที่ชอบไว้กลับมาอ่านต่อได้
- **หน้า Landing** ดีไซน์สมัยใหม่ พร้อมแนะนำฟีเจอร์

## เส้นทาง (Routes)

- **`/`**: Landing Page (`app/(landing)/page.tsx`)
- **`/home`**: รายการซูเราะห์ (`app/(main)/home/page.tsx` + `HomeView`)
- **`/surah/[number]`**: หน้าซูเราะห์แต่ละบท (`SurahView`)
- **`/settings`**: ตั้งค่าการแสดงผล
- **`/bookmarks`**: รายการบุ๊กมาร์ก

หมายเหตุ: ตอนนี้ไม่มีเส้นทาง `/dashboard` ถ้าต้องการ alias ให้ชี้ไป `/home` สามารถเพิ่มหน้า redirect ได้ภายหลัง

## สแตกเทคโนโลยี

- **Frontend**: Next.js 15 (App Router), TypeScript, React 19
- **State**: Zustand (`/store/quranStore.ts`)
- **HTTP**: axios (`/api/api.ts`)
- **สไตล์**: Tailwind CSS 4 (ดูไฟล์ใน `public/styles` และการตั้งค่าในโปรเจกต์)
- **ฟอนต์อาหรับ**: `next/font/google` (Amiri, Lateef, Scheherazade New, Tajawal, Reem Kufi, Markazi Text)

## โครงสร้างที่เกี่ยวข้อง

- `app/(landing)/page.tsx` – หน้า Landing
- `app/(main)/home/page.tsx` – หน้า Home (Server Component) เรียก `HomePresenter` เพื่อเตรียมข้อมูล
- `src/presentation/components/home/HomeView.tsx` – UI รายการซูเราะห์และค้นหา
- `src/presentation/presenters/home/HomePresenter.ts` – ดึงข้อมูล surahs/translations/reciters
- `src/presentation/components/surah/SurahView.tsx` – UI อ่านซูเราะห์ เล่นเสียง/บุ๊กมาร์ก/ตั้งค่า
- `api/api.ts` – ฟังก์ชันเรียก API alquran.cloud
- `store/quranStore.ts` – Zustand store สำหรับสถานะการอ่าน/ตั้งค่า

## แหล่งข้อมูล (API)

โปรเจกต์นี้เรียกข้อมูลจาก `https://api.alquran.cloud/v1` ผ่านไฟล์ `api/api.ts` เช่น

- `getAllSurahsFromApi('ar.alafasy')`
- `getAvailableTranslations()`
- `getAvailableReciters()`
- `getArabicSurahFromApi(surahNumber)` / `getTranslationForSurahFromApi(surahNumber)` / `getAudioForSurahFromApi(surahNumber)`

คำเตือน: อาจเจอการจำกัดอัตราเรียก (429) ระหว่างพัฒนา หากเกิดขึ้นให้ลองรีเฟรชช้าลง หรือพิจารณาแคช/ฟอลแบ็กข้อมูลภายในภายหลัง

## เริ่มต้นใช้งาน

ต้องมี Node.js เวอร์ชันล่าสุดที่รองรับ Next.js 15

ติดตั้งแพ็กเกจและรันเซิร์ฟเวอร์พัฒนา:

```bash
yarn
yarn dev

# สคริปต์อื่น ๆ
yarn build
yarn start
yarn lint
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000` แล้วเริ่มจากหน้า `/` หรือไปที่ `/home` เพื่ออ่านอัลกุรอาน

## โน้ตการพัฒนา

- หน้า Home ถูกตั้งค่า `dynamic = 'force-dynamic'` และ `fetchCache = 'force-no-store'` เพื่อให้ดึงข้อมูลใหม่ทุกครั้งระหว่างพัฒนา
- ตัวเลขสถิติใน `HomeView` (เช่น 114/6,236/30) อาจเป็นค่าคงที่เพื่อการแสดงผล ถ้าต้องการให้คำนวณจากข้อมูลจริงสามารถปรับปรุงได้
- ถ้าต้องการเพิ่มเส้นทาง `/dashboard` แนะนำให้ redirect ไป `/home` หรือเรนเดอร์ `HomeView` โดยตรง

## ใบอนุญาต

โปรเจกต์นี้สร้างเพื่อการศึกษา/ใช้งานส่วนตัว คุณสามารถนำแนวคิดไปต่อยอดได้ตามต้องการ
