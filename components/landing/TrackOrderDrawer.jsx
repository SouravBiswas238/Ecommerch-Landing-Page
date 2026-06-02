

import { X, ShoppingCart } from "lucide-react";
import TrackOrderSection from "@/components/track/TrackOrderSection";

const TrackOrderDrawer = ({ savedOrders, onClose }) => (
  <div className="fixed inset-0 z-50 flex justify-end">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

    {/* Panel */}
    <div className="relative z-10 w-full max-w-sm bg-white h-full flex flex-col shadow-2xl animate-slide-left overflow-hidden">
      {/* Header */}
      <div className="text-white px-5 py-4 flex items-center justify-between shrink-0"
        style={{ background: "var(--color-primary)" }}>
        <div>
          <h3 className="font-extrabold text-base">My Recent Orders</h3>
          {savedOrders.length > 0 && savedOrders[0].customerName && (
            <p className="text-xs text-white/70 mt-0.5">Hello, {savedOrders[0].customerName} 👋</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#f9f9f9]">
        {savedOrders.length > 0 ? (
          savedOrders.map((order, idx) => (
            <div key={order.uuid} className="space-y-2">
              {idx > 0 && <hr className="my-4" style={{ borderColor: "var(--color-border)" }} />}
              <div className="flex items-center justify-between px-2 text-xs" style={{ color: "var(--color-muted)" }}>
                <span className="font-bold" style={{ color: "var(--color-primary)" }}>{order.orderNumber || "Order"}</span>
                {order.placedAt && (
                  <span>
                    {new Date(order.placedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                    {" at "}
                    {new Date(order.placedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                <TrackOrderSection uuid={order.uuid} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 mt-10">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--color-border)" }} />
            <h4 className="font-bold" style={{ color: "var(--color-secondary)" }}>No recent orders found</h4>
            <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>Place an order to see your tracking history here.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t bg-white shrink-0" style={{ borderColor: "var(--color-border)" }}>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer"
          style={{ borderColor: "var(--color-border)", color: "var(--color-body)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#f9f9f9"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          Back to Menu
        </button>
      </div>
    </div>
  </div>
);

export default TrackOrderDrawer;
