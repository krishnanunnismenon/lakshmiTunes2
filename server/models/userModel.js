import mongoose from "mongoose";

// Creating user Schema
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
      type: String,
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
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
