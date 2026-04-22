const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://itpmsliit:ItpmSliit2026@itpm.fwhtwym.mongodb.net/ITPM_LMS?appName=ITPM";

async function test() {
    console.log("Testing connection to:", MONGO_URI.replace(/:[^:]+@/, ':****@'));
    try {
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("SUCCESS: Connected to Atlas");
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        process.exit(0);
    } catch (err) {
        console.error("FAILED:", err.message);
        process.exit(1);
    }
}

test();
