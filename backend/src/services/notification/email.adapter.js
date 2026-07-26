const logger = require('../../utils/logger');

class EmailAdapter {
  async sendEmail({ to, subject, body, html }) {
    // In production, integrate with Nodemailer / AWS SES / SendGrid
    logger.info(`[Notification - EMAIL] To: ${to} | Subject: ${subject}`);
    logger.info(`[Notification - EMAIL Content]: ${body || html}`);
    return { success: true, channel: 'EMAIL', recipient: to };
  }
}

module.exports = new EmailAdapter();
