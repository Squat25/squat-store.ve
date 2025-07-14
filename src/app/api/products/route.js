import dbConnect from "../../../lib/mongodb";
import Producto from "../../../models/Producto";

// Validación de esquema de producto
const validateProduct = (product) => {
  const errors = [];

  if (!product.nombre || product.nombre.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
  }

  if (!product.precio || product.precio <= 0) {
    errors.push("El precio debe ser mayor a 0");
  }

  if (
    !product.variantes ||
    !Array.isArray(product.variantes) ||
    product.variantes.length === 0
  ) {
    errors.push("Debe tener al menos una variante");
  }

  product.variantes?.forEach((variante, index) => {
    if (!variante.talla || !variante.color) {
      errors.push(`Variante ${index + 1}: talla y color son obligatorios`);
    }
    if (variante.stock < 0) {
      errors.push(`Variante ${index + 1}: el stock no puede ser negativo`);
    }
  });

  return errors;
};

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const categoria = searchParams.get("categoria");
    const activo = searchParams.get("activo");

    let filter = {};

    if (categoria) {
      filter.categoria = categoria;
    }

    if (activo !== null) {
      filter.activo = activo === "true";
    }

    const productos = await Producto.find(filter).sort({ createdAt: -1 });

    return Response.json({
      success: true,
      productos,
      count: productos.length,
    });
  } catch (error) {
    console.error("Error en GET /api/products:", error);
    return Response.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    // Validar datos del producto
    const validationErrors = validateProduct(body);
    if (validationErrors.length > 0) {
      return Response.json(
        {
          success: false,
          error: "Datos inválidos",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    // Verificar si ya existe un producto con el mismo nombre
    const existingProduct = await Producto.findOne({
      nombre: { $regex: new RegExp(`^${body.nombre}$`, "i") },
    });

    if (existingProduct) {
      return Response.json(
        {
          success: false,
          error: "Ya existe un producto con ese nombre",
        },
        { status: 409 }
      );
    }

    const producto = await Producto.create({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return Response.json(
      {
        success: true,
        producto,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/products:", error);

    if (error.name === "ValidationError") {
      return Response.json(
        {
          success: false,
          error: "Error de validación",
          details: Object.values(error.errors).map((err) => err.message),
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
