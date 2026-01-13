// src/modules/library/library.routes.ts

import { Router } from "express";

// Import all subcategory routes
import bookStoreRoutes from "./book-store/bookStore.routes";
// import bookStoreRoutes from '../../modules/library/bookStore/bookStore.routes';
// import islamicbookStoreRoutes from './islamic_book_store/islamicbookStore.routes';
// import childrensbookStoreRoutes from './childrens_book_store/childrensbookStore.routes';
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

// router.use('/bookStore', bookStoreRoutes);
router.use("/academic-book-store", bookStoreRoutes);
// router.use('/islamic-book-store', islamicbookStoreRoutes);
// router.use('/childrens-book-store', childrensbookStoreRoutes);
// router.use('/stationery-store', stationeryStoreRoutes);
// router.use('/office-stationery', officeStationeryRoutes);
// router.use('/art-and-craft-supplies', artAndCraftSuppliesRoutes);
// router.use('/school-supplies-store', schoolSuppliesStoreRoutes);
// router.use('/coaching-center', coachingCenterRoutes);
// router.use('/online-course', onlineCourseRoutes);

export default router;
