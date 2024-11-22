import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Users, ShoppingBag, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

// Simplified data structure
const salesData = [
  { date: "01 Jan", value: 25000 },
  { date: "02 Jan", value: 35000 },
  { date: "03 Jan", value: 28000 },
  { date: "04 Jan", value: 40000 },
  { date: "05 Jan", value: 32000 },
  { date: "06 Jan", value: 45000 },
  { date: "07 Jan", value: 38000 },
]

const analyticsData = [
  { date: "01 Jan", value: 20 },
  { date: "02 Jan", value: 40 },
  { date: "03 Jan", value: 30 },
  { date: "04 Jan", value: 50 },
  { date: "05 Jan", value: 35 },
  { date: "06 Jan", value: 45 },
  { date: "07 Jan", value: 40 },
]

const visitedCustomersData = [
  { name: "Direct", value: 70, color: "#4169E1" },
  { name: "Affiliate", value: 20, color: "#9400D3" },
  { name: "Referral", value: 10, color: "#32CD32" },
]

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#1a1b1e] text-white p-6">
      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#2a2b2e] border-none text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Today Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$25,222.00</div>
              <p className="text-xs text-green-500 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" /> +35%
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#2a2b2e] border-none text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Today Expenses</CardTitle>
              <ShoppingBag className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,255.00</div>
              <p className="text-xs text-red-500 flex items-center">
                <ArrowDownRight className="h-4 w-4 mr-1" /> -21%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2b2e] border-none text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Today Visitors</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6,268</div>
              <p className="text-xs text-green-500 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" /> +15%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#2a2b2e] border-none text-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Today Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">625</div>
              <p className="text-xs text-green-500 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1" /> +25%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart */}
        <Card className="bg-[#2a2b2e] border-none text-white">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4169E1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4169E1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#2a2b2e',
                      border: '1px solid #333',
                      borderRadius: '4px',
                      color: 'white'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#4169E1"
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Analytics Chart */}
          <Card className="bg-[#2a2b2e] border-none text-white">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#2a2b2e',
                        border: '1px solid #333',
                        borderRadius: '4px',
                        color: 'white'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4169E1"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Visited Customers */}
          <Card className="bg-[#2a2b2e] border-none text-white">
            <CardHeader>
              <CardTitle>Visited Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={visitedCustomersData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {visitedCustomersData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#2a2b2e',
                        border: '1px solid #333',
                        borderRadius: '4px',
                        color: 'white'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm text-gray-400">Total Visits</div>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4 bg-[#333] hover:bg-[#444] text-white">
                <Download className="w-4 h-4 mr-2" /> Download Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}