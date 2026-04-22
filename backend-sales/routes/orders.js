const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// GET all orders (with pagination)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const filter = search
      ? {
          $or: [
            { Order_ID: { $regex: search, $options: "i" } },
            { Customer_Name: { $regex: search, $options: "i" } },
            { Category: { $regex: search, $options: "i" } },
            { Region: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter).skip(skip).limit(limit).lean();

    res.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single order by _id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete an order by _id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order deleted successfully", order: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE - Add a new order
router.post("/", async (req, res) => {
  try {
    const maxRowResult = await Order.aggregate([
      {
        $project: {
          Row_ID_num: { $toInt: "$Row_ID" },
        },
      },
      {
        $sort: { Row_ID_num: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    const maxRowId = maxRowResult.length > 0 ? maxRowResult[0].Row_ID_num : 0;
    const nextRowId = maxRowId + 1;

    const newOrder = new Order({
      ...req.body,
      Row_ID: nextRowId,
      Sales: req.body.Sales === "" ? 0 : Number(req.body.Sales),
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - Update an order by row id
router.put("/row/:rowId", async (req, res) => {
  try {
    const rowId = req.params.rowId.trim();

    const updatedOrder = await Order.findOneAndUpdate(
      {
        $expr: {
          $eq: [{ $toString: "$Row_ID" }, rowId],
        },
      },
      { $set: req.body },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
