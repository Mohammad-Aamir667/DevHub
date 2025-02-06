const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const connectDB = require("../config/db"); 
const User = require("../models/user"); 

async function createSuperAdmin() {
    try {
        await connectDB();
        console.log("Connected to the database for Super Admin creation.");
        const existingAdmin = await User.findOne({ emailId: "aamireverlasting786@gmail.com" });
        if (existingAdmin){
            console.log("Super Admin already exists. No action taken.");
            return;
        }
        const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);
        const superAdmin = new User({
            firstName: "Mohammad",
            lastName: "Aamir",
            emailId: "aamireverlasting786@gmail.com",
            password: hashedPassword,
            role: "super-admin",
        });

        await superAdmin.save();
        console.log("Super Admin created successfully!");
    } catch (err) {
        console.error("Error creating Super Admin:", err);
    } finally {
        mongoose.connection.close();
        console.log("Database connection closed.");
    }
}

createSuperAdmin();
