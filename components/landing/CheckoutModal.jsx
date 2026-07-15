import { useState, useEffect } from "react";
import { X, DollarSign, CreditCard } from "lucide-react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import MapPicker from "@/components/ui/MapPicker";
import { useDeliveryCharge } from "@/hooks/useDeliveryCharge";

const getCurrentTimeStr = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};
const getNowPlus30Str = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

const CheckoutModal = ({
  companyId,
  cart,
  cartSubtotal,
  onClose,
  onSubmit,
  onValidateBusinessHours,
}) => {
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryType: "delivery",
    pickupTime: "",
    orderNote: "",
    paymentMethod: "cash",
  });
  const [mapLocation, setMapLocation] = useState(null);
  const [mapSearch, setMapSearch] = useState("");
  const [mapSearching, setMapSearching] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [osmProvider, setOsmProvider] = useState(null);
  useEffect(() => {
    setOsmProvider(new OpenStreetMapProvider());
  }, []);

  const {
    deliveryCharge,
    deliveryChargeLoading,
    deliveryError,
    zone,
    minimumOrderError,
  } = useDeliveryCharge(
    companyId,
    mapLocation,
    checkoutForm.deliveryType,
    cartSubtotal,
  );

  const deliveryFee =
    checkoutForm.deliveryType === "delivery" ? deliveryCharge : 0;
  const cartTotal = cartSubtotal + deliveryFee;

  // Set default pickup time
  useEffect(() => {
    setCheckoutForm((prev) =>
      !prev.pickupTime ? { ...prev, pickupTime: getNowPlus30Str() } : prev,
    );
  }, []);

  // Auto-detect location for delivery
  useEffect(() => {
    if (
      checkoutForm.deliveryType === "delivery" &&
      !mapLocation &&
      navigator.geolocation
    ) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setMapLocation({ lat, lng });
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
            );
            const data = await res.json();
            if (data.display_name) {
              setCheckoutForm((prev) => ({
                ...prev,
                address: data.display_name,
              }));
            }
          } catch {
            /* silent */
          }
          setGeoLoading(false);
        },
        () => setGeoLoading(false),
        { timeout: 8000, maximumAge: 60000 },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutForm.deliveryType]);

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      return data.display_name || "";
    } catch {
      return "";
    }
  };

  const handleMapSelect = async (lat, lng) => {
    setMapLocation({ lat, lng });
    const addr = await reverseGeocode(lat, lng);
    if (addr) {
      setCheckoutForm((prev) => ({ ...prev, address: addr }));
      setFormErrors((prev) => ({ ...prev, address: "" }));
    }
  };

  const handleMapSearch = async () => {
    if (!mapSearch.trim() || !osmProvider) return;
    setMapSearching(true);
    try {
      const results = await osmProvider.search({ query: mapSearch });
      if (results?.length > 0) {
        const { x, y, label } = results[0];
        setMapLocation({ lat: y, lng: x });
        setCheckoutForm((prev) => ({ ...prev, address: label }));
        setFormErrors((prev) => ({ ...prev, address: "" }));
      }
    } catch (err) {
      console.error("Map search error:", err);
    } finally {
      setMapSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check business hours again before placing the order
    if (onValidateBusinessHours && !onValidateBusinessHours()) {
      return;
    }

    const errors = {};
    if (!checkoutForm.name?.trim()) errors.name = "Please enter your full name";
    if (!checkoutForm.phone?.trim())
      errors.phone = "Please enter your phone number";
    else if (!/^[0-9]{8,15}$/.test(checkoutForm.phone))
      errors.phone = "Phone must be 8-15 digits only";
    if (checkoutForm.deliveryType === "delivery") {
      if (!checkoutForm.address?.trim())
        errors.address = "Please enter your delivery address";
      if (!mapLocation)
        errors.mapLocation = "Please pin your location on the map";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    await onSubmit(
      checkoutForm,
      mapLocation,
      cartTotal,
      cartSubtotal,
      deliveryFee,
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-zoom-in border border-[#E5E7EB] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div
          className="text-white p-5 flex items-center justify-between shrink-0"
          style={{ background: "var(--color-primary)" }}
        >
          <h3 className="font-extrabold text-base sm:text-lg">
            Delivery Details
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-4 overflow-y-auto flex-1"
        >
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold uppercase text-[#003660] block tracking-wide">
              Your Full Name <span className="text-[#dc3545]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              className={`w-full bg-[#f9f9f9] border ${
                formErrors.name ? "border-[#dc3545]" : ""
              } rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all`}
              style={
                !formErrors.name
                  ? { borderColor: "var(--color-border)" }
                  : { borderColor: "var(--color-danger)" }
              }
              value={checkoutForm.name}
              onChange={(e) => {
                setCheckoutForm((p) => ({ ...p, name: e.target.value }));
                setFormErrors((p) => ({ ...p, name: "" }));
              }}
            />
            {formErrors.name && (
              <p className="text-xs text-[#dc3545] font-semibold mt-1">
                {formErrors.name}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold uppercase text-[#003660] block tracking-wide">
              Phone Number <span className="text-[#dc3545]">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 9876543210"
              className={`w-full bg-[#f9f9f9] border ${
                formErrors.phone ? "" : ""
              } rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all`}
              style={
                !formErrors.phone
                  ? { borderColor: "var(--color-border)" }
                  : { borderColor: "var(--color-danger)" }
              }
              value={checkoutForm.phone}
              onChange={(e) => {
                setCheckoutForm((p) => ({ ...p, phone: e.target.value }));
                setFormErrors((p) => ({ ...p, phone: "" }));
              }}
            />
            {formErrors.phone && (
              <p className="text-xs text-[#dc3545] font-semibold mt-1">
                {formErrors.phone}
              </p>
            )}
          </div>

          {/* Delivery Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase text-[#003660] block tracking-wide">
              Delivery Type <span className="text-[#dc3545]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "delivery", label: "🚚 Delivery" },
                { key: "pickup", label: "🏪 Pickup" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setCheckoutForm((p) => ({
                      ...p,
                      deliveryType: opt.key,
                      address: "",
                    }));
                    setFormErrors((p) => ({ ...p, address: "" }));
                  }}
                  className={`py-3 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer`}
                  style={
                    checkoutForm.deliveryType === opt.key
                      ? {
                          background: "rgb(var(--color-primary-rgb) / 0.05)",
                          borderColor: "var(--color-primary)",
                          color: "var(--color-primary)",
                        }
                      : {
                          background: "white",
                          borderColor: "var(--color-border)",
                          color: "var(--color-body)",
                        }
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Address + Map */}
          {checkoutForm.deliveryType === "delivery" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-extrabold uppercase text-[#003660] block tracking-wide">
                  Delivery Address <span className="text-[#dc3545]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Street name, apartment, building no, city"
                  className={`w-full bg-[#f9f9f9] border rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all`}
                  style={
                    !formErrors.address
                      ? { borderColor: "var(--color-border)" }
                      : { borderColor: "var(--color-danger)" }
                  }
                  value={checkoutForm.address}
                  onChange={(e) => {
                    setCheckoutForm((p) => ({ ...p, address: e.target.value }));
                    setFormErrors((p) => ({ ...p, address: "" }));
                  }}
                />
                {formErrors.address && (
                  <p className="text-xs text-[#dc3545] font-semibold mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>

              {/* Map picker */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[#808080] uppercase tracking-wider">
                    🗺️ Pin on Map{" "}
                    <span className="font-normal text-[#dc3545]">*</span>
                  </span>
                  {geoLoading ? (
                    <span
                      className="text-[10px] font-bold animate-pulse"
                      style={{ color: "var(--color-primary)" }}
                    >
                      📍 Detecting your location…
                    </span>
                  ) : mapLocation ? (
                    <span className="text-[10px] text-[#198754] font-bold">
                      ✓ {mapLocation.lat.toFixed(5)},{" "}
                      {mapLocation.lng.toFixed(5)}
                    </span>
                  ) : null}
                </div>
                {formErrors.mapLocation && (
                  <p className="text-xs text-[#dc3545] font-semibold mt-1">
                    {formErrors.mapLocation}
                  </p>
                )}

                {/* Search */}
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Search place to pin..."
                    className="flex-1 bg-[#f9f9f9] rounded-xl px-3 py-2 text-xs focus:outline-none transition-all"
                    style={{ border: "1px solid var(--color-border)" }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--color-primary)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--color-border)";
                    }}
                    value={mapSearch}
                    onChange={(e) => setMapSearch(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleMapSearch())
                    }
                  />
                  <button
                    type="button"
                    onClick={handleMapSearch}
                    disabled={mapSearching}
                    className="px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-60 shrink-0"
                    style={{
                      background: "var(--color-primary)",
                      color: "var(--color-primary-text)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "var(--color-primary-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--color-primary)";
                    }}
                  >
                    {mapSearching ? "..." : "Go"}
                  </button>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#E5E7EB] h-44">
                  <MapPicker
                    mapLocation={mapLocation}
                    onSelect={handleMapSelect}
                  />
                </div>
                <p className="text-[10px] text-[#808080]">
                  Click anywhere on the map to drop a pin and auto-fill the
                  address above.
                </p>
              </div>
            </div>
          )}

          {/* Pickup info */}
          {checkoutForm.deliveryType === "pickup" && (
            <div
              className="flex items-start gap-2 rounded-xl px-3 py-2.5 border"
              style={{
                background: "rgb(var(--color-primary-rgb) / 0.08)",
                borderColor: "rgb(var(--color-primary-rgb) / 0.2)",
              }}
            >
              <span className="text-lg">🏪</span>
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                You have selected <strong>Pickup</strong>. Please collect your
                order directly from our restaurant.
              </p>
            </div>
          )}

          {/* Pickup Time */}
          {checkoutForm.deliveryType === "pickup" && (
            <div className="space-y-1">
              <label className="text-xs font-extrabold uppercase text-[#003660] block tracking-wide">
                Pickup Time <span className="text-[#dc3545]">*</span>
              </label>
              <input
                type="time"
                min={
                  getCurrentTimeStr() > "06:00" ? getCurrentTimeStr() : "06:00"
                }
                max="18:00"
                className="w-full bg-[#f9f9f9] rounded-xl px-4 py-2.5 text-xs focus:outline-none transition-all"
                style={{ border: "1px solid var(--color-border)" }}
                value={checkoutForm.pickupTime}
                onChange={(e) =>
                  setCheckoutForm((p) => ({ ...p, pickupTime: e.target.value }))
                }
              />
            </div>
          )}

          {/* Order Note */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold uppercase text-[#003660] block tracking-wide">
              Order Note (Optional)
            </label>
            <textarea
              placeholder="e.g. Extra napkins, less spicy, allergy info..."
              rows={2}
              className="w-full bg-[#f9f9f9] rounded-xl px-4 py-2 text-xs focus:outline-none transition-all resize-none"
              style={{ border: "1px solid var(--color-border)" }}
              value={checkoutForm.orderNote}
              onChange={(e) =>
                setCheckoutForm((p) => ({ ...p, orderNote: e.target.value }))
              }
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase text-[#003660] block tracking-wide">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: "cod", icon: <DollarSign className="w-4 h-4" />, label: "Cash" },
                { key: "powertranz", icon: <CreditCard className="w-4 h-4" />, label: "Card" },
              ].map((opt) => (
                <div
                  key={opt.key}
                  onClick={() =>
                    setCheckoutForm((p) => ({ ...p, paymentMethod: opt.key }))
                  }
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all`}
                  style={
                    checkoutForm.paymentMethod === opt.key
                      ? {
                          background: "rgb(var(--color-primary-rgb) / 0.05)",
                          borderColor: "var(--color-primary)",
                        }
                      : {
                          background: "white",
                          borderColor: "var(--color-border)",
                        }
                  }
                >
                  <span
                    style={{
                      color:
                        checkoutForm.paymentMethod === opt.key
                          ? "var(--color-primary)"
                          : "var(--color-muted)",
                    }}
                  >
                    {opt.icon}
                  </span>
                  <span className="text-xs font-bold">{opt.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt preview */}
          <div className="bg-[#f9f9f9] p-3.5 rounded-2xl border border-[#E5E7EB] text-xs space-y-1 text-[#808080]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-[#374151]">
                ${cartSubtotal.toLocaleString()}
              </span>
            </div>
            {checkoutForm.deliveryType === "delivery" && (
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-[#374151]">
                  {deliveryFee > 0
                    ? `$${deliveryFee.toLocaleString()}`
                    : mapLocation
                      ? "Calculating..."
                      : "Select map location"}
                </span>
              </div>
            )}
            {/* Zone badge */}
            {zone && checkoutForm.deliveryType === "delivery" && (
              <div className="flex items-center justify-between mt-1">
                <span>Delivery Zone</span>
                <span
                  className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                  style={{
                    background: zone === "Zone A" ? "#dbeafe" : "#fef3c7",
                    color: zone === "Zone A" ? "#1d4ed8" : "#b45309",
                  }}
                >
                  📍 {zone}
                </span>
              </div>
            )}
            {deliveryError && (
              <div className="text-[#dc3545] font-bold text-[10px] mt-1 bg-[#dc3545]/10 p-2 rounded-lg">
                {deliveryError}
              </div>
            )}
            {/* Minimum order error */}
            {minimumOrderError && (
              <div className="text-[#dc3545] font-bold text-[10px] mt-1 bg-[#dc3545]/10 p-2 rounded-lg flex items-start gap-1">
                <span>⚠️</span>
                <span>{minimumOrderError}</span>
              </div>
            )}
            <div className="flex justify-between text-[#003660] font-extrabold text-sm pt-1 mt-1 border-t border-[#E5E7EB]">
              <span>Amount to Pay</span>
              <span>${cartTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit */}
          {!deliveryChargeLoading && !deliveryError && !minimumOrderError && (
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer uppercase tracking-wider"
              style={{
                background: "var(--color-primary)",
                color: "var(--color-primary-text)",
                boxShadow: "0 4px 12px rgb(var(--color-primary-rgb) / 0.15)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-primary-hover)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgb(var(--color-primary-rgb) / 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-primary)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgb(var(--color-primary-rgb) / 0.15)";
              }}
            >
              Place Order (${cartTotal.toLocaleString()})
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
