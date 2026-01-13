// src/modules/products/products.service.ts

import { prisma } from "../../lib/prisma";

class ProductsService {
  // Get all products from all subcategories
  async getAllProducts() {
    try {
      const books = await prisma.bookStore.findMany({
        orderBy: { createdAt: "desc" },
      });

      const products = books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        stock: book.stock,
        category: "library",
        subcategory: "book-store",
        type: "book",
        status: book.status,
        createdAt: book.createdAt,
      }));

      return products;
    } catch (error) {
      throw new Error(`Failed to fetch all products: ${error}`);
    }
  }

  // Search products across all subcategories
  async searchProducts(query: string) {
    try {
      const books = await prisma.bookStore.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { author: { contains: query, mode: "insensitive" } },
            { publisher: { contains: query, mode: "insensitive" } },
            { isbn: { contains: query, mode: "insensitive" } },
          ],
        },
      });

      const products = books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        stock: book.stock,
        category: "library",
        subcategory: "book-store",
        type: "book",
        status: book.status,
      }));

      return products;
    } catch (error) {
      throw new Error(`Failed to search products: ${error}`);
    }
  }

  // Get products by category
  async getProductsByCategory(category: string) {
    try {
      if (category === "library") {
        const books = await prisma.bookStore.findMany();
        return books.map((book) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          price: book.price,
          stock: book.stock,
          category: "library",
          subcategory: "book-store",
          status: book.status,
        }));
      }

      return [];
    } catch (error) {
      throw new Error(`Failed to fetch products by category: ${error}`);
    }
  }
}

export default new ProductsService();