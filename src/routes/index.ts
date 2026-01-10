// src/routes/index.ts

import { Router } from 'express';

// Core module routes
// import authRoutes from '../modules/auth/auth.routes';
// import usersRoutes from '../modules/users/users.routes';
// import vendorsRoutes from '../modules/vendors/vendors.routes';
// import storesRoutes from '../modules/stores/stores.routes';
// import categoriesRoutes from '../modules/categories/categories.routes';
// import adminDashboardRoutes from '../modules/adminDashboard/adminDashboard.routes';

// Category routes
import libraryRoutes from '../modules/library/library.routes';
import productsRoutes from '../modules/products/products.routes';
// import officeAndBusinessRoutes from '../modules/office_and_business/officeAndBusiness.routes';

const router = Router();

// ========================
// API VERSION 1
// ========================

// Core routes
// router.use('/auth', authRoutes);
// router.use('/users', usersRoutes);
// router.use('/vendors', vendorsRoutes);
// router.use('/stores', storesRoutes);
// router.use('/categories', categoriesRoutes);
// router.use('/admin', adminDashboardRoutes);

// Category routes
router.use('/library', libraryRoutes);
router.use('/products', productsRoutes);
// router.use('/office-and-business', officeAndBusinessRoutes);
// ... add more categories as you create them

export default router;