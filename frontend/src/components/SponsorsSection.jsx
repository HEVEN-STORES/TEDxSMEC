// src/components/Sponsors.jsx
import React, { useEffect, useState, useMemo } from "react";
import { api } from "../api";
import { buildImg } from "../utils";

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const endpoints = ["/admin/sponsors/public/list", "/sponsors"];

    const load = async () => {
      setLoading(true);
      setError(null);

      for (const ep of endpoints) {
        try {
          const res = await api.get(ep);
          const data = res?.data?.success ? res.data.data : res.data;
          if (!mounted) return;

          if (Array.isArray(data)) {
            setSponsors(data);
            setLoading(false);
            return;
          }
        } catch (err) {
          if (endpoints.indexOf(ep) === endpoints.length - 1) {
            setError(err?.response?.data?.message || err.message || "Failed to load sponsors");
            setLoading(false);
          }
        }
      }
    };

    load();
    return () => (mounted = false);
  }, []);

  const loopList = useMemo(() => {
    if (!Array.isArray(sponsors) || sponsors.length === 0) return [];
    return [...sponsors, ...sponsors];
  }, [sponsors]);

  if (loading) return <div className="p-6 text-white">Loading sponsors...</div>;
  if (error) return <div className="p-6 bg-red-700 text-white rounded">{error}</div>;
  if (!sponsors.length) return <div className="p-6 text-gray-400">No sponsors found.</div>;

  return (
    <section className="w-full bg-black py-8 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-white mb-6">Our Sponsors</h2>

        <div className="relative overflow-hidden group">
          <div
            className="sponsor-track"
            style={{ "--marquee-duration": "10s" }} // ← FAST SPEED HERE
          >
            {loopList.map((sp, idx) => {
              const key = sp._id || sp.id || `${sp.name}-${idx}`;
              const src = buildImg(sp.logo || sp.logoUrl);

              return (
                <div
                  key={key}
                  className="sponsor-item flex-shrink-0 w-40 h-20 flex items-center justify-center p-3"
                >
                  <img
                    src={src}
                    alt={sp.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .sponsor-track {
          display: flex;
          gap: 20px;
          align-items: center;
          animation: marquee var(--marquee-duration, 10s) linear infinite;
          will-change: transform;
          padding: 10px 0;
        }

        .sponsor-item img {
          filter: grayscale(100%);
          transition: filter 200ms ease, transform 200ms ease;
        }

        .sponsor-item:hover img,
        .sponsor-item:focus img {
          filter: none;
          transform: scale(1.05);
        }

        .group:hover .sponsor-track {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
