import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./app/models/User"; // Ajusta la ruta si es necesario
import { Language } from "./app/models/Language"; // Asegúrate de que la ruta sea correcta

async function seedAdmin() {
  await mongoose.connect("mongodb://localhost:27017/avisa-next");

  // Crear usuario administrador si no existe
  const existingUser = await User.findOne({ email: "joragues@gmail.com" });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash("1234", 10);
    const newUser = new User({
      name: "pep",
      email: "joragues@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await newUser.save();
    console.log("Admin user created");
  } else {
    console.log("Admin user already exists");
  }

  // Crear idiomas iniciales si no existen
  const existingLanguages = await Language.find();
  if (existingLanguages.length === 0) {
    const languages = [
      {
        iso: "en",
        names: {
          en: "English",
          es: "Inglés",
        },
      },
      {
        iso: "es",
        names: {
          en: "Spanish",
          es: "Español",
        },
      },
    ];

    await Language.insertMany(languages);
    console.log("Initial languages (English, Spanish) created");
  } else {
    console.log("Languages already exist");
  }

  await mongoose.disconnect();
}

seedAdmin();
