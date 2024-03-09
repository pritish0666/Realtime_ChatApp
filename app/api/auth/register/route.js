import User from "@models/User";
import { connectToDb } from "@mongodb";
import { hash } from "bcryptjs";

export const POST = async (req, res) => {
  try {
    connectToDb();
    const body = await req.json();
    const { username, email, password } = body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return new Response(JSON.stringify(newUser), {status: 200});
  } catch (error) {
    console.log(error);
  }
};
