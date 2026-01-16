const express = require("express");
const reservationRoutes = require("./routes/reservation.routes");
const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(express.json());

app.use("/reservations", reservationRoutes);
app.use("/orders", orderRoutes);

module.exports = app;
