// src/modules/library/academic_book_store/academicBookStore.routes.ts

import { Router } from 'express';
import { academicBookStoreController } from './academicBookStore.controller';
import { authMiddleware } from '../../../shared/middlewares/auth.middleware';
import { roleMiddleware } from '../../../shared/middlewares/role.middleware';
import { validateMiddleware } from '../../../shared/middlewares/validate.middleware';
import { Roles } from '../../../shared/constants/roles.constant';
import {
  createAcademicBookSchema,
  updateAcademicBookSchema,
  queryAcademicBookSchema,
  paramIdSchema,
  paramSlugSchema,
  bulkUpdateSchema,
  bulkDeleteSchema,
  stockUpdateSchema,
} from './academicBookStore.validator';

const router = Router();

// ========================
// PUBLIC ROUTES
// ========================

/**
 * @route   GET /api/v1/library/academic-book-store
 * @desc    Get all academic books with filtering & pagination
 * @access  Public
 */
router.get(
  '/',
  validateMiddleware(queryAcademicBookSchema),
  academicBookStoreController.findAll
);

/**
 * @route   GET /api/v1/library/academic-book-store/featured
 * @desc    Get featured academic books
 * @access  Public
 */
router.get(
  '/featured',
  academicBookStoreController.getFeatured
);

/**
 * @route   GET /api/v1/library/academic-book-store/slug/:slug
 * @desc    Get academic book by slug
 * @access  Public
 */
router.get(
  '/slug/:slug',
  validateMiddleware(paramSlugSchema),
  academicBookStoreController.findBySlug
);

/**
 * @route   GET /api/v1/library/academic-book-store/:id
 * @desc    Get academic book by ID
 * @access  Public
 */
router.get(
  '/:id',
  validateMiddleware(paramIdSchema),
  academicBookStoreController.findById
);

// ========================
// PROTECTED ROUTES (VENDOR/ADMIN)
// ========================

/**
 * @route   POST /api/v1/library/academic-book-store
 * @desc    Create a new academic book
 * @access  Private (Vendor, Admin)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware([Roles.VENDOR, Roles.ADMIN]),
  validateMiddleware(createAcademicBookSchema),
  academicBookStoreController.create
);

/**
 * @route   PUT /api/v1/library/academic-book-store/:id
 * @desc    Update an academic book
 * @access  Private (Vendor, Admin)
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware([Roles.VENDOR, Roles.ADMIN]),
  validateMiddleware(updateAcademicBookSchema),
  academicBookStoreController.update
);

/**
 * @route   DELETE /api/v1/library/academic-book-store/:id
 * @desc    Delete an academic book (soft delete)
 * @access  Private (Vendor, Admin)
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([Roles.VENDOR, Roles.ADMIN]),
  validateMiddleware(paramIdSchema),
  academicBookStoreController.delete
);

/**
 * @route   PUT /api/v1/library/academic-book-store/bulk/update
 * @desc    Bulk update academic books
 * @access  Private (Vendor, Admin)
 */
router.put(
  '/bulk/update',
  authMiddleware,
  roleMiddleware([Roles.VENDOR, Roles.ADMIN]),
  validateMiddleware(bulkUpdateSchema),
  academicBookStoreController.bulkUpdate
);

/**
 * @route   DELETE /api/v1/library/academic-book-store/bulk/delete
 * @desc    Bulk delete academic books
 * @access  Private (Vendor, Admin)
 */
router.delete(
  '/bulk/delete',
  authMiddleware,
  roleMiddleware([Roles.VENDOR, Roles.ADMIN]),
  validateMiddleware(bulkDeleteSchema),
  academicBookStoreController.bulkDelete
);

/**
 * @route   PATCH /api/v1/library/academic-book-store/:id/stock
 * @desc    Update book stock
 * @access  Private (Vendor, Admin)
 */
router.patch(
  '/:id/stock',
  authMiddleware,
  roleMiddleware([Roles.VENDOR, Roles.ADMIN]),
  validateMiddleware(stockUpdateSchema),
  academicBookStoreController.updateStock
);

/**
 * @route   GET /api/v1/library/academic-book-store/inventory/low-stock
 * @desc    Get low stock books
 * @access  Private (Vendor, Admin)
 */
router.get(
  '/inventory/low-stock',
  authMiddleware,
  roleMiddleware([Roles.VENDOR, Roles.ADMIN]),
  academicBookStoreController.getLowStock
);

export default router;