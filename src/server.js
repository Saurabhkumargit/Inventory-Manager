const app = require("./app");
const connectDB = require("../config/db");
require("dotenv").config();


const PORT = 3000;

async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();