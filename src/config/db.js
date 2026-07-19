const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      autoIndex: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("========================================");
    console.log("✅ MongoDB Atlas Connected");
    console.log(`📂 Database : ${conn.connection.name}`);
    console.log(`🖥️  Host     : ${conn.connection.host}`);
    console.log("========================================");
  } catch (error) {
    console.error("========================================");
    console.error("❌ MongoDB Connection Failed");
    console.error(error.message);
    console.error("========================================");

    process.exit(1);
  }
};

module.exports = connectDB;