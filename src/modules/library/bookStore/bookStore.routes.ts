// src/modules/library/bookStore/bookStore.routes.ts

import { Router } from 'express';
import bookStoreController from './bookStore.controller';

const router = Router();

// ==================== BOOKS ====================

// GET /api/library/book-store/books
router.get('/books', bookStoreController.getAll);

// GET /api/library/book-store/books/latest-editions
router.get('/books/latest-editions', bookStoreController.getLatestEditions);

// GET /api/library/book-store/books/recommendations
router.get('/books/recommendations', bookStoreController.getRecommendations);

// GET /api/library/book-store/books/isbn/:isbn
router.get('/books/isbn/:isbn', bookStoreController.getByISBN);

// GET /api/library/book-store/books/:id
router.get('/books/:id', bookStoreController.getOne);

// POST /api/library/book-store/books
router.post('/books', bookStoreController.create);

// PUT /api/library/book-store/books/:id
router.put('/books/:id', bookStoreController.update);

// PATCH /api/library/book-store/books/:id/status
router.patch('/books/:id/status', bookStoreController.updateStatus);

// DELETE /api/library/book-store/books/:id
router.delete('/books/:id', bookStoreController.delete);

// ==================== INVENTORY ====================

// PATCH /api/library/book-store/inventory/:id
router.patch('/inventory/:id', bookStoreController.updateStock);

// GET /api/library/book-store/inventory/low-stock
router.get('/inventory/low-stock', bookStoreController.getLowStock);

export default router;