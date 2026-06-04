const crypto = require("crypto");

const razorpay = require("../config/razorpay");

const Cart = require("../models/Cart");

const { createOrderFromCart } = require("../services/order.service");

exports.createPaymentOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }
    const options = {
      amount: cart.totalAmount * 100,

      currency: "INR",

      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const order = await createOrderFromCart({
      userId: req.user.userId,

      shippingAddress,

      paymentMethod: "RAZORPAY",

      paymentStatus: "PAID",

      paymentId: razorpay_payment_id,

      razorpayOrderId: razorpay_order_id,

      razorpaySignature: razorpay_signature,
    });

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
