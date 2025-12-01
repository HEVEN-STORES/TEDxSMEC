// src/components/Hero.jsx
import React, { useEffect, useState } from "react";
import { useNavigate as useRouterNavigate } from "react-router-dom";
import { api } from "../api";
import { buildImg } from "../utils";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import heroBg from "../assets/hero-bg.jpg";

function Countdown({ targetDate, className = "" }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!targetDate) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  if (!targetDate) return null;
  const diff = new Date(targetDate).getTime() - now;
  if (Number.isNaN(diff) || diff <= 0) return <div className={`text-sm text-gray-300 ${className}`}>Event started</div>;

  const sec = Math.floor(diff / 1000) % 60;
  const min = Math.floor(diff / 60000) % 60;
  const hrs = Math.floor(diff / 3600000) % 24;
  const days = Math.floor(diff / 86400000);

  const tile = (val, label) => (
    <div className="px-4 py-3 bg-black/50 border border-red-700 rounded text-center min-w-[70px]">
      <div className="text-2xl font-semibold text-white">{String(val).padStart(2, "0")}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );

  return (
    <div className={`flex gap-3 items-center justify-center mt-4 ${className}`}>
      {tile(days, "Days")}
      {tile(hrs, "Hours")}
      {tile(min, "Minutes")}
      {tile(sec, "Seconds")}
    </div>
  );
}

/**
 * Props:
 * - onNavigate: optional function (idString) => void
 *    - Hero will call onNavigate(`event:${id}`) for "View event"
 *    - and onNavigate(`book:${id}`) for "Book tickets"
 */
export default function Hero({ onNavigate }) {
  const routerNavigate = (() => {
    try {
      return useRouterNavigate();
    } catch {
      return null;
    }
  })();

  const [nextEvent, setNextEvent] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await api.get("/events").catch(() => ({ data: [] }));
        // res.data may be shaped variously: { success, data } or [] or { data: [...] }
        const evData = res?.data?.success ? res.data.data : res?.data || [];
        if (!mounted) return;

        const isUpcoming = (ev) => {
          if (!ev) return false;
          if (typeof ev.upcoming === "boolean") return ev.upcoming;
          if (ev.date) {
            try {
              return new Date(ev.date) > new Date();
            } catch {
              return false;
            }
          }
          return false;
        };

        const arr = Array.isArray(evData) ? evData : [];
        const upcoming = arr.filter(isUpcoming).sort((a, b) => (new Date(a.date || 0) - new Date(b.date || 0)));
        setNextEvent(upcoming.length ? upcoming[0] : (arr.length ? arr[0] : null));
      } catch (err) {
        // keep failure silent but logged
        // eslint-disable-next-line no-console
        console.error("Hero: load events", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const placeholderBanner = heroBg || "https://placehold.co/1600x900/111111/ffffff?text=TEDx+SMEC";
  const build = (u) => {
    try { return buildImg(u); } catch { return u || placeholderBanner; }
  };

  // unified navigation: first prefer onNavigate (so App can open same-page modals)
  const doNavigate = (kind, id) => {
    // kind: 'view' | 'book'
    if (!id) return;
    const token = kind === "book" ? `book:${id}` : `event:${id}`;

    if (typeof onNavigate === "function") {
      onNavigate(token);
      return;
    }

    if (routerNavigate) {
      // fallback to route paths (if using router)
      if (kind === "book") {
        routerNavigate(`/events/${id}/book`);
      } else {
        routerNavigate(`/events/${id}`);
      }
      return;
    }

    // final fallback: set hash to events section OR event id
    if (kind === "book") {
      window.location.hash = `#events`;
    } else {
      window.location.hash = `#events`;
    }
  };

  const title = nextEvent?.name || nextEvent?.title || "TEDxSMEC";

  // safe check for date comparison
  const eventDate = nextEvent?.date ? new Date(nextEvent.date) : null;
  const showBook = eventDate instanceof Date && !Number.isNaN(eventDate.getTime()) && eventDate > new Date();

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black" role="region" aria-label="Hero">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${build(nextEvent?.bannerUrl || nextEvent?.banner || placeholderBanner)})`
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-red-900/20" aria-hidden="true" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="block text-white">TEDx</span>
          <span className="block text-tedx-red">SMEC</span>
        </h1>

        <p className="mt-4 text-gray-300 text-lg">Ideas worth spreading — student-led talks & community at SMEC.</p>

        <div className="mt-8">
          {nextEvent ? (
            <div className="inline-block text-center bg-black/30 border border-red-600/40 rounded-2xl p-8">
              <div className="text-sm text-gray-300">Upcoming</div>
              <div className="text-2xl md:text-3xl font-semibold text-white mt-1">{title}</div>

              <div className="flex flex-wrap justify-center gap-6 text-gray-200 mb-6 mt-3">
                <div className="flex items-center gap-2" aria-hidden="true">
                  <Calendar size={18} className="text-red-500" />
                  <span>{nextEvent.date ? new Date(nextEvent.date).toLocaleDateString() : "Date TBA"}</span>
                </div>
                <div className="flex items-center gap-2" aria-hidden="true">
                  <MapPin size={18} className="text-red-500" />
                  <span>{nextEvent.venue || "Venue TBA"}</span>
                </div>
              </div>

              <Countdown targetDate={nextEvent.date} />

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => doNavigate("view", nextEvent.slug || nextEvent._id || nextEvent.id)}
                  className="px-4 py-2 border border-red-600 rounded text-red-400 hover:bg-red-600 hover:text-white inline-flex items-center gap-2"
                  aria-label="View event details"
                >
                  View event <ArrowRight size={16}/>
                </button>

                {showBook ? (
                  <button
                    onClick={() => doNavigate("book", nextEvent.slug || nextEvent._id || nextEvent.id)}
                    className="px-4 py-2 bg-tedx-red text-black rounded"
                    aria-label="Book tickets"
                  >
                    Book tickets
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded" disabled aria-disabled="true">Event ended</button>
                )}
              </div>
            </div>
          ) : (
            <div className="inline-block bg-black/30 border border-red-600/40 rounded-2xl p-8">
              <div className="text-white">No upcoming event</div>
              <button onClick={() => { if (typeof onNavigate === "function") onNavigate("events"); else window.location.hash = "#events"; }} className="mt-3 inline-block text-tedx-red hover:underline">See events</button>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button onClick={() => { if (typeof onNavigate === "function") onNavigate("events"); else window.location.hash = "#events"; }} className="px-5 py-3 border border-red-700 text-red-400 rounded">All events</button>
          <button onClick={() => { if (typeof onNavigate === "function") onNavigate("speakers"); else window.location.hash = "#speakers"; }} className="px-5 py-3 bg-gray-900/70 border border-gray-700 text-white rounded">Speakers</button>
        </div>

        <div className="mt-8 animate-bounce text-gray-400 text-sm" aria-hidden="true">Scroll to explore ↓</div>
      </div>
    </section>
  );
}
