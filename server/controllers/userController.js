import { Product } from "../models/productModel.js";

export const userHome = async (req, res) => {
  try {
    const products = await Product.find({})
      .limit(5)
      .select("name, description, price, thumbnailImage, images")
      .sort({ createdAt: -1 });
    console.log(products);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
