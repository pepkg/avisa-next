import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./app/models/User"; // Ajusta la ruta si es necesario

async function seedAdminUser() {
  await mongoose.connect("mongodb://localhost:27017/avisa-next");

  const existingUser = await User.findOne({ email: "pep@mail.com" });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("1234", 10);
    const newUser = new User({
      name: "pep",
      email: "pep@mail.com",
      password: hashedPassword,
      role: "admin",
    });

    await newUser.save();
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }

  await mongoose.disconnect();
}

seedAdminUser();
