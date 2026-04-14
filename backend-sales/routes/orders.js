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
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - Update an order by Order_ID
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
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
