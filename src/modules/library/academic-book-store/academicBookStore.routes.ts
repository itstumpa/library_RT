// src/modules/library/academicBookStore/academicBookStore.routes.ts

import { Router } from 'express';
import academicBookStoreController from './academicBookStore.controller';

const router = Router();

// GET /api/library/academic-book-store
router.get('/', academicBookStoreController.getAll);

// GET /api/library/academic-book-store/search?subject=Physics
router.get('/search', academicBookStoreController.searchBySubject);

// GET /api/library/academic-book-store/:id
router.get('/:id', academicBookStoreController.getOne);

// POST /api/library/academic-book-store
router.post('/', academicBookStoreController.create);

// PUT /api/library/academic-book-store/:id
router.put('/:id', academicBookStoreController.update);

// DELETE /api/library/academic-book-store/:id
router.delete('/:id', academicBookStoreController.delete);

export default router;