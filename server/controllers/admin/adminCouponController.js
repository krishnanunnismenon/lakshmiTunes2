import Coupon from "../../models/couponModel.js"

export const getAllCoupons = async (req, res) => {
    try {
      const coupons = await Coupon.find()
        .populate('applicableCategories', 'name')
        .sort({ createdAt: -1 });
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const createCoupon = async (req, res) => {
    try {
      const {
        name,
        description,
        discountAmount,
        minimumOrderValue,
        startDate,
        expiryDate,
        applicableCategories
      } = req.body;
  
      const coupon = await Coupon.create({
        name,
        description,
        discountAmount,
        minimumOrderValue,
        startDate,
        expiryDate,
        applicableCategories
      });
  
      res.status(201).json(coupon);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  export const getCoupon = async (req, res) => {
    try {
      const coupon = await Coupon.findById(req.params.id)
        .populate('applicableCategories', 'name');
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };