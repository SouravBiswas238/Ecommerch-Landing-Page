"use client";

import { useState, useEffect, useReducer, useCallback } from "react";
import { generateCustomKey } from "@/lib/cartUtils";

// Load cart from localStorage (browser-only)
const loadCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("goodday_cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return action.cart;

    case "ADD_DIRECT": {
      const { product } = action;
      const customKey = product.id;
      const idx = state.findIndex((i) => i.customKey === customKey);
      if (idx > -1) {
        const updated = [...state];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...state, { customKey, product, quantity: 1, selectedOptions: {} }];
    }

    case "ADD_WITH_OPTIONS": {
      const { product, quantity, selectedOptions } = action;
      const customKey = generateCustomKey(product.id, selectedOptions);

      const modifierSurcharge = Object.values(selectedOptions)
        .flat()
        .reduce((sum, mod) => sum + (mod.price || 0) * (mod.quantity ?? 1), 0);

      const enrichedProduct = {
        ...product,
        price: product.price + modifierSurcharge,
        selectedOptionsLabel: Object.entries(selectedOptions)
          .map(([k, mods]) => `${k}: ${mods.map((m) => m.name).join(", ")}`)
          .join(" | "),
      };

      const idx = state.findIndex((i) => i.customKey === customKey);
      if (idx > -1) {
        const updated = [...state];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
        return updated;
      }
      return [...state, { customKey, product: enrichedProduct, quantity, selectedOptions }];
    }

    case "UPDATE_QTY": {
      const { customKey, delta } = action;
      return state
        .map((item) => {
          if (item.customKey === customKey) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    }

    case "REMOVE": {
      return state.filter((i) => i.customKey !== action.customKey);
    }

    case "CLEAR":
      return [];

    default:
      return state;
  }
};

export const useCart = () => {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    const initialCart = loadCart();
    if (initialCart && initialCart.length > 0) {
      dispatch({ type: "SET_CART", cart: initialCart });
    }
    setIsLoaded(true);
  }, []);

  // Persist cart to localStorage on every change *after* initial load has run
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("goodday_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCartDirect = useCallback((product) => {
    dispatch({ type: "ADD_DIRECT", product });
  }, []);

  const addToCartWithOptions = useCallback((product, quantity = 1, selectedOptions = {}) => {
    dispatch({ type: "ADD_WITH_OPTIONS", product, quantity, selectedOptions });
  }, []);

  const updateCartItemQuantity = useCallback((customKey, delta) => {
    dispatch({ type: "UPDATE_QTY", customKey, delta });
  }, []);

  const removeCartItem = useCallback((customKey) => {
    dispatch({ type: "REMOVE", customKey });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const getSimpleProductQty = useCallback(
    (productId) => {
      const item = cart.find((i) => i.product.id === productId);
      return item ? item.quantity : 0;
    },
    [cart]
  );

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    cartSubtotal,
    cartTotalItems,
    addToCartDirect,
    addToCartWithOptions,
    updateCartItemQuantity,
    removeCartItem,
    clearCart,
    getSimpleProductQty,
  };
};
