// frontend/src/pages/EventDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { buildImg } from '../utils';

export default function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/${encodeURIComponent(slug)}`);
        if (!mounted) return;
        const payload = res.data?.success ? res.data.data : res.data;
        setEvent(payload || null);
      } catch (err) {
        console.error('Error loading event:', err);
        if (mounted) setError(err?.response?.data?.message || 'Failed to load event');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchEvent();
    return () => { mounted = false; };
  }, [slug]);

  const isUpcoming = (ev) => {
    if (!ev) return false;
    if (typeof ev.upcoming === 'boolean') return ev.upcoming;
    if (ev.date) {
      try { return new Date(ev.date) > new Date(); } catch { return false; }
    }
    return false;
  };

  if (loading) return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="hero-panel">Loading event...</div>
    </div>
  );

  if (error) return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="bg-red-700 text-white rounded p-6">Error: {error}</div>
    </div>
  );

  if (!event) return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="hero-panel">Event not found.</div>
    </div>
  );

  const primaryId = event.slug || event._id || event.id;
  const upcoming = isUpcoming(event);

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      {/* Event Header */}
      <div className="mb-6 tedx-card overflow-hidden">
        {event.bannerUrl || event.banner || event.image ? (
          <img src={buildImg(event.bannerUrl || event.banner || event.image)} alt={event.name} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 bg-gray-800 flex items-center justify-center text-muted">No banner</div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2 text-white">{event.name}</h1>
          <div className="text-muted mb-3">{event.location} {event.location && event.date ? '•' : ''} {event.date ? new Date(event.date).toLocaleString() : 'Date TBA'}</div>
          <p className="text-muted">{event.description}</p>
        </div>
      </div>

      {/* Speakers */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-tedx-red">Speakers</h2>
        {(!event.speakers || event.speakers.length === 0) ? (
          <div className="text-muted">No speakers listed for this event.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {event.speakers.map((s) => {
              const sid = s._id || s.id || s.slug || s.name;
              return (
                <div key={sid} className="bg-gray-900 rounded-lg shadow p-4 text-center tedx-card">
                  <img src={buildImg(s.photo || s.avatar)} alt={s.name} className="w-28 h-28 rounded-full object-cover mx-auto mb-3" />
                  <h3 className="font-semibold text-white">{s.name}</h3>
                  <div className="text-sm text-muted">{s.designation}</div>
                  {s.bio && <p className="text-sm text-muted mt-2">{s.bio.slice(0,140)}</p>}
                  {(s._id || s.id) && (
                    <Link to={`/speakers/${s._id || s.id}`} className="text-tedx-red mt-3 inline-block">View profile</Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Sponsors */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-tedx-red">Sponsors</h2>
        {(!event.sponsors || event.sponsors.length === 0) ? (
          <div className="text-muted">No sponsors listed for this event.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center">
            {event.sponsors.map(sp => (
              <a key={sp._id || sp.id} href={sp.website || '#'} target="_blank" rel="noreferrer" className="bg-gray-800 rounded-lg shadow p-4 flex items-center justify-center tedx-card">
                <img src={buildImg(sp.logo || sp.logoUrl)} alt={sp.name} className="max-h-20 object-contain" />
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Organizers */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-tedx-red">Organizers</h2>
        {(!event.organizers || event.organizers.length === 0) ? (
          <div className="text-muted">No organizers listed for this event.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {event.organizers.map(o => (
              <div key={o._id || o.id} className="bg-gray-900 rounded-lg shadow p-4 text-center tedx-card">
                <img src={buildImg(o.photo)} alt={o.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-3" />
                <h3 className="font-semibold text-white">{o.name}</h3>
                <div className="text-sm text-muted">{o.role || o.position}</div>
                {o.bio && <p className="text-sm text-muted mt-2">{o.bio.slice(0,120)}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Faculty Coordinators */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-tedx-red">Faculty Coordinators</h2>
        {(!event.coordinators || event.coordinators.length === 0) ? (
          <div className="text-muted">No faculty coordinators listed for this event.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {event.coordinators.map(c => (
              <div key={c._id || c.id} className="bg-gray-900 rounded-lg shadow p-4 text-center tedx-card">
                <img src={buildImg(c.photo)} alt={c.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-3" />
                <h3 className="font-semibold text-white">{c.name}</h3>
                <div className="text-sm text-muted">{c.department}</div>
                {c.bio && <p className="text-sm text-muted mt-2">{c.bio.slice(0,120)}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Actions */}
      <section className="mb-8">
        <div className="flex gap-3">
          {upcoming ? (
            <button onClick={() => navigate(`/events/${primaryId}/book`)} className="btn-red">Book Ticket</button>
          ) : (
            <button className="btn-outline" disabled>Event Completed</button>
          )}
          <Link to="/events" className="btn-outline">Back to events</Link>
        </div>
      </section>
    </div>
  );
}
