

import { Sparkles } from "lucide-react";

const HeroSection = () => (
  <section className="max-w-6xl mx-auto px-4 pt-6">
    <div className="relative overflow-hidden rounded-2xl text-white shadow-xl"
      style={{ background: "linear-gradient(to right, var(--color-secondary), var(--color-primary))" }}>
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full translate-y-1/3 -translate-x-1/4 blur-xl pointer-events-none"
        style={{ background: "rgb(var(--color-accent-rgb) / 0.1)" }} />

      <div className="relative z-10 px-6 py-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left max-w-lg">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
            style={{ background: "var(--color-accent)", color: "var(--color-accent-text)" }}>
            <Sparkles className="w-3.5 h-3.5" /> Order Food Online
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold leading-tight mb-2">
            Delivering Deliciousness Straight To Your Door
          </h2>
          <p className="text-sm text-white/80">
            Enjoy hot gourmet burgers, hand-crafted specialty coffee drinks, refreshing fruit smoothies, and decadent fresh chocolate cakes. No login needed!
          </p>
        </div>

        {/* Promo card */}
        <div className="w-full md:w-auto shrink-0 flex justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg flex gap-3 max-w-[280px]">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&auto=format&fit=crop&q=80"
              alt="Delicious Burger Promotion"
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wide" style={{ color: "var(--color-accent)" }}>TODAY&apos;S PROMO</h4>
              <p className="text-xs font-bold text-white">Crispy Burgers &amp; Hot Chicken Combo</p>
              <p className="text-xs text-white/70 mt-1">Get free delivery on all orders today!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
