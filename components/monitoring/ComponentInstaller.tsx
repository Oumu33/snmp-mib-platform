'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Download, 
  Server, 
  Database, 
  BarChart3, 
  Bell, 
  Activity, 
  Search, 
  Filter, 
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Play,
  Pause,
  Settings,
  Eye,
  Trash2,
  Package,
  Zap,
  Monitor,
  Shield,
  Globe,
  Target,
  Cpu,
  HardDrive,
  Network,
  Layers,
  GitBranch,
  ExternalLink,
  Info,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Check
} from 'lucide-react';

interface Component {
  id: string;
  name: string;
  type: 'collector' | 'storage' | 'visualization' | 'alerting';
  description: string;
  version: string;
  latestVersion: string;
  downloadUrl: string;
  configPath: string;
  serviceName: string;
  port: number;
  status: 'available' | 'installing' | 'installed' | 'failed' | 'updating';
  hostId?: string;
  hostName?: string;
  architecture: string[];
  dependencies: string[];
  features: string[];
  installProgress?: number;
  installLog?: string[];
  lastInstalled?: string;
  uptime?: string;
  memoryUsage?: number;
  cpuUsage?: number;
  isCluster?: boolean;
  clusterComponents?: string[];
}

interface Host {
  id: string;
  name: string;
  ip: string;
  status: 'connected' | 'disconnected' | 'connecting';
  os: string;
  architecture: string;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

interface InstallationJob {
  id: string;
  componentId: string;
  componentName: string;
  hostId: string;
  hostName: string;
  status: 'pending' | 'installing' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  endTime?: string;
  logs: string[];
  error?: string;
}

export default function ComponentInstaller() {
  const [selectedHost, setSelectedHost] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [components, setComponents] = useState<Component[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [installations, setInstallations] = useState<InstallationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [installationSettings, setInstallationSettings] = useState({
    autoStart: true,
    enableMetrics: true,
    customConfig: false,
    configContent: ''
  });

  // Fetch data from backend APIs
  useEffect(() => {
    fetchComponents();
    fetchHosts();
    fetchInstallations();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/v1/components');
      
      if (!response.ok) {
        throw new Error('Failed to fetch components');
      }
      
      const data = await response.json();
      setComponents(data || []);
    } catch (err) {
      console.error('Error fetching components:', err);
      setError('Unable to fetch component data. Please check network connection.');
      // 使用模拟数据作为后备
      setComponents(mockComponents);
    } finally {
      setLoading(false);
    }
  };

  const fetchHosts = async () => {
    try {
      const response = await fetch('/api/v1/hosts');
      if (response.ok) {
        const data = await response.json();
        setHosts(data || []);
      } else {
        setHosts(mockHosts);
      }
    } catch (err) {
      console.error('Error fetching hosts:', err);
      setHosts(mockHosts);
    }
  };

  const fetchInstallations = async () => {
    try {
      const response = await fetch('/api/v1/installations');
      if (response.ok) {
        const data = await response.json();
        setInstallations(data || []);
      }
    } catch (err) {
      console.error('Error fetching installations:', err);
    }
  };

  // 模拟数据
  const mockComponents: Component[] = [
    {
      id: 'node-exporter',
      name: 'Node Exporter',
      type: 'collector',
      description: 'Prometheus exporter for hardware and OS metrics exposed by *NIX kernels',
      version: '1.8.2',
      latestVersion: '1.8.2',
      downloadUrl: 'https://github.com/prometheus/node_exporter/releases/download/v1.8.2/node_exporter-1.8.2.linux-amd64.tar.gz',
      configPath: '/etc/node_exporter/node_exporter.yml',
      serviceName: 'node_exporter',
      port: 9100,
      status: 'available',
      architecture: ['x86_64', 'arm64', 'armv7'],
      dependencies: [],
      features: ['System Metrics', 'Hardware Monitoring', 'Process Statistics', 'Filesystem Metrics'],
      isCluster: false
    },
    {
      id: 'categraf',
      name: 'Categraf',
      type: 'collector',
      description: 'One-stop telemetry collector for metrics, logs and traces',
      version: '0.3.60',
      latestVersion: '0.3.60',
      downloadUrl: 'https://github.com/flashcatcloud/categraf/releases/download/v0.3.60/categraf-v0.3.60-linux-amd64.tar.gz',
      configPath: '/etc/categraf/conf/config.toml',
      serviceName: 'categraf',
      port: 9100,
      status: 'available',
      architecture: ['x86_64', 'arm64'],
      dependencies: [],
      features: ['Multi-protocol Support', 'SNMP Collection', 'Log Collection', 'Trace Collection'],
      isCluster: false
    },
    {
      id: 'snmp-exporter',
      name: 'SNMP Exporter',
      type: 'collector',
      description: 'Prometheus exporter for SNMP-enabled devices',
      version: '0.25.0',
      latestVersion: '0.25.0',
      downloadUrl: 'https://github.com/prometheus/snmp_exporter/releases/download/v0.25.0/snmp_exporter-0.25.0.linux-amd64.tar.gz',
      configPath: '/etc/snmp_exporter/snmp.yml',
      serviceName: 'snmp_exporter',
      port: 9116,
      status: 'available',
      architecture: ['x86_64', 'arm64'],
      dependencies: [],
      features: ['SNMP v1/v2c/v3', 'MIB Support', 'Custom Modules', 'Multi-target'],
      isCluster: false
    },
    {
      id: 'victoriametrics-single',
      name: 'VictoriaMetrics Single',
      type: 'storage',
      description: 'Fast, cost-effective monitoring solution and time series database',
      version: '1.97.1',
      latestVersion: '1.97.1',
      downloadUrl: 'https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.97.1/victoria-metrics-linux-amd64-v1.97.1.tar.gz',
      configPath: '/etc/victoriametrics/victoria-metrics.yml',
      serviceName: 'victoriametrics',
      port: 8428,
      status: 'available',
      architecture: ['x86_64', 'arm64'],
      dependencies: [],
      features: ['High Performance', 'Low Resource Usage', 'PromQL Support', 'Data Compression'],
      isCluster: false
    },
    {
      id: 'victoriametrics-cluster',
      name: 'VictoriaMetrics Cluster',
      type: 'storage',
      description: 'Horizontally scalable VictoriaMetrics cluster setup',
      version: '1.97.1',
      latestVersion: '1.97.1',
      downloadUrl: 'https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.97.1/victoria-metrics-linux-amd64-v1.97.1.tar.gz',
      configPath: '/etc/victoriametrics-cluster/',
      serviceName: 'victoriametrics-cluster',
      port: 8480,
      status: 'available',
      architecture: ['x86_64', 'arm64'],
      dependencies: [],
      features: ['Horizontal Scaling', 'High Availability', 'Load Balancing', 'Data Replication'],
      isCluster: true,
      clusterComponents: ['VMStorage', 'VMInsert', 'VMSelect']
    },
    {
      id: 'grafana',
      name: 'Grafana',
      type: 'visualization',
      description: 'Open source analytics and interactive visualization web application',
      version: '11.3.0',
      latestVersion: '11.3.0',
      downloadUrl: 'https://dl.grafana.com/enterprise/release/grafana-enterprise-11.3.0.linux-amd64.tar.gz',
      configPath: '/etc/grafana/grafana.ini',
      serviceName: 'grafana-server',
      port: 3000,
      status: 'available',
      architecture: ['x86_64', 'arm64'],
      dependencies: [],
      features: ['Rich Dashboards', 'Alerting', 'Plugin System', 'Multi-datasource'],
      isCluster: false
    },
    {
      id: 'vmalert',
      name: 'VMAlert',
      type: 'alerting',
      description: 'VictoriaMetrics alerting component',
      version: '1.97.1',
      latestVersion: '1.97.1',
      downloadUrl: 'https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.97.1/vmutils-linux-amd64-v1.97.1.tar.gz',
      configPath: '/etc/vmalert/alerts.yml',
      serviceName: 'vmalert',
      port: 8880,
      status: 'available',
      architecture: ['x86_64', 'arm64'],
      dependencies: ['victoriametrics-single'],
      features: ['PromQL Alerts', 'Recording Rules', 'Webhook Notifications', 'High Performance'],
      isCluster: false
    },
    {
      id: 'alertmanager',
      name: 'Alertmanager',
      type: 'alerting',
      description: 'Prometheus Alertmanager handles alerts sent by client applications',
      version: '0.27.0',
      latestVersion: '0.27.0',
      downloadUrl: 'https://github.com/prometheus/alertmanager/releases/download/v0.27.0/alertmanager-0.27.0.linux-amd64.tar.gz',
      configPath: '/etc/alertmanager/alertmanager.yml',
      serviceName: 'alertmanager',
      port: 9093,
      status: 'available',
      architecture: ['x86_64', 'arm64'],
      dependencies: [],
      features: ['Alert Routing', 'Silencing', 'Inhibition', 'High Availability'],
      isCluster: false
    }
  ];

  const mockHosts: Host[] = [
    {
      id: '1',
      name: 'monitoring-server-01',
      ip: '192.168.1.10',
      status: 'connected',
      os: 'Ubuntu 22.04',
      architecture: 'x86_64',
      resources: { cpu: 25, memory: 45, disk: 67 }
    },
    {
      id: '2',
      name: 'monitoring-server-02',
      ip: '192.168.1.11',
      status: 'connected',
      os: 'CentOS 8',
      architecture: 'x86_64',
      resources: { cpu: 15, memory: 32, disk: 45 }
    },
    {
      id: '3',
      name: 'edge-device-01',
      ip: '192.168.1.20',
      status: 'connected',
      os: 'Ubuntu 20.04',
      architecture: 'arm64',
      resources: { cpu: 35, memory: 78, disk: 23 }
    }
  ];

  const getTypeIcon = (type: Component['type']) => {
    switch (type) {
      case 'collector': return <Database className="h-5 w-5 text-blue-400" />;
      case 'storage': return <Server className="h-5 w-5 text-green-400" />;
      case 'visualization': return <BarChart3 className="h-5 w-5 text-purple-400" />;
      case 'alerting': return <Bell className="h-5 w-5 text-orange-400" />;
      default: return <Package className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: Component['status']) => {
    switch (status) {
      case 'installed': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'installing': return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'updating': return <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />;
      default: return <Download className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: Component['status']) => {
    switch (status) {
      case 'installed': return 'border-green-500 bg-green-500/10';
      case 'installing': return 'border-blue-500 bg-blue-500/10';
      case 'failed': return 'border-red-500 bg-red-500/10';
      case 'updating': return 'border-yellow-500 bg-yellow-500/10';
      default: return 'border-slate-600 hover:border-blue-500';
    }
  };

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || component.type === selectedType;
    return matchesSearch && matchesType;
  });

  const connectedHosts = hosts.filter(h => h.status === 'connected');
  const installedComponents = components.filter(c => c.status === 'installed').length;
  const runningInstallations = installations.filter(i => i.status === 'installing').length;

  // 直接安装组件
  const installComponent = async (component: Component, hostId: string) => {
    if (!hostId) {
      setError('Please select a host first');
      return;
    }

    try {
      // 更新组件状态为安装中
      setComponents(prev => prev.map(c => 
        c.id === component.id 
          ? { ...c, status: 'installing', installProgress: 0, hostId, hostName: hosts.find(h => h.id === hostId)?.name }
          : c
      ));

      const response = await fetch('/api/v1/components/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          component_id: component.id,
          host_id: hostId,
          version: component.version,
          auto_start: installationSettings.autoStart,
          enable_metrics: installationSettings.enableMetrics,
          custom_config: installationSettings.customConfig ? installationSettings.configContent : null
        })
      });

      if (response.ok) {
        // 模拟安装进度
        simulateInstallation(component.id);
      } else {
        const error = await response.json();
        setComponents(prev => prev.map(c => 
          c.id === component.id 
            ? { ...c, status: 'failed', installProgress: 0 }
            : c
        ));
        setError(error.message || 'Installation failed');
      }
    } catch (err) {
      console.error('Error installing component:', err);
      setComponents(prev => prev.map(c => 
        c.id === component.id 
          ? { ...c, status: 'failed', installProgress: 0 }
          : c
      ));
      setError('Error occurred during installation');
    }
  };

  // 模拟安装进度
  const simulateInstallation = (componentId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setComponents(prev => prev.map(c => 
          c.id === componentId 
            ? { 
                ...c, 
                status: 'installed', 
                installProgress: 100,
                lastInstalled: new Date().toISOString(),
                uptime: '0 minutes',
                memoryUsage: Math.floor(Math.random() * 50) + 10,
                cpuUsage: Math.floor(Math.random() * 30) + 5
              }
            : c
        ));
      } else {
        setComponents(prev => prev.map(c => 
          c.id === componentId 
            ? { ...c, installProgress: Math.floor(progress) }
            : c
        ));
      }
    }, 500);
  };

  // 卸载组件
  const uninstallComponent = async (componentId: string) => {
    setComponents(prev => prev.map(c => 
      c.id === componentId 
        ? { ...c, status: 'available', hostId: undefined, hostName: undefined, installProgress: 0 }
        : c
    ));
  };

  // 启动/停止组件
  const toggleComponent = async (componentId: string, action: 'start' | 'stop') => {
    try {
      const response = await fetch(`/api/v1/components/${action}/${componentId}`, {
        method: 'POST'
      });

      if (response.ok) {
        // 更新组件状态
        console.log(`Component ${componentId} ${action}ed successfully`);
      }
    } catch (err) {
      console.error(`Error ${action}ing component:`, err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Connected Hosts</p>
                <p className="text-2xl font-bold text-green-400">{connectedHosts.length}</p>
              </div>
              <Server className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Available Components</p>
                <p className="text-2xl font-bold text-blue-400">{components.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Installed</p>
                <p className="text-2xl font-bold text-purple-400">{installedComponents}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Installing</p>
                <p className="text-2xl font-bold text-orange-400">{runningInstallations}</p>
              </div>
              <Loader2 className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert className="border-red-500 bg-red-500/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-400">
            {error}
            <Button 
              size="sm" 
              variant="outline" 
              className="ml-2 border-red-500 text-red-400"
              onClick={() => setError(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="components" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="components">
            <Package className="h-4 w-4 mr-2" />
            Component Library
          </TabsTrigger>
          <TabsTrigger value="installed">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Installed Components
          </TabsTrigger>
          <TabsTrigger value="installations">
            <Activity className="h-4 w-4 mr-2" />
            Installation Jobs
          </TabsTrigger>
        </TabsList>

        {/* Component Library Tab */}
        <TabsContent value="components" className="space-y-6">
          {/* Host Selection & Filters */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Component Installation</CardTitle>
              <CardDescription className="text-slate-400">
                Select a target host and install monitoring components directly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-slate-300">Target Host</Label>
                  <select
                    value={selectedHost}
                    onChange={(e) => setSelectedHost(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="">Select a host...</option>
                    {connectedHosts.map(host => (
                      <option key={host.id} value={host.id}>
                        {host.name} ({host.ip}) - {host.os}
                      </option>
                    ))}
                  </select>
                  {selectedHost && (
                    <p className="text-xs text-slate-500 mt-1">
                      Selected: {hosts.find(h => h.id === selectedHost)?.name}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="text-slate-300">Component Type</Label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="all">All Types</option>
                    <option value="collector">Data Collectors</option>
                    <option value="storage">Storage Systems</option>
                    <option value="visualization">Visualization</option>
                    <option value="alerting">Alerting</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-slate-300">Search Components</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
              </div>
              
              {!selectedHost && (
                <Alert className="border-yellow-500 bg-yellow-500/10">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-yellow-400">
                    Please select a target host to enable component installation.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Component Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400 mr-3" />
              <span className="text-slate-400">Loading components...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredComponents.map((component) => (
                <Card 
                  key={component.id} 
                  className={`border transition-all hover:shadow-lg ${getStatusColor(component.status)}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(component.type)}
                        <div>
                          <h3 className="font-semibold text-white text-lg">{component.name}</h3>
                          <p className="text-sm text-slate-400">v{component.version}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(component.status)}
                        <Badge className={`text-xs ${
                          component.type === 'collector' ? 'bg-blue-600' :
                          component.type === 'storage' ? 'bg-green-600' :
                          component.type === 'visualization' ? 'bg-purple-600' : 'bg-orange-600'
                        } text-white`}>
                          {component.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-4 line-clamp-2">{component.description}</p>
                    
                    {/* Installation Progress */}
                    {component.status === 'installing' && component.installProgress !== undefined && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Installing...</span>
                          <span className="text-white">{component.installProgress}%</span>
                        </div>
                        <Progress value={component.installProgress} className="h-2" />
                        <p className="text-xs text-slate-500 mt-1">
                          Installing on {component.hostName}
                        </p>
                      </div>
                    )}
                    
                    {/* Component Details */}
                    <div className="space-y-3 mb-4">
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                        <div><strong>Port:</strong> {component.port}</div>
                        <div><strong>Service:</strong> {component.serviceName}</div>
                        {component.isCluster && (
                          <div className="col-span-2">
                            <strong>Cluster:</strong> {component.clusterComponents?.join(', ')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {component.features.slice(0, 3).map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                            {feature}
                          </Badge>
                        ))}
                        {component.features.length > 3 && (
                          <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                            +{component.features.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      {component.dependencies.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Dependencies:</p>
                          <div className="flex flex-wrap gap-1">
                            {component.dependencies.map((dep, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-yellow-600 text-yellow-400">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Installed Component Info */}
                    {component.status === 'installed' && (
                      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-green-400">
                            <strong>Host:</strong> {component.hostName}
                          </div>
                          <div className="text-green-400">
                            <strong>Uptime:</strong> {component.uptime}
                          </div>
                          {component.cpuUsage && (
                            <div className="text-green-400">
                              <strong>CPU:</strong> {component.cpuUsage}%
                            </div>
                          )}
                          {component.memoryUsage && (
                            <div className="text-green-400">
                              <strong>Memory:</strong> {component.memoryUsage}%
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                          {component.architecture.join(', ')}
                        </Badge>
                      </div>
                      
                      <div className="flex space-x-2">
                        {component.status === 'available' && (
                          <Button 
                            size="sm" 
                            onClick={() => installComponent(component, selectedHost)}
                            disabled={!selectedHost}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Install
                          </Button>
                        )}
                        
                        {component.status === 'installing' && (
                          <Button size="sm" variant="outline" disabled className="border-slate-600">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Installing
                          </Button>
                        )}
                        
                        {component.status === 'installed' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-green-600 text-green-400"
                              onClick={() => toggleComponent(component.id, 'start')}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-yellow-600 text-yellow-400"
                              onClick={() => toggleComponent(component.id, 'stop')}
                            >
                              <Pause className="h-3 w-3 mr-1" />
                              Stop
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-600 text-red-400"
                              onClick={() => uninstallComponent(component.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </>
                        )}
                        
                        {component.status === 'failed' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-red-600 text-red-400"
                            onClick={() => installComponent(component, selectedHost)}
                            disabled={!selectedHost}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Retry
                          </Button>
                        )}
                        
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Installed Components Tab */}
        <TabsContent value="installed" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Installed Components</CardTitle>
              <CardDescription className="text-slate-400">
                Manage and monitor your installed monitoring components
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {components.filter(c => c.status === 'installed').map((component) => (
                  <div key={component.id} className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getTypeIcon(component.type)}
                        <div>
                          <h3 className="font-semibold text-white">{component.name}</h3>
                          <p className="text-sm text-slate-400">
                            {component.hostName} • Port {component.port} • {component.uptime}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right text-sm">
                          <p className="text-slate-400">CPU: <span className="text-white">{component.cpuUsage}%</span></p>
                          <p className="text-slate-400">Memory: <span className="text-white">{component.memoryUsage}%</span></p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-green-600 text-green-400">
                            <Play className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-400">
                            <Pause className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {components.filter(c => c.status === 'installed').length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">No Installed Components</h3>
                    <p className="text-slate-400">
                      Install components from the Component Library to get started.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Installation Jobs Tab */}
        <TabsContent value="installations" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Installation History</CardTitle>
              <CardDescription className="text-slate-400">
                Track installation progress and history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {installations.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">No Installation Jobs</h3>
                    <p className="text-slate-400">
                      Installation history will appear here once you start installing components.
                    </p>
                  </div>
                ) : (
                  installations.map((job) => (
                    <div key={job.id} className="p-4 border border-slate-600 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-white">{job.componentName}</h4>
                          <p className="text-sm text-slate-400">{job.hostName}</p>
                        </div>
                        <Badge className={`${
                          job.status === 'completed' ? 'bg-green-600' :
                          job.status === 'installing' ? 'bg-blue-600' :
                          job.status === 'failed' ? 'bg-red-600' : 'bg-yellow-600'
                        } text-white`}>
                          {job.status}
                        </Badge>
                      </div>
                      
                      {job.status === 'installing' && (
                        <div className="mb-2">
                          <Progress value={job.progress} className="h-2" />
                          <p className="text-xs text-slate-500 mt-1">{job.progress}% complete</p>
                        </div>
                      )}
                      
                      <div className="text-xs text-slate-500">
                        <p>Started: {job.startTime}</p>
                        {job.endTime && <p>Completed: {job.endTime}</p>}
                        {job.error && <p className="text-red-400">Error: {job.error}</p>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}