"use client"; // Marks this as a Client Component
import { useState, useEffect } from 'react';

export default function HeroSlider({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter products to find ones intended for the hero (e.g., price > 50 or a specific category)
  // In Phase 2, you manually added 15-20 products; we'll use a few here[cite: 29].
  const sliderImages = products.slice(0, 3); 

  useEffect(() => {
    if (sliderImages.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 seconds interval

    return () => clearInterval(timer);
  }, [sliderImages.length]);

  if (sliderImages.length === 0) return null;

  return (
    <div className='w-full relative h-[650px] bg-gray-200 overflow-hidden'>
      {sliderImages.map((product, index) => (
        <div
          key={product.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
            {/* <h1 className="text-white text-5xl font-bold drop-shadow-lg uppercase tracking-tighter">
              {product.name}
            </h1> */}
            <p className="text-white text-lg mt-4 border-b-2 border-white pb-1 cursor-pointer">
              Shop Now
            </p>
          </div>
        </div>
      ))}

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {sliderImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 w-8 transition-all ${i === currentIndex ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}