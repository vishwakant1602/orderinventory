"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

// Mock data for the chart
const data = [
  {
    name: "Jan",
    orders: 45,
    inventory: 320,
  },
  {
    name: "Feb",
    orders: 52,
    inventory: 350,
  },
  {
    name: "Mar",
    orders: 61,
    inventory: 390,
  },
  {
    name: "Apr",
    orders: 67,
    inventory: 380,
  },
  {
    name: "May",
    orders: 85,
    inventory: 400,
  },
  {
    name: "Jun",
    orders: 93,
    inventory: 420,
  },
  {
    name: "Jul",
    orders: 101,
    inventory: 450,
  },
  {
    name: "Aug",
    orders: 110,
    inventory: 470,
  },
  {
    name: "Sep",
    orders: 115,
    inventory: 480,
  },
  {
    name: "Oct",
    orders: 127,
    inventory: 432,
  },
  {
    name: "Nov",
    orders: 0,
    inventory: 0,
  },
  {
    name: "Dec",
    orders: 0,
    inventory: 0,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="orders" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
        <Bar dataKey="inventory" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary/30" />
      </BarChart>
    </ResponsiveContainer>
  )
}
