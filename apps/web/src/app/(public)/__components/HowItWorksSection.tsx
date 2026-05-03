"use client";

import { FaRegStar } from "react-icons/fa";
import { FiUserCheck } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { LuPlane } from "react-icons/lu";


const steps = [
  {
    icon: IoSearchOutline,
    title: "Browse Trips",
    description:
      "Explore hundreds of curated trip packages designed specifically for solo travelers.",
    step: "01",
  },
  {
    icon: FiUserCheck,
    title: "Choose Your Agent",
    description:
      "Connect with verified travel agents who specialize in solo travel experiences.",
    step: "02",
  },
  {
    icon: LuPlane,
    title: "Book Your Adventure",
    description:
      "Secure your spot with easy booking and flexible payment options.",
    step: "03",
  },
  {
    icon: FaRegStar,
    title: "Travel & Share",
    description:
      "Experience unforgettable journeys and share your stories with fellow travelers.",
    step: "04",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-(--primary)/10 text-(--primary) font-medium text-sm mb-4 border border-(--primary)/20">
            Simple Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-(--foreground) mb-4 text-balance">
            How Travel Junction Works
          </h2>
          <p className="text-(--muted-foreground) text-lg max-w-2xl mx-auto">
            From discovery to departure, we make solo travel planning seamless
            and exciting.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-(--border)" />
              )}

              <div className="relative bg-(--background) rounded-2xl p-8 border border-(--border) hover:border-(--primary)/50 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                {/* Step Number */}
                <span className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-(--primary) text-(--primary-foreground) font-bold flex items-center justify-center text-sm">
                  {step.step}
                </span>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-(--primary)/10 flex items-center justify-center mb-6 group-hover:bg-(--primary)/20 transition-colors">
                  <step.icon className="w-8 h-8 text-(--primary)" />
                </div>

                <h3 className="font-serif text-xl font-bold text-(--foreground) mb-3">
                  {step.title}
                </h3>
                <p className="text-(--muted-foreground) leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
