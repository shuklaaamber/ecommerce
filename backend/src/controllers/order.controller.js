const Order =
  require("../models/Order");

const Cart =
  require("../models/Cart");

exports.createOrder =
  async (req, res) => {
    try {
      const userId =
        req.user.userId;

      const {
        shippingAddress,
        paymentMethod
      } = req.body;

      const cart =
        await Cart.findOne({
          user: userId
        }).populate(
          "items.product"
        );

      if (
        !cart ||
        cart.items.length === 0
      ) {
        return res
          .status(400)
          .json({
            message:
              "Cart is empty"
          });
      }

      const orderItems =
        cart.items.map(
          (item) => ({
            product:
              item.product._id,
            quantity:
              item.quantity,
            price:
              item.product.price
          })
        );

      const order =
        await Order.create({
          user: userId,
          items: orderItems,
          shippingAddress,
          paymentMethod,
          totalAmount:
            cart.totalAmount
        });

      cart.items = [];
      cart.totalAmount = 0;

      await cart.save();

      res.status(201).json(
        order
      );
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  };

exports.getMyOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find({
          user:
            req.user.userId
        })
          .populate(
            "items.product"
          )
          .sort({
            createdAt: -1
          });

      res.json(orders);
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  };

exports.getOrderById =
  async (req, res) => {
    try {
      const order =
        await Order.findById(
          req.params.id
        )
          .populate(
            "items.product"
          )
          .populate(
            "user",
            "name email"
          );

      if (!order) {
        return res
          .status(404)
          .json({
            message:
              "Order not found"
          });
      }

      res.json(order);
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  };

exports.getAllOrders =
  async (req, res) => {
    try {
      const orders =
        await Order.find()
          .populate(
            "user",
            "name email"
          )
          .populate(
            "items.product"
          );

      res.json(orders);
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  };

exports.updateOrderStatus =
  async (req, res) => {
    try {
      const {
        orderStatus
      } = req.body;

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            orderStatus
          },
          {
            new: true
          }
        );

      res.json(order);
    } catch (err) {
      res.status(500).json({
        message:
          err.message
      });
    }
  };