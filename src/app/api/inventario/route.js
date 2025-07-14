import dbConnect from "../../../lib/mongodb";
import Producto from "../../../models/Producto";

// GET /api/inventario?slug=producto-slug
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return Response.json(
      { error: "Falta el slug del producto" },
      { status: 400 }
    );
  }
  try {
    const producto = await Producto.findOne({ slug });
    if (!producto) {
      return Response.json({ variantes: [] });
    }
    return Response.json({ variantes: producto.variantes });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/inventario?slug=producto-slug
// Body: { variantes: [{ talla, color, stock }] }
export async function PUT(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return Response.json(
      { error: "Falta el slug del producto" },
      { status: 400 }
    );
  }
  try {
    const { variantes } = await req.json();
    const producto = await Producto.findOneAndUpdate(
      { slug },
      { variantes },
      { new: true, upsert: true } // Crea si no existe
    );
    return Response.json({ variantes: producto.variantes });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
