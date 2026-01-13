// src/modules/library/stationeryStore/stationeryStore.routes.ts

import { Router } from 'express';
import stationeryStoreController from './stationeryStore.controller';

const router = Router();

// ==================== STATIONERY ITEMS ====================

// GET /api/library/stationery-store/items
router.get('/items', stationeryStoreController.getAll);

// GET /api/library/stationery-store/items/best-sellers
router.get('/items/best-sellers', stationeryStoreController.getBestSellers);

// GET /api/library/stationery-store/items/recommendations
router.get('/items/recommendations', stationeryStoreController.getRecommendations);

// GET /api/library/stationery-store/items/sku/:sku
router.get('/items/sku/:sku', stationeryStoreController.getBySKU);

// GET /api/library/stationery-store/items/:id
router.get('/items/:id', stationeryStoreController.getOne);

// POST /api/library/stationery-store/items
router.post('/items', stationeryStoreController.create);

// PUT /api/library/stationery-store/items/:id
router.put('/items/:id', stationeryStoreController.update);

// PATCH /api/library/stationery-store/items/:id/status
router.patch('/items/:id/status', stationeryStoreController.updateStatus);

// DELETE /api/library/stationery-store/items/:id
router.delete('/items/:id', stationeryStoreController.delete);

// ==================== INVENTORY ====================

// PATCH /api/library/stationery-store/inventory/:id
router.patch('/inventory/:id', stationeryStoreController.updateStock);

// GET /api/library/stationery-store/inventory/low-stock
router.get('/inventory/low-stock', stationeryStoreController.getLowStock);

export default router;