import { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import { getCompanyFromHost } from "@/lib/api";

export default function App() {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompany() {
      try {
        // Fallback host if testing locally without correct host header
        // In Vite dev, window.location.host is often localhost:3000
        const host = "goodday.aisetechnologies.com";
        const data = await getCompanyFromHost(host);
        setCompanyData(data);
      } catch (error) {
        console.error("Failed to fetch company data from host:", error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCompany();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FDF8F6]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-[#5F359F] border-[#5F359F]/20"></div>
      </div>
    );
  }

  return <LandingPage companyData={companyData} />;
}
