'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Download, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Settings, 
  Play,
  Pause,
  RotateCcw,
  Monitor,
  Database,
  Activity,
  Bell,
  Network,
  Cpu,
  HardDrive,
  Zap,
  Globe,
  Shield,
  Target,
  Layers,
  GitBranch,
  Package,
  Terminal,
  Key,
  Wifi,
  Router,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react';

interface Component {
  id: string;
  name: string;
  category: 'Collectors' | 'Storage' | 'Visualization' | 'Alerting' | 'Cluster';
  description: string;
  version: string;
  port: number;
  resources: {
    cpu: string;
    memory: string;
    disk: string;
  };
  features: string[];
  dependencies?: string[];
  status: 'available' | 'installing' | 'installed' | 'failed' | 'updating';
  installProgress?: number;
  architecture: string[];
  clusterComponent?: boolean;
}

interface Host {
  id: string;
  name: string;
  ip: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  os: string;
  architecture: string;
  sshPort: number;
  username: string;
  authMethod: 'password' | 'key';
  lastSeen: string;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
  };
  installedComponents: string[];
}

export function ComponentInstaller() {
  const [selectedHost, setSelectedHost] = useState<string>('');
  const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
  const [isInstalling, setIsInstalling] = useState(false);
  const [activeTab, setActiveTab] = useState('components');

  const components: Component[] = [
    // Data Collectors
    {
      id: 'node-exporter',
      name: 'Node Exporter',
      category: 'Collectors',
      description: 'Hardware and OS metrics exposed by *NIX kernels',
      version: '1.7.0',
      port: 9100,
      resources: { cpu: '1 core', memory: '64MB', disk: '20MB' },
      features: ['System Metrics', 'Hardware Info', 'OS Statistics', 'Process Monitoring'],
      status: 'available',
      architecture: ['x86_64', 'arm64', 'armv7']
    },
    {
      id: 'categraf',
      name: 'Categraf',
      category: 'Collectors',
      description: 'Multi-functional metrics collector with plugin architecture',
      version: '0.3.60',
      port: 9100,
      resources: { cpu: '1 core', memory: '128MB', disk: '50MB' },
      features: ['Multi-protocol Support', 'Plugin Architecture', 'Low Resource Usage', 'Hot Reload'],
      status: 'available',
      architecture: ['x86_64', 'arm64', 'armv7']
    },
    {
      id: 'snmp-exporter',
      name: 'SNMP Exporter',
      category: 'Collectors',
      description: 'SNMP data collection for network devices',
      version: '0.25.0',
      port: 9116,
      resources: { cpu: '1 core', memory: '128MB', disk: '50MB' },
      features: ['SNMP v1/v2c/v3', 'MIB Support', 'Device Discovery', 'Custom OIDs'],
      status: 'installed',
      architecture: ['x86_64', 'arm64']
    },
    {
      id: 'vmagent',
      name: 'VMAgent',
      category: 'Collectors',
      description: 'Lightweight metrics agent for data collection and forwarding',
      version: '1.95.1',
      port: 8429,
      resources: { cpu: '2 cores', memory: '512MB', disk: '100MB' },
      features: ['High Performance', 'Low Resource Usage', 'Data Compression', 'Service Discovery'],
      status: 'available',
      architecture: ['x86_64', 'arm64']
    },

    // Storage - Single Node
    {
      id: 'victoriametrics-single',
      name: 'VictoriaMetrics (Single)',
      category: 'Storage',
      description: 'High-performance time series database - single node',
      version: '1.95.1',
      port: 8428,
      resources: { cpu: '2 cores', memory: '1GB', disk: '10GB' },
      features: ['PromQL Compatible', 'High Compression', 'Fast Ingestion', 'Grafana Integration'],
      status: 'installing',
      installProgress: 45,
      architecture: ['x86_64', 'arm64']
    },

    // Storage - Cluster Components
    {
      id: 'vmstorage',
      name: 'VMStorage',
      category: 'Cluster',
      description: 'VictoriaMetrics cluster storage node',
      version: '1.95.1',
      port: 8482,
      resources: { cpu: '4 cores', memory: '8GB', disk: '100GB SSD' },
      features: ['Data Persistence', 'High Compression', 'Horizontal Scaling', 'Replication'],
      status: 'available',
      architecture: ['x86_64', 'arm64'],
      clusterComponent: true,
      dependencies: ['vminsert', 'vmselect']
    },
    {
      id: 'vminsert',
      name: 'VMInsert',
      category: 'Cluster',
      description: 'VictoriaMetrics cluster insert node',
      version: '1.95.1',
      port: 8480,
      resources: { cpu: '2 cores', memory: '2GB', disk: '10GB' },
      features: ['High Concurrency', 'Load Balancing', 'Data Sharding', 'Deduplication'],
      status: 'available',
      architecture: ['x86_64', 'arm64'],
      clusterComponent: true,
      dependencies: ['vmstorage']
    },
    {
      id: 'vmselect',
      name: 'VMSelect',
      category: 'Cluster',
      description: 'VictoriaMetrics cluster select node',
      version: '1.95.1',
      port: 8481,
      resources: { cpu: '2 cores', memory: '4GB', disk: '10GB' },
      features: ['High Performance Query', 'Query Cache', 'Multi-tenant Support', 'PromQL API'],
      status: 'available',
      architecture: ['x86_64', 'arm64'],
      clusterComponent: true,
      dependencies: ['vmstorage']
    },

    // Visualization
    {
      id: 'grafana',
      name: 'Grafana',
      category: 'Visualization',
      description: 'Analytics and interactive visualization platform',
      version: '10.2.2',
      port: 3000,
      resources: { cpu: '2 cores', memory: '512MB', disk: '200MB' },
      features: ['Dashboard Creation', 'Multi-datasource', 'Alerting', 'User Management'],
      dependencies: ['victoriametrics-single'],
      status: 'available',
      architecture: ['x86_64', 'arm64']
    },

    // Alerting
    {
      id: 'vmalert',
      name: 'VMAlert',
      category: 'Alerting',
      description: 'VictoriaMetrics alerting component',
      version: '1.95.1',
      port: 8880,
      resources: { cpu: '1 core', memory: '512MB', disk: '1GB' },
      features: ['Rule Evaluation', 'Alert Routing', 'Prometheus Compatible', 'Webhook Support'],
      dependencies: ['victoriametrics-single'],
      status: 'available',
      architecture: ['x86_64', 'arm64']
    },
    {
      id: 'alertmanager',
      name: 'Alertmanager',
      category: 'Alerting',
      description: 'Alert handling and notification system',
      version: '0.26.0',
      port: 9093,
      resources: { cpu: '1 core', memory: '128MB', disk: '50MB' },
      features: ['Alert Grouping', 'Silencing', 'Inhibition', 'Multi-channel Notifications'],
      status: 'failed',
      architecture: ['x86_64', 'arm64']
    }
  ];

  const hosts: Host[] = [
    {
      id: 'host-1',
      name: 'monitoring-server-01',
      ip: '192.168.1.10',
      status: 'connected',
      os: 'Ubuntu 22.04',
      architecture: 'x86_64',
      sshPort: 22,
      username: 'root',
      authMethod: 'key',
      lastSeen: '30 seconds ago',
      resources: { cpu: 25, memory: 45, disk: 67 },
      installedComponents: ['node-exporter', 'snmp-exporter']
    },
    {
      id: 'host-2',
      name: 'storage-server-01',
      ip: '192.168.1.11',
      status: 'connected',
      os: 'CentOS 8',
      architecture: 'x86_64',
      sshPort: 22,
      username: 'admin',
      authMethod: 'password',
      lastSeen: '1 minute ago',
      resources: { cpu: 15, memory: 32, disk: 23 },
      installedComponents: []
    },
    {
      id: 'host-3',
      name: 'cluster-node-01',
      ip: '192.168.1.12',
      status: 'disconnected',
      os: 'Ubuntu 20.04',
      architecture: 'arm64',
      sshPort: 2222,
      username: 'ubuntu',
      authMethod: 'key',
      lastSeen: '5 minutes ago',
      resources: { cpu: 0, memory: 0, disk: 0 },
      installedComponents: []
    }
  ];

  const getStatusIcon = (status: Component['status']) => {
    switch (status) {
      case 'installed':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'installing':
        return <Clock className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-slate-500" />;
    }
  };

  const getStatusColor = (status: Component['status']) => {
    switch (status) {
      case 'installed':
        return 'border-green-500 bg-green-500/10';
      case 'installing':
        return 'border-blue-500 bg-blue-500/10';
      case 'failed':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-slate-600 hover:border-blue-500';
    }
  };

  const getCategoryIcon = (category: Component['category']) => {
    switch (category) {
      case 'Collectors':
        return <Activity className="h-4 w-4" />;
      case 'Storage':
        return <Database className="h-4 w-4" />;
      case 'Visualization':
        return <Monitor className="h-4 w-4" />;
      case 'Alerting':
        return <Bell className="h-4 w-4" />;
      case 'Cluster':
        return <Layers className="h-4 w-4" />;
    }
  };

  const getHostStatusIcon = (status: Host['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'connecting':
        return <Clock className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleComponentSelect = (componentId: string) => {
    setSelectedComponents(prev => 
      prev.includes(componentId) 
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId]
    );
  };

  const startInstallation = () => {
    setIsInstalling(true);
    // Simulate installation process
    setTimeout(() => {
      setIsInstalling(false);
      setSelectedComponents([]);
    }, 5000);
  };

  const installedCount = components.filter(c => c.status === 'installed').length;
  const failedCount = components.filter(c => c.status === 'failed').length;
  const installingCount = components.filter(c => c.status === 'installing').length;
  const connectedHosts = hosts.filter(h => h.status === 'connected').length;

  return (
    <div className="space-y-6">
      {/* Installation Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Connected Hosts</p>
                <p className="text-2xl font-bold text-green-400">{connectedHosts}</p>
              </div>
              <Server className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Installed</p>
                <p className="text-2xl font-bold text-green-400">{installedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Installing</p>
                <p className="text-2xl font-bold text-blue-400">{installingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Failed</p>
                <p className="text-2xl font-bold text-red-400">{failedCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="components">
            <Package className="h-4 w-4 mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger value="hosts">
            <Server className="h-4 w-4 mr-2" />
            Host Management
          </TabsTrigger>
          <TabsTrigger value="deployment">
            <Target className="h-4 w-4 mr-2" />
            Deployment
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Layers className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
        </TabsList>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Monitoring Components</CardTitle>
                  <CardDescription className="text-slate-400">
                    Choose components to install on target hosts
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={selectedComponents.length === 0 || isInstalling || !selectedHost}
                    onClick={startInstallation}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Install Selected ({selectedComponents.length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {components.map((component) => (
                  <div 
                    key={component.id} 
                    className={`p-4 border rounded-lg transition-all cursor-pointer ${getStatusColor(component.status)}`}
                    onClick={() => component.status === 'available' && handleComponentSelect(component.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {component.status === 'available' && (
                          <Checkbox 
                            checked={selectedComponents.includes(component.id)}
                            onChange={() => handleComponentSelect(component.id)}
                          />
                        )}
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                          {getCategoryIcon(component.category)}
                          <span className="ml-1">{component.category}</span>
                        </Badge>
                        {component.clusterComponent && (
                          <Badge className="bg-purple-600 text-white text-xs">Cluster</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(component.status)}
                        <span className="text-xs text-slate-400 capitalize">{component.status}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <h3 className="font-semibold text-white">{component.name}</h3>
                      <p className="text-sm text-slate-400">{component.description}</p>
                    </div>
                    
                    {component.installProgress && component.status === 'installing' && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Installing...</span>
                          <span>{component.installProgress}%</span>
                        </div>
                        <Progress value={component.installProgress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-3">
                      <div><strong>Version:</strong> {component.version}</div>
                      <div><strong>Port:</strong> {component.port}</div>
                      <div><strong>CPU:</strong> {component.resources.cpu}</div>
                      <div><strong>Memory:</strong> {component.resources.memory}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
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
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {component.architecture.map((arch, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-blue-700 text-blue-400">
                          {arch}
                        </Badge>
                      ))}
                    </div>
                    
                    {component.dependencies && (
                      <div className="mt-2 pt-2 border-t border-slate-700">
                        <span className="text-xs text-slate-500">
                          Requires: {component.dependencies.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Host Management Tab */}
        <TabsContent value="hosts" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Host Management</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage SSH connections and remote hosts
                  </CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Host
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {hosts.map((host) => (
                  <div 
                    key={host.id}
                    className={`p-4 border rounded-lg transition-all cursor-pointer ${
                      selectedHost === host.id 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-slate-600 hover:border-blue-400'
                    }`}
                    onClick={() => host.status === 'connected' && setSelectedHost(host.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getHostStatusIcon(host.status)}
                        <div>
                          <h3 className="font-semibold text-white">{host.name}</h3>
                          <p className="text-sm text-slate-400">{host.ip}:{host.sshPort}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${
                          host.status === 'connected' ? 'bg-green-600' : 
                          host.status === 'connecting' ? 'bg-blue-600' : 'bg-red-600'
                        } text-white text-xs`}>
                          {host.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                        <div><strong>OS:</strong> {host.os}</div>
                        <div><strong>Arch:</strong> {host.architecture}</div>
                        <div><strong>User:</strong> {host.username}</div>
                        <div><strong>Auth:</strong> {host.authMethod}</div>
                      </div>
                    </div>
                    
                    {host.status === 'connected' && (
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 flex items-center">
                            <Cpu className="h-3 w-3 mr-1" />
                            CPU
                          </span>
                          <span className="text-white">{host.resources.cpu}%</span>
                        </div>
                        <Progress value={host.resources.cpu} className="h-1" />
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 flex items-center">
                            <Monitor className="h-3 w-3 mr-1" />
                            Memory
                          </span>
                          <span className="text-white">{host.resources.memory}%</span>
                        </div>
                        <Progress value={host.resources.memory} className="h-1" />
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400 flex items-center">
                            <HardDrive className="h-3 w-3 mr-1" />
                            Disk
                          </span>
                          <span className="text-white">{host.resources.disk}%</span>
                        </div>
                        <Progress value={host.resources.disk} className="h-1" />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                      <span>Components: {host.installedComponents.length}</span>
                      <span>Last seen: {host.lastSeen}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {host.installedComponents.slice(0, 2).map((comp, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                            {comp}
                          </Badge>
                        ))}
                        {host.installedComponents.length > 2 && (
                          <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                            +{host.installedComponents.length - 2}
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Terminal className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SSH Configuration */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="h-5 w-5 mr-2" />
                SSH Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Host Address</Label>
                  <Input 
                    placeholder="192.168.1.100"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">SSH Port</Label>
                  <Input 
                    placeholder="22"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Username</Label>
                  <Input 
                    placeholder="root"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Authentication</Label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2">
                    <option value="key">SSH Key</option>
                    <option value="password">Password</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  Test Connection
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Add Host
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployment Tab */}
        <TabsContent value="deployment" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Deployment Management
              </CardTitle>
              <CardDescription className="text-slate-400">
                Monitor and manage component deployments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-400 animate-spin" />
                    <span className="font-semibold text-blue-400">VictoriaMetrics Installing</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">Installing on monitoring-server-01 (192.168.1.10)</p>
                  <Progress value={45} className="h-2 mb-2" />
                  <div className="flex space-x-4 text-xs text-slate-400">
                    <span>✓ Download completed</span>
                    <span>⏳ Configuring service</span>
                    <span>⏳ Starting service</span>
                  </div>
                </div>
                
                <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="font-semibold text-green-400">Node Exporter Deployed</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">Successfully deployed on monitoring-server-01</p>
                  <div className="flex space-x-4 text-xs text-slate-400">
                    <span>✓ Service running on port 9100</span>
                    <span>✓ Metrics endpoint accessible</span>
                    <span>✓ Auto-start enabled</span>
                  </div>
                </div>
                
                <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <span className="font-semibold text-red-400">Alertmanager Failed</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">Deployment failed on storage-server-01</p>
                  <div className="flex space-x-4 text-xs text-slate-400">
                    <span>✗ Port 9093 already in use</span>
                    <span>✗ Configuration validation failed</span>
                  </div>
                  <Button size="sm" variant="outline" className="border-red-500 text-red-400 mt-2">
                    Retry Deployment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Layers className="h-5 w-5 mr-2" />
                Deployment Templates
              </CardTitle>
              <CardDescription className="text-slate-400">
                Pre-configured monitoring stack templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <Activity className="h-8 w-8 text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-white">Basic Monitoring</h3>
                      <p className="text-sm text-slate-400">Single Node</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Node Exporter + VictoriaMetrics + Grafana</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">node-exporter</Badge>
                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">victoriametrics</Badge>
                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">grafana</Badge>
                  </div>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Deploy Template
                  </Button>
                </div>
                
                <div className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <Network className="h-8 w-8 text-green-400" />
                    <div>
                      <h3 className="font-semibold text-white">SNMP Monitoring</h3>
                      <p className="text-sm text-slate-400">Network Devices</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">SNMP Exporter + VictoriaMetrics + Grafana</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">snmp-exporter</Badge>
                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">victoriametrics</Badge>
                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">grafana</Badge>
                  </div>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Deploy Template
                  </Button>
                </div>
                
                <div className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <Layers className="h-8 w-8 text-purple-400" />
                    <div>
                      <h3 className="font-semibold text-white">Enterprise Cluster</h3>
                      <p className="text-sm text-slate-400">High Availability</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">VM Cluster + Categraf + VMAlert + Grafana</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">vm-cluster</Badge>
                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">categraf</Badge>
                    <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">vmalert</Badge>
                  </div>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Deploy Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}