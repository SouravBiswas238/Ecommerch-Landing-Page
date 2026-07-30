import { useEffect, useState } from "react";
// import { fetchVisitorStats } from "@/lib/api";
import VisitorStatsChart from "@/components/analytics/VisitorStatsChart";

export default function AnalyticsDashboard({ companyId }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;

    // TODO: uncomment once the backend /storefront/analytics/visitors/:companyId
    // endpoint is live, and remove the setError(...) fallback below.
    // let cancelled = false;
    // fetchVisitorStats(companyId)
    //   .then((data) => {
    //     if (!cancelled) setStats(Array.isArray(data) ? data : []);
    //   })
    //   .catch((err) => {
    //     if (!cancelled) setError(err.message);
    //   });
    //
    // return () => {
    //   cancelled = true;
    // };
    setError("Analytics API not wired up yet.");
  }, [companyId]);

  const totalVisitors = stats?.reduce((sum, day) => sum + day.uniqueVisitors, 0) ?? 0;

  return (
    <div className="min-h-screen bg-[#f9f9f7] px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-lg font-semibold text-[#0b0b0b]">Unique visitors</h1>
        <p className="mt-1 text-sm text-[#52514e]">Last 30 days, deduped per browser</p>

        <div className="mt-6 rounded-xl border border-[rgba(11,11,11,0.10)] bg-[#fcfcfb] p-6">
          {!companyId && (
            <p className="text-sm text-[#898781]">Loading company info…</p>
          )}

          {companyId && error && (
            <p className="text-sm text-[#898781]">
              Analytics aren&apos;t available yet — this view will populate once the
              backend tracking endpoint is live.
            </p>
          )}

          {companyId && !error && stats === null && (
            <p className="text-sm text-[#898781]">Loading visitor stats…</p>
          )}

          {companyId && !error && stats !== null && stats.length === 0 && (
            <p className="text-sm text-[#898781]">No visitor data yet.</p>
          )}

          {companyId && !error && stats !== null && stats.length > 0 && (
            <>
              <p className="text-3xl font-semibold text-[#0b0b0b]">
                {totalVisitors.toLocaleString()}
              </p>
              <div className="mt-4">
                <VisitorStatsChart data={stats} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
