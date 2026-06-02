

import { Plus, Minus, Sparkles, Utensils } from "lucide-react";
import { getSingleProductImage, getProductImage } from "@/lib/imageUtils";

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-4 border flex gap-4 animate-pulse" style={{ borderColor: "var(--color-border)" }}>
    <div className="w-24 h-24 rounded-xl bg-[#f9f9f9] shrink-0" />
    <div className="flex-1 space-y-3 py-1">
      <div className="h-4 bg-[#f9f9f9] rounded w-3/4" />
      <div className="h-3 bg-[#f9f9f9] rounded w-5/6" />
      <div className="h-3 bg-[#f9f9f9] rounded w-1/2" />
      <div className="h-8 bg-[#f9f9f9] rounded w-1/3 mt-2" />
    </div>
  </div>
);

const ProductGrid = ({
  filteredProducts,
  loading,
  searchQuery,
  selectedCategory,
  onProductClick,
  onAddDirect,
  onUpdateQty,
  getSimpleProductQty,
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((idx) => <SkeletonCard key={idx} />)}
      </div>
    );
  }

  if (filteredProducts?.length === 0) {
    return (
      <div className="bg-white rounded-2xl border p-12 text-center max-w-md mx-auto space-y-4" style={{ borderColor: "var(--color-border)" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: "rgb(var(--color-accent-rgb) / 0.2)", color: "var(--color-secondary)" }}>
          <Utensils className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-lg font-bold" style={{ color: "var(--color-secondary)" }}>No matches found</h4>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
            We couldn&apos;t find any dishes matching &quot;{searchQuery}&quot;. Try selecting another category!
          </p>
        </div>
        <button
          onClick={onResetFilters}
          className="px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer"
          style={{ background: "var(--color-primary)", color: "var(--color-primary-text)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary-hover)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--color-primary)"; }}
        >
          View All Menu Items
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {filteredProducts?.map((product) => {
        const simpleQty = getSimpleProductQty(product.id);
        const hasOptions = product.options && Object.keys(product.options).length > 0;

        return (
          <div
            key={product.id}
            onClick={() => onProductClick(product)}
            className="bg-white rounded-2xl border hover:shadow-lg transition-all duration-300 p-4 flex gap-4 relative overflow-hidden cursor-pointer group animate-fade-in"
            style={{ borderColor: "var(--color-border)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgb(var(--color-primary-rgb) / 0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-border)"; }}
          >
            {/* Product Image */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-[#f9f9f9] border border-[#E5E7EB]/50 shrink-0 relative">
              <img
                src={getSingleProductImage(product)}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                onError={(e) => { e.target.src = getProductImage(product); }}
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div>
                <div className="flex items-start justify-between gap-1 mb-1">
                  <h3 className="font-extrabold text-sm md:text-base leading-tight truncate transition-colors"
                    style={{ color: "var(--color-secondary)" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "var(--color-primary)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--color-secondary)"; }}>
                    {product.name}
                  </h3>
                </div>
                <p className="text-xs line-clamp-2 leading-relaxed mb-2" style={{ color: "var(--color-muted)" }}>
                  {product.description || "Freshly cooked specialty, prepared with local premium ingredients and served warm."}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 mt-auto">
                <span className="font-extrabold text-base md:text-lg" style={{ color: "var(--color-secondary)" }}>
                  ${product.price.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                </span>

                {/* Add / Qty / Customize button */}
                {hasOptions ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); onProductClick(product); }}
                    className="px-3 py-1.5 rounded-full text-xs font-extrabold shadow-md transition-all flex items-center gap-1 cursor-pointer z-10 border"
                    style={{
                      background: "var(--color-accent)",
                      color: "var(--color-accent-text)",
                      borderColor: "rgb(var(--color-secondary-rgb) / 0.1)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.05)"; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
                  >
                    <Sparkles className="w-3 h-3" /> Customize
                  </button>
                ) : simpleQty > 0 ? (
                  <div className="flex items-center rounded-full p-1 shadow-md z-10"
                    style={{ background: "var(--color-primary)", boxShadow: "0 2px 8px rgb(var(--color-primary-rgb) / 0.1)" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); onUpdateQty(product.id, -1); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                      style={{ color: "var(--color-primary-text)" }}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold" style={{ color: "var(--color-primary-text)" }}>{simpleQty}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onAddDirect(product); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                      style={{ color: "var(--color-primary-text)" }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); onAddDirect(product); }}
                    className="px-4 py-1.5 rounded-full text-xs font-bold shadow-md transition-all flex items-center gap-1 cursor-pointer z-10"
                    style={{
                      background: "var(--color-primary)",
                      color: "var(--color-primary-text)",
                      boxShadow: "0 2px 8px rgb(var(--color-primary-rgb) / 0.1)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary-hover)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "var(--color-primary)"; }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
