import React from "react";

import { Lightbulb, BookOpen, Users, Target } from 'lucide-react';

export default function About() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION TITLE */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="text-red-600">TEDxSMEC</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* ABOUT TED */}
            <div className="flex items-start gap-4">
              <div className="bg-red-600 rounded-lg p-3 flex-shrink-0">
                <Lightbulb size={32} className="text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-3">About TED</h3>
                <p className="text-gray-400 leading-relaxed">
                  TED is a global platform committed to spreading ideas through short, powerful talks.
                  TEDx events are independently organized but aligned with TED’s mission to inspire communities
                  with ideas worth spreading.
                </p>
                <p className="text-gray-400 leading-relaxed mt-4">
                  TEDx programs empower local organizers to create impactful events driven by creativity,
                  curiosity, and meaningful conversations — bringing communities together across the world.
                </p>
              </div>
            </div>

            {/* CARDS (MISSION + COMMUNITY) */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-600/30 rounded-xl p-6 text-center">
                <Target size={32} className="text-red-600 mx-auto mb-3" />
                <h4 className="text-white font-bold text-lg mb-2">Our Vision</h4>
                <p className="text-gray-400 text-sm">
                  Empowering change-makers to bring ideas to the world stage
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-600/30 rounded-xl p-6 text-center">
                <Users size={32} className="text-red-600 mx-auto mb-3" />
                <h4 className="text-white font-bold text-lg mb-2">Our Community</h4>
                <p className="text-gray-400 text-sm">
                  Innovators, creators & students united by ideas
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* ABOUT SMEC */}
            <div className="flex items-start gap-4">
              <div className="bg-red-600 rounded-lg p-3 flex-shrink-0">
                <BookOpen size={32} className="text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-3">About SMEC</h3>
                <p className="text-gray-400 leading-relaxed">
                  St. Martin’s Engineering College (SMEC), Hyderabad, is a hub of innovation, research,
                  technology and student-driven initiatives. Known for excellence, SMEC nurtures future
                  leaders who aim to create meaningful impact.
                </p>
                <p className="text-gray-400 leading-relaxed mt-4">
                  TEDxSMEC stands as a platform to amplify creativity, ideas, and voices that shape the
                  future — inspiring students and innovators to challenge norms and think beyond boundaries.
                </p>
              </div>
            </div>

            {/* IMAGE CARD */}
            <div className="relative h-64 rounded-xl overflow-hidden border border-red-600/20">
              <img
                src="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=1920"
                alt="SMEC Campus"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-semibold text-lg">St. Martin’s Engineering College</p>
                <p className="text-gray-300 text-sm">Innovation. Excellence. Transformation.</p>
              </div>
            </div>

          </div>
        </div>

        {/* WHY TEDXSMEC SECTION */}
        <div className="bg-gradient-to-br from-red-600/10 to-red-900/10 border border-red-600/30 rounded-2xl p-8 md:p-12">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Why TEDxSMEC?</h3>

            <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-8">
              TEDxSMEC brings together thinkers, innovators, creators and leaders who share transformative ideas.
              Our platform inspires action, sparks conversations and empowers students to become global changemakers.
            </p>

            {/* METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">5+</div>
                <div className="text-gray-400">Events Hosted</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">50+</div>
                <div className="text-gray-400">Inspiring Speakers</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">5000+</div>
                <div className="text-gray-400">Attendees Impacted</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
