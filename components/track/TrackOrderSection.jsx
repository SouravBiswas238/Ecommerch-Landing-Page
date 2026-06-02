

import { useState, useCallback } from "react";
import {
  RefreshCw, ChevronDown, ChevronUp, Truck, Package, MapPin,
  CreditCard, ShoppingBag, DollarSign,
} from "lucide-react";
import { getOrderByUUID } from "@/lib/api";

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "text-[#808080]", bg: "bg-[#f3f4f6]", dot: "#808080" },
  pending: { label: "Pending", color: "text-[#d97706]", bg: "bg-[#fef3c7]", dot: "#d97706" },
  processing: { label: "Processing", color: "text-[#2563eb]", bg: "bg-[#dbeafe]", dot: "#2563eb" },
  on_the_way: { label: "On the Way", color: "text-[#7c3aed]", bg: "bg-[#ede9fe]", dot: "#7c3aed" },
  delivered: { label: "Delivered", color: "text-[#059669]", bg: "bg-[#d1fae5]", dot: "#059669" },
  completed: { label: "Completed", color: "text-[#059669]", bg: "bg-[#d1fae5]", dot: "#059669" },
  cancelled: { label: "Cancelled", color: "text-[#dc2626]", bg: "bg-[#fee2e2]", dot: "#dc2626" },
  canceled: { label: "Canceled", color: "text-[#dc2626]", bg: "bg-[#fee2e2]", dot: "#dc2626" },
};

const getStatus = (raw = "") =>
  STATUS_CONFIG[raw.toLowerCase()] ?? {
    label: raw || "Unknown", color: "text-[#808080]", bg: "bg-[#f3f4f6]", dot: "#808080",
  };

const Row = ({ label, value }) =>
  value ? (
    <div className="flex justify-between items-start gap-3 text-xs">
      <span className="text-[#808080] font-semibold shrink-0">{label}</span>
      <span className="font-bold text-right text-[#374151] break-words max-w-[60%]">{value}</span>
    </div>
  ) : null;

const formatPickupTime = (t) => {
  if (!t) return null;
  try {
    const [h, m] = t.split(":").map(Number);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
  } catch { return t; }
};

/**
 * TrackOrderSection — expands to show order details for a given UUID.
 */
const TrackOrderSection = ({ uuid }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!uuid) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderByUUID(uuid);
      setOrder(data);
      setExpanded(true);
    } catch (err) {
      console.error("Order fetch error:", err);
      setError("Could not load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  const status = getStatus(order?.order_status);
  const pickupTime = formatPickupTime(order?.attributes?.pickup_time);

  return (
    <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: "var(--color-border)" }}>
      {/* Header */}
      <button
        type="button"
        onClick={() => { if (!order) { fetchOrder(); } else { setExpanded((p) => !p); } }}
        disabled={loading}
        className="w-full flex items-center justify-between px-4 py-3.5 text-white cursor-pointer transition-colors disabled:opacity-70"
        style={{ background: "var(--color-primary)" }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary-hover)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "var(--color-primary)"; }}
      >
        <div className="flex items-center gap-2">
          {loading
            ? <RefreshCw className="w-4 h-4 animate-spin" />
            : <Truck className="w-4 h-4" />}
          <span className="text-xs font-extrabold uppercase tracking-wider">
            {loading ? "Loading order…" : "Track My Order"}
          </span>
        </div>
        {order && (expanded
          ? <ChevronUp className="w-4 h-4 opacity-70" />
          : <ChevronDown className="w-4 h-4 opacity-70" />)}
      </button>

      {error && (
        <p className="text-xs text-[#dc2626] font-semibold px-4 py-2 bg-[#fee2e2]">{error}</p>
      )}

      {order && expanded && (
        <div className="bg-white p-4 space-y-3">
          {/* Status + Order # */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: status.dot }} />
              <span className={`text-xs font-extrabold ${status.color} ${status.bg} px-2 py-0.5 rounded-full`}>
                {status.label}
              </span>
            </div>
            {order.company_order_id && (
              <span className="text-[10px] font-extrabold" style={{ color: "var(--color-secondary)" }}>
                Order #{order.company_order_id}
              </span>
            )}
          </div>

          <hr className="border-dashed border-[#E5E7EB]" />

          {/* Core info */}
          <div className="space-y-2">
            <Row label="Customer" value={order.customer_name} />
            <Row label="Phone" value={order.phone_number} />
            <Row label="Delivery Type" value={order.delivery_type && (order.delivery_type.charAt(0).toUpperCase() + order.delivery_type.slice(1))} />
            {order.delivery_type === "delivery" && <Row label="Address" value={order.shipping_address} />}
            {pickupTime && <Row label="Pickup Time" value={pickupTime} />}
            <Row label="Payment" value={order.payment_method?.toUpperCase()} />
            <Row label="Payment Status" value={order.payment_status && (order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1))} />
            {order.attributes?.order_note && <Row label="Note" value={order.attributes.order_note} />}
          </div>

          {/* Products */}
          {order.products?.length > 0 && (
            <>
              <hr className="border-dashed border-[#E5E7EB]" />
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase text-[#808080] tracking-wider flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3" /> Items
                </span>
                {order.products.map((p, i) => {
                  const opts = Object.values(p.options || {}).flat().map((m) => m.name).filter(Boolean);
                  return (
                    <div key={i} className="flex justify-between items-start text-xs">
                      <div className="flex-1 pr-2">
                        <p className="font-bold text-[#374151]">{p.quantity}× {p.product?.name}</p>
                        {opts.length > 0 && <p className="text-[10px] text-[#808080] mt-0.5">{opts.join(", ")}</p>}
                      </div>
                      <span className="font-extrabold shrink-0" style={{ color: "var(--color-primary)" }}>${Number(p.total_price).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Charges */}
          {order.charges?.length > 0 && (
            <>
              <hr className="border-dashed border-[#E5E7EB]" />
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase text-[#808080] tracking-wider flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Charges
                </span>
                {order.charges.map((charge, i) => (
                  <div key={i} className="flex justify-between items-start text-xs">
                    <p className="font-bold text-[#374151] flex-1 pr-2">{charge.name}</p>
                    <span className="font-extrabold shrink-0" style={{ color: "var(--color-primary)" }}>${Number(charge.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Live Tracking */}
          <button
            type="button"
            disabled={!order.riding_on_going}
            className={`w-full flex items-center justify-center gap-2 py-2.5 mt-2 rounded-xl text-xs font-bold transition-all ${order.riding_on_going
              ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md cursor-pointer"
              : "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed"
              }`}
          >
            <MapPin className="w-4 h-4" />
            {order.riding_on_going ? "Track Live Location" : "Live Tracking Unavailable"}
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={fetchOrder}
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 pt-3 pb-1 text-[11px] font-bold transition-colors disabled:opacity-50 cursor-pointer"
            style={{ color: "var(--color-primary)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--color-primary-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--color-primary)"; }}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            Refresh Status
          </button>
        </div>
      )}
    </div>
  );
};

export default TrackOrderSection;
