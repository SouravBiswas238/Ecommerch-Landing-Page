

import { Clock, ShoppingBag } from "lucide-react";

const Header = ({ companyData, cartTotalItems, cartSubtotal, onCartOpen, onTrackOpen, hasSavedOrders, searchQuery, onSearchChange }) => {
  const brandName = companyData?.name || "Company Name";
  const brandLogo = companyData?.logo || "";
  const brandAbbrev = brandName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md border-b transition-all"
      style={{ background: "color-mix(in srgb, var(--color-bg) 85%, transparent)", borderColor: "var(--color-border)" }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden"
            style={{ background: "var(--color-primary)", boxShadow: "0 4px 12px rgb(var(--color-primary-rgb) / 0.2)" }}>
            <img
              src={brandLogo}
              alt={brandName}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight font-[Oxanium,sans-serif]"
              style={{ color: "var(--color-secondary)" }}>
              {brandName}
            </h1>
            <p className="text-xs flex items-center gap-1 font-[Poppins,sans-serif]" style={{ color: "var(--color-muted)" }}>

            </p>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center relative w-64 lg:w-80">
          <svg className="w-4 h-4 absolute left-3 pointer-events-none" style={{ color: "var(--color-muted)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search dishes or drinks..."
            className="w-full rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none transition-all"
            style={{
              background: "#f9f9f9",
              border: "1px solid var(--color-border)",
            }}
            onFocus={e => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 1px var(--color-primary)"; }}
            onBlur={e => { e.target.style.borderColor = "var(--color-border)"; e.target.style.boxShadow = "none"; }}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {hasSavedOrders && (
            <button
              onClick={onTrackOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border"
              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "var(--color-primary-text)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-primary)"; }}
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">My Orders</span>
            </button>
          )}

          {/* Desktop Cart */}
          <button
            onClick={onCartOpen}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-md cursor-pointer"
            style={{ background: "var(--color-primary)", color: "var(--color-primary-text)", boxShadow: "0 4px 8px rgb(var(--color-primary-rgb) / 0.1)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--color-primary)"; }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart ({cartTotalItems})</span>
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full ml-1"
              style={{ background: "var(--color-accent)", color: "var(--color-accent-text)" }}>
              ${cartSubtotal.toLocaleString()} 
            </span>
          </button>

          {/* Mobile brand abbrev */}
          <div className="md:hidden flex items-center justify-center w-8 h-8 rounded-full font-extrabold text-sm"
            style={{ background: "rgb(var(--color-accent-rgb) / 0.25)", color: "var(--color-secondary)" }}>
            {brandAbbrev}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
