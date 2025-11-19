import mongoose from "mongoose";

const db = async () => {
  try {
    const dbConnection = await mongoose.connect(
      process.env.DATABASE_CONNECTION
    );
    console.log(`DataBase connected to ${dbConnection.connection.host}`);
  } catch (error) {
    console.log("err", error);
    process.exit(1);
  }
};

export default db;
