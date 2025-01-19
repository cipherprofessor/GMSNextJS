"use client"
import React from 'react';
import axios from 'axios';
import { Card, CardHeader, CardBody } from "@heroui/react";
import {
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart, Pie,
  Cell
} from 'recharts';
import { Clock, Users, Calendar, Clock8 } from 'lucide-react';

interface DashboardMetrics {
  activePasses: number;
  todayVisitors: number;
  upcomingVisits: number;
  durationMetrics: {
    avg_duration: number;
    max_duration: number;
    min_duration: number;
  };
  visitsByReason: Array<{
    reason: string;
    count: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    visit_count: number;
  }>;
  hourlyDistribution: Array<{
    hour: number;
    visit_count: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard() {
  const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/api/dashboard-metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[200px] bg-default-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!metrics) {
    return <div>Error loading dashboard data</div>;
  }

  return (
    <div className="w-full min-h-screen p-4 bg-gray-50">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 rounded-full">
              <Users className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-default-500">Active Passes</p>
              <h3 className="text-2xl font-bold">{metrics.activePasses}</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-success-100 rounded-full">
              <Calendar className="w-6 h-6 text-success-500" />
            </div>
            <div>
              <p className="text-sm text-default-500">Today's Visitors</p>
              <h3 className="text-2xl font-bold">{metrics.todayVisitors}</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-warning-100 rounded-full">
              <Clock className="w-6 h-6 text-warning-500" />
            </div>
            <div>
              <p className="text-sm text-default-500">Upcoming Visits</p>
              <h3 className="text-2xl font-bold">{metrics.upcomingVisits}</h3>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-secondary-100 rounded-full">
              <Clock8 className="w-6 h-6 text-secondary-500" />
            </div>
            <div>
              <p className="text-sm text-default-500">Avg Duration (hrs)</p>
              <h3 className="text-2xl font-bold">
                {(metrics.durationMetrics.avg_duration || 0).toFixed(1)}
              </h3>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card className="w-full">
          <CardHeader>Monthly Visit Trends</CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('default', { month: 'short' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                  />
                  <Line type="monotone" dataKey="visit_count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Hourly Distribution */}
        <Card className="w-full">
          <CardHeader>Visit Time Distribution</CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.hourlyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(hour) => `${hour}:00 - ${hour+1}:00`}
                  />
                  <Bar dataKey="visit_count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Reasons Distribution */}
        <Card className="w-full">
          <CardHeader>Top Visit Reasons</CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.visitsByReason}
                    dataKey="count"
                    nameKey="reason"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {metrics.visitsByReason.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Duration Stats */}
        <Card className="w-full">
          <CardHeader>Visit Duration Statistics</CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-default-500">Average Duration</span>
                <span className="font-bold">
                  {(metrics.durationMetrics.avg_duration || 0).toFixed(1)} hours
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-default-500">Maximum Duration</span>
                <span className="font-bold">
                  {(metrics.durationMetrics.max_duration || 0).toFixed(1)} hours
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-default-500">Minimum Duration</span>
                <span className="font-bold">
                  {(metrics.durationMetrics.min_duration || 0).toFixed(1)} hours
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}