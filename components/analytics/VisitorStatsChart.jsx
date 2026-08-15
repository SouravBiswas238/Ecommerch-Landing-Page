import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SERIES_COLOR = "#5F359F";
const GRID_COLOR = "#e1e0d9";
const AXIS_COLOR = "#c3c2b7";
const MUTED_TEXT = "#898781";

const formatDateTick = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[rgba(11,11,11,0.10)] bg-[#fcfcfb] px-3 py-2 shadow-sm">
      <p className="text-xs text-[#52514e]">{formatDateTick(label)}</p>
      <p className="text-sm font-semibold text-[#0b0b0b]">
        {payload[0].value.toLocaleString()} unique visitors
      </p>
    </div>
  );
}

export default function VisitorStatsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
        <CartesianGrid
          vertical={false}
          stroke={GRID_COLOR}
          strokeWidth={1}
        />
        <XAxis
          dataKey="date"
          tickFormatter={formatDateTick}
          tick={{ fill: MUTED_TEXT, fontSize: 12 }}
          axisLine={{ stroke: AXIS_COLOR }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: MUTED_TEXT, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ stroke: AXIS_COLOR, strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="uniqueVisitors"
          stroke={SERIES_COLOR}
          strokeWidth={2}
          fill={SERIES_COLOR}
          fillOpacity={0.1}
          dot={{ r: 4, fill: SERIES_COLOR, stroke: "#fcfcfb", strokeWidth: 2 }}
          activeDot={{ r: 5, fill: SERIES_COLOR, stroke: "#fcfcfb", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
