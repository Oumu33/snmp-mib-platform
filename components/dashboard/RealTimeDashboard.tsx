'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Wifi, 
  Server, 
  Database, 
  Monitor,
  Cpu,
  HardDrive,
  Network,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  LineChart,
  PieChart,
  Gauge,
  RefreshCw,
  Maximize2,
  Settings,
  Filter,
  Calendar,
  Download
} from 'lucide-react';

interface MetricData {
  timestamp: string;
  value: number;
}

interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'normal' | 'warning' | 'critical';
  history: MetricData[];
}

interface NetworkInterface {
  name: string;
  status: 'up' | 'down';
  speed: string;
  rxBytes: number;
  txBytes: number;
  utilization: number;
}

interface AlertEvent {
  id: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
  message: string;
  status: 'active' | 'resolved';
}

export function RealTimeDashboard() {
  const [refreshInterval, setRefreshInterval] = useState(5);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    if (!isAutoRefresh) return;
    
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Here you would fetch real data from your API
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval, isAutoRefresh]);

  const realTimeMetrics: RealTimeMetric[] = [
    {
      id: '1',
      name: 'CPU Usage',
      value: 67,
      unit: '%',
      trend: 'up',
      change: 5.2,
      status: 'warning',
      history: Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - (19 - i) * 30000).toISOString(),
        value: Math.random() * 100
      }))
    },
    {
      id: '2',
      name: 'Memory Usage',
      value: 45,
      unit: '%',
      trend: 'stable',
      change: 0.1,
      status: 'normal',
      history: Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - (19 - i) * 30000).toISOString(),
        value: Math.random() * 100
      }))
    },
    {
      id: '3',
      name: 'Network Traffic',
      value: 234,
      unit: 'Mbps',
      trend: 'down',
      change: -12.5,
      status: 'normal',
      history: Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - (19 - i) * 30000).toISOString(),
        value: Math.random() * 500
      }))
    },
    {
      id: '4',
      name: 'Disk I/O',
      value: 89,
      unit: 'MB/s',
      trend: 'up',
      change: 23.1,
      status: 'critical',
      history: Array.from({ length: 20 }, (_, i) => ({
        timestamp: new Date(Date.now() - (19 - i) * 30000).toISOString(),
        value: Math.random() * 200
      }))
    }
  ];

  const networkInterfaces: NetworkInterface[] = [
    {
      name: 'eth0',
      status: 'up',
      speed: '1 Gbps',
      rxBytes: 1234567890,
      txBytes: 987654321,
      utilization: 67
    },
    {
      name: 'eth1',
      status: 'up',
      speed: '1 Gbps',
      rxBytes: 2345678901,
      txBytes: 1876543210,
      utilization: 34
    },
    {
      name: 'eth2',
      status: 'down',
      speed: '100 Mbps',
      rxBytes: 0,
      txBytes: 0,
      utilization: 0
    }
  ];

  const recentAlerts: AlertEvent[] = [
    {
      id: '1',
      timestamp: '2024-01-15 14:35:00',
      severity: 'critical',
      source: 'DB-Server-01',
      message: 'CPU usage exceeded 80% threshold',
      status: 'active'
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:32:00',
      severity: 'warning',
      source: 'Core-Router-01',
      message: 'High network utilization detected',
      status: 'active'
    },
    {
      id: '3',
      timestamp: '2024-01-15 14:28:00',
      severity: 'info',
      source: 'Access-Switch-01',
      message: 'Interface eth0 link state changed to up',
      status: 'resolved'
    }
  ];

  const getTrendIcon = (trend: RealTimeMetric['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-400" />;
      default: return <Activity className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: RealTimeMetric['status']) => {
    switch (status) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getAlertIcon = (severity: AlertEvent['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default: return <CheckCircle2 className="h-4 w-4 text-blue-400" />;
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Real-Time Monitoring Dashboard
              </CardTitle>
              <CardDescription className="text-slate-400">
                Live system metrics and performance monitoring
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-400">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="bg-slate-700 border border-slate-600 text-white rounded-md px-2 py-1 text-sm"
                >
                  <option value={1}>1s</option>
                  <option value={5}>5s</option>
                  <option value={10}>10s</option>
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                  className={`border-slate-600 ${isAutoRefresh ? 'text-green-400' : 'text-slate-400'}`}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isAutoRefresh ? 'animate-spin' : ''}`} />
                  {isAutoRefresh ? 'Auto' : 'Manual'}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Real-Time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {realTimeMetrics.map((metric) => (
          <Card key={metric.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Gauge className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-slate-400">{metric.name}</span>
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-baseline space-x-2">
                  <span className={`text-3xl font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value}
                  </span>
                  <span className="text-sm text-slate-400">{metric.unit}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-xs ${
                    metric.trend === 'up' ? 'text-red-400' : 
                    metric.trend === 'down' ? 'text-green-400' : 'text-blue-400'
                  }`}>
                    {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-xs text-slate-500">vs last period</span>
                </div>
                
                {metric.unit === '%' && (
                  <Progress value={metric.value} className="h-2 mt-2" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Interfaces */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Network className="h-5 w-5 mr-2" />
              Network Interfaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {networkInterfaces.map((iface, index) => (
                <div key={index} className="p-4 border border-slate-600 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        iface.status === 'up' ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <div>
                        <h3 className="font-semibold text-white">{iface.name}</h3>
                        <p className="text-sm text-slate-400">{iface.speed}</p>
                      </div>
                    </div>
                    <Badge className={`${
                      iface.status === 'up' ? 'bg-green-600' : 'bg-red-600'
                    } text-white`}>
                      {iface.status}
                    </Badge>
                  </div>
                  
                  {iface.status === 'up' && (
                    <>
                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-slate-500">RX Bytes</p>
                          <p className="text-white">{formatBytes(iface.rxBytes)}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">TX Bytes</p>
                          <p className="text-white">{formatBytes(iface.txBytes)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Utilization</span>
                          <span className="text-white">{iface.utilization}%</span>
                        </div>
                        <Progress value={iface.utilization} className="h-2" />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getAlertIcon(alert.severity)}
                      <Badge className={`${
                        alert.severity === 'critical' ? 'bg-red-600' :
                        alert.severity === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
                      } text-white text-xs`}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-500">{alert.timestamp}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{alert.source}</p>
                    <p className="text-sm text-slate-300">{alert.message}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <Badge variant="outline" className={`text-xs ${
                      alert.status === 'active' ? 'border-red-500 text-red-400' : 'border-green-500 text-green-400'
                    }`}>
                      {alert.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Server className="h-5 w-5 mr-2" />
              System Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 flex items-center">
                  <Cpu className="h-4 w-4 mr-1" />
                  CPU Usage
                </span>
                <span className="text-white font-semibold">67%</span>
              </div>
              <Progress value={67} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 flex items-center">
                  <Monitor className="h-4 w-4 mr-1" />
                  Memory
                </span>
                <span className="text-white font-semibold">45%</span>
              </div>
              <Progress value={45} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 flex items-center">
                  <HardDrive className="h-4 w-4 mr-1" />
                  Disk Usage
                </span>
                <span className="text-white font-semibold">78%</span>
              </div>
              <Progress value={78} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 flex items-center">
                  <Wifi className="h-4 w-4 mr-1" />
                  Network
                </span>
                <span className="text-white font-semibold">234 Mbps</span>
              </div>
              <Progress value={47} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Storage Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <p className="text-2xl font-bold text-blue-400">2.4TB</p>
                <p className="text-xs text-slate-400">Total Space</p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <p className="text-2xl font-bold text-green-400">1.8TB</p>
                <p className="text-xs text-slate-400">Available</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">System</span>
                <span className="text-white">120 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Logs</span>
                <span className="text-white">45 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Backups</span>
                <span className="text-white">380 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Other</span>
                <span className="text-white">55 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <p className="text-2xl font-bold text-green-400">99.8%</p>
                <p className="text-xs text-slate-400">Uptime</p>
              </div>
              <div className="p-3 bg-slate-700/50 rounded-lg">
                <p className="text-2xl font-bold text-blue-400">24</p>
                <p className="text-xs text-slate-400">Active Devices</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Avg Response Time</span>
                <span className="text-green-400">12ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Error Rate</span>
                <span className="text-green-400">0.02%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Throughput</span>
                <span className="text-blue-400">1.2K req/s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Active Alerts</span>
                <span className="text-yellow-400">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}