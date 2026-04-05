const nodemailer = require('nodemailer');

module.exports = async (email, subject, text) => {
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

    await transfer.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,

      html: `
        <div style="background: #111; padding: 40px 0; font-family: Arial, sans-serif;">
          <div style="
            max-width: 500px; 
            margin: auto; 
            background: #1a1a1a; 
            padding: 30px; 
            border-radius: 12px; 
            color: #e6e6e6;
            box-shadow: 0 0 5px rgba(255,255,255,0.05);
          ">

            <!-- Logo -->
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="cid:appLogo" 
                alt="AyurSutra Logo"
                style="width: 180px; margin-top: 10px;" />
            </div>

            <h2 style="text-align:center; font-weight:500; margin-bottom: 20px;">
              Verify your email
            </h2>

            <p style="font-size: 15px; line-height: 1.6;">
              We received a request to verify your email address using 
              <strong>${email}</strong> for your AyurSutra account.
            </p>

            <p style="font-size: 15px; margin-top: 10px;">
              Use the code below to complete your verification:
            </p>

            <!-- OTP -->
            <div style="text-align: center; margin: 28px 0;">
              <div style="
                font-size: 46px; 
                letter-spacing: 6px; 
                color: #3ccf91; 
                font-weight: bold;
              ">
                ${text}
              </div>
              <p style="color: #bbb; font-size: 13px; margin-top: 5px;">
                This code will expire in 10 minutes.
              </p>
            </div>

            <p style="font-size: 15px; line-height: 1.6;">
              For your security, <strong>do not share this code with anyone</strong>.  
              AyurSutra will never ask you for your OTP.
            </p>

            <p style="font-size: 15px; margin-top: 10px;">
              If you did not request this verification, you can safely ignore this email.
            </p>

            <br />

            <p style="font-size: 15px;">
              Thanks & Regards,<br />
              <strong>AyurSutra Team</strong>
            </p>

            <div style="text-align:center; margin-top: 25px; font-size: 12px; color: #777;">
              © ${new Date().getFullYear()} AyurSutra. All rights reserved.
            </div>

          </div>
        </div>
      `,
      attachments: [
        {
          filename: "logo.png",
          path: __dirname + "/../logo.png",  // <- YOUR CORRECT PATH
          cid: "appLogo"
        }
      ]
    });

  } catch (e) {
    console.log("error!!!");
    console.log(e);
  }
};