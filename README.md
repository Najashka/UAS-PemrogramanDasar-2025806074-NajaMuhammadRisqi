# 🧾 Sales Inventory System

Aplikasi manajemen penjualan dan inventori toko berbasis web, dengan tampilan
bertema *Wizarding World* (Hogwarts) — nuansa maroon & emas di atas kertas
perkamen.

---

## 👤 Identitas Mahasiswa

| Keterangan     | Detail                          |
|----------------|----------------------------------|
| Nama Mahasiswa | `Naja Muhammad Risqi`        |
| NPM            | `2025806074`                 |
| Prodi          | `Teknologi Informasi 2`               |
| Mata Kuliah    | `Pemrograman Dasar` |

## 🎯 Tema Proyek

**Sistem Point of Sale (Kasir) & Manajemen Inventori Toko**


---

## 📖 Deskripsi Singkat Aplikasi

**Sales Inventory System** adalah aplikasi web untuk mengelola operasional
toko sehari-hari, mulai dari pencatatan produk & stok, data supplier dan
customer, transaksi penjualan (kasir), hingga laporan penjualan periodik.

Fitur utama:

- 🔐 Login & autentikasi berbasis JWT, dengan 2 peran (**admin** & **cashier**)
- 📊 Dashboard ringkasan: penjualan hari ini, transaksi, produk terlaris, dan grafik penjualan 7 hari terakhir
- 🗂️ Manajemen **Category**, **Product**, **Supplier**, dan **Customer** (CRUD lengkap)
- 🛒 Transaksi **Sales** (kasir) dengan pengurangan stok otomatis dan cetak struk
- 🕘 **Sales History** untuk melihat riwayat transaksi
- 📈 **Report** penjualan dengan filter rentang tanggal dan cetak/print laporan
- 👥 Manajemen **Users** (khusus admin), termasuk reset password

---

## 🛠️ Teknologi yang Digunakan

**Frontend**
- HTML5, CSS3 (custom, tanpa framework CSS), JavaScript (Vanilla JS, ES Modules)
- [Chart.js](https://www.chartjs.org/) — grafik penjualan pada dashboard
- [Font Awesome 6](https://fontawesome.com/) — ikon

**Backend**
- [Node.js](https://nodejs.org/) + [Express.js 5](https://expressjs.com/)
- [MySQL 8](https://www.mysql.com/) (melalui `mysql2`)
- [JWT (jsonwebtoken)](https://www.npmjs.com/package/jsonwebtoken) — autentikasi & otorisasi
- [bcrypt](https://www.npmjs.com/package/bcrypt) — hashing password
- [dotenv](https://www.npmjs.com/package/dotenv) — konfigurasi environment
- [cors](https://www.npmjs.com/package/cors)

**Database & Infrastruktur**
- MySQL 8.4 (via Docker)
- phpMyAdmin (opsional, untuk GUI database)
- Docker & Docker Compose

---

## 📁 Struktur Project

```
sales-inventory-system/
├── backend/
│   ├── config/
│   │   └── db.js                # Koneksi pool MySQL
│   ├── controllers/              # Logic tiap resource (category, product, sale, dst)
│   ├── models/                   # Query database tiap resource
│   ├── routes/                   # Definisi endpoint REST API
│   ├── middleware/
│   │   ├── verifyToken.js        # Verifikasi JWT
│   │   └── authorize.js          # Pembatasan akses berdasarkan role
│   ├── database/
│   │   └── init.sql              # Skema database lengkap (auto-create semua tabel)
│   ├── utils/                    # Helper bcrypt & jwt
│   ├── docker-compose.yml        # MySQL + phpMyAdmin
│   ├── .env                      # Konfigurasi environment (DB, JWT secret)
│   ├── app.js                    # Entry point server Express
│   └── package.json
│
└── frontend/
    ├── css/                       # Style global (layout, komponen, tabel, modal, toast, dll)
    ├── js/
    │   ├── api/                   # Wrapper fetch API
    │   ├── auth/                  # Login, logout, guard halaman
    │   ├── layout/                # Sidebar, navbar, layout renderer
    │   └── utils/                 # Loading & toast helper
    ├── pages/
    │   ├── dashboard/
    │   ├── category/
    │   ├── product/
    │   ├── supplier/
    │   ├── customer/
    │   ├── sale/                  # Halaman kasir + detail transaksi
    │   ├── salehistory/
    │   ├── report/
    │   ├── user/
    │   └── receipt/               # Halaman cetak struk
    ├── assets/                    # Logo, ikon, font, gambar
    └── index.html
```

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Prasyarat

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) & Docker Compose (untuk database)
- npm

### 2. Clone repository

```bash
git clone [ISI_LINK_REPOSITORY_GITHUB_KAMU]
cd sales-inventory-system
```

### 3. Jalankan database (MySQL + phpMyAdmin via Docker)

```bash
cd backend
docker compose up -d
```

Tabel akan **otomatis terbuat** saat container MySQL pertama kali dijalankan
(membaca `backend/database/init.sql`). phpMyAdmin bisa diakses di
`http://localhost:8080` untuk melihat isi database secara visual.

> Kalau ingin reset total database dari nol:
> `docker compose down -v && docker compose up -d`

### 4. Konfigurasi environment

File `backend/.env` sudah tersedia dengan konfigurasi default:

```
DB_HOST=localhost
DB_PORT=3307
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=sales_inventory
JWT_SECRET=SalesInventorySystem2026SuperSecret
```

Sesuaikan nilai di atas jika environment kamu berbeda.

### 5. Install dependency & jalankan backend

```bash
npm install
npm run dev
```

Server akan berjalan di `http://localhost:3000`.

### 6. Buka aplikasi

Buka browser ke `http://localhost:3000` (frontend disajikan langsung oleh
backend Express sebagai static file).

### 7. Login

Gunakan akun admin default (sudah tersedia dari `init.sql`):

| Username | Password  |
|----------|-----------|
| `admin`  | `admin123`|

> ⚠️ Disarankan segera mengganti password setelah login pertama kali.

---

## 🔌 Daftar Endpoint REST API

Base URL: `http://localhost:3000/api`

### Auth

| Method | Endpoint       | Deskripsi          |
|--------|----------------|---------------------|
| POST   | `/auth/login`  | Login & dapatkan JWT token |

### Category

| Method | Endpoint            | Deskripsi              |
|--------|---------------------|-------------------------|
| GET    | `/categories`       | Ambil semua kategori    |
| GET    | `/categories/:id`   | Ambil kategori by ID    |
| POST   | `/categories`       | Tambah kategori baru    |
| PUT    | `/categories/:id`   | Update kategori         |
| DELETE | `/categories/:id`   | Hapus kategori          |

### Product

| Method | Endpoint          | Deskripsi                        | Akses        |
|--------|-------------------|-----------------------------------|--------------|
| GET    | `/products`       | Ambil semua produk                | 🔒 Login     |
| GET    | `/products/:id`   | Ambil produk by ID                | 🔒 Login     |
| POST   | `/products`       | Tambah produk baru                | 🔒 Admin     |
| PUT    | `/products/:id`   | Update produk                     | 🔒 Admin     |
| DELETE | `/products/:id`   | Hapus produk                      | 🔒 Admin     |

### Supplier

| Method | Endpoint            | Deskripsi              |
|--------|---------------------|-------------------------|
| GET    | `/suppliers`        | Ambil semua supplier    |
| GET    | `/suppliers/:id`    | Ambil supplier by ID    |
| POST   | `/suppliers`        | Tambah supplier baru    |
| PUT    | `/suppliers/:id`    | Update supplier         |
| DELETE | `/suppliers/:id`    | Hapus supplier          |

### Customer

| Method | Endpoint            | Deskripsi              |
|--------|---------------------|-------------------------|
| GET    | `/customers`        | Ambil semua customer    |
| GET    | `/customers/:id`    | Ambil customer by ID    |
| POST   | `/customers`        | Tambah customer baru    |
| PUT    | `/customers/:id`    | Update customer         |
| DELETE | `/customers/:id`    | Hapus customer          |

### Sales (Transaksi)

| Method | Endpoint        | Deskripsi                                   |
|--------|-----------------|-----------------------------------------------|
| GET    | `/sales`        | Ambil semua transaksi penjualan               |
| GET    | `/sales/:id`    | Ambil detail transaksi (header + item)        |
| POST   | `/sales`        | Buat transaksi baru (otomatis kurangi stok)   |
| PUT    | `/sales/:id`    | Update transaksi                              |
| DELETE | `/sales/:id`    | Hapus transaksi                               |

### Users (khusus Admin)

| Method | Endpoint                       | Deskripsi                  |
|--------|----------------------------------|------------------------------|
| GET    | `/users`                        | Ambil semua user             |
| GET    | `/users/:id`                    | Ambil user by ID             |
| POST   | `/users`                        | Tambah user baru             |
| PUT    | `/users/:id`                    | Update data user             |
| PATCH  | `/users/:id/reset-password`     | Reset password user          |
| DELETE | `/users/:id`                    | Hapus user                   |

### Dashboard

| Method | Endpoint      | Deskripsi                                                         |
|--------|---------------|----------------------------------------------------------------------|
| GET    | `/dashboard`  | Ringkasan statistik (penjualan hari ini, produk terlaris, grafik 7 hari, dll) |

### Report

| Method | Endpoint                          | Deskripsi                                 |
|--------|------------------------------------|----------------------------------------------|
| GET    | `/report?start=YYYY-MM-DD&end=YYYY-MM-DD` | Laporan penjualan pada rentang tanggal tertentu |

---

## 🖼️ Screenshot Aplikasi


| Halaman     | Screenshot                                      |
|-------------|--------------------------------------------------|
| Login       | `![Login](frontend/ss/LOGIN.png)`            |
| Dashboard   | `![Dashboard](frontend/ss/DASHBOARD.png)`    |
| Product     | `![Product](frontend/ss/PRODUCTS.png)`        |
| Sales       | `![Sales](frontend/ss/SALES.png)`            |
| Report      | `![Report](frontend/ss/REPORT.png)`          |

---

## 🔗 Link Repository GitHub

`https://github.com/Najashka/UAS-PemrogramanDasar-2025806074-NajaMuhammadRisqi.git`

---

<p align="center">
  Dibuat sebagai bagian dari tugas kuliah — Sales Inventory System, 2026.
</p>