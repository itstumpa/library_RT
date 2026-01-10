// src/modules/library/academicBookStore/academicBookStore.routes.ts

import { Router } from 'express';
import academicBookController from './academicBookStore.controller';

const router = Router();

// POST   /api/academic-book-store        → Create book
router.post('/', academicBookController.create);

// GET    /api/academic-book-store        → Get all books
router.get('/', academicBookController.getAll);

// GET    /api/academic-book-store/:id    → Get one book
router.get('/:id', academicBookController.getOne);

// PUT    /api/academic-book-store/:id    → Update book
router.put('/:id', academicBookController.update);

// DELETE /api/academic-book-store/:id    → Delete book
router.delete('/:id', academicBookController.remove);

export default router;