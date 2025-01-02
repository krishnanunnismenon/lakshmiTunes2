import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  discountAmount: {
    type: Number,
    required: true
  },
  minimumOrderValue: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
  },
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});


couponSchema.index({ expiryDate: 1, isActive: 1 });

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;