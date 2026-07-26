const crypto = require('crypto');
const prisma = require('../config/prisma');
const userRepository = require('../repositories/user.repository');
const storeRepository = require('../repositories/store.repository');
const roleRepository = require('../repositories/role.repository');
const { hashPassword, comparePassword } = require('../utils/password');
const tokenService = require('./token.service');
const auditService = require('./audit.service');
const notificationService = require('./notification/notification.service');
const AppError = require('../utils/appError');
const { ROLES } = require('../constants/roles');

class AuthService {
  /**
   * Helper to fetch or initialize Role by name
   */
  async getOrCreateRole(roleName) {
    let role = await roleRepository.findByName(roleName);
    if (!role) {
      role = await prisma.role.create({
        data: { name: roleName, description: `${roleName} role` },
      });
    }
    return role;
  }

  /**
   * Check if account is temporarily locked due to failed attempts
   */
  checkAccountLock(user) {
    if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
      const remainingMins = Math.ceil((new Date(user.lockUntil) - new Date()) / (60 * 1000));
      throw new AppError(`Account is temporarily locked due to consecutive failed login attempts. Try again in ${remainingMins} minute(s).`, 429);
    }
  }

  /**
   * Handle failed login attempt counter and lock triggers
   */
  async handleFailedLogin(user, reqInfo = {}, metadata = {}) {
    if (!user) return;
    const attempts = (user.failedLoginAttempts || 0) + 1;
    let lockUntil = null;
    if (attempts >= 5) {
      lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minute lock
      await auditService.log({
        userId: user.id,
        action: 'ACCOUNT_LOCKED',
        ipAddress: reqInfo.ip,
        userAgent: reqInfo.userAgent,
        metadata: { attempts, lockUntil },
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: attempts,
        lockUntil,
      },
    });
  }

  /**
   * Reset failed login counter on successful authentication
   */
  async resetFailedLogins(user) {
    if (user.failedLoginAttempts > 0 || user.lockUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockUntil: null,
        },
      });
    }
  }

  // ==========================================
  // 1. SUPER ADMIN AUTHENTICATION
  // ==========================================
  async superAdminLogin({ email, password }, reqInfo = {}) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      await auditService.log({
        action: 'FAILED_LOGIN',
        ipAddress: reqInfo.ip,
        userAgent: reqInfo.userAgent,
        metadata: { email, reason: 'User not found' },
      });
      throw new AppError('Invalid email or password', 401);
    }

    this.checkAccountLock(user);

    const hasAdminRole = user.userRoles.some((ur) => ur.role.name === ROLES.SUPER_ADMIN);
    if (!hasAdminRole) {
      await auditService.log({
        userId: user.id,
        action: 'FAILED_LOGIN',
        ipAddress: reqInfo.ip,
        userAgent: reqInfo.userAgent,
        metadata: { email, reason: 'User does not possess SUPER_ADMIN role' },
      });
      throw new AppError('Access denied. Super Admin role required.', 403);
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      await this.handleFailedLogin(user, reqInfo, { email, role: ROLES.SUPER_ADMIN });
      await auditService.log({
        userId: user.id,
        action: 'FAILED_LOGIN',
        ipAddress: reqInfo.ip,
        userAgent: reqInfo.userAgent,
        metadata: { email, reason: 'Invalid password' },
      });
      throw new AppError('Invalid email or password', 401);
    }

    await this.resetFailedLogins(user);

    const tokens = await tokenService.generateTokenPair(user, ROLES.SUPER_ADMIN, null);

    await auditService.log({
      userId: user.id,
      action: 'LOGIN',
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
      metadata: { role: ROLES.SUPER_ADMIN },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: ROLES.SUPER_ADMIN,
      },
      tokens,
    };
  }

  // ==========================================
  // 2. SELLER REGISTRATION & ONBOARDING
  // ==========================================
  async registerSeller(data, reqInfo = {}) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email is already registered', 400);
    }

    // Slug & domain generation
    const slug = data.businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);

    const subdomain = slug;
    const storeUrl = `https://${slug}.comzilo.com`;

    const hashedPassword = await hashPassword(data.password);
    const sellerRole = await this.getOrCreateRole(ROLES.SELLER);

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create Store with status = PENDING, User & domains within transaction
    const result = await prisma.$transaction(async (tx) => {
      const store = await tx.store.create({
        data: {
          name: data.businessName,
          slug,
          subdomain,
          storeUrl,
          status: 'PENDING',
          ownerName: data.ownerName,
          mobileNumber: data.mobileNumber,
          gstNumber: data.gstNumber || null,
          panNumber: data.panNumber || null,
          address: data.address,
        },
      });

      const nameParts = data.ownerName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash: hashedPassword,
          firstName,
          lastName,
          mobileNumber: data.mobileNumber,
          emailVerified: false,
          emailVerificationToken,
          emailVerificationExpires,
        },
      });

      await tx.storeUser.create({
        data: {
          storeId: store.id,
          userId: user.id,
        },
      });

      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: sellerRole.id,
          storeId: store.id,
        },
      });

      return { store, user };
    });

    await auditService.log({
      userId: result.user.id,
      storeId: result.store.id,
      action: 'SELLER_REGISTRATION',
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
      metadata: { businessName: data.businessName, status: 'PENDING' },
    });

    // Send email verification notification
    await notificationService.sendSellerEmailVerification({
      email: data.email,
      ownerName: data.ownerName,
      verificationToken: emailVerificationToken,
    });

    return {
      message: 'Seller registration submitted successfully. Please verify your email address. Your account status is PENDING approval from Super Admin.',
      status: 'PENDING',
      storeId: result.store.id,
      emailVerificationToken,
    };
  }

  async verifySellerEmail(token) {
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new AppError('Invalid or expired email verification token', 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    await auditService.log({
      userId: user.id,
      action: 'EMAIL_VERIFIED',
    });

    return { message: 'Seller email address verified successfully. Awaiting Super Admin approval.' };
  }

  // ==========================================
  // 3. SELLER LOGIN (STATUS CHECK & ACCOUNT LOCKOUT)
  // ==========================================
  async sellerLogin({ email, password }, reqInfo = {}) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      await auditService.log({
        action: 'FAILED_LOGIN',
        ipAddress: reqInfo.ip,
        userAgent: reqInfo.userAgent,
        metadata: { email, role: ROLES.SELLER, reason: 'User not found' },
      });
      throw new AppError('Invalid email or password', 401);
    }

    this.checkAccountLock(user);

    const sellerRoleEntry = user.userRoles.find((ur) => ur.role.name === ROLES.SELLER);
    if (!sellerRoleEntry || !sellerRoleEntry.store) {
      throw new AppError('No seller store associated with this account', 403);
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      await this.handleFailedLogin(user, reqInfo, { email, role: ROLES.SELLER });
      await auditService.log({
        userId: user.id,
        storeId: sellerRoleEntry.storeId,
        action: 'FAILED_LOGIN',
        ipAddress: reqInfo.ip,
        userAgent: reqInfo.userAgent,
        metadata: { email, reason: 'Invalid password' },
      });
      throw new AppError('Invalid email or password', 401);
    }

    await this.resetFailedLogins(user);

    const store = sellerRoleEntry.store;

    // Validate Store Status
    if (store.status === 'PENDING') {
      throw new AppError('Your seller application is currently PENDING approval from Super Admin.', 403);
    }

    if (store.status === 'REJECTED') {
      const reasonMsg = store.rejectionReason ? ` Reason: ${store.rejectionReason}` : '';
      throw new AppError(`Your seller application has been REJECTED by Super Admin.${reasonMsg}`, 403);
    }

    if (store.status === 'SUSPENDED') {
      throw new AppError('Your seller account is SUSPENDED. Please contact platform support.', 403);
    }

    if (store.status !== 'ACTIVE') {
      throw new AppError(`Account inactive (Status: ${store.status})`, 403);
    }

    const tokens = await tokenService.generateTokenPair(user, ROLES.SELLER, store.id);

    await auditService.log({
      userId: user.id,
      storeId: store.id,
      action: 'LOGIN',
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
      metadata: { role: ROLES.SELLER, storeStatus: store.status },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: ROLES.SELLER,
        storeId: store.id,
        storeName: store.name,
      },
      tokens,
    };
  }

  // ==========================================
  // 4. ADMIN PANEL SELLER MANAGEMENT (AUTO-CREATES STORE SETTINGS)
  // ==========================================
  async getSellers(status) {
    return storeRepository.findStoresByStatus(status);
  }

  async approveSeller(storeId, adminId, reqInfo = {}) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        storeUsers: {
          include: { user: true },
        },
      },
    });

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    const ownerUser = store.storeUsers[0]?.user;

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { status: 'ACTIVE', rejectionReason: null },
    });

    // Automatically create StoreSettings for approved seller
    await prisma.storeSettings.upsert({
      where: { storeId },
      update: {},
      create: {
        storeId,
        currency: 'INR',
        language: 'en',
        timezone: 'Asia/Kolkata',
        theme: 'default',
        email: ownerUser?.email || null,
        phone: store.mobileNumber || ownerUser?.mobileNumber || null,
        address: store.address || null,
      },
    });

    await auditService.log({
      userId: adminId,
      storeId,
      action: 'SELLER_APPROVAL',
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
      metadata: { previousStatus: store.status, newStatus: 'ACTIVE', settingsCreated: true },
    });

    if (ownerUser) {
      await notificationService.notifySellerApproval({
        email: ownerUser.email,
        mobileNumber: store.mobileNumber || ownerUser.mobileNumber,
        businessName: store.name,
        ownerName: store.ownerName || `${ownerUser.firstName} ${ownerUser.lastName}`,
      });
    }

    return updatedStore;
  }

  async rejectSeller(storeId, reason, adminId, reqInfo = {}) {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        storeUsers: {
          include: { user: true },
        },
      },
    });

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { status: 'REJECTED', rejectionReason: reason },
    });

    const ownerUser = store.storeUsers[0]?.user;

    await auditService.log({
      userId: adminId,
      storeId,
      action: 'SELLER_REJECTION',
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
      metadata: { reason, previousStatus: store.status, newStatus: 'REJECTED' },
    });

    if (ownerUser) {
      await notificationService.notifySellerRejection({
        email: ownerUser.email,
        mobileNumber: store.mobileNumber || ownerUser.mobileNumber,
        businessName: store.name,
        ownerName: store.ownerName || `${ownerUser.firstName} ${ownerUser.lastName}`,
        reason,
      });
    }

    return updatedStore;
  }

  async suspendSeller(storeId, adminId, reqInfo = {}) {
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { status: 'SUSPENDED' },
    });

    await auditService.log({
      userId: adminId,
      storeId,
      action: 'SELLER_SUSPENDED',
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
      metadata: { newStatus: 'SUSPENDED' },
    });

    return updatedStore;
  }

  async activateSeller(storeId, adminId, reqInfo = {}) {
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { status: 'ACTIVE' },
    });

    await auditService.log({
      userId: adminId,
      storeId,
      action: 'SELLER_ACTIVATED',
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
      metadata: { newStatus: 'ACTIVE' },
    });

    return updatedStore;
  }

  // ==========================================
  // 5. CUSTOMER AUTHENTICATION
  // ==========================================
  async registerCustomer(data, reqInfo = {}) {
    const store = await prisma.store.findUnique({
      where: { id: data.storeId },
    });

    if (!store) {
      throw new AppError('Store not found. Customer must belong to a valid store.', 404);
    }

    if (store.status !== 'ACTIVE') {
      throw new AppError('Cannot register under an inactive store.', 400);
    }

    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      const linkedStore = existingUser.userRoles.find((ur) => ur.storeId === data.storeId);
      if (linkedStore) {
        throw new AppError('Customer already registered with this email for this store', 400);
      }
    }

    const hashedPassword = await hashPassword(data.password);
    const customerRole = await this.getOrCreateRole(ROLES.CUSTOMER);

    const user = await prisma.$transaction(async (tx) => {
      let createdOrFoundUser = existingUser;
      if (!createdOrFoundUser) {
        createdOrFoundUser = await tx.user.create({
          data: {
            email: data.email,
            passwordHash: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName || null,
            mobileNumber: data.mobileNumber || null,
            emailVerified: true,
          },
        });
      }

      await tx.storeUser.create({
        data: {
          storeId: data.storeId,
          userId: createdOrFoundUser.id,
        },
      });

      await tx.userRole.create({
        data: {
          userId: createdOrFoundUser.id,
          roleId: customerRole.id,
          storeId: data.storeId,
        },
      });

      return createdOrFoundUser;
    });

    const tokens = await tokenService.generateTokenPair(user, ROLES.CUSTOMER, store.id);

    await auditService.log({
      userId: user.id,
      storeId: store.id,
      action: 'CUSTOMER_REGISTRATION',
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: ROLES.CUSTOMER,
        storeId: store.id,
      },
      tokens,
    };
  }

  async customerLogin({ email, password, storeId }, reqInfo = {}) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      await auditService.log({
        action: 'FAILED_LOGIN',
        ipAddress: reqInfo.ip,
        userAgent: reqInfo.userAgent,
        metadata: { email, role: ROLES.CUSTOMER, reason: 'User not found' },
      });
      throw new AppError('Invalid email or password', 401);
    }

    this.checkAccountLock(user);

    const customerRoleEntry = user.userRoles.find(
      (ur) => ur.role.name === ROLES.CUSTOMER && (!storeId || ur.storeId === storeId)
    );

    if (!customerRoleEntry) {
      throw new AppError('No customer account found for this store', 403);
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      await this.handleFailedLogin(user, reqInfo, { email, role: ROLES.CUSTOMER });
      await auditService.log({
        userId: user.id,
        storeId: customerRoleEntry.storeId,
        action: 'FAILED_LOGIN',
        ipAddress: reqInfo.ip,
        userAgent: reqInfo.userAgent,
        metadata: { email, reason: 'Invalid password' },
      });
      throw new AppError('Invalid email or password', 401);
    }

    await this.resetFailedLogins(user);

    const targetStoreId = customerRoleEntry.storeId;
    const tokens = await tokenService.generateTokenPair(user, ROLES.CUSTOMER, targetStoreId);

    await auditService.log({
      userId: user.id,
      storeId: targetStoreId,
      action: 'LOGIN',
      ipAddress: reqInfo.ip,
      userAgent: reqInfo.userAgent,
      metadata: { role: ROLES.CUSTOMER },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: ROLES.CUSTOMER,
        storeId: targetStoreId,
      },
      tokens,
    };
  }

  // ==========================================
  // 6. COMMON PASSWORD MANAGEMENT (FORGOT / RESET / CHANGE)
  // ==========================================
  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return { message: 'If an account exists with that email, a password reset token has been generated.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    const primaryRole = user.userRoles[0]?.role?.name || 'USER';
    await notificationService.sendPasswordResetEmail({
      email: user.email,
      resetToken,
      role: primaryRole,
    });

    return { message: 'If an account exists with that email, a password reset token has been generated.', resetToken };
  }

  async resetPassword({ token, newPassword }) {
    const user = await userRepository.findByResetToken(token);
    if (!user) {
      throw new AppError('Invalid or expired password reset token', 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        failedLoginAttempts: 0,
        lockUntil: null,
      },
    });

    await auditService.log({
      userId: user.id,
      action: 'PASSWORD_RESET',
    });

    return { message: 'Password reset successful. You can now login with your new password.' };
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    await auditService.log({
      userId,
      action: 'PASSWORD_CHANGE',
    });

    return { message: 'Password changed successfully.' };
  }

  async logout(refreshToken, userId, reqInfo = {}) {
    await tokenService.revokeToken(refreshToken);
    if (userId) {
      await auditService.log({
        userId,
        action: 'LOGOUT',
        ipAddress: reqInfo.ip,
        userAgent: reqInfo.userAgent,
      });
    }
    return { message: 'Logged out successfully.' };
  }
}

module.exports = new AuthService();
