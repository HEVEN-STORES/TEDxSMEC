const express = require('express');
const Event = require('../models/Event');
const Ticket = require('../models/Ticket');
const Payment = require('../models/Payment');
const Razorpay = require('razorpay');

const router = express.Router();
const razor = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID || '', key_secret: process.env.RAZORPAY_KEY_SECRET || '' });

router.post('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { studentName, rollNumber, year, department, email, phone } = req.body;
    if (!studentName || !email || !phone) return res.status(400).json({ error: 'Missing fields' });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const ticket = await Ticket.create({ eventId: event._id, studentName, rollNumber, year, department, email, phone, status: 'pending' });

    const amountInPaise = 100 * 100;
    const order = await razor.orders.create({ amount: amountInPaise, currency: 'INR', receipt: `ticket_${ticket._id}`, payment_capture: 1 });

    await Payment.create({ ticketId: ticket._id, razorpayOrderId: order.id, amount: amountInPaise, status: 'created' });

    res.json({ orderId: order.id, amount: amountInPaise, currency: 'INR', key: process.env.RAZORPAY_KEY_ID, ticketId: ticket._id });
  } catch (err) {
    console.error(err); res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
