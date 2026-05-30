"use client";

import { useState } from "react";

const ProductImageSlider = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full h-full relative group select-none">
      <img
        src={images[currentIndex]}
        alt={`${productName} - slide ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {images?.length > 1 && (
        <>
          {/* Left Button */}
          <button
            onClick={handlePrev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all opacity-85 md:opacity-0 md:group-hover:opacity-100 duration-300 shadow-md cursor-pointer z-10"
          >
            <span className="text-sm font-bold -mt-0.5">&lsaquo;</span>
          </button>

          {/* Right Button */}
          <button
            onClick={handleNext}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all opacity-85 md:opacity-0 md:group-hover:opacity-100 duration-300 shadow-md cursor-pointer z-10"
          >
            <span className="text-sm font-bold -mt-0.5">&rsaquo;</span>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-1.5 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "bg-white scale-125" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductImageSlider;
