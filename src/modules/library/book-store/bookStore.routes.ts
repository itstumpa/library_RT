// src/modules/library/bookStore/bookStore.routes.ts

import { Router } from "express";
import bookStoreController from "./bookStore.controller";

const router = Router();

// GET /api/library/academic-book-store
router.get("/", bookStoreController.getAll);

// GET /api/library/academic-book-store/search?subject=Physics
router.get("/search", bookStoreController.searchBySubject);

// GET /api/library/academic-book-store/:id
router.get("/:id", bookStoreController.getOne);

// POST /api/library/academic-book-store
router.post("/", bookStoreController.create);

// PUT /api/library/academic-book-store/:id
router.put("/:id", bookStoreController.update);

// DELETE /api/library/academic-book-store/:id
router.delete("/:id", bookStoreController.delete);

export default router;
