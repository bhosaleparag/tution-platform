import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { to, name, inviteLink, expiresAt, isResend } = await request.json();

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or 'smtp.gmail.com'
      auth: {
        user: process.env.EMAIL_USER, // your-email@gmail.com
        pass: process.env.EMAIL_PASSWORD // App password (not regular password)
      }
    });

    // Email template
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #703bf7; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 30px; background: #703bf7; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Teacher Invitation</h1>
          </div>
          <div class="content">
            <h2>Hi ${name}! 👋</h2>
            <p>${isResend ? 'This is a reminder - you' : 'You'}'ve been invited to join our platform as a teacher.</p>
            <p>Click the button below to complete your registration and set up your account:</p>
            <center>
              <a href="${inviteLink}" class="button">Complete Registration</a>
            </center>
            <p><strong>Important:</strong> This invite link will expire on ${new Date(expiresAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}.</p>
            <p>If you have any questions, please contact your administrator.</p>
          </div>
          <div class="footer">
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"tution platform" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: isResend 
        ? 'Reminder: Complete Your Teacher Registration' 
        : 'You\'re Invited! Complete Your Teacher Registration',
      html: emailHTML
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}