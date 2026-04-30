// Konfigurasi Rute API (API Routes)

// File ini mendefinisikan semua endpoint untuk aplikasi dan memetakannya
// ke metode controller yang bersesuaian.

import express from 'express';
import fieldController from '../controllers/fieldController.js';
import authController from '../controllers/authController.js';
import bookingController from '../controllers/bookingController.js';
import socialController from '../controllers/socialController.js';

// Menginisialisasi Express router
const router = express.Router();

// Rute untuk Autentikasi dan Manajemen Pengguna
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/users', authController.getAllUsers);
router.get('/users/:id', authController.getUserProfile);
router.put('/users/:id', authController.updateUserProfile);
router.delete('/users/:id', authController.deleteUser);

// Rute untuk Manajemen Lapangan
router.get('/fields', fieldController.getFields);
router.get('/fields/:id', fieldController.getFieldById);
router.post('/fields', fieldController.createField);
router.put('/fields/:id', fieldController.updateField);
router.delete('/fields/:id', fieldController.deleteField);

// Rute untuk Manajemen Pemesanan (Booking)
router.post('/bookings', bookingController.createBooking);
router.get('/bookings', bookingController.getAllBookings);
router.get('/bookings/user/:userId', bookingController.getUserBookings);
router.put('/bookings/:id/status', bookingController.updateBookingStatus);
router.delete('/bookings/:id', bookingController.deleteBooking);

// Rute untuk Interaksi Sosial dan Matchmaking (Mabar)
router.get('/matchmakings', socialController.getMatchmakings);
router.post('/matchmakings', socialController.createMatchmaking);
router.put('/matchmakings/:id', socialController.updateMatchmaking);
router.delete('/matchmakings/:id', socialController.deleteMatchmaking);

// Rute untuk Ulasan (Reviews) Lapangan
router.get('/fields/:fieldId/reviews', socialController.getReviewsByField);
router.post('/fields/:fieldId/reviews', socialController.createReview);
router.put('/reviews/:id', socialController.updateReview);
router.delete('/reviews/:id', socialController.deleteReview);

// Mengekspor router agar dapat digunakan pada server.js
export default router;