// src/app.js

const express = require("express");

const app = express();

// middlewares
app.use(express.json());

// routes will be added later
// app.use("/products", productRoutes);

module.exports = app;
