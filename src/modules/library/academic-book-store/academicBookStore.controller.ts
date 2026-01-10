// src/modules/library/academic_book_store/academicBookStore.controller.ts

import { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler.util';
import { ApiResponse } from '../../../shared/utils/apiResponse.util';
import { ApiError } from '../../../shared/utils/apiError.util';
import { HttpStatus } from '../../../shared/constants/httpStatus.constant';
import { academicBookStoreService } from './academicBookStore.service';
import {
  ICreateAcademicBookDTO,
  IUpdateAcademicBookDTO,
  IAcademicBookQuery,
  IBulkUpdateDTO,
  IBulkDeleteDTO,
  IStockUpdateDTO,
} from './academicBookStore.types';

class AcademicBookStoreController {
  
  // ========================
  // CREATE BOOK
  // ========================
  
  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const storeId = req.params.storeId || req.user?.storeId;
    
    if (!storeId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Store ID is required');
    }

    const bookData: ICreateAcademicBookDTO = req.body;

    const book = await academicBookStoreService.create(storeId, bookData);

    res.status(HttpStatus.CREATED).json(
      ApiResponse.success(
        book,
        'Book created successfully',
        HttpStatus.CREATED
      )
    );
  });

  // ========================
  // GET ALL BOOKS
  // ========================
  
  findAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const storeId = req.params.storeId || req.user?.storeId;
    
    if (!storeId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Store ID is required');
    }

    const query: IAcademicBookQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      categoryId: req.query.categoryId as string,
      authorId: req.query.authorId as string,
      publisherId: req.query.publisherId as string,
      academicLevel: req.query.academicLevel as any,
      subject: req.query.subject as string,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      format: req.query.format as any,
      condition: req.query.condition as any,
      language: req.query.language as string,
      isFeatured: req.query.isFeatured === 'true' ? true : req.query.isFeatured === 'false' ? false : undefined,
      isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
      sortBy: req.query.sortBy as any,
      sortOrder: req.query.sortOrder as any,
    };

    const result = await academicBookStoreService.findAll(storeId, query);

    res.status(HttpStatus.OK).json(
      ApiResponse.success(
        result,
        'Books retrieved successfully',
        HttpStatus.OK
      )
    );
  });

  // ========================
  // GET SINGLE BOOK BY ID
  // ========================
  
  findById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const storeId = req.params.storeId || req.user?.storeId;
    const { id } = req.params;
    
    if (!storeId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Store ID is required');
    }

    const book = await academicBookStoreService.findById(storeId, id);

    if (!book) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Book not found');
    }

    res.status(HttpStatus.OK).json(
      ApiResponse.success(
        book,
        'Book retrieved successfully',
        HttpStatus.OK
      )
    );
  });

  // ========================
  // GET SINGLE BOOK BY SLUG
  // ========================
  
  findBySlug = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const storeId = req.params.storeId || req.user?.storeId;
    const { slug } = req.params;
    
    if (!storeId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Store ID is required');
    }

    const book = await academicBookStoreService.findBySlug(storeId, slug);

    if (!book) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Book not found');
    }

    res.status(HttpStatus.OK).json(
      ApiResponse.success(
        book,
        'Book retrieved successfully',
        HttpStatus.OK
      )
    );
  });

  // ========================
  // UPDATE BOOK
  // ========================
  
  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const storeId = req.params.storeId || req.user?.storeId;
    const { id } = req.params;
    
    if (!storeId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Store ID is required');
    }

    const updateData: IUpdateAcademicBookDTO = req.body;

    const book = await academicBookStoreService.update(storeId, id, updateData);

    res.status(HttpStatus.OK).json(
      ApiResponse.success(
        book,
        'Book updated successfully',
        HttpStatus.OK
      )
    );
  });

  // ========================
  // DELETE BOOK
  // ========================
  
  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const storeId = req.params.storeId || req.user?.storeId;
    const { id } = req.params;
    
    if (!storeId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Store ID is required');
    }

    await academicBookStoreService.delete(storeId, id);

    res.status(HttpStatus.OK).json(
      ApiResponse.success(
        null,
        'Book deleted successfully',
        HttpStatus.OK
      )
    );
  });

  // ========================
  // BULK UPDATE
  // ========================
  
  bulkUpdate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const storeId = req.params.storeId || req.user?.storeId;
    
    if (!storeId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Store ID is required');
    }

    const bulkData: IBulkUpdateDTO = req.body;

    const count = await academicBookStoreService.bulkUpdate(storeId, bulkData);

    res.status(HttpStatus.OK).json(
      ApiResponse.success(
        { updatedCount: count },
        `${count} books updated successfully`,
        HttpStatus.OK
      )
    );
  });

  // ========================
  // BULK DELETE
  // ========================
  
  bulkDelete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const storeId = req.params.storeId || req.user?.storeId;
    
    if (!storeId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Store ID is required');
    }

    const bulkData: IBulkDeleteDTO = req.body;

    const count = await academicBookStoreService.bulkDelete(storeId, bulkData);

    res.status(HttpStatus.OK).json(
      ApiResponse.success(
        { deletedCount: count },
        `${count} books deleted successfully`,
        HttpStatus.OK
      )
    );
  });

  // ========================
  // UPDATE STOCK
  // ========================
  
  updateStock = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const storeId = req.params.storeId || req.user?.storeId;
    const { id } = req.params;
    
    if (!storeId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Store ID is required');
    }

    const stockData: IStockUpdateDTO = req.body;

    const book = await academicBookStoreService.updateStock(storeId, id, stockData);

    res.status(HttpStatus.OK).json(
      ApiResponse.success(
        book,
        'Stock updated successfully',
        HttpStatus.OK
      )
    );
  });

  // ========================
  // GET LOW STOCK BOOKS
  // ========================
  
  getLowStock = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const storeId = req.params.storeId || req.user?.storeId;
    
    if (!storeId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Store ID is required');
    }

    const books = await academicBookStoreService.getLowStockBooks(storeId);

    res.status(HttpStatus.OK).json(
      ApiResponse.success(
        { books, count: books.length },
        'Low stock books retrieved successfully',
        HttpStatus.OK
      )
    );
  });

  // ========================
  // GET FEATURED BOOKS
  // ========================
  
  getFeatured = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const storeId = req.params.storeId || req.user?.storeId;
    const limit = parseInt(req.query.limit as string) || 10;
    
    if (!storeId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Store ID is required');
    }

    const books = await academicBookStoreService.getFeaturedBooks(storeId, limit);

    res.status(HttpStatus.OK).json(
      ApiResponse.success(
        { books, count: books.length },
        'Featured books retrieved successfully',
        HttpStatus.OK
      )
    );
  });
}

// Export singleton instance
export const academicBookStoreController = new AcademicBookStoreController();
export default academicBookStoreController;