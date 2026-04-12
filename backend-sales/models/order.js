const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    Row_ID: Number,
    Order_ID: String,
    Order_Date: String,
    Ship_Date: String,
    Ship_Mode: String,
    Customer_ID: String,
    Customer_Name: String,
    Segment: String,
    Country: String,
    City: String,
    State: String,
    Postal_Code: String,
    Region: String,
    Product_ID: String,
    Category: String,
    Sub_Category: String,
    Product_Name: String,
    Sales: Number,
  },
  { strict: false },
);

module.exports = mongoose.model("Order", orderSchema);
