const BaseRepository = require('./base.repository');

class CategoryRepository extends BaseRepository {
  constructor() {
    super('category');
  }

  async findByStoreAndSlug(storeId, slug) {
    return this.model.findFirst({
      where: { storeId, slug },
    });
  }

  async findByStoreAndId(storeId, id) {
    return this.model.findFirst({
      where: { storeId, id },
    });
  }

  async findAllByStore(storeId, status = null) {
    const where = { storeId };
    if (status) {
      where.status = status;
    }
    return this.model.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }
}

module.exports = new CategoryRepository();
