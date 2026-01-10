// src/modules/library/academicBookStore/academicBookStore.controller.ts

import { Request, Response } from 'express';
import academicBookStoreService from './academicBookStore.service';

class AcademicBookStoreController {

  // CREATE
  async create(req: Request, res: Response) {
    try {
      const book = await academicBookStoreService.createBook(req.body);
      res.status(201).json({
        success: true,
        message: 'Academic book created successfully',
        data: book,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create academic book',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET ALL
  async getAll(req: Request, res: Response) {
    try {
      const books = await academicBookStoreService.getAllBooks();
      res.status(200).json({
        success: true,
        message: 'Academic books fetched successfully',
        count: books.length,
        data: books,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch academic books',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET ONE
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await academicBookStoreService.getBookById(id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Academic book not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Academic book fetched successfully',
        data: book,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch academic book',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // UPDATE
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const book = await academicBookStoreService.updateBook(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Academic book updated successfully',
        data: book,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update academic book',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // DELETE
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await academicBookStoreService.deleteBook(id);
      res.status(200).json({
        success: true,
        message: 'Academic book deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete academic book',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // SEARCH BY SUBJECT
  async searchBySubject(req: Request, res: Response) {
    try {
      const { subject } = req.query;
      if (!subject) {
        return res.status(400).json({
          success: false,
          message: 'Subject parameter is required',
        });
      }

      const books = await academicBookStoreService.searchBySubject(subject as string);
      res.status(200).json({
        success: true,
        message: 'Academic books found',
        count: books.length,
        data: books,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to search academic books',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default new AcademicBookStoreController();