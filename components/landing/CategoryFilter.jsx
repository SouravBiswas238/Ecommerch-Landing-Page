import React, { useRef, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const CategoryFilter = ({ categories, selectedCategory, onSelect }) => {
  const scrollRef = useRef(null);
  const [isAtRight, setIsAtRight] = useState(false);

  const handleArrowClick = () => {
    const el = scrollRef.current;
    if (!el) return;

    if (!isAtRight) {
      el.scrollTo({
        left: el.scrollWidth,
        behavior: "smooth",
      });
      setIsAtRight(true);
    } else {
      el.scrollTo({
        left: 0,
        behavior: "smooth",
      });
      setIsAtRight(false);
    }
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const reachedRight =
      el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;

    setIsAtRight(reachedRight);
  };

  return (
    <div>
      <h3
        className="text-sm font-bold uppercase tracking-widest mb-3"
        style={{ color: "var(--color-muted)" }}
      >
        Browse Categories
      </h3>

      <div className="flex items-center gap-3 w-full">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 min-w-0 flex items-center gap-2.5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-1 px-2"
          style={{
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {categories?.map((cat) => {
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => onSelect(cat)}
                className="snap-start shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide border cursor-pointer transition-all duration-300 whitespace-nowrap"
                style={
                  isActive
                    ? {
                        background: "var(--color-primary)",
                        borderColor: "var(--color-primary)",
                        color: "var(--color-primary-text)",
                        boxShadow:
                          "0 4px 12px rgb(var(--color-primary-rgb) / 0.2)",
                        transform: "scale(1.05)",
                      }
                    : {
                        background: "white",
                        borderColor: "var(--color-border)",
                        color: "var(--color-body)",
                      }
                }
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor =
                      "var(--color-primary)";
                    e.currentTarget.style.color = "var(--color-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor =
                      "var(--color-border)";
                    e.currentTarget.style.color = "var(--color-body)";
                  }
                }}
              >
                {cat === "All" ? "⭐ All Items" : cat}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleArrowClick}
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md border cursor-pointer transition-all duration-300"
          style={{
            background: "white",
            borderColor: "var(--color-border)",
            color: "var(--color-primary)",
          }}
        >
          {isAtRight ? (
            <ChevronLeft size={20} strokeWidth={2.5} />
          ) : (
            <ChevronRight size={20} strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
};

export default CategoryFilter;