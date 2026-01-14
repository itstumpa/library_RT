// src/modules/products/products.routes.ts

import { Router } from "express";
import productsController from "./products.controller";

const router = Router();

// GET /api/v1/products
router.get("/", productsController.getAll);

// GET /api/v1/products/search?q=physics
router.get("/search", productsController.search);

// GET /api/v1/products/category/:category
router.get("/category/:category", productsController.getByCategory);

export default router;
