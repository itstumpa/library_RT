// src/modules/library/bookStore/bookStore.controller.ts

import { Request, Response } from 'express';
import bookStoreService from './bookStore.service';

class BookStoreController {

  // CREATE BOOK
  async create(req: Request, res: Response) {
    try {
      const book = await bookStoreService.createBook(req.body);
      res.status(201).json({
        success: true,
        message: 'Book created successfully',
        
        data: book,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create book',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET ALL BOOKS
  async getAll(req: Request, res: Response) {
    try {
      const filters = {
        page: req.query.page as string,
        limit: req.query.limit as string,
        search: req.query.search as string,
        status: req.query.status as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        sortBy: req.query.sortBy as string,
        sortOrder: req.query.sortOrder as 'asc' | 'desc',
      };

      const result = await bookStoreService.getAllBooks(filters);
      res.status(200).json({
        success: true,
        message: 'Books fetched successfully',
        count: result.data.length,
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch books',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET BOOK BY ID
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await bookStoreService.getBookById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Book fetched successfully',
        data: book,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch book',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET BOOK BY ISBN
  async getByISBN(req: Request, res: Response) {
    try {
      const { isbn } = req.params;
      const book = await bookStoreService.getBookByISBN(isbn);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Book not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Book fetched successfully',
        data: book,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch book by ISBN',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // UPDATE BOOK
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await bookStoreService.updateBook(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Book updated successfully',
        data: book,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update book',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // UPDATE BOOK STATUS
  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK', 'DISCONTINUED'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value',
        });
      }

      const book = await bookStoreService.updateBookStatus(id, status);
      res.status(200).json({
        success: true,
        message: 'Book status updated successfully',
        data: book,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update',
                error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // DELETE BOOK
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await bookStoreService.deleteBook(id);
      res.status(200).json({
        success: true,
        message: 'Book deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete book',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET LATEST EDITIONS
  async getLatestEditions(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const books = await bookStoreService.getLatestEditions(limit);
      res.status(200).json({
        success: true,
        message: 'Latest editions fetched successfully',
        count: books.length,
        data: books,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch latest editions',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET RECOMMENDATIONS
  async getRecommendations(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const books = await bookStoreService.getRecommendations(limit);
      res.status(200).json({
        success: true,
        message: 'Recommendations fetched successfully',
        count: books.length,
        data: books,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch recommendations',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // UPDATE STOCK
  async updateStock(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity, operation } = req.body;

      if (!['add', 'subtract', 'set'].includes(operation)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid operation. Use: add, subtract, or set',
        });
      }

      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be a positive number',
        });
      }

      const book = await bookStoreService.updateStock(id, quantity, operation);
      res.status(200).json({
        success: true,
        message: 'Stock updated successfully',
        data: book,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update stock',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET LOW STOCK BOOKS
  async getLowStock(req: Request, res: Response) {
    try {
      const threshold = req.query.threshold ? Number(req.query.threshold) : 5;
      const books = await bookStoreService.getLowStockBooks(threshold);
      res.status(200).json({
        success: true,
        message: 'Low stock books fetched successfully',
        count: books.length,
        data: books,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch low stock books',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default new BookStoreController();