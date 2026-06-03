const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    discountPrice: Number,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },

    brand: String,

    stock: {
      type: Number,
      default: 0
    },

    images: [String],

    rating: {
      type: Number,
      default: 0
    },

    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);