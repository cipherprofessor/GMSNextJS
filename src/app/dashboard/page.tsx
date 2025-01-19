"use client"
import React from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';
import { Card, CardHeader, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import {
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Clock, Users, Calendar, Clock8 } from 'lucide-react';

interface EChartsOption {
  tooltip?: {
    trigger: string;
  };
  legend?: {
    orient: string;
    right: number;
    top: string;
  };
  series: any[];
}

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
}

const formatDuration = (hours: number) => {
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);
  
  if (days > 0) {
    return `${days}d ${remainingHours}h`;
  }
  return `${remainingHours}h`;
};

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

  const getVisitStatusDonutOptions = React.useMemo((): EChartsOption => {
    if (!metrics) return { series: [] };
    
    return {
      tooltip: {
        trigger: 'item'
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
          data: [
            { value: metrics.activePasses, name: 'Active' },
            { value: metrics.upcomingVisits, name: 'Upcoming' },
            { value: metrics.completedVisits, name: 'Completed' }
          ]
        }
      ]
    };
  }, [metrics]);

  const getDurationGaugeOptions = React.useMemo((): EChartsOption => {
    if (!metrics) return { series: [] };

    return {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: metrics.durationMetrics.max_duration || 24,
          splitNumber: 8,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.25, '#FF6E76'],
                [0.5, '#FDDD60'],
                [0.75, '#58D9F9'],
                [1, '#7CFFB2']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 5
            }
          },
          axisLabel: {
            color: '#464646',
            fontSize: 20,
            distance: -60,
            formatter: function (value: number) {
              return formatDuration(value);
            }
          },
          title: {
            offsetCenter: [0, '-20%'],
            fontSize: 20
          },
          detail: {
            fontSize: 30,
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            formatter: function (value: number) {
              return formatDuration(value);
            },
            color: 'auto'
          },
          data: [{
            value: metrics.durationMetrics.avg_duration || 0,
            name: 'Avg Duration'
          }]
        }
      ]
    };
  }, [metrics]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-[200px] bg-default-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 bg-gray-50">
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
                <LineChart data={metrics?.monthlyTrend ?? []}>
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

        {/* Visit Status Distribution */}
        <Card className="w-full transition-all duration-300 hover:shadow-lg">
          <CardHeader>Visit Status Distribution</CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ReactECharts 
                option={getVisitStatusDonutOptions} 
                style={{ height: '100%' }} 
                notMerge={true}
              />
            </div>
          </CardBody>
        </Card>

        {/* Duration Gauge */}
        <Card className="w-full transition-all duration-300 hover:shadow-lg">
          <CardHeader>Visit Duration Metrics</CardHeader>
          <CardBody>
            <div className="h-[300px]">
              <ReactECharts 
                option={getDurationGaugeOptions} 
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