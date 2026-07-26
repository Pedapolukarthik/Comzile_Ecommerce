const prisma = require('../config/prisma');
const productRepository = require('../repositories/product.repository');
const categoryRepository = require('../repositories/category.repository');
const AppError = require('../utils/appError');

class ProductService {
  generateSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async createProduct(storeId, data) {
    if (!storeId) throw new AppError('Store ID is required for seller operations', 400);

    // Validate SKU uniqueness within seller's store
    const existingSku = await productRepository.findByStoreAndSku(storeId, data.sku);
    if (existingSku) {
      throw new AppError(`A product with SKU '${data.sku}' already exists in your store`, 400);
    }

    // Validate category if supplied
    if (data.categoryId) {
      const category = await categoryRepository.findByStoreAndId(storeId, data.categoryId);
      if (!category) {
        throw new AppError('Invalid category ID for this store', 400);
      }
    }

    let slug = this.generateSlug(data.name);
    const existingSlug = await productRepository.findByStoreAndSlug(storeId, slug);
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const regularPrice = Number(data.regularPrice);
    const salePrice = data.salePrice !== undefined && data.salePrice !== null ? Number(data.salePrice) : null;
    const stockQuantity = Number(data.stockQuantity);

    // Determine initial status based on stock
    let status = data.status || 'ACTIVE';
    if (stockQuantity === 0 && status === 'ACTIVE') {
      status = 'OUT_OF_STOCK';
    }

    return prisma.product.create({
      data: {
        storeId,
        categoryId: data.categoryId || null,
        name: data.name,
        slug,
        sku: data.sku,
        shortDescription: data.shortDescription || null,
        description: data.description || null,
        brand: data.brand || null,
        regularPrice,
        salePrice,
        stockQuantity,
        lowStockThreshold: data.lowStockThreshold ? Number(data.lowStockThreshold) : 5,
        weight: data.weight ? Number(data.weight) : null,
        dimensions: data.dimensions || null,
        status,
        featured: Boolean(data.featured),
      },
      include: {
        category: true,
        images: true,
      },
    });
  }

  async getSellerProducts(storeId, query = {}) {
    if (!storeId) throw new AppError('Store ID is required', 400);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    return productRepository.findSellerProducts(storeId, {
      search: query.search || '',
      categoryId: query.categoryId || '',
      status: query.status || '',
      page,
      limit,
    });
  }

  async getProductById(storeId, id) {
    if (!storeId) throw new AppError('Store ID is required', 400);
    const product = await productRepository.findByStoreAndId(storeId, id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async updateProduct(storeId, id, data) {
    const existing = await this.getProductById(storeId, id);

    if (data.sku && data.sku !== existing.sku) {
      const existingSku = await productRepository.findByStoreAndSku(storeId, data.sku);
      if (existingSku) {
        throw new AppError(`A product with SKU '${data.sku}' already exists in your store`, 400);
      }
    }

    if (data.categoryId) {
      const category = await categoryRepository.findByStoreAndId(storeId, data.categoryId);
      if (!category) {
        throw new AppError('Invalid category ID for this store', 400);
      }
    }

    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.sku) updateData.sku = data.sku;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId || null;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.regularPrice !== undefined) updateData.regularPrice = Number(data.regularPrice);
    if (data.salePrice !== undefined) updateData.salePrice = data.salePrice !== null ? Number(data.salePrice) : null;
    if (data.stockQuantity !== undefined) updateData.stockQuantity = Number(data.stockQuantity);
    if (data.lowStockThreshold !== undefined) updateData.lowStockThreshold = Number(data.lowStockThreshold);
    if (data.weight !== undefined) updateData.weight = data.weight !== null ? Number(data.weight) : null;
    if (data.dimensions !== undefined) updateData.dimensions = data.dimensions;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.featured !== undefined) updateData.featured = Boolean(data.featured);

    if (data.name && data.name !== existing.name) {
      let slug = this.generateSlug(data.name);
      const existingSlug = await productRepository.findByStoreAndSlug(storeId, slug);
      if (existingSlug && existingSlug.id !== id) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      updateData.slug = slug;
    }

    // Auto-update status if stock drops to 0
    if (updateData.stockQuantity === 0 && (!data.status || data.status === 'ACTIVE')) {
      updateData.status = 'OUT_OF_STOCK';
    } else if (updateData.stockQuantity > 0 && existing.status === 'OUT_OF_STOCK') {
      updateData.status = 'ACTIVE';
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true, images: true },
    });
  }

  async deleteProduct(storeId, id) {
    await this.getProductById(storeId, id);
    return prisma.product.delete({ where: { id } });
  }

  async updateStock(storeId, id, stockQuantity) {
    const existing = await this.getProductById(storeId, id);
    const qty = Number(stockQuantity);

    let status = existing.status;
    if (qty === 0 && status === 'ACTIVE') {
      status = 'OUT_OF_STOCK';
    } else if (qty > 0 && status === 'OUT_OF_STOCK') {
      status = 'ACTIVE';
    }

    return prisma.product.update({
      where: { id },
      data: {
        stockQuantity: qty,
        status,
      },
      include: { category: true, images: true },
    });
  }

  async addProductImage(storeId, productId, imageUrl, isPrimary = false) {
    const product = await this.getProductById(storeId, productId);

    const hasImages = product.images.length > 0;
    const shouldBePrimary = isPrimary || !hasImages;

    if (shouldBePrimary) {
      // Unset previous primary image
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      });
    }

    const image = await prisma.productImage.create({
      data: {
        productId,
        imageUrl,
        isPrimary: shouldBePrimary,
        sortOrder: product.images.length,
      },
    });

    return image;
  }

  async deleteProductImage(storeId, productId, imageId) {
    await this.getProductById(storeId, productId);
    const image = await prisma.productImage.findFirst({
      where: { id: imageId, productId },
    });

    if (!image) {
      throw new AppError('Image not found for this product', 404);
    }

    await prisma.productImage.delete({ where: { id: imageId } });

    // If deleted image was primary, set new primary image
    if (image.isPrimary) {
      const nextImage = await prisma.productImage.findFirst({
        where: { productId },
        orderBy: { createdAt: 'asc' },
      });

      if (nextImage) {
        await prisma.productImage.update({
          where: { id: nextImage.id },
          data: { isPrimary: true },
        });
      }
    }

    return { message: 'Image deleted successfully' };
  }

  async getCustomerProducts(storeId, query = {}) {
    if (!storeId) throw new AppError('Store ID is required', 400);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    return productRepository.findCustomerProducts(storeId, {
      search: query.search || '',
      categoryId: query.categoryId || '',
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      featured: query.featured,
      sortBy: query.sortBy || 'newest',
      page,
      limit,
    });
  }

  async getCustomerProductById(storeId, id) {
    if (!storeId) throw new AppError('Store ID is required', 400);
    const product = await productRepository.findByStoreAndId(storeId, id);
    if (!product || product.status !== 'ACTIVE') {
      throw new AppError('Product not found or currently unavailable', 404);
    }
    return product;
  }
}

module.exports = new ProductService();
