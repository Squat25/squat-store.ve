// Endpoint para revalidar rutas ISR manualmente
import { NextResponse } from "next/server";

export async function POST(req) {
  const { path, secret } = await req.json();
  // Cambia este valor por un token secreto fuerte y guárdalo en tu .env
  const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || "supersecreto";

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // Revalida la ruta especificada
    await fetch(
      `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/api/revalidate?path=${encodeURIComponent(
        path
      )}&secret=${REVALIDATE_SECRET}`
    );
    return NextResponse.json({
      revalidated: true,
      now: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
