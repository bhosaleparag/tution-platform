import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create transporter (configure with your email service)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send quiz assignment notification email
 */
export async function POST(req) {
  try {
    const { to, quizTitle, startTime, endTime, eventId } = await req.json();

    if (!to || !quizTitle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transporter = createTransporter();
    
    const startTimeFormatted = new Date(startTime).toLocaleString();
    const endTimeFormatted = new Date(endTime).toLocaleString();
    const quizUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/student/quizzes/${eventId}`;

    const mailOptions = {
      from: `"Quiz App" <${process.env.SMTP_USER}>`,
      to,
      subject: `New Quiz Assigned: ${quizTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .info-box { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📚 New Quiz Assigned</h1>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>A new quiz has been assigned to you:</p>
              
              <div class="info-box">
                <strong>Quiz Title:</strong> ${quizTitle}<br>
                <strong>Start Time:</strong> ${startTimeFormatted}<br>
                <strong>End Time:</strong> ${endTimeFormatted}
              </div>
              
              <p>Please make sure to complete the quiz within the assigned time window.</p>
              
              <a href="${quizUrl}" class="button">Take Quiz Now</a>
              
              <div class="footer">
                <p>This is an automated email from Quiz App. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}

