const emailAdapter = require('./email.adapter');
const whatsAppAdapter = require('./whatsapp.adapter');

class NotificationService {
  async notifySellerApproval({ email, mobileNumber, businessName, ownerName }) {
    // 1. Email Notification
    await emailAdapter.sendEmail({
      to: email,
      subject: `Store Approved - Welcome to Comzilo, ${businessName}!`,
      body: `Hello ${ownerName},\n\nGreat news! Your store "${businessName}" has been approved by Super Admin. You can now log in to your seller dashboard and start managing your store.`,
    });

    // 2. WhatsApp Notification Architecture
    if (mobileNumber) {
      await whatsAppAdapter.sendWhatsAppMessage({
        to: mobileNumber,
        templateName: 'seller_approval_notification',
        parameters: { businessName, ownerName },
      });
    }
  }

  async notifySellerRejection({ email, mobileNumber, businessName, ownerName, reason }) {
    await emailAdapter.sendEmail({
      to: email,
      subject: `Store Application Update - ${businessName}`,
      body: `Hello ${ownerName},\n\nWe regret to inform you that your application for store "${businessName}" was not approved.\nReason: ${reason || 'Application details did not meet our onboarding criteria.'}`,
    });

    if (mobileNumber) {
      await whatsAppAdapter.sendWhatsAppMessage({
        to: mobileNumber,
        templateName: 'seller_rejection_notification',
        parameters: { businessName, ownerName, reason },
      });
    }
  }

  async sendPasswordResetEmail({ email, resetToken, role }) {
    await emailAdapter.sendEmail({
      to: email,
      subject: 'Password Reset Request - Comzilo Platform',
      body: `You requested a password reset for your ${role} account. Use the token below to reset your password:\n\nToken: ${resetToken}\n\nThis token will expire in 1 hour.`,
    });
  }

  async sendSellerEmailVerification({ email, ownerName, verificationToken }) {
    await emailAdapter.sendEmail({
      to: email,
      subject: 'Verify Your Email - Comzilo Seller Registration',
      body: `Hello ${ownerName},\n\nPlease verify your email address to complete your seller application registration.\n\nVerification Token: ${verificationToken}\n\nThis token expires in 24 hours.`,
    });
  }

  async sendOtp({ mobileNumber, otpCode, channel = 'SMS' }) {
    const otpAdapter = require('./otp.adapter');
    if (channel === 'WHATSAPP') {
      return otpAdapter.sendWhatsAppOtp({ mobileNumber, otpCode });
    }
    return otpAdapter.sendSmsOtp({ mobileNumber, otpCode });
  }
}

module.exports = new NotificationService();
