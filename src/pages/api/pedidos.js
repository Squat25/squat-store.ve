import dbConnect from "../../lib/mongodb";
import Pedido from "../../models/Pedido";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await dbConnect();
    try {
      const pedido = new Pedido({
        ...req.body,
        estado: "pendiente",
      });
      await pedido.save();
      return res.status(201).json({ success: true, pedido });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
