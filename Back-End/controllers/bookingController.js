// Controller untuk Manajemen Pemesanan (Booking)

// Kelas ini menangani proses pembuatan, pengambilan, pembaruan status,
// dan penghapusan data pemesanan lapangan.

import db from '../config/db.js';
import BaseController from '../utils/BaseController.js';

class BookingController extends BaseController {
    // Menginisialisasi controller dengan nama resource 'Booking'
    constructor() { super('Booking'); }

    // Membuat pemesanan (booking) baru
    createBooking = async (req, res) => {
        try {
            // Mengekstrak data pemesanan dari body request
            const { user_id, field_id, booking_date, time_slot, total_price } = req.body;
            
            // Memvalidasi kelengkapan data pemesanan
            if (!user_id || !field_id || !booking_date || !time_slot || !total_price) {
                return this.sendError(res, 400, "Data booking (user_id, field_id, booking_date, time_slot, total_price) harus diisi lengkap");
            }

            // Memeriksa apakah jadwal yang dipilih sudah dipesan orang lain (kecuali yang dibatalkan)
            const [existing] = await db.query(
                `SELECT * FROM bookings WHERE field_id = ? AND booking_date = ? AND time_slot = ? AND status != 'Cancelled'`,
                [field_id, booking_date, time_slot]
            );

            // Jika jadwal sudah terisi, tolak permintaan
            if (existing.length > 0) return this.sendError(res, 400, "Jadwal jam tersebut sudah terisi");

            // Memasukkan data pemesanan baru ke dalam database dengan status awal "Pending"
            const [result] = await db.query(
                'INSERT INTO bookings (user_id, field_id, booking_date, time_slot, total_price, status) VALUES (?, ?, ?, ?, ?, "Pending")',
                [user_id, field_id, booking_date, time_slot, total_price]
            );
            
            this.sendSuccess(res, 201, "Booking berhasil dibuat", { id: result.insertId, status: "Pending" });
        } catch (error) {
            this.sendError(res, 500, "Gagal membuat booking", error.message);
        }
    };

    // Mengambil daftar semua pemesanan dengan dukungan paginasi dan filter status
    getAllBookings = async (req, res) => {
        try {
            // Mengatur parameter paginasi (page dan limit)
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status || '';
            const offset = (page - 1) * limit;

            // Menyusun kueri (query) dasar yang menggabungkan tabel booking, user, dan field
            let query = `SELECT b.*, u.name as user_name, f.name as field_name FROM bookings b JOIN users u ON b.user_id = u.id JOIN fields f ON b.field_id = f.id`;
            let countQuery = `SELECT COUNT(*) as total FROM bookings b`;
            const queryParams = [];

            // Menambahkan filter status jika diberikan pada parameter request
            if (status) {
                query += ` WHERE b.status = ?`;
                countQuery += ` WHERE b.status = ?`;
                queryParams.push(status);
            }

            // Menambahkan pengurutan dan paginasi
            query += ` ORDER BY b.id DESC LIMIT ? OFFSET ?`;
            queryParams.push(limit, offset);

            // Mengeksekusi kueri utama dan kueri untuk total data
            const [rows] = await db.query(query, queryParams);
            const [totalRows] = await db.query(countQuery, status ? [status] : []);

            // Mengembalikan respons dengan data hasil pencarian beserta metadata paginasi
            this.sendSuccess(res, 200, "Berhasil mengambil semua data booking", rows, {
                page, limit, totalItems: totalRows[0].total, totalPages: Math.ceil(totalRows[0].total / limit)
            });
        } catch (error) {
            this.sendError(res, 500, "Gagal mengambil data booking", error.message);
        }
    };

    // Mengambil riwayat pemesanan untuk pengguna tertentu berdasarkan ID
    getUserBookings = async (req, res) => {
        try {
            // Mencari pemesanan milik user_id yang sesuai
            const [rows] = await db.query(
                `SELECT b.*, f.name as field_name FROM bookings b 
                 JOIN fields f ON b.field_id = f.id WHERE b.user_id = ? ORDER BY b.id DESC`, 
                [req.params.userId]
            );
            this.sendSuccess(res, 200, "Riwayat booking", rows);
        } catch (error) {
            this.sendError(res, 500, "Gagal mengambil histori", error.message);
        }
    };

    // Memperbarui status pemesanan (misalnya: dari Pending ke Confirmed atau Cancelled)
    updateBookingStatus = async (req, res) => {
        try {
            const { status } = req.body;
            
            // Validasi input status
            if (!status) {
                return this.sendError(res, 400, "Status booking harus diisi");
            }

            // Menjalankan kueri pembaruan status
            const [result] = await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
            
            // Memeriksa apakah data pemesanan ditemukan
            if (result.affectedRows === 0) return this.sendError(res, 404, "Booking tidak ditemukan");
            
            this.sendSuccess(res, 200, "Status booking berhasil diupdate", { id: req.params.id, status });
        } catch (error) {
            this.sendError(res, 500, "Gagal update status booking", error.message);
        }
    };

    // Menghapus data riwayat pemesanan
    deleteBooking = async (req, res) => {
        try {
            // Menghapus data pemesanan berdasarkan ID pemesanan
            const [result] = await db.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
            
            if (result.affectedRows === 0) return this.sendError(res, 404, "Booking tidak ditemukan");
            this.sendSuccess(res, 200, "Riwayat booking berhasil dihapus");
        } catch (error) {
            this.sendError(res, 500, "Gagal menghapus booking", error.message);
        }
    };
}

export default new BookingController();