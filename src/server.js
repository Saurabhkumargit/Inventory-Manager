require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const { expireReservations } = require("./jobs/reservationExpiry.job");

async function startServer() {
  await connectDB();

  setInterval(() => {
    expireReservations().catch(console.error);
  }, 30 * 1000);

  app.listen(3000, () => console.log("Server running on 3000"));
}

startServer();
