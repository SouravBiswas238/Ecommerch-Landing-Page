import { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import CateringBookingForm from "@/components/appointment/CateringBookingForm";
import { getCompanyFromHost } from "@/lib/api";
// import { trackVisit } from "@/lib/api";
// import { getVisitorId, hasTrackedToday, markTrackedToday } from "@/lib/visitorId";
import { updateMetaDescription } from "@/lib/updateMeta";

const buildFallbackFavicon = (companyName = "Company") => {
  const initials =
    companyName
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "C";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" rx="24" fill="#5F359F" />
      <text x="50" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#FFFFFF">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const updateFavicon = (companyData) => {
  if (typeof document === "undefined") return;

  const faviconUrl =
    companyData?.attributes?.favicon ||
    buildFallbackFavicon(companyData?.name || "Company");

  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.type = faviconUrl.startsWith("data:image/svg+xml")
    ? "image/svg+xml"
    : "image/png";
  link.href = faviconUrl;
};

export default function App() {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/",
  );

  useEffect(() => {
    const syncPath = () => setCurrentPath(window.location.pathname);

    syncPath();
    window.addEventListener("popstate", syncPath);

    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  useEffect(() => {
    async function fetchCompany() {
      try {
        // Fallback host if testing locally without correct host header
        const host = window.location.host.includes("localhost")
          ? "goodday.aisetechnologies.com"
          : window.location.host;
        const data = await getCompanyFromHost(host);
        setCompanyData(data);
        updateFavicon(data);
      } catch (error) {
        console.error("Failed to fetch company data from host:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCompany();
  }, []);

  useEffect(() => {
    if (companyData) {
      updateFavicon(companyData);
    }
  }, [companyData]);

  useEffect(() => {
    const description = companyData?.attributes?.meta_description;

    updateMetaDescription(description);
  }, [companyData]);

  // TODO: uncomment once the backend /storefront/track-visit endpoint is live.
  // useEffect(() => {
  //   if (!companyData?.id || hasTrackedToday()) return;
  //
  //   // Mark before the request settles so a down/missing endpoint doesn't
  //   // retry on every reload for the rest of the day.
  //   markTrackedToday();
  //   trackVisit(companyData.id, getVisitorId()).catch((error) => {
  //     console.error("Failed to track visit:", error.message);
  //   });
  // }, [companyData]);

  if (new URLSearchParams(window.location.search).get("view") === "analytics") {
    return <AnalyticsDashboard companyId={companyData?.id} />;
  }

  const isAppointmentRoute =
    currentPath === "/appointment" || currentPath.endsWith("/appointment");

  if (isAppointmentRoute) {
    if (loading && !companyData) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#FDF8F6]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-[#5F359F] border-[#5F359F]/20"></div>
        </div>
      );
    }

    return <CateringBookingForm companyId={companyData?.id} />;
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FDF8F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-[#5F359F] border-[#5F359F]/20"></div>
      </div>
    );
  }

  return <LandingPage companyData={companyData} />;
}
