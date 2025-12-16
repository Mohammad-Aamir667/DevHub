const mongoose = require("mongoose");
const User = require("../models/user");
const connectDB = require("../config/db");
require("dotenv").config()


async function run() {
    try {
        await connectDB();

        const result = await User.updateMany(
            { isVerified: { $exists: false } },
            { $set: { isVerified: true } }
        );

        console.log("Updated:", result.modifiedCount);
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}

run();
