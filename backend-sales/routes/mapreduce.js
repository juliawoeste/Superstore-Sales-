const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const collection = () => mongoose.connection.db.collection("orders");

// get the total sales per region, per category
router.get("/region/:region", async (req, res) => {
  try {
    const region = req.params.region;

    const results = await collection()
      .aggregate([
        {
          $match: { Region: region },
        },
        {
          $addFields: {
            Sales_num: { $toDouble: "$Sales" },
          },
        },
        {
          $group: {
            _id: "$Category",
            totalSales: { $sum: "$Sales_num" },
          },
        },
        {
          $sort: { totalSales: -1 },
        },
      ])
      .toArray();

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get Total Sales by Year
router.get("/sales-by-year", async (req, res) => {
  try {
    const result = await collection()
      .aggregate([
        {
          $addFields: {
            year: {
              $arrayElemAt: [{ $split: ["$Order_Date", "/"] }, 2],
            },
          },
        },
        {
          $group: {
            _id: "$year",
            totalSales: { $sum: { $toDouble: "$Sales" } },
            orderCount: { $sum: 1 },
          },
        },
        { $sort: { totalSales: -1 } },
      ])
      .toArray();

    res.json(
      result.map((r) => ({
        year: r._id,
        totalSales: parseFloat(r.totalSales.toFixed(2)),
        orderCount: r.orderCount,
      })),
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
