const Cart = require("../models/Cart");
const Product = require("../models/Product");

const calculateTotal = async (
  items
) => {
  const productIds = items.map(
    item => item.product
  );

  const products =
    await Product.find({
      _id: {
        $in: productIds
      }
    });

  const productMap = {};

  products.forEach(product => {
    productMap[
      product._id.toString()
    ] = product;
  });

  let total = 0;

  items.forEach(item => {
    const product =
      productMap[
        item.product.toString()
      ];

    if (product) {
      total +=
        product.price *
        item.quantity;
    }
  });

  return total;
};

exports.addToCart = async (
  req,
  res
) => {
  try {
    const {
      productId,
      quantity = 1
    } = req.body;

    const userId =
      req.user.userId;

    const product =
      await Product.findById(
        productId
      );

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found"
      });
    }

    let cart =
      await Cart.findOne({
        user: userId
      });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: []
      });
    }

    const existingItem =
      cart.items.find(
        (item) =>
          item.product.toString() ===
          productId
      );

    if (existingItem) {
      existingItem.quantity +=
        quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity
      });
    }

    cart.totalAmount =
      await calculateTotal(
        cart.items
      );

    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.getCart = async (
  req,
  res
) => {
  try {
    const cart =
      await Cart.findOne({
        user: req.user.userId
      }).populate(
        "items.product"
      );

    if (!cart) {
      return res.json({
        items: [],
        totalAmount: 0
      });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

exports.updateCartItem =
  async (req, res) => {
    try {
      const {
        productId,
        quantity
      } = req.body;

      const cart =
        await Cart.findOne({
          user:
            req.user.userId
        });

      if (!cart) {
        return res.status(404).json({
          message:
            "Cart not found"
        });
      }

      const item =
        cart.items.find(
          (item) =>
            item.product.toString() ===
            productId
        );

      if (!item) {
        return res.status(404).json({
          message:
            "Item not found"
        });
      }

      item.quantity =
        quantity;

      cart.totalAmount =
        await calculateTotal(
          cart.items
        );

      await cart.save();

      res.json(cart);
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  };

exports.removeCartItem =
  async (req, res) => {
    try {
      const {
        productId
      } = req.body;

      const cart =
        await Cart.findOne({
          user:
            req.user.userId
        });

      if (!cart) {
        return res.status(404).json({
          message:
            "Cart not found"
        });
      }

      cart.items =
        cart.items.filter(
          (item) =>
            item.product.toString() !==
            productId
        );

      cart.totalAmount =
        await calculateTotal(
          cart.items
        );

      await cart.save();

      res.json(cart);
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  };

exports.clearCart = async (
  req,
  res
) => {
    try {
      await Cart.findOneAndUpdate(
        {
          user:
            req.user.userId
        },
        {
          items: [],
          totalAmount: 0
        }
      );

      res.json({
        message:
          "Cart cleared"
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  };