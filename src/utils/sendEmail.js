import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html, text }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
}

export async function sendWelcomeEmail({ to, name }) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff; border-radius: 14px; box-shadow: 0 2px 12px #0001; padding: 32px 24px;">
      <div style="text-align:center; margin-bottom: 28px;">
        <div style="display:inline-block; background:#171717; border-radius:32px; padding:22px 24px; margin-bottom: 12px; box-shadow:0 2px 8px #0002; border: 2.5px solid #fff;">
          <img src=\"https://i.ibb.co/ds3M3mSW/Group.png\" alt=\"Squat Store\" width=\"90\" style=\"display:block;\"/>
        </div>
        <h2 style=\"color:#171717; margin:0; font-size:2em; letter-spacing:1px;\">Squat Store</h2>
      </div>
      <h3 style=\"color:#171717; margin-top:0;\">¡Bienvenido${
        name ? ", <b>" + name + "</b>" : ""
      }!</h3>
      <p style=\"font-size:1.08em;\">Tu cuenta en <b>Squat Store</b> ha sido creada exitosamente.</p>
      <p style=\"margin:18px 0 8px 0; font-size:1.1em;\">Ya puedes explorar y comprar los mejores productos.</p>
      <div style=\"text-align:center; margin:24px 0;\">
        <a href=\"${
          process.env.NEXTAUTH_URL || "http://localhost:3000"
        }\" style=\"background:#171717; color:#fff; padding:14px 32px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:1.08em; display:inline-block; box-shadow:0 2px 8px #0002;\">Ir a la tienda</a>
      </div>
      <p style=\"color:#555; font-size:0.97em; margin-bottom:0;\">Si tienes alguna duda o necesitas ayuda, responde a este correo.<br/>¡Gracias por unirte a la familia Squat Store!</p>
      <hr style=\"margin:32px 0 16px 0; border:none; border-top:1px solid #eee;\"/>
      <div style=\"text-align:center; color:#888; font-size:0.97em;\">El equipo de Squat Store</div>
    </div>
  `;
  return sendEmail({
    to,
    subject: "🎉 ¡Bienvenido a Squat Store!",
    html,
    text: `¡Bienvenido${
      name ? ", " + name : ""
    } a Squat Store!\n\nTu cuenta ha sido creada exitosamente. Ya puedes explorar y comprar los mejores productos.\n\nGracias por unirte a la familia Squat Store.`,
  });
}
