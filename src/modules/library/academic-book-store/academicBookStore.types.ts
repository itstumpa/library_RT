// src/modules/library/academic_book_store/academicBookStore.types.ts

import { Book, Category, Author, Publisher } from '@prisma/client';

// ========================
// ENUMS
// ========================
export enum AcademicLevel {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  HIGHER_SECONDARY = 'HIGHER_SECONDARY',
  UNDERGRADUATE = 'UNDERGRADUATE',
  POSTGRADUATE = 'POSTGRADUATE',
  PROFESSIONAL = 'PROFESSIONAL',
}

export enum BookFormat {
  HARDCOVER = 'HARDCOVER',
  PAPERBACK = 'PAPERBACK',
  EBOOK = 'EBOOK',
  AUDIOBOOK = 'AUDIOBOOK',
}

export enum BookCondition {
  NEW = 'NEW',
  LIKE_NEW = 'LIKE_NEW',
  GOOD = 'GOOD',
  ACCEPTABLE = 'ACCEPTABLE',
}

// ========================
// BASE INTERFACES
// ========================
export interface IAcademicBook {
  id: string;
  storeId: string;
  title: string;
  slug: string;
  isbn: string;
  description: string | null;
  authorId: string;
  publisherId: string;
  categoryId: string;
  academicLevel: AcademicLevel;
  subject: string;
  edition: string | null;
  publicationYear: number;
  language: string;
  pages: number | null;
  format: BookFormat;
  condition: BookCondition;
  price: number;
  discountPrice: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  coverImage: string | null;
  images: string[];
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ========================
// REQUEST DTOs
// ========================
export interface ICreateAcademicBookDTO {
  title: string;
  isbn: string;
  description?: string;
  authorId: string;
  publisherId: string;
  categoryId: string;
  academicLevel: AcademicLevel;
  subject: string;
  edition?: string;
  publicationYear: number;
  language: string;
  pages?: number;
  format: BookFormat;
  condition: BookCondition;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  lowStockThreshold?: number;
  coverImage?: string;
  images?: string[];
  tags?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface IUpdateAcademicBookDTO {
  title?: string;
  isbn?: string;
  description?: string;
  authorId?: string;
  publisherId?: string;
  categoryId?: string;
  academicLevel?: AcademicLevel;
  subject?: string;
  edition?: string;
  publicationYear?: number;
  language?: string;
  pages?: number;
  format?: BookFormat;
  condition?: BookCondition;
  price?: number;
  discountPrice?: number | null;
  stockQuantity?: number;
  lowStockThreshold?: number;
  coverImage?: string;
  images?: string[];
  tags?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
}

// ========================
// QUERY INTERFACES
// ========================
export interface IAcademicBookQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  authorId?: string;
  publisherId?: string;
  academicLevel?: AcademicLevel;
  subject?: string;
  minPrice?: number;
  maxPrice?: number;
  format?: BookFormat;
  condition?: BookCondition;
  language?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  sortBy?: 'title' | 'price' | 'createdAt' | 'publicationYear';
  sortOrder?: 'asc' | 'desc';
}

export interface IBulkUpdateDTO {
  ids: string[];
  data: Partial<IUpdateAcademicBookDTO>;
}

export interface IBulkDeleteDTO {
  ids: string[];
}

// ========================
// RESPONSE INTERFACES
// ========================
export interface IAcademicBookWithRelations extends IAcademicBook {
  author: {
    id: string;
    name: string;
  };
  publisher: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
}

export interface IAcademicBookListResponse {
  books: IAcademicBookWithRelations[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface IStockUpdateDTO {
  quantity: number;
  operation: 'add' | 'subtract' | 'set';
}

// ========================
// SERVICE INTERFACE
// ========================
export interface IAcademicBookService {
  create(storeId: string, data: ICreateAcademicBookDTO): Promise<IAcademicBook>;
  findAll(storeId: string, query: IAcademicBookQuery): Promise<IAcademicBookListResponse>;
  findById(storeId: string, id: string): Promise<IAcademicBookWithRelations | null>;
  findBySlug(storeId: string, slug: string): Promise<IAcademicBookWithRelations | null>;
  findByIsbn(storeId: string, isbn: string): Promise<IAcademicBook | null>;
  update(storeId: string, id: string, data: IUpdateAcademicBookDTO): Promise<IAcademicBook>;
  delete(storeId: string, id: string): Promise<void>;
  bulkUpdate(storeId: string, data: IBulkUpdateDTO): Promise<number>;
  bulkDelete(storeId: string, data: IBulkDeleteDTO): Promise<number>;
  updateStock(storeId: string, id: string, data: IStockUpdateDTO): Promise<IAcademicBook>;
  getLowStockBooks(storeId: string): Promise<IAcademicBook[]>;
  getFeaturedBooks(storeId: string, limit?: number): Promise<IAcademicBook[]>;
}