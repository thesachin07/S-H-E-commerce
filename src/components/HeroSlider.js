"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderImages = [
    {
      id: 1,
      image_url: "Banner1.png",
      mobile_url: "Banner1.0.png",
      name: "Watch Collection",
      link: "/shop/1",
    },
    {
      id: 2,
      image_url: "Banner2.png",
      mobile_url: "Banner2.0.png",
      name: "Audio Series",
      link: "/shop/2",
    },
    {
      id: 3,
      image_url: "Banner3.png",
      mobile_url: "Banner3.0.png",
      name: "Vintage Camera",
      link: "/shop/3",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [sliderImages.length]);

  return (
    <div className="relative w-full overflow-hidden">
      {sliderImages.map((product, index) => (
        <div
          key={product.id}
          className={`transition-opacity duration-700 ${
            index === currentIndex ? "block" : "hidden"
          }`}
        >
          <Link href={product.link}>
            <div className="sm:hidden w-full">
              <Image
                src={`/${product.mobile_url}`}
                alt={product.name}
                width={800}
                height={1200}
                priority={index === 0}
                className="w-full h-auto"
              />
            </div>

            <div className="hidden sm:block relative w-full h-[400px] md:h-[500px]">
              <Image
                src={`/${product.image_url}`}
                alt={product.name}
                fill
                priority={index === 0}
                className="object-contain bg-white"
              />
            </div>
          </Link>
        </div>
      ))}

      {/* DOTS (mobile-friendly) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {sliderImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1 w-6 ${
              i === currentIndex ? "bg-black" : "bg-black/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
