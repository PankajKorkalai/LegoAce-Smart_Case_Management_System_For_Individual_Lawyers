const nodemailer = require('nodemailer');

module.exports = async (email, caseName, caseId, lawyerName) => {
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

    // Frontend URL for the feedback form
    // Assuming Vite default port is 5173
    const feedbackUrl = `http://localhost:5173/feedback-form?caseId=${caseId}&caseName=${encodeURIComponent(caseName)}&lawyerName=${encodeURIComponent(lawyerName)}`;

    await transfer.sendMail({
      from: `"LegoAce Legalflow" <${process.env.USER}>`,
      to: email,
      subject: `Case Closed: ${caseName} - We value your feedback!`,
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

            <h2 style="text-align:center; font-weight:600; color: #111827; margin-bottom: 20px;">
              Your Case is Now Closed
            </h2>

            <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
              We are writing to inform you that your case, <strong>${caseName}</strong>, has been officially closed by your attorney, <strong>${lawyerName}</strong>.
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin-top: 15px; color: #4b5563;">
              At LegoAce, we continuously strive to provide the best legal representation possible. We would greatly appreciate it if you could take 60 seconds to share your experience with us.
            </p>

            <div style="text-align: center; margin: 35px 0;">
              <a href="${feedbackUrl}" style="
                background-color: #16a34a; 
                color: #ffffff; 
                text-decoration: none; 
                padding: 14px 28px; 
                border-radius: 8px; 
                font-size: 16px; 
                font-weight: bold;
                display: inline-block;
              ">
                Submit Your Feedback
              </a>
            </div>

            <p style="font-size: 15px; line-height: 1.6; color: #6b7280;">
              If you have any further questions or require additional legal assistance in the future, please do not hesitate to reach out.
            </p>

            <br />

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
              <p style="font-size: 15px; color: #374151; margin-bottom: 5px;">
                Sincerely,<br />
                <strong>The LegoAce Legalflow Team</strong>
              </p>
            </div>

          </div>
          
          <div style="text-align:center; margin-top: 20px; font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} LegoAce Legalflow. All rights reserved.
          </div>
        </div>
      `
    });

    console.log(`Feedback email successfully sent to ${email}`);
  } catch (e) {
    console.error("Error sending feedback email:", e);
  }
};
