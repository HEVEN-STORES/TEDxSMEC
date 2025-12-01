// src/pages/Events.jsx
import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { buildImg } from '../utils';

export default function EventsPage({ onNavigate }) {
  const [events, setEvents] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const routerNavigate = (() => {
    try {
      return useNavigate();
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        // fetch events and speakers in parallel
        const [evRes, spRes] = await Promise.allSettled([api.get('/events'), api.get('/speakers')]);

        if (!mounted) return;

        const evData =
          evRes.status === 'fulfilled'
            ? (evRes.value?.data?.success ? evRes.value.data.data : evRes.value.data)
            : [];
        const spData =
          spRes.status === 'fulfilled'
            ? (spRes.value?.data?.success ? spRes.value.data.data : spRes.value.data)
            : [];

        setEvents(Array.isArray(evData) ? evData : []);
        setSpeakers(Array.isArray(spData) ? spData : []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Events load error', err);
        setError(err?.response?.data?.message || err.message || 'Failed to load events');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, []);

  const buildImgLocal = (url) => {
    if (!url) return 'https://placehold.co/800x480/111827/ffffff?text=TEDx+SMEC';
    if (/^https?:\/\//i.test(url)) return url;
    const origin = (import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/, '');
    return `${origin}/${url.replace(/^\/+/, '')}`;
  };

  const isUpcoming = (ev) => {
    if (!ev) return false;
    if (typeof ev.upcoming === 'boolean') return ev.upcoming;
    if (ev.status === 'upcoming') return true;
    if (ev.date) {
      try {
        return new Date(ev.date) > new Date();
      } catch {
        return false;
      }
    }
    return false;
  };

  const getEventSpeakers = (event) => {
    if (!Array.isArray(speakers) || !event) return [];
    const ids = Array.isArray(event.speakers)
      ? event.speakers.map((s) => (typeof s === 'string' ? s : s._id || s.id || s.slug))
      : [];
    return speakers.filter((s) => ids.includes(s._id || s.id || s.slug));
  };

  // unified navigation helper: prefer onNavigate (single-page modal), otherwise router navigate
  const navigateTo = (tokenKind, event) => {
    // tokenKind: 'event' | 'book'
    const id = event?.slug || event?._id || event?.id;
    if (!id) return;

    if (typeof onNavigate === 'function') {
      onNavigate(`${tokenKind}:${id}`);
      return;
    }

    if (routerNavigate) {
      if (tokenKind === 'book') routerNavigate(`/events/${id}/book`);
      else routerNavigate(`/events/${id}`);
      // ensure user sees the top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // fallback: set hash to events or scroll to top
      window.location.hash = '#events';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="hero-panel text-white">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-700 text-white rounded p-6">Error: {error}</div>
      </div>
    );
  }

  const upcomingEvents = events.filter(isUpcoming);
  const pastEvents = events.filter((e) => !isUpcoming(e)).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const EventCard = ({ event }) => {
    const eventSpeakers = getEventSpeakers(event);
    const banner = event.banner || event.bannerUrl || event.image;
    const formattedDate = event.date
      ? (() => {
          try {
            return new Date(event.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          } catch {
            return event.date;
          }
        })()
      : 'Date TBA';

    const upcoming = isUpcoming(event);
    const canBook = upcoming && event.tickets && event.tickets.enabled;

    return (
      <div
        onClick={() => navigateTo('event', event)}
        className="group bg-gradient-to-br from-gray-900 to-black border border-red-600/20 rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-600/20"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') navigateTo('event', event);
        }}
      >
        <div className="relative h-64 overflow-hidden">
          <img src={buildImgLocal(banner)} alt={event.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          {event.videoUrl && !upcoming && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-red-600 rounded-full p-4 transform transition-transform group-hover:scale-110">
                <Play size={32} className="text-white" />
              </div>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                upcoming ? 'bg-red-600 text-white' : 'bg-gray-800/90 text-gray-300'
              }`}
            >
              {upcoming ? 'Upcoming' : 'Past Event'}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-red-600 transition-colors">{event.name}</h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={18} className="text-red-600" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={18} className="text-red-600" />
              <span>{event.venue || event.location || 'Venue TBA'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users size={18} className="text-red-600" />
              <span>{eventSpeakers.length} Speakers</span>
            </div>
          </div>

          <p className="text-gray-400 mb-4 line-clamp-3">{event.description}</p>

          {eventSpeakers.length > 0 && (
            <div className="flex -space-x-2 mb-4">
              {eventSpeakers.slice(0, 4).map((speaker) => (
                <img
                  key={speaker._id || speaker.id || speaker.slug || speaker.name}
                  src={buildImgLocal(speaker.image || speaker.photo || speaker.avatar)}
                  alt={speaker.name}
                  className="w-10 h-10 rounded-full border-2 border-gray-900"
                  title={speaker.name}
                />
              ))}
              {eventSpeakers.length > 4 && (
                <div className="w-10 h-10 rounded-full bg-red-600 border-2 border-gray-900 flex items-center justify-center text-white text-sm font-semibold">
                  +{eventSpeakers.length - 4}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateTo('event', event);
              }}
              className="flex-1 bg-red-600/20 hover:bg-red-600 text-red-600 hover:text-white py-3 rounded-lg font-semibold transition-all duration-300 border border-red-600/50"
            >
              View Details
            </button>

            {canBook && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('book', event);
                }}
                className="px-4 py-3 bg-red-600 text-black rounded-lg font-semibold transition-colors"
              >
                Book tickets
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="events" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-red-600">Events</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Discover inspiring talks and transformative experiences</p>
        </div>

        {upcomingEvents.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-red-600 rounded-full" />
              Upcoming Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event._id || event.slug || event.id || event.name} event={event} />
              ))}
            </div>
          </div>
        )}

        {pastEvents.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-gray-600 rounded-full" />
              Past Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <EventCard key={event._id || event.slug || event.id || event.name} event={event} />
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && <div className="text-center text-gray-400 mt-8">No events available at the moment.</div>}
      </div>
    </section>
  );
}
