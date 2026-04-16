const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const orderRoutes = require("./routes/orders");
const mapReduceRoutes = require("./routes/mapreduce");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/orders", orderRoutes);
app.use("/api/mapreduce", mapReduceRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(5001, () => console.log("Server running on port 5001"));
