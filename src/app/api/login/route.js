import bcrypt from "bcryptjs";

let users = [];

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return Response.json(
      { error: "Todos los campos son obligatorios" },
      { status: 400 }
    );
  }
  const user = users.find((u) => u.email === email);
  if (!user) {
    return Response.json(
      { error: "Usuario o contraseña incorrectos" },
      { status: 401 }
    );
  }
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
}
