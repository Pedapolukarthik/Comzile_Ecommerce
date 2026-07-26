const prisma = require('../config/prisma');
const logger = require('../utils/logger');

class AuditService {
  async log({ userId = null, storeId = null, action, ipAddress = null, userAgent = null, metadata = null }) {
    try {
      const logEntry = await prisma.auditLog.create({
        data: {
          userId,
          storeId,
          action,
          ipAddress,
          userAgent,
          metadata: metadata ? metadata : undefined,
        },
      });
      logger.info(`[AuditLog] ${action}`, { userId, storeId, ipAddress });
      return logEntry;
    } catch (error) {
      logger.error('Failed to create audit log entry', { error: error.message, action, userId });
    }
  }
}

module.exports = new AuditService();
