import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { ThemeProvider } from "@/context/ThemeContext";

// Hooks
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";

// API
import { fetchMenu, createOrder } from "@/lib/api";

// UI Components
import Header from "@/components/ui/Header";
import ToastHub from "@/components/ui/ToastHub";

// Landing Components
import HeroSection from "@/components/landing/HeroSection";
import CategoryFilter from "@/components/landing/CategoryFilter";
import ProductGrid from "@/components/landing/ProductGrid";
import CartSidePanel from "@/components/landing/CartSidePanel";
import MobileCartPill from "@/components/landing/MobileCartPill";
import CartDrawer from "@/components/landing/CartDrawer";
import OrderSuccessModal from "@/components/landing/OrderSuccessModal";
import TrackOrderDrawer from "@/components/landing/TrackOrderDrawer";
import FooterSection from "@/components/landing/FooterSection";

// Product
import ProductModal from "@/components/product/ProductModal";

// Checkout
import CheckoutModal from "@/components/landing/CheckoutModal";

// ── localStorage helpers for saved orders ──────────────────────────────────
const loadOrders = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(localStorage.getItem("goodday_last_order"));
    if (Array.isArray(stored)) return stored;
    if (stored && stored.uuid) return [stored];
    return [];
  } catch {
    return [];
  }
};

const LandingPage = ({ companyData }) => {
  // ── Products ──
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSkeletonFallback, setShowSkeletonFallback] = useState(false);

  // ── Search & filter ──
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const baseUrl = isLocalhost ? 'https://dev.aisalesteams.com' : window.location.origin;

  // ── Cart (via hook) ──
  const {
    cart,
    cartSubtotal,
    cartTotalItems,
    addToCartDirect,
    addToCartWithOptions,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    getSimpleProductQty,
  } = useCart();

  // ── Toast (via hook) ──
  const { toasts, showToast } = useToast();

  // ── UI visibility ──
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackDrawerOpen, setTrackDrawerOpen] = useState(false);

  // ── Product modal ──
  const [selectedProduct, setSelectedProduct] = useState(null);

  const resolveTopSellingProduct = (topSellingProduct) => {
    if (!topSellingProduct) return null;

    const matchedProduct = products.find(
      (product) => String(product.id) === String(topSellingProduct.product_id),
    );

    if (matchedProduct) {
      return matchedProduct;
    }

    return {
      id: topSellingProduct.product_id ?? topSellingProduct.id,
      name: topSellingProduct.product_name || "Top selling product",
      price: Number(topSellingProduct.price ?? 0),
      description: topSellingProduct.description || "",
      cover_photo: topSellingProduct.image_url || topSellingProduct.image || "",
      images: [
        ...(topSellingProduct.image_url ? [topSellingProduct.image_url] : []),
        ...(topSellingProduct.image ? [topSellingProduct.image] : []),
      ],
      attributes: {
        category: "Top Selling",
      },
      options: {},
    };
  };

  // ── Order success ──
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(0);

  // ── Saved orders ──
  const [savedOrders, setSavedOrders] = useState([]);
  useEffect(() => {
    setSavedOrders(loadOrders());
  }, []);
  useEffect(() => {
    if (trackDrawerOpen) setSavedOrders(loadOrders());
  }, [trackDrawerOpen]);

  // ── Fetch products ──
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setShowSkeletonFallback(false);
        const data = await fetchMenu(companyData?.id);
        if (data && Array.isArray(data) && data.length > 0) {
          setProducts(data.filter((p) => p.is_active !== false));
        } else {
          setProducts([]);
          setShowSkeletonFallback(true);
        }
      } catch (err) {
        console.error("API error while loading products:", err);
        setProducts([]);
        setShowSkeletonFallback(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Redirect countdown ──
  useEffect(() => {
    if (redirectCountdown > 0) {
      const timer = setTimeout(() => setRedirectCountdown((p) => p - 1), 1000);
      return () => clearTimeout(timer);
    } else if (
      redirectCountdown === 0 &&
      orderSuccess &&
      placedOrderDetails?.uuid
    ) {
      setOrderSuccess(false);
      setPlacedOrderDetails(null);
    }
  }, [redirectCountdown, orderSuccess, placedOrderDetails]);

  // ── Categories from company data ──
  const categories = useMemo(() => {
    const companyCategories = companyData?.attributes?.categories;

    if (!Array.isArray(companyCategories)) {
      return ["All"];
    }

    const categoriesInsideCombined = new Set();

    companyCategories.forEach((category) => {
      if (category.includes(" & ")) {
        category
          .split(" & ")
          .map((item) => item.trim())
          .forEach((item) => categoriesInsideCombined.add(item));
      }
    });

    const filteredCategories = companyCategories.filter((category) => {
      // Keep combined category
      if (category.includes(" & ")) {
        return true;
      }

      // Remove standalone category if it is already
      // included inside a combined category
      return !categoriesInsideCombined.has(category);
    });

    return ["All", ...filteredCategories];
  }, [companyData]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productCategory = product.attributes?.category;

      let matchesCategory = false;

      if (selectedCategory === "All") {
        matchesCategory = true;
      } else if (selectedCategory.includes(" & ")) {
        const combinedCategories = selectedCategory
          .split(" & ")
          .map((category) => category.trim());

        matchesCategory =
          combinedCategories.includes(productCategory) ||
          productCategory === selectedCategory;
      } else {
        matchesCategory = productCategory === selectedCategory;
      }

      const query = searchQuery.toLowerCase();

      const matchesSearch =
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const cartTotal = cartSubtotal; // delivery fee computed inside CheckoutModal via useDeliveryCharge

  // ── Cart handlers with toast feedback ──
  const handleAddDirect = (product) => {
    addToCartDirect(product);
    showToast(`Added ${product.name} to cart!`);
  };

  const handleAddWithOptions = (product, quantity, selectedOptions) => {
    addToCartWithOptions(product, quantity, selectedOptions);
    showToast(
      `${quantity > 1 ? quantity + "x " : ""}${product.name} added to cart!`,
    );
  };

  const handleRemove = (customKey, name) => {
    removeCartItem(customKey);
    showToast(`Removed ${name} from cart`, "warning");
  };

  const handleClear = () => {
    clearCart();
    showToast("Cart cleared!", "warning");
  };

  // ── Checkout submit ──
  const handleCheckoutSubmit = async (
    checkoutForm,
    mapLocation,
    cartTotalWithFee,
    subtotal,
    deliveryFee,
  ) => {
    const payload = {
      customer_name: checkoutForm.name,
      phone_number: checkoutForm.phone,
      delivery_type: checkoutForm.deliveryType,
      payment_method: checkoutForm.paymentMethod,
      attributes: {
        pickup_time: checkoutForm.pickupTime || "",
        order_note: checkoutForm.orderNote || "",
        branch: "montego_bay",
        ...(mapLocation && {
          destinition_location_info: {
            lat: mapLocation.lat,
            lng: mapLocation.lng,
          },
        }),
      },
      ...(checkoutForm.deliveryType === "delivery" && {
        shipping_address: checkoutForm.address,
        ...(mapLocation && {
          destinition_location_info: {
            lat: mapLocation.lat,
            lng: mapLocation.lng,
          },
        }),
      }),
      products: cart.map((item) => ({
        product: item.product.id,
        quantity: item.quantity,
        options: Object.fromEntries(
          Object.entries(item.selectedOptions || {}).map(([groupKey, mods]) => [
            groupKey,
            mods.map((mod) => ({
              name: mod.name,
              price: mod.price ?? 0,
              pos_id: mod.pos_id,
              quantity: mod.quantity ?? 1,
              fixed_quantity: mod.fixed_quantity ?? false,
            })),
          ]),
        ),
      })),
      company: Number(companyData?.id),
    };
    try {
      const orderData = await createOrder(payload);
      const orderTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const details = {
        orderNumber: orderData.id
          ? `GD-${orderData.id}`
          : "GD-" + Math.floor(100000 + Math.random() * 900000),
        time: orderTime,
        items: [...cart],
        deliveryAddress: checkoutForm.address,
        total: cartTotalWithFee,
        subtotal,
        deliveryFee,
        customerName: checkoutForm.name,
        paymentMethod: checkoutForm.paymentMethod,
        uuid: orderData?.uuid,
      };

      setPlacedOrderDetails(details);
      if (orderData?.id && orderData?.payment_method !== 'cod') {
        window.location.href = `${baseUrl}/ecommerce/checkout/${orderData.id}`;
        return;
      }

      if (orderData?.uuid) {
        const newOrderObj = {
          uuid: orderData.uuid,
          orderNumber: orderData.id ? `GD-${orderData.id}` : null,
          placedAt: new Date().toISOString(),
          customerName: checkoutForm.name,
        };
        let existing = loadOrders().filter((o) => o.uuid !== newOrderObj.uuid);
        existing = [newOrderObj, ...existing].slice(0, 5);
        localStorage.setItem("goodday_last_order", JSON.stringify(existing));
        setSavedOrders(existing);
      }

      setCheckoutOpen(false);
      clearCart();
      setCartOpen(false);
      setOrderSuccess(true);
      setRedirectCountdown(60);
      showToast("Order placed successfully!", "success");
    } catch (error) {
      console.error("Order creation failed:", error);
      showToast("Failed to place order. Please try again.", "warning");
    }
  };

  return (
    <ThemeProvider companyData={companyData}>
      <div
        className="min-h-screen font-sans antialiased pb-2"
        style={{ background: "var(--color-bg)", color: "var(--color-body)" }}
      >
        {/* Toasts */}
        <ToastHub toasts={toasts} />

        {/* Header */}
        <Header
          companyData={companyData}
          cartTotalItems={cartTotalItems}
          cartSubtotal={cartSubtotal}
          onCartOpen={() => setCartOpen(true)}
          onTrackOpen={() => setTrackDrawerOpen(true)}
          hasSavedOrders={savedOrders.length > 0}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Hero */}
        <HeroSection
          companyId={companyData?.id}
          onProductClick={(topSellingProduct) =>
            setSelectedProduct(resolveTopSellingProduct(topSellingProduct))
          }
        />

        {/* Mobile Search */}
        <div className="md:hidden px-4 pt-4">
          <div className="relative flex items-center">
            <svg
              className="w-5 h-5 absolute left-4 pointer-events-none"
              style={{ color: "var(--color-muted)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search our delicious foods..."
              className="w-full bg-[#f9f9f9] rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none shadow-sm transition-all"
              style={{ border: "1px solid var(--color-border)" }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-primary)";
                e.target.style.boxShadow = "0 0 0 1px var(--color-primary)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--color-border)";
                e.target.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Menu */}
          <section className="lg:col-span-2 space-y-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-xl font-extrabold"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {selectedCategory === "All"
                    ? "Signature Menu"
                    : selectedCategory}
                  <span
                    className="text-sm font-medium ml-2"
                    style={{ color: "var(--color-muted)" }}
                  >
                    ({filteredProducts?.length}{" "}
                    {filteredProducts?.length === 1 ? "item" : "items"})
                  </span>
                </h2>
              </div>
              <ProductGrid
                filteredProducts={filteredProducts}
                loading={loading}
                showSkeletonFallback={showSkeletonFallback}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onProductClick={setSelectedProduct}
                onAddDirect={handleAddDirect}
                onUpdateQty={updateCartItemQuantity}
                getSimpleProductQty={getSimpleProductQty}
                onResetFilters={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              />
            </div>
          </section>

          {/* Right: Desktop Cart */}
          <section className="hidden lg:block lg:col-span-1">
            <CartSidePanel
              cart={cart}
              cartTotalItems={cartTotalItems}
              cartSubtotal={cartSubtotal}
              cartTotal={cartTotal}
              onUpdateQty={updateCartItemQuantity}
              onRemove={handleRemove}
              onClear={handleClear}
              onCheckout={() => setCheckoutOpen(true)}
            />
          </section>
        </main>

        {/* Mobile Floating Cart Pill */}
        {!cartOpen && (
          <MobileCartPill
            cartTotalItems={cartTotalItems}
            cartSubtotal={cartSubtotal}
            onOpen={() => setCartOpen(true)}
          />
        )}

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddWithOptions}
          currentCartQty={
            selectedProduct ? getSimpleProductQty(selectedProduct.id) : 0
          }
          onQtyChange={(delta) =>
            selectedProduct && updateCartItemQuantity(selectedProduct.id, delta)
          }
        />

        {/* Mobile Cart Drawer */}
        {cartOpen && (
          <CartDrawer
            cart={cart}
            cartSubtotal={cartSubtotal}
            cartTotal={cartTotal}
            onClose={() => setCartOpen(false)}
            onUpdateQty={updateCartItemQuantity}
            onRemove={handleRemove}
            onClear={handleClear}
            onCheckout={() => {
              setCartOpen(false);
              setCheckoutOpen(true);
            }}
          />
        )}

        {/* Checkout Modal */}
        {checkoutOpen && (
          <CheckoutModal
            companyId={companyData?.id}
            cart={cart}
            cartSubtotal={cartSubtotal}
            onClose={() => setCheckoutOpen(false)}
            onSubmit={handleCheckoutSubmit}
          />
        )}

        {/* Order Success Modal */}
        <OrderSuccessModal
          orderDetails={placedOrderDetails}
          redirectCountdown={redirectCountdown}
          onTrackOrder={() => {
            setOrderSuccess(false);
            setTrackDrawerOpen(true);
          }}
          onBackToMenu={() => {
            setOrderSuccess(false);
            setPlacedOrderDetails(null);
          }}
        />

        {/* Track Order Drawer */}
        {trackDrawerOpen && (
          <TrackOrderDrawer
            savedOrders={savedOrders}
            onClose={() => setTrackDrawerOpen(false)}
          />
        )}

        {/* Footer */}
        <FooterSection companyData={companyData} />
      </div>
    </ThemeProvider>
  );
};

export default LandingPage;
