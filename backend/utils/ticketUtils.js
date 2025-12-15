// const crypto = require('crypto');
// const QRCode = require('qrcode');
// const PDFDocument = require('pdfkit');
// const nodemailer = require('nodemailer');
// const { Twilio } = require('twilio');

// const {
//   EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASS,
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, BASE_URL
// } = process.env;

// /* ------------------- helpers ------------------- */

// function generateTicketCode(length = 8) {
//   // readable uppercase alphanumeric
//   const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
//   let out = '';
//   const bytes = crypto.randomBytes(length);
//   for (let i = 0; i < length; i++) out += chars[bytes[i] % chars.length];
//   return out;
// }

// async function generateQrDataUrl(text) {
//   return QRCode.toDataURL(text, { errorCorrectionLevel: 'H', type: 'image/png', margin: 1 });
// }

// function generatePdfBuffer({ ticket }) {
//   return new Promise((resolve, reject) => {
//     try {
//       const doc = new PDFDocument({ size: 'A4', margin: 40 });
//       const bufs = [];
//       doc.on('data', (b) => bufs.push(b));
//       doc.on('end', () => resolve(Buffer.concat(bufs)));

//       doc.fontSize(20).text('Event Ticket', { align: 'center' });
//       doc.moveDown();

//       doc.fontSize(14).text(ticket.eventName || 'Event');
//       doc.moveDown(0.5);

//       doc.fontSize(12).text(`Name: ${ticket.studentName}`);
//       if (ticket.rollNumber) doc.text(`Roll No: ${ticket.rollNumber}`);
//       if (ticket.department) doc.text(`Dept: ${ticket.department}`);
//       if (ticket.section) doc.text(`Section: ${ticket.section}`);
//       doc.text(`Phone: ${ticket.phone}`);
//       doc.text(`Email: ${ticket.email}`);
//       doc.moveDown();

//       doc.fontSize(12).text(`Ticket Code: ${ticket.ticketCode}`, { underline: true });
//       doc.moveDown();

//       if (ticket.qrDataUrl) {
//         const base64Data = ticket.qrDataUrl.replace(/^data:image\/\w+;base64,/, '');
//         const imgBuff = Buffer.from(base64Data, 'base64');
//         doc.image(imgBuff, { fit: [180, 180] });
//         doc.moveDown();
//       }

//       doc.fontSize(9).text(`Issued: ${new Date(ticket.createdAt).toLocaleString()}`);
//       doc.end();
//     } catch (err) {
//       reject(err);
//     }
//   });
// }

// /* ------------------- email transporter ------------------- */

// const transporter = nodemailer.createTransport({
//   host: EMAIL_HOST,
//   port: EMAIL_PORT ? Number(EMAIL_PORT) : 587,
//   secure: EMAIL_SECURE === 'true' || EMAIL_SECURE === true,
//   auth: {
//     user: EMAIL_USER,
//     pass: EMAIL_PASS
//   }
// });

// /* ------------------- twilio client ------------------- */
// const twClient = (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN)
//   ? new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
//   : null;

// /* ------------------- senders ------------------- */

// async function sendTicketEmail({ to, subject, text, pdfBuffer, ticketCode }) {
//   if (!EMAIL_USER) {
//     console.warn('EMAIL not configured; skipping email send');
//     return;
//   }
//   const mailOpts = {
//     from: EMAIL_USER,
//     to,
//     subject: subject || `Your ticket (${ticketCode})`,
//     text: text || `Your ticket code: ${ticketCode}`,
//     attachments: pdfBuffer ? [{ filename: `ticket-${ticketCode}.pdf`, content: pdfBuffer }] : []
//   };
//   return transporter.sendMail(mailOpts);
// }

// async function sendWhatsAppMessage({ toPhone, message }) {
//   if (!twClient || !TWILIO_WHATSAPP_FROM) {
//     console.warn('Twilio not configured; skipping WhatsApp send');
//     return;
//   }
//   // ensure phone includes country code and is like +91...
//   return twClient.messages.create({
//     from: `whatsapp:${TWILIO_WHATSAPP_FROM.replace(/^whatsapp:/, '')}`,
//     to: `whatsapp:${toPhone}`,
//     body: message
//   });
// }

// module.exports = {
//   generateTicketCode,
//   generateQrDataUrl,
//   generatePdfBuffer,
//   sendTicketEmail,
//   sendWhatsAppMessage
// };


// backend/utils/ticketUtils.js
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { createCanvas, loadImage, registerFont } = require('canvas');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const mkdirp = require('mkdirp');

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, FROM_EMAIL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, BASE_URL } = process.env;

const uploadsDir = path.join(__dirname, '..', 'uploads', 'tickets');
mkdirp.sync(uploadsDir);

// Optionally register a font if you want (ensure the font file exists)
// registerFont(path.join(__dirname, 'fonts', 'Inter-Regular.ttf'), { family: 'Inter' });

/**
 * generate QR data URL (png)
 */
async function generateQrDataUrl(text) {
  return QRCode.toDataURL(String(text), { errorCorrectionLevel: 'M', margin: 1, width: 400 });
}

/**
 * create ticket image (PNG) using canvas
 * Returns: { buffer, filePath }
 */
async function generateTicketImageBuffer(ticket) {
  // ticket: { ticketCode, studentName, rollNumber, eventName, createdAt }
  const w = 1000, h = 600;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');

  // background
  ctx.fillStyle = '#0b0b0b';
  ctx.fillRect(0, 0, w, h);

  // left panel - QR area
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(36, 36, 420, 420);

  // draw QR image
  const qrDataUrl = await generateQrDataUrl(ticket.ticketCode);
  const qrImg = await loadImage(qrDataUrl);
  // fit qr into white box with padding
  const pad = 24;
  ctx.drawImage(qrImg, 36 + pad, 36 + pad, 420 - pad*2, 420 - pad*2);

  // right panel content
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 36px Sans';
  ctx.fillText('TEDx', 480, 100);

  ctx.font = '700 28px Sans';
  ctx.fillStyle = '#ff3b3b';
  ctx.fillText(ticket.eventName || 'Event', 480, 150);

  ctx.font = '600 22px Sans';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`Name: ${ticket.studentName}`, 480, 210);

  if (ticket.rollNumber) ctx.fillText(`Roll: ${ticket.rollNumber}`, 480, 250);
  if (ticket.year || ticket.department || ticket.section) {
    const parts = [];
    if (ticket.year) parts.push(ticket.year);
    if (ticket.department) parts.push(ticket.department);
    if (ticket.section) parts.push(ticket.section);
    ctx.fillText(`Class: ${parts.join(' / ')}`, 480, 290);
  }

  ctx.fillStyle = '#cccccc';
  ctx.font = '500 16px Sans';
  ctx.fillText(`Code: ${ticket.ticketCode}`, 480, 330);

  ctx.fillStyle = '#999';
  ctx.font = '400 14px Sans';
  const created = ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : '';
  ctx.fillText(`Issued: ${created}`, 480, 360);

  // small footer
  ctx.fillStyle = '#666';
  ctx.font = '400 12px Sans';
  ctx.fillText('Present this QR at the gate for verification', 480, 520);

  const buffer = canvas.toBuffer('image/png'); // PNG buffer

  // save to uploads
  const fileName = `${ticket._id || Date.now()}-${ticket.ticketCode}.png`;
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, buffer);

  // accessible URL to serve: BASE_URL/uploads/tickets/<fileName>
  const publicPath = (process.env.BASE_URL || BASE_URL || '').replace(/\/$/, '') + `/uploads/tickets/${fileName}`;

  return { buffer, filePath, publicPath };
}

/**
 * generate PDF ticket as buffer (embedding the PNG).
 */
async function generatePdfBuffer(ticket) {
  // generate PNG first
  const { buffer: imgBuf } = await generateTicketImageBuffer(ticket);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const buffers = [];
    doc.on('data', (b) => buffers.push(b));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.image(imgBuf, { fit: [500, 500], align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Name: ${ticket.studentName}`);
    doc.text(`Event: ${ticket.eventName || ''}`);
    doc.text(`Code: ${ticket.ticketCode}`);
    doc.end();
  });
}

/**
 * send ticket email with attachments (PNG + PDF)
 */
async function sendTicketEmail(ticket) {
  if (!SMTP_HOST || !SMTP_USER) {
    console.warn('SMTP not configured - skipping email send');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT || 587) === 465, // true for 465, false for others
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });

  // ensure image and pdf exist
  let pngPath;
  try {
    const { filePath } = await generateTicketImageBuffer(ticket);
    pngPath = filePath;
  } catch (err) {
    console.error('Failed to generate ticket PNG for email', err);
  }

  let pdfBuf;
  try {
    pdfBuf = await generatePdfBuffer(ticket);
  } catch (err) {
    console.error('Failed to generate PDF', err);
  }

  const attachments = [];
  if (pngPath && fs.existsSync(pngPath)) attachments.push({ filename: `${ticket.ticketCode}.png`, path: pngPath });
  if (pdfBuf) attachments.push({ filename: `${ticket.ticketCode}.pdf`, content: pdfBuf });

  const mailOptions = {
    from: FROM_EMAIL || SMTP_USER,
    to: ticket.email,
    subject: `Your ticket for ${ticket.eventName || 'Event'} — ${ticket.ticketCode}`,
    text: `Hi ${ticket.studentName},\n\nYour ticket code: ${ticket.ticketCode}\nPresent the QR at entry.\n\nRegards.`,
    attachments
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

/**
 * send WhatsApp message via Twilio (if configured). Falls back to console.log
 */
async function sendWhatsAppMessage(ticket) {
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_WHATSAPP_FROM) {
    try {
      const twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      const to = `whatsapp:${ticket.phone.replace(/[^0-9]/g, '')}`;
      const from = `whatsapp:${TWILIO_WHATSAPP_FROM}`;
      const body = `Hi ${ticket.studentName}, your ticket code for ${ticket.eventName || ''} is ${ticket.ticketCode}.`;
      const mediaUrl = ticket.imagePath ? ( (process.env.BASE_URL || BASE_URL || '').replace(/\/$/,'') + ticket.imagePath.replace(/^\//,'/') ) : undefined;
      const msg = await twilio.messages.create({ from, to, body, ...(mediaUrl ? { mediaUrl: [mediaUrl] } : {}) });
      return msg;
    } catch (err) {
      console.error('Twilio WhatsApp send failed', err);
      return null;
    }
  } else {
    console.log(`(WhatsApp) To ${ticket.phone}: Your ticket code is ${ticket.ticketCode}`);
    return null;
  }
}

module.exports = {
  generateQrDataUrl,
  generateTicketImageBuffer,
  generatePdfBuffer,
  sendTicketEmail,
  sendWhatsAppMessage
};
