const express = require("express");
const { confirmOrderController } = require("../controllers/order.controller");

const router = express.Router();

router.post("/confirm", confirmOrderController);

module.exports = router;
