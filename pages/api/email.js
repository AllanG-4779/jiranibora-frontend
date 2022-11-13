import nodemailer from "nodemailer";

export default async function email(req, res) {
  const { recipient, message } = req.body;

  const connection = {
    service: "hotmail",
    // port: 587,
    // tls: true,
    // secure: true,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(connection);
  try {
    let info = await transporter.sendMail({
      from: connection.auth.user,
      to: recipient,
      subject: "JiraniBora SACCO",
      html: "<h4> JiraniBora SACCO Group</h4>",
    });
    console.log(info);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: "failed" });
  }

  return res.status(200).json({ status: "Successful" });
}
