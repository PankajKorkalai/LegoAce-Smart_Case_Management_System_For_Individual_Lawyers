const nodemailer = require('nodemailer');

module.exports = async (email, subject, message) => {
  try {
    const transfer = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });

    await transfer.verify();

    // Replace newlines with <br /> for HTML
    const formattedMessage = message.replace(/\n/g, '<br />');

    await transfer.sendMail({
      from: `"LegoAce Legalflow" <${process.env.USER}>`,
      to: email,
      subject: subject,
      html: `
        <div style="background: #f9fafb; padding: 40px 0; font-family: Arial, sans-serif;">
          <div style="
            max-width: 550px; 
            margin: auto; 
            background: #ffffff; 
            padding: 40px 30px; 
            border-radius: 12px; 
            color: #333333;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
          ">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #166534; font-size: 28px; margin: 0; font-weight: bold;">LegoAce</h1>
              <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Smart Legal Management</p>
            </div>
            
            <div style="font-size: 16px; line-height: 1.6; color: #4b5563; border-left: 4px solid #16a34a; padding-left: 15px;">
              ${formattedMessage}
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="font-size: 15px; color: #374151; margin-bottom: 5px;">
                Sincerely,<br />
                <strong>The LegoAce Team</strong>
              </p>
            </div>
          </div>
          <div style="text-align:center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} LegoAce Legalflow. All rights reserved.
          </div>
        </div>
      `
    });

    console.log(`Alert email successfully sent to ${email}`);
  } catch (e) {
    console.error("Error sending alert email:", e);
    throw e;
  }
};
