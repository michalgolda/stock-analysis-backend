const nodeMailer = require('nodemailer');
const passwordResetRedirect =
    process.env.FRONTEND_RESET_ADDRESS ||
    'http://localhost:5173/reset-password';

module.exports.SendForgotPasswordMail = async (obj) => {
    try {
        const output = `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                <h1 style="color: #4CAF50;">Password Reset Request</h1>
                <ul style="list-style-type: none; padding: 0;">
                    <li><strong>Name:</strong> ${obj.username}</li>
                    <li><strong>Email:</strong> ${obj.email}</li>
                    <li><strong>Company:</strong> Stock Analysis</li>
                </ul>
                <h3 style="color: #4CAF50;">Reset Password Link</h3>
                <p>Please click the button below to reset your password:</p>
                <a href="${passwordResetRedirect}?token=${obj.message}" 
                   style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">
                   Reset Password
                </a>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Thank you,<br>Stock Analysis Team</p>
            </div>
        `;

        // Creating reusable transporter using default SMTP transport
        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        let mailOptions = {
            from: `"Stock Analysis" <${process.env.EMAIL_USER}>`,
            to: obj.email,
            subject: 'Password Reset - Stock Analysis',
            text: `Dear ${obj.username},\n\nPlease reset your password by clicking the link below:\nhttp://127.0.0.1:3000/api/users/resetPassword?token=${obj.message}\n\nThank you,\nStock Analysis Team`,
            html: output,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error in Nodemailer:', error);
                throw new Error('Error in sending email');
            }
            console.log(`Message sent: ${info.messageId}`);
        });
    } catch (err) {
        console.error('Error in sending email:', err);
        throw new Error('Error in sending email');
    }
};
