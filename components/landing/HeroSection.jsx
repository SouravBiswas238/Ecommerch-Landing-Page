import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { fetchTopOrderedProducts } from "@/lib/api";

const HeroSection = ({ companyId }) => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTopOrderedProducts = async () => {
      try {
        setLoading(true);

        const data = await fetchTopOrderedProducts(companyId);

        console.log("HeroSection: fetched top ordered products", data);

        setTopSellingProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch top ordered products:", error);
        setTopSellingProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      getTopOrderedProducts();
    }
  }, [companyId]);

  // Auto slider
  useEffect(() => {
    if (topSellingProducts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === topSellingProducts.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [topSellingProducts.length]);

  const currentProduct = topSellingProducts[currentSlide];

  return (
    <section className="max-w-6xl mx-auto px-4 pt-6">
      <div
        className="relative overflow-hidden rounded-2xl text-white shadow-xl"
        style={{
          background:
            "linear-gradient(to right, var(--color-secondary), var(--color-primary))",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl pointer-events-none" />

        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full translate-y-1/3 -translate-x-1/4 blur-xl pointer-events-none"
          style={{
            background: "rgb(var(--color-accent-rgb) / 0.1)",
          }}
        />

        <div className="relative z-10 px-6 py-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left max-w-xl">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3"
              style={{
                background: "var(--color-accent)",
                color: "var(--color-accent-text)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Order Food Online
            </span>

            <h2 className="text-2xl md:text-[37px] font-extrabold leading-tight font-['Nunito',sans-serif] mb-2">
              It's time to have a good day with your favorite meals in one place
            </h2>

            <p className="text-sm text-white/80">
              Enjoy hot gourmet burgers, hand-crafted specialty coffee drinks,
              refreshing fruit smoothies, and decadent fresh chocolate cakes.
              No login needed!
            </p>
          </div>

          {/* Top selling product slider */}
          <div className="w-full md:w-auto shrink-0 flex justify-center">
            {loading ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg ">
                <p className="text-sm text-white/70">
                  Loading popular products...
                </p>
              </div>
            ) : currentProduct ? (
              <div
                key={currentProduct.product_id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-lg flex gap-3 min-w-[280px] max-w-[340px] transition-all duration-500"
              >
                <img
                  src={
                    currentProduct.product_image ||
                    currentProduct.image ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150&auto=format&fit=crop&q=80"
                  }
                  alt={currentProduct.product_name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />

                <div className="min-w-0">
                  <h4
                    className="text-sm font-bold uppercase tracking-wide"
                    style={{ color: "var(--color-accent)" }}
                  >
                    Top Selling
                  </h4>

                  <p className="text-sm font-bold text-white line-clamp-2">
                    {currentProduct.product_name}
                  </p>

                  {currentProduct.price && (
                    <p className="text-xs text-white/80 mt-1 font-semibold">
                      ${currentProduct.price}
                    </p>
                  )}

                  <p className="text-xs text-white/70 mt-1">
                    {currentProduct.total_quantity} sold
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;