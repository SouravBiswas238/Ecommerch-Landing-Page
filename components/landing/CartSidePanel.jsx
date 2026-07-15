import { ShoppingBag, ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";

const CartSidePanel = ({
  cart,
  cartTotalItems,
  cartSubtotal,
  cartTotal,
  onUpdateQty,
  onRemove,
  onClear,
  onCheckout,
}) => (
  <div
    className="bg-white rounded-2xl border p-5 shadow-sm sticky top-24 space-y-5"
    style={{ borderColor: "var(--color-border)" }}
  >
    {/* Header */}
    <div
      className="flex items-center justify-between pb-3 border-b"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center gap-2">
        <ShoppingBag
          className="w-5 h-5"
          style={{ color: "var(--color-primary)" }}
        />
        <h3
          className="font-extrabold text-base"
          style={{ color: "var(--color-secondary)" }}
        >
          Your Order Checkout
        </h3>
      </div>
      <span
        className="px-2 py-0.5 rounded-full text-xs font-extrabold"
        style={{
          background: "rgb(var(--color-primary-rgb) / 0.1)",
          color: "var(--color-primary)",
        }}
      >
        {cartTotalItems} items
      </span>
    </div>

    {/* Cart Items */}
    {cart.length === 0 ? (
      <div className="py-12 text-center space-y-3">
        <div
          className="w-12 h-12 rounded-full bg-[#f9f9f9] flex items-center justify-center mx-auto"
          style={{ color: "var(--color-muted)" }}
        >
          <ShoppingCart className="w-5 h-5" />
        </div>
        <div className="max-w-[180px] mx-auto">
          <p
            className="text-sm font-bold"
            style={{ color: "var(--color-secondary)" }}
          >
            Your cart is empty
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
            Select items from our menu above to customize your feast.
          </p>
        </div>
      </div>
    ) : (
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
        {cart.map((item) => (
          <div
            key={item.customKey}
            className="flex items-start justify-between gap-3 text-sm pb-3 border-b"
            style={{ borderColor: "#f9f9f9" }}
          >
            <div className="flex-1 min-w-0">
              <h4
                className="font-bold truncate"
                style={{ color: "var(--color-secondary)" }}
              >
                {item.product.name}
              </h4>
              <span
                className="text-xs font-bold mt-1 inline-block"
                style={{ color: "var(--color-primary)" }}
              >
                ${item.product.price.toLocaleString()} each
              </span>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <div
                className="flex items-center bg-[#f9f9f9] rounded-full p-0.5"
                style={{ border: "1px solid var(--color-border)" }}
              >
                <button
                  onClick={() => onUpdateQty(item.customKey, -1)}
                  className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white cursor-pointer"
                  style={{ color: "var(--color-primary)" }}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span
                  className="w-5 text-center text-xs font-bold"
                  style={{ color: "var(--color-secondary)" }}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={() => onUpdateQty(item.customKey, 1)}
                  className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white cursor-pointer"
                  style={{ color: "var(--color-primary)" }}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <button
                onClick={() => onRemove(item.customKey, item.product.name)}
                className="text-xs font-semibold flex items-center gap-0.5 hover:underline cursor-pointer"
                style={{ color: "var(--color-danger)" }}
              >
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Totals & Actions */}
    {cart.length > 0 && (
      <div
        className="space-y-2 text-xs pt-2 border-t"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div
          className="flex justify-between"
          style={{ color: "var(--color-muted)" }}
        >
          <span>Subtotal</span>
          <span className="font-bold" style={{ color: "var(--color-body)" }}>
            ${cartSubtotal.toLocaleString()}
          </span>
        </div>
        <div
          className="flex justify-between text-sm pt-2 border-t border-dashed"
          style={{ borderColor: "var(--color-border)" }}
        >
          <span
            className="font-extrabold"
            style={{ color: "var(--color-secondary)" }}
          >
            Total Order Amount
          </span>
          <span
            className="font-extrabold text-base"
            style={{ color: "var(--color-secondary)" }}
          >
            ${cartTotal.toLocaleString()}
          </span>
        </div>
        <div className="flex gap-2 pt-3">
          <button
            onClick={onClear}
            className="w-1/3 py-2.5 border rounded-xl text-xs font-bold transition-all cursor-pointer"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-danger)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgb(220 53 69 / 0.05)";
              e.currentTarget.style.borderColor = "var(--color-danger)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
          >
            Clear All
          </button>
          <button
            onClick={onCheckout}
            className="w-2/3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            style={{
              background: "var(--color-primary)",
              color: "var(--color-primary-text)",
              boxShadow: "0 4px 12px rgb(var(--color-primary-rgb) / 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--color-primary-hover)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgb(var(--color-primary-rgb) / 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-primary)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgb(var(--color-primary-rgb) / 0.15)";
            }}
          >
            Checkout Order
          </button>
        </div>
      </div>
    )}
  </div>
);

export default CartSidePanel;
