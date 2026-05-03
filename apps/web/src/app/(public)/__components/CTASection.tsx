"use client";

import { Button } from "@heroui/react";
import { FaArrowRightLong } from "react-icons/fa6";
import { LuSparkles } from "react-icons/lu";


export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-(--primary)">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-(--primary-foreground)/10 flex items-center justify-center">
            <LuSparkles className="w-8 h-8 text-(--primary-foreground)" />
          </div>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-(--primary-foreground) mb-6 text-balance">
          Ready to Start Your Solo Adventure?
        </h2>
        <p className="text-(--primary-foreground)/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of solo travelers who have discovered their perfect
          trips through Travel Junction. Your next unforgettable journey is just
          a click away.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="solid"
            className="group font-medium text-base bg-(--primary-foreground) text-(--primary) hover:bg-(--primary-foreground)/90 rounded-lg flex justify-center items-center gap-2"
          >
            Create Free Account
            <FaArrowRightLong className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="light"
            className="font-medium rounded-lg border text-base border-(--primary-foreground)/30 text-(--primary-foreground) hover:bg-(--primary-foreground)/10 bg-transparent"
          >
            Browse as Guest
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-(--primary-foreground)/60 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Free to join
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Cancel anytime
          </span>
        </div>
      </div>
    </section>
  );
}
