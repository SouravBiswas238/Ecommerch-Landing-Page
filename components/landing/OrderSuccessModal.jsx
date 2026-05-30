"use client";

import { CheckCircle, Clock, MapPin, CreditCard } from "lucide-react";

const OrderSuccessModal = ({ orderDetails, redirectCountdown, onTrackOrder, onBackToMenu }) => {
  if (!orderDetails) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#000]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-zoom-in text-center p-6 border relative"
        style={{ borderColor: "var(--color-border)" }}>
        {/* Top colour bar */}
        <div className="absolute top-0 left-0 w-full h-2"
          style={{ background: "linear-gradient(to right, var(--color-accent), var(--color-primary), var(--color-secondary))" }} />

        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mt-2 mb-4"
          style={{ background: "rgb(var(--color-success, 25 135 84) / 0.1)", color: "var(--color-success)" }}>
          <CheckCircle className="w-9 h-9" />
        </div>

        <h2 className="text-xl md:text-2xl font-extrabold" style={{ color: "var(--color-secondary)" }}>Order Placed Successfully!</h2>
        <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
          Thank you, <span className="font-bold" style={{ color: "var(--color-body)" }}>{orderDetails.customerName}</span>! Your food is on its way.
        </p>

        {redirectCountdown > 0 && (
          <p className="text-xs mt-2 flex items-center justify-center gap-1" style={{ color: "var(--color-muted)" }}>
            <Clock className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />
            Redirecting to menu in <span className="font-bold" style={{ color: "var(--color-primary)" }}>&nbsp;{redirectCountdown}s</span>
          </p>
        )}

        {/* Ticket card */}
        <div className="bg-[#f9f9f9] border rounded-2xl p-4 my-5 text-left text-xs space-y-3 relative" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex justify-between pb-2 border-b border-dashed" style={{ borderColor: "var(--color-border)" }}>
            <div>
              <p style={{ color: "var(--color-muted)" }}>ORDER NO</p>
              <p className="font-extrabold text-sm" style={{ color: "var(--color-secondary)" }}>{orderDetails.orderNumber}</p>
            </div>
            <div className="text-right">
              <p style={{ color: "var(--color-muted)" }}>ORDER TIME</p>
              <p className="font-extrabold" style={{ color: "var(--color-body)" }}>{orderDetails.time}</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
            {orderDetails.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div className="flex-1 pr-3">
                  <p className="font-bold" style={{ color: "var(--color-body)" }}>{item.quantity}x {item.product.name}</p>
                </div>
                <span className="font-extrabold" style={{ color: "var(--color-secondary)" }}>
                  ${(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery info */}
          <div className="pt-2 border-t border-dashed space-y-1" style={{ borderColor: "var(--color-border)", color: "var(--color-body)" }}>
            {orderDetails.deliveryAddress && (
              <p className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-primary)" }} />
                <span className="truncate font-medium">{orderDetails.deliveryAddress}</span>
              </p>
            )}
            <p className="flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-primary)" }} />
              <span className="font-medium uppercase">
                {orderDetails.paymentMethod === "cod" ? "Cash on Delivery" : orderDetails.paymentMethod}
              </span>
            </p>
          </div>

          {/* Total */}
          <div className="pt-2 border-t flex justify-between items-center text-sm" style={{ borderColor: "var(--color-border)" }}>
            <span className="font-bold" style={{ color: "var(--color-secondary)" }}>Paid Total</span>
            <span className="font-extrabold text-base" style={{ color: "var(--color-primary)" }}>${orderDetails.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={onTrackOrder}
            className="w-full py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer uppercase tracking-wider shadow-md hover:shadow-lg"
            style={{ background: "var(--color-accent)", color: "var(--color-accent-text)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "var(--color-primary-text)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--color-accent)"; e.currentTarget.style.color = "var(--color-accent-text)"; }}
          >
            Track Order
          </button>
          <button
            onClick={onBackToMenu}
            className="w-full py-2.5 border rounded-xl text-xs font-semibold transition-all cursor-pointer"
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
};

export default OrderSuccessModal;
