

import { useState, useEffect } from "react";
import { fetchDeliveryCharge } from "@/lib/api";

// Zone-based minimum order requirements
const ZONE_MINIMUMS = {
  "Zone A": 1000,
  "Zone B": 1500,
};

export const useDeliveryCharge = (companyId, mapLocation, deliveryType, cartSubtotal = 0) => {
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliveryChargeLoading, setDeliveryChargeLoading] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");
  const [zone, setZone] = useState("");

  useEffect(() => {
    if (companyId && mapLocation && deliveryType === "delivery") {
      const load = async () => {
        setDeliveryChargeLoading(true);
        setDeliveryError("");
        setZone("");
        try {
          const data = await fetchDeliveryCharge(companyId, mapLocation.lat, mapLocation.lng);
          if (data && data?.delivery_charge !== undefined) {
            setDeliveryCharge(data.delivery_charge);
          }
          if (data?.zone) {
            setZone(data.zone);
          }
          if (data?.detail) {
            const msg =
              data?.detail ||
              "Could not calculate delivery fee for this location.";
            setDeliveryError(msg);
            setDeliveryCharge(0);
            setZone("");
          }
        } catch (error) {
          const msg =
            error.response?.data?.detail ||
            "Could not calculate delivery fee for this location.";
          setDeliveryError(msg);
          setDeliveryCharge(0);
          setZone("");
        } finally {
          setDeliveryChargeLoading(false);
        }
      };
      load();
    } else {
      setDeliveryCharge(0);
      setDeliveryError("");
      setZone("");
    }
  }, [companyId, mapLocation, deliveryType]);

  // Compute minimum order error based on the detected zone
  const minimumRequired = zone ? (ZONE_MINIMUMS[zone] ?? null) : null;
  const minimumOrderError =
    deliveryType === "delivery" && zone && minimumRequired !== null && cartSubtotal < minimumRequired
      ? `Minimum order for ${zone} is $${minimumRequired.toLocaleString()}. Please add $${(minimumRequired - cartSubtotal).toLocaleString()} more to place your order.`
      : "";

  return { deliveryCharge, deliveryChargeLoading, deliveryError, zone, minimumOrderError };
};
