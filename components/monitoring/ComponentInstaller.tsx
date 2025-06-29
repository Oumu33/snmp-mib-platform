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
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Play, 
  Square, 
  Trash2, 
  Settings, 
  Eye, 
  RefreshCw,
  Network,
  Globe,
  Wifi,
  WifiOff,
  Terminal,
  Key,
  Lock,
  Unlock,
  Target,
  Activity,
  Database,
  Monitor,
  BarChart3,
  Zap,
  Shield,
  Package,
  GitBranch,
  ExternalLink,
  Upload,
  HardDrive,
  Cpu,
  MemoryStick,
  Router,
  Search,
  Plus,
  Minus,
  Info,
  AlertCircle,
  FileText,
  Code,
  Layers,
  Cloud,
  CloudOff
} from 'lucide-react';

interface NetworkStatus {
  backend: 'online' | 'offline';
  internet: 'online' | 'offline';
  lastCheck: string;
  latency: {
    backend: number;
    internet: number;
  };
}

interface Host {
  id: string;
  name: string;
  ip: string;
  type: 'cloud' | 'internal' | 'edge';
  location: string;
  sshPort: number;
  username: string;
  authMethod: 'password' | 'key';
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  lastSeen: string;
  os: string;
  architecture: string;
  specs: {
    cpu: string;
    memory: string;
    disk: string;
  };
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  installedComponents: string[];
  networkAccess: {
    internal: boolean;
    external: boolean;
    latency: number;
  };
  sshKeyFingerprint?: string;
  region?: string;
  provider?: string;
}

interface Component {
  id: string;
  name: string;
  type: 'collector' | 'storage' | 'visualization' | 'alerting';
  description: string;
  version: string;
  releaseDate: string;
  downloadUrl: string;
  size: string;
  downloadCount: number;
  architecture: string[];
  dependencies: string[];
  ports: number[];
  configPath: string;
  serviceName: string;
  isCluster: boolean;
  clusterComponents?: string[];
  githubUrl: string;
  documentation: string;
  status: 'available' | 'installing' | 'installed' | 'failed';
  installProgress?: number;
  installLog?: string[];
}

interface Installation {
  id: string;
  componentId: string;
  componentName: string;
  hostId: string;
  hostName: string;
  version: string;
  status: 'pending' | 'downloading' | 'installing' | 'configuring' | 'starting' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  endTime?: string;
  logs: string[];
  error?: string;
}

export default function ComponentInstaller() {
  const [selectedHost, setSelectedHost] = useState<string>('');
  const [activeTab, setActiveTab] = useState('components');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    backend: 'offline',
    internet: 'offline',
    lastCheck: 'Never',
    latency: { backend: 0, internet: 0 }
  });
  const [hosts, setHosts] = useState<Host[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddHost, setShowAddHost] = useState(false);
  const [newHost, setNewHost] = useState({
    name: '',
    ip: '',
    type: 'internal' as 'cloud' | 'internal' | 'edge',
    location: '',
    sshPort: 22,
    username: '',
    authMethod: 'password' as 'password' | 'key',
    password: '',
    sshKeyId: '',
    region: '',
    provider: ''
  });

  // 网络状态检测
  useEffect(() => {
    checkNetworkStatus();
    const interval = setInterval(checkNetworkStatus, 30000); // 每30秒检查一次
    return () => clearInterval(interval);
  }, []);

  // 初始化数据
  useEffect(() => {
    initializeData();
  }, []);

  const checkNetworkStatus = async () => {
    const startTime = Date.now();
    
    try {
      // 检查后端连接
      const backendStart = Date.now();
      const backendResponse = await fetch('/api/v1/system/health', {
        method: 'GET',
        timeout: 5000
      });
      const backendLatency = Date.now() - backendStart;
      
      // 检查互联网连接（通过后端代理）
      const internetStart = Date.now();
      const internetResponse = await fetch('/api/v1/network/internet-check', {
        method: 'GET',
        timeout: 10000
      });
      const internetLatency = Date.now() - internetStart;
      
      setNetworkStatus({
        backend: backendResponse.ok ? 'online' : 'offline',
        internet: internetResponse.ok ? 'online' : 'offline',
        lastCheck: new Date().toLocaleTimeString(),
        latency: {
          backend: backendLatency,
          internet: internetLatency
        }
      });
    } catch (err) {
      setNetworkStatus({
        backend: 'offline',
        internet: 'offline',
        lastCheck: new Date().toLocaleTimeString(),
        latency: { backend: 0, internet: 0 }
      });
    }
  };

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 并行获取数据
      const [hostsResponse, componentsResponse, installationsResponse] = await Promise.all([
        fetch('/api/v1/hosts'),
        fetch('/api/v1/components'),
        fetch('/api/v1/installations')
      ]);

      if (hostsResponse.ok) {
        const hostsData = await hostsResponse.json();
        setHosts(hostsData || []);
      }

      if (componentsResponse.ok) {
        const componentsData = await componentsResponse.json();
        setComponents(componentsData || []);
      }

      if (installationsResponse.ok) {
        const installationsData = await installationsResponse.json();
        setInstallations(installationsData || []);
      }

    } catch (err) {
      console.error('Error initializing data:', err);
      setError('Failed to load data. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const addHost = async () => {
    try {
      const response = await fetch('/api/v1/hosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newHost.name,
          ip: newHost.ip,
          type: newHost.type,
          location: newHost.location,
          ssh_port: newHost.sshPort,
          username: newHost.username,
          auth_method: newHost.authMethod,
          password: newHost.authMethod === 'password' ? newHost.password : '',
          ssh_key_id: newHost.authMethod === 'key' ? newHost.sshKeyId : '',
          region: newHost.region,
          provider: newHost.provider
        })
      });

      if (response.ok) {
        setShowAddHost(false);
        setNewHost({
          name: '',
          ip: '',
          type: 'internal',
          location: '',
          sshPort: 22,
          username: '',
          authMethod: 'password',
          password: '',
          sshKeyId: '',
          region: '',
          provider: ''
        });
        initializeData(); // 刷新数据
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to add host');
      }
    } catch (err) {
      console.error('Error adding host:', err);
      setError('Error occurred while adding host');
    }
  };

  const testHostConnection = async (hostId: string) => {
    try {
      const response = await fetch(`/api/v1/hosts/${hostId}/test`, {
        method: 'POST'
      });

      const result = await response.json();
      
      // 更新主机状态
      setHosts(prev => prev.map(h => 
        h.id === hostId 
          ? { 
              ...h, 
              status: response.ok ? 'connected' : 'error',
              lastSeen: response.ok ? new Date().toISOString() : h.lastSeen
            }
          : h
      ));

      if (!response.ok) {
        setError(`Connection test failed for host: ${result.message}`);
      }
    } catch (err) {
      console.error('Error testing host connection:', err);
      setError('Failed to test host connection');
    }
  };

  const installComponent = async (componentId: string) => {
    if (!selectedHost) {
      setError('Please select a target host first');
      return;
    }

    try {
      const response = await fetch('/api/v1/components/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          component_id: componentId,
          host_id: selectedHost,
          auto_start: true
        })
      });

      if (response.ok) {
        const installation = await response.json();
        setInstallations(prev => [...prev, installation]);
        
        // 开始监控安装进度
        monitorInstallation(installation.id);
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to start installation');
      }
    } catch (err) {
      console.error('Error installing component:', err);
      setError('Error occurred during installation');
    }
  };

  const monitorInstallation = (installationId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/v1/installations/${installationId}/status`);
        if (response.ok) {
          const status = await response.json();
          
          setInstallations(prev => prev.map(inst => 
            inst.id === installationId ? { ...inst, ...status } : inst
          ));

          // 如果安装完成或失败，停止监控
          if (status.status === 'completed' || status.status === 'failed') {
            clearInterval(interval);
            initializeData(); // 刷新数据
          }
        }
      } catch (err) {
        console.error('Error monitoring installation:', err);
        clearInterval(interval);
      }
    }, 2000); // 每2秒检查一次
  };

  const getHostTypeIcon = (type: Host['type']) => {
    switch (type) {
      case 'cloud': return <Cloud className="h-4 w-4 text-blue-400" />;
      case 'internal': return <Server className="h-4 w-4 text-green-400" />;
      case 'edge': return <Router className="h-4 w-4 text-purple-400" />;
      default: return <Server className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: Host['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'connecting': return <Clock className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getNetworkStatusColor = () => {
    if (networkStatus.backend === 'online' && networkStatus.internet === 'online') {
      return 'text-green-400';
    } else if (networkStatus.backend === 'online') {
      return 'text-yellow-400';
    } else {
      return 'text-red-400';
    }
  };

  const getNetworkStatusText = () => {
    if (networkStatus.backend === 'online' && networkStatus.internet === 'online') {
      return 'Full Connectivity';
    } else if (networkStatus.backend === 'online') {
      return 'Limited Connectivity';
    } else {
      return 'No Connectivity';
    }
  };

  const connectedHosts = hosts.filter(h => h.status === 'connected').length;
  const cloudHosts = hosts.filter(h => h.type === 'cloud').length;
  const internalHosts = hosts.filter(h => h.type === 'internal').length;
  const activeInstallations = installations.filter(i => 
    ['pending', 'downloading', 'installing', 'configuring', 'starting'].includes(i.status)
  ).length;

  return (
    <div className="space-y-6">
      {/* 网络状态和统计 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Network Status</p>
                <p className={`text-lg font-bold ${getNetworkStatusColor()}`}>
                  {getNetworkStatusText()}
                </p>
                <p className="text-xs text-slate-500">
                  Backend: {networkStatus.latency.backend}ms
                </p>
              </div>
              <div className="flex flex-col items-center">
                {networkStatus.backend === 'online' ? (
                  networkStatus.internet === 'online' ? (
                    <Wifi className="h-6 w-6 text-green-400" />
                  ) : (
                    <WifiOff className="h-6 w-6 text-yellow-400" />
                  )
                ) : (
                  <CloudOff className="h-6 w-6 text-red-400" />
                )}
                <span className="text-xs text-slate-500 mt-1">
                  {networkStatus.lastCheck}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Connected Hosts</p>
                <p className="text-2xl font-bold text-green-400">{connectedHosts}</p>
                <p className="text-xs text-slate-500">of {hosts.length} total</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Cloud Hosts</p>
                <p className="text-2xl font-bold text-blue-400">{cloudHosts}</p>
                <p className="text-xs text-slate-500">External servers</p>
              </div>
              <Cloud className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Internal Hosts</p>
                <p className="text-2xl font-bold text-green-400">{internalHosts}</p>
                <p className="text-xs text-slate-500">Local network</p>
              </div>
              <Server className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Installs</p>
                <p className="text-2xl font-bold text-orange-400">{activeInstallations}</p>
                <p className="text-xs text-slate-500">In progress</p>
              </div>
              <Download className="h-8 w-8 text-orange-400" />
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
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="components">
            <Package className="h-4 w-4 mr-2" />
            Component Library
          </TabsTrigger>
          <TabsTrigger value="hosts">
            <Server className="h-4 w-4 mr-2" />
            Host Management
          </TabsTrigger>
          <TabsTrigger value="installations">
            <Download className="h-4 w-4 mr-2" />
            Installation Monitor
          </TabsTrigger>
          <TabsTrigger value="network">
            <Network className="h-4 w-4 mr-2" />
            Network Diagnostics
          </TabsTrigger>
        </TabsList>

        {/* 组件库标签页 */}
        <TabsContent value="components" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Monitoring Components</CardTitle>
                  <CardDescription className="text-slate-400">
                    Deploy monitoring stack components to remote hosts
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label className="text-slate-300">Target Host:</Label>
                    <select
                      value={selectedHost}
                      onChange={(e) => setSelectedHost(e.target.value)}
                      className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 min-w-[200px]"
                    >
                      <option value="">Select Host...</option>
                      {hosts.filter(h => h.status === 'connected').map(host => (
                        <option key={host.id} value={host.id}>
                          {host.name} ({host.ip}) - {host.type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={initializeData} variant="outline" className="border-slate-600 text-slate-300">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!selectedHost && (
                <Alert className="border-yellow-500 bg-yellow-500/10 mb-6">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-yellow-400">
                    Please select a target host to enable component installation.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {components.map((component) => (
                  <Card key={component.id} className="border border-slate-600 hover:border-blue-500 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            component.type === 'collector' ? 'bg-blue-600/20' :
                            component.type === 'storage' ? 'bg-green-600/20' :
                            component.type === 'visualization' ? 'bg-purple-600/20' : 'bg-orange-600/20'
                          }`}>
                            {component.type === 'collector' ? <Activity className="h-5 w-5" /> :
                             component.type === 'storage' ? <Database className="h-5 w-5" /> :
                             component.type === 'visualization' ? <BarChart3 className="h-5 w-5" /> :
                             <Bell className="h-5 w-5" />}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{component.name}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className="bg-blue-600 text-white text-xs">
                                v{component.version}
                              </Badge>
                              {component.isCluster && (
                                <Badge className="bg-purple-600 text-white text-xs">
                                  Cluster
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(component.githubUrl, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(component.documentation, '_blank')}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-300 mb-4">{component.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                          <div><strong>Release:</strong> {component.releaseDate}</div>
                          <div><strong>Size:</strong> {component.size}</div>
                          <div><strong>Downloads:</strong> {component.downloadCount.toLocaleString()}</div>
                          <div><strong>Arch:</strong> {component.architecture.join(', ')}</div>
                        </div>
                      </div>
                      
                      {component.dependencies.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-slate-500 mb-1">Dependencies:</p>
                          <div className="flex flex-wrap gap-1">
                            {component.dependencies.map((dep, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                                {dep}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {component.ports.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-slate-500 mb-1">Ports:</p>
                          <div className="flex flex-wrap gap-1">
                            {component.ports.map((port, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                                {port}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className={`text-xs border-slate-600 ${
                          component.type === 'collector' ? 'text-blue-400' :
                          component.type === 'storage' ? 'text-green-400' :
                          component.type === 'visualization' ? 'text-purple-400' : 'text-orange-400'
                        }`}>
                          {component.type}
                        </Badge>
                        <Button 
                          onClick={() => installComponent(component.id)}
                          disabled={!selectedHost || component.status === 'installing'}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                        >
                          {component.status === 'installing' ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Installing...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Install
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 主机管理标签页 */}
        <TabsContent value="hosts" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Remote Host Management</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage cloud and internal servers for component deployment
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddHost(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Host
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {hosts.map((host) => (
                  <Card key={host.id} className="border border-slate-600 hover:border-blue-500 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getHostTypeIcon(host.type)}
                          <div>
                            <h3 className="font-semibold text-white">{host.name}</h3>
                            <p className="text-sm text-slate-400">{host.ip}:{host.sshPort}</p>
                            {host.region && (
                              <p className="text-xs text-slate-500">{host.region} • {host.provider}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(host.status)}
                          <Badge className={`${
                            host.type === 'cloud' ? 'bg-blue-600' :
                            host.type === 'internal' ? 'bg-green-600' : 'bg-purple-600'
                          } text-white text-xs`}>
                            {host.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                          <div><strong>OS:</strong> {host.os}</div>
                          <div><strong>Arch:</strong> {host.architecture}</div>
                          <div><strong>User:</strong> {host.username}</div>
                          <div><strong>Auth:</strong> {host.authMethod === 'key' ? 'SSH Key' : 'Password'}</div>
                        </div>
                      </div>
                      
                      {host.status === 'connected' && (
                        <div className="space-y-2 mb-4">
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
                              <MemoryStick className="h-3 w-3 mr-1" />
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
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {host.installedComponents.slice(0, 2).map((comp, idx) => (
                          <Badge key={idx} className="text-xs bg-purple-600 text-white">
                            {comp}
                          </Badge>
                        ))}
                        {host.installedComponents.length > 2 && (
                          <Badge className="text-xs bg-purple-600 text-white">
                            +{host.installedComponents.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-xs text-slate-500 mb-3">
                        <span>Components: {host.installedComponents.length}</span>
                        <span>Last seen: {host.lastSeen}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-1">
                          {host.networkAccess.internal && (
                            <Badge variant="outline" className="text-xs border-green-600 text-green-400">
                              Internal
                            </Badge>
                          )}
                          {host.networkAccess.external && (
                            <Badge variant="outline" className="text-xs border-blue-600 text-blue-400">
                              External
                            </Badge>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => testHostConnection(host.id)}
                          >
                            <Target className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Terminal className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 安装监控标签页 */}
        <TabsContent value="installations" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Installation Monitor</CardTitle>
              <CardDescription className="text-slate-400">
                Real-time monitoring of component installations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {installations.length === 0 ? (
                  <div className="text-center py-8">
                    <Download className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">No Installations</h3>
                    <p className="text-slate-400">
                      Install components to see installation progress here.
                    </p>
                  </div>
                ) : (
                  installations.map((installation) => (
                    <div key={installation.id} className="p-4 border border-slate-600 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">{installation.componentName}</h3>
                          <p className="text-sm text-slate-400">
                            {installation.hostName} • v{installation.version}
                          </p>
                        </div>
                        <Badge className={`${
                          installation.status === 'completed' ? 'bg-green-600' :
                          installation.status === 'failed' ? 'bg-red-600' :
                          'bg-blue-600'
                        } text-white`}>
                          {installation.status}
                        </Badge>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white">{installation.progress}%</span>
                        </div>
                        <Progress value={installation.progress} className="h-2" />
                      </div>
                      
                      <div className="text-xs text-slate-500">
                        <p>Started: {installation.startTime}</p>
                        {installation.endTime && (
                          <p>Completed: {installation.endTime}</p>
                        )}
                        {installation.error && (
                          <p className="text-red-400 mt-1">Error: {installation.error}</p>
                        )}
                      </div>
                      
                      {installation.logs.length > 0 && (
                        <details className="mt-3">
                          <summary className="text-sm text-blue-400 cursor-pointer">
                            View Logs ({installation.logs.length} entries)
                          </summary>
                          <div className="mt-2 p-2 bg-slate-900 rounded text-xs font-mono text-slate-300 max-h-32 overflow-y-auto">
                            {installation.logs.map((log, idx) => (
                              <div key={idx}>{log}</div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 网络诊断标签页 */}
        <TabsContent value="network" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Network Diagnostics</CardTitle>
              <CardDescription className="text-slate-400">
                Monitor network connectivity and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Connectivity Status</h3>
                  
                  <div className="p-4 border border-slate-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">Backend API</span>
                      <div className="flex items-center space-x-2">
                        {networkStatus.backend === 'online' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                        )}
                        <span className={`text-sm ${
                          networkStatus.backend === 'online' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {networkStatus.backend}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Latency: {networkStatus.latency.backend}ms
                    </p>
                  </div>
                  
                  <div className="p-4 border border-slate-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-300">Internet Access</span>
                      <div className="flex items-center space-x-2">
                        {networkStatus.internet === 'online' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                        )}
                        <span className={`text-sm ${
                          networkStatus.internet === 'online' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {networkStatus.internet}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Latency: {networkStatus.latency.internet}ms
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Host Connectivity</h3>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {hosts.map((host) => (
                      <div key={host.id} className="p-3 border border-slate-600 rounded">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-white">{host.name}</span>
                            <p className="text-xs text-slate-400">{host.ip}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(host.status)}
                            <span className="text-xs text-slate-400">
                              {host.networkAccess.latency}ms
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 添加主机对话框 */}
      <Dialog open={showAddHost} onOpenChange={setShowAddHost}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Remote Host</DialogTitle>
            <DialogDescription>
              Configure connection to cloud or internal server
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Host Name</Label>
                <Input 
                  value={newHost.name}
                  onChange={(e) => setNewHost({...newHost, name: e.target.value})}
                  placeholder="production-server-01"
                />
              </div>
              <div>
                <Label>IP Address</Label>
                <Input 
                  value={newHost.ip}
                  onChange={(e) => setNewHost({...newHost, ip: e.target.value})}
                  placeholder="192.168.1.100 or 203.0.113.1"
                />
              </div>
              <div>
                <Label>Host Type</Label>
                <select 
                  value={newHost.type}
                  onChange={(e) => setNewHost({...newHost, type: e.target.value as any})}
                  className="w-full p-2 border border-slate-600 bg-slate-700 text-white rounded"
                >
                  <option value="internal">Internal Server</option>
                  <option value="cloud">Cloud Server</option>
                  <option value="edge">Edge Device</option>
                </select>
              </div>
              <div>
                <Label>Location</Label>
                <Input 
                  value={newHost.location}
                  onChange={(e) => setNewHost({...newHost, location: e.target.value})}
                  placeholder="Data Center A / AWS us-east-1"
                />
              </div>
              <div>
                <Label>SSH Port</Label>
                <Input 
                  type="number"
                  value={newHost.sshPort}
                  onChange={(e) => setNewHost({...newHost, sshPort: parseInt(e.target.value)})}
                  placeholder="22"
                />
              </div>
              <div>
                <Label>Username</Label>
                <Input 
                  value={newHost.username}
                  onChange={(e) => setNewHost({...newHost, username: e.target.value})}
                  placeholder="root / ubuntu / admin"
                />
              </div>
            </div>
            
            {newHost.type === 'cloud' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cloud Provider</Label>
                  <Input 
                    value={newHost.provider}
                    onChange={(e) => setNewHost({...newHost, provider: e.target.value})}
                    placeholder="AWS / Azure / GCP / Alibaba"
                  />
                </div>
                <div>
                  <Label>Region</Label>
                  <Input 
                    value={newHost.region}
                    onChange={(e) => setNewHost({...newHost, region: e.target.value})}
                    placeholder="us-east-1 / eu-west-1"
                  />
                </div>
              </div>
            )}
            
            <div>
              <Label>Authentication Method</Label>
              <select 
                value={newHost.authMethod}
                onChange={(e) => setNewHost({...newHost, authMethod: e.target.value as any})}
                className="w-full p-2 border border-slate-600 bg-slate-700 text-white rounded"
              >
                <option value="password">Password</option>
                <option value="key">SSH Key</option>
              </select>
            </div>
            
            {newHost.authMethod === 'password' && (
              <div>
                <Label>Password</Label>
                <Input 
                  type="password"
                  value={newHost.password}
                  onChange={(e) => setNewHost({...newHost, password: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddHost(false)}>
                Cancel
              </Button>
              <Button onClick={addHost}>
                Add Host
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}