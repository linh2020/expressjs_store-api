require("dotenv").config();

// async errors
// to catch errors at runtime without using try/catch blocks in your async functions.
require("express-async-errors");

const express = require("express");
const app = express();

const connectDB = require("./db/connect.js");
const productsRouter = require("./routes/products.js");

const notFoundMiddleware = require("./middleware/not-found.js");
const errorMiddleware = require("./middleware/error-handler.js");

// parsing
app.use(express.json());

// root routes
app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">Products Route</a>');
});

// products route
app.use("/api/v1/products", productsRouter);

// Error handling middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // db connection
    connectDB(process.env.MONGO_URI);
    app.listen(PORT, () =>
      console.log(`Express server is listening on port ${PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
