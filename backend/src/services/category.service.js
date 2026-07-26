const categoryRepository = require('../repositories/category.repository');
const AppError = require('../utils/appError');

class CategoryService {
  generateSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async createCategory(storeId, data) {
    if (!storeId) throw new AppError('Store ID is required for seller operations', 400);

    let slug = data.slug ? this.generateSlug(data.slug) : this.generateSlug(data.name);
    const existing = await categoryRepository.findByStoreAndSlug(storeId, slug);
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    return categoryRepository.create({
      storeId,
      name: data.name,
      slug,
      description: data.description || null,
      image: data.image || null,
      status: data.status || 'ACTIVE',
      sortOrder: data.sortOrder || 0,
    });
  }

  async getCategories(storeId, status = null) {
    if (!storeId) throw new AppError('Store ID is required', 400);
    return categoryRepository.findAllByStore(storeId, status);
  }

  async getCategoryById(storeId, id) {
    if (!storeId) throw new AppError('Store ID is required', 400);
    const category = await categoryRepository.findByStoreAndId(storeId, id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  async updateCategory(storeId, id, data) {
    await this.getCategoryById(storeId, id);

    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    if (data.name) {
      let slug = this.generateSlug(data.name);
      const existing = await categoryRepository.findByStoreAndSlug(storeId, slug);
      if (existing && existing.id !== id) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      updateData.slug = slug;
    }

    return categoryRepository.update(id, updateData);
  }

  async deleteCategory(storeId, id) {
    await this.getCategoryById(storeId, id);
    return categoryRepository.delete(id);
  }

  async getCustomerCategories(storeId) {
    if (!storeId) throw new AppError('Store ID is required', 400);
    return categoryRepository.findAllByStore(storeId, 'ACTIVE');
  }
}

module.exports = new CategoryService();
