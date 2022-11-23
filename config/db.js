const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log("Database Connected");
    } catch (error) {
        console.error(error);
        console.log("Database not connected");
        // - if error occurs the below code will exit the process
        process.exit(1);
    }
};

module.exports = connectDB;
