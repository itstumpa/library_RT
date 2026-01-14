// src/modules/library/bookStore/bookStore.routes.ts

import { Router } from "express";
import { bookStoreController } from "./bookStore.controller";

const router = Router();

// ==================== BOOKS ====================

// GET /api/v1/library/book-store/books
// router.get('/books', bookStoreController.getAll);
router.get("/books", bookStoreController.getAll);

// GET /api/v1/library/book-store/books/latest-editions
router.get("/books/latest-editions", bookStoreController.getLatestEditions);

// GET /api/v1/library/book-store/books/recommendations
router.get("/books/recommendations", bookStoreController.getRecommendations);

// GET /api/v1/library/book-store/books/isbn/:isbn
router.get("/books/isbn/:isbn", bookStoreController.getByISBN);

// GET /api/v1/library/book-store/books/:id
router.get("/books/:id", bookStoreController.getOne);

// POST /api/v1/library/book-store/books
router.post("/books", bookStoreController.create);

// PUT /api/v1/library/book-store/books/:id
router.put("/books/:id", bookStoreController.update);

// PATCH /api/v1/library/book-store/books/:id/status
router.patch("/books/:id/status", bookStoreController.updateStatus);

// DELETE /api/v1/library/book-store/books/:id
router.delete("/books/:id", bookStoreController.deleteBook);

// ==================== INVENTORY ====================

// PATCH /api/v1/library/book-store/inventory/:id
router.patch("/inventory/:id", bookStoreController.updateStock);

// GET /api/v1/library/book-store/inventory/low-stock
router.get("/inventory/low-stock", bookStoreController.getLowStock);

export default router;
