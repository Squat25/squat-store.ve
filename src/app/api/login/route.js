import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/mongodb";
import Usuario from "../../../models/Usuario";

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json(
      { error: "Todos los campos son obligatorios" },
      { status: 400 }
    );
  }
  try {
    // Buscar usuario por email
    const user = await Usuario.findOne({ email });
    if (!user || !user.password) {
      return Response.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }
    // Comparar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return Response.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }
    return Response.json(
      {
        message: "Login exitoso",
        user: { name: user.name, email: user.email },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
