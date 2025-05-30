import { ConflictException } from '@nestjs/common';

export async function sendEMail(token: string, mail: string) {
  try {
    const link = `${process.env.FE_URL}/auth/verify-email/${token}`;
    const message = `
            <div style="font-family: 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f9; border: 1px solid #ddd; border-radius: 8px;">
                <div style="text-align: center;">
                    <h2 style="color: #3f51b5;">Verify Your Email Address</h2>
                    <p style="font-size: 16px; color: #333;">
                        Click the button below to verify your email address and complete your registration.
                    </p>
                    <a href="${link}" style="display: inline-block; margin-top: 15px; padding: 12px 25px; background-color: #3f51b5; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px;">Verify Email</a>
                </div>
                <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                    If you did not request this, please ignore this email.
                </p>
            </div>
        `;
    await this.mailService.sendMail({
      to: mail,
      subject: `Verify your email address`,
      html: message,
    });
  } catch (error) {
    console.error(`Failed to send verification email to ${mail}:`, error);
    throw new ConflictException(
      'Failed to send verification email. Please try again.',
    );
  }
}
