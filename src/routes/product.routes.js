const express = require("express");
const {
  createProduct,
  listProducts,
} = require("../controllers/product.controller");

const router = express.Router();

router.post("/", createProduct);
router.get("/", listProducts);

module.exports = router;
