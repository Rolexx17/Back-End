// Konfigurasi database dan connection pool

// File ini mengatur koneksi database MySQL menggunakan connection pool.
// File ini memuat variabel lingkungan (environment variables) untuk kredensial database.

import mysql from 'mysql2/promise';
import 'dotenv/config';

// Membuat connection pool untuk menangani banyak koneksi database secara bersamaan dengan efisien
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Mengekspor pool agar dapat digunakan pada modul atau file lain
export default pool;