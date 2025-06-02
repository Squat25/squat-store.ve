import bcrypt from "bcryptjs";

let users = [];

export async function POST(req) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) {
    return Response.json(
      { error: "Todos los campos son obligatorios" },
      { status: 400 }
    );
  }
  const userExists = users.find((u) => u.email === email);
  if (userExists) {
    return Response.json({ error: "El usuario ya existe" }, { status: 409 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ name, email, password: hashedPassword });
  return Response.json(
    { message: "Usuario registrado exitosamente" },
    { status: 201 }
  );
}
