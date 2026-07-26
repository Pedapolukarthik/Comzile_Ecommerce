const BaseRepository = require('./base.repository');

class RoleRepository extends BaseRepository {
  constructor() {
    super('role');
  }

  async findByName(name) {
    return this.model.findUnique({ where: { name } });
  }
}

module.exports = new RoleRepository();
