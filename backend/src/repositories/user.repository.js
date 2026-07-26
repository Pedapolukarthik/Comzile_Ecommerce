const BaseRepository = require('./base.repository');

class UserRepository extends BaseRepository {
  constructor() {
    super('user');
  }

  async findByEmail(email) {
    return this.model.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
            store: true,
          },
        },
      },
    });
  }

  async findWithRolesAndStores(userId) {
    return this.model.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        userRoles: {
          select: {
            storeId: true,
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findByResetToken(token) {
    return this.model.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
      include: {
        userRoles: {
          include: {
            role: true,
            store: true,
          },
        },
      },
    });
  }
}

module.exports = new UserRepository();
