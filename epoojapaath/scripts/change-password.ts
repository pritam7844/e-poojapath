import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import User from "../models/User";

const MONGODB_URI = process.env.MONGODB_URI!;

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error("❌ Usage: npx tsx scripts/change-password.ts <email> <newPassword>");
    process.exit(1);
  }

  if (!MONGODB_URI) {
    console.error("❌ Missing MONGODB_URI in .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("🔗 Connected to MongoDB");

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.error(`❌ User not found with email: ${email}`);
    process.exit(1);
  }

  const hashedPw = await bcrypt.hash(newPassword, 12);
  user.password = hashedPw;
  await user.save();

  console.log(`✅ Password updated successfully for user: ${email} (${user.role})`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
