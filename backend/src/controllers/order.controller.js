const Order = require("../models/Order");

const Cart = require("../models/Cart");

const { createOrderFromCart } = require("../services/order.service");

exports.createCODOrder =
  async (req, res) => {
    try {
      const {
        shippingAddress
      } = req.body;

      const order =
        await createOrderFromCart({
          userId:
            req.user.userId,

          shippingAddress,

          paymentMethod: "COD",

          paymentStatus:
            "PENDING"
        });

      res.status(201).json(order);
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  };

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    })
      .populate("items.product")
      .sort({
        createdAt: -1,
      });

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product");

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus,
      },
      {
        new: true,
      },
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
