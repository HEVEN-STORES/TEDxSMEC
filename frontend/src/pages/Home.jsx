import React, { useRef, useEffect } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import EventsSection from '../components/EventsSection';
import SpeakersSection from '../components/SpeakersSection';
import TeamSection from '../components/TeamSection';
import SponsorsSection from '../components/SponsorsSection';
import MediaSection from '../components/MediaSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

/**
 * Helper wrapper that enforces consistent content layout inside each full-viewport section.
 * Accepts `center` to vertically center content (default true).
 * Accepts `pad` for custom vertical padding inside the section content.
 */
function SectionWrapper({ id, children, center = true, pad = 'py-12' }) {
  return (
    <section
      id={id}
      className="section-frame"
      role="region"
      aria-label={id}
    >
      <div className={`section-inner ${center ? 'items-center' : 'items-start'} ${pad}`}>
        <div className="section-content max-w-6xl w-full px-6">
          {children}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  // refs (in case you want programmatic scrolling later)
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const eventsRef = useRef(null);
  const speakersRef = useRef(null);
  const teamRef = useRef(null);
  const sponsorsRef = useRef(null);
  const mediaRef = useRef(null);
  const contactRef = useRef(null);

  // optional keyboard nav (up/down)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      const sections = Array.from(document.querySelectorAll('.section-frame'));
      if (!sections.length) return;
      const currentIndex = sections.findIndex(s => Math.abs(s.getBoundingClientRect().top) < 20);
      let nextIndex = currentIndex;
      if (e.key === 'ArrowDown') nextIndex = Math.min(sections.length - 1, (currentIndex === -1 ? 0 : currentIndex + 1));
      if (e.key === 'ArrowUp') nextIndex = Math.max(0, (currentIndex === -1 ? 0 : currentIndex - 1));
      sections[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="page-scroll bg-black text-white selection:bg-tedx-red/30">
      {/* Hero — stays full-viewport and centered */}
      <section id="home" className="section-frame" ref={homeRef} role="region" aria-label="home">
        <div className="section-inner items-center">
          <div className="section-content w-full px-6">
            <Hero />
          </div>
        </div>
      </section>

      {/* About */}
      <SectionWrapper id="about" pad="py-16">
        {/* keep AboutSection content as-is but constrained */}
        <AboutSection />
      </SectionWrapper>

      {/* Events */}
      <SectionWrapper id="events" pad="py-8">
        <EventsSection />
      </SectionWrapper>

      {/* Speakers */}
      <SectionWrapper id="speakers" pad="py-8">
        <SpeakersSection />
      </SectionWrapper>

      {/* Team */}
      <SectionWrapper id="team" pad="py-8">
        <TeamSection />
      </SectionWrapper>

      {/* Sponsors - center logos and provide generous padding */}
      <SectionWrapper id="sponsors" pad="py-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Sponsors</h2>
          <div className="mx-auto max-w-4xl">
            {/* ensure the SponsorsSection itself uses a responsive grid; we constrain width here */}
            <SponsorsSection />
          </div>
        </div>
      </SectionWrapper>

      {/* Media / Gallery - present as a centered grid-limited preview */}
      <SectionWrapper id="media" pad="py-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Media</h2>
          <div className="mx-auto max-w-5xl">
            <MediaSection />
          </div>
        </div>
      </SectionWrapper>

      {/* Contact - use a two-column constrained layout so the form and contact info sit nicely */}
      <SectionWrapper id="contact" center={false} pad="py-12">
        <div className="mx-auto max-w-4xl">
          <ContactSection />
        </div>
      </SectionWrapper>

      {/* Footer (not full-viewport) */}
      <footer className="bg-black text-gray-400 text-center py-10 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <Footer onNavigate={(id) => {
            // simple scroll-to-section helper used by Footer links (if provided)
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }} />
        </div>
      </footer>
    </div>
  );
}
