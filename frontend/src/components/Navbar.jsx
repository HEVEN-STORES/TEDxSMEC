// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ onNavigate, offset = 80 }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  const NAV_ITEMS = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "events", label: "Events" },
    { id: "speakers", label: "Speakers" },
    { id: "team", label: "Team" },
    { id: "sponsors", label: "Sponsors" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact" },
  ];

  const navigateTo = (id) => {
    // close mobile menu
    setMobileOpen(false);

    // if parent provided a custom navigation handler, use it
    if (typeof onNavigate === "function") {
      onNavigate(id);
      setActive(id);
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });

    // immediately mark as active so UI updates without waiting for scroll
    setActive(id);
  };

  // Active section on scroll
  useEffect(() => {
    let mounted = true;

    const handleScroll = () => {
      if (!mounted) return;

      const y = window.scrollY;
      setScrolled(y > 40);

      const scrollPos = y + offset + 10;

      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (!el) continue;

        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;

        if (scrollPos >= top && scrollPos < bottom) {
          setActive(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // run once to set initial state
    handleScroll();

    return () => {
      mounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  // prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-red-500/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top row */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigateTo("home")}
            className="cursor-pointer select-none font-extrabold text-xl tracking-wider flex items-center gap-2"
            role="button"
            aria-label="Go to home"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigateTo("home");
            }}
          >
            <span className="text-red-600">TEDx</span>
            <span>SMEC</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`text-sm transition relative ${
                  active === item.id
                    ? "text-red-500 font-semibold"
                    : "text-gray-300 hover:text-red-400"
                }`}
                aria-current={active === item.id ? "page" : undefined}
              >
                {item.label}

                {active === item.id && (
                  <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-red-600 rounded" />
                )}
              </button>
            ))}

            <button
              onClick={() => navigateTo("events")}
              className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-black rounded-full font-semibold"
            >
              Register
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded bg-white/10"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t border-red-500/20">
          <div className="px-4 py-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-lg ${
                  active === item.id
                    ? "bg-red-600 text-black"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => navigateTo("events")}
              className="w-full mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-black rounded-full font-semibold"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
