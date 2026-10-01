# Barbershop Appointment Booking System

## Purpose

The Barbershop Appointment Booking System allows customers to book
and manage appointments. The system records the customer name,
service, date, time, and selected barber.

## Technologies

- React
- Node.js
- Express
- MySQL
- XAMPP
- Git
- GitHub

## Database

The system uses MySQL through XAMPP.

The database is named:

barbershop_db

The main table is:

appointments

## Why MySQL?

MySQL was chosen because appointment data is structured and organized
into specific fields. It is easy to use with XAMPP and phpMyAdmin.
MySQL also allows the system to save appointment records permanently.
The database supports creating, viewing, updating, and deleting records.

## How to Run

### 1. Start XAMPP

Start:

- Apache
- MySQL

### 2. Start Backend

```bash
cd backend
npm install
npm run dev