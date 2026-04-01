exports.signupEmailTemplate = (otp) =>
  `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial; background:#f4f4f7; padding:40px;">
          <div style="max-width:480px; background:#fff; padding:30px; border-radius:8px; margin:auto;">
            <h1 style="text-align:center; font-size:24px; color:#4f46e5;">Verify Your DevHub Account</h1>
            <p style="font-size:15px; color:#333;">Enter the OTP below to verify your email:</p>
            <div style="text-align:center; margin:25px 0;">
              <span style="font-size:32px; font-weight:600; padding:10px 20px; border:2px dashed #4f46e5; color:#4f46e5;">
                ${otp}
              </span>
            </div>
            <p style="font-size:14px; color:#555;">Valid for 10 minutes. Do not share with anyone.</p>
            <p style="text-align:center; color:#999; font-size:12px;">© ${new Date().getFullYear()} DevHub.</p>
          </div>
        </body>
        </html>
      `
  ;

exports.forgetPasswordEmailTemplate = (otp) => `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial; background:#f4f4f7; padding:40px;">
        <div style="max-width:480px; background:#fff; padding:30px; border-radius:8px; margin:auto;">
          <h1 style="text-align:center; font-size:24px; color:#4f46e5;">DevHub Password Reset</h1>
          <p style="font-size:15px; color:#333;">We received a password reset request for your DevHub account.</p>
          <p style="text-align:center; margin:25px 0;">
            <span style="font-size:32px; font-weight:bold; border:2px dashed #4f46e5; color:#4f46e5; padding:12px 24px;">
              ${otp}
            </span>
          </p>
          <p style="font-size:14px; color:#555;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <p style="text-align:center; color:#999; font-size:12px;">© ${new Date().getFullYear()} DevHub. All Rights Reserved.</p>
        </div>
      </body>
      </html>
    `;