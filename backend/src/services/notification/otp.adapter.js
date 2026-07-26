const logger = require('../../utils/logger');

class OtpAdapter {
  /**
   * Send SMS OTP (Pluggable provider: Twilio, MSG91, AWS SNS)
   */
  async sendSmsOtp({ mobileNumber, otpCode }) {
    logger.info(`[OTP Adapter - SMS] Mobile: ${mobileNumber} | OTP Code: ${otpCode}`);
    return { success: true, channel: 'SMS', mobileNumber };
  }

  /**
   * Send WhatsApp OTP (Pluggable provider: Twilio, Meta Graph API)
   */
  async sendWhatsAppOtp({ mobileNumber, otpCode }) {
    logger.info(`[OTP Adapter - WHATSAPP] Mobile: ${mobileNumber} | OTP Code: ${otpCode}`);
    return { success: true, channel: 'WHATSAPP', mobileNumber };
  }
}

module.exports = new OtpAdapter();
