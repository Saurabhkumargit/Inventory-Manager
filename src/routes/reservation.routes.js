const express = require("express");
const {
  createReservation,
} = require("../controllers/reservation.controller");

const router = express.Router();

router.post("/", createReservation);

module.exports = router;
