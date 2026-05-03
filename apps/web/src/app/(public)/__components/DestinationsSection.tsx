"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge, Card } from "@heroui/react";
import { FaRegHeart, FaRegStar } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";

const destinations = [
  {
    id: 1,
    name: "Patagonia Adventure",
    location: "Argentina & Chile",
    image: "/images/destination-1.jpg",
    price: 2499,
    duration: "10 Days",
    rating: 4.9,
    reviews: 128,
    tag: "Popular",
  },
  {
    id: 2,
    name: "Bali Wellness Retreat",
    location: "Indonesia",
    image: "/images/destination-2.jpg",
    price: 1899,
    duration: "7 Days",
    rating: 4.8,
    reviews: 256,
    tag: "Best Seller",
  },
  {
    id: 3,
    name: "Ancient Temples Tour",
    location: "Cambodia & Vietnam",
    image: "/images/destination-3.jpg",
    price: 2199,
    duration: "12 Days",
    rating: 4.9,
    reviews: 89,
    tag: "New",
  },
];

export function DestinationsSection() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <section id="destinations" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-(--primary)/10 text-(--primary) font-medium text-sm mb-4 border border-(--primary)/20">
            Featured Destinations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-(--foreground) mb-4 text-balance">
            Explore Our Handpicked Trips
          </h2>
          <p className="text-(--muted-foreground) text-lg max-w-2xl mx-auto">
            Curated experiences designed for solo travelers seeking adventure,
            culture, and unforgettable memories.
          </p>
        </div>

        {/* Destination Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <Card
              key={destination.id}
              className="group overflow-hidden border rounded-lg bg-(--card) hover:shadow-2xl transition-all duration-500 border-(--border)"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-(--foreground)/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Tag */}
                {/* <Badge className="absolute top-4 left-4 bg-(--primary) h-8 w-20 border-none text-(--primary-foreground)">
                  {destination.tag}
                </Badge> */}

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(destination.id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-(--card)/80 backdrop-blur-sm flex items-center justify-center hover:bg-(--  card) transition-colors"
                  aria-label="Add to favorites"
                >
                  <FaRegHeart
                    className={`w-5 h-5 transition-colors ${
                      favorites.includes(destination.id)
                        ? "fill-red-500 text-red-500"
                        : "text-(--foreground)"
                    }`}
                  />
                </button>

                {/* Duration Badge */}
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-(--card)/80 backdrop-blur-sm text-sm font-medium text-(--foreground)">
                  {destination.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-1 text-(--muted-foreground) mb-2">
                  <FiMapPin  className="w-4 h-4" />
                  <span className="text-sm">{destination.location}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-(--foreground) mb-3 group-hover:text-accent transition-colors">
                  {destination.name}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaRegStar
                     className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span className="font-medium text-foreground">
                      {destination.rating}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      ({destination.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-sm text-(--muted-foreground)">From</span>
                    <p className="font-bold text-2xl text-(--foreground)">
                      ${destination.price.toLocaleString()}
                    </p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-(--primary) text-(--primary-foreground) font-medium hover:bg-(--primary)/90 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 rounded-lg border-2 border-(--primary) text-(--primary) font-medium hover:bg-(--primary) hover:text-(--primary-foreground) transition-colors">
            View All Destinations
          </button>
        </div>
      </div>
    </section>
  );
}
