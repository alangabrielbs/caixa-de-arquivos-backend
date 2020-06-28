import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const User = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokenForgotPassword: {
      type: String,
      default: null,
    },
    tokenForgotPasswordExpire: {
      type: String,
      default: null,
    },
    verifiedEmail: {
      type: String,
      default: false,
    },
    tokenCheckEmail: {
      type: String,
      required: false,
    },
    betaTester: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

User.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 8);
});

User.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", User, "users");
