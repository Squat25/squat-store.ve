import mongoose from "mongoose";

const VarianteSchema = new mongoose.Schema(
  {
    talla: {
      type: String,
      required: [true, "La talla es obligatoria"],
      trim: true,
    },
    color: {
      type: String,
      required: [true, "El color es obligatorio"],
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "El stock no puede ser negativo"],
    },
    precioVariante: {
      type: Number,
      min: [0, "El precio no puede ser negativo"],
    },
  },
  { _id: true }
);

const ProductoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: [1000, "La descripción no puede exceder 1000 caracteres"],
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    precioAnterior: {
      type: Number,
      min: [0, "El precio anterior no puede ser negativo"],
    },
    imagen: {
      type: String,
      required: [true, "La imagen es obligatoria"],
    },
    imagenes: [
      {
        type: String,
      },
    ],
    categoria: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      enum: {
        values: ["mujer", "hombre", "accesorios", "zapatos"],
        message: "Categoría debe ser: mujer, hombre, accesorios, o zapatos",
      },
    },
    etiquetas: [
      {
        type: String,
        trim: true,
      },
    ],
    variantes: [VarianteSchema],
    activo: {
      type: Boolean,
      default: true,
    },
    destacado: {
      type: Boolean,
      default: false,
    },
    vendidos: {
      type: Number,
      default: 0,
      min: [0, "Los vendidos no pueden ser negativos"],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índices para mejorar performance
ProductoSchema.index({ nombre: "text", descripcion: "text" });
ProductoSchema.index({ categoria: 1, activo: 1 });
ProductoSchema.index({ destacado: 1, activo: 1 });
ProductoSchema.index({ slug: 1 });

// Virtual para calcular si está en oferta
ProductoSchema.virtual("enOferta").get(function () {
  return this.precioAnterior && this.precioAnterior > this.precio;
});

// Virtual para calcular el porcentaje de descuento
ProductoSchema.virtual("descuento").get(function () {
  if (!this.precioAnterior || this.precioAnterior <= this.precio) return 0;
  return Math.round(
    ((this.precioAnterior - this.precio) / this.precioAnterior) * 100
  );
});

// Middleware para generar slug automáticamente
ProductoSchema.pre("save", function (next) {
  if (this.isModified("nombre") && !this.slug) {
    this.slug = this.nombre
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Método estático para buscar productos
ProductoSchema.statics.findByCategory = function (categoria) {
  return this.find({ categoria, activo: true });
};

// Método estático para productos destacados
ProductoSchema.statics.findDestacados = function () {
  return this.find({ destacado: true, activo: true });
};

// Método de instancia para verificar stock
ProductoSchema.methods.tieneStock = function (talla, color, cantidad = 1) {
  const variante = this.variantes.find(
    (v) => v.talla === talla && v.color === color
  );
  return variante && variante.stock >= cantidad;
};

export default mongoose.models.Producto ||
  mongoose.model("Producto", ProductoSchema);
