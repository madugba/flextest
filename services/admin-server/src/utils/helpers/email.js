import nodemailer from 'nodemailer';
import { HttpStatusCode } from 'axios';

import { AppError } from '@flextest/apperrorhandler';


const createTransporter = async() => {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
};


const initsendEmail = async (receiver, title, body) => {
    if (!receiver || !title || !body) {
      throw new AppError(HttpStatusCode.BadRequest, 'Receiver email, subject, and body are required.');
    }
  
    const transporter = await createTransporter();
  
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: receiver,
      subject: title,
      html: body,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      return {
        status: true,
        message: `Email sent: ${info.messageId}`,
      };
    } catch (error) {
      throw new AppError(HttpStatusCode.InternalServerError, `Unable to send email: ${error.message}`);
    }
};
  

const generateOtp = (length) => {
    if (length <= 0) {
      throw new AppError(HttpStatusCode.BadRequest, 'Number of digits must be greater than 0');
    }
  
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }
  
    return otp;
};

const sendEmail = async (email, title, bodyTemplate) => {
    if (!email || !title || !bodyTemplate) {
      throw new AppError(HttpStatusCode.BadRequest, 'Please provide receiver email, mail title, and body template.');
    }
  
    const otp = generateOtp(4);
    const body = bodyTemplate.replace('{OTP}', otp);
  
    const emailResponse = await initsendEmail(email, title, body);
  
    if (!emailResponse.status) {
      throw new AppError(HttpStatusCode.InternalServerError, emailResponse.message);
    }
  
    return {
      status: true,
      message: 'Mail has been sent to the user.',
      otp,
    };
};

export default sendEmail;
