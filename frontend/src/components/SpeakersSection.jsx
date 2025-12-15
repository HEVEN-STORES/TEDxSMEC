// // frontend/src/components/SpeakersSection.jsx
// import React, { useEffect, useState } from "react";
// import { api } from "../api";
// import { buildImg } from "../utils";
// import { Play, Instagram, Linkedin, Twitter } from "lucide-react";

// /**
//  * pickRandom(arr, n) – picks up to n random items
//  */
// function pickRandom(arr = [], n = 5) {
//   if (!Array.isArray(arr) || arr.length === 0) return [];
//   if (arr.length <= n) return arr.slice();
//   const a = arr.slice();
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
//   return a.slice(0, n);
// }

// export default function SpeakersSection() {
//   const [speakers, setSpeakers] = useState([]);
//   const [displayed, setDisplayed] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let mounted = true;
//     const endpoints = ["/admin/speakers/public/list", "/speakers"];

//     const fetchSpeakers = async () => {
//       setLoading(true);
//       setError(null);
//       for (const ep of endpoints) {
//         try {
//           const res = await api.get(ep);
//           const data = res?.data?.success ? res.data.data : res.data;
//           if (!mounted) return;

//           const list = Array.isArray(data) ? data : (data?.list || []);
//           setSpeakers(list);
//           setDisplayed(pickRandom(list, 5));
//           setLoading(false);
//           return;
//         } catch (err) {
//           if (endpoints.indexOf(ep) === endpoints.length - 1) {
//             console.error("Speakers load error:", err);
//             if (mounted) setError(err?.response?.data?.message || err.message);
//             setLoading(false);
//           }
//         }
//       }
//     };

//     fetchSpeakers();
//     return () => { mounted = false; };
//   }, []);

//   useEffect(() => {
//     if (speakers.length > 0) {
//       setDisplayed(pickRandom(speakers, 5));
//     }
//   }, [speakers]);

//   const getSocial = (speaker, key) => {
//     if (!speaker) return undefined;
//     const sl = speaker.socialLinks || {};
//     return (
//       sl[key] ||
//       speaker[key] ||
//       speaker[`${key}Url`] ||
//       speaker[`${key}url`] ||
//       null
//     );
//   };

//   if (loading) {
//     return (
//       <div className="p-6 text-white max-w-7xl mx-auto">
//         <div className="hero-panel p-6 rounded animate-pulse">
//           Loading speakers...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-white max-w-7xl mx-auto">
//         <div className="bg-red-700 p-4 rounded">Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <section id="speakers" className="min-h-screen py-16 bg-gradient-to-br from-gray-950 to-black">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
//             Our <span className="text-red-600">Speakers</span>
//           </h2>
//           <p className="text-xl text-gray-400 max-w-2xl mx-auto">
//             Meet the visionaries and innovators sharing their ideas
//           </p>
//         </div>

//         {displayed.length === 0 ? (
//           <p className="text-center text-gray-400">No speakers found.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//             {displayed.map((speaker) => {
//               const id = speaker._id || speaker.id || speaker.slug || speaker.name;
//               const img = buildImg(speaker.photo || speaker.imageUrl || speaker.image);

//               const linkedin = getSocial(speaker, "linkedin");
//               const instagram = getSocial(speaker, "instagram");
//               const twitter = getSocial(speaker, "twitter");

//               const openTab = (e, url) => {
//                 e.stopPropagation();
//                 e.preventDefault();
//                 window.open(url, "_blank", "noopener,noreferrer");
//               };

//               return (
//                 <div
//                   key={id}
//                   onClick={() => (window.location.href = `/speakers/${id}`)}
//                   className="group relative bg-gradient-to-br from-gray-900 to-black border border-red-600/20 rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20"
//                 >
//                   <div className="relative h-80 overflow-hidden">

//                     <img
//                       src={img}
//                       alt={speaker.name}
//                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                     />

//                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

//                     {/* 🔥 Social Icons (Top Left) */}
//                     <div className="absolute top-4 left-4 flex items-center gap-3 z-20">
//                       {instagram && (
//                         <button
//                           onClick={(e) => openTab(e, instagram)}
//                           className="bg-white/20 hover:bg-red-600 p-3 rounded-full transition-all shadow-lg hover:shadow-red-600/50 hover:scale-110"
//                         >
//                           <Instagram size={20} className="text-white" />
//                         </button>
//                       )}

//                       {linkedin && (
//                         <button
//                           onClick={(e) => openTab(e, linkedin)}
//                           className="bg-white/20 hover:bg-red-600 p-3 rounded-full transition-all shadow-lg hover:shadow-red-600/50 hover:scale-110"
//                         >
//                           <Linkedin size={20} className="text-white" />
//                         </button>
//                       )}

//                       {twitter && (
//                         <button
//                           onClick={(e) => openTab(e, twitter)}
//                           className="bg-white/20 hover:bg-red-600 p-3 rounded-full transition-all shadow-lg hover:shadow-red-600/50 hover:scale-110"
//                         >
//                           <Twitter size={20} className="text-white" />
//                         </button>
//                       )}
//                     </div>

//                     {/* Bottom Overlay */}
//                     <div className="absolute bottom-0 left-0 right-0 p-6">
//                       <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">
//                         {speaker.name}
//                       </h3>
//                       <p className="text-sm text-gray-300">{speaker.designation}</p>
//                     </div>
//                   </div>

//                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
//                       View Bio
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//       </div>
//     </section>
//   );
// }


// frontend/src/components/SpeakersSection.jsx
import React, { useEffect, useState } from "react";
import { api } from "../api";
import { buildImg } from "../utils";
import { Play, Instagram, Linkedin, Twitter } from "lucide-react";

/**
 * pickRandom(arr, n) – picks up to n random items
 */
function pickRandom(arr = [], n = 5) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  if (arr.length <= n) return arr.slice();
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

/** ensureUrl: adds https:// if missing so window.open works reliably */
function ensureUrl(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://${s}`;
}

export default function SpeakersSection() {
  const [speakers, setSpeakers] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const endpoints = ["/admin/speakers/public/list", "/speakers"];

    const fetchSpeakers = async () => {
      setLoading(true);
      setError(null);
      for (const ep of endpoints) {
        try {
          const res = await api.get(ep);
          const data = res?.data?.success ? res.data.data : res.data;
          if (!mounted) return;

          const list = Array.isArray(data) ? data : (data?.list || []);
          setSpeakers(list);
          setDisplayed(pickRandom(list, 5));
          setLoading(false);
          return;
        } catch (err) {
          if (endpoints.indexOf(ep) === endpoints.length - 1) {
            console.error("Speakers load error:", err);
            if (mounted) setError(err?.response?.data?.message || err.message);
            setLoading(false);
          }
        }
      }
    };

    fetchSpeakers();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (speakers.length > 0) {
      setDisplayed(pickRandom(speakers, 5));
    }
  }, [speakers]);

  const getSocial = (speaker, key) => {
    if (!speaker) return undefined;
    const sl = speaker.socialLinks || {};
    return (
      sl[key] ||
      speaker[key] ||
      speaker[`${key}Url`] ||
      speaker[`${key}url`] ||
      speaker[`${key}Link`] ||
      null
    );
  };

  // helper to open social links in a new tab and prevent parent click navigation
  const openTab = (e, rawUrl) => {
    if (e && typeof e.stopPropagation === "function") e.stopPropagation();
    const url = ensureUrl(rawUrl);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="p-6 text-white max-w-7xl mx-auto">
        <div className="hero-panel p-6 rounded animate-pulse">Loading speakers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-white max-w-7xl mx-auto">
        <div className="bg-red-700 p-4 rounded">Error: {error}</div>
      </div>
    );
  }

  return (
    <section id="speakers" className="min-h-screen py-16 bg-gradient-to-br from-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-red-600">Speakers</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Meet the visionaries and innovators sharing their ideas
          </p>
        </div>

        {displayed.length === 0 ? (
          <p className="text-center text-gray-400">No speakers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayed.map((speaker) => {
              const id = encodeURIComponent(speaker._id || speaker.id || speaker.slug || speaker.name);
              const img = buildImg(speaker.photo || speaker.imageUrl || speaker.image);
              const linkedin = getSocial(speaker, "linkedin");
              const instagram = getSocial(speaker, "instagram");
              const twitter = getSocial(speaker, "twitter");

              return (
                <div
                  key={id}
                  onClick={() => (window.location.href = `/speakers/${id}`)}
                  className="group relative bg-gradient-to-br from-gray-900 to-black border border-red-600/20 rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl hover:shadow-red-600/20"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={img}
                      alt={speaker.name || "Speaker"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {/* Social Icons (Top Left) */}
                    <div className="absolute top-4 left-4 flex items-center gap-3 z-20">
                      {instagram && (
                        <button
                          onClick={(e) => openTab(e, instagram)}
                          aria-label={`${speaker.name || "Speaker"} on Instagram`}
                          className="bg-white/20 hover:bg-red-600 p-3 rounded-full transition-all shadow-lg hover:shadow-red-600/50 hover:scale-110"
                        >
                          <Instagram size={20} className="text-white" />
                        </button>
                      )}

                      {linkedin && (
                        <button
                          onClick={(e) => openTab(e, linkedin)}
                          aria-label={`${speaker.name || "Speaker"} on LinkedIn`}
                          className="bg-white/20 hover:bg-red-600 p-3 rounded-full transition-all shadow-lg hover:shadow-red-600/50 hover:scale-110"
                        >
                          <Linkedin size={20} className="text-white" />
                        </button>
                      )}

                      {twitter && (
                        <button
                          onClick={(e) => openTab(e, twitter)}
                          aria-label={`${speaker.name || "Speaker"} on Twitter`}
                          className="bg-white/20 hover:bg-red-600 p-3 rounded-full transition-all shadow-lg hover:shadow-red-600/50 hover:scale-110"
                        >
                          <Twitter size={20} className="text-white" />
                        </button>
                      )}
                    </div>

                    {/* Bottom Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-red-500 transition-colors">
                        {speaker.name}
                      </h3>
                      <p className="text-sm text-gray-300">{speaker.designation}</p>
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
