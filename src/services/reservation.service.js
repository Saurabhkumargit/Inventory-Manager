const mongoose = require("mongoose");
const InventoryReservation = require("../models/InventoryReservation");
const Product = require("../models/Product");

async function reserveInventory({ userId, productId, quantity }) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const product = await Product.findById(productId).session(session);

    if (!product) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    if (product.availableStock < quantity) {
      throw new Error("INSUFFICIENT_STOCK");
    }

    product.availableStock -= quantity;
    await product.save({ session });

    const reservation = await InventoryReservation.create(
      [
        {
          userId,
          productId,
          quantity,
          status: "ACTIVE",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return reservation[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

module.exports = {
  reserveInventory,
};
