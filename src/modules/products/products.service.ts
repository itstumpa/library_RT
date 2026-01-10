// src/modules/products/products.service.ts

import { prisma } from '../../lib/prisma';

class ProductsService {
  
  // Get all products from all subcategories
  async getAllProducts() {
    try {
      // For now, only academic books. Later we'll add more product types
      const academicBooks = await prisma.academicBook.findMany({
        orderBy: { createdAt: 'desc' },
      });

      // Transform to common product format
      const products = academicBooks.map(book => ({
        id: book.id,
        title: book.title,
        price: book.price,
        stock: book.stock,
        category: 'library',
        subcategory: 'academic-book-store',
        type: 'academic-book',
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
      const academicBooks = await prisma.academicBook.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { author: { contains: query, mode: 'insensitive' } },
            { subject: { contains: query, mode: 'insensitive' } },
          ],
        },
      });

      const products = academicBooks.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        stock: book.stock,
        category: 'library',
        subcategory: 'academic-book-store',
        type: 'academic-book',
      }));

      return products;
    } catch (error) {
      throw new Error(`Failed to search products: ${error}`);
    }
  }

  // Get products by category
  async getProductsByCategory(category: string) {
    try {
      if (category === 'library') {
        const academicBooks = await prisma.academicBook.findMany();
        return academicBooks.map(book => ({
          id: book.id,
          title: book.title,
          price: book.price,
          category: 'library',
          subcategory: 'academic-book-store',
        }));
      }

      return [];
    } catch (error) {
      throw new Error(`Failed to fetch products by category: ${error}`);
    }
  }
}

export default new ProductsService();