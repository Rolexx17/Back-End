// Base controller untuk logika respons yang digunakan bersama

// Kelas ini menyediakan metode umum untuk mengirim respons sukses dan error.
// Controller lain akan mewarisi kelas dasar ini untuk menjaga konsistensi format respons.

import sendResponse from './response.js';

export default class BaseController {
    // Menginisialisasi controller dengan nama resource untuk keperluan pencatatan log (logging)
    constructor(resourceName) {
        this.resourceName = resourceName;
    }

    // Mengirimkan respons sukses menggunakan format yang telah distandarisasi
    sendSuccess(res, statusCode, message, data = null, meta = null) {
        sendResponse(res, statusCode, message, data, meta);
    }

    // Mengirimkan respons error dan mencatat detail error pada konsol (console)
    sendError(res, statusCode, message, errorDetails = null) {
        console.error(`[${this.resourceName} Error]`, errorDetails);
        sendResponse(res, statusCode, message, null, errorDetails);
    }
}