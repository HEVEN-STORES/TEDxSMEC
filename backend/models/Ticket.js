const mongoose = require('mongoose');
const { Schema } = mongoose;

const TicketSchema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  studentName: { type: String, required: true },
  rollNumber: String,
  year: String,
  department: String,
  email: { type: String, required: true },
  phone: { type: String, required: true },
  ticketCode: { type: String, unique: true, sparse: true },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
