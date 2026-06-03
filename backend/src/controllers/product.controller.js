const Product = require(
  "../models/Product"
);

exports.createProduct =
  async (req, res) => {
    try {
      const images =
        req.files?.map(
          (file) => file.filename
        ) || [];

      const product =
        await Product.create({
          ...req.body,
          images
        });

      res.status(201).json(
        product
      );
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  };

exports.getProducts =
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
        sort
      } = req.query;

      const query = {};

      if (search) {
        query.title = {
          $regex: search,
          $options: "i"
        };
      }

      if (category) {
        query.category =
          category;
      }

      const products =
        await Product.find(query)
          .populate("category")
          .sort(sort)
          .skip(
            (page - 1) * limit
          )
          .limit(Number(limit));

      const total =
        await Product.countDocuments(
          query
        );

      res.json({
        products,
        total,
        page: Number(page),
        pages: Math.ceil(
          total / limit
        )
      });
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  };

exports.getProductById =
  async (req, res) => {
    const product =
      await Product.findById(
        req.params.id
      ).populate("category");

    if (!product) {
      return res.status(404).json({
        message:
          "Product not found"
      });
    }

    res.json(product);
  };

exports.updateProduct =
  async (req, res) => {
    const product =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(product);
  };

exports.deleteProduct =
  async (req, res) => {
    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Product deleted"
    });
  };