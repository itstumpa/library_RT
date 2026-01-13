// src/modules/library/bookStore/bookStore.service.ts

import { prisma } from "../../../lib/prisma";

interface BookFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface CreateBookData {
  title: string;
  isbn?: string;
  author: string;
  publisher?: string;
  edition?: string;
  publicationYear?: number;
  pages?: number;
  language?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  description?: string;
  coverImage?: string;
  images?: string[];
  weight?: number;
  dimensions?: string;
}

class BookStoreService {
  // Helper for pagination
  private getPaginationParams(filters: BookFilters) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 10));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
  }

  // Helper for pagination result
  private createPaginationResult(
    data: any[],
    totalItems: number,
    page: number,
    limit: number
  ) {
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data,
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

  // Generate unique slug
  private async generateUniqueSlug(title: string): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.bookStore.findUnique({ where: { slug } });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  // CREATE BOOK
  async createBook(data: CreateBookData) {
    try {
      // Check if ISBN already exists
      if (data.isbn) {
        const existingBook = await prisma.bookStore.findUnique({
          where: { isbn: data.isbn },
        });
        if (existingBook) {
          throw new Error("Book with this ISBN already exists");
        }
      }

      // Generate unique slug
      const slug = await this.generateUniqueSlug(data.title);

      const book = await prisma.bookStore.create({
        data: {
          ...data,
          slug,
          status: "ACTIVE",
        },
      });

      return book;
    } catch (error) {
      throw new Error(`Failed to create book: ${error}`);
    }
  }

  // GET ALL BOOKS WITH PAGINATION
  async getAllBooks(filters: BookFilters) {
    try {
      const { page, limit, skip } = this.getPaginationParams(filters);

      // Build where clause
      const where: any = {};

      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: "insensitive" } },
          { author: { contains: filters.search, mode: "insensitive" } },
          { isbn: { contains: filters.search, mode: "insensitive" } },
          { publisher: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      if (filters.status) where.status = filters.status;

      if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) where.price.gte = filters.minPrice;
        if (filters.maxPrice) where.price.lte = filters.maxPrice;
      }

      // Get sort order
      const orderBy: any = {};
      const sortBy = filters.sortBy || "createdAt";
      const sortOrder = filters.sortOrder || "desc";
      orderBy[sortBy] = sortOrder;

      // Execute queries
      const [books, totalItems] = await Promise.all([
        prisma.bookStore.findMany({
          where,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.bookStore.count({ where }),
      ]);

      return this.createPaginationResult(books, totalItems, page, limit);
    } catch (error) {
      throw new Error(`Failed to fetch books: ${error}`);
    }
  }

  // GET BOOK BY ID
  async getBookById(id: string) {
    try {
      const book = await prisma.bookStore.findUnique({
        where: { id },
      });
      return book;
    } catch (error) {
      throw new Error(`Failed to fetch book: ${error}`);
    }
  }

  // GET BOOK BY ISBN
  async getBookByISBN(isbn: string) {
    try {
      const book = await prisma.bookStore.findUnique({
        where: { isbn },
      });
      return book;
    } catch (error) {
      throw new Error(`Failed to fetch book by ISBN: ${error}`);
    }
  }

  // UPDATE BOOK
  async updateBook(id: string, data: Partial<CreateBookData>) {
    try {
      const existingBook = await prisma.bookStore.findUnique({ where: { id } });
      if (!existingBook) {
        throw new Error("Book not found");
      }

      // Check ISBN uniqueness if being updated
      if (data.isbn && data.isbn !== existingBook.isbn) {
        const isbnExists = await prisma.bookStore.findUnique({
          where: { isbn: data.isbn },
        });
        if (isbnExists) {
          throw new Error("Book with this ISBN already exists");
        }
      }

      // Update slug if title is being updated
      let updateData: Partial<CreateBookData> & { slug?: string } = { ...data };
      if (data.title && data.title !== existingBook.title) {
        // fix me 
        // const slug = await this.generateUniqueSlug(data.title);
        // updateData.slug = slug;
        const slug = await this.generateUniqueSlug(data.title);
        updateData.slug = slug;
      }

      const book = await prisma.bookStore.update({
        where: { id },
        data: updateData,
      });

      return book;
    } catch (error) {
      throw new Error(`Failed to update book: ${error}`);
    }
  }

  // UPDATE BOOK STATUS
  async updateBookStatus(
    id: string,
    status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "DISCONTINUED"
  ) {
    try {
      const book = await prisma.bookStore.update({
        where: { id },
        data: { status },
      });
      return book;
    } catch (error) {
      throw new Error(`Failed to update book status: ${error}`);
    }
  }

  // DELETE BOOK
  async deleteBook(id: string) {
    try {
      const existingBook = await prisma.bookStore.findUnique({ where: { id } });
      if (!existingBook) {
        throw new Error("Book not found");
      }

      await prisma.bookStore.delete({ where: { id } });
      return { message: "Book deleted successfully" };
    } catch (error) {
      throw new Error(`Failed to delete book: ${error}`);
    }
  }

  // GET LATEST EDITIONS
  async getLatestEditions(limit: number = 20) {
    try {
      const books = await prisma.bookStore.findMany({
        where: {
          isLatestEdition: true,
          status: "ACTIVE",
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return books;
    } catch (error) {
      throw new Error(`Failed to fetch latest editions: ${error}`);
    }
  }

  // GET RECOMMENDATIONS
  async getRecommendations(limit: number = 10) {
    try {
      const books = await prisma.bookStore.findMany({
        where: {
          isRecommended: true,
          status: "ACTIVE",
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return books;
    } catch (error) {
      throw new Error(`Failed to fetch recommendations: ${error}`);
    }
  }

  // UPDATE STOCK
  async updateStock(
    id: string,
    quantity: number,
    operation: "add" | "subtract" | "set"
  ) {
    try {
      const book = await prisma.bookStore.findUnique({ where: { id } });
      if (!book) {
        throw new Error("Book not found");
      }

      let newStock: number;
      switch (operation) {
        case "add":
          newStock = book.stock + quantity;
          break;
        case "subtract":
          newStock = Math.max(0, book.stock - quantity);
          break;
        case "set":
          newStock = Math.max(0, quantity);
          break;
        default:
          throw new Error("Invalid operation");
      }

      // Update book stock
      const updatedBook = await prisma.bookStore.update({
        where: { id },
        data: { stock: newStock },
      });

      // Log inventory change
      await prisma.inventoryLog.create({
        data: {
          bookId: id,
          type:
            operation === "add"
              ? "PURCHASE"
              : operation === "subtract"
              ? "SALE"
              : "ADJUSTMENT",
          quantity: operation === "subtract" ? -quantity : quantity,
          previousStock: book.stock,
          newStock: newStock,
          reason: `Stock ${operation}`,
        },
      });

      return updatedBook;
    } catch (error) {
      throw new Error(`Failed to update stock: ${error}`);
    }
  }

  // GET LOW STOCK BOOKS
  async getLowStockBooks(threshold: number = 5) {
    try {
      const books = await prisma.bookStore.findMany({
        where: {
          stock: { lte: threshold },
          status: "ACTIVE",
        },
        orderBy: { stock: "asc" },
      });
      return books;
    } catch (error) {
      throw new Error(`Failed to fetch low stock books: ${error}`);
    }
  }
}

export default new BookStoreService();
