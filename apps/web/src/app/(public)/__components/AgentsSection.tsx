"use client";

import { Button, Card } from "@heroui/react";
import { FaArrowRightLong, FaHeadphonesSimple } from "react-icons/fa6";
import { GoGlobe } from "react-icons/go";
import { IoIosTrendingUp } from "react-icons/io";
import { IoShieldOutline } from "react-icons/io5";

const benefits = [
  {
    icon: IoIosTrendingUp,
    title: "Grow Your Business",
    description: "Reach thousands of solo travelers actively seeking adventures",
  },
  {
    icon: GoGlobe,
    title: "Global Exposure",
    description: "Showcase your packages to an international audience",
  },
  {
    icon: IoShieldOutline,
    title: "Verified Platform",
    description: "Build trust with our verification badge and review system",
  },
  {
    icon: FaHeadphonesSimple,
    title: "Dedicated Support",
    description: "24/7 agent support to help you succeed on our platform",
  },
];

export function AgentsSection() {
  return (
    <section id="agents" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-(--primary)/10 text-(--primary) font-medium text-sm mb-6 border border-(--primary)/20">
              For Travel Agents
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-(--foreground) mb-6 text-balance">
              Partner With Us & Expand Your Reach
            </h2>
            <p className="text-(--muted-foreground) text-lg mb-8 leading-relaxed">
              Join our network of trusted travel agents and connect with solo
              travelers worldwide. Create and manage your trip packages with our
              intuitive platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group font-medium flex items-center justify-center gap-2 rounded-lg bg-(--primary) text-white">
                Become an Agent
                <FaArrowRightLong className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg"  className="font-medium bg-transparent border border-(--foreground) rounded-lg">
                Learn More
              </Button>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={benefit.title}
                className="p-6 bg-(--card) rounded-lg border border-(--border) hover:border-(--primary)/50 hover:shadow-lg transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-(--primary)/10 flex items-center justify-center mb-4 group-hover:bg-(--primary)/20 transition-colors">
                  <benefit.icon className="w-6 h-6 text-(--primary)" />
                </div>
                <h3 className="font-serif text-lg font-bold text-(--foreground) mb-2">
                  {benefit.title}
                </h3>
                <p className="text-(--muted-foreground) text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
