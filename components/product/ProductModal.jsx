

import { useState, useEffect, useCallback } from "react";
import {
  X, Plus, Minus, AlertCircle, ShoppingBag, Tag, Flame, Leaf, Star,
} from "lucide-react";
import { getProductImages } from "@/lib/imageUtils";
import OptionGroup from "./OptionGroup";

const ModalImageSlider = ({ images, productName }) => {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;
  return (
    <div className="w-full h-full relative group select-none overflow-hidden">
      <img
        key={idx}
        src={images[idx]}
        alt={`${productName} - view ${idx + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((p) => (p === 0 ? images.length - 1 : p - 1)); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
          >‹</button>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx((p) => (p === images.length - 1 ? 0 : p + 1)); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
          >›</button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            {images.map((_, i) => (
              <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-white scale-125" : "bg-white/40"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * ProductModal
 * Props:
 *   product        – full product object (null = hidden)
 *   onClose        – close callback
 *   onAddToCart    – (product, quantity, selectedOptions) => void
 *   currentCartQty – quantity already in cart (0 if none)
 *   onQtyChange    – (delta) => void — adjust existing cart qty
 */
const ProductModal = ({ product, onClose, onAddToCart, currentCartQty = 0, onQtyChange }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedOptions({});
      setValidationErrors([]);
    }
  }, [product]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleOptionChange = useCallback((groupKey, mods) => {
    setSelectedOptions((prev) => ({ ...prev, [groupKey]: mods }));
    setValidationErrors((prev) => prev.filter((k) => k !== groupKey));
  }, []);

  if (!product) return null;

  const images = getProductImages(product);
  const options = product.options || {};
  const hasOptions = Object.keys(options).length > 0;

  const modifierSurcharge = Object.values(selectedOptions)
    .flat()
    .reduce((sum, mod) => sum + (mod.price || 0) * (mod.quantity ?? 1), 0);
  const unitPrice = product.price + modifierSurcharge;
  const totalPrice = unitPrice * quantity;

  const validate = () => {
    const errors = [];
    Object.entries(options).forEach(([key, data]) => {
      const minSelect = data.min_select || 0;
      const chosen = (selectedOptions[key] || []).reduce((sum, m) => sum + (m.quantity || 1), 0);
      if (minSelect > 0 && chosen < minSelect) errors.push(key);
    });
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    onAddToCart(product, quantity, selectedOptions);
    onClose();
  };

  const category = product.attributes?.category || "";
  const isHot = category.toLowerCase().includes("hot");
  const isVeg =
    !product.name.toLowerCase().includes("chicken") &&
    !product.name.toLowerCase().includes("burger") &&
    !product.name.toLowerCase().includes("meat");

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border-t sm:border border-[#E5E7EB] animate-slide-up sm:animate-zoom-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* IMAGE HEADER */}
        <div className="relative w-full h-52 sm:h-60 shrink-0 bg-[#f9f9f9]">
          <ModalImageSlider images={images} productName={product.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-all cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            {category && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide flex items-center gap-1"
                style={{ background: "var(--color-accent)", color: "var(--color-accent-text)" }}>
                <Tag className="w-2.5 h-2.5" />{category}
              </span>
            )}
            {isHot && (
              <span className="text-[10px] font-bold bg-[#dc3545] text-white px-2 py-1 rounded-full flex items-center gap-1">
                <Flame className="w-2.5 h-2.5" /> Hot
              </span>
            )}
            {isVeg && (
              <span className="text-[10px] font-bold bg-[#198754] text-white px-2 py-1 rounded-full flex items-center gap-1">
                <Leaf className="w-2.5 h-2.5" /> Veg
              </span>
            )}
          </div>

          {/* Name overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-10">
            <h2 className="text-white text-lg sm:text-xl font-extrabold leading-tight drop-shadow-md">
              {product.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-extrabold text-base drop-shadow-md" style={{ color: "var(--color-accent)" }}>
                ${product.price.toLocaleString("en-US", { minimumFractionDigits: 0 })}
              </span>
              {modifierSurcharge > 0 && (
                <span className="text-white/70 text-xs">+ ${modifierSurcharge} extras</span>
              )}
            </div>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-5 space-y-5">
            {product.description && (
              <div>
                <h4 className="text-[10px] font-extrabold text-[#808080] uppercase tracking-widest mb-1.5">
                  About this item
                </h4>
                <p className="text-sm text-[#374151] leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Customization groups */}
            {hasOptions && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "var(--color-secondary)" }}>
                    Customize Your Order
                  </h4>
                </div>

                {validationErrors.length > 0 && (
                  <div className="flex items-start gap-2 bg-[#dc3545]/8 border border-[#dc3545]/20 rounded-xl px-3 py-2.5">
                    <AlertCircle className="w-4 h-4 text-[#dc3545] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#dc3545] font-semibold">
                      Please make the required selections before adding to cart.
                    </p>
                  </div>
                )}

                {Object.entries(options).map(([groupKey, groupData]) => (
                  <div
                    key={groupKey}
                    className={validationErrors.includes(groupKey) ? "ring-2 ring-[#dc3545] ring-offset-1 rounded-2xl" : ""}
                  >
                    <OptionGroup
                      groupKey={groupKey}
                      groupData={groupData}
                      selectedMods={selectedOptions[groupKey] || []}
                      onChange={handleOptionChange}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-[#f9f9f9] rounded-2xl px-4 py-3" style={{ border: "1px solid var(--color-border)" }}>
              <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "var(--color-secondary)" }}>Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                  style={{ border: "1px solid var(--color-border)", color: "var(--color-primary)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "var(--color-primary-text)"; e.currentTarget.style.borderColor = "var(--color-primary)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "var(--color-primary)"; e.currentTarget.style.borderColor = "var(--color-border)"; }}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-extrabold text-base" style={{ color: "var(--color-secondary)" }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((p) => p + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95"
                  style={{ background: "var(--color-primary)", border: "1px solid var(--color-primary)", color: "var(--color-primary-text)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary-hover)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--color-primary)"; }}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Price summary strip */}
            {(modifierSurcharge > 0 || quantity > 1) && (
              <div className="rounded-2xl px-4 py-3 space-y-1.5 text-xs"
                style={{
                  background: "rgb(var(--color-primary-rgb) / 0.06)",
                  border: "1px solid rgb(var(--color-primary-rgb) / 0.2)",
                }}>
                <div className="flex justify-between" style={{ color: "var(--color-muted)" }}>
                  <span>Base price</span>
                  <span className="font-bold" style={{ color: "var(--color-body)" }}>${product.price.toLocaleString()}</span>
                </div>
                {modifierSurcharge > 0 && (
                  <div className="flex justify-between" style={{ color: "var(--color-muted)" }}>
                    <span>Extras</span>
                    <span className="font-bold" style={{ color: "var(--color-primary)" }}>+${modifierSurcharge.toLocaleString()}</span>
                  </div>
                )}
                {quantity > 1 && (
                  <div className="flex justify-between" style={{ color: "var(--color-muted)" }}>
                    <span>× {quantity} items</span>
                    <span className="font-bold" style={{ color: "var(--color-body)" }}>${unitPrice.toLocaleString()} each</span>
                  </div>
                )}
                <div className="flex justify-between pt-1.5 border-t text-sm"
                  style={{ borderColor: "rgb(var(--color-primary-rgb) / 0.2)" }}>
                  <span className="font-extrabold" style={{ color: "var(--color-secondary)" }}>Total</span>
                  <span className="font-extrabold" style={{ color: "var(--color-primary)" }}>${totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}
            <div className="h-2" />
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="shrink-0 px-4 sm:px-5 py-4 border-t flex items-center gap-3"
          style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
          {currentCartQty > 0 ? (
            <>
              <div className="flex items-center bg-[#f9f9f9] rounded-xl px-3 py-2 gap-2 shrink-0" style={{ border: "1px solid var(--color-border)" }}>
                <button
                  onClick={() => onQtyChange?.(-1)}
                  className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all"
                  style={{ color: "var(--color-primary)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgb(var(--color-primary-rgb) / 0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center text-xs font-extrabold" style={{ color: "var(--color-secondary)" }}>{currentCartQty}</span>
                <button
                  onClick={() => onQtyChange?.(1)}
                  className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all"
                  style={{ color: "var(--color-primary)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgb(var(--color-primary-rgb) / 0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-primary-text)",
                  boxShadow: "0 4px 12px rgb(var(--color-primary-rgb) / 0.15)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary-hover)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--color-primary)"; }}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add {quantity > 1 ? `${quantity} more` : "another"} — ${totalPrice.toLocaleString()}
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              className="w-full py-3.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-primary-text)",
                boxShadow: "0 4px 12px rgb(var(--color-primary-rgb) / 0.15)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary-hover)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--color-primary)"; }}
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Order — ${totalPrice.toLocaleString()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
