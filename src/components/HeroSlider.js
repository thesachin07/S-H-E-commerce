"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Hard-coded Static Data
  const sliderImages = [
    {
      id: 1,
      image_url: "Banner1.png",
      name: "Watch Collection",
      link: "/shop/1"
    },
    {
      id: 2,
      image_url: "Banner2.png",
      name: "Audio Series",
      link: "/shop/2"
    },
    {
      id: 3,
      image_url: "Banner3.png",
      name: "Vintage Camera",
      link: "/shop/2"
    }
  ];

  useEffect(() => {
    // Timer to change slide every 5 seconds
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [sliderImages.length]);

  return (
    <div className="min-w-full  relative h-[400px] bg-gray-200 overflow-hidden">
      {sliderImages.map((product, index) => (
        <Link href={product.link} key={product.id}>
        <div
          key={product.id}
          className={`absolute inset-0  duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
            
            
          </div>
        </div>
          </Link>
      ))}

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {sliderImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 w-8 transition-all ${
              i === currentIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}