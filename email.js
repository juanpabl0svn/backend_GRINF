require("dotenv").config();
const nodemailer = require("nodemailer");

function sendEmail(email, name, username) {
  const message = {
    from: process.env.EMAILUSERNAME,
    to: email,
    subject: "Asignacion de usuario y contraseña",
    html: `Hola Mr(s). ${name}, nos place anunciarte que ya estas registrado en la pagina de GRINF para poder ingresar y dar uso a tus responsabilidades, tu usuario es "${username}" y tu contraseña es "${username}, cualquier inquietud favor acercarse a nuetra sucursal, feliz dia y bienvenido a GRINF INC.<br> Para ingresar a la plataforma ingrese a este link <a href='http://localhost:5173/'>Ingresar</a> <br> Para cambiar la clave ingrese a este link <a href='http://localhost:5173/clave'>Cambiar clave</a>`,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAILUSERNAME,
      pass: process.env.EMAILPASSOWORD,
    },
  });

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log("Error enviando email");
      console.log(error.message);
    }
  });
}

module.exports = sendEmail;
