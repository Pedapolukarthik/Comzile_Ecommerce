const userRepository = require('../../repositories/user.repository');

class AuthRepository {
  async findUserByEmail(email) {
    return userRepository.findByEmail(email);
  }

  async findUserById(userId) {
    return userRepository.findWithRolesAndStores(userId);
  }
}

module.exports = new AuthRepository();
