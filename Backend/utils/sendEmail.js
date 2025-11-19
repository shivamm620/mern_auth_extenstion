import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "studyshivam9430@gmail.com",
    pass: "guvzihixgijbxmcv",
  },
});
