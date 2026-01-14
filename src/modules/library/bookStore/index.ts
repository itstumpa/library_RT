// src/modules/library/academic_book_store/index.ts

// Validators
export * from "./bookStore.validator";

// src/modules/library/bookStore/index.ts

// Service (all functions as namespace)
export * as bookStoreService from "./bookStore.service";

// Controller
export * as bookStoreController from "./bookStore.controller";

// Routes
export { default as bookStoreRoutes } from "./bookStore.routes";