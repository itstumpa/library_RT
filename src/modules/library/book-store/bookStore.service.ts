// src/modules/library/bookStore/bookStore.service.ts

import { prisma } from "../../../lib/prisma";

// Academic Book Store specific fields
interface AcademicBookData {
  title: string;
  author: string;
  subject: string;
  price: number;
  stock?: number;
  description?: string;
}

interface UpdateAcademicBookData {
  title?: string;
  author?: string;
  subject?: string;
  price?: number;
  stock?: number;
  description?: string;
}

class bookStoreService {
  // CREATE - Add new academic book
  async createBook(data: AcademicBookData) {
    try {
      const book = await prisma.academicBook.create({
        data: {
          title: data.title,
          author: data.author,
          subject: data.subject,
          price: data.price,
          stock: data.stock || 0,
          description: data.description,
        },
      });
      return book;
    } catch (error) {
      throw new Error(`Failed to create academic book: ${error}`);
    }
  }

  // READ - Get all academic books
  async getAllBooks() {
    try {
      const books = await prisma.academicBook.findMany({
        orderBy: { createdAt: "desc" },
      });
      return books;
    } catch (error) {
      throw new Error(`Failed to fetch academic books: ${error}`);
    }
  }

  // READ - Get single academic book by ID
  async getBookById(id: string) {
    try {
      const book = await prisma.academicBook.findUnique({
        where: { id },
      });
      return book;
    } catch (error) {
      throw new Error(`Failed to fetch academic book: ${error}`);
    }
  }

  // UPDATE - Update academic book
  async updateBook(id: string, data: UpdateAcademicBookData) {
    try {
      const book = await prisma.academicBook.update({
        where: { id },
        data,
      });
      return book;
    } catch (error) {
      throw new Error(`Failed to update academic book: ${error}`);
    }
  }

  // DELETE - Delete academic book
  async deleteBook(id: string) {
    try {
      const book = await prisma.academicBook.delete({
        where: { id },
      });
      return book;
    } catch (error) {
      throw new Error(`Failed to delete academic book: ${error}`);
    }
  }

  // SEARCH - Search books by subject
  async searchBySubject(subject: string) {
    try {
      const books = await prisma.academicBook.findMany({
        where: {
          subject: {
            contains: subject,
            mode: "insensitive",
          },
        },
      });
      return books;
    } catch (error) {
      throw new Error(`Failed to search academic books: ${error}`);
    }
  }
}

export default new bookStoreService();
