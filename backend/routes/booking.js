// // // const express = require('express');
// // // const Event = require('../models/Event');
// // // const Ticket = require('../models/Ticket');
// // // const Payment = require('../models/Payment');
// // // const Razorpay = require('razorpay');

// // // const router = express.Router();
// // // const razor = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID || '', key_secret: process.env.RAZORPAY_KEY_SECRET || '' });

// // // router.post('/:eventId', async (req, res) => {
// // //   try {
// // //     const { eventId } = req.params;
// // //     const { studentName, rollNumber, year, department, email, phone } = req.body;
// // //     if (!studentName || !email || !phone) return res.status(400).json({ error: 'Missing fields' });

// // //     const event = await Event.findById(eventId);
// // //     if (!event) return res.status(404).json({ error: 'Event not found' });

// // //     const ticket = await Ticket.create({ eventId: event._id, studentName, rollNumber, year, department, email, phone, status: 'pending' });

// // //     const amountInPaise = 100 * 100;
// // //     const order = await razor.orders.create({ amount: amountInPaise, currency: 'INR', receipt: `ticket_${ticket._id}`, payment_capture: 1 });

// // //     await Payment.create({ ticketId: ticket._id, razorpayOrderId: order.id, amount: amountInPaise, status: 'created' });

// // //     res.json({ orderId: order.id, amount: amountInPaise, currency: 'INR', key: process.env.RAZORPAY_KEY_ID, ticketId: ticket._id });
// // //   } catch (err) {
// // //     console.error(err); res.status(500).json({ error: 'server error' });
// // //   }
// // // });

// // // module.exports = router;


// // const express = require('express');
// // const Razorpay = require('razorpay');
// // const mongoose = require('mongoose');
// // const { generateReadableCode } = require('../utils/codeGen');

// // const Ticket = require('../models/Ticket');
// // const Event = require('../models/Event'); // ensure Event model path
// // const {
// //   generateTicketCode,
// //   generateQrDataUrl,
// //   generatePdfBuffer,
// //   sendTicketEmail,
// //   sendWhatsAppMessage
// // } = require('../utils/ticketUtils');

// // const router = express.Router();

// // const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, BASE_URL } = process.env;

// // const razorpay = new Razorpay({
// //   key_id: RAZORPAY_KEY_ID,
// //   key_secret: RAZORPAY_KEY_SECRET
// // });

// // /**
// //  * Create booking + razorpay order
// //  * Request body:
// //  * {
// //  *   eventId,
// //  *   studentName,
// //  *   email,
// //  *   phone,
// //  *   rollNumber, year, department, section
// //  * }
// //  */
// // router.post('/', async (req, res) => {
// //   try {
// //     const { eventId, studentName, email, phone, rollNumber, year, department, section } = req.body;
// //     if (!eventId || !studentName || !email || !phone) {
// //       return res.status(400).json({ error: 'eventId, studentName, email and phone are required' });
// //     }

// //     const event = await Event.findById(eventId);
// //     if (!event) return res.status(404).json({ error: 'event not found' });

// //     const MAX_ATTEMPTS = 6;
// //     // create ticket record (pending) — but generate code first
// // let ticketCode;
// // for (let i = 0; i < MAX_ATTEMPTS; i++) {
// //   const candidate = generateReadableCode(8); // 8 chars
// //   const exists = await Ticket.findOne({ ticketCode: candidate }).lean().select('_id').exec();
// //   if (!exists) { ticketCode = candidate; break; }
// // }
// // if (!ticketCode) ticketCode = generateReadableCode(10); // fallback if collisions (very unlikely)


// //     // create ticket record (pending)
// //     const ticket = await Ticket.create({
// //       eventId: event._id,
// //       studentName,
// //       rollNumber,
// //       year,
// //       department,
// //       section,
// //       email,
// //       phone,
// //       status: 'pending',
// //       ticketCode

// //     });

// //     // order amount in paise (INR)
// //     const amountPaise = Math.round((event.price || 0) * 100);

// //     const orderOptions = {
// //       amount: amountPaise,
// //       currency: 'INR',
// //       receipt: ticket._id.toString(),
// //       payment_capture: 1
// //     };

// //     const order = await razorpay.orders.create(orderOptions);
// //     // save razorpay order id on ticket for reliable webhook matching
// //       ticket.razorpayOrderId = order.id;
// //       await ticket.save();

// //     // return order details and ticket id to client for checkout
// //     res.json({
// //       ok: true,
// //       orderId: order.id,
// //       amount: order.amount,
// //       currency: order.currency,
// //       ticketId: ticket._id,
// //       razorpayKey: process.env.RAZORPAY_KEY_ID
// //     });
// //   } catch (err) {
// //     console.error('booking create error', err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // module.exports = router;


// const express = require('express');
// const Razorpay = require('razorpay');
// const Ticket = require('../models/Ticket');
// const Event = require('../models/Event');
// const { generateReadableCode } = require('../utils/codeGen');

// const router = express.Router();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// // =============================
// // CREATE BOOKING + ORDER
// // =============================
// router.post('/', async (req, res) => {
//   try {
//     const { eventId, studentName, email, phone, rollNumber, year, department, section } = req.body;

//     if (!eventId || !studentName || !email || !phone) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const event = await Event.findById(eventId);
//     if (!event) return res.status(404).json({ error: "Event not found" });

//     // generate unique ticket code
//     let ticketCode = null;
//     for (let i = 0; i < 6; i++) {
//       const candidate = generateReadableCode(8);
//       const exists = await Ticket.findOne({ ticketCode: candidate });
//       if (!exists) { ticketCode = candidate; break; }
//     }
//     if (!ticketCode) ticketCode = generateReadableCode(10);

//     // Create pending ticket
//     const ticket = await Ticket.create({
//       eventId,
//       studentName,
//       email,
//       phone,
//       rollNumber,
//       year,
//       department,
//       section,
//       ticketCode,
//       status: "pending"
//     });

//     // prepare Razorpay order
//     const order = await razorpay.orders.create({
//       amount: Math.round((event.price || 0) * 100),
//       currency: "INR",
//       receipt: ticket._id.toString(),
//       payment_capture: 1
//     });

//     ticket.razorpayOrderId = order.id;
//     await ticket.save();

//     res.json({
//       ok: true,
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       ticketId: ticket._id,
//       razorpayKey: process.env.RAZORPAY_KEY_ID
//     });

//   } catch (err) {
//     console.error("BOOKING ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


// backend/routes/booking.js
const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const { generateReadableCode } = require('../utils/codeGen');
const {
  generateQrDataUrl,
  generateTicketImageBuffer,
  generatePdfBuffer,
  sendTicketEmail,
  sendWhatsAppMessage
} = require('../utils/ticketUtils');

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * POST /api/book
 * create ticket (pending) and create razorpay order
 */
router.post('/', async (req, res) => {
  try {
    const { eventId, studentName, email, phone, rollNumber, year, department, section } = req.body;
    if (!eventId || !studentName || !email || !phone) {
      return res.status(400).json({ error: 'eventId, studentName, email and phone are required' });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: 'event not found' });

    // unique code
    let ticketCode = null;
    for (let i = 0; i < 8; i++) {
      const cand = generateReadableCode(8);
      const exists = await Ticket.findOne({ ticketCode: cand }).lean().select('_id').exec();
      if (!exists) { ticketCode = cand; break; }
    }
    if (!ticketCode) ticketCode = generateReadableCode(10);

    const ticket = await Ticket.create({
      eventId: event._id,
      eventName: event.name,
      price: event.price ?? 0,
      studentName,
      rollNumber,
      year,
      department,
      section,
      email,
      phone,
      status: 'pending',
      ticketCode
    });

    // create razorpay order
    const amountPaise = Math.round((event.price || 0) * 100);
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: ticket._id.toString(),
      payment_capture: 1
    });

    ticket.razorpayOrderId = order.id;
    await ticket.save();

    res.json({
      ok: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      ticketId: ticket._id,
      razorpayKey: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error('booking create error', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/book/verify
 * client sends razorpay_order_id, razorpay_payment_id, razorpay_signature, ticketId
 * verify server-side and finalize ticket (create QR, image, pdf, email/whatsapp)
 */
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, ticketId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !ticketId) {
      return res.status(400).json({ error: 'Missing verification parameters' });
    }

    // compute expected signature
    const generated = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // fetch ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    // update payment ids
    ticket.razorpayPaymentId = razorpay_payment_id;
    ticket.status = 'paid';

    // generate qr data url & image & pdf, save
    try {
      ticket.qrDataUrl = await generateQrDataUrl(ticket.ticketCode);

      const { filePath, publicPath } = await generateTicketImageBuffer(ticket); // returns saved file path, public link
      ticket.imagePath = publicPath ? `/uploads/tickets/${path.basename(filePath)}` : `/uploads/tickets/${path.basename(filePath)}`;

      const pdfBuf = await generatePdfBuffer(ticket);
      ticket.pdfTicketBase64 = pdfBuf.toString('base64');

      await ticket.save();
    } catch (err) {
      console.error('ticket asset generation failed', err);
      // continue — ticket saved with status paid
    }

    // send email
    try {
      await sendTicketEmail(ticket);
    } catch (err) {
      console.error('send email failed', err);
    }

    // send whatsapp (optional)
    try {
      await sendWhatsAppMessage(ticket);
    } catch (err) {
      console.error('send whatsapp failed', err);
    }

    // return final ticket
    res.json({ ok: true, data: ticket });
  } catch (err) {
    console.error('verify error', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
