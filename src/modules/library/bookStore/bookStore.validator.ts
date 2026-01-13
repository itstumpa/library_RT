// src/modules/library/academic_book_store/bookStore.validator.ts

import { z } from "zod";
import { AcademicLevel, BookCondition, BookFormat } from "./bookStore.types";

// ========================
// ENUMS FOR ZOD
// ========================
const academicLevelEnum = z.nativeEnum(AcademicLevel);
const bookFormatEnum = z.nativeEnum(BookFormat);
const bookConditionEnum = z.nativeEnum(BookCondition);

// ========================
// BASE SCHEMAS
// ========================
const isbnSchema = z
  .string()
  .regex(/^(?:\d{10}|\d{13})$/, "ISBN must be 10 or 13 digits");

const priceSchema = z
  .number()
  .positive("Price must be positive")
  .multipleOf(0.01, "Price can have max 2 decimal places");

const yearSchema = z
  .number()
  .int()
  .min(1800, "Year must be after 1800")
  .max(new Date().getFullYear() + 1, "Year cannot be in the future");

// ========================
// CREATE SCHEMA
// ========================
export const createbookstoreSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .min(1, "Title is required")
        .max(255, "Title must be less than 255 characters")
        .trim(),

      isbn: isbnSchema,

      description: z
        .string()
        .max(5000, "Description must be less than 5000 characters")
        .optional(),

      authorId: z.string().uuid("Invalid author ID"),

      publisherId: z.string().uuid("Invalid publisher ID"),

      categoryId: z.string().uuid("Invalid category ID"),

      academicLevel: academicLevelEnum,

      subject: z
        .string()
        .min(1, "Subject is required")
        .max(100, "Subject must be less than 100 characters"),

      edition: z
        .string()
        .max(50, "Edition must be less than 50 characters")
        .optional(),

      publicationYear: yearSchema,

      language: z
        .string()
        .min(2, "Language is required")
        .max(50, "Language must be less than 50 characters")
        .default("English"),

      pages: z.number().int().positive("Pages must be positive").optional(),

      format: bookFormatEnum,

      condition: bookConditionEnum.default(BookCondition.NEW),

      price: priceSchema,

      discountPrice: priceSchema.optional(),

      stockQuantity: z
        .number()
        .int()
        .min(0, "Stock quantity cannot be negative")
        .default(0),

      lowStockThreshold: z
        .number()
        .int()
        .min(0, "Low stock threshold cannot be negative")
        .default(5),

      coverImage: z.string().url("Invalid cover image URL").optional(),

      images: z
        .array(z.string().url("Invalid image URL"))
        .max(10, "Maximum 10 images allowed")
        .optional(),

      tags: z
        .array(z.string().max(50))
        .max(20, "Maximum 20 tags allowed")
        .optional(),

      isFeatured: z.boolean().default(false),

      isActive: z.boolean().default(true),
    })
    .refine((data) => !data.discountPrice || data.discountPrice < data.price, {
      message: "Discount price must be less than regular price",
      path: ["discountPrice"],
    }),
});

// ========================
// UPDATE SCHEMA
// ========================
export const updatebookstoreSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid book ID"),
  }),

  body: z
    .object({
      title: z
        .string()
        .min(1, "Title is required")
        .max(255, "Title must be less than 255 characters")
        .trim()
        .optional(),

      isbn: isbnSchema.optional(),

      description: z
        .string()
        .max(5000, "Description must be less than 5000 characters")
        .nullable()
        .optional(),

      authorId: z.string().uuid("Invalid author ID").optional(),

      publisherId: z.string().uuid("Invalid publisher ID").optional(),

      categoryId: z.string().uuid("Invalid category ID").optional(),

      academicLevel: academicLevelEnum.optional(),

      subject: z
        .string()
        .min(1, "Subject is required")
        .max(100, "Subject must be less than 100 characters")
        .optional(),

      edition: z
        .string()
        .max(50, "Edition must be less than 50 characters")
        .nullable()
        .optional(),

      publicationYear: yearSchema.optional(),

      language: z
        .string()
        .min(2, "Language is required")
        .max(50, "Language must be less than 50 characters")
        .optional(),

      pages: z
        .number()
        .int()
        .positive("Pages must be positive")
        .nullable()
        .optional(),

      format: bookFormatEnum.optional(),

      condition: bookConditionEnum.optional(),

      price: priceSchema.optional(),

      discountPrice: priceSchema.nullable().optional(),

      stockQuantity: z
        .number()
        .int()
        .min(0, "Stock quantity cannot be negative")
        .optional(),

      lowStockThreshold: z
        .number()
        .int()
        .min(0, "Low stock threshold cannot be negative")
        .optional(),

      coverImage: z
        .string()
        .url("Invalid cover image URL")
        .nullable()
        .optional(),

      images: z
        .array(z.string().url("Invalid image URL"))
        .max(10, "Maximum 10 images allowed")
        .optional(),

      tags: z
        .array(z.string().max(50))
        .max(20, "Maximum 20 tags allowed")
        .optional(),

      isFeatured: z.boolean().optional(),

      isActive: z.boolean().optional(),
    })
    .refine(
      (data) => {
        if (data.discountPrice !== undefined && data.price !== undefined) {
          return data.discountPrice === null || data.discountPrice < data.price;
        }
        return true;
      },
      {
        message: "Discount price must be less than regular price",
        path: ["discountPrice"],
      }
    ),
});

// ========================
// QUERY SCHEMA
// ========================
export const querybookstoreSchema = z.object({
  query: z.object({
    page: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().int().positive())
      .optional()
      .default("1"),

    limit: z
      .string()
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().int().positive().max(100))
      .optional()
      .default("10"),

    search: z.string().max(100).optional(),

    categoryId: z.string().uuid("Invalid category ID").optional(),

    authorId: z.string().uuid("Invalid author ID").optional(),

    publisherId: z.string().uuid("Invalid publisher ID").optional(),

    academicLevel: academicLevelEnum.optional(),

    subject: z.string().max(100).optional(),

    minPrice: z
      .string()
      .transform((val) => parseFloat(val))
      .pipe(z.number().positive())
      .optional(),

    maxPrice: z
      .string()
      .transform((val) => parseFloat(val))
      .pipe(z.number().positive())
      .optional(),

    format: bookFormatEnum.optional(),

    condition: bookConditionEnum.optional(),

    language: z.string().max(50).optional(),

    isFeatured: z
      .string()
      .transform((val) => val === "true")
      .optional(),

    isActive: z
      .string()
      .transform((val) => val === "true")
      .optional(),

    sortBy: z
      .enum(["title", "price", "createdAt", "publicationYear"])
      .optional()
      .default("createdAt"),

    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

// ========================
// PARAMS SCHEMA
// ========================
export const paramIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid book ID"),
  }),
});

export const paramSlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug is required").max(300, "Slug too long"),
  }),
});

// ========================
// BULK OPERATIONS SCHEMA
// ========================
export const bulkUpdateSchema = z.object({
  body: z.object({
    ids: z
      .array(z.string().uuid("Invalid book ID"))
      .min(1, "At least one ID is required")
      .max(100, "Maximum 100 items allowed"),

    data: z.object({
      isActive: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      categoryId: z.string().uuid("Invalid category ID").optional(),
      discountPrice: priceSchema.nullable().optional(),
    }),
  }),
});

export const bulkDeleteSchema = z.object({
  body: z.object({
    ids: z
      .array(z.string().uuid("Invalid book ID"))
      .min(1, "At least one ID is required")
      .max(100, "Maximum 100 items allowed"),
  }),
});

// ========================
// STOCK UPDATE SCHEMA
// ========================
export const stockUpdateSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid book ID"),
  }),

  body: z.object({
    quantity: z.number().int().min(0, "Quantity cannot be negative"),

    operation: z.enum(["add", "subtract", "set"], {
      errorMap: () => ({ message: "Operation must be add, subtract, or set" }),
    }),
  }),
});

// ========================
// TYPE EXPORTS
// ========================
export type CreatebookstoreInput = z.infer<typeof createbookstoreSchema>;
export type UpdatebookstoreInput = z.infer<typeof updatebookstoreSchema>;
export type QuerybookstoreInput = z.infer<typeof querybookstoreSchema>;
export type BulkUpdateInput = z.infer<typeof bulkUpdateSchema>;
export type BulkDeleteInput = z.infer<typeof bulkDeleteSchema>;
export type StockUpdateInput = z.infer<typeof stockUpdateSchema>;
