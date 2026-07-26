const BaseRepository = require('./base.repository');

class ProductRepository extends BaseRepository {
  constructor() {
    super('product');
  }

  async findByStoreAndSku(storeId, sku) {
    return this.model.findFirst({
      where: { storeId, sku },
    });
  }

  async findByStoreAndSlug(storeId, slug) {
    return this.model.findFirst({
      where: { storeId, slug },
    });
  }

  async findByStoreAndId(storeId, id) {
    return this.model.findFirst({
      where: { storeId, id },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
        },
      },
    });
  }

  async findSellerProducts(storeId, { search = '', categoryId = '', status = '', page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;
    const where = { storeId };

    if (status) {
      where.status = status;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { brand: { contains: search } },
      ];
    }

    const [total, products] = await Promise.all([
      this.model.count({ where }),
      this.model.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return { total, products, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findCustomerProducts(storeId, { search = '', categoryId = '', minPrice, maxPrice, featured, sortBy = 'newest', page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;
    const where = {
      storeId,
      status: 'ACTIVE',
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured !== undefined && featured !== null && featured !== '') {
      where.featured = String(featured) === 'true';
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.regularPrice = {};
      if (minPrice !== undefined && minPrice !== '') where.regularPrice.gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') where.regularPrice.lte = Number(maxPrice);
    }

    let orderBy = { createdAt: 'desc' };
    if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sortBy === 'price_asc') {
      orderBy = { regularPrice: 'asc' };
    } else if (sortBy === 'price_desc') {
      orderBy = { regularPrice: 'desc' };
    } else if (sortBy === 'name_asc') {
      orderBy = { name: 'asc' };
    } else if (sortBy === 'name_desc') {
      orderBy = { name: 'desc' };
    }

    const [total, products] = await Promise.all([
      this.model.count({ where }),
      this.model.findMany({
        where,
        include: {
          category: true,
          images: {
            orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }],
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return { total, products, page, limit, totalPages: Math.ceil(total / limit) };
  }
}

module.exports = new ProductRepository();
