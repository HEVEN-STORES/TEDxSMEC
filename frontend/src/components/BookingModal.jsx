// frontend/src/pages/BookingForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

export default function BookingForm() {
  const { slug } = useParams(); // expects route: /events/:slug/book
  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    tickets: 1,
    note: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState({ ok: null, message: "" });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingEvent(true);
        const res = await api.get(`/events/${encodeURIComponent(slug)}`);
        const payload = res?.data?.success ? res.data.data : res.data;
        if (mounted) setEvent(payload || null);
      } catch (err) {
        console.error("Failed to load event for booking:", err);
        if (mounted) setEvent(null);
      } finally {
        if (mounted) setLoadingEvent(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [slug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "tickets" ? Math.max(1, Number(value)) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult({ ok: null, message: "" });
    try {
      // POST to booking endpoint (adjust endpoint if your backend uses a different path)
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        tickets: Number(form.tickets) || 1,
        note: form.note,
      };

      // If your backend wants event id instead of slug, send event._id too (safe)
      if (event?._id) payload.eventId = event._id;

      const res = await api.post(`/events/${encodeURIComponent(slug)}/book`, payload);
      const data = res?.data || {};

      if (res.status >= 200 && res.status < 300) {
        setResult({ ok: true, message: data?.message || "Booking successful! We'll send confirmation to your email." });
      } else {
        setResult({ ok: false, message: data?.message || "Booking failed. Please try again." });
      }
    } catch (err) {
      console.error("Booking error:", err);
      setResult({ ok: false, message: err?.response?.data?.message || "Booking failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold text-red-400 mb-4">Book Tickets</h1>

      {loadingEvent ? (
        <div className="bg-gray-900 p-4 rounded">Loading event...</div>
      ) : !event ? (
        <div className="bg-red-700 p-4 rounded">Event not found. <Link to="/events" className="underline ml-2">Back to events</Link></div>
      ) : (
        <>
          <div className="bg-gray-900 p-4 rounded mb-6 border border-red-700">
            <h2 className="text-xl font-semibold">{event.name || event.title}</h2>
            <p className="text-sm text-gray-300 mt-1">{event.date ? new Date(event.date).toLocaleString() : "Date TBA"}</p>
            <p className="text-sm text-gray-300 mt-2 line-clamp-3">{event.description}</p>
          </div>

          {result.ok === true && (
            <div className="bg-green-700 text-white p-4 rounded mb-4">
              {result.message} — <Link to="/events" className="underline">Back to events</Link>
            </div>
          )}

          {result.ok === false && (
            <div className="bg-red-700 text-white p-4 rounded mb-4">
              {result.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded shadow space-y-4 border border-red-700">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Full name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-3 bg-black border border-gray-700 rounded"
                placeholder="Your full name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-black border border-gray-700 rounded"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-3 bg-black border border-gray-700 rounded"
                  placeholder="+91 9XXXXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Tickets</label>
                <input
                  name="tickets"
                  type="number"
                  min="1"
                  value={form.tickets}
                  onChange={handleChange}
                  className="w-full p-3 bg-black border border-gray-700 rounded"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Note (optional)</label>
                <input
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  className="w-full p-3 bg-black border border-gray-700 rounded"
                  placeholder="Any dietary/accessibility needs"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting || result.ok === true}
                className={`px-4 py-2 rounded ${submitting ? "bg-gray-700" : "bg-red-600 hover:bg-red-500"}`}
              >
                {submitting ? "Booking..." : "Confirm booking"}
              </button>

              <Link to={`/events/${event.slug || event._id || event.id}`} className="text-sm text-gray-300 hover:underline">
                Back to event
              </Link>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

