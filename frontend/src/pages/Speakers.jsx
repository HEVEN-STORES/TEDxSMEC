// src/pages/Speakers.jsx
import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { buildImg } from '../utils';

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const endpoints = ['/admin/speakers/public/list', '/speakers'];

    const fetchSpeakers = async () => {
      setLoading(true);
      setError(null);

      for (const ep of endpoints) {
        try {
          const res = await api.get(ep);
          const data = res?.data?.success ? res.data.data : res.data;

          if (!mounted) return;

          // support either array or { list: [...] } shape
          if (Array.isArray(data)) {
            setSpeakers(data);
            setLoading(false);
            return;
          }
          if (data && Array.isArray(data.list)) {
            setSpeakers(data.list);
            setLoading(false);
            return;
          }
        } catch (err) {
          // if last endpoint, set error
          if (endpoints.indexOf(ep) === endpoints.length - 1) {
            console.error('Final error loading speakers:', err);
            if (!mounted) return;
            setError(err?.response?.data?.message || err.message || 'Failed to load speakers');
            setLoading(false);
          } else {
            // continue to next endpoint
            continue;
          }
        }
      }
    };

    fetchSpeakers();
    return () => { mounted = false; };
  }, []);

  const handleSpeakerClick = (sp) => {
    const id = sp.slug || sp._id || sp.id;
    if (id) navigate(`/speakers/${id}`);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return (
    <div className="p-6 text-white max-w-7xl mx-auto">
      <div className="hero-panel p-6 rounded animate-pulse">Loading speakers...</div>
    </div>
  );

  if (error) return (
    <div className="p-6 text-white max-w-7xl mx-auto">
      <div className="bg-red-700 p-4 rounded">Error loading speakers: {error}</div>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-red-600">Speakers</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Meet the visionaries and innovators sharing their ideas
          </p>
        </div>

        {speakers.length === 0 ? (
          <p className="text-center text-gray-400">No speakers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {speakers.map((speaker) => {
              const id = speaker._id || speaker.id || speaker.slug || speaker.name;
              const img = buildImg(speaker.photo || speaker.image || speaker.avatar);

              return (
                <div
                  key={id}
                  onClick={() => handleSpeakerClick(speaker)}
                  className="group relative bg-gradient-to-br from-gray-900 to-black border border-red-600/20 rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={img}
                      alt={speaker.name || 'Speaker'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x800/111827/ffffff?text=Speaker'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {speaker.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-red-600 rounded-full p-3 transform transition-transform group-hover:scale-110">
                          <Play size={24} className="text-white" />
                        </div>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-red-600 transition-colors">
                        {speaker.name}
                      </h3>
                      <p className="text-sm text-gray-300 mb-2">{speaker.designation}</p>
                      {speaker.talkTopic && (
                        <p className="text-xs text-gray-400 italic line-clamp-2">
                          "{speaker.talkTopic}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      View Bio
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
