

const CategoryFilter = ({ categories, selectedCategory, onSelect }) => (
  <div>
    <h3 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-muted)" }}>
      Browse Categories
    </h3>
    <div
      className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory"
      style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
    >
      {categories?.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className="snap-start shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide border cursor-pointer transition-all duration-300"
            style={isActive ? {
              background: "var(--color-primary)",
              borderColor: "var(--color-primary)",
              color: "var(--color-primary-text)",
              boxShadow: "0 4px 12px rgb(var(--color-primary-rgb) / 0.2)",
              transform: "scale(1.05)",
            } : {
              background: "white",
              borderColor: "var(--color-border)",
              color: "var(--color-body)",
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.color = "var(--color-primary)"; } }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-body)"; } }}
          >
            {cat === "All" ? "⭐ All Items" : cat}
          </button>
        );
      })}
    </div>
  </div>
);

export default CategoryFilter;
