'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Router, 
  Server, 
  Monitor, 
  Wifi, 
  Search, 
  Plus, 
  Settings, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Network,
  Cpu,
  HardDrive,
  Zap,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Target,
  Globe,
  Shield,
  Database,
  BarChart3,
  TrendingUp,
  Signal,
  Layers,
  MapPin,
  Tag
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  ip: string;
  type: 'router' | 'switch' | 'server' | 'printer' | 'ups' | 'firewall';
  vendor: string;
  model: string;
  location: string;
  status: 'online' | 'offline' | 'warning' | 'critical';
  uptime: string;
  lastSeen: string;
  snmpVersion: 'v1' | 'v2c' | 'v3';
  community: string;
  metrics: {
    cpu: number;
    memory: number;
    disk?: number;
    temperature?: number;
    interfaces: number;
    activeInterfaces: number;
  };
  alerts: number;
  group: string;
}

export function DeviceMonitoring() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isScanning, setIsScanning] = useState(false);

  const devices: Device[] = [
    {
      id: '1',
      name: 'Core-Router-01',
      ip: '192.168.1.1',
      type: 'router',
      vendor: 'Cisco',
      model: 'ISR 4331',
      location: 'Data Center A',
      status: 'online',
      uptime: '45 days',
      lastSeen: '30 seconds ago',
      snmpVersion: 'v2c',
      community: 'public',
      metrics: {
        cpu: 23,
        memory: 45,
        temperature: 42,
        interfaces: 8,
        activeInterfaces: 6
      },
      alerts: 0,
      group: 'Core Network'
    },
    {
      id: '2',
      name: 'Access-Switch-01',
      ip: '192.168.1.10',
      type: 'switch',
      vendor: 'Huawei',
      model: 'S5720-28P',
      location: 'Floor 1',
      status: 'online',
      uptime: '12 days',
      lastSeen: '1 minute ago',
      snmpVersion: 'v3',
      community: 'private',
      metrics: {
        cpu: 15,
        memory: 32,
        temperature: 38,
        interfaces: 24,
        activeInterfaces: 18
      },
      alerts: 1,
      group: 'Access Layer'
    },
    {
      id: '3',
      name: 'DB-Server-01',
      ip: '192.168.1.100',
      type: 'server',
      vendor: 'Dell',
      model: 'PowerEdge R740',
      location: 'Data Center A',
      status: 'warning',
      uptime: '89 days',
      lastSeen: '2 minutes ago',
      snmpVersion: 'v2c',
      community: 'public',
      metrics: {
        cpu: 78,
        memory: 85,
        disk: 67,
        temperature: 55,
        interfaces: 4,
        activeInterfaces: 2
      },
      alerts: 3,
      group: 'Servers'
    },
    {
      id: '4',
      name: 'Firewall-01',
      ip: '192.168.1.254',
      type: 'firewall',
      vendor: 'Fortinet',
      model: 'FortiGate 100F',
      location: 'DMZ',
      status: 'online',
      uptime: '156 days',
      lastSeen: '45 seconds ago',
      snmpVersion: 'v3',
      community: 'secure',
      metrics: {
        cpu: 34,
        memory: 52,
        temperature: 41,
        interfaces: 6,
        activeInterfaces: 4
      },
      alerts: 0,
      group: 'Security'
    },
    {
      id: '5',
      name: 'UPS-Main',
      ip: '192.168.1.200',
      type: 'ups',
      vendor: 'APC',
      model: 'Smart-UPS 3000',
      location: 'Data Center A',
      status: 'critical',
      uptime: '234 days',
      lastSeen: '5 minutes ago',
      snmpVersion: 'v2c',
      community: 'public',
      metrics: {
        cpu: 0,
        memory: 0,
        temperature: 28,
        interfaces: 1,
        activeInterfaces: 1
      },
      alerts: 2,
      group: 'Power'
    }
  ];

  const deviceGroups = ['all', 'Core Network', 'Access Layer', 'Servers', 'Security', 'Power'];
  const deviceTypes = ['all', 'router', 'switch', 'server', 'printer', 'ups', 'firewall'];

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'router': return <Router className="h-5 w-5" />;
      case 'switch': return <Network className="h-5 w-5" />;
      case 'server': return <Server className="h-5 w-5" />;
      case 'printer': return <Monitor className="h-5 w-5" />;
      case 'ups': return <Zap className="h-5 w-5" />;
      case 'firewall': return <Shield className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: Device['status']) => {
    switch (status) {
      case 'online': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'online': return 'border-green-500 bg-green-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      case 'critical': return 'border-red-500 bg-red-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.ip.includes(searchTerm) ||
                         device.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || device.group === selectedGroup;
    const matchesType = selectedType === 'all' || device.type === selectedType;
    return matchesSearch && matchesGroup && matchesType;
  });

  const startNetworkScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 5000);
  };

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const warningDevices = devices.filter(d => d.status === 'warning').length;
  const criticalDevices = devices.filter(d => d.status === 'critical').length;
  const totalAlerts = devices.reduce((sum, d) => sum + d.alerts, 0);

  return (
    <div className="space-y-6">
      {/* Device Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Online Devices</p>
                <p className="text-2xl font-bold text-green-400">{onlineDevices}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Warnings</p>
                <p className="text-2xl font-bold text-yellow-400">{warningDevices}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Critical</p>
                <p className="text-2xl font-bold text-red-400">{criticalDevices}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Alerts</p>
                <p className="text-2xl font-bold text-orange-400">{totalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="devices">
            <Globe className="h-4 w-4 mr-2" />
            Device List
          </TabsTrigger>
          <TabsTrigger value="discovery">
            <Search className="h-4 w-4 mr-2" />
            Discovery
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Layers className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Tag className="h-4 w-4 mr-2" />
            Groups
          </TabsTrigger>
        </TabsList>

        {/* Device List Tab */}
        <TabsContent value="devices" className="space-y-6">
          {/* Search and Filter */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Network Devices</CardTitle>
              <CardDescription className="text-slate-400">
                Monitor and manage your network infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search devices by name, IP, or vendor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    {deviceGroups.map(group => (
                      <option key={group} value={group}>
                        {group === 'all' ? 'All Groups' : group}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    {deviceTypes.map(type => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Device Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredDevices.map((device) => (
              <Card key={device.id} className={`border transition-all hover:shadow-lg ${getStatusColor(device.status)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        device.status === 'online' ? 'bg-green-600/20' :
                        device.status === 'warning' ? 'bg-yellow-600/20' :
                        device.status === 'critical' ? 'bg-red-600/20' : 'bg-gray-600/20'
                      }`}>
                        {getDeviceIcon(device.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{device.name}</h3>
                        <p className="text-sm text-slate-400">{device.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(device.status)}
                      {device.alerts > 0 && (
                        <Badge className="bg-red-600 text-white text-xs">
                          {device.alerts}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div><strong>Vendor:</strong> {device.vendor}</div>
                      <div><strong>Model:</strong> {device.model}</div>
                      <div><strong>Location:</strong> {device.location}</div>
                      <div><strong>SNMP:</strong> {device.snmpVersion}</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 flex items-center">
                          <Cpu className="h-3 w-3 mr-1" />
                          CPU
                        </span>
                        <span className="text-white">{device.metrics.cpu}%</span>
                      </div>
                      <Progress value={device.metrics.cpu} className="h-1" />
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 flex items-center">
                          <Monitor className="h-3 w-3 mr-1" />
                          Memory
                        </span>
                        <span className="text-white">{device.metrics.memory}%</span>
                      </div>
                      <Progress value={device.metrics.memory} className="h-1" />
                      
                      {device.metrics.disk && (
                        <>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400 flex items-center">
                              <HardDrive className="h-3 w-3 mr-1" />
                              Disk
                            </span>
                            <span className="text-white">{device.metrics.disk}%</span>
                          </div>
                          <Progress value={device.metrics.disk} className="h-1" />
                        </>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Uptime: {device.uptime}</span>
                      <span>Last seen: {device.lastSeen}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                        {device.group}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Discovery Tab */}
        <TabsContent value="discovery" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Network Discovery
              </CardTitle>
              <CardDescription className="text-slate-400">
                Automatically discover devices on your network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Network Range</Label>
                  <Input 
                    placeholder="192.168.1.0/24"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">SNMP Community</Label>
                  <Input 
                    placeholder="public"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm text-slate-400">SNMP v1/v2c</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm text-slate-400">SNMP v3</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm text-slate-400">ICMP Ping</span>
                  </div>
                </div>
                
                <Button 
                  onClick={startNetworkScan}
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
                      Start Discovery
                    </>
                  )}
                </Button>
              </div>
              
              {isScanning && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Scanning network...</span>
                    <span className="text-slate-400">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Layers className="h-5 w-5 mr-2" />
                Device Templates
              </CardTitle>
              <CardDescription className="text-slate-400">
                Pre-configured templates for different device types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <Router className="h-8 w-8 text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-white">Cisco Router</h3>
                      <p className="text-sm text-slate-400">ISR Series</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Standard Cisco router monitoring template with interface and routing metrics</p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Use Template
                  </Button>
                </div>
                
                <div className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <Network className="h-8 w-8 text-green-400" />
                    <div>
                      <h3 className="font-semibold text-white">Layer 2 Switch</h3>
                      <p className="text-sm text-slate-400">Generic Switch</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Basic switch monitoring with port status and VLAN information</p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Use Template
                  </Button>
                </div>
                
                <div className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <Server className="h-8 w-8 text-purple-400" />
                    <div>
                      <h3 className="font-semibold text-white">Linux Server</h3>
                      <p className="text-sm text-slate-400">RHEL/Ubuntu</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">Comprehensive server monitoring with system resources and services</p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Device Groups
              </CardTitle>
              <CardDescription className="text-slate-400">
                Organize devices into logical groups for easier management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceGroups.filter(g => g !== 'all').map((group, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-600 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <div>
                        <p className="font-semibold text-white">{group}</p>
                        <p className="text-sm text-slate-400">
                          {devices.filter(d => d.group === group).length} devices
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}