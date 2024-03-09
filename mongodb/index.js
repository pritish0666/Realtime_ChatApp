import mongoose from "mongoose";

let isConnected = false;

export const connectToDb = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("using existing connection");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "Chit-Chat",
      useNewUrlParser: true,
      useUnifiedTopology: true,


    });
    isConnected=true
    console.log('connected to db successfully')
  } catch (error) {
    console.log("error in connecting to db");
  }
  
};
