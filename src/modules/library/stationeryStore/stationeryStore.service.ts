// src/modules/library/stationeryStore/stationeryStore.service.ts

import { prisma } from "../../../lib/prisma";

interface StationeryFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface CreateStationeryData {
  title: string;
  sku?: string;
  brand?: string;
  category: string;
  subcategory?: string;
  price: number;
  comparePrice?: number;
  stock: number;
  description?: string;
  coverImage?: string;
  images?: string[];
  weight?: number;
  dimensions?: string;
  color?: string;
  material?: string;
}

class StationeryStoreService {
  // Helper for pagination
  private getPaginationParams(filters: StationeryFilters) {
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
      const existing = await prisma.stationeryStore.findUnique({ where: { slug } });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  // CREATE ITEM
  async createItem(data: CreateStationeryData) {
    try {
      // Check if SKU already exists
      if (data.sku) {
        const existingItem = await prisma.stationeryStore.findUnique({
          where: { sku: data.sku },
        });
        if (existingItem) {
          throw new Error("Item with this SKU already exists");
        }
      }

      // Generate unique slug
      const slug = await this.generateUniqueSlug(data.title);

      const item = await prisma.stationeryStore.create({
        data: {
          ...data,
          slug,
          status: "ACTIVE",
        },
      });

      return item;
    } catch (error) {
      throw new Error(`Failed to create item: ${error}`);
    }
  }

  // GET ALL ITEMS WITH PAGINATION
  async getAllItems(filters: StationeryFilters) {
    try {
      const { page, limit, skip } = this.getPaginationParams(filters);

      // Build where clause
      const where: any = {};

      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: "insensitive" } },
          { brand: { contains: filters.search, mode: "insensitive" } },
          { category: { contains: filters.search, mode: "insensitive" } },
          { sku: { contains: filters.search, mode: "insensitive" } },
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
      const [items, totalItems] = await Promise.all([
        prisma.stationeryStore.findMany({
          where,
          orderBy,
          skip,
          take: limit,
        }),
        prisma.stationeryStore.count({ where }),
      ]);

      return this.createPaginationResult(items, totalItems, page, limit);
    } catch (error) {
      throw new Error(`Failed to fetch items: ${error}`);
    }
  }

  // GET ITEM BY ID
  async getItemById(id: string) {
    try {
      const item = await prisma.stationeryStore.findUnique({
        where: { id },
      });
      return item;
    } catch (error) {
      throw new Error(`Failed to fetch item: ${error}`);
    }
  }

  // GET ITEM BY SKU
  async getItemBySKU(sku: string) {
    try {
      const item = await prisma.stationeryStore.findUnique({
        where: { sku },
      });
      return item;
    } catch (error) {
      throw new Error(`Failed to fetch item by SKU: ${error}`);
    }
  }

  // UPDATE ITEM
  async updateItem(id: string, data: Partial<CreateStationeryData>) {
    try {
      const existingItem = await prisma.stationeryStore.findUnique({ where: { id } });
      if (!existingItem) {
        throw new Error("Item not found");
      }

      // Check SKU uniqueness if being updated
      if (data.sku && data.sku !== existingItem.sku) {
        const skuExists = await prisma.stationeryStore.findUnique({
          where: { sku: data.sku },
        });
        if (skuExists) {
          throw new Error("Item with this SKU already exists");
        }
      }

      // Update slug if title is being updated
      let updateData: Partial<CreateStationeryData> & { slug?: string } = { ...data };
      if (data.title && data.title !== existingItem.title) {
        const slug = await this.generateUniqueSlug(data.title);
        updateData.slug = slug;
      }

      const item = await prisma.stationeryStore.update({
        where: { id },
        data: updateData,
      });

      return item;
    } catch (error) {
      throw new Error(`Failed to update item: ${error}`);
    }
  }

  // UPDATE ITEM STATUS
  async updateItemStatus(
    id: string,
    status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK" | "DISCONTINUED"
  ) {
    try {
      const item = await prisma.stationeryStore.update({
        where: { id },
        data: { status },
      });
      return item;
    } catch (error) {
      throw new Error(`Failed to update item status: ${error}`);
    }
  }

  // DELETE ITEM
  async deleteItem(id: string) {
    try {
      const existingItem = await prisma.stationeryStore.findUnique({ where: { id } });
      if (!existingItem) {
        throw new Error("Item not found");
      }

      await prisma.stationeryStore.delete({ where: { id } });
      return { message: "Item deleted successfully" };
    } catch (error) {
      throw new Error(`Failed to delete item: ${error}`);
    }
  }

  // GET BEST SELLERS
  async getBestSellers(limit: number = 10) {
    try {
      const items = await prisma.stationeryStore.findMany({
        where: {
          isBestSeller: true,
          status: "ACTIVE",
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return items;
    } catch (error) {
      throw new Error(`Failed to fetch best sellers: ${error}`);
    }
  }

  // GET RECOMMENDATIONS
  async getRecommendations(limit: number = 10) {
    try {
      const items = await prisma.stationeryStore.findMany({
        where: {
          isRecommended: true,
          status: "ACTIVE",
        },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return items;
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
      const item = await prisma.stationeryStore.findUnique({ where: { id } });
      if (!item) {
        throw new Error("Item not found");
      }

      let newStock: number;
      switch (operation) {
        case "add":
          newStock = item.stock + quantity;
          break;
        case "subtract":
          newStock = Math.max(0, item.stock - quantity);
          break;
        case "set":
          newStock = Math.max(0, quantity);
          break;
        default:
          throw new Error("Invalid operation");
      }

      // Update item stock
      const updatedItem = await prisma.stationeryStore.update({
        where: { id },
        data: { stock: newStock },
      });

      // Log inventory change
      await prisma.inventoryLog.create({
        data: {
          stationaryId: id,
          type:
            operation === "add"
              ? "PURCHASE"
              : operation === "subtract"
              ? "SALE"
              : "ADJUSTMENT",
          quantity: operation === "subtract" ? -quantity : quantity,
          previousStock: item.stock,
          newStock: newStock,
          reason: `Stock ${operation}`,
        },
      });

      return updatedItem;
    } catch (error) {
      throw new Error(`Failed to update stock: ${error}`);
    }
  }

  // GET LOW STOCK ITEMS
  async getLowStockItems(threshold: number = 5) {
    try {
      const items = await prisma.stationeryStore.findMany({
        where: {
          stock: { lte: threshold },
          status: "ACTIVE",
        },
        orderBy: { stock: "asc" },
      });
      return items;
    } catch (error) {
      throw new Error(`Failed to fetch low stock items: ${error}`);
    }
  }
}

export default new StationeryStoreService();