# Playbook Tim — SOC Incident Management System

Panduan membaca kode, menjalankan aplikasi, dan mempresentasikan proyek React.

**Versi dokumentasi: 21 September 2026.** Disusun berdasarkan kode proyek pada saat paket ekspor dibuat. Ruang lingkupnya frontend desktop, akun mock, dan penyimpanan data di state React.

## 1. Mulai dari sini

Aplikasi ini menyimulasikan pekerjaan SOC Analyst: mengambil insiden, menulis catatan investigasi, menyerahkan kasus ke analis L2, menentukan klasifikasi, dan menyelesaikan insiden.

Urutan belajar yang disarankan:

1. Jalankan aplikasi dan coba demo pada bagian 4.
2. Baca peta file pada bagian 5.
3. Pahami pembagian state dan props pada bagian 6–7.
4. Ikuti penjelasan handler pada bagian 9.
5. Latihan presentasi dan pengujian pada bagian 13–14.

Yang sudah tersedia: login/logout mock, pembatasan tampilan menurut sesi, daftar insiden, pencarian ID, pengambilan insiden, catatan, eskalasi L1 ke L2, klasifikasi saat resolve, routing, serta pesan URL/ID tidak ditemukan.

Yang belum tersedia: server Express, database, autentikasi server, sinkronisasi antarperangkat, pendaftaran akun, dan penyimpanan permanen setelah refresh.

## 2. Cara menjalankan di laptop teman

Ekstrak ZIP terlebih dahulu, lalu buka folder proyek `sem3-app` di VS Code. Terminal harus berada di folder yang memiliki `package.json`.

Periksa Node.js dan npm:

```powershell
node --version
npm --version
```

Lingkungan pembuat paket menggunakan Node.js `v24.13.0` dan npm `11.6.2`. Ini catatan lingkungan proyek, bukan kewajiban bahwa hanya versi tersebut yang dapat dipakai.

Untuk pemasangan pertama, gunakan lockfile yang disertakan:

```powershell
npm ci
npm start
```

`npm ci` memasang dependensi sesuai `package-lock.json`; proses ini memerlukan akses registry npm bila paket belum ada di cache. Folder `node_modules` tidak dikirim karena dapat dibuat kembali melalui instalasi.

Buka alamat yang ditampilkan terminal, biasanya `http://localhost:3000`. Pengguna yang belum login akan diarahkan ke `/login`.

Perintah tambahan:

| Perintah | Kegunaan |
|---|---|
| `npm start` | Menjalankan server pengembangan |
| `npm run build` | Membuat hasil produksi di folder `build` |
| `npm test -- --watchAll=false --runInBand` | Menjalankan tes yang terdaftar di proyek; lihat catatan tes template pada bagian 15 |
| `Ctrl+C` di terminal | Menghentikan server pengembangan |

Proyek memakai **Create React App / react-scripts**, jadi gunakan `npm start`, bukan mengasumsikan ada perintah `npm run dev`.

## 3. Akun demo dan hubungan datanya

Semua akun berikut adalah data dummy yang memang tersedia di `src/mockUsers.js`.

| Username | Password demo | Analis | Role |
|---|---|---|---|
| `jeffthekiller` | `jeffthekiller` | Jeffri Andrean | `SOC_L1` |
| `renaldigopal` | `renaldigopal` | Renaldi Gopal | `SOC_L1` |
| `edwardchandra` | `edwardchandra` | Edward Chandra | `SOC_L1` |
| `rinaldycamachou` | `rinaldycamachou` | Rinaldy Camachou | `SOC_L2` |

Hubungan tiga data penting:

```text
mockUsers.analystId → mockAnalyst.id → incident.assignedTo
```

`mockUsers` berisi kredensial demo dan identitas penghubung. `mockAnalyst` berisi nama serta role. `assignedTo` menyimpan ID analis pemilik insiden. Nama field harus konsisten: akun memakai `analystId`, profil analis memakai `id`.

Login membandingkan username yang sudah di-trim dengan username mock. Password dibandingkan persis dengan `===`; huruf besar/kecil dan spasi password berpengaruh. Setelah cocok, hanya `analystId` dan `username` dikirim ke state sesi, bukan password.

Ini simulasi login di frontend. Saat memakai backend, pemeriksaan kredensial dan izin harus dilakukan server.

## 4. Skenario demo utama: L1 ke L2

| Langkah | Tindakan | Yang dijelaskan kepada penonton |
|---|---|---|
| 1 | Login sebagai `jeffthekiller` | Akun dipetakan ke analis L1 |
| 2 | Cari `001`, lalu klik Take Incident | Status berubah dari OPEN menjadi IN_PROGRESS, pemilik menjadi L1 |
| 3 | Tutup popup, klik Investigate | URL detail memuat ID insiden yang sedang diperiksa |
| 4 | Tambahkan catatan, misalnya “Percobaan SSH berulang ditemukan; perlu pemeriksaan L2.” | Catatan ditambahkan ke array notes |
| 5 | Klik Back to Incident List, lalu Escalate pada insiden tersebut | Status ESCALATED dan pemilik berpindah ke analis L2 |
| 6 | Logout, lalu login sebagai `rinaldycamachou` | Data insiden tetap ada karena state disimpan di App |
| 7 | Investigate insiden yang sama; periksa catatan L1, tambahkan catatan L2 | Riwayat catatan sebelumnya tetap tersimpan |
| 8 | Pilih True Positive atau False Positive, lalu Resolve | Status menjadi RESOLVED dan klasifikasi disimpan |
| 9 | Periksa daftar, lalu logout | Insiden selesai tidak dapat diambil atau dieskalasi lagi |

**Jangan refresh di tengah skenario ini.** Pergantian akun melalui Logout mempertahankan data di App. Refresh memulai instance aplikasi baru sehingga sesi dan data kembali ke awal.

Alternatif demo: L1 mengambil insiden lain lalu resolve langsung dengan klasifikasi. Kode mengizinkan L1 menyelesaikan insiden IN_PROGRESS miliknya tanpa eskalasi.

Dalam versi ini, Escalate tidak mensyaratkan catatan sudah ada. Tambahkan catatan dalam demo untuk menunjukkan alur kerja yang mudah dipahami, bukan karena tombol memaksakannya.

## 5. Peta file proyek

```text
sem3-app/
├── package.json / package-lock.json
├── public/
│   └── index.html dan aset bawaan
└── src/
    ├── index.js
    ├── App.jsx
    ├── Login.jsx / Login.css
    ├── Dashboard.jsx / App.css
    ├── IncidentList.jsx
    ├── InvestigationPanel.jsx
    ├── Incident.js
    ├── mockUsers.js
    ├── mockAnalyst.js
    └── berkas pendukung dan tes template
```

| File | Tanggung jawab |
|---|---|
| `src/index.js` | Memasang React ke elemen root, membungkus App dengan StrictMode dan satu BrowserRouter |
| `src/App.jsx` | Memiliki state sesi dan insiden; mengatur rute login serta Dashboard |
| `src/Login.jsx` | Form username/password, pemeriksaan akun mock, pesan error, callback onLogin |
| `src/Dashboard.jsx` | Handler bisnis, analis aktif, pencarian, popup, routing daftar/detail, RouteError |
| `src/IncidentList.jsx` | Daftar dan tombol Take Incident, Investigate, Escalate; menerima data/handler melalui props |
| `src/InvestigationPanel.jsx` | Catatan, dropdown klasifikasi, dan tombol Resolve; menerima data/handler melalui props |
| `src/Incident.js` | Tujuh insiden awal sebagai data mock |
| `src/mockUsers.js` | Kredensial akun demo dan analystId |
| `src/mockAnalyst.js` | Profil analis dan role SOC_L1/SOC_L2 |
| `src/App.css` | Gaya Dashboard, card, daftar, tombol, dialog, search, textarea, dan select |
| `src/Login.css` | Gaya form login serta pesan error |
| `src/index.css` | File kosong pada snapshot ini dan tidak di-import index.js |
| `src/App.test.js` | Tes bawaan yang belum disesuaikan; bukan bukti bahwa alur SOC sudah dites oleh npm test |
| `src/setupTests.js` | Setup matcher pengujian |
| `src/reportWebVitals.js` | Helper pengukuran performa bawaan; dipanggil tanpa callback pelaporan |

`src/logo.svg` serta logo/favicon di public adalah aset bawaan. Nama file `Login.jsx` berbeda dari nama komponen `Signin`; itu sah karena menggunakan default export/import.

## 6. Arsitektur komponen dan pemilik state

```text
index.js
└── BrowserRouter
    └── App
        ├── currentUser + incidents
        ├── /login → Signin
        └── /* → Dashboard, jika sudah login
            ├── handler bisnis + state form
            ├── / → IncidentList
            ├── /incident/:id → InvestigationPanel atau RouteError
            └── URL lain → RouteError
```

| Nilai | Pemilik | Alasan |
|---|---|---|
| `currentUser` | App | Login, pembatasan rute, dan logout memerlukan sesi yang sama |
| `incidents` | App | Catatan, status, dan pemilik harus tetap ada saat Dashboard dilepas karena logout |
| `username`, `password`, `error` | Signin | Hanya dipakai oleh form login |
| `draftNotes` | Dashboard | Teks yang sedang diketik, belum tentu tersimpan sebagai note |
| `selectedClassification` | Dashboard | Pilihan form sebelum resolve |
| `searchIncident` | Dashboard | Teks pencarian daftar |
| `assignmentIncidentID` | Dashboard | ID untuk isi popup sesudah mengambil insiden |
| `dialogRef` | Dashboard | Referensi elemen dialog; dibuat dengan useRef |

Nilai berikut dihitung dari data yang sudah ada, bukan state terpisah:

- `selectedIncidentId`: dari `useMatch('/incident/:id')` dan `params.id`.
- `selectedIncident`: hasil `.find()` pada incidents berdasarkan ID URL.
- `currentAnalyst`: hasil `.find()` pada mockAnalyst berdasarkan currentUser.analystId.
- `l2Analyst`: analis pertama yang role-nya SOC_L2.
- `totalIncidents`, `openIncidents`, `filteredIncident`: perhitungan dari incidents dan teks pencarian.

Pada kode sekarang, pencarian currentAnalyst memiliki fallback `{name: 'Guest', role: 'Unknown'}`. Itu cadangan tampilan ketika mapping data salah, bukan fitur login sebagai tamu. Akun mock yang benar tetap harus memiliki analystId yang cocok.

### Mengapa incidents berada di App?

Logout mengubah currentUser menjadi null. Route mengganti Dashboard dengan pengalihan ke login sehingga Dashboard dilepas. Kalau incidents berada di Dashboard, perubahan insiden akan hilang. App tetap terpasang, jadi state incidents di App bertahan selama aplikasi tidak dimuat ulang.

Data ini tetap hanya berada di memori tab tersebut. Tab atau laptop lain tidak otomatis memperoleh perubahan yang sama.

## 7. Props: cara komponen saling terhubung

Data dikirim dari induk ke anak; anak menjalankan callback dari induk untuk meminta perubahan.

| Hubungan | Props |
|---|---|
| App → Signin | `onLogin={setCurrentUser}` |
| App → Dashboard | `currentUser`, `onLogout`, `incidents`, `setIncidents` |
| Dashboard → IncidentList | `incidents={filteredIncident}`, `currentAnalyst`, `l2Analyst`, `takeIncident`, `investigateIncident`, `escalateIncident` |
| Dashboard → InvestigationPanel | `selectedIncident`, `selectedIncidentId`, `currentAnalyst`, `draftNotes`, `investigationNote`, `addNote`, `selectedClassification`, `classificationDropdown`, `resolvedIncident` |

Contoh nyata:

```jsx
<IncidentList incidents={filteredIncident} takeIncident={takeIncident} />
```

Cuplikan tersebut disingkat untuk menjelaskan dua props. Pada kode aplikasi, props lainnya tetap dikirim. Di dalam IncidentList, nama prop tetap `incidents`, tetapi isinya sudah merupakan hasil pencarian.

Saat tombol diklik, `takeIncident(item.id)` menjalankan fungsi milik Dashboard. Fungsi itu memanggil setIncidents milik App. React kemudian memperbarui tampilan dengan data baru.

Jangan membuat salinan state incidents di IncidentList atau InvestigationPanel. Kedua komponen harus membaca sumber data yang sama.

## 8. Routing dan sesi login

| URL | Belum login | Sudah login |
|---|---|---|
| `/login` | Tampilkan Signin | Arahkan ke `/` |
| `/` | Arahkan ke `/login` | Tampilkan daftar insiden |
| `/incident/EVT-2026-001` | Arahkan ke `/login` | Tampilkan panel jika insiden ditemukan |
| `/incident/ID-PALSU` | Arahkan ke `/login` | Tampilkan RouteError |
| `/asal` | Arahkan ke `/login` | Tampilkan RouteError |

`/*` di App meneruskan URL ke Dashboard agar rute detail di dalam Dashboard tetap bisa dicocokkan. BrowserRouter cukup satu kali, di index.js.

- `Link`: navigasi ketika pengguna mengeklik tautan, tanpa memuat ulang halaman.
- `useNavigate`: navigasi dari handler, misalnya sesudah klik Investigate atau Resolve.
- `Navigate`: komponen untuk pengalihan berdasarkan kondisi currentUser.
- `useMatch`: membaca kecocokan URL dan ID insiden di Dashboard.
- `replace` pada Navigate mengganti entri history saat pengalihan tersebut dilakukan; izin akses tetap ditentukan oleh currentUser.

Ini valid meskipun tidak memiliki isi di antara kedua tag:

```jsx
<Route path="/*" element={<RouteError />}></Route>
```

Tampilan sudah diberikan melalui `element`. Bentuk `<Route path="/*" element={<RouteError />} />` memiliki tujuan yang sama.

Rute detail sekarang memakai kondisi `selectedIncident ? <InvestigationPanel ... /> : <RouteError />`. URL yang cocok belum tentu memiliki data insiden yang valid, sehingga kedua pengecekan diperlukan.

Mengetik URL lalu Enter dapat memuat ulang aplikasi dan menghapus sesi lokal. Untuk mendemokan pesan rute salah dengan sesi tetap aktif, gunakan Link atau navigate dari dalam aplikasi.

## 9. Penjelasan handler satu per satu

### handleSubmit — Login.jsx

1. `event.preventDefault()` mencegah submit HTML memuat ulang halaman.
2. `.find()` mencari satu akun yang username **dan** password-nya cocok.
3. Jika cocok, tampilkan Welcome, hapus error, lalu panggil onLogin dengan analystId dan username.
4. Jika gagal, simpan pesan error; JSX `{error && ...}` menampilkannya.
5. Perubahan currentUser pada App membuat rute `/login` mengalihkan pengguna ke `/`.

### onLogout — dibuat di App, dipanggil Dashboard

`onLogout={() => setCurrentUser(null)}` dikirim ke Dashboard. Tombol Logout memanggil callback itu. Rute kemudian mengarahkan ke login karena sesi kosong. Logout tidak mengosongkan incidents di App.

### takeIncident(id)

Cari insiden berdasarkan ID. Hanya L1 yang boleh mengambil insiden OPEN. Dengan map, ubah insiden target menjadi IN_PROGRESS dan assignedTo menjadi currentAnalyst.id. Simpan ID untuk popup, lalu panggil showModal melalui ref.

### investigateIncident(id)

Kosongkan draft dan klasifikasi, lalu pindah ke `/incident/${id}`. Insiden yang tampil ditentukan kembali dari URL. Fungsi ini membuka tampilan; tidak mengubah status insiden.

### investigationNote(event)

Simpan `event.target.value` ke draftNotes. Mengetik belum menambah notes pada insiden.

### addNote()

Pengecekan: insiden ada, pemilik cocok, pasangan role/status diizinkan, dan draft tidak kosong setelah trim. Jika lolos, tambahkan teks ke akhir notes dengan array baru. Catatan lama tetap ada. Terakhir, kosongkan draft.

### escalateIncident(id)

Pastikan ada L2 dan pengguna adalah L1. Di map, cocokkan ID, status IN_PROGRESS, dan pemilik. Ubah status menjadi ESCALATED serta assignedTo menjadi l2Analyst.id. Properti lain, termasuk notes, dipertahankan.

L2 dipilih menggunakan `.find()`, sehingga bila ditambah beberapa analis L2, implementasi saat ini tetap memilih yang pertama. Belum ada pembagian beban atau pemilihan penerima.

### classificationDropdown(event)

Mengubah selectedClassification. Memilih dropdown saja belum menyimpan klasifikasi ke insiden. Penyimpanan dilakukan oleh resolvedIncident.

### resolvedIncident()

Validasi pilihan hanya TRUE_POSITIVE atau FALSE_POSITIVE. Di map, cek ID, pemilik, dan role/status. Ubah status menjadi RESOLVED serta classification menjadi nilai pilihan. Bersihkan draft/klasifikasi, lalu kembali ke daftar.

Catatan pembacaan kode: kondisi if luar hanya mengecek nilai klasifikasi; izin perubahan dicek di dalam map. Tombol Resolve juga memeriksa izin. Jika handler dipanggil langsung dengan insiden yang tidak boleh diubah, data tetap tidak berubah, tetapi reset form dan navigasi masih dapat berjalan. Jangan menganggap navigasi ke daftar sebagai bukti update berhasil tanpa mengecek statusnya.

### useEffect dengan dependency selectedIncidentId

Efek mengosongkan draftNotes dan selectedClassification ketika ID dari URL berubah, termasuk navigasi melalui history. Ini mencegah draft insiden sebelumnya muncul pada insiden lain.

Hook ditempatkan langsung di fungsi Dashboard, bukan di dalam handler klik atau kondisi if.

## 10. Status, klasifikasi, dan aturan role

```text
OPEN
  └─ L1 Take Incident → IN_PROGRESS
       ├─ L1 Resolve + klasifikasi → RESOLVED
       └─ L1 Escalate → ESCALATED, assignedTo = L2
            └─ L2 Resolve + klasifikasi → RESOLVED
```

| Tindakan | Role/status yang diizinkan | Syarat tambahan |
|---|---|---|
| Take Incident | L1, OPEN | ID insiden ditemukan |
| Investigate / Add Note | L1, IN_PROGRESS atau L2, ESCALATED | Analis harus pemilik; Add Note memerlukan teks |
| Escalate | L1, IN_PROGRESS | Milik sendiri dan analis L2 tersedia |
| Resolve | L1, IN_PROGRESS atau L2, ESCALATED | Milik sendiri dan klasifikasi valid |
| Ubah insiden RESOLVED | Tidak diizinkan oleh handler yang ada | Tidak ada fitur reopen |

`severity`, `status`, dan `classification` berbeda:

- **Severity**: tingkat keparahan awal, misalnya High atau Critical.
- **Status**: tahap penanganan, misalnya IN_PROGRESS atau RESOLVED.
- **Classification**: hasil penilaian analis, TRUE_POSITIVE atau FALSE_POSITIVE.

Pada aplikasi ini, severity tidak otomatis menentukan classification. Klasifikasi dipilih analis. Penjelasan sederhana untuk demo: true positive berarti alert terkonfirmasi sebagai kejadian yang memang dicari; false positive berarti alert ternyata tidak mewakili kejadian tersebut setelah diperiksa.

Tombol disabled membantu pengguna memahami tindakan yang tersedia. Pengecekan pada handler tetap diperlukan karena tindakan tidak boleh bergantung hanya pada tampilan tombol. Namun semua pemeriksaan saat ini masih berada di frontend dan bukan otorisasi server.

## 11. Cara membaca sintaks yang sering muncul

| Sintaks | Arti dalam proyek |
|---|---|
| `useState('')` | Nilai yang dapat berubah dan memicu render ulang |
| `setDraftNotes(...)` | Fungsi untuk mengubah nilai state, bukan variabel teks |
| `.find(...)` | Mengambil satu objek pertama yang cocok; bisa undefined |
| `.filter(...)` | Menghasilkan array berisi semua objek yang lolos kondisi |
| `.map(...)` | Menghasilkan array baru; dipakai untuk daftar JSX dan pembaruan insiden |
| `...incident` | Menyalin properti objek agar notes/severity/detail lain tetap ada |
| `[...(incident.notes || []), note]` | Membuat array catatan baru dan menambahkan satu teks |
| `condition ? A : B` | Memilih hasil berdasarkan kondisi |
| `&&` | Semua syarat dalam kelompok harus terpenuhi |
| `||` | Salah satu alternatif cukup terpenuhi |
| `?.` | Mengakses properti hanya jika nilai sebelumnya tidak null/undefined |
| `?? null` | Menggunakan null jika hasil sebelumnya null/undefined |
| `===` | Membandingkan nilai dan tipe secara ketat |
| `useRef(null)` | Menyimpan referensi elemen, misalnya dialog |

Contoh pembaruan state:

```jsx
setIncidents((previous) =>
  previous.map((incident) =>
    incident.id === id
      ? { ...incident, status: 'IN_PROGRESS' }
      : incident
  )
);
```

Ini ilustrasi pola map; kode asli menambahkan pemeriksaan role/status dan pemilik sesuai tindakan. Callback setter menerima state sebelumnya, sehingga pembaruan dihitung dari data yang diberikan React. Insiden lain dikembalikan tanpa perubahan.

Jangan menulis `selectedClassification === ('TRUE_POSITIVE' || 'FALSE_POSITIVE')`. Perbandingan harus diulang untuk kedua nilai, seperti pada kode saat ini. Demikian juga, `setSelectedIncidentId === null` tidak mengosongkan state; itu hanya membandingkan sebuah fungsi dengan null.

Input pada proyek adalah controlled input: `value` membaca state dan `onChange` memperbaruinya lewat event.target.value. `onChange={setSearchIncident}` salah untuk tujuan ini karena akan menyimpan event, bukan teks.

## 12. Search, popup, dan CSS

Search hanya berdasarkan ID insiden. Teks query di-trim dan diubah ke huruf kecil, lalu diperiksa dengan includes. Query kosong cocok dengan semua ID. Tidak ada dropdown filter status/severity pada versi ini.

`filteredIncident` dikirim ke IncidentList. Ketika panjang prop incidents nol, IncidentList menampilkan pesan hasil kosong. Jumlah total/OPEN di header tetap dihitung dari seluruh incidents, bukan hasil pencarian.

Popup menggunakan elemen HTML dialog dan ref. `showModal()` membukanya, `close()` menutupnya. assignmentIncidentID menentukan ID yang ditampilkan dan currentAnalyst.name menentukan nama penerima.

CSS utama berada di App.css dan Login.css. Selector seperti `li`, `button`, `textarea`, dan `select` di App.css bersifat global; misalnya style li berlaku pada daftar insiden dan daftar catatan. `.btn` pada login dipakai untuk input submit sehingga aturan `button:hover` tidak otomatis berlaku padanya.

Target saat ini desktop. Pemeriksaan tampilan perlu dilakukan di browser: ukuran teks, label, popup, tombol disabled, serta catatan panjang. Pengujian komponen tidak menghitung layout CSS seperti browser sungguhan.

## 13. Pembagian penjelasan untuk empat teman

| Bagian | File utama | Yang harus bisa dijelaskan |
|---|---|---|
| Anggota A: sesi dan routing | index.js, App.jsx, Login.jsx | Mengapa BrowserRouter sekali; currentUser; callback login; Navigate; logout |
| Anggota B: data dan aturan | Incident.js, mockUsers.js, mockAnalyst.js, Dashboard.jsx | Hubungan ID; status; role; take dan escalate |
| Anggota C: investigasi dan komponen | IncidentList.jsx, InvestigationPanel.jsx, Dashboard.jsx | Props; catatan; klasifikasi; resolve; validasi pemilik |
| Anggota D: pengalaman pengguna dan demo | App.css, Login.css, search, RouteError | Pencarian; tampilan; kasus gagal; urutan presentasi |

Setiap anggota sebaiknya mencoba alur penuh sekali, meskipun fokus penjelasan dibagi.

Contoh pembukaan presentasi:

> Aplikasi kami menyimulasikan penanganan insiden oleh SOC L1 dan L2. Data insiden serta akun masih mock. L1 dapat mengambil dan menyelesaikan kasusnya, atau mengeskalasi ke L2. Akses tindakan mengikuti role, pemilik, dan status. Kami memisahkan form login, daftar insiden, dan panel investigasi menjadi komponen dengan props, serta memakai routing untuk berpindah halaman.

Pertanyaan yang mungkin muncul:

| Pertanyaan | Jawaban sesuai implementasi |
|---|---|
| Mengapa state incidents di App? | Supaya perubahan tetap ada saat Dashboard dilepas karena logout |
| Apakah datanya tersimpan di database? | Belum; saat ini di memori React pada tab yang sama |
| Mengapa ID dibaca dari URL? | Supaya tampilan detail mengikuti navigasi dan history |
| Apakah memilih klasifikasi langsung menyimpan? | Belum; disimpan bersama status ketika Resolve |
| Apakah semua role bisa mengubah semua insiden? | Handler memeriksa role, pemilik, dan status |
| Apa yang terjadi saat refresh? | Sesi menjadi null dan insiden kembali ke data awal |
| Apakah akun frontend ini aman untuk produksi? | Ini simulasi; backend nanti harus memeriksa kredensial dan izin |
| Kenapa rute error tidak muncul setelah mengetik URL? | Reload menghapus sesi lokal; pengguna dialihkan ke login lebih dulu |

## 14. Checklist uji dan presentasi

- [ ] Login keempat akun menghasilkan nama/role yang benar.
- [ ] Akun salah dan kolom kosong ditolak; error hilang setelah login benar.
- [ ] Akses root/detail sebelum login kembali ke login.
- [ ] Take hanya mengubah insiden target, pemilik, status, dan hitungan OPEN.
- [ ] Popup menampilkan ID/nama yang benar dan dapat ditutup.
- [ ] Catatan kosong/spasi ditolak; catatan berulang disimpan tanpa kehilangan riwayat.
- [ ] Akun L1 lain tidak bisa mengubah insiden pemilik sebelumnya.
- [ ] Eskalasi memindahkan pemilik ke L2 dan mempertahankan notes.
- [ ] Logout/login L2 tetap menampilkan hasil kerja L1.
- [ ] Kedua klasifikasi dapat disimpan melalui Resolve; tanpa klasifikasi tombol disabled.
- [ ] RESOLVED tidak dapat diubah dengan handler yang tersedia.
- [ ] Search ID parsial, kapitalisasi, query kosong, dan tidak cocok bekerja.
- [ ] Back/Forward memilih insiden sesuai URL dan tidak membawa draft lama.
- [ ] URL tidak dikenal dan ID palsu menampilkan RouteError saat sesi masih aktif.
- [ ] Logout menolak akses Dashboard lagi meskipun memakai Back.
- [ ] Catatan panjang, fokus keyboard, Enter pada login, dan modal diperiksa di desktop.
- [ ] Console browser diperiksa ketika menjalankan demo.

## 15. Batasan dan kondisi pengujian yang perlu diketahui tim

Build produksi pernah berhasil dalam sesi pengujian sebelum revisi terakhir RouteError, dengan peringatan import yang tidak dipakai. Tes tambahan sebelumnya mencatat 39 lolos dan 6 gagal dari 45 kasus. **Angka tersebut berasal dari versi sebelum pengecekan selectedIncident pada route detail ditambahkan; jangan mengklaim sebagai hasil tes ulang snapshot ini.**

Pengujian tambahan memakai React Testing Library/Jest dengan simulasi dialog dan alert. Browser desktop otomatis belum dijalankan. Bukti yang paling kuat saat itu adalah alur L1 ke L2, penyimpanan notes, perubahan status, pembatasan handler, dan login/logout; bukan hasil pemeriksaan visual.

Catatan yang masih terlihat pada snapshot kode:

1. Link Sign up menuju halaman yang belum dibuat.
2. Input login belum memiliki label visual yang terhubung.
3. Classification tersimpan pada data, tetapi belum ditampilkan sebagai hasil akhir di daftar.
4. Panel investigasi belum menampilkan eventName, details, severity, dan sourceIP dari data mock.
5. Add Note masih tampil aktif untuk insiden valid yang tidak boleh diubah; handler menolak perubahan tanpa pesan tambahan. ID palsu sekarang menampilkan RouteError sehingga panelnya tidak dirender.
6. App.test.js masih mengimpor `./Dashboard/` dan memeriksa Learn React. `npm test` bawaan perlu diperbarui sebelum dianggap sebagai tes aplikasi SOC.
7. Session dan insiden tidak persisten setelah refresh atau tab ditutup.

Penanganan URL/ID yang baru ditambahkan perlu diverifikasi lagi setelah menjalankan paket ini. Daftar ini menjelaskan kondisi nyata kode agar anggota tim tidak mendemokan fitur yang belum tersedia.

## 16. Pemecahan masalah cepat

| Gejala | Pemeriksaan |
|---|---|
| npm tidak dikenali | Pastikan Node/npm terpasang dan terminal baru dibuka |
| package.json tidak ditemukan | Terminal harus berada di folder sem3-app |
| Dependensi tidak ditemukan | Jalankan npm ci dari folder proyek; baca error jaringan/registry jika pemasangan gagal |
| Halaman kosong | Periksa terminal dan Console; index.js harus merender App dalam BrowserRouter |
| Login benar tetapi analis Guest | Cocokkan mockUsers.analystId dengan mockAnalyst.id |
| Tombol Investigate disabled | Insiden harus dimiliki akun aktif dan memenuhi pasangan role/status |
| L2 tidak melihat insiden ESCALATED | Pastikan L1 memakai Escalate dan tidak melakukan refresh di tengah demo |
| Rute salah membuka login | Sesi belum ada atau hilang karena reload |
| Klasifikasi kosong saat membuka insiden | Dropdown adalah pilihan draft; useEffect meresetnya ketika ID berubah |
| Test Learn React gagal | Tes template belum mengikuti struktur aplikasi; lihat bagian 15 |

## 17. Isi paket dan pengembangan berikutnya

Paket berbagi menyertakan source `src`, aset `public`, package.json, package-lock.json, konfigurasi gitignore, README bawaan, panduan ini, serta salinan kode teks untuk dibaca bersama. node_modules, build, dan riwayat .git tidak diperlukan untuk membaca dan memasang proyek dari sumbernya.

`PANDUAN-TIM.html` dapat dibuka langsung untuk membaca panduan, lalu dicetak ke PDF lewat fitur Print browser. `KODE-LENGKAP.md` menggabungkan file kode teks; aplikasi tetap dijalankan dari struktur file proyek, bukan dari dokumen gabungan tersebut.

Saat tahap Express dimulai, alur bisnis yang ada menjadi acuan endpoint. Server perlu menangani pemeriksaan login, penetapan identitas dari sesi, validasi kepemilikan/role/status, penyimpanan notes dan classification, serta database. Frontend kemudian menunggu respons API dan memperbarui tampilannya berdasarkan hasil server.

Untuk penjelasan kepada teman, mulai dari satu aksi konkret: **klik Take Incident → callback ke Dashboard → setIncidents di App → daftar dirender ulang**. Setelah alur itu dipahami, Add Note, Escalate, dan Resolve memakai pola yang serupa.
