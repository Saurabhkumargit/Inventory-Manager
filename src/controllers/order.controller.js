const { confirmOrder } = require("../services/order.service");

async function confirmOrderController(req, res) {
  try {
    const userId = "000000000000000000000001";
    const { reservationId } = req.body || {};

    if (!reservationId) {
      return res.status(400).json({
        message: "reservationId is required",
      });
    }

    const order = await confirmOrder({ userId, reservationId });

    return res.status(201).json({
      orderId: order._id,
      status: order.status,
    });
  } catch (error) {
    console.error("Order confirmation error:", error.message, error);

    if (error.message === "RESERVATION_EXPIRED") {
      return res.status(409).json({ message: "Reservation expired" });
    }

    if (error.message === "RESERVATION_NOT_FOUND") {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (error.message === "UNAUTHORIZED") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    return res.status(500).json({ message: error.message });
  }
}

module.exports = { confirmOrderController };
