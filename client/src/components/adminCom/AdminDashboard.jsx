import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Users, ShoppingBag, Download, CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useGetSalesReportDataMutation } from '@/services/api/admin/dashboardApi';
import { generatePDFReport,generateExcelReport } from '@/lib/reportGenerator';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AdminDashboard() {
  const [getSalesReportData, { data: reportData, isLoading }] = useGetSalesReportDataMutation();
  const [reportType, setReportType] = useState('pdf');
  const [dateOption, setDateOption] = useState('currentMonth');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const fetchReportData = () => {
    const params = { option: dateOption };
    if (dateOption === 'custom') {
      params.startDate = startDate.toISOString();
      params.endDate = endDate.toISOString();
    }
    console.log(params)
    getSalesReportData(params);
  };

  const handleDownloadReport = async () => {
    if (!reportData) return;

    let reportBuffer;
    let fileName;
    let mimeType;

    if (reportType === 'pdf') {
      reportBuffer = await generatePDFReport(reportData);
      fileName = 'sales_report.pdf';
      mimeType = 'application/pdf';
    } else {
      reportBuffer = await generateExcelReport(reportData);
      fileName = 'sales_report.xlsx';
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }

    const blob = new Blob([reportBuffer], { type: mimeType });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold mb-6">Sales Report</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Select value={dateOption} onValueChange={setDateOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="currentMonth">Current Month</SelectItem>
                  <SelectItem value="currentYear">Current Year</SelectItem>
                  <SelectItem value="currentDate">Current Date</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              {dateOption === 'custom' && (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(startDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(endDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </>
              )}
              <Button onClick={fetchReportData}>Generate Report</Button>
            </div>
          </CardContent>
        </Card>

        {reportData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${reportData.totalSales.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.totalCustomers}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.totalOrders}</div>
                </CardContent>
              </Card>
            </div>

            {/* Sales Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reportData.salesOverview}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="total" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Sales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportData.categorySales}
                          dataKey="total"
                          nameKey="_id"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label
                        >
                          {reportData.categorySales.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Latest Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={reportData.latestOrders}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="user.name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Latest Orders Table */}
            <Card>
              <CardHeader>
                <CardTitle>Latest Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left p-2">Order ID</th>
                        <th className="text-left p-2">Customer</th>
                        <th className="text-left p-2">Total</th>
                        <th className="text-left p-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.latestOrders.map((order) => (
                        <tr key={order._id}>
                          <td className="p-2">{order._id}</td>
                          <td className="p-2">{order.user.name}</td>
                          <td className="p-2">${order.total.toFixed(2)}</td>
                          <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Download Report */}
            <Card>
              <CardHeader>
                <CardTitle>Download Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleDownloadReport}>
                    <Download className="mr-2 h-4 w-4" /> Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}