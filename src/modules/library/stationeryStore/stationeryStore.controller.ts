// src/modules/library/stationeryStore/stationeryStore.controller.ts

import { Request, Response } from 'express';
import stationeryStoreService from './stationeryStore.service';

class StationeryStoreController {

  // CREATE ITEM
  async create(req: Request, res: Response) {
    try {
      const item = await stationeryStoreService.createItem(req.body);
      res.status(201).json({
        success: true,
        message: 'Item created successfully',
        data: item,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create item',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET ALL ITEMS
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

      const result = await stationeryStoreService.getAllItems(filters);
      res.status(200).json({
        success: true,
        message: 'Items fetched successfully',
        count: result.data.length,
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch items',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET ITEM BY ID
  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await stationeryStoreService.getItemById(id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Item fetched successfully',
        data: item,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch item',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET ITEM BY SKU
  async getBySKU(req: Request, res: Response) {
    try {
      const { sku } = req.params;
      const item = await stationeryStoreService.getItemBySKU(sku);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Item fetched successfully',
        data: item,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch item by SKU',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // UPDATE ITEM
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await stationeryStoreService.updateItem(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Item updated successfully',
        data: item,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update item',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // UPDATE ITEM STATUS
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

      const item = await stationeryStoreService.updateItemStatus(id, status);
      res.status(200).json({
        success: true,
        message: 'Item status updated successfully',
        data: item,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update status',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // DELETE ITEM
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await stationeryStoreService.deleteItem(id);
      res.status(200).json({
        success: true,
        message: 'Item deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete item',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET BEST SELLERS
  async getBestSellers(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const items = await stationeryStoreService.getBestSellers(limit);
      res.status(200).json({
        success: true,
        message: 'Best sellers fetched successfully',
        count: items.length,
        data: items,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch best sellers',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET RECOMMENDATIONS
  async getRecommendations(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const items = await stationeryStoreService.getRecommendations(limit);
      res.status(200).json({
        success: true,
        message: 'Recommendations fetched successfully',
        count: items.length,
        data: items,
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

      const item = await stationeryStoreService.updateStock(id, quantity, operation);
      res.status(200).json({
        success: true,
        message: 'Stock updated successfully',
        data: item,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update stock',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET LOW STOCK ITEMS
  async getLowStock(req: Request, res: Response) {
    try {
      const threshold = req.query.threshold ? Number(req.query.threshold) : 5;
      const items = await stationeryStoreService.getLowStockItems(threshold);
      res.status(200).json({
        success: true,
        message: 'Low stock items fetched successfully',
        count: items.length,
        data: items,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch low stock items',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default new StationeryStoreController();