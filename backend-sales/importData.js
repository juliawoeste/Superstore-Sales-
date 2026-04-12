const mongoose = require("mongoose");
const csv = require("csvtojson");
require("dotenv").config();

const Order = require("./models/order");

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "superstoreDB",
    });
    console.log("MongoDB connected");

    const jsonArray = await csv().fromFile("data/superstore_data.csv");

    await Order.insertMany(jsonArray);

    console.log("Data imported successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
