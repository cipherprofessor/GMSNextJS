"use client"
import React from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@nextui-org/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Clock, Users, Calendar, Clock8, AlertCircle } from 'lucide-react';

interface DurationMetrics {
  avg_duration: number;
  max_duration: number;
  min_duration: number;
}

interface VisitReason {
  reason: string;
  count: number;
}

interface MonthlyTrend {
  month: string;
  visit_count: number;
}

interface DashboardMetrics {
  activePasses: number;
  todayVisitors: number;
  upcomingVisits: number;
  completedVisits: number;
  weeklyVisits: number;
  monthlyVisits: number;
  durationMetrics: DurationMetrics;
  visitsByReason: VisitReason[];
  monthlyTrend: MonthlyTrend[];
  weeklyDistribution: number[];
}

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const CHART_COLORS = {
  primary: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  purple: '#8884d8',
  blue: '#0ea5e9',
};

const formatDuration = (hours: number) => {
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  
  if (days > 0) {
    return `${days}d ${remainingHours}h`;
  }
  return `${remainingHours}h`;
};

const getVisitStatusDonutOptions = (metrics: DashboardMetrics | null): any => {
  if (!metrics) return { series: [] };
  
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        name: 'Visit Status',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        color: [CHART_COLORS.primary, CHART_COLORS.warning, CHART_COLORS.success],
        data: [
          { value: metrics.activePasses, name: 'Active' },
          { value: metrics.upcomingVisits, name: 'Upcoming' },
          { value: metrics.completedVisits, name: 'Completed' }
        ]
      }
    ]
  };
};

export default function Dashboard() {
  const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchMetrics = React.useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get('/api/dashboard-metrics');
      setMetrics(response.data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchMetrics]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[200px] bg-default-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[50vh] flex flex-col items-center justify-center gap-4 p-4">
        <AlertCircle className="w-12 h-12 text-danger" />
        <p className="text-lg text-danger">{error}</p>
        <button 
          onClick={fetchMetrics}
          className="px-4 py-2 bg-primary rounded-lg text-white hover:bg-primary-500 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-default-900">Dashboard</h1>
        <p className="text-default-500">Last updated: {new Date().toLocaleTimeString()}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 rounded-full">
              <Users className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <p className="text-sm text-default-500">Active Passes</p>
              <h3 className="text-2xl font-bold">{metrics?.activePasses ?? 0}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-success-100 rounded-full">
              <Calendar className="w-6 h-6 text-success-500" />
            </div>
            <div>
              <p className="text-sm text-default-500">This Week's Visits</p>
              <h3 className="text-2xl font-bold">{metrics?.weeklyVisits ?? 0}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-warning-100 rounded-full">
              <Calendar className="w-6 h-6 text-warning-500" />
            </div>
            <div>
              <p className="text-sm text-default-500">This Month's Visits</p>
              <h3 className="text-2xl font-bold">{metrics?.monthlyVisits ?? 0}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-secondary-100 rounded-full">
              <Clock8 className="w-6 h-6 text-secondary-500" />
            </div>
            <div>
              <p className="text-sm text-default-500">Avg Duration</p>
              <h3 className="text-2xl font-bold">
                {formatDuration(metrics?.durationMetrics.avg_duration ?? 0)}
              </h3>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card className="w-full transition-all duration-300 hover:shadow-lg">
          <CardHeader>Monthly Visit Trends</CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.monthlyTrend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('default', { month: 'short' })}
                  />
                  <YAxis />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border">
                            <p className="font-bold text-default-700">
                              {new Date(label).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                            </p>
                            <p className="text-primary-500">
                              Total Visits: {payload[0].value}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="visit_count" 
                    fill={CHART_COLORS.primary}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Visit Status Distribution */}
        <Card className="w-full transition-all duration-300 hover:shadow-lg">
          <CardHeader>Visit Status Distribution</CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ReactECharts 
                option={getVisitStatusDonutOptions(metrics)}
                style={{ height: '100%' }} 
                notMerge={true}
              />
            </div>
          </CardBody>
        </Card>

        {/* Weekly Visit Distribution */}
        <Card className="w-full transition-all duration-300 hover:shadow-lg">
          <CardHeader>Weekly Visit Distribution</CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ReactECharts 
                option={{
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'shadow'
                    }
                  },
                  grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                  },
                  xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisTick: {
                      alignWithLabel: true
                    }
                  },
                  yAxis: {
                    type: 'value'
                  },
                  series: [
                    {
                      name: 'Visits',
                      type: 'bar',
                      barWidth: '60%',
                      data: metrics?.weeklyDistribution ?? [],
                      itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          { offset: 0, color: CHART_COLORS.blue },
                          { offset: 1, color: CHART_COLORS.primary }
                        ])
                      }
                    }
                  ]
                }}
                style={{ height: '100%' }} 
                notMerge={true}
              />
            </div>
          </CardBody>
        </Card>

        {/* Top Visit Reasons Table */}
        <Card className="w-full transition-all duration-300 hover:shadow-lg">
          <CardHeader>Top Visit Reasons</CardHeader>
          <CardBody>
            <Table aria-label="Visit reasons table">
              <TableHeader>
                <TableColumn>REASON</TableColumn>
                <TableColumn>COUNT</TableColumn>
                <TableColumn>PERCENTAGE</TableColumn>
              </TableHeader>
              <TableBody>
                {metrics ? metrics.visitsByReason.map((item: VisitReason, index: number) => {
                  const total = metrics.visitsByReason.reduce((acc: number, curr: VisitReason) => acc + curr.count, 0);
                  return (
                    <TableRow key={index}>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell>
                        {((item.count / total) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell>No data available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}