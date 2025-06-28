'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Monitor,
  Network,
  Cpu,
  HardDrive,
  Wifi,
  Key,
  Terminal,
  Settings,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Clock,
  Globe,
  Shield,
  Target,
  Activity,
  Database,
  Zap
} from 'lucide-react';

interface Host {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  architecture: string;
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  sshPort: number;
  username: string;
  authMethod: 'password' | 'key';
  specs: {
    cpu: string;
    memory: string;
    disk: string;
  };
  resources: {
    cpu: number;
    memory: number;
    disk: number;
  };
  services: string[];
  lastSeen: string;
  installedComponents: string[];
}

export function HostSelection() {
  const [scanRange, setScanRange] = useState('192.168.1.0/24');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedHost, setSelectedHost] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('discovery');

  const discoveredHosts: Host[] = [
    {
      id: 'localhost',
      hostname: 'localhost',
      ip: '127.0.0.1',
      os: 'Ubuntu 22.04',
      architecture: 'x86_64',
      status: 'connected',
      sshPort: 22,
      username: 'root',
      authMethod: 'key',
      specs: { cpu: '4 cores', memory: '8GB', disk: '256GB SSD' },
      resources: { cpu: 25, memory: 45, disk: 67 },
      services: ['SSH', 'HTTP', 'SNMP'],
      lastSeen: 'Just now',
      installedComponents: ['node-exporter', 'snmp-exporter']
    },
    {
      id: 'server-01',
      hostname: 'monitoring-server-01',
      ip: '192.168.1.10',
      os: 'CentOS 8',
      architecture: 'x86_64',
      status: 'connected',
      sshPort: 22,
      username: 'admin',
      authMethod: 'password',
      specs: { cpu: '8 cores', memory: '16GB', disk: '512GB SSD' },
      resources: { cpu: 15, memory: 32, disk: 23 },
      services: ['SSH', 'SNMP', 'Docker'],
      lastSeen: '2 minutes ago',
      installedComponents: ['victoriametrics', 'grafana']
    },
    {
      id: 'server-02',
      hostname: 'storage-server-01',
      ip: '192.168.1.11',
      os: 'Ubuntu 20.04',
      architecture: 'x86_64',
      status: 'connected',
      sshPort: 22,
      username: 'ubuntu',
      authMethod: 'key',
      specs: { cpu: '16 cores', memory: '32GB', disk: '2TB NVMe' },
      resources: { cpu: 8, memory: 28, disk: 45 },
      services: ['SSH', 'SNMP'],
      lastSeen: '1 minute ago',
      installedComponents: ['vmstorage', 'vminsert', 'vmselect']
    },
    {
      id: 'router-01',
      hostname: 'core-router-01',
      ip: '192.168.1.1',
      os: 'RouterOS',
      architecture: 'ARM',
      status: 'connected',
      sshPort: 22,
      username: 'admin',
      authMethod: 'password',
      specs: { cpu: '2 cores', memory: '1GB', disk: '16GB' },
      resources: { cpu: 12, memory: 35, disk: 18 },
      services: ['SNMP', 'HTTP', 'Telnet'],
      lastSeen: '30 seconds ago',
      installedComponents: []
    },
    {
      id: 'switch-01',
      hostname: 'access-switch-01',
      ip: '192.168.1.2',
      os: 'Cisco IOS',
      architecture: 'MIPS',
      status: 'disconnected',
      sshPort: 22,
      username: 'cisco',
      authMethod: 'password',
      specs: { cpu: '1 core', memory: '512MB', disk: '4GB' },
      resources: { cpu: 0, memory: 0, disk: 0 },
      services: ['SNMP'],
      lastSeen: '5 minutes ago',
      installedComponents: []
    }
  ];

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const getStatusIcon = (status: Host['status']) => {
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

  const getStatusColor = (status: Host['status']) => {
    switch (status) {
      case 'connected':
        return 'border-green-500 bg-green-500/10';
      case 'connecting':
        return 'border-blue-500 bg-blue-500/10';
      case 'error':
        return 'border-red-500 bg-red-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const connectedHosts = discoveredHosts.filter(h => h.status === 'connected').length;
  const totalComponents = discoveredHosts.reduce((sum, h) => sum + h.installedComponents.length, 0);

  return (
    <div className="space-y-6">
      {/* Host Statistics */}
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
                <p className="text-sm text-slate-400">Total Hosts</p>
                <p className="text-2xl font-bold text-blue-400">{discoveredHosts.length}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Components</p>
                <p className="text-2xl font-bold text-purple-400">{totalComponents}</p>
              </div>
              <Database className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg CPU</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {Math.round(discoveredHosts.filter(h => h.status === 'connected').reduce((sum, h) => sum + h.resources.cpu, 0) / connectedHosts)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="discovery">
            <Search className="h-4 w-4 mr-2" />
            Host Discovery
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Plus className="h-4 w-4 mr-2" />
            Manual Entry
          </TabsTrigger>
          <TabsTrigger value="ssh">
            <Key className="h-4 w-4 mr-2" />
            SSH Management
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <Monitor className="h-4 w-4 mr-2" />
            Host Monitoring
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discovery" className="space-y-6">
          {/* Network Scan */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Network className="h-5 w-5 mr-2" />
                Network Discovery
              </CardTitle>
              <CardDescription className="text-slate-400">
                Automatically discover hosts on your network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <Label htmlFor="scan-range" className="text-slate-300">Network Range</Label>
                  <Input 
                    id="scan-range"
                    value={scanRange}
                    onChange={(e) => setScanRange(e.target.value)}
                    placeholder="192.168.1.0/24"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Scan Options</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-slate-400">SSH (22)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-slate-400">SNMP (161)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm text-slate-400">HTTP (80)</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={startScan}
                  disabled={isScanning}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Start Scan
                    </>
                  )}
                </Button>
              </div>
              
              {isScanning && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Scanning network range...</span>
                    <span className="text-slate-400">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-slate-500 mt-1">Found 5 hosts, checking services...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discovered Hosts */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Discovered Hosts</CardTitle>
              <CardDescription className="text-slate-400">
                Select hosts for component installation and management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {discoveredHosts.map((host) => (
                  <div 
                    key={host.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedHost === host.id 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : getStatusColor(host.status)
                    } ${host.status === 'connected' ? 'hover:border-blue-400' : ''}`}
                    onClick={() => host.status === 'connected' && setSelectedHost(host.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(host.status)}
                        <div>
                          <h3 className="font-semibold text-white">{host.hostname}</h3>
                          <p className="text-sm text-slate-400">{host.ip}:{host.sshPort}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${
                          host.status === 'connected' ? 'bg-green-600' : 
                          host.status === 'connecting' ? 'bg-blue-600' : 
                          host.status === 'error' ? 'bg-red-600' : 'bg-gray-600'
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
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {host.services.map((service, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    
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
                    
                    <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                      <span>Components: {host.installedComponents.length}</span>
                      <span>Last seen: {host.lastSeen}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                        {host.specs.cpu} • {host.specs.memory}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Terminal className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Manual Host Configuration</CardTitle>
              <CardDescription className="text-slate-400">
                Manually specify host details for management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hostname" className="text-slate-300">Hostname</Label>
                  <Input 
                    id="hostname"
                    placeholder="server.example.com"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="ip-address" className="text-slate-300">IP Address</Label>
                  <Input 
                    id="ip-address"
                    placeholder="192.168.1.100"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="ssh-port" className="text-slate-300">SSH Port</Label>
                  <Input 
                    id="ssh-port"
                    placeholder="22"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="username" className="text-slate-300">Username</Label>
                  <Input 
                    id="username"
                    placeholder="root"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="auth-method" className="text-slate-300">Authentication Method</Label>
                  <select 
                    id="auth-method"
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="password">Password</option>
                    <option value="key">SSH Key</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <Input 
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" className="border-slate-600 text-slate-300">
                  <Target className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Host
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ssh" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="h-5 w-5 mr-2" />
                SSH Key Management
              </CardTitle>
              <CardDescription className="text-slate-400">
                Manage SSH keys for secure host connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 border border-slate-600 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">Production Key</span>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC7...</p>
                  <p className="text-xs text-slate-500 mt-1">Used by 3 hosts • Created: 2024-01-10</p>
                  <div className="flex space-x-2 mt-2">
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border border-slate-600 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">Development Key</span>
                    <Badge variant="outline" className="border-slate-600 text-slate-400">Inactive</Badge>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQD9...</p>
                  <p className="text-xs text-slate-500 mt-1">Used by 1 host • Created: 2024-01-08</p>
                  <div className="flex space-x-2 mt-2">
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Generate New SSH Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Monitor className="h-5 w-5 mr-2" />
                Host Performance Monitoring
              </CardTitle>
              <CardDescription className="text-slate-400">
                Real-time host resource monitoring and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {discoveredHosts.filter(h => h.status === 'connected').map((host) => (
                  <div key={host.id} className="p-4 border border-slate-600 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        <div>
                          <h3 className="font-semibold text-white">{host.hostname}</h3>
                          <p className="text-sm text-slate-400">{host.ip} • {host.os}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-600 text-white">Online</Badge>
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 flex items-center">
                            <Cpu className="h-4 w-4 mr-1" />
                            CPU Usage
                          </span>
                          <span className="text-white font-semibold">{host.resources.cpu}%</span>
                        </div>
                        <Progress value={host.resources.cpu} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 flex items-center">
                            <Monitor className="h-4 w-4 mr-1" />
                            Memory
                          </span>
                          <span className="text-white font-semibold">{host.resources.memory}%</span>
                        </div>
                        <Progress value={host.resources.memory} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 flex items-center">
                            <HardDrive className="h-4 w-4 mr-1" />
                            Disk Usage
                          </span>
                          <span className="text-white font-semibold">{host.resources.disk}%</span>
                        </div>
                        <Progress value={host.resources.disk} className="h-3" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700">
                      <div className="flex space-x-4 text-xs text-slate-500">
                        <span>Uptime: 45 days</span>
                        <span>Load: 0.8, 0.6, 0.4</span>
                        <span>Components: {host.installedComponents.length}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                          <Terminal className="h-3 w-3 mr-1" />
                          SSH
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                          <Activity className="h-3 w-3 mr-1" />
                          Metrics
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}