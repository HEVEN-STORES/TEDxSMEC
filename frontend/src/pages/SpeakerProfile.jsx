// src/pages/SpeakerProfile.jsx
import React, { useEffect, useState } from 'react';
import { Play, Briefcase, Instagram, Linkedin, Twitter } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { buildImg } from '../utils';

export default function SpeakerProfile() {
  const { id } = useParams();
  const [speaker, setSpeaker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const endpoints = [
      `/admin/speakers/public/${encodeURIComponent(id)}`,
      `/speakers/${encodeURIComponent(id)}`
    ];

    const load = async () => {
      setLoading(true);
      setError(null);

      for (const ep of endpoints) {
        try {
          const res = await api.get(ep);
          const data = res?.data?.success ? res.data.data : res.data;
          if (!mounted) return;
          if (data && typeof data === 'object') {
            setSpeaker(data);
            setLoading(false);
            return;
          }
        } catch (err) {
          if (endpoints.indexOf(ep) === endpoints.length - 1) {
            console.error('Failed to load speaker:', err);
            if (mounted) setError(err?.response?.data?.message || 'Failed to load speaker');
            setLoading(false);
          } else {
            // try next endpoint
            continue;
          }
        }
      }
    };

    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="hero-panel text-white">Loading speaker...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-red-700 text-white rounded p-6">{error}</div>
      </div>
    );
  }

  if (!speaker) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-white">
        <div className="bg-gray-900 p-6 rounded-lg">
          Speaker not found.{" "}
          <Link to="/speakers" className="text-red-400 hover:underline">Back to speakers</Link>
        </div>
      </div>
    );
  }

  const imgSrc = buildImg(speaker.photo || speaker.image || speaker.avatar || speaker.imageUrl);
  const talkVideo = speaker.videoUrl || speaker.video || (Array.isArray(speaker.talks) && speaker.talks.find(t => t.video)?.video);

  // helpers
  const getSocial = (s, key) => {
    if (!s) return undefined;
    const sl = s.socialLinks || s.social || {};
    return (sl && sl[key]) || s[key] || s[`${key}Url`] || null;
  };

  const normalizeUrl = (u) => {
    if (!u) return u;
    // if starts with http(s) return as-is
    if (/^https?:\/\//i.test(u)) return u;
    // if begins with 'www.' prefix https://
    if (/^www\./i.test(u)) return `https://${u}`;
    // otherwise return as-is (could be a relative/path)
    return u;
  };

  const linkedin = normalizeUrl(getSocial(speaker, 'linkedin'));
  const instagram = normalizeUrl(getSocial(speaker, 'instagram'));
  const twitter = normalizeUrl(getSocial(speaker, 'twitter')); // treat as X/twitter

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black py-16">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-red-600/20 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Left: Image + optional video */}
            <div>
              <div className="relative h-96 rounded-xl overflow-hidden border border-red-600/20">
                <img
                  src={imgSrc}
                  alt={speaker.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/800x800/111827/ffffff?text=Speaker'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              {talkVideo && (
                <div className="mt-6">
                  <div className="aspect-video rounded-xl overflow-hidden border border-red-600/20">
                    {/* if it's a YouTube/Vimeo embed url, allow iframe else show link */}
                    {typeof talkVideo === 'string' && talkVideo.startsWith('http') ? (
                      <iframe
                        src={talkVideo}
                        title={`${speaker.name} talk`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <div className="p-4 text-gray-300">Video: {talkVideo}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{speaker.name}</h1>

                  <div className="flex items-center gap-3 text-gray-400 mb-4">
                    <Briefcase size={18} className="text-red-600" />
                    <span className="text-sm">{speaker.designation || speaker.title || ''}</span>
                  </div>
                </div>

                {/* Social icons — prominent, clickable, open in new tab */}
                <div className="flex items-center gap-3 mt-1">
                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${speaker.name} on Instagram`}
                      className="bg-white/20 hover:bg-red-600 p-3 rounded-full transition-all shadow-md hover:shadow-red-600/40 hover:scale-110"
                      aria-label="Instagram"
                    >
                      <Instagram size={20} className="text-white" />
                    </a>
                  )}
                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${speaker.name} on LinkedIn`}
                      className="bg-white/20 hover:bg-red-600 p-3 rounded-full transition-all shadow-md hover:shadow-red-600/40 hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={20} className="text-white" />
                    </a>
                  )}
                  {twitter && (
                    <a
                      href={twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${speaker.name} on X`}
                      className="bg-white/20 hover:bg-red-600 p-3 rounded-full transition-all shadow-md hover:shadow-red-600/40 hover:scale-110"
                      aria-label="X (Twitter)"
                    >
                      <Twitter size={20} className="text-white" />
                    </a>
                  )}
                </div>
              </div>

              {speaker.talkTopic && (
                <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4 mb-6">
                  <h3 className="text-white font-semibold mb-1">Talk Topic</h3>
                  <p className="text-gray-300 italic">"{speaker.talkTopic}"</p>
                </div>
              )}

              {speaker.bio && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-3">Biography</h3>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-line">{speaker.bio}</p>
                </div>
              )}

              {Array.isArray(speaker.talks) && speaker.talks.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Talks</h3>
                  <ul className="space-y-3">
                    {speaker.talks.map((t) => (
                      <li key={t._id || t.slug || t.title} className="text-sm text-gray-300 flex items-center justify-between gap-4">
                        <div>
                          <div className="font-medium text-white">{t.title}</div>
                          {t.event && <div className="text-xs text-gray-400">{t.event}</div>}
                        </div>
                        <div className="flex items-center gap-3">
                          {t.video ? (
                            <a
                              href={t.video}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                            >
                              <Play size={16} /> Watch
                            </a>
                          ) : (
                            <span className="text-xs text-gray-500">No video</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto">
                {talkVideo ? (
                  <a
                    href={talkVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2"
                  >
                    <Play size={18} /> Watch Talk
                  </a>
                ) : (
                  <Link to="/speakers" className="w-full inline-block text-center bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors">
                    Back to speakers
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* footer link */}
        <div className="mt-6 text-center">
          <Link to="/speakers" className="text-sm text-gray-300 hover:text-red-400">← Back to all speakers</Link>
        </div>
      </div>
    </div>
  );
}
