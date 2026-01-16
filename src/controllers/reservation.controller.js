const { reserveInventory } = require("../services/reservation.service");

async function createReservation(req, res) {
  try {
    // TEMP userId (auth later)
    const userId = "000000000000000000000001";

    // ✅ DECLARE FIRST
    const { productId, quantity } = req.body;

    // ✅ Explicit validation
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    if (quantity === undefined) {
      return res.status(400).json({ message: "quantity is required" });
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "quantity must be a positive number" });
    }

    // ✅ Call service
    const reservation = await reserveInventory({
      userId,
      productId,
      quantity,
    });

    return res.status(201).json({
      reservationId: reservation._id,
      expiresAt: reservation.expiresAt,
    });
  } catch (error) {
    console.error("Reservation error:", error);

    if (error.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({ message: "Product not found" });
    }

    if (error.message === "INSUFFICIENT_STOCK") {
      return res.status(409).json({ message: "Insufficient stock" });
    }

    return res.status(500).json({
      message: "Failed to create reservation",
    });
  }
}

module.exports = { createReservation };
