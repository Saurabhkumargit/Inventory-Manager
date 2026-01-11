const mongoose = require("mongoose");
const Product = require("../../models/Product");

async function run() {
  await mongoose.connect(
    "mongodb://localhost:27017/inventory-system?replicaSet=rs0"
  );

  const product = await Product.create({
    name: "Test Product",
    price: 100,
    totalStock: 5,
    availableStock: 5,
  });

  console.log(product);
  process.exit(0);
}

run();
