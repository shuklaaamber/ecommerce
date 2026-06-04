const express =
  require("express");

const router =
  express.Router();

const protect =
  require(
    "../middleware/auth.middleware"
  );

const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
} = require(
  "../controllers/cart.controller"
);

router.post(
  "/add",
  protect,
  addToCart
);

router.get(
  "/",
  protect,
  getCart
);

router.put(
  "/update",
  protect,
  updateCartItem
);

router.delete(
  "/remove",
  protect,
  removeCartItem
);

router.delete(
  "/clear",
  protect,
  clearCart
);

module.exports = router;