require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const authRoutes = require("./routes/authRoutes");
const turfRoutes = require("./routes/turfRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET","POST","PUT","DELETE","PATCH"],
    allowedHeaders: ["Content-Type","Authorization"],
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/turfs",turfRoutes);
app.use("/api/v1/bookings",bookingRoutes);

app.use("/uploads",express.static(path.join(__dirname,"uploads")));
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});