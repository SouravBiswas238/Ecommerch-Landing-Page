

import { useState } from "react";
import { Check, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";

/**
 * OptionGroup — renders a single customization group (e.g. "Select Flavour").
 * Supports single-select (radio) and multi-select (checkbox) modes.
 * When a modifier has fixed_quantity === false, an inline qty stepper is shown.
 */
const OptionGroup = ({ groupKey, groupData, selectedMods, onChange }) => {
  const { modifiers = [], max_select = 1, min_select = 0 } = groupData;
  const isRequired = min_select > 0;
  const isMulti = max_select > 1;
  const [collapsed, setCollapsed] = useState(false);

  // Convert snake_case → Title Case for the label
  const label = groupKey
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const isSelected = (mod) => selectedMods.some((m) => m.name === mod.name);
  const getSelectedMod = (mod) => selectedMods.find((m) => m.name === mod.name);
  const totalSelectedQuantity = selectedMods.reduce((sum, m) => sum + (m.quantity || 1), 0);

  const toggle = (mod) => {
    const defaultQty = mod.fixed_quantity === false ? (mod.default_quantity ?? 1) : 1;
    if (isMulti) {
      if (isSelected(mod)) {
        onChange(groupKey, selectedMods.filter((m) => m.name !== mod.name));
      } else {
        const availableSlots = max_select - totalSelectedQuantity;
        if (availableSlots > 0) {
          const qtyToAdd = Math.min(defaultQty, availableSlots);
          onChange(groupKey, [...selectedMods, { ...mod, quantity: qtyToAdd }]);
        }
      }
    } else {
      onChange(groupKey, [{ ...mod, quantity: defaultQty }]);
    }
  };

  const changeModQty = (e, mod, delta) => {
    e.stopPropagation();
    const existing = getSelectedMod(mod);
    if (!existing) return;

    const minQty = mod.min_quantity ?? 1;
    const maxQty = mod.max_quantity ?? Infinity;
    let newQty;

    if (delta > 0) {
      const availableSlots = max_select - totalSelectedQuantity;
      if (availableSlots <= 0) return;
      const allowedDelta = Math.min(delta, availableSlots);
      newQty = Math.min(Math.max(minQty, (existing.quantity ?? 1) + allowedDelta), maxQty);
    } else {
      newQty = Math.min(Math.max(minQty, (existing.quantity ?? 1) + delta), maxQty);
    }

    onChange(
      groupKey,
      selectedMods.map((m) => (m.name === mod.name ? { ...m, quantity: newQty } : m))
    );
  };

  return (
    <div className="border rounded-2xl overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
      {/* Group header */}
      <button
        type="button"
        onClick={() => setCollapsed((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#f9f9f9] transition-colors cursor-pointer"
        onMouseEnter={e => { e.currentTarget.style.background = "rgb(var(--color-primary-rgb) / 0.06)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#f9f9f9"; }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "var(--color-secondary)" }}>
            {label}
          </span>
          {isRequired && (
            <span className="text-[10px] font-bold bg-[#dc3545]/10 text-[#dc3545] px-2 py-0.5 rounded-full">
              Required
            </span>
          )}
          {!isRequired && (
            <span className="text-[10px] font-bold bg-[#E5E7EB] text-[#808080] px-2 py-0.5 rounded-full">
              Optional
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {isRequired && (
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full transition-colors ${
                totalSelectedQuantity >= min_select
                  ? "bg-[#198754]/10 text-[#198754]"
                  : "bg-[#dc3545]/8 text-[#dc3545]"
              }`}
            >
              {totalSelectedQuantity >= min_select
                ? `✓ ${totalSelectedQuantity} selected`
                : `Pick at least ${min_select}`}
            </span>
          )}
          {isMulti && (
            <span className="text-[10px] text-[#808080]">max {max_select}</span>
          )}
          {collapsed ? (
            <ChevronDown className="w-3.5 h-3.5 text-[#808080]" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-[#808080]" />
          )}
        </div>
      </button>

      {/* Modifier list */}
      {!collapsed && (
        <div className="divide-y divide-[#f9f9f9]">
          {modifiers.map((mod) => {
            const active = isSelected(mod);
            const selectedMod = getSelectedMod(mod);
            const canAdjustQty = mod.fixed_quantity === false;
            const currentQty = selectedMod?.quantity ?? mod.default_quantity ?? 1;
            const minQty = mod.min_quantity ?? 1;
            const maxQty = mod.max_quantity ?? Infinity;
            const disabled = isMulti && !active && totalSelectedQuantity >= max_select;

            return (
              <div
                key={mod.name}
                className={`w-full flex items-center justify-between px-4 transition-all ${
                  disabled ? "opacity-40" : ""
                } ${active && canAdjustQty ? "py-2" : "py-2.5"}`}
                style={active ? { background: "rgb(var(--color-primary-rgb) / 0.06)" } : {}}
                onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.background = "#f9f9f9"; }}
                onMouseLeave={e => { e.currentTarget.style.background = active ? "rgb(var(--color-primary-rgb) / 0.06)" : "transparent"; }}
              >
                {/* Left: toggle button */}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && toggle(mod)}
                  className="flex items-center gap-3 flex-1 text-left cursor-pointer disabled:cursor-not-allowed"
                >
                  <div
                    className={`flex items-center justify-center transition-all shrink-0 ${
                      isMulti
                        ? "w-4 h-4 rounded border-2"
                        : "w-4 h-4 rounded-full border-2"
                    }`}
                    style={isMulti ? {
                      background: active ? "var(--color-primary)" : "white",
                      borderColor: active ? "var(--color-primary)" : "var(--color-border)",
                    } : {
                      borderColor: active ? "var(--color-primary)" : "var(--color-border)",
                    }}
                  >
                    {isMulti && active && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                    {!isMulti && active && (
                      <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-primary)" }} />
                    )}
                  </div>
                  <div>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: active ? "var(--color-primary)" : "var(--color-body)" }}
                    >
                      {mod.name}
                    </span>
                    {canAdjustQty && !active && (
                      <span className="block text-[10px] text-[#808080] mt-0.5">
                        Qty adjustable
                      </span>
                    )}
                  </div>
                </button>

                {/* Right: qty stepper or price */}
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {active && canAdjustQty ? (
                    <>
                      <div className="flex items-center bg-white rounded-full shadow-sm overflow-hidden"
                        style={{ border: "1px solid rgb(var(--color-primary-rgb) / 0.3)" }}>
                        <button
                          type="button"
                          disabled={currentQty <= minQty}
                          onClick={(e) => changeModQty(e, mod, -1)}
                          className={`w-6 h-6 flex items-center justify-center transition-all ${
                            currentQty <= minQty
                              ? "opacity-40 cursor-not-allowed bg-gray-50"
                              : "active:scale-95 cursor-pointer"
                          }`}
                          style={{ color: "var(--color-primary)" }}
                          onMouseEnter={e => { if (currentQty > minQty) e.currentTarget.style.background = "rgb(var(--color-primary-rgb) / 0.1)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-extrabold select-none" style={{ color: "var(--color-secondary)" }}>
                          {currentQty}
                        </span>
                        <button
                          type="button"
                          disabled={currentQty >= maxQty || totalSelectedQuantity >= max_select}
                          onClick={(e) => changeModQty(e, mod, 1)}
                          className={`w-6 h-6 flex items-center justify-center transition-all ${
                            currentQty >= maxQty || totalSelectedQuantity >= max_select
                              ? "opacity-40 cursor-not-allowed bg-gray-50"
                              : "active:scale-95 cursor-pointer"
                          }`}
                          style={{ color: "var(--color-primary)" }}
                          onMouseEnter={e => { if (!(currentQty >= maxQty || totalSelectedQuantity >= max_select)) e.currentTarget.style.background = "rgb(var(--color-primary-rgb) / 0.1)"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <span className="text-xs font-bold shrink-0" style={{ color: "var(--color-primary)" }}>
                        {mod.price > 0 ? `+$${(mod.price * currentQty).toLocaleString()}` : "$0"}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs font-bold shrink-0" style={{ color: "var(--color-primary)" }}>
                      {mod.price > 0 ? `+$${mod.price}` : "$0"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OptionGroup;
