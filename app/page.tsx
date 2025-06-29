'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Server, 
  Settings, 
  FileText, 
  AlertTriangle, 
  BarChart3, 
  Network, 
  Download,
  CheckCircle2,
  Clock,
  Zap,
  Shield,
  Globe,
  Database,
  Eye,
  Bell,
  Users,
  Cpu,
  HardDrive,
  Wifi,
  Router,
  Monitor,
  TrendingUp,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Search,
  Filter,
  Upload,
  FileCode,
  Layers,
  Target,
  MessageSquare,
  Calendar,
  PieChart,
  LineChart,
  BarChart,
  Gauge
} from 'lucide-react';
import { ComponentInstaller } from '@/components/monitoring/ComponentInstaller';
import { HostSelection } from '@/components/monitoring/HostSelection';
import { MIBManager } from '@/components/mib/MIBManager';
import { DeviceMonitoring } from '@/components/monitoring/DeviceMonitoring';
import { AlertManager } from '@/components/alerts/AlertManager';
import { ConfigGenerator } from '@/components/config/ConfigGenerator';
import { SystemManagement } from '@/components/system/SystemManagement';
import { RealTimeDashboard } from '@/components/dashboard/RealTimeDashboard';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [systemStats, setSystemStats] = useState({
    activeDevices: 24,
    installedComponents: 8,
    activeAlerts: 3,
    systemUptime: 99.8,
    cpuUsage: 32,
    memoryUsage: 58,
    diskUsage: 24,
    networkTraffic: 76
  });

  const quickActions = [
    { 
      title: '安装组件', 
      description: '部署监控组件',
      icon: Download,
      action: () => setActiveTab('installer'),
      color: 'bg-blue-600'
    },
    { 
      title: '上传MIB文件', 
      description: '管理MIB文件库',
      icon: Upload,
      action: () => setActiveTab('mib'),
      color: 'bg-green-600'
    },
    { 
      title: '添加设备', 
      description: '注册新网络设备',
      icon: Router,
      action: () => setActiveTab('monitoring'),
      color: 'bg-purple-600'
    },
    { 
      title: '创建告警', 
      description: '配置监控告警',
      icon: Bell,
      action: () => setActiveTab('alerts'),
      color: 'bg-orange-600'
    }
  ];

  const recentActivities = [
    { 
      action: 'Grafana部署成功在server-01', 
      timestamp: '2分钟前', 
      status: 'success',
      type: 'deployment'
    },
    { 
      action: 'Node Exporter配置已更新', 
      timestamp: '5分钟前', 
      status: 'info',
      type: 'config'
    },
    { 
      action: 'SNMP设备192.168.1.1已发现', 
      timestamp: '8分钟前', 
      status: 'success',
      type: 'discovery'
    },
    { 
      action: 'CPU阈值告警规则已创建', 
      timestamp: '12分钟前', 
      status: 'info',
      type: 'alert'
    },
    { 
      action: 'MIB文件cisco-switch.mib已上传', 
      timestamp: '15分钟前', 
      status: 'success',
      type: 'mib'
    },
    { 
      action: 'VictoriaMetrics集群已扩容', 
      timestamp: '20分钟前', 
      status: 'success',
      type: 'scaling'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deployment': return <Download className="h-3 w-3" />;
      case 'config': return <Settings className="h-3 w-3" />;
      case 'discovery': return <Search className="h-3 w-3" />;
      case 'alert': return <Bell className="h-3 w-3" />;
      case 'mib': return <FileText className="h-3 w-3" />;
      case 'scaling': return <TrendingUp className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Network className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SNMP Monitor Pro</h1>
                <p className="text-sm text-slate-400">企业级网络监控平台</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-400 border-green-400 animate-pulse">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                系统健康
              </Badge>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Globe className="h-4 w-4" />
                <span>24台设备在线</span>
              </div>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Settings className="h-4 w-4 mr-2" />
                设置
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700 p-1 grid grid-cols-8 w-full">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-blue-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              仪表板
            </TabsTrigger>
            <TabsTrigger value="installer" className="data-[state=active]:bg-blue-600">
              <Download className="h-4 w-4 mr-2" />
              组件安装
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-600">
              <Eye className="h-4 w-4 mr-2" />
              设备监控
            </TabsTrigger>
            <TabsTrigger value="mib" className="data-[state=active]:bg-blue-600">
              <FileText className="h-4 w-4 mr-2" />
              MIB管理
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600">
              <Bell className="h-4 w-4 mr-2" />
              告警管理
            </TabsTrigger>
            <TabsTrigger value="config" className="data-[state=active]:bg-blue-600">
              <Settings className="h-4 w-4 mr-2" />
              配置生成
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-blue-600">
              <Shield className="h-4 w-4 mr-2" />
              系统管理
            </TabsTrigger>
            <TabsTrigger value="realtime" className="data-[state=active]:bg-blue-600">
              <Activity className="h-4 w-4 mr-2" />
              实时监控
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">活跃设备</p>
                      <p className="text-3xl font-bold text-white">{systemStats.activeDevices}</p>
                      <p className="text-xs text-green-400 mt-1">比昨天+2</p>
                    </div>
                    <div className="p-3 bg-blue-600/20 rounded-lg">
                      <Server className="h-8 w-8 text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">已安装组件</p>
                      <p className="text-3xl font-bold text-white">{systemStats.installedComponents}</p>
                      <p className="text-xs text-green-400 mt-1">全部运行中</p>
                    </div>
                    <div className="p-3 bg-green-600/20 rounded-lg">
                      <Activity className="h-8 w-8 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">活跃告警</p>
                      <p className="text-3xl font-bold text-white">{systemStats.activeAlerts}</p>
                      <p className="text-xs text-yellow-400 mt-1">2个严重</p>
                    </div>
                    <div className="p-3 bg-yellow-600/20 rounded-lg">
                      <AlertTriangle className="h-8 w-8 text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">系统运行时间</p>
                      <p className="text-3xl font-bold text-white">{systemStats.systemUptime}%</p>
                      <p className="text-xs text-green-400 mt-1">30天</p>
                    </div>
                    <div className="p-3 bg-purple-600/20 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                      快速操作
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      常用任务和操作
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quickActions.map((action, index) => (
                        <div 
                          key={index}
                          onClick={action.action}
                          className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-all cursor-pointer group hover:bg-slate-700/30"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 ${action.color} rounded-lg group-hover:scale-110 transition-transform`}>
                              <action.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {action.title}
                              </h3>
                              <p className="text-sm text-slate-400">{action.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Resources */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Gauge className="h-5 w-5 mr-2 text-blue-400" />
                      系统资源
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 flex items-center">
                            <Cpu className="h-4 w-4 mr-1" />
                            CPU使用率
                          </span>
                          <span className="text-white font-semibold">{systemStats.cpuUsage}%</span>
                        </div>
                        <Progress value={systemStats.cpuUsage} className="h-3" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 flex items-center">
                            <Monitor className="h-4 w-4 mr-1" />
                            内存
                          </span>
                          <span className="text-white font-semibold">{systemStats.memoryUsage}%</span>
                        </div>
                        <Progress value={systemStats.memoryUsage} className="h-3" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 flex items-center">
                            <HardDrive className="h-4 w-4 mr-1" />
                            磁盘使用率
                          </span>
                          <span className="text-white font-semibold">{systemStats.diskUsage}%</span>
                        </div>
                        <Progress value={systemStats.diskUsage} className="h-3" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 flex items-center">
                            <Wifi className="h-4 w-4 mr-1" />
                            网络
                          </span>
                          <span className="text-white font-semibold">{systemStats.networkTraffic}%</span>
                        </div>
                        <Progress value={systemStats.networkTraffic} className="h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      最近活动
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
                        <div className={`p-1 rounded-full mt-1 ${
                          activity.status === 'success' ? 'bg-green-400' : 'bg-blue-400'
                        }`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-300 leading-relaxed">{activity.action}</p>
                          <p className="text-xs text-slate-500 mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Component Installer Tab */}
          <TabsContent value="installer">
            <ComponentInstaller />
          </TabsContent>

          {/* Device Monitoring Tab */}
          <TabsContent value="monitoring">
            <DeviceMonitoring />
          </TabsContent>

          {/* MIB Manager Tab */}
          <TabsContent value="mib">
            <MIBManager />
          </TabsContent>

          {/* Alert Manager Tab */}
          <TabsContent value="alerts">
            <AlertManager />
          </TabsContent>

          {/* Config Generator Tab */}
          <TabsContent value="config">
            <ConfigGenerator />
          </TabsContent>

          {/* System Management Tab */}
          <TabsContent value="system">
            <SystemManagement />
          </TabsContent>

          {/* Real-time Dashboard Tab */}
          <TabsContent value="realtime">
            <RealTimeDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}