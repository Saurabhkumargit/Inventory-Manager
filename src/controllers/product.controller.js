const Product = require("../models/Product");

async function createProduct(req, res) {
  try {
    const { name, price, totalStock } = req.body;

    if (!name || price === undefined || totalStock === undefined) {
      return res.status(400).json({
        message: "name, price and totalStock are required",
      });
    }

    if (price < 0 || totalStock < 0) {
      return res.status(400).json({
        message: "price and totalStock must be non-negative",
      });
    }

    const product = await Product.create({
      name,
      price,
      totalStock,
      availableStock: totalStock,
    });

    return res.status(201).json({
      productId: product._id,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({
      message: "Failed to create product",
    });
  }
}

async function listProducts(req, res) {
  const products = await Product.find();
  res.json(products);
}

module.exports = {
  createProduct,
  listProducts,
};
