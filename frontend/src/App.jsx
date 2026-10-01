import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/appointments";

function App() {

    const [appointments, setAppointments] = useState([]);

    const [form, setForm] = useState({
        customerName: "",
        service: "",
        date: "",
        time: "",
        barber: ""
    });

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");


    // Get appointments from the backend
    const getAppointments = async () => {

        try {

            setLoading(true);

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to load appointments");
            }

            const data = await response.json();

            setAppointments(data);

        } catch (error) {

            setMessage(error.message);

        } finally {

            setLoading(false);

        }
    };


    // Load appointments when page opens
    useEffect(() => {
        getAppointments();
    }, []);


    // Handle input changes
    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    // Add or update appointment
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !form.customerName ||
            !form.service ||
            !form.date ||
            !form.time ||
            !form.barber
        ) {

            setMessage("Please complete all fields.");

            return;
        }

        try {

            const method = editingId ? "PUT" : "POST";

            const url = editingId
                ? `${API_URL}/${editingId}`
                : API_URL;

            const response = await fetch(url, {

                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(form)

            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setMessage(
                editingId
                    ? "Appointment updated successfully!"
                    : "Appointment added successfully!"
            );

            resetForm();

            getAppointments();

        } catch (error) {

            setMessage(error.message);

        }

    };


    // Edit appointment
    const editAppointment = (appointment) => {

        setEditingId(appointment.id);

        setForm({
            customerName: appointment.customer_name,
            service: appointment.service,
            date: appointment.appointment_date.substring(0, 10),
            time: appointment.appointment_time.substring(0, 5),
            barber: appointment.barber
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // Delete appointment
    const deleteAppointment = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this appointment?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setMessage(
                "Appointment deleted successfully!"
            );

            getAppointments();

        } catch (error) {

            setMessage(error.message);

        }

    };


    // Reset form
    const resetForm = () => {

        setForm({
            customerName: "",
            service: "",
            date: "",
            time: "",
            barber: ""
        });

        setEditingId(null);

    };


    return (

        <div className="app">

            <header>

                <h1>💈 Blade & Style</h1>

                <p>
                    Barbershop Appointment Booking
                </p>

            </header>


            <main>

                {/* Appointment Form */}

                <section className="form-card">

                    <h2>
                        {editingId
                            ? "Edit Appointment"
                            : "Book an Appointment"}
                    </h2>


                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="customerName"
                            placeholder="Customer Name"
                            value={form.customerName}
                            onChange={handleChange}
                        />


                        <select
                            name="service"
                            value={form.service}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select Service
                            </option>

                            <option value="Haircut">
                                Haircut
                            </option>

                            <option value="Haircut + Beard">
                                Haircut + Beard
                            </option>

                            <option value="Beard Trim">
                                Beard Trim
                            </option>

                            <option value="Hair Color">
                                Hair Color
                            </option>

                        </select>


                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                        />


                        <input
                            type="time"
                            name="time"
                            value={form.time}
                            onChange={handleChange}
                        />


                        <select
                            name="barber"
                            value={form.barber}
                            onChange={handleChange}
                        >

                            <option value="">
                                Select Barber
                            </option>

                            <option value="John">
                                John
                            </option>

                            <option value="Mark">
                                Mark
                            </option>

                            <option value="Alex">
                                Alex
                            </option>

                        </select>


                        <div className="buttons">

                            <button type="submit">

                                {editingId
                                    ? "Update Appointment"
                                    : "Book Appointment"}

                            </button>


                            {editingId && (

                                <button
                                    type="button"
                                    className="cancel"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>

                            )}

                        </div>

                    </form>


                    {message && (

                        <p className="message">
                            {message}
                        </p>

                    )}

                </section>


                {/* Appointment List */}

                <section className="appointments">

                    <h2>Appointments</h2>


                    {loading && (
                        <p>Loading appointments...</p>
                    )}


                    {!loading &&
                        appointments.length === 0 && (

                            <p>
                                No appointments found.
                            </p>

                        )}


                    <div className="appointment-list">

                        {appointments.map(
                            (appointment) => (

                                <div
                                    className="appointment-card"
                                    key={appointment.id}
                                >

                                    <h3>
                                        {appointment.customer_name}
                                    </h3>

                                    <p>
                                        <strong>
                                            Service:
                                        </strong>{" "}
                                        {appointment.service}
                                    </p>

                                    <p>
                                        <strong>
                                            Date:
                                        </strong>{" "}
                                        {appointment.appointment_date}
                                    </p>

                                    <p>
                                        <strong>
                                            Time:
                                        </strong>{" "}
                                        {appointment.appointment_time}
                                    </p>

                                    <p>
                                        <strong>
                                            Barber:
                                        </strong>{" "}
                                        {appointment.barber}
                                    </p>


                                    <div className="card-buttons">

                                        <button
                                            onClick={() =>
                                                editAppointment(
                                                    appointment
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            className="delete"
                                            onClick={() =>
                                                deleteAppointment(
                                                    appointment.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </section>

            </main>

        </div>

    );
}

export default App;