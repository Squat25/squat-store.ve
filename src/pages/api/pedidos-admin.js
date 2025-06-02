import dbConnect from "../../lib/mongodb";
import Pedido from "../../models/Pedido";

export default async function handler(req, res) {
  await dbConnect();
  if (req.method === "GET") {
    try {
      const { email } = req.query;
      const filter = email ? { email } : {};
      const pedidos = await Pedido.find(filter).sort({ fecha: -1 });
      return res.status(200).json({ pedidos });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  if (req.method === "PUT") {
    const { id, estado } = req.body;
    if (!id || !estado) {
      return res.status(400).json({ error: "Faltan datos" });
    }
    try {
      const pedido = await Pedido.findByIdAndUpdate(
        id,
        { estado },
        { new: true }
      );
      if (!pedido)
        return res.status(404).json({ error: "Pedido no encontrado" });
      return res.status(200).json({ pedido });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  res.setHeader("Allow", ["GET", "PUT"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
