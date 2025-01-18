export const PASSWORD_RESET_TEMPLATE=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
    }
    .content {
      font-size: 16px;
      line-height: 1.5;
    }
    .cta-button {
      display: inline-block;
      background-color: #4CAF50;
      color: #ffffff;
      padding: 15px 25px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>

    <div class="content">
      <p>Dear {{email}},</p>
      <p>We received a request to reset your password. To complete the process, please use the following OTP:</p>
      <h2>{{otp}}</h2>
      <p>If you did not request a password reset, please ignore this email or contact support.</p>
      <p>Best regards,</p>
      <p>Your Company Team</p>
    </div>
  </div>

</body>
</html>
`
export const EMAIL_VERIFY_TEMPLATE=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification OTP</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
    }
    .content {
      font-size: 16px;
      line-height: 1.5;
    }
    .cta-button {
      display: inline-block;
      background-color: #4CAF50;
      color: #ffffff;
      padding: 15px 25px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">
      <h1>Email Verification</h1>
    </div>

    <div class="content">
      <p>Dear {{email}},</p>
      <p>Thank you for signing up! To complete your registration, please verify your email address by entering the following OTP:</p>
      <h2>{{otp}}</h2>
      <p>If you did not request this, please ignore this email or contact support.</p>
      <p>Best regards,</p>
      <p>COMPANY TEAM</p>
    </div>
  </div>

</body>
</html>`
 
