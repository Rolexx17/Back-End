// Memformat dan mengirimkan respons API

// Fungsi ini menstandarisasi struktur respons JSON untuk seluruh API.
// Fungsi ini menangani respons sukses maupun error berdasarkan kode status HTTP.

export default function sendResponse(res, statusCode, message, data = null, meta = null) {
    // Membentuk objek respons dasar dengan status keberhasilan dan pesan
    const response = {
        success: statusCode >= 200 && statusCode < 300,
        message: message,
    };
    
    // Menambahkan data ke dalam respons jika tersedia
    if (data) response.data = data;
    
    // Menambahkan metadata (seperti info paginasi) ke dalam respons jika tersedia
    if (meta) response.meta = meta;
    
    // Mengirimkan respons JSON dengan kode status HTTP yang telah ditentukan
    return res.status(statusCode).json(response);
}