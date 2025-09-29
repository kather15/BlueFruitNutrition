import mongoose from "mongoose";

const emailVerificationTokenSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 2, // 2 horas
  },
});

export default mongoose.model("EmailVerificationToken", emailVerificationTokenSchema);
