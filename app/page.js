import LandingPage from "@/components/LandingPage";
import { getCompanyFromHost } from "@/lib/api";

export default async function HomePage() {
  // Provide fallback just in case 'host' header is missing
  const host = "goodday.aisetechnologies.com";

  let companyData = null;
  try {
    // If you're testing locally on localhost, the API might not find a match unless your DB has localhost.
    companyData = await getCompanyFromHost(host);
    console.log(companyData)
  } catch (error) {
    console.error("Failed to fetch company data from host:", host, error.message);
  }

  return <LandingPage companyData={companyData} />;
}
