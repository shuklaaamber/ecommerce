const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/auth.middleware");

const adminOnly =
  require("../middleware/admin.middleware");

const {
  createProduct,
  getProducts
} = require("../controllers/product.controller");

router.get("/", getProducts);

router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);

module.exports = router;