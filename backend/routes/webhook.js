// // // // const crypto = require('crypto');
// // // // const Payment = require('../models/Payment');
// // // // const Ticket = require('../models/Ticket');

// // // // module.exports = async function (req, res) {
// // // //   try {
// // // //     const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
// // // //     const body = req.body.toString();
// // // //     const signature = req.headers['x-razorpay-signature'];
// // // //     if (!signature) return res.status(400).send('missing signature');
// // // //     const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
// // // //     if (signature !== expected) return res.status(400).send('invalid signature');

// // // //     const payload = JSON.parse(body);
// // // //     if (payload.event === 'payment.captured') {
// // // //       const paymentEntity = payload.payload.payment.entity;
// // // //       const orderId = paymentEntity.order_id;
// // // //       const payment = await Payment.findOne({ razorpayOrderId: orderId });
// // // //       if (!payment) return res.status(404).send('payment not found');
// // // //       payment.status = 'paid';
// // // //       payment.razorpayPaymentId = paymentEntity.id;
// // // //       await payment.save();

// // // //       const ticket = await Ticket.findById(payment.ticketId);
// // // //       if (ticket) {
// // // //         ticket.status = 'paid';
// // // //         ticket.ticketCode = `TICK-${ticket._id.toString().slice(-6)}-${Date.now()}`;
// // // //         await ticket.save();
// // // //         // TODO: enqueue email & WhatsApp
// // // //         console.log('Ticket paid:', ticket._id);
// // // //       }
// // // //     }
// // // //     res.json({ ok: true });
// // // //   } catch (err) {
// // // //     console.error(err);
// // // //     res.status(500).send('server error');
// // // //   }
// // // // };



// // // const express = require('express');
// // // const Razorpay = require('razorpay');
// // // const mongoose = require('mongoose');

// // // const Ticket = require('../models/Ticket');
// // // const Event = require('../models/Event'); // ensure Event model path
// // // const {
// // //   generateTicketCode,
// // //   generateQrDataUrl,
// // //   generatePdfBuffer,
// // //   sendTicketEmail,
// // //   sendWhatsAppMessage
// // // } = require('../utils/ticketUtils');

// // // const router = express.Router();

// // // const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, BASE_URL } = process.env;

// // // const razorpay = new Razorpay({
// // //   key_id: RAZORPAY_KEY_ID,
// // //   key_secret: RAZORPAY_KEY_SECRET
// // // });

// // // /**
// // //  * Create booking + razorpay order
// // //  * Request body:
// // //  * {
// // //  *   eventId,
// // //  *   studentName,
// // //  *   email,
// // //  *   phone,
// // //  *   rollNumber, year, department, section
// // //  * }
// // //  */
// // // router.post('/', async (req, res) => {
// // //   try {
// // //     const { eventId, studentName, email, phone, rollNumber, year, department, section } = req.body;
// // //     if (!eventId || !studentName || !email || !phone) {
// // //       return res.status(400).json({ error: 'eventId, studentName, email and phone are required' });
// // //     }

// // //     const event = await Event.findById(eventId);
// // //     if (!event) return res.status(404).json({ error: 'event not found' });

// // //     // create ticket record (pending)
// // //     const ticket = await Ticket.create({
// // //       eventId: event._id,
// // //       studentName,
// // //       rollNumber,
// // //       year,
// // //       department,
// // //       section,
// // //       email,
// // //       phone,
// // //       status: 'pending'
// // //     });

// // //     // order amount in paise (INR)
// // //     const amountPaise = Math.round((event.price || 0) * 100);

// // //     const orderOptions = {
// // //       amount: amountPaise,
// // //       currency: 'INR',
// // //       receipt: ticket._id.toString(),
// // //       payment_capture: 1
// // //     };

// // //     const order = await razorpay.orders.create(orderOptions);

// // //     // return order details and ticket id to client for checkout
// // //     res.json({
// // //       ok: true,
// // //       orderId: order.id,
// // //       amount: order.amount,
// // //       currency: order.currency,
// // //       ticketId: ticket._id,
// // //       razorpayKey: process.env.RAZORPAY_KEY_ID
// // //     });
// // //   } catch (err) {
// // //     console.error('booking create error', err);
// // //     res.status(500).json({ error: err.message });
// // //   }
// // // });

// // // module.exports = router;



// // // backend/routes/webhook.js
// // const express = require('express');
// // const Razorpay = require('razorpay');
// // const mongoose = require('mongoose');

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

// //     // --- generate unique ticket code BEFORE creating the ticket ---
// //     const MAX_ATTEMPTS = 6;
// //     let ticketCode = null;
// //     for (let i = 0; i < MAX_ATTEMPTS; i++) {
// //       const candidate = generateTicketCode(8); // 8 chars
// //       const exists = await Ticket.findOne({ ticketCode: candidate }).lean().select('_id').exec();
// //       if (!exists) {
// //         ticketCode = candidate;
// //         break;
// //       }
// //     }
// //     // fallback (extremely unlikely)
// //     if (!ticketCode) ticketCode = generateTicketCode(10);

// //     // create ticket record (pending) with ticketCode saved immediately
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
// //       ticketCode,
// //       // store a snapshot of event name/price for convenience (optional)
// //       eventName: event.name,
// //       price: event.price ?? 0
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
// //     ticket.razorpayOrderId = order.id;
// //     await ticket.save();

// //     // return order details and ticket id to client for checkout
// //     res.json({
// //       ok: true,
// //       orderId: order.id,
// //       amount: order.amount,
// //       currency: order.currency,
// //       ticketId: ticket._id,
// //       ticketCode: ticket.ticketCode,
// //       razorpayKey: process.env.RAZORPAY_KEY_ID
// //     });
// //   } catch (err) {
// //     console.error('booking create error', err);
// //     res.status(500).json({ error: err.message });
// //   }
// // });

// // module.exports = router;


// const express = require("express");
// const crypto = require("crypto");
// const Ticket = require("../models/Ticket");
// const Event = require("../models/Event");
// const {
//   generateQrDataUrl,
//   generatePdfBuffer,
//   sendTicketEmail,
//   sendWhatsAppMessage
// } = require("../utils/ticketUtils");

// const router = express.Router();

// // =============================
// // RAZORPAY WEBHOOK
// // =============================
// router.post("/", async (req, res) => {
//   try {
//     const signature = req.headers["x-razorpay-signature"];
//     const expected = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(req.rawBody)
//       .digest("hex");

//     if (signature !== expected) {
//       return res.status(400).send("Invalid signature");
//     }

//     const payload = req.body;

//     // only handle payment.captured events
//     if (payload.event !== "payment.captured") {
//       return res.json({ status: "ignored" });
//     }

//     const payment = payload.payload.payment.entity;
//     const razorpayOrderId = payment.order_id;

//     const ticket = await Ticket.findOne({ razorpayOrderId }).populate("eventId");
//     if (!ticket) {
//       console.log("No matching ticket found for webhook");
//       return res.json({ ok: true });
//     }

//     // update ticket
//     ticket.status = "paid";

//     // generate QR
//     ticket.qrDataUrl = await generateQrDataUrl(ticket.ticketCode);

//     // generate PDF
//     const pdf = await generatePdfBuffer(ticket);
//     ticket.pdfTicketBase64 = pdf.toString("base64");

//     await ticket.save();

//     // send email + whatsapp
//     await sendTicketEmail(ticket);
//     await sendWhatsAppMessage(ticket);

//     res.json({ ok: true });

//   } catch (err) {
//     console.error("WEBHOOK ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


// backend/routes/webhook.js
const express = require('express');
const crypto = require('crypto');
const Ticket = require('../models/Ticket');
const { generateQrDataUrl, generateTicketImageBuffer, generatePdfBuffer, sendTicketEmail, sendWhatsAppMessage } = require('../utils/ticketUtils');

const router = express.Router();

// NOTE: server.js already mounts this with express.raw({ type: 'application/json' })
router.post('/', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const body = req.body; // because express.raw was used in server.js the body here is raw buffer; make sure server.js saved raw body on req.rawBody if needed

    // If server.js used: app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookRouter);
    // then req.body is raw buffer; we must compute signature from the raw string
    const raw = req.rawBody || req.body;
    const expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
    if (signature !== expected) {
      console.warn('Invalid webhook signature');
      return res.status(400).send('invalid signature');
    }

    const payload = typeof raw === 'string' ? JSON.parse(raw) : payload = JSON.parse(raw.toString());
    // handle only payment.captured events
    if (payload.event !== 'payment.captured') {
      return res.json({ ok: true });
    }

    const payment = payload.payload.payment.entity;
    const razorpayOrderId = payment.order_id;
    const razorpayPaymentId = payment.id;

    const ticket = await Ticket.findOne({ razorpayOrderId });
    if (!ticket) {
      console.warn('Webhook: ticket not found for order:', razorpayOrderId);
      return res.json({ ok: true });
    }

    // finalize ticket
    ticket.status = 'paid';
    ticket.razorpayPaymentId = razorpayPaymentId;

    // generate assets
    try {
      ticket.qrDataUrl = await generateQrDataUrl(ticket.ticketCode);
      const { filePath } = await generateTicketImageBuffer(ticket);
      ticket.imagePath = `/uploads/tickets/${path.basename(filePath)}`;
      const pdfBuf = await generatePdfBuffer(ticket);
      ticket.pdfTicketBase64 = pdfBuf.toString('base64');
      await ticket.save();

      await sendTicketEmail(ticket);
      await sendWhatsAppMessage(ticket);
    } catch (err) {
      console.error('Webhook asset/email error', err);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Webhook handler error', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
