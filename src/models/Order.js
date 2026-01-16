const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "InventoryReservation",
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },

    quantity: {
      type: Number,
      required: true,
    },

    priceAtPurchase: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["CONFIRMED"],
      default: "CONFIRMED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
