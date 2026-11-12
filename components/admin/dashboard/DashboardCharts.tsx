"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export function SalesLineChart({ data }: { data: { date: string; revenue: number }[] }) {
  return (
    <div className="card p-5">
      <h3 className="font-display text-sm font-bold text-ink">Sales Over Time</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e8ec" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#8b90a0" />
            <YAxis tick={{ fontSize: 11 }} stroke="#8b90a0" />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Revenue"]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#015be8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TopProductsBarChart({ data }: { data: { name: string; quantity: number }[] }) {
  return (
    <div className="card p-5">
      <h3 className="font-display text-sm font-bold text-ink">Top-Selling Products</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e8ec" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#8b90a0" interval={0} angle={-15} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 11 }} stroke="#8b90a0" allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="quantity" fill="#015be8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
