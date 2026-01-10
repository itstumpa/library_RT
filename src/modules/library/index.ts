// src/modules/library/index.ts

// Export all subcategory modules
// export * from './bookstore';
export * from '../../modules/library/academic-book-store';
// export * from './islamic_book_store';
// export * from './childrens_book_store';
// export * from './stationery_store';
// export * from './office_stationery';
// export * from './art_and_craft_supplies';
// export * from './school_supplies_store';
// export * from './coaching_center';
// export * from './online_course';

// Export aggregated routes
export { default as libraryRoutes } from './library.routes';