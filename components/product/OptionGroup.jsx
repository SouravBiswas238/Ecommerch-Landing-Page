import { useState } from "react";
import {
  Check,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/**
 * OptionGroup — renders a single customization group.
 *
 * Rules:
 * 1. fixed_quantity === true
 *    - Quantity automatically becomes max_quantity.
 *    - No plus/minus quantity buttons.
 *
 * 2. fixed_quantity === false
 *    - User can increase/decrease quantity.
 *    - Cannot exceed modifier max_quantity.
 *
 * 3. Total quantities of all selected modifiers
 *    - Cannot exceed group max_select.
 */
const OptionGroup = ({
  groupKey,
  groupData,
  selectedMods,
  onChange,
}) => {
  const {
    modifiers = [],
    max_select = 1,
    min_select = 0,
  } = groupData;

  const isRequired = min_select > 0;
  const isMulti = max_select > 1;

  const [collapsed, setCollapsed] = useState(false);

  // Convert snake_case into Title Case
  const label = groupKey
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

  const getModifierId = (modifier) =>
    modifier.pos_id || modifier.id || modifier.name;

  const isSelected = (modifier) =>
    selectedMods.some(
      (selectedModifier) =>
        getModifierId(selectedModifier) === getModifierId(modifier),
    );

  const getSelectedMod = (modifier) =>
    selectedMods.find(
      (selectedModifier) =>
        getModifierId(selectedModifier) === getModifierId(modifier),
    );

  /**
   * Fixed modifier quantity:
   * max_quantity -> default_quantity -> quantity -> 1
   */
  const getFixedQuantity = (modifier) => {
    const fixedQuantity = Number(
      modifier.max_quantity ??
        modifier.default_quantity ??
        modifier.quantity ??
        1,
    );

    return Number.isFinite(fixedQuantity) && fixedQuantity > 0
      ? fixedQuantity
      : 1;
  };

  /**
   * Adjustable modifier initial quantity:
   * default_quantity -> quantity -> min_quantity -> 1
   */
  const getDefaultAdjustableQuantity = (modifier) => {
    const minimumQuantity = Math.max(
      1,
      Number(modifier.min_quantity ?? 1),
    );

    const modifierMaximum = Math.max(
      minimumQuantity,
      Number(modifier.max_quantity ?? max_select),
    );

    const defaultQuantity = Number(
      modifier.default_quantity ??
        modifier.quantity ??
        minimumQuantity,
    );

    if (!Number.isFinite(defaultQuantity)) {
      return minimumQuantity;
    }

    return Math.min(
      Math.max(defaultQuantity, minimumQuantity),
      modifierMaximum,
    );
  };

  const totalSelectedQuantity = selectedMods.reduce(
    (total, modifier) => {
      const quantity = Number(modifier.quantity ?? 0);

      return total + (Number.isFinite(quantity) ? quantity : 0);
    },
    0,
  );

  const toggle = (modifier) => {
    const alreadySelected = isSelected(modifier);

    // Remove selected modifier
    if (alreadySelected) {
      onChange(
        groupKey,
        selectedMods.filter(
          (selectedModifier) =>
            getModifierId(selectedModifier) !==
            getModifierId(modifier),
        ),
      );

      return;
    }

    const availableQuantity =
      max_select - totalSelectedQuantity;

    /**
     * Fixed item receives full max_quantity.
     * Adjustable item receives default quantity.
     */
    const requestedQuantity =
      modifier.fixed_quantity === true
        ? getFixedQuantity(modifier)
        : getDefaultAdjustableQuantity(modifier);

    if (isMulti) {
      /**
       * Fixed quantity cannot be partially selected.
       *
       * Example:
       * fixed quantity = 2
       * available quantity = 1
       * Result: selection is blocked.
       */
      if (
        modifier.fixed_quantity === true &&
        requestedQuantity > availableQuantity
      ) {
        return;
      }

      if (availableQuantity <= 0) {
        return;
      }

      /**
       * Adjustable quantity may be reduced to fit
       * the remaining group quantity.
       */
      const quantityToAdd =
        modifier.fixed_quantity === true
          ? requestedQuantity
          : Math.min(requestedQuantity, availableQuantity);

      onChange(groupKey, [
        ...selectedMods,
        {
          ...modifier,
          quantity: quantityToAdd,
        },
      ]);

      return;
    }

    // Single-select group
    onChange(groupKey, [
      {
        ...modifier,
        quantity: requestedQuantity,
      },
    ]);
  };

  const changeModQty = (event, modifier, delta) => {
    event.stopPropagation();

    // Fixed quantities must never be changed manually
    if (modifier.fixed_quantity === true) {
      return;
    }

    const existingModifier = getSelectedMod(modifier);

    if (!existingModifier) {
      return;
    }

    const minimumQuantity = Math.max(
      1,
      Number(modifier.min_quantity ?? 1),
    );

    const maximumQuantity = Math.max(
      minimumQuantity,
      Number(modifier.max_quantity ?? max_select),
    );

    const currentQuantity = Number(
      existingModifier.quantity ?? minimumQuantity,
    );

    let nextQuantity = currentQuantity;

    if (delta > 0) {
      const availableQuantity =
        max_select - totalSelectedQuantity;

      if (availableQuantity <= 0) {
        return;
      }

      nextQuantity = Math.min(
        currentQuantity + 1,
        maximumQuantity,
        currentQuantity + availableQuantity,
      );
    } else {
      nextQuantity = Math.max(
        currentQuantity - 1,
        minimumQuantity,
      );
    }

    if (nextQuantity === currentQuantity) {
      return;
    }

    onChange(
      groupKey,
      selectedMods.map((selectedModifier) =>
        getModifierId(selectedModifier) ===
        getModifierId(modifier)
          ? {
              ...selectedModifier,
              quantity: nextQuantity,
            }
          : selectedModifier,
      ),
    );
  };

  return (
    <div
      className="border rounded-2xl overflow-hidden"
      style={{
        borderColor: "var(--color-border)",
      }}
    >
      {/* Group header */}
      <button
        type="button"
        onClick={() => setCollapsed((previous) => !previous)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#f9f9f9] transition-colors cursor-pointer"
        onMouseEnter={(event) => {
          event.currentTarget.style.background =
            "rgb(var(--color-primary-rgb) / 0.06)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background = "#f9f9f9";
        }}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-extrabold uppercase tracking-wider"
            style={{
              color: "var(--color-secondary)",
            }}
          >
            {label}
          </span>

          {isRequired ? (
            <span className="text-[10px] font-bold bg-[#dc3545]/10 text-[#dc3545] px-2 py-0.5 rounded-full">
              Required
            </span>
          ) : (
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
            <span className="text-[10px] text-[#808080]">
              {totalSelectedQuantity}/{max_select}
            </span>
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
          {modifiers?.map((modifier) => {
            const active = isSelected(modifier);
            const selectedModifier =
              getSelectedMod(modifier);

            const isFixedQuantity =
              modifier.fixed_quantity === true;

            const canAdjustQuantity =
              modifier.fixed_quantity === false;

            const fixedQuantity =
              getFixedQuantity(modifier);

            const minimumQuantity = Math.max(
              1,
              Number(modifier.min_quantity ?? 1),
            );

            const maximumQuantity = Math.max(
              minimumQuantity,
              Number(
                modifier.max_quantity ?? max_select,
              ),
            );

            const currentQuantity = active
              ? Number(
                  selectedModifier?.quantity ??
                    (isFixedQuantity
                      ? fixedQuantity
                      : minimumQuantity),
                )
              : isFixedQuantity
                ? fixedQuantity
                : getDefaultAdjustableQuantity(modifier);

            const availableQuantity =
              max_select - totalSelectedQuantity;

            /**
             * Disable an unselected modifier when:
             * - No quantity remains, or
             * - It is fixed and its full quantity cannot fit.
             */
            const disabled =
              isMulti &&
              !active &&
              (availableQuantity <= 0 ||
                (isFixedQuantity &&
                  fixedQuantity > availableQuantity));

            const cannotIncrease =
              currentQuantity >= maximumQuantity ||
              totalSelectedQuantity >= max_select;

            return (
              <div
                key={getModifierId(modifier)}
                className={`w-full flex items-center justify-between px-4 transition-all ${
                  disabled ? "opacity-40" : ""
                } ${
                  active && canAdjustQuantity
                    ? "py-2"
                    : "py-2.5"
                }`}
                style={
                  active
                    ? {
                        background:
                          "rgb(var(--color-primary-rgb) / 0.06)",
                      }
                    : {}
                }
                onMouseEnter={(event) => {
                  if (!active && !disabled) {
                    event.currentTarget.style.background =
                      "#f9f9f9";
                  }
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background =
                    active
                      ? "rgb(var(--color-primary-rgb) / 0.06)"
                      : "transparent";
                }}
              >
                {/* Left side */}
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    if (!disabled) {
                      toggle(modifier);
                    }
                  }}
                  className="flex items-center gap-3 flex-1 text-left cursor-pointer disabled:cursor-not-allowed"
                >
                  <div
                    className={`flex items-center justify-center transition-all shrink-0 ${
                      isMulti
                        ? "w-4 h-4 rounded border-2"
                        : "w-4 h-4 rounded-full border-2"
                    }`}
                    style={
                      isMulti
                        ? {
                            background: active
                              ? "var(--color-primary)"
                              : "white",
                            borderColor: active
                              ? "var(--color-primary)"
                              : "var(--color-border)",
                          }
                        : {
                            borderColor: active
                              ? "var(--color-primary)"
                              : "var(--color-border)",
                          }
                    }
                  >
                    {isMulti && active && (
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    )}

                    {!isMulti && active && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background:
                            "var(--color-primary)",
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <span
                      className="text-xs font-semibold"
                      style={{
                        color: active
                          ? "var(--color-primary)"
                          : "var(--color-body)",
                      }}
                    >
                      {modifier.name}
                    </span>

                    {isFixedQuantity && (
                      <span className="block text-[10px] text-[#808080] mt-0.5">
                        Fixed quantity: {fixedQuantity}
                      </span>
                    )}

                    {canAdjustQuantity && !active && (
                      <span className="block text-[10px] text-[#808080] mt-0.5">
                        Select up to {maximumQuantity}
                      </span>
                    )}
                  </div>
                </button>

                {/* Right side */}
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {/* Fixed quantity display */}
                  {active && isFixedQuantity && (
                    <span
                      className="px-2.5 py-1 text-[11px] font-extrabold rounded-full"
                      style={{
                        color: "var(--color-primary)",
                        background:
                          "rgb(var(--color-primary-rgb) / 0.1)",
                      }}
                    >
                      Qty: {currentQuantity}
                    </span>
                  )}

                  {/* Adjustable quantity stepper */}
                  {active && canAdjustQuantity && (
                    <div
                      className="flex items-center bg-white rounded-full shadow-sm overflow-hidden"
                      style={{
                        border:
                          "1px solid rgb(var(--color-primary-rgb) / 0.3)",
                      }}
                    >
                      <button
                        type="button"
                        disabled={
                          currentQuantity <= minimumQuantity
                        }
                        onClick={(event) =>
                          changeModQty(
                            event,
                            modifier,
                            -1,
                          )
                        }
                        className={`w-6 h-6 flex items-center justify-center transition-all ${
                          currentQuantity <= minimumQuantity
                            ? "opacity-40 cursor-not-allowed bg-gray-50"
                            : "active:scale-95 cursor-pointer"
                        }`}
                        style={{
                          color: "var(--color-primary)",
                        }}
                        onMouseEnter={(event) => {
                          if (
                            currentQuantity >
                            minimumQuantity
                          ) {
                            event.currentTarget.style.background =
                              "rgb(var(--color-primary-rgb) / 0.1)";
                          }
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.background =
                            "transparent";
                        }}
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>

                      <span
                        className="w-6 text-center text-xs font-extrabold select-none"
                        style={{
                          color: "var(--color-secondary)",
                        }}
                      >
                        {currentQuantity}
                      </span>

                      <button
                        type="button"
                        disabled={cannotIncrease}
                        onClick={(event) =>
                          changeModQty(
                            event,
                            modifier,
                            1,
                          )
                        }
                        className={`w-6 h-6 flex items-center justify-center transition-all ${
                          cannotIncrease
                            ? "opacity-40 cursor-not-allowed bg-gray-50"
                            : "active:scale-95 cursor-pointer"
                        }`}
                        style={{
                          color: "var(--color-primary)",
                        }}
                        onMouseEnter={(event) => {
                          if (!cannotIncrease) {
                            event.currentTarget.style.background =
                              "rgb(var(--color-primary-rgb) / 0.1)";
                          }
                        }}
                        onMouseLeave={(event) => {
                          event.currentTarget.style.background =
                            "transparent";
                        }}
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}

                  <span
                    className="text-xs font-bold shrink-0"
                    style={{
                      color: "var(--color-primary)",
                    }}
                  >
                    {modifier.price > 0
                      ? `+$${(
                          modifier.price *
                          (active ? currentQuantity : 1)
                        ).toLocaleString()}`
                      : "$0"}
                  </span>
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