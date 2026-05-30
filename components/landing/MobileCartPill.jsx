"use client";

import { ShoppingBag } from "lucide-react";

const MobileCartPill = ({ cartTotalItems, cartSubtotal, onOpen }) => {
  if (cartTotalItems === 0) return null;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 px-4 md:hidden flex justify-center animate-slide-up">
      <button
        onClick={onOpen}
        className="w-full max-w-sm rounded-full py-3.5 px-6 shadow-xl flex items-center justify-between transition-all hover:scale-105 active:scale-95 cursor-pointer"
        style={{
          background: "var(--color-primary)",
          color: "var(--color-primary-text)",
          boxShadow: "0 8px 24px rgb(var(--color-primary-rgb) / 0.3)",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary-hover)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "var(--color-primary)"; }}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <ShoppingBag className="w-5 h-5" style={{ color: "var(--color-primary-text)" }} />
            <span className="absolute -top-1.5 -right-2 text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center animate-pulse"
              style={{ background: "var(--color-accent)", color: "var(--color-accent-text)" }}>
              {cartTotalItems}
            </span>
          </div>
          <span className="text-sm font-extrabold tracking-wide">View Cart</span>
        </div>
        <span className="text-xs font-extrabold px-3 py-1 rounded-full"
          style={{ background: "var(--color-accent)", color: "var(--color-accent-text)" }}>
          ${cartSubtotal.toLocaleString()}
        </span>
      </button>
    </div>
  );
};

export default MobileCartPill;
