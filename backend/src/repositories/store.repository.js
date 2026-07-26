const BaseRepository = require('./base.repository');

class StoreRepository extends BaseRepository {
  constructor() {
    super('store');
  }

  async findBySlug(slug) {
    return this.model.findUnique({ where: { slug } });
  }

  async findByDomain(domain) {
    return this.model.findUnique({ where: { domain } });
  }

  async findStoresByStatus(status) {
    const whereClause = status ? { status } : {};
    return this.model.findMany({
      where: whereClause,
      include: {
        storeUsers: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                mobileNumber: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new StoreRepository();
