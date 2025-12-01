import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-tedx-dark text-white">
      <Navbar />

      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

// //frontend/src/app.jsx
// import React, { useRef } from "react";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

// // Sections
// import Hero from "./components/Hero";
// import AboutSection from "./components/AboutSection";
// import EventsSection from "./components/EventsSection";
// import SpeakersSection from "./components/SpeakersSection";
// import TeamSection from "./components/TeamSection";
// import SponsorsSection from "./components/SponsorsSection";
// import MediaSection from "./components/MediaSection";
// import ContactSection from "./components/ContactSection";

// export default function App() {
//   // Section references for smooth scroll navigation
//   const homeRef = useRef(null);
//   const aboutRef = useRef(null);
//   const eventsRef = useRef(null);
//   const speakersRef = useRef(null);
//   const galleryRef = useRef(null);
//   const teamRef = useRef(null);
//   const sponsorsRef = useRef(null);
//   const contactRef = useRef(null);

//   const sectionRefs = {
//     home: homeRef,
//     about: aboutRef,
//     events: eventsRef,
//     speakers: speakersRef,
//     gallery: galleryRef,
//     team: teamRef,
//     sponsors: sponsorsRef,
//     contact: contactRef,
//   };

//   // Scroll handler from Navbar + Footer
//   const handleNavigate = (sectionId) => {
//     const ref = sectionRefs[sectionId];
//     if (ref?.current) {
//       const offset = ref.current.offsetTop - 80; // Adjust for navbar height
//       window.scrollTo({ top: offset, behavior: "smooth" });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white selection:bg-tedx-red/30">
//       {/* Navbar with scroll handler */}
//       <Navbar onNavigate={handleNavigate} />

//       {/* Sections */}
//       <div ref={homeRef}>
//         <Hero />
//       </div>

//       <main className="max-w-6xl mx-auto px-6 py-16 space-y-24 -mt-24">
//         <div ref={aboutRef}>
//           <AboutSection />
//         </div>

//         <div ref={eventsRef}>
//           <EventsSection />
//         </div>

//         <div ref={speakersRef}>
//           <SpeakersSection />
//         </div>

//         <div ref={teamRef}>
//           <TeamSection />
//         </div>

//         <div ref={sponsorsRef}>
//           <SponsorsSection />
//         </div>

//         <div ref={galleryRef}>
//           <MediaSection />
//         </div>

//         <div ref={contactRef}>
//           <ContactSection />
//         </div>
//       </main>

//       {/* Footer with navigation */}
//       <Footer onNavigate={handleNavigate} />
//     </div>
//   );
// }
