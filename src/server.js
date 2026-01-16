require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

async function startServer() {
  await connectDB();
  app.listen(3000, () => console.log("Server running on 3000"));
}

startServer();
