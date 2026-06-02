

import { ShoppingBag, ShoppingCart, Plus, Minus, Trash2, X } from "lucide-react";

const CartDrawer = ({
  cart,
  cartSubtotal,
  cartTotal,
  onClose,
  onUpdateQty,
  onRemove,
  onClear,
  onCheckout,
}) => (
  <div className="fixed inset-0 z-50 bg-[#000]/60 backdrop-blur-sm flex items-end md:items-center justify-center">
    <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:w-[400px] max-h-[85vh] flex flex-col shadow-2xl animate-slide-up">
      {/* Handle */}
      <div className="w-12 h-1 bg-[#E5E7EB] rounded-full mx-auto my-3 shrink-0" />

      {/* Header */}
      <div className="px-4 pb-3 border-b flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" style={{ color: "var(--color-primary)" }} />
          <h3 className="font-extrabold text-base" style={{ color: "var(--color-secondary)" }}>Your Delicious Cart</h3>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-[#f9f9f9] flex items-center justify-center cursor-pointer"
          style={{ border: "1px solid var(--color-border)", color: "var(--color-muted)" }}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <ShoppingCart className="w-12 h-12 mx-auto opacity-40" style={{ color: "var(--color-muted)" }} />
            <p className="text-sm font-bold" style={{ color: "var(--color-secondary)" }}>No meals in cart</p>
            <p className="text-xs" style={{ color: "var(--color-muted)" }}>Add items from the menu.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.customKey} className="flex items-start justify-between gap-3 text-sm pb-3 border-b" style={{ borderColor: "#f9f9f9" }}>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold leading-tight truncate" style={{ color: "var(--color-secondary)" }}>{item.product.name}</h4>
                <span className="text-xs font-bold mt-1 inline-block" style={{ color: "var(--color-primary)" }}>
                  ${item.product.price.toLocaleString()} each
                </span>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="flex items-center bg-[#f9f9f9] rounded-full p-0.5" style={{ border: "1px solid var(--color-border)" }}>
                  <button onClick={() => onUpdateQty(item.customKey, -1)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white cursor-pointer" style={{ color: "var(--color-primary)" }}>
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold" style={{ color: "var(--color-secondary)" }}>{item.quantity}</span>
                  <button onClick={() => onUpdateQty(item.customKey, 1)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-white cursor-pointer" style={{ color: "var(--color-primary)" }}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button onClick={() => onRemove(item.customKey, item.product.name)} className="text-xs font-semibold flex items-center gap-0.5 cursor-pointer" style={{ color: "var(--color-danger)" }}>
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {cart.length > 0 && (
        <div className="p-4 border-t space-y-3 pb-8" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
          <div className="space-y-1.5 text-xs" style={{ color: "var(--color-muted)" }}>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold" style={{ color: "var(--color-body)" }}>${cartSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-dashed" style={{ borderColor: "var(--color-border)" }}>
              <span className="font-extrabold" style={{ color: "var(--color-secondary)" }}>Paid Total</span>
              <span className="font-extrabold text-base" style={{ color: "var(--color-secondary)" }}>${cartTotal.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={onClear} className="w-1/3 py-3 border bg-white rounded-xl text-xs font-bold transition-all cursor-pointer" style={{ borderColor: "var(--color-border)", color: "var(--color-danger)" }}>
              Clear All
            </button>
            <button onClick={onCheckout} className="w-2/3 py-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer"
              style={{ background: "var(--color-primary)", color: "var(--color-primary-text)", boxShadow: "0 4px 12px rgb(var(--color-primary-rgb) / 0.15)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary-hover)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--color-primary)"; }}
            >
              Checkout Order
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default CartDrawer;
