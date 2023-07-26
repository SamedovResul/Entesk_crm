import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const sendEmailForDemo = async (req, res) => {
  const mainEmail = process.env.EMAIL;
  const password = process.env.PASS;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: mainEmail,
      pass: password,
    },
  });

  const mailOptions = {
    from: mainEmail,
    to: "ceyhunresulov23@gmail.com",
    subject: "Demo üçün müraciət",
    text: "salam. mən edinify haqqında məlumat almaq istəyirəm",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    } else {
      res.status(200).json({ message: "request for demo sent successfuly" });
    }
  });
};
