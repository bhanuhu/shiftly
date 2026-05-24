"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { chartSeries, statusDistribution, zones } from "@/services/mock-data";

const colors = ["#A3D65C", "#60A5FA", "#F59E0B", "#34D399", "#F87171"];

export function BookingsAreaChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartSeries}>
        <defs>
          <linearGradient id="bookings" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#A3D65C" stopOpacity={0.34} />
            <stop offset="95%" stopColor="#A3D65C" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(226,232,240,.075)" vertical={false} />
        <XAxis dataKey="label" stroke="#8EA0B8" />
        <YAxis stroke="#8EA0B8" />
        <Tooltip contentStyle={{ background: "#0D1B33", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8 }} />
        <Area type="monotone" dataKey="bookings" stroke="#A3D65C" fill="url(#bookings)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RevenueBarChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartSeries}>
        <CartesianGrid stroke="rgba(226,232,240,.075)" vertical={false} />
        <XAxis dataKey="label" stroke="#8EA0B8" />
        <YAxis stroke="#8EA0B8" />
        <Tooltip contentStyle={{ background: "#0D1B33", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8 }} />
        <Bar dataKey="revenue" fill="#A3D65C" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ZonesChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart layout="vertical" data={zones}>
        <XAxis type="number" stroke="#8EA0B8" />
        <YAxis dataKey="zone" type="category" stroke="#8EA0B8" width={92} />
        <Tooltip contentStyle={{ background: "#0D1B33", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8 }} />
        <Bar dataKey="active" fill="#60A5FA" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatusPieChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip contentStyle={{ background: "#0D1B33", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8 }} />
        <Pie data={statusDistribution} dataKey="value" nameKey="name" outerRadius={92} innerRadius={52} paddingAngle={4}>
          {statusDistribution.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
