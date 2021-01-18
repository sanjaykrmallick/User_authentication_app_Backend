const nodemailer = require("nodemailer")
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_FROM_ADDRESS,
  SMTP_AUTH_USER,
  SMTP_AUTH_PASSWORD,
} = process.env

module.exports = async (
  template,
  {
    to,
    subjectt,
    locals,
    attachments = [],
    from = null,
    replyTo = null,
    send = true,
  }
) => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false,
    requireTLC: true, // use SSL
    auth: {
      user: "ahmad.moore22@ethereal.email",
      pass: "VVtvZQytKCB8wzE3eM",
    },
    views: {
      options: {
        extension: "ejs"
      }
    }
  })

  // send email
  await transporter.sendMail({
    from: from || SMTP_FROM_ADDRESS,
    to: to || SMTP_FROM_ADDRESS,
    subject: subjectt,
    text: locals.url || locals.task,
    html: locals.url || locals.task,
  })
}
