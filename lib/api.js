import axios from "axios";
const host = window.location.origin.includes('localhost') ? 'https://dev.aisetechnologies.com':window.location.origin;

const getServerLink = (serverHost) => {
  return `${serverHost || host}`;
};
/**
 * Fetch company details dynamically based on hostname.
 * @param {string} host - The hostname (e.g. goodday.aisetechnologies.com)
 */

export const getCompanyFromHost = async (host) => {
  const response = await axios.post(
    `${getServerLink()}/storefront/get-company-from-host`,
    { host },
    { headers: { "Content-Type": "application/json" } },
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
    { withCredentials: false },
  );
  return response?.data;
};

// Fetch company open settings for the menu.

export const fetchCompanyOpenSettings = async (companyId) => {
  if (!companyId) {
    return [];
  }

  const response = await axios.get(
    `${getServerLink()}/company-open-setting/list/public/${companyId}`,
    {
      withCredentials: false,
    },
  );


  return Array.isArray(response?.data?.results) ? response.data.results : [];
};

/**
 * Create a new ecommerce order.
 * @param {object} payload - Order payload object
 */
export const createOrder = async (payload) => {
  const response = await axios.post(
    `${getServerLink()}/ecommerce/orders/create-v2`,
    payload,
    { headers: { "Content-Type": "application/json" } },
  );
  return response.data;
};

export const fetchTopOrderedProducts = async (companyId) => {
  const response = await axios.get(
    `${getServerLink()}/ecommerce/analytics/top-ordered-products/${companyId}`,
    { withCredentials: false },
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
    { withCredentials: false },
  );
  return response.data;
};

/**
 * Fetch delivery charge estimate for given coordinates.
 * @param {number|string} companyId - Dynamic company ID
 */
export const fetchDeliveryCharge = async (companyId, lat, lng) => {
  const response = await axios.get(
    `${getServerLink()}/ecommerce/delivery-charge-estimate?company=${companyId}&lat=${lat}&lng=${lng}`,
  );
  return response.data;
};
