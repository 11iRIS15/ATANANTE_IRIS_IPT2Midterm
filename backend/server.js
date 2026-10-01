const express = require("express");
const cors = require("cors");
require("dotenv").config();

const appointmentRoutes = require("./routes/appointments");

const app = express();

app.use(cors());
app.use(express.json());

// Appointment REST API
app.use("/api/appointments", appointmentRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Barbershop Appointment API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});