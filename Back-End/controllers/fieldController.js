// Controller untuk Manajemen Lapangan (Fields)

// Kelas ini menangani fungsionalitas terkait data lapangan olahraga,
// termasuk mengambil daftar lapangan, menambah data, memperbarui, dan menghapus data.

import db from '../config/db.js';
import BaseController from '../utils/BaseController.js';

class FieldController extends BaseController {
    // Menginisialisasi controller dengan nama resource 'Field'
    constructor() {
        super('Field');
    }

    // Mengambil daftar lapangan dengan fitur pencarian dan paginasi
    getFields = async (req, res) => {
        try {
            // Menyiapkan pengaturan paginasi dan pencarian (search)
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.q || '';
            const offset = (page - 1) * limit;

            let query = `SELECT * FROM fields`;
            let countQuery = `SELECT COUNT(*) as total FROM fields`;
            const queryParams = [];

            // Menambahkan logika pencarian menggunakan LIKE jika terdapat kata kunci (query q)
            if (search) {
                query += ` WHERE name LIKE ? OR type LIKE ?`;
                countQuery += ` WHERE name LIKE ? OR type LIKE ?`;
                queryParams.push(`%${search}%`, `%${search}%`);
            }

            // Menambahkan batasan paginasi (Limit dan Offset)
            query += ` LIMIT ? OFFSET ?`;
            queryParams.push(limit, offset);

            // Menjalankan kueri utama dan hitungan total baris (untuk metadata paginasi)
            const [rows] = await db.query(query, queryParams);
            const [totalRows] = await db.query(countQuery, search ? [`%${search}%`, `%${search}%`] : []);

            this.sendSuccess(res, 200, "Berhasil mengambil data lapangan", rows, {
                page, limit, totalItems: totalRows[0].total, totalPages: Math.ceil(totalRows[0].total / limit)
            });
        } catch (error) {
            this.sendError(res, 500, "Gagal mengambil data lapangan", error.message);
        }
    };

    // Mengambil detail spesifik dari sebuah lapangan berdasarkan ID
    getFieldById = async (req, res) => {
        try {
            const [rows] = await db.query('SELECT * FROM fields WHERE id = ?', [req.params.id]);
            
            if (rows.length === 0) return this.sendError(res, 404, "Lapangan tidak ditemukan");
            
            this.sendSuccess(res, 200, "Detail lapangan", rows[0]);
        } catch (error) {
            this.sendError(res, 500, "Kesalahan server", error.message);
        }
    };

    // Menambahkan data lapangan baru ke dalam database
    createField = async (req, res) => {
        try {
            // Mengekstrak properti lapangan dari request
            const { name, type, price, image } = req.body;
            
            // Memastikan data utama lapangan telah diisi
            if (!name || !type || !price) {
                return this.sendError(res, 400, "Data lapangan (name, type, price) harus diisi");
            }

            // Menyimpan record baru ke tabel fields
            const [result] = await db.query('INSERT INTO fields (name, type, price, image) VALUES (?, ?, ?, ?)', [name, type, price, image]);
            
            this.sendSuccess(res, 201, "Lapangan berhasil ditambahkan", { id: result.insertId, ...req.body });
        } catch (error) {
            this.sendError(res, 500, "Gagal menambahkan lapangan", error.message);
        }
    };

    // Memperbarui informasi data lapangan yang sudah ada
    updateField = async (req, res) => {
        try {
            const { name, type, price, image } = req.body;
            
            if (!name || !type || !price) {
                return this.sendError(res, 400, "Data lapangan (name, type, price) harus diisi");
            }

            // Melakukan update ke tabel fields sesuai dengan parameter ID
            const [result] = await db.query(
                'UPDATE fields SET name = ?, type = ?, price = ?, image = ? WHERE id = ?', 
                [name, type, price, image, req.params.id]
            );
            
            if (result.affectedRows === 0) return this.sendError(res, 404, "Lapangan tidak ditemukan");
            
            this.sendSuccess(res, 200, "Lapangan berhasil diupdate", { id: req.params.id, name, type, price, image });
        } catch (error) {
            this.sendError(res, 500, "Gagal update data lapangan", error.message);
        }
    };

    // Menghapus data lapangan dari sistem
    deleteField = async (req, res) => {
        try {
            const [result] = await db.query('DELETE FROM fields WHERE id = ?', [req.params.id]);
            
            if (result.affectedRows === 0) return this.sendError(res, 404, "Lapangan tidak ditemukan");
            
            this.sendSuccess(res, 200, "Lapangan berhasil dihapus");
        } catch (error) {
            this.sendError(res, 500, "Gagal menghapus lapangan", error.message);
        }
    };
}

export default new FieldController();