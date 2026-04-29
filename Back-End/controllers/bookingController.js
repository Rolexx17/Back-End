import db from '../config/db.js';
import BaseController from '../utils/BaseController.js';

class BookingController extends BaseController {
    constructor() { super('Booking'); }

    createBooking = async (req, res) => {
        try {
            const { user_id, field_id, booking_date, time_slot, total_price } = req.body;
            
            const [existing] = await db.query(
                `SELECT * FROM bookings WHERE field_id = ? AND booking_date = ? AND time_slot = ? AND status != 'Cancelled'`,
                [field_id, booking_date, time_slot]
            );

            if (existing.length > 0) return this.sendError(res, 400, "Jadwal jam tersebut sudah terisi");

            const [result] = await db.query(
                'INSERT INTO bookings (user_id, field_id, booking_date, time_slot, total_price, status) VALUES (?, ?, ?, ?, ?, "Pending")',
                [user_id, field_id, booking_date, time_slot, total_price]
            );
            
            this.sendSuccess(res, 201, "Booking berhasil dibuat", { id: result.insertId, status: "Pending" });
        } catch (error) {
            this.sendError(res, 500, "Gagal membuat booking", error.message);
        }
    };

    getUserBookings = async (req, res) => {
        try {
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

    updateBookingStatus = async (req, res) => {
        try {
            const { status } = req.body;
            const [result] = await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
            
            if (result.affectedRows === 0) return this.sendError(res, 404, "Booking tidak ditemukan");
            this.sendSuccess(res, 200, "Status booking berhasil diupdate", { id: req.params.id, status });
        } catch (error) {
            this.sendError(res, 500, "Gagal update status booking", error.message);
        }
    };

    deleteBooking = async (req, res) => {
        try {
            const [result] = await db.query('DELETE FROM bookings WHERE id = ?', [req.params.id]);
            
            if (result.affectedRows === 0) return this.sendError(res, 404, "Booking tidak ditemukan");
            this.sendSuccess(res, 200, "Riwayat booking berhasil dihapus");
        } catch (error) {
            this.sendError(res, 500, "Gagal menghapus booking", error.message);
        }
    };
}

export default new BookingController();