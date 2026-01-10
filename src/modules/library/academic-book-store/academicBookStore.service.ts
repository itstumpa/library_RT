// src/modules/library/academic_book_store/academicBookStore.service.ts

import { Prisma } from '@prisma/client';
import prisma from '../../../prisma/client';
import { ApiError } from '../../../shared/utils/apiError.util';
import { generateSlug } from '../../../shared/utils/slug.util';
import { HttpStatus } from '../../../shared/constants/httpStatus.constant';
import {
  IAcademicBook,
  IAcademicBookWithRelations,
  IAcademicBookListResponse,
  ICreateAcademicBookDTO,
  IUpdateAcademicBookDTO,
  IAcademicBookQuery,
  IBulkUpdateDTO,
  IBulkDeleteDTO,
  IStockUpdateDTO,
  IAcademicBookService,
} from './academicBookStore.types';

class AcademicBookStoreService implements IAcademicBookService {
  
  // ========================
  // PRIVATE HELPERS
  // ========================
  
  private readonly defaultSelect = {
    id: true,
    storeId: true,
    title: true,
    slug: true,
    isbn: true,
    description: true,
    authorId: true,
    publisherId: true,
    categoryId: true,
    academicLevel: true,
    subject: true,
    edition: true,
    publicationYear: true,
    language: true,
    pages: true,
    format: true,
    condition: true,
    price: true,
    discountPrice: true,
    stockQuantity: true,
    lowStockThreshold: true,
    coverImage: true,
    images: true,
    tags: true,
    isFeatured: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  private readonly selectWithRelations = {
    ...this.defaultSelect,
    author: {
      select: {
        id: true,
        name: true,
      },
    },
    publisher: {
      select: {
        id: true,
        name: true,
      },
    },
    category: {
      select: {
        id: true,
        name: true,
      },
    },
  };

  private buildWhereClause(
    storeId: string,
    query: IAcademicBookQuery
  ): Prisma.AcademicBookWhereInput {
    const where: Prisma.AcademicBookWhereInput = {
      storeId,
      deletedAt: null, // Soft delete filter
    };

    // Search filter
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { isbn: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { author: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    // Category filter
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    // Author filter
    if (query.authorId) {
      where.authorId = query.authorId;
    }

    // Publisher filter
    if (query.publisherId) {
      where.publisherId = query.publisherId;
    }

    // Academic level filter
    if (query.academicLevel) {
      where.academicLevel = query.academicLevel;
    }

    // Subject filter
    if (query.subject) {
      where.subject = { contains: query.subject, mode: 'insensitive' };
    }

    // Price range filter
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) {
        where.price.gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        where.price.lte = query.maxPrice;
      }
    }

    // Format filter
    if (query.format) {
      where.format = query.format;
    }

    // Condition filter
    if (query.condition) {
      where.condition = query.condition;
    }

    // Language filter
    if (query.language) {
      where.language = { equals: query.language, mode: 'insensitive' };
    }

    // Featured filter
    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured;
    }

    // Active filter
    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    return where;
  }

  private buildOrderByClause(
    query: IAcademicBookQuery
  ): Prisma.AcademicBookOrderByWithRelationInput {
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    return { [sortBy]: sortOrder };
  }

  // ========================
  // CREATE
  // ========================
  
  async create(
    storeId: string,
    data: ICreateAcademicBookDTO
  ): Promise<IAcademicBook> {
    // Check if ISBN already exists in this store
    const existingBook = await prisma.academicBook.findFirst({
      where: {
        storeId,
        isbn: data.isbn,
        deletedAt: null,
      },
    });

    if (existingBook) {
      throw new ApiError(
        HttpStatus.CONFLICT,
        `Book with ISBN ${data.isbn} already exists`
      );
    }

    // Validate author exists
    const author = await prisma.author.findUnique({
      where: { id: data.authorId },
    });

    if (!author) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Author not found');
    }

    // Validate publisher exists
    const publisher = await prisma.publisher.findUnique({
      where: { id: data.publisherId },
    });

    if (!publisher) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Publisher not found');
    }

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Category not found');
    }

    // Generate unique slug
    let slug = generateSlug(data.title);
    let slugExists = await prisma.academicBook.findFirst({
      where: { storeId, slug },
    });

    let counter = 1;
    while (slugExists) {
      slug = `${generateSlug(data.title)}-${counter}`;
      slugExists = await prisma.academicBook.findFirst({
        where: { storeId, slug },
      });
      counter++;
    }

    // Create the book
    const book = await prisma.academicBook.create({
      data: {
        storeId,
        slug,
        title: data.title,
        isbn: data.isbn,
        description: data.description,
        authorId: data.authorId,
        publisherId: data.publisherId,
        categoryId: data.categoryId,
        academicLevel: data.academicLevel,
        subject: data.subject,
        edition: data.edition,
        publicationYear: data.publicationYear,
        language: data.language,
        pages: data.pages,
        format: data.format,
        condition: data.condition || 'NEW',
        price: data.price,
        discountPrice: data.discountPrice,
        stockQuantity: data.stockQuantity || 0,
        lowStockThreshold: data.lowStockThreshold || 5,
        coverImage: data.coverImage,
        images: data.images || [],
        tags: data.tags || [],
        isFeatured: data.isFeatured || false,
        isActive: data.isActive ?? true,
      },
      select: this.defaultSelect,
    });

    return book as IAcademicBook;
  }

  // ========================
  // READ - LIST
  // ========================
  
  async findAll(
    storeId: string,
    query: IAcademicBookQuery
  ): Promise<IAcademicBookListResponse> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(storeId, query);
    const orderBy = this.buildOrderByClause(query);

    // Execute both queries in parallel
    const [books, totalItems] = await Promise.all([
      prisma.academicBook.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: this.selectWithRelations,
      }),
      prisma.academicBook.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      books: books as IAcademicBookWithRelations[],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // ========================
  // READ - SINGLE BY ID
  // ========================
  
  async findById(
    storeId: string,
    id: string
  ): Promise<IAcademicBookWithRelations | null> {
    const book = await prisma.academicBook.findFirst({
      where: {
        id,
        storeId,
        deletedAt: null,
      },
      select: this.selectWithRelations,
    });

    return book as IAcademicBookWithRelations | null;
  }

  // ========================
  // READ - SINGLE BY SLUG
  // ========================
  
  async findBySlug(
    storeId: string,
    slug: string
  ): Promise<IAcademicBookWithRelations | null> {
    const book = await prisma.academicBook.findFirst({
      where: {
        slug,
        storeId,
        deletedAt: null,
      },
      select: this.selectWithRelations,
    });

    return book as IAcademicBookWithRelations | null;
  }

  // ========================
  // READ - SINGLE BY ISBN
  // ========================
  
  async findByIsbn(
    storeId: string,
    isbn: string
  ): Promise<IAcademicBook | null> {
    const book = await prisma.academicBook.findFirst({
      where: {
        isbn,
        storeId,
        deletedAt: null,
      },
      select: this.defaultSelect,
    });

    return book as IAcademicBook | null;
  }

  // ========================
  // UPDATE
  // ========================
  
  async update(
    storeId: string,
    id: string,
    data: IUpdateAcademicBookDTO
  ): Promise<IAcademicBook> {
    // Check if book exists
    const existingBook = await prisma.academicBook.findFirst({
      where: {
        id,
        storeId,
        deletedAt: null,
      },
    });

    if (!existingBook) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Book not found');
    }

    // If ISBN is being updated, check for duplicates
    if (data.isbn && data.isbn !== existingBook.isbn) {
      const isbnExists = await prisma.academicBook.findFirst({
        where: {
          storeId,
          isbn: data.isbn,
          id: { not: id },
          deletedAt: null,
        },
      });

      if (isbnExists) {
        throw new ApiError(
          HttpStatus.CONFLICT,
          `Book with ISBN ${data.isbn} already exists`
        );
      }
    }

    // If title is being updated, regenerate slug
    let slug = existingBook.slug;
    if (data.title && data.title !== existingBook.title) {
      slug = generateSlug(data.title);
      let slugExists = await prisma.academicBook.findFirst({
        where: { storeId, slug, id: { not: id } },
      });

      let counter = 1;
      while (slugExists) {
        slug = `${generateSlug(data.title)}-${counter}`;
        slugExists = await prisma.academicBook.findFirst({
          where: { storeId, slug, id: { not: id } },
        });
        counter++;
      }
    }

    // Validate relations if being updated
    if (data.authorId) {
      const author = await prisma.author.findUnique({
        where: { id: data.authorId },
      });
      if (!author) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Author not found');
      }
    }

    if (data.publisherId) {
      const publisher = await prisma.publisher.findUnique({
        where: { id: data.publisherId },
      });
      if (!publisher) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Publisher not found');
      }
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Category not found');
      }
    }

    // Update the book
    const updatedBook = await prisma.academicBook.update({
      where: { id },
      data: {
        ...data,
        slug,
        updatedAt: new Date(),
      },
      select: this.defaultSelect,
    });

    return updatedBook as IAcademicBook;
  }

  // ========================
  // DELETE (SOFT)
  // ========================
  
  async delete(storeId: string, id: string): Promise<void> {
    const book = await prisma.academicBook.findFirst({
      where: {
        id,
        storeId,
        deletedAt: null,
      },
    });

    if (!book) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Book not found');
    }

    // Soft delete
    await prisma.academicBook.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  // ========================
  // BULK UPDATE
  // ========================
  
  async bulkUpdate(storeId: string, data: IBulkUpdateDTO): Promise<number> {
    // Verify all books belong to the store
    const books = await prisma.academicBook.findMany({
      where: {
        id: { in: data.ids },
        storeId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (books.length !== data.ids.length) {
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        'Some books were not found or do not belong to this store'
      );
    }

    const result = await prisma.academicBook.updateMany({
      where: {
        id: { in: data.ids },
        storeId,
        deletedAt: null,
      },
      data: {
        ...data.data,
        updatedAt: new Date(),
      },
    });

    return result.count;
  }

  // ========================
  // BULK DELETE
  // ========================
  
  async bulkDelete(storeId: string, data: IBulkDeleteDTO): Promise<number> {
    // Verify all books belong to the store
    const books = await prisma.academicBook.findMany({
      where: {
        id: { in: data.ids },
        storeId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (books.length !== data.ids.length) {
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        'Some books were not found or do not belong to this store'
      );
    }

    // Soft delete all
    const result = await prisma.academicBook.updateMany({
      where: {
        id: { in: data.ids },
        storeId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });

    return result.count;
  }

  // ========================
  // STOCK MANAGEMENT
  // ========================
  
  async updateStock(
    storeId: string,
    id: string,
    data: IStockUpdateDTO
  ): Promise<IAcademicBook> {
    const book = await prisma.academicBook.findFirst({
      where: {
        id,
        storeId,
        deletedAt: null,
      },
    });

    if (!book) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Book not found');
    }

    let newQuantity: number;

    switch (data.operation) {
      case 'add':
        newQuantity = book.stockQuantity + data.quantity;
        break;
      case 'subtract':
        newQuantity = book.stockQuantity - data.quantity;
        if (newQuantity < 0) {
          throw new ApiError(
            HttpStatus.BAD_REQUEST,
            'Insufficient stock. Cannot reduce below 0'
          );
        }
        break;
      case 'set':
        newQuantity = data.quantity;
        break;
      default:
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid operation');
    }

    const updatedBook = await prisma.academicBook.update({
      where: { id },
      data: {
        stockQuantity: newQuantity,
        updatedAt: new Date(),
      },
      select: this.defaultSelect,
    });

    return updatedBook as IAcademicBook;
  }

  // ========================
  // LOW STOCK BOOKS
  // ========================
  
  async getLowStockBooks(storeId: string): Promise<IAcademicBook[]> {
    const books = await prisma.academicBook.findMany({
      where: {
        storeId,
        deletedAt: null,
        isActive: true,
        stockQuantity: {
          lte: prisma.academicBook.fields.lowStockThreshold,
        },
      },
      orderBy: { stockQuantity: 'asc' },
      select: this.defaultSelect,
    });

    // Note: The above Prisma query comparing two columns requires raw query
    // Here's the alternative approach:
    const allBooks = await prisma.academicBook.findMany({
      where: {
        storeId,
        deletedAt: null,
        isActive: true,
      },
      select: this.defaultSelect,
    });

    const lowStockBooks = allBooks.filter(
      (book) => book.stockQuantity <= book.lowStockThreshold
    );

    return lowStockBooks as IAcademicBook[];
  }

  // ========================
  // FEATURED BOOKS
  // ========================
  
  async getFeaturedBooks(
    storeId: string,
    limit: number = 10
  ): Promise<IAcademicBook[]> {
    const books = await prisma.academicBook.findMany({
      where: {
        storeId,
        deletedAt: null,
        isActive: true,
        isFeatured: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: this.defaultSelect,
    });

    return books as IAcademicBook[];
  }
}

// Export singleton instance
export const academicBookStoreService = new AcademicBookStoreService();
export default academicBookStoreService;