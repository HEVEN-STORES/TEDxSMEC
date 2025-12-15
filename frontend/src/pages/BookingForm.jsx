// // // // frontend/src/pages/BookingForm.jsx
// // // import React, { useState, useEffect } from "react";
// // // import { useParams, Link } from "react-router-dom";
// // // import { api } from "../api";

// // // export default function BookingForm() {
// // //   const { slug } = useParams(); // expects route: /events/:slug/book
// // //   const [event, setEvent] = useState(null);
// // //   const [loadingEvent, setLoadingEvent] = useState(true);

// // //   const [form, setForm] = useState({
// // //     name: "",
// // //     email: "",
// // //     phone: "",
// // //     tickets: 1,
// // //     note: "",
// // //   });

// // //   const [submitting, setSubmitting] = useState(false);
// // //   const [result, setResult] = useState({ ok: null, message: "" });

// // //   useEffect(() => {
// // //     let mounted = true;
// // //     const load = async () => {
// // //       try {
// // //         setLoadingEvent(true);
// // //         const res = await api.get(`/events/${encodeURIComponent(slug)}`);
// // //         const payload = res?.data?.success ? res.data.data : res.data;
// // //         if (mounted) setEvent(payload || null);
// // //       } catch (err) {
// // //         console.error("Failed to load event for booking:", err);
// // //         if (mounted) setEvent(null);
// // //       } finally {
// // //         if (mounted) setLoadingEvent(false);
// // //       }
// // //     };
// // //     load();
// // //     return () => { mounted = false; };
// // //   }, [slug]);

// // //   const handleChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setForm(prev => ({ ...prev, [name]: name === "tickets" ? Math.max(1, Number(value)) : value }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setSubmitting(true);
// // //     setResult({ ok: null, message: "" });
// // //     try {
// // //       // POST to booking endpoint (adjust endpoint if your backend uses a different path)
// // //       const payload = {
// // //         name: form.name,
// // //         email: form.email,
// // //         phone: form.phone,
// // //         tickets: Number(form.tickets) || 1,
// // //         note: form.note,
// // //       };

// // //       // If your backend wants event id instead of slug, send event._id too (safe)
// // //       if (event?._id) payload.eventId = event._id;

// // //       const res = await api.post(`/events/${encodeURIComponent(slug)}/book`, payload);
// // //       const data = res?.data || {};

// // //       if (res.status >= 200 && res.status < 300) {
// // //         setResult({ ok: true, message: data?.message || "Booking successful! We'll send confirmation to your email." });
// // //       } else {
// // //         setResult({ ok: false, message: data?.message || "Booking failed. Please try again." });
// // //       }
// // //     } catch (err) {
// // //       console.error("Booking error:", err);
// // //       setResult({ ok: false, message: err?.response?.data?.message || "Booking failed. Please try again." });
// // //     } finally {
// // //       setSubmitting(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="max-w-3xl mx-auto p-6 text-white">
// // //       <h1 className="text-2xl font-bold text-red-400 mb-4">Book Tickets</h1>

// // //       {loadingEvent ? (
// // //         <div className="bg-gray-900 p-4 rounded">Loading event...</div>
// // //       ) : !event ? (
// // //         <div className="bg-red-700 p-4 rounded">Event not found. <Link to="/events" className="underline ml-2">Back to events</Link></div>
// // //       ) : (
// // //         <>
// // //           <div className="bg-gray-900 p-4 rounded mb-6 border border-red-700">
// // //             <h2 className="text-xl font-semibold">{event.name || event.title}</h2>
// // //             <p className="text-sm text-gray-300 mt-1">{event.date ? new Date(event.date).toLocaleString() : "Date TBA"}</p>
// // //             <p className="text-sm text-gray-300 mt-2 line-clamp-3">{event.description}</p>
// // //           </div>

// // //           {result.ok === true && (
// // //             <div className="bg-green-700 text-white p-4 rounded mb-4">
// // //               {result.message} — <Link to="/events" className="underline">Back to events</Link>
// // //             </div>
// // //           )}

// // //           {result.ok === false && (
// // //             <div className="bg-red-700 text-white p-4 rounded mb-4">
// // //               {result.message}
// // //             </div>
// // //           )}

// // //           <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded shadow space-y-4 border border-red-700">
// // //             <div>
// // //               <label className="block text-sm text-gray-300 mb-1">Full name</label>
// // //               <input
// // //                 name="name"
// // //                 value={form.name}
// // //                 onChange={handleChange}
// // //                 required
// // //                 className="w-full p-3 bg-black border border-gray-700 rounded"
// // //                 placeholder="Your full name"
// // //               />
// // //             </div>

// // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //               <div>
// // //                 <label className="block text-sm text-gray-300 mb-1">Email</label>
// // //                 <input
// // //                   name="email"
// // //                   type="email"
// // //                   value={form.email}
// // //                   onChange={handleChange}
// // //                   required
// // //                   className="w-full p-3 bg-black border border-gray-700 rounded"
// // //                   placeholder="name@example.com"
// // //                 />
// // //               </div>

// // //               <div>
// // //                 <label className="block text-sm text-gray-300 mb-1">Phone</label>
// // //                 <input
// // //                   name="phone"
// // //                   value={form.phone}
// // //                   onChange={handleChange}
// // //                   className="w-full p-3 bg-black border border-gray-700 rounded"
// // //                   placeholder="+91 9XXXXXXXXX"
// // //                 />
// // //               </div>
// // //             </div>

// // //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// // //               <div>
// // //                 <label className="block text-sm text-gray-300 mb-1">Tickets</label>
// // //                 <input
// // //                   name="tickets"
// // //                   type="number"
// // //                   min="1"
// // //                   value={form.tickets}
// // //                   onChange={handleChange}
// // //                   className="w-full p-3 bg-black border border-gray-700 rounded"
// // //                 />
// // //               </div>

// // //               <div>
// // //                 <label className="block text-sm text-gray-300 mb-1">Note (optional)</label>
// // //                 <input
// // //                   name="note"
// // //                   value={form.note}
// // //                   onChange={handleChange}
// // //                   className="w-full p-3 bg-black border border-gray-700 rounded"
// // //                   placeholder="Any dietary/accessibility needs"
// // //                 />
// // //               </div>
// // //             </div>

// // //             <div className="flex items-center gap-3">
// // //               <button
// // //                 type="submit"
// // //                 disabled={submitting || result.ok === true}
// // //                 className={`px-4 py-2 rounded ${submitting ? "bg-gray-700" : "bg-red-600 hover:bg-red-500"}`}
// // //               >
// // //                 {submitting ? "Booking..." : "Confirm booking"}
// // //               </button>

// // //               <Link to={`/events/${event.slug || event._id || event.id}`} className="text-sm text-gray-300 hover:underline">
// // //                 Back to event
// // //               </Link>
// // //             </div>
// // //           </form>
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // }



// // // frontend/src/pages/BookingCheckout.jsx
// // import React, { useEffect, useState } from "react";
// // import { useParams, Link } from "react-router-dom";
// // import { api } from "../api";

// // /**
// //  * Loads Razorpay script dynamically
// //  */
// // function loadRazorpayScript() {
// //   return new Promise((resolve, reject) => {
// //     if (window.Razorpay) return resolve(true);
// //     const script = document.createElement("script");
// //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
// //     script.async = true;
// //     script.onload = () => resolve(true);
// //     script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
// //     document.body.appendChild(script);
// //   });
// // }

// // export default function BookingCheckout() {
// //   const { slug } = useParams();
// //   const [event, setEvent] = useState(null);
// //   const [loadingEvent, setLoadingEvent] = useState(true);

// //   const [form, setForm] = useState({
// //     name: "",
// //     email: "",
// //     phone: "",
// //     tickets: 1,
// //     note: "",
// //   });

// //   const [busy, setBusy] = useState(false);
// //   const [message, setMessage] = useState(null);

// //   // payment / ticket state
// //   const [ticket, setTicket] = useState(null); // final ticket returned after verify
// //   const [orderInfo, setOrderInfo] = useState(null); // orderId, ticketId, razorpayKey

// //   useEffect(() => {
// //     let mounted = true;
// //     const load = async () => {
// //       try {
// //         setLoadingEvent(true);
// //         const res = await api.get(`/events/${encodeURIComponent(slug)}`);
// //         const payload = res?.data?.success ? res.data.data : res.data;
// //         if (mounted) setEvent(payload || null);
// //       } catch (err) {
// //         console.error("Failed to load event:", err);
// //         if (mounted) setEvent(null);
// //       } finally {
// //         if (mounted) setLoadingEvent(false);
// //       }
// //     };
// //     load();
// //     return () => { mounted = false; };
// //   }, [slug]);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setForm(prev => ({ ...prev, [name]: name === "tickets" ? Math.max(1, Number(value)) : value }));
// //   };

// //   async function startCheckout(orderId, razorpayKey, ticketId) {
// //     await loadRazorpayScript();

// //     const options = {
// //       key: razorpayKey,
// //       amount: orderInfo?.amount ?? 0, // fallback
// //       currency: orderInfo?.currency ?? 'INR',
// //       name: event?.name || "Event",
// //       description: `Ticket for ${event?.name || ''}`,
// //       order_id: orderId,
// //       handler: async function (response) {
// //         // response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature
// //         try {
// //           setMessage({ type: "info", text: "Verifying payment..." });
// //           const verifyRes = await api.post("/api/book/verify", {
// //             razorpay_order_id: response.razorpay_order_id,
// //             razorpay_payment_id: response.razorpay_payment_id,
// //             razorpay_signature: response.razorpay_signature,
// //             ticketId
// //           });
// //           const ticketObj = verifyRes?.data?.data ?? verifyRes?.data ?? verifyRes;
// //           setTicket(ticketObj);
// //           setMessage({ type: "success", text: "Payment verified — ticket generated." });
// //         } catch (err) {
// //           console.error("verify error", err);
// //           setMessage({ type: "error", text: err?.response?.data?.error || "Payment verified but server failed to finalize ticket." });
// //         } finally {
// //           setBusy(false);
// //         }
// //       },
// //       modal: {
// //         escape: true,
// //         ondismiss: function() {
// //           setMessage({ type: "warning", text: "Payment cancelled." });
// //           setBusy(false);
// //         }
// //       },
// //       prefill: {
// //         name: form.name,
// //         email: form.email,
// //         contact: form.phone
// //       }
// //     };

// //     const rzp = new window.Razorpay(options);
// //     rzp.open();
// //   }

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setBusy(true);
// //     setMessage(null);
// //     setTicket(null);

// //     try {
// //       // create booking + razorpay order on server
// //       const payload = {
// //         eventId: event?._id,
// //         studentName: form.name,
// //         email: form.email,
// //         phone: form.phone,
// //         rollNumber: "", // optional fields
// //         year: "",
// //         department: "",
// //         section: ""
// //       };

// //       // endpoint used in backend examples: POST /api/book
// //       const res = await api.post("/api/book", payload);
// //       const data = res.data ?? {};
// //       // expects: { orderId, amount, currency, ticketId, razorpayKey, ticketCode? }
// //       setOrderInfo(data);

// //       // if backend returned ticketCode immediately we can show it; but start checkout for payment
// //       if (!data?.orderId) {
// //         // no order -> maybe free ticket or already finalised
// //         setMessage({ type: "success", text: data?.message || "Booking created." });
// //         if (data?.ticket) setTicket(data.ticket);
// //         setBusy(false);
// //         return;
// //       }

// //       // open razorpay checkout
// //       await startCheckout(data.orderId, data.razorpayKey || data.key || process.env.REACT_APP_RAZORPAY_KEY, data.ticketId);

// //     } catch (err) {
// //       console.error("booking error", err);
// //       setMessage({ type: "error", text: err?.response?.data?.error || err?.message || "Failed to create booking" });
// //       setBusy(false);
// //     }
// //   };

// //   function downloadPdf(base64OrDataUrl, filename = "ticket.pdf") {
// //     if (!base64OrDataUrl) return;
// //     let dataUrl = base64OrDataUrl;
// //     if (!dataUrl.startsWith("data:")) dataUrl = `data:application/pdf;base64,${base64OrDataUrl}`;
// //     const link = document.createElement("a");
// //     link.href = dataUrl;
// //     link.download = filename;
// //     document.body.appendChild(link);
// //     link.click();
// //     link.remove();
// //   }

// //   return (
// //     <div className="max-w-3xl mx-auto p-6 text-white">
// //       <h1 className="text-2xl font-bold text-red-400 mb-4">Book Tickets</h1>

// //       {loadingEvent ? (
// //         <div className="bg-gray-900 p-4 rounded">Loading event...</div>
// //       ) : !event ? (
// //         <div className="bg-red-700 p-4 rounded">Event not found. <Link to="/events" className="underline ml-2">Back to events</Link></div>
// //       ) : (
// //         <>
// //           <div className="bg-gray-900 p-4 rounded mb-6 border border-red-700">
// //             <h2 className="text-xl font-semibold">{event.name || event.title}</h2>
// //             <p className="text-sm text-gray-300 mt-1">{event.date ? new Date(event.date).toLocaleString() : "Date TBA"}</p>
// //             <p className="text-sm text-gray-300 mt-2 line-clamp-3">{event.description}</p>
// //             <div className="mt-3 text-sm text-gray-300">Price: <span className="font-semibold text-white">{(event.price ?? 0) > 0 ? `₹${event.price}` : "Free"}</span></div>
// //           </div>

// //           {message && (
// //             <div className={`${message.type === "error" ? "bg-red-700" : message.type === "success" ? "bg-green-700" : "bg-yellow-700"} text-white p-3 rounded mb-4`}>
// //               {message.text}
// //             </div>
// //           )}

// //           {!ticket ? (
// //             <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded shadow space-y-4 border border-red-700">
// //               <div>
// //                 <label className="block text-sm text-gray-300 mb-1">Full name</label>
// //                 <input
// //                   name="name"
// //                   value={form.name}
// //                   onChange={handleChange}
// //                   required
// //                   className="w-full p-3 bg-black border border-gray-700 rounded"
// //                   placeholder="Your full name"
// //                 />
// //               </div>

// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-sm text-gray-300 mb-1">Email</label>
// //                   <input
// //                     name="email"
// //                     type="email"
// //                     value={form.email}
// //                     onChange={handleChange}
// //                     required
// //                     className="w-full p-3 bg-black border border-gray-700 rounded"
// //                     placeholder="name@example.com"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm text-gray-300 mb-1">Phone</label>
// //                   <input
// //                     name="phone"
// //                     value={form.phone}
// //                     onChange={handleChange}
// //                     className="w-full p-3 bg-black border border-gray-700 rounded"
// //                     placeholder="+91 9XXXXXXXXX"
// //                   />
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                 <div>
// //                   <label className="block text-sm text-gray-300 mb-1">Tickets</label>
// //                   <input
// //                     name="tickets"
// //                     type="number"
// //                     min="1"
// //                     value={form.tickets}
// //                     onChange={handleChange}
// //                     className="w-full p-3 bg-black border border-gray-700 rounded"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm text-gray-300 mb-1">Note (optional)</label>
// //                   <input
// //                     name="note"
// //                     value={form.note}
// //                     onChange={handleChange}
// //                     className="w-full p-3 bg-black border border-gray-700 rounded"
// //                     placeholder="Any dietary/accessibility needs"
// //                   />
// //                 </div>
// //               </div>

// //               <div className="flex items-center gap-3">
// //                 <button
// //                   type="submit"
// //                   disabled={busy}
// //                   className={`px-4 py-2 rounded ${busy ? "bg-gray-700" : "bg-red-600 hover:bg-red-500"}`}
// //                 >
// //                   {busy ? "Processing..." : `Pay & Book${event.price ? ` • ₹${event.price}` : ""}`}
// //                 </button>

// //                 <Link to={`/events/${event.slug || event._id || event.id}`} className="text-sm text-gray-300 hover:underline">
// //                   Back to event
// //                 </Link>
// //               </div>
// //             </form>
// //           ) : (
// //             /* Ticket view after verify */
// //             <div className="bg-gray-900 p-6 rounded border border-red-700">
// //               <h3 className="text-lg font-semibold mb-2">Your ticket</h3>

// //               <div className="flex gap-6 flex-col sm:flex-row">
// //                 <div className="flex-shrink-0">
// //                   {ticket.qrDataUrl ? (
// //                     <img src={ticket.qrDataUrl} alt="Ticket QR" className="w-48 h-48 object-contain bg-white p-2" />
// //                   ) : (
// //                     <div className="w-48 h-48 bg-gray-800 flex items-center justify-center text-gray-400">No QR</div>
// //                   )}
// //                 </div>

// //                 <div className="flex-1">
// //                   <div><strong>Code:</strong> <span className="text-white font-semibold">{ticket.ticketCode}</span></div>
// //                   <div className="mt-2"><strong>Name:</strong> {ticket.studentName}</div>
// //                   <div className="mt-1"><strong>Event:</strong> {ticket.eventName || event.name}</div>
// //                   <div className="mt-1"><strong>Status:</strong> {ticket.status}</div>
// //                   <div className="mt-3 flex gap-2">
// //                     {ticket.pdfTicketBase64 && (
// //                       <button onClick={() => downloadPdf(ticket.pdfTicketBase64, `ticket-${ticket.ticketCode || ticket._id}.pdf`)} className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white">Download PDF</button>
// //                     )}
// //                     {ticket.email && <a className="px-3 py-2 rounded bg-gray-800 text-white" href={`mailto:${ticket.email}?subject=My%20ticket&body=My%20ticket%20code%20is%20${ticket.ticketCode}`}>Email</a>}
// //                     {ticket.phone && <a className="px-3 py-2 rounded bg-green-700 text-white" href={`https://wa.me/${ticket.phone.replace(/[^0-9]/g,'')}?text=My%20ticket%20code%20is%20${ticket.ticketCode}`}>Message (WhatsApp)</a>}
// //                   </div>

// //                   <div className="mt-4 text-sm text-gray-300">
// //                     We have also sent the ticket to your email/WhatsApp if provided.
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // }


// // frontend/src/pages/BookingCheckout.jsx
// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { api } from "../api";

// /**
//  * Loads Razorpay script dynamically
//  */
// function loadRazorpayScript() {
//   return new Promise((resolve, reject) => {
//     if (window.Razorpay) return resolve(true);
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     script.onload = () => resolve(true);
//     script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
//     document.body.appendChild(script);
//   });
// }

// /**
//  * Small helper to format INR
//  */
// function formatINR(n) {
//   if (typeof n !== "number") n = Number(n) || 0;
//   return `₹${n.toLocaleString("en-IN")}`;
// }

// /**
//  * TEDx-themed small badge
//  */
// function Badge({ children }) {
//   return <span className="inline-block bg-red-600 text-white px-2 py-0.5 rounded text-xs font-semibold">{children}</span>;
// }

// export default function BookingCheckout() {
//   const { slug } = useParams();
//   const [event, setEvent] = useState(null);
//   const [loadingEvent, setLoadingEvent] = useState(true);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     tickets: 1,
//     note: "",
//     rollNumber: "",
//     year: "",
//     department: "",
//     section: ""
//   });

//   const [busy, setBusy] = useState(false);
//   const [message, setMessage] = useState(null);

//   // payment / ticket state
//   const [ticket, setTicket] = useState(null); // final ticket returned after verify
//   const [orderInfo, setOrderInfo] = useState(null); // orderId, ticketId, razorpayKey, amount, currency

//   useEffect(() => {
//     let mounted = true;
//     const load = async () => {
//       try {
//         setLoadingEvent(true);
//         const res = await api.get(`/events/${encodeURIComponent(slug)}`);
//         const payload = res?.data?.success ? res.data.data : res.data;
//         if (mounted) setEvent(payload || null);
//       } catch (err) {
//         console.error("Failed to load event:", err);
//         if (mounted) setEvent(null);
//       } finally {
//         if (mounted) setLoadingEvent(false);
//       }
//     };
//     load();
//     return () => { mounted = false; };
//   }, [slug]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => {
//       if (name === "tickets") {
//         const v = Math.max(1, Number(value || 1));
//         return { ...prev, tickets: v };
//       }
//       return { ...prev, [name]: value };
//     });
//   };

//   const totalAmount = (() => {
//     const p = Number(event?.price ?? 0);
//     const t = Number(form.tickets ?? 1);
//     return Math.max(0, p * t);
//   })();

//   async function startCheckout(orderId, razorpayKey, ticketId) {
//     await loadRazorpayScript();

//     // compute amount (paise) safely — prefer orderInfo.amount, otherwise fallback to totalAmount
//     const computedAmount = (() => {
//       if (orderInfo && typeof orderInfo.amount === 'number') return orderInfo.amount;
//       const rounded = Math.round(totalAmount * 100);
//       return (typeof rounded === 'number' && !Number.isNaN(rounded)) ? rounded : 0;
//     })();

//     const options = {
//       key: razorpayKey,
//       amount: computedAmount, // paise
//       currency: orderInfo?.currency ?? 'INR',
//       name: event?.name || "Event",
//       description: `Ticket for ${event?.name || ''}`,
//       order_id: orderId,
//       handler: async function (response) {
//         // response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature
//         try {
//           setMessage({ type: "info", text: "Verifying payment..." });
//           const verifyRes = await api.post("/api/book/verify", {
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature,
//             ticketId
//           });
//           const ticketObj = verifyRes?.data?.data ?? verifyRes?.data ?? verifyRes;
//           setTicket(ticketObj);
//           setMessage({ type: "success", text: "Payment verified — your ticket is ready." });
//         } catch (err) {
//           console.error("verify error", err);
//           setMessage({ type: "error", text: err?.response?.data?.error || "Payment verified but server failed to finalize ticket." });
//         } finally {
//           setBusy(false);
//         }
//       },
//       modal: {
//         escape: true,
//         ondismiss: function() {
//           setMessage({ type: "warning", text: "Payment cancelled." });
//           setBusy(false);
//         }
//       },
//       prefill: {
//         name: form.name,
//         email: form.email,
//         contact: form.phone
//       }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setBusy(true);
//     setMessage(null);
//     setTicket(null);

//     try {
//       // create booking + razorpay order on server
//       const payload = {
//         eventId: event?._id,
//         studentName: form.name,
//         email: form.email,
//         phone: form.phone,
//         tickets: Number(form.tickets) || 1,
//         note: form.note,
//         rollNumber: form.rollNumber,
//         year: form.year,
//         department: form.department,
//         section: form.section
//       };

//       // endpoint used in backend examples: POST /api/book
//       const res = await api.post("/api/book", payload);
//       const data = res.data ?? {};
//       // expects: { orderId, amount, currency, ticketId, razorpayKey, ticketCode? }
//       setOrderInfo(data);

//       // if backend returned ticketCode immediately we can show it; but start checkout for payment
//       if (!data?.orderId) {
//         // no order -> maybe free ticket or already finalised
//         setMessage({ type: "success", text: data?.message || "Booking created." });
//         if (data?.ticket) setTicket(data.ticket);
//         setBusy(false);
//         return;
//       }

//       // open razorpay checkout
//       await startCheckout(data.orderId, data.razorpayKey || data.key || process.env.REACT_APP_RAZORPAY_KEY, data.ticketId);
//     } catch (err) {
//       console.error("booking error", err);
//       setMessage({ type: "error", text: err?.response?.data?.error || err?.message || "Failed to create booking" });
//       setBusy(false);
//     }
//   };

//   function downloadPdf(base64OrDataUrl, filename = "ticket.pdf") {
//     if (!base64OrDataUrl) return;
//     let dataUrl = base64OrDataUrl;
//     if (!dataUrl.startsWith("data:")) dataUrl = `data:application/pdf;base64,${base64OrDataUrl}`;
//     const link = document.createElement("a");
//     link.href = dataUrl;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6 text-white">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-black font-extrabold text-lg">TED</div>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight">Book Tickets <span className="text-red-400">TEDx</span></h1>
//               <div className="text-sm text-gray-300">Secure your seat — fast checkout & instant e-ticket</div>
//             </div>
//           </div>
//         </div>

//         <div className="text-right">
//           <div className="text-sm text-gray-300">Event price</div>
//           <div className="mt-1 text-lg font-semibold">{event ? (event.price ? formatINR(event.price) : "Free") : "—"}</div>
//         </div>
//       </div>

//       {/* Content */}
//       {loadingEvent ? (
//         <div className="bg-gray-900 p-6 rounded border border-red-800">Loading event...</div>
//       ) : !event ? (
//         <div className="bg-red-700 p-4 rounded">Event not found. <Link to="/events" className="underline ml-2">Back to events</Link></div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left: form */}
//           <div className="lg:col-span-2">
//             <div className="bg-black border border-red-800 rounded p-6 shadow">
//               <h2 className="text-lg font-semibold mb-2">{event.name}</h2>
//               <p className="text-sm text-gray-300 mb-4">{event.date ? new Date(event.date).toLocaleString() : "Date TBA"}</p>

//               {message && (
//                 <div className={`${message.type === "error" ? "bg-red-700" : message.type === "success" ? "bg-green-700" : "bg-yellow-700"} text-white p-3 rounded mb-4`}>
//                   {message.text}
//                 </div>
//               )}

//               {!ticket ? (
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   {/* Name / Email / Phone */}
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                     <div>
//                       <label className="block text-sm text-gray-300 mb-1">Full name</label>
//                       <input name="name" value={form.name} onChange={handleChange} required className="w-full p-3 bg-black border border-gray-700 rounded" placeholder="Your full name" />
//                     </div>

//                     <div>
//                       <label className="block text-sm text-gray-300 mb-1">Email</label>
//                       <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full p-3 bg-black border border-gray-700 rounded" placeholder="name@example.com" />
//                     </div>

//                     <div>
//                       <label className="block text-sm text-gray-300 mb-1">Phone</label>
//                       <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-3 bg-black border border-gray-700 rounded" placeholder="+91 9XXXXXXXXX" />
//                     </div>
//                   </div>

//                   {/* Academic fields: Roll, Year, Dept, Section */}
//                   <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
//                     <div>
//                       <label className="block text-sm text-gray-300 mb-1">Roll number</label>
//                       <input name="rollNumber" value={form.rollNumber} onChange={handleChange} className="w-full p-3 bg-black border border-gray-700 rounded" placeholder="Roll no (optional)" />
//                     </div>

//                     <div>
//                       <label className="block text-sm text-gray-300 mb-1">Year</label>
//                       <select name="year" value={form.year} onChange={handleChange} className="w-full p-3 bg-black border border-gray-700 rounded">
//                         <option value="">Select year</option>
//                         <option value="1st">1st</option>
//                         <option value="2nd">2nd</option>
//                         <option value="3rd">3rd</option>
//                         <option value="4th">4th</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm text-gray-300 mb-1">Department</label>
//                       <input name="department" value={form.department} onChange={handleChange} className="w-full p-3 bg-black border border-gray-700 rounded" placeholder="E.g. CSE, ECE" />
//                     </div>

//                     <div>
//                       <label className="block text-sm text-gray-300 mb-1">Section</label>
//                       <input name="section" value={form.section} onChange={handleChange} className="w-full p-3 bg-black border border-gray-700 rounded" placeholder="Section (optional)" />
//                     </div>
//                   </div>

//                   {/* Tickets / Note */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm text-gray-300 mb-1">Tickets</label>
//                       <input name="tickets" type="number" min="1" value={form.tickets} onChange={handleChange} className="w-full p-3 bg-black border border-gray-700 rounded" />
//                       <p className="text-xs text-gray-500 mt-1">You can book multiple seats. Price shown in summary.</p>
//                     </div>

//                     <div>
//                       <label className="block text-sm text-gray-300 mb-1">Note (optional)</label>
//                       <input name="note" value={form.note} onChange={handleChange} className="w-full p-3 bg-black border border-gray-700 rounded" placeholder="Dietary or accessibility info" />
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center gap-3 mt-2">
//                     <button type="submit" disabled={busy} className={`px-4 py-2 rounded font-semibold ${busy ? "bg-gray-700" : "bg-red-600 hover:bg-red-500"}`}>
//                       {busy ? "Processing..." : `Pay & Book • ${event.price ? formatINR(totalAmount) : "Free"}`}
//                     </button>

//                     <Link to={`/events/${event.slug || event._id || event.id}`} className="text-sm text-gray-300 hover:underline">Back to event</Link>

//                     <div className="ml-auto text-sm text-gray-400 hidden sm:block">
//                       <span className="mr-2 text-xs">Secure payment with</span>
//                       <Badge>Razorpay</Badge>
//                     </div>
//                   </div>
//                 </form>
//               ) : (
//                 /* Ticket view after verify */
//                 <div className="bg-gray-900 p-4 rounded border border-red-800">
//                   <h3 className="text-lg font-semibold mb-3">✅ Your ticket</h3>

//                   <div className="flex flex-col sm:flex-row gap-4">
//                     <div className="flex-shrink-0">
//                       {ticket.qrDataUrl ? (
//                         <img src={ticket.qrDataUrl} alt="Ticket QR" className="w-44 h-44 object-contain bg-white p-2 rounded" />
//                       ) : (
//                         <div className="w-44 h-44 bg-gray-800 flex items-center justify-center text-gray-400 rounded">No QR</div>
//                       )}
//                     </div>

//                     <div className="flex-1">
//                       <div className="text-sm text-gray-300">
//                         <div className="mb-1"><strong>Code:</strong> <span className="text-white font-semibold">{ticket.ticketCode}</span></div>
//                         <div className="mb-1"><strong>Name:</strong> {ticket.studentName}</div>
//                         <div className="mb-1"><strong>Event:</strong> {ticket.eventName || event.name}</div>
//                         <div className="mb-1"><strong>Year / Dept / Section:</strong> {`${ticket.year || form.year || '-'} / ${ticket.department || form.department || '-'} / ${ticket.section || form.section || '-'}`}</div>
//                         <div className="mb-1"><strong>Status:</strong> <span className="px-2 py-0.5 rounded bg-green-700 text-white text-xs">{ticket.status}</span></div>
//                         <div className="mt-3">
//                           {ticket.pdfTicketBase64 && (
//                             <button onClick={() => downloadPdf(ticket.pdfTicketBase64, `ticket-${ticket.ticketCode || ticket._id}.pdf`)} className="px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white mr-2">Download PDF</button>
//                           )}
//                           {ticket.email && <a className="px-3 py-2 rounded bg-gray-800 text-white mr-2" href={`mailto:${ticket.email}?subject=My%20ticket&body=My%20ticket%20code%20is%20${ticket.ticketCode}`}>Email</a>}
//                           {ticket.phone && <a className="px-3 py-2 rounded bg-green-700 text-white" href={`https://wa.me/${ticket.phone.replace(/[^0-9]/g,'')}?text=My%20ticket%20code%20is%20${ticket.ticketCode}`}>Message (WhatsApp)</a>}
//                         </div>

//                         <div className="mt-3 text-xs text-gray-400">
//                           A copy has been sent to your email/WhatsApp (if provided). Keep this code handy for entry.
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right: summary card */}
//           <aside className="lg:col-span-1">
//             <div className="bg-black border border-red-800 rounded p-5 shadow">
//               <h3 className="text-sm text-gray-300 mb-2">Order summary</h3>

//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm text-gray-300">Ticket price</div>
//                   <div className="text-sm font-semibold text-white">{event.price ? formatINR(event.price) : "Free"}</div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="text-sm text-gray-300">Quantity</div>
//                   <div className="text-sm font-semibold text-white">{form.tickets}</div>
//                 </div>

//                 <div className="border-t border-gray-800 pt-3 flex items-center justify-between">
//                   <div className="text-sm text-gray-300">Total</div>
//                   <div className="text-lg font-bold">{event.price ? formatINR(totalAmount) : "Free"}</div>
//                 </div>

//                 <div className="pt-3">
//                   <div className="text-xs text-gray-400">Refund policy</div>
//                   <div className="text-xs text-gray-500 mt-2">Tickets are non-transferable. For cancellations contact the organizers.</div>
//                 </div>

//                 <div className="mt-3">
//                   <a href="/terms" className="text-xs text-gray-400 hover:underline">Terms & conditions</a>
//                 </div>
//               </div>
//             </div>
//           </aside>
//         </div>
//       )}
//     </div>
//   );
// }


// frontend/src/pages/BookingCheckout.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

/* Load Razorpay Script */
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject("Failed to load Razorpay SDK");
    document.body.appendChild(script);
  });
}

function formatINR(n) {
  return `₹${Number(n || 0).toLocaleString("en-IN")}`;
}

export default function BookingCheckout() {
  const { slug } = useParams();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    tickets: 1,
    note: "",
    rollNumber: "",
    year: "",
    department: "",
    section: ""
  });

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);

  /* Load Event */
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get(`/events/${encodeURIComponent(slug)}`);
        const eventData = res?.data?.data || res.data;
        if (mounted) setEvent(eventData);
      } catch (err) {
        console.error("Event load error", err);
        if (mounted) setEvent(null);
      } finally {
        setLoadingEvent(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [slug]);

  /* Form change handler */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const totalAmount = (event?.price || 0) * (form.tickets || 1);

  /* Razorpay Checkout */
  async function startCheckout(orderId, razorpayKey, ticketId) {
    await loadRazorpayScript();

    const options = {
      key: razorpayKey,
      amount: orderInfo.amount,
      currency: orderInfo.currency,
      name: event?.name,
      description: `Ticket for ${event?.name}`,
      order_id: orderId,

      handler: async function (response) {
        try {
          setMessage({ type: "info", text: "Verifying payment..." });

          const verifyRes = await api.post("/book/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            ticketId
          });

          const ticketObj = verifyRes?.data?.data || verifyRes.data;
          setTicket(ticketObj);

          setMessage({ type: "success", text: "Payment verified successfully!" });
        } catch (err) {
          console.error("Verify error", err);
          setMessage({ type: "error", text: "Payment verification failed." });
        } finally {
          setBusy(false);
        }
      },

      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  /* Form Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setTicket(null);

    try {
      const payload = {
        eventId: event?._id,
        studentName: form.name,
        email: form.email,
        phone: form.phone,
        rollNumber: form.rollNumber,
        year: form.year,
        department: form.department,
        section: form.section
      };

      const res = await api.post("/book", payload); // ✔ correct path
      const data = res.data;

      setOrderInfo(data);

      // Free event
      if (!data.orderId) {
        setMessage({ type: "success", text: "Ticket booked successfully!" });
        setTicket(data.ticket);
        setBusy(false);
        return;
      }

      await startCheckout(data.orderId, data.razorpayKey, data.ticketId);
    } catch (err) {
      console.error("Submit error", err);
      setMessage({ type: "error", text: "Booking failed." });
      setBusy(false);
    }
  };

  /* Download PDF */
  function downloadPdf(base64, filename) {
    if (!base64) return;
    const link = document.createElement("a");
    link.href = base64.startsWith("data:") ? base64 : `data:application/pdf;base64,${base64}`;
    link.download = filename;
    link.click();
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">
        Book Tickets <span className="text-red-500">TEDx</span>
      </h1>

      {/* EVENT CARD */}
      {loadingEvent ? (
        <div className="p-4 bg-gray-800 rounded">Loading event...</div>
      ) : !event ? (
        <div className="p-4 bg-red-700 rounded">Event not found.</div>
      ) : (
        <>
          <div className="p-5 bg-black rounded border border-red-700 mb-5">
            <h2 className="text-xl font-semibold">{event.name}</h2>
            <p className="text-gray-400 mt-1">
              {event.date ? new Date(event.date).toLocaleString() : "Date TBA"}
            </p>
            <p className="text-gray-400 mt-3">{event.description}</p>
          </div>

          {/* MESSAGE */}
          {message && (
            <div
              className={`p-3 rounded mb-4 ${
                message.type === "error"
                  ? "bg-red-700"
                  : message.type === "success"
                  ? "bg-green-700"
                  : "bg-yellow-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* FORM OR TICKET */}
          {!ticket ? (
            <form onSubmit={handleSubmit} className="bg-black border border-red-700 p-5 rounded space-y-4">
              
              {/* NAME / EMAIL / PHONE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input name="name" required placeholder="Full Name"
                  value={form.name} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded" />

                <input name="email" required type="email" placeholder="Email"
                  value={form.email} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded" />

                <input name="phone" placeholder="Phone"
                  value={form.phone} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded" />
              </div>

              {/* ACADEMIC INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <input name="rollNumber" placeholder="Roll No"
                  value={form.rollNumber} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded" />

                <select name="year" value={form.year} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded">
                  <option value="">Year</option>
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="3rd">3rd</option>
                  <option value="4th">4th</option>
                </select>

                <input name="department" placeholder="Department"
                  value={form.department} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded" />

                <input name="section" placeholder="Section"
                  value={form.section} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded" />
              </div>

              {/* TICKETS */}
              <div>
                <label className="text-sm text-gray-300">Tickets</label>
                <input name="tickets" type="number" min="1"
                  value={form.tickets} onChange={handleChange}
                  className="p-3 bg-gray-900 border border-gray-700 rounded w-full mt-1" />
              </div>

              {/* BUTTON */}
              <button disabled={busy}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded font-semibold">
                {busy ? "Processing..." : `Pay & Book • ${formatINR(totalAmount)}`}
              </button>

            </form>
          ) : (
            /* TICKET DISPLAY */
            <div className="bg-gray-900 p-6 rounded border border-red-700">
              <h2 className="font-bold text-lg mb-4">Your Ticket</h2>
              <img
                src={ticket.qrDataUrl}
                alt="Ticket QR"
                className="w-48 h-48 bg-white p-2 rounded"
              />

              <p className="mt-4"><strong>Code:</strong> {ticket.ticketCode}</p>
              <p><strong>Name:</strong> {ticket.studentName}</p>
              <p><strong>Event:</strong> {event.name}</p>

              <button
                onClick={() => downloadPdf(ticket.pdfTicketBase64, `ticket-${ticket.ticketCode}.pdf`)}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
              >
                Download PDF
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
