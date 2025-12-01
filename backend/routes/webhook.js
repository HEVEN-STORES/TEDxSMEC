const crypto = require('crypto');
const Payment = require('../models/Payment');
const Ticket = require('../models/Ticket');

module.exports = async function (req, res) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const body = req.body.toString();
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) return res.status(400).send('missing signature');
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (signature !== expected) return res.status(400).send('invalid signature');

    const payload = JSON.parse(body);
    if (payload.event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const payment = await Payment.findOne({ razorpayOrderId: orderId });
      if (!payment) return res.status(404).send('payment not found');
      payment.status = 'paid';
      payment.razorpayPaymentId = paymentEntity.id;
      await payment.save();

      const ticket = await Ticket.findById(payment.ticketId);
      if (ticket) {
        ticket.status = 'paid';
        ticket.ticketCode = `TICK-${ticket._id.toString().slice(-6)}-${Date.now()}`;
        await ticket.save();
        // TODO: enqueue email & WhatsApp
        console.log('Ticket paid:', ticket._id);
      }
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('server error');
  }
};
