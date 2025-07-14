import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^([a-zA-Z0-9_\-.+]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/,
        "Email inválido",
      ],
    },
    password: {
      type: String,
      required: false, // Solo requerido para usuarios manuales
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    provider: {
      type: String,
      enum: ["manual", "google"],
      default: "manual",
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Usuario ||
  mongoose.model("Usuario", UsuarioSchema);
