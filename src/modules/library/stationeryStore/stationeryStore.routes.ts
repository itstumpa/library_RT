// src/modules/library/bookStore/bookStore.routes.ts

import { Router } from 'express';
import stationeryStoreController from './stationeryStore.controller';

const router = Router();

// ==================== BOOKS ====================

// GET /api/library/book-store/books
router.get('/books', stationeryStoreController.getAll);

// GET /api/library/book-store/books/latest-editions
router.get('/books/latest-editions', stationeryStoreController.getLatestEditions);

// GET /api/library/book-store/books/recommendations
router.get('/books/recommendations', stationeryStoreController.getRecommendations);

// GET /api/library/book-store/books/isbn/:isbn
router.get('/books/isbn/:isbn', stationeryStoreController.getByISBN);

// GET /api/library/book-store/books/:id
router.get('/books/:id', stationeryStoreController.getOne);

// POST /api/library/book-store/books
router.post('/books', stationeryStoreController.create);

// PUT /api/library/book-store/books/:id
router.put('/books/:id', stationeryStoreController.update);

// PATCH /api/library/book-store/books/:id/status
router.patch('/books/:id/status', stationeryStoreController.updateStatus);

// DELETE /api/library/book-store/books/:id
router.delete('/books/:id', stationeryStoreController.delete);

// ==================== INVENTORY ====================

// PATCH /api/library/book-store/inventory/:id
router.patch('/inventory/:id', stationeryStoreController.updateStock);

// GET /api/library/book-store/inventory/low-stock
router.get('/inventory/low-stock', stationeryStoreController.getLowStock);

export default router;