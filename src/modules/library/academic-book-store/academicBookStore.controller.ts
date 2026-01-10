// src/modules/library/academicBookStore/academicBookStore.controller.ts

import { Request, Response } from 'express';
import academicBookService from './academicBookStore.service';

// CREATE
const create = async (req: Request, res: Response) => {
  try {
    const book = await academicBookService.createBook(req.body);
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create book',
      error: error,
    });
  }
};

// GET ALL
const getAll = async (req: Request, res: Response) => {
  try {
    const books = await academicBookService.getAllBooks();
    res.status(200).json({
      success: true,
      message: 'Books fetched successfully',
      data: books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch books',
      error: error,
    });
  }
};

// GET ONE
const getOne = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await academicBookService.getBookById(id);

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
      error: error,
    });
  }
};

// UPDATE
const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await academicBookService.updateBook(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update book',
      error: error,
    });
  }
};

// DELETE
const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await academicBookService.deleteBook(id);
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
      error: error,
    });
  }
};

export default {
  create,
  getAll,
  getOne,
  update,
  remove,
};