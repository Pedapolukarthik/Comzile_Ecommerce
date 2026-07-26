const logger = require('../../utils/logger');

class WhatsAppAdapter {
  /**
   * WhatsApp Business API / Twilio WhatsApp Service Architecture
   */
  async sendWhatsAppMessage({ to, templateName, parameters }) {
    logger.info(`[Notification - WHATSAPP] Mobile: ${to} | Template: ${templateName}`);
    logger.info(`[Notification - WHATSAPP Params]: ${JSON.stringify(parameters)}`);
    return { success: true, channel: 'WHATSAPP', recipient: to };
  }
}

module.exports = new WhatsAppAdapter();
