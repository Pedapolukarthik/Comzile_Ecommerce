const prisma = require('../config/prisma');

class BaseRepository {
  constructor(modelName) {
    this.model = prisma[modelName];
  }

  async findById(id) {
    return this.model.findUnique({ where: { id } });
  }

  async findOne(where) {
    return this.model.findFirst({ where });
  }

  async findMany(where = {}, options = {}) {
    return this.model.findMany({ where, ...options });
  }

  async create(data) {
    return this.model.create({ data });
  }

  async update(id, data) {
    return this.model.update({ where: { id }, data });
  }

  async delete(id) {
    return this.model.delete({ where: { id } });
  }

  async count(where = {}) {
    return this.model.count({ where });
  }
}

module.exports = BaseRepository;
