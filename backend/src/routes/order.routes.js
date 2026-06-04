const express =
  require("express");

const router =
  express.Router();

const protect =
  require(
    "../middleware/auth.middleware"
  );

const adminOnly =
  require(
    "../middleware/admin.middleware"
  );

const {
  createCODOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require(
  "../controllers/order.controller"
);

router.post(
  "/cod",
  protect,
  createCODOrder
);

router.get(
  "/",
  protect,
  getMyOrders
);

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllOrders
);

router.get(
  "/:id",
  protect,
  getOrderById
);

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

module.exports = router;