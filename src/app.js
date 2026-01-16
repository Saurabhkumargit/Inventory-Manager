const express = require("express");
const reservationRoutes = require("./routes/reservation.routes");

const app = express();

app.use(express.json());

app.use("/reservations", reservationRoutes);

module.exports = app;
