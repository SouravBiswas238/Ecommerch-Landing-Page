"use client";

import { useState, useEffect } from "react";
import { fetchDeliveryCharge } from "@/lib/api";

export const useDeliveryCharge = (companyId, mapLocation, deliveryType) => {
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliveryChargeLoading, setDeliveryChargeLoading] = useState(false);
  const [deliveryError, setDeliveryError] = useState("");

  useEffect(() => {
    if (companyId && mapLocation && deliveryType === "delivery") {
      const load = async () => {
        setDeliveryChargeLoading(true);
        setDeliveryError("");
        try {
          const data = await fetchDeliveryCharge(companyId, mapLocation.lat, mapLocation.lng);
          if (data && data?.delivery_charge !== undefined) {
            setDeliveryCharge(data?.delivery_charge);
          }
        } catch (error) {
          const msg =
            error.response?.data?.detail ||
            "Could not calculate delivery fee for this location.";
          setDeliveryError(msg);
          setDeliveryCharge(0);
        } finally {
          setDeliveryChargeLoading(false);
        }
      };
      load();
    } else {
      setDeliveryCharge(0);
      setDeliveryError("");
    }
  }, [companyId, mapLocation, deliveryType]);

  return { deliveryCharge, deliveryChargeLoading, deliveryError };
};
