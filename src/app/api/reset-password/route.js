import dbConnect from "../../../lib/mongodb";
import Usuario from "../../../models/Usuario";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await dbConnect();
  const { token, password } = await req.json();

  if (!token || !password) {
    return Response.json(
      { error: "Token y nueva contraseña son obligatorios" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return Response.json(
      { error: "La contraseña debe tener al menos 6 caracteres" },
      { status: 400 }
    );
  }
  try {
    const user = await Usuario.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user) {
      return Response.json(
        { error: "Token inválido o expirado" },
        { status: 400 }
      );
    }
    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    return Response.json({ message: "Contraseña restablecida exitosamente" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
