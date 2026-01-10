// src/modules/products/products.controller.ts

import { Request, Response } from 'express';
import productsService from './products.service';

class ProductsController {

  // GET ALL PRODUCTS
  async getAll(req: Request, res: Response) {
    try {
      const products = await productsService.getAllProducts();
      res.status(200).json({
        success: true,
        message: 'All products fetched successfully',
        count: products.length,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // SEARCH PRODUCTS
  async search(req: Request, res: Response) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query (q) is required',
        });
      }

      const products = await productsService.searchProducts(q as string);
      res.status(200).json({
        success: true,
        message: 'Products search completed',
        count: products.length,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to search products',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET PRODUCTS BY CATEGORY
  async getByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const products = await productsService.getProductsByCategory(category);
      res.status(200).json({
        success: true,
        message: `Products from ${category} category`,
        count: products.length,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products by category',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default new ProductsController();