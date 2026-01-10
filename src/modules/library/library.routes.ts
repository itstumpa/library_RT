// src/modules/library/library.routes.ts

import { Router } from 'express';

// Import all subcategory routes
import academicBookStoreRoutes from '../../modules/library/academic-book-store/academicBookStore.routes';
// import bookstoreRoutes from '../../modules/library/bookstore/bookstore.routes';
// import islamicBookStoreRoutes from './islamic_book_store/islamicBookStore.routes';
// import childrensBookStoreRoutes from './childrens_book_store/childrensBookStore.routes';
// import stationeryStoreRoutes from './stationery_store/stationeryStore.routes';
// import officeStationeryRoutes from './office_stationery/officeStationery.routes';
// import artAndCraftSuppliesRoutes from './art_and_craft_supplies/artAndCraftSupplies.routes';
// import schoolSuppliesStoreRoutes from './school_supplies_store/schoolSuppliesStore.routes';
// import coachingCenterRoutes from './coaching_center/coachingCenter.routes';
// import onlineCourseRoutes from './online_course/onlineCourse.routes';

const router = Router();

// ========================
// LIBRARY SUBCATEGORY ROUTES
// ========================

// router.use('/bookstore', bookstoreRoutes);
router.use('/academic-book-store', academicBookStoreRoutes);
// router.use('/islamic-book-store', islamicBookStoreRoutes);
// router.use('/childrens-book-store', childrensBookStoreRoutes);
// router.use('/stationery-store', stationeryStoreRoutes);
// router.use('/office-stationery', officeStationeryRoutes);
// router.use('/art-and-craft-supplies', artAndCraftSuppliesRoutes);
// router.use('/school-supplies-store', schoolSuppliesStoreRoutes);
// router.use('/coaching-center', coachingCenterRoutes);
// router.use('/online-course', onlineCourseRoutes);

export default router;