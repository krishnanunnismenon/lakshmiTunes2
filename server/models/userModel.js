import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String,
  isPrimary: {
    type: Boolean,
    default: false
  }
});

const cartItemSchema = new mongoose.Schema({

  product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', 
      required: true 
  },
  quantity: { 
      type: Number, 
      required: true, 
      min: 1 },
});


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function () {
        return !this.isGoogleAuth;
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === 'local';
      },
    },
    isGoogleAuth: {
      type: Boolean,
      default: false, 
    },
    avatar: {
      type: String,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    addresses: [addressSchema],


    cart: [cartItemSchema],

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
