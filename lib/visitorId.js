const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const VISITOR_ID_COOKIE = "goodday_visitor_id";
const LAST_TRACKED_COOKIE = "goodday_last_tracked_date";

export const getVisitorId = () => {
  let visitorId = getCookie(VISITOR_ID_COOKIE);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    setCookie(VISITOR_ID_COOKIE, visitorId, 730);
  }
  return visitorId;
};

export const hasTrackedToday = () => {
  const today = new Date().toISOString().slice(0, 10);
  return getCookie(LAST_TRACKED_COOKIE) === today;
};

export const markTrackedToday = () => {
  const today = new Date().toISOString().slice(0, 10);
  setCookie(LAST_TRACKED_COOKIE, today, 2);
};
