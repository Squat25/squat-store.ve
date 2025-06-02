import mongoose from "mongoose";

const PedidoSchema = new mongoose.Schema({
  datosEntrega: Object,
  carrito: Array,
  pago: Object,
  email: String,
  estado: { type: String, default: "pendiente" },
  fecha: { type: Date, default: Date.now },
});

export default mongoose.models.Pedido || mongoose.model("Pedido", PedidoSchema);
