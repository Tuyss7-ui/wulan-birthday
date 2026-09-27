# Wulan Birthday — V5 Polish Pass

Struktur, teks, dan animasi utama tetap sama seperti sebelumnya (dark navy + pink neon, glassmorphism, glowing gift, heart particles, scrapbook photo, letter, final scene). Update ini hanya memperbaiki `css/style.css` — beberapa elemen dekoratif di HTML ternyata belum pernah punya CSS sama sekali, jadi selama ini tidak terlihat.

## Yang diperbaiki
- **Bug:** garis LDR (`.route`) — heart, dots, dan caption "4 bulan..." dulu numpuk di satu titik karena salah selector. Sekarang caption di atas garis, heart kecil berdenyut di tengah garis, garis punya efek cahaya berjalan.
- **Bug:** paragraf "LDR di antara kita" (`.ldr-lines`) tidak punya style sama sekali (nyambung ke class lama yang sudah tidak dipakai) — sekarang pakai typografi Playfair yang serasi, baris terakhir ditonjolkan.
- **Baru hidup** (sebelumnya div kosong tanpa CSS): bintang kerlip di hero & final scene, dua orb cahaya melayang di gift scene, pusaran warna lembut di love scene, glow + ring di date scene, glow hangat di sorry scene, kilatan cahaya saat kado dibuka.
- Avatar "G" dan "W" sekarang beda warna (dulu identik).
- Kutipan "Aku nggak tahu masa depan..." di promise scene dibuat lebih sempit lebar teksnya biar lebih enak dibaca.
- Status countdown ("menuju 13 Oktober...") sekarang ada gaya tulisan, dulu teks polos.

## Replace these files
- `index.html` (tidak berubah, tetap disertakan biar lengkap)
- `css/style.css` (yang berubah)
- `js/main.js` (tidak berubah, tetap disertakan biar lengkap)

## Keep these assets
- `assets/photos/ghibtah-wulan.jpg`
- `assets/music/betty.mp3`

No asset paths were changed.

## Deploy
Commit/push ke branch `main`, lalu buka GitHub Pages. Jika browser masih menampilkan versi lama, hard refresh atau buka Incognito.

> Music note: `betty.mp3` is expected to be your legally permitted copy of the song.
