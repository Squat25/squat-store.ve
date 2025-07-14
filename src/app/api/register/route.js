import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/mongodb";
import Usuario from "../../../models/Usuario";
import { sendWelcomeEmail } from "../../../utils/sendEmail";

// Cambia a true para activar el envío de correo de bienvenida
const SEND_WELCOME_EMAIL = true;

export async function POST(req) {
  await dbConnect();
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return Response.json(
      { error: "Todos los campos son obligatorios" },
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
    // Verificar si el usuario ya existe
    const userExists = await Usuario.findOne({ email });
    if (userExists) {
      if (userExists.provider === "google") {
        return Response.json(
          {
            error:
              "Este correo ya está registrado con Google. Inicia sesión con Google.",
          },
          { status: 409 }
        );
      }
      return Response.json({ error: "El usuario ya existe" }, { status: 409 });
    }
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crear usuario
    const user = await Usuario.create({
      name,
      email,
      password: hashedPassword,
      provider: "manual",
    });
    // Enviar correo de bienvenida si está activado
    if (SEND_WELCOME_EMAIL) {
      await sendWelcomeEmail({ to: user.email, name: user.name });
    }
    return Response.json(
      {
        message: "Usuario registrado exitosamente",
        user: { name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
