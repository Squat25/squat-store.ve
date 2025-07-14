import dbConnect from "../../../lib/mongodb";
import Usuario from "../../../models/Usuario";
import crypto from "crypto";
import { sendEmail } from "../../../utils/sendEmail";

export async function POST(req) {
  await dbConnect();
  const { email } = await req.json();

  if (!email) {
    return Response.json({ error: "El email es obligatorio" }, { status: 400 });
  }

  try {
    const user = await Usuario.findOne({ email });
    if (!user) {
      // No revelar si el usuario existe o no (por seguridad)
      return Response.json({
        message: "Si el email existe, se enviará un enlace de recuperación",
      });
    }
    // Generar token seguro
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos
    user.passwordResetToken = token;
    user.passwordResetExpires = expires;
    await user.save();

    // Enviar email real personalizado con el logo blanco
    const resetUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/forgot-password?token=${token}`;
    await sendEmail({
      to: user.email,
      subject: "🔒 Recupera tu contraseña | Squat Store",
      text: `Hola ${
        user.name || "usuario"
      },\n\n¡Recibimos una solicitud para restablecer tu contraseña en Squat Store!\n\nCopia este token en la página de recuperación: ${token}\n\nO haz clic en el siguiente enlace para restablecer tu contraseña:\n${resetUrl}\n\nEste enlace expirará en 30 minutos.\nSi no solicitaste este cambio, puedes ignorar este correo.\n\n¡Gracias por confiar en nosotros!\nEl equipo de Squat Store`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff; border-radius: 14px; box-shadow: 0 2px 12px #0001; padding: 32px 24px;">
        <div style="text-align:center; margin-bottom: 28px;">
          <div style="display:inline-block; background:#171717; border-radius:32px; padding:22px 24px; margin-bottom: 12px; box-shadow:0 2px 8px #0002; border: 2.5px solid #fff;">
            <img src="https://i.ibb.co/ds3M3mSW/Group.png" alt="Squat Store" width="90" style="display:block;"/>
          </div>
          <h2 style="color:#171717; margin:0; font-size:2em; letter-spacing:1px;">Squat Store</h2>
        </div>
        <h3 style="color:#171717; margin-top:0;">¡Hola <b>${
          user.name || "usuario"
        }</b>!</h3>
        <p style="font-size:1.08em;">Recibimos una solicitud para <b>restablecer tu contraseña</b> en Squat Store.</p>
        <p style="margin:18px 0 8px 0; font-size:1.1em;">Tu <b>token de recuperación</b> es:</p>
        <div style="background:#f4f4f4; border-radius:8px; padding:14px; text-align:center; font-size:1.25em; letter-spacing:1px; margin-bottom:18px; font-weight:bold; color:#171717;"><code>${token}</code></div>
        <p style="margin-bottom: 18px;">O haz clic en el siguiente botón para restablecer tu contraseña:</p>
        <div style="text-align:center; margin:24px 0;">
          <a href="${resetUrl}" style="background:#171717; color:#fff; padding:14px 32px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:1.08em; display:inline-block; box-shadow:0 2px 8px #0002;">Restablecer contraseña</a>
        </div>
        <p style="color:#555; font-size:0.97em; margin-bottom:0;">Este enlace expirará en 30 minutos.<br/>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <hr style="margin:32px 0 16px 0; border:none; border-top:1px solid #eee;"/>
        <div style="text-align:center; color:#888; font-size:0.97em;">¡Gracias por confiar en nosotros!<br/>El equipo de Squat Store</div>
      </div>
      `,
    });

    return Response.json({
      message: "Si el email existe, se enviará un enlace de recuperación",
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
