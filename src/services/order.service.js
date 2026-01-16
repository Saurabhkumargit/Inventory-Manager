const mongoose = require("mongoose");
const Order = require("../models/Order");
const InventoryReservation = require("../models/InventoryReservation");
const Product = require("../models/Product");

async function confirmOrder({ userId, reservationId }) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const reservation = await InventoryReservation.findById(
      reservationId
    ).session(session);

    if (!reservation) {
      throw new Error("RESERVATION_NOT_FOUND");
    }

    if (!reservation.userId.equals(userId)) {
      throw new Error("UNAUTHORIZED");
    }

    if (!reservation.status === "EXPIRED") {
      throw new Error("RESERVATION_EXPIRED");
    }

    if (reservation.status === "CONFIRMED") {
      const existingOrder = await Order.findOne({ reservationId }).session(
        session
      );

      return existingOrder;
    }

    const product = await Product.findById(reservation.productId).session(
      session
    );

    const order = await Order.create(
      [
        {
          userId,
          reservationId,
          productId: reservation.productId,
          quantity: reservation.quantity,
          priceAtPurchase: product.price,
        },
      ],
      { session }
    );

    reservation.status = "CONFIRMED";
    await reservation.save({ session });

    await session.commitTransaction();

    return order[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

module.exports = { confirmOrder };
