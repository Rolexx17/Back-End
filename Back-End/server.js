// Titik masuk (entry point) utama untuk server

// File ini mengonfigurasi dan menjalankan server web Express.
// File ini mengatur middleware, routing, dan penanganan untuk rute yang tidak ditemukan.

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import sendResponse from './utils/response.js';

// Memuat variabel lingkungan dari file .env
dotenv.config();

// Menginisialisasi aplikasi Express
const app = express();

// Mengaktifkan Cross-Origin Resource Sharing (CORS) agar API dapat diakses dari domain lain
app.use(cors());

// Mem-parsing permintaan (request) yang masuk dalam format JSON
app.use(express.json());

// Mem-parsing data yang dikirim melalui URL-encoded (misalnya dari form)
app.use(express.urlencoded({ extended: true }));

// Mendaftarkan semua rute API di bawah awalan endpoint '/api'
app.use('/api', apiRoutes);

// Menangani permintaan untuk endpoint yang tidak terdaftar (Fallback 404)
app.use((req, res) => {
    sendResponse(res, 404, "Endpoint tidak ditemukan");
});

// Menentukan port tempat server akan berjalan
const PORT = process.env.PORT || 5000;

// Menjalankan server dan mencetak status port pada konsol
app.listen(PORT, () => {
    console.log(`Server Lumina Arena berjalan di port ${PORT}`);
});