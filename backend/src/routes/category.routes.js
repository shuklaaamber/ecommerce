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
  createCategory,
  getCategories
} = require(
  "../controllers/category.controller"
);

router.post(
  "/",
  protect,
  adminOnly,
  createCategory
);

router.get(
  "/",
  getCategories
);

module.exports = router;