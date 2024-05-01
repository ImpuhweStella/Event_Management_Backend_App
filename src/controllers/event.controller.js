const Event = require('../models/event.model');
const nodemailer = require('nodemailer');

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json({ message: 'Event created successfully', event });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event updated successfully', event });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully', event });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.bookTickets = async (req, res) => {
    try {
        const { ticketsToBook } = req.body;
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.ticketsAvailable < ticketsToBook) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        event.ticketsAvailable -= ticketsToBook;
        event.bookedTickets += ticketsToBook;
        await event.save();

        // sending email logic here

        const transporter = nodemailer.createTransport({
            host: 'smtp.example.com',
            port: 587,
            auth: {
                user: 'username',
                pass: 'password'
            }
        });

        const mailOptions = {
            from: 'your@example.com',
            to: 'recipient@example.com',
            subject: 'Tickets Booked',
            text: 'Your tickets have been booked successfully.'
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
            } else {
                console.log('Email sent:', info.response);
            }
        });


        res.json({ message: 'Tickets booked successfully', event });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
