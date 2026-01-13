/*
  Warnings:

  - You are about to drop the column `boardId` on the `academic_books` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `academic_books` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `academic_books` table. All the data in the column will be lost.
  - You are about to drop the column `semesterId` on the `academic_books` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `academic_books` table. All the data in the column will be lost.
  - You are about to drop the column `universityId` on the `academic_books` table. All the data in the column will be lost.
  - You are about to drop the `boards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `book_set_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `book_sets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `classes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `institution_order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `institution_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `semesters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `study_materials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `universities` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "academic_books" DROP CONSTRAINT "academic_books_boardId_fkey";

-- DropForeignKey
ALTER TABLE "academic_books" DROP CONSTRAINT "academic_books_classId_fkey";

-- DropForeignKey
ALTER TABLE "academic_books" DROP CONSTRAINT "academic_books_courseId_fkey";

-- DropForeignKey
ALTER TABLE "academic_books" DROP CONSTRAINT "academic_books_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "academic_books" DROP CONSTRAINT "academic_books_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "academic_books" DROP CONSTRAINT "academic_books_universityId_fkey";

-- DropForeignKey
ALTER TABLE "book_set_items" DROP CONSTRAINT "book_set_items_bookId_fkey";

-- DropForeignKey
ALTER TABLE "book_set_items" DROP CONSTRAINT "book_set_items_bookSetId_fkey";

-- DropForeignKey
ALTER TABLE "book_sets" DROP CONSTRAINT "book_sets_classId_fkey";

-- DropForeignKey
ALTER TABLE "book_sets" DROP CONSTRAINT "book_sets_courseId_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_boardId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_universityId_fkey";

-- DropForeignKey
ALTER TABLE "institution_order_items" DROP CONSTRAINT "institution_order_items_bookId_fkey";

-- DropForeignKey
ALTER TABLE "institution_order_items" DROP CONSTRAINT "institution_order_items_orderId_fkey";

-- DropForeignKey
ALTER TABLE "institution_orders" DROP CONSTRAINT "institution_orders_universityId_fkey";

-- DropForeignKey
ALTER TABLE "semesters" DROP CONSTRAINT "semesters_courseId_fkey";

-- DropIndex
DROP INDEX "academic_books_boardId_idx";

-- DropIndex
DROP INDEX "academic_books_classId_idx";

-- DropIndex
DROP INDEX "academic_books_courseId_idx";

-- DropIndex
DROP INDEX "academic_books_subjectId_idx";

-- DropIndex
DROP INDEX "academic_books_universityId_idx";

-- AlterTable
ALTER TABLE "academic_books" DROP COLUMN "boardId",
DROP COLUMN "classId",
DROP COLUMN "courseId",
DROP COLUMN "semesterId",
DROP COLUMN "subjectId",
DROP COLUMN "universityId";

-- DropTable
DROP TABLE "boards";

-- DropTable
DROP TABLE "book_set_items";

-- DropTable
DROP TABLE "book_sets";

-- DropTable
DROP TABLE "classes";

-- DropTable
DROP TABLE "courses";

-- DropTable
DROP TABLE "institution_order_items";

-- DropTable
DROP TABLE "institution_orders";

-- DropTable
DROP TABLE "semesters";

-- DropTable
DROP TABLE "study_materials";

-- DropTable
DROP TABLE "subjects";

-- DropTable
DROP TABLE "universities";

-- DropEnum
DROP TYPE "BoardType";

-- DropEnum
DROP TYPE "ClassLevel";

-- DropEnum
DROP TYPE "CourseLevel";

-- DropEnum
DROP TYPE "InstitutionOrderStatus";

-- DropEnum
DROP TYPE "MaterialType";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "UniversityType";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
