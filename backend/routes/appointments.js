const express = require("express");
const router = express.Router();

const pool = require("../db");

// GET - View all appointments
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM appointments ORDER BY appointment_date, appointment_time"
        );

        res.json(rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get appointments"
        });
    }
});


// POST - Add a new appointment
router.post("/", async (req, res) => {

    const {
        customerName,
        service,
        date,
        time,
        barber
    } = req.body;

    // Check required fields
    if (!customerName || !service || !date || !time || !barber) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {

        const [result] = await pool.query(
            `INSERT INTO appointments
            (customer_name, service, appointment_date, appointment_time, barber)
            VALUES (?, ?, ?, ?, ?)`,
            [
                customerName,
                service,
                date,
                time,
                barber
            ]
        );

        // Get the newly created appointment
        const [newAppointment] = await pool.query(
            "SELECT * FROM appointments WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json(newAppointment[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create appointment"
        });
    }
});


// PUT - Update an appointment
router.put("/:id", async (req, res) => {

    const { id } = req.params;

    const {
        customerName,
        service,
        date,
        time,
        barber
    } = req.body;

    // Check required fields
    if (!customerName || !service || !date || !time || !barber) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {

        const [result] = await pool.query(
            `UPDATE appointments
             SET customer_name = ?,
                 service = ?,
                 appointment_date = ?,
                 appointment_time = ?,
                 barber = ?
             WHERE id = ?`,
            [
                customerName,
                service,
                date,
                time,
                barber,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        const [updatedAppointment] = await pool.query(
            "SELECT * FROM appointments WHERE id = ?",
            [id]
        );

        res.json(updatedAppointment[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update appointment"
        });
    }
});


// DELETE - Delete an appointment
router.delete("/:id", async (req, res) => {

    const { id } = req.params;

    try {

        const [result] = await pool.query(
            "DELETE FROM appointments WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        res.json({
            message: "Appointment deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to delete appointment"
        });
    }
});


module.exports = router;