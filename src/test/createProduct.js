const mongoose = require("mongoose");
const Product = require("../models/Product");

async function run() {
  await mongoose.connect(
    "mongodb://localhost:27017/inventory-system?replicaSet=rs0"
  );

  const product = await Product.create({
    name: "Concurrent Test Product",
    price: 100,
    availableStock: 2,
    totalStock: 2,
  });

  console.log("Created product:", product._id);
  process.exit(0);
}

run();
