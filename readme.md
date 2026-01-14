git branch -vv

git checkout Tumpa
git push -u origin Tumpa

git checkout Dev
git push -u origin Dev

npx prisma generate
npx tsx src/script.ts
npx tsx scripts/seed.ts
npx prisma validate
npx prisma migrate dev --name init_category
npm install @prisma/adapter-pg pg

# Generate Prisma Client

npx prisma generate

# Create migration

npx prisma migrate dev --name init

# Apply migrations in production

npx prisma migrate deploy

# Push schema changes (development only)

npx prisma db push

# Reset database

npx prisma migrate reset

# Open Prisma Studio

npx prisma studio

# Seed database

npx ts-node prisma/seeds/index.ts

## api_endpoints_bookStore

/api/v1/library/book-store/books ← All books with pagination
/api/v1/library/book-store/books/:id ← Single book
/api/v1/library/book-store/books/isbn/:isbn ← Book by ISBN
/api/v1/library/book-store/books/latest-editions ← Latest editions
/api/v1/library/book-store/books/recommendations ← Recommended books
/api/v1/library/book-store/inventory/:id ← Update stock
/api/v1/library/book-store/inventory/low-stock ← Low stock alerts

## api_endpoints_stationery

router.get('/items', stationeryStoreController.getAll);
router.get('/items/latest-editions', stationeryStoreController.getLatestEditions);
router.get('/items/recommendations', stationeryStoreController.getRecommendations);
router.get('/items/isbn/:isbn', stationeryStoreController.getByISBN); // Will work as SKU
router.get('/items/:id', stationeryStoreController.getOne);
router.post('/items', stationeryStoreController.create);
router.put('/items/:id', stationeryStoreController.update);
router.patch('/items/:id/status', stationeryStoreController.updateStatus);
router.delete('/items/:id', stationeryStoreController.delete);
router.patch('/inventory/:id', stationeryStoreController.updateStock);
router.get('/inventory/low-stock', stationeryStoreController.getLowStock);

/_ eslint-disable @typescript-eslint/no-explicit-any _/
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";

type AsyncHandler = (req:Request, res:Response, next:NextFunction)=>Promise<void>;
export const catchAsync = (fn:AsyncHandler)=>
(req:Request, res:Response, next:NextFunction)=>{
Promise.resolve(fn(req,res,next)).catch((error:any)=>{
if(envVars.NODE_ENV === "development"){
console.log(error);
}
next(error);
});
};
