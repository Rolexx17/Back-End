// Controller untuk Autentikasi dan Manajemen Pengguna

// Kelas ini menangani proses registrasi, login, dan pengelolaan profil pengguna.
// Kelas ini mewarisi BaseController untuk menggunakan format respons standar.

import db from '../config/db.js';
import BaseController from '../utils/BaseController.js';

class AuthController extends BaseController {
    // Menginisialisasi controller dengan nama resource 'Auth'
    constructor() { super('Auth'); }

    // Mendaftarkan pengguna baru (Register)
    register = async (req, res) => {
        try {
            // Mengekstrak data pengguna dari body request
            const { name, email, password } = req.body;
            
            // Memvalidasi bahwa semua field yang diwajibkan telah diisi
            if (!name || !email || !password) {
                return this.sendError(res, 400, "Semua field (name, email, password) harus diisi");
            }

            // Memasukkan data pengguna baru ke dalam database
            const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
            
            // Mengembalikan respons sukses beserta data pengguna yang didaftarkan
            this.sendSuccess(res, 201, "Registrasi berhasil", { id: result.insertId, name, email });
        } catch (error) {
            // Menangani error, kemungkinan karena email sudah terdaftar sebelumnya
            this.sendError(res, 500, "Gagal registrasi (Email mungkin sudah terdaftar)", error.message);
        }
    };

    // Mengautentikasi pengguna yang sudah ada (Login)
    login = async (req, res) => {
        try {
            // Mengekstrak kredensial login dari request
            const { email, password } = req.body;
            
            // Memvalidasi input dari pengguna
            if (!email || !password) {
                return this.sendError(res, 400, "Email dan password harus diisi");
            }

            // Memeriksa apakah terdapat pengguna dengan kredensial yang sesuai di database
            const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
            
            // Mengembalikan pesan error jika tidak ada pengguna yang cocok
            if (rows.length === 0) return this.sendError(res, 401, "Email atau password salah");
            
            // Membuat token dummy sederhana untuk keperluan autentikasi
            const token = Buffer.from(`${email}:${Date.now()}`).toString('base64'); // Dummy Token
            
            // Menghapus password dari payload respons untuk alasan keamanan
            delete rows[0].password;
            
            // Mengembalikan respons sukses dengan token dan data profil pengguna
            this.sendSuccess(res, 200, "Login berhasil", { token, user: rows[0] });
        } catch (error) {
            this.sendError(res, 500, "Gagal login", error.message);
        }
    };

    // Mengambil semua data pengguna dari database
    getAllUsers = async (req, res) => {
        try {
            // Mengambil daftar pengguna yang diurutkan berdasarkan ID secara menurun
            const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY id DESC');
            this.sendSuccess(res, 200, "Daftar semua user", rows);
        } catch (error) {
            this.sendError(res, 500, "Gagal mengambil daftar user", error.message);
        }
    };

    // Mengambil data profil pengguna tertentu berdasarkan ID
    getUserProfile = async (req, res) => {
        try {
            // Mengambil data pengguna berdasarkan parameter ID dari URL
            const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.params.id]);
            
            // Mengembalikan status 404 jika pengguna tidak ditemukan
            if (rows.length === 0) return this.sendError(res, 404, "User tidak ditemukan");
            
            this.sendSuccess(res, 200, "Profil user", rows[0]);
        } catch (error) {
            this.sendError(res, 500, "Gagal mengambil profil", error.message);
        }
    };

    // Memperbarui informasi profil pengguna
    updateUserProfile = async (req, res) => {
        try {
            // Mengekstrak data yang akan diperbarui
            const { name, email } = req.body;
            
            // Memvalidasi input dari pengguna
            if (!name || !email) {
                return this.sendError(res, 400, "Name dan email harus diisi");
            }

            // Memperbarui data pengguna di dalam database
            const [result] = await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id]);
            
            // Mengembalikan status 404 jika pengguna yang akan diperbarui tidak ditemukan
            if (result.affectedRows === 0) return this.sendError(res, 404, "User tidak ditemukan");
            
            this.sendSuccess(res, 200, "Profil berhasil diupdate", { id: req.params.id, name, email });
        } catch (error) {
            this.sendError(res, 500, "Gagal update profil", error.message);
        }
    };

    // Menghapus pengguna dari sistem
    deleteUser = async (req, res) => {
        try {
            // Menghapus pengguna berdasarkan parameter ID
            const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
            
            // Mengembalikan status 404 jika pengguna tidak ditemukan
            if (result.affectedRows === 0) return this.sendError(res, 404, "User tidak ditemukan");
            
            this.sendSuccess(res, 200, "User berhasil dihapus");
        } catch (error) {
            // Menangani error, misalnya karena kegagalan pada batasan foreign key (data saling terikat)
            this.sendError(res, 500, "Gagal menghapus user (Pastikan user tidak terikat dengan data pesanan/booking)", error.message);
        }
    };
}

// Mengekspor instance tunggal (singleton) dari AuthController
export default new AuthController();