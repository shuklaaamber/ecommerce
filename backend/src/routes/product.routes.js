const express =
  require("express");

const router =
  express.Router();

const upload =
  require(
    "../config/multer"
  );

const protect =
  require(
    "../middleware/auth.middleware"
  );

const adminOnly =
  require(
    "../middleware/admin.middleware"
  );

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require(
  "../controllers/product.controller"
);

router.get(
  "/",
  getProducts
);

router.get(
  "/:id",
  getProductById
);

router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 5),
  createProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);

module.exports = router;