const Cart = require("../models/Cart");
const Order = require("../models/Order");

const createOrderFromCart = async ({
  userId,
  shippingAddress,
  paymentMethod,
  paymentStatus = "PENDING",
  paymentId = null,
  razorpayOrderId = null,
  razorpaySignature = null
}) => {
  const cart = await Cart.findOne({
    user: userId
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const orderItems = cart.items.map(
    (item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    })
  );

  const order = await Order.create({
    user: userId,

    items: orderItems,

    shippingAddress,

    paymentMethod,

    paymentStatus,

    paymentId,

    razorpayOrderId,

    razorpaySignature,

    totalAmount: cart.totalAmount
  });

  cart.items = [];
  cart.totalAmount = 0;

  await cart.save();

  return order;
};

module.exports = {
  createOrderFromCart
};