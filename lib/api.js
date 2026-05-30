import axios from "axios";

const getServerLink = (serverHost = "") => {
  if (typeof window !== "undefined") {
    return window.location.host.includes("localhost")
      ? `https://dev.aisalesteams.com`
      : `https://${window.location.host || window.location.hostname}`;
  }
  
  // Server-side fallback using the host passed in, or default to dev/env
  if (serverHost) {
    return serverHost.includes("localhost")
      ? `https://dev.aisalesteams.com`
      : `https://${serverHost}`;
  }
  
  return process.env.NEXT_PUBLIC_SERVER_LINK || "https://dev.aisalesteams.com";
};

/**
 * Fetch company details dynamically based on hostname.
 * @param {string} host - The hostname (e.g. goodday.aisetechnologies.com)
 */

export const getCompanyFromHost = async (host) => {
  const response = await axios.post(
    `${getServerLink(host)}/storefront/get-company-from-host`,
    { host },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

/**
 * Fetch all active products for the menu.
 * @param {number|string} companyId - Dynamic company ID
 */
export const fetchMenu = async (companyId) => {
  const response = await axios.get(
    `${getServerLink()}/vendor/product/get_all/checkout/${companyId}`,
    { withCredentials: false }
  );
  return response?.data;
};

/**
 * Create a new ecommerce order.
 * @param {object} payload - Order payload object
 */
export const createOrder = async (payload) => {
  const response = await axios.post(
    `${getServerLink()}/ecommerce/orders/create-v2`,
    payload,
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
};

/**
 * Get a single order by UUID.
 * @param {string} uuid - Order UUID
 */
export const getOrderByUUID = async (uuid) => {
  const response = await axios.get(
    `${getServerLink()}/ecommerce/orders/get/uuid/${uuid}`,
    { withCredentials: false }
  );
  return response.data;
};

/**
 * Fetch delivery charge estimate for given coordinates.
 * @param {number|string} companyId - Dynamic company ID
 */
export const fetchDeliveryCharge = async (companyId, lat, lng) => {
  const response = await axios.get(
    `${getServerLink()}/ecommerce/delivery-charge-estimate?company=${companyId}&lat=${lat}&lng=${lng}`
  );
  return response.data;
};
