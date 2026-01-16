const mongoose = require("mongoose");
const InventoryReservation = require("../models/InventoryReservation");
const Product = require("../models/Product");

async function expireReservations() {
  const now = new Date();

  const expiredReservations = await InventoryReservation.find({
    status: "ACTIVE",
    expiresAt: { $lt: now },
  });

  for (const reservation of expiredReservations) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const freshReservation = await InventoryReservation.findById(
        reservation._id
      ).session(session);

      if (!freshReservation || freshReservation.status !== "ACTIVE") {
        await session.abortTransaction();
        continue;
      }

      const product = await Product.findById(reservation.productId).session(
        session
      );

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      product.availableStock += reservation.quantity;
      await product.save({ session });

      freshReservation.status = "EXPIRED";
      await freshReservation.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error("Failed to expire reservation:", reservation._id, error);
    } finally {
      session.endSession();
    }
  }
}

module.exports = { expireReservations };
