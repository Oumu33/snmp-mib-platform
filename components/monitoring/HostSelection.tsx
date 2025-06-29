'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Zap,
  Info,
  AlertTriangle,
  Upload,
  Download,
  FileText,
  Users,
  Lock,
  Unlock
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
  connectionTest?: {
    status: 'testing' | 'success' | 'failed';
    message: string;
    timestamp: string;
  };
}

interface SSHKey {
  id: string;
  name: string;
  fingerprint: string;
  publicKey: string;
  createdAt: string;
  usedByHosts: string[];
  status: 'active' | 'inactive';
}

export function HostSelection() {
  const [scanRange, setScanRange] = useState('192.168.1.0/24');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedHost, setSelectedHost] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('discovery');
  const [hosts, setHosts] = useState<Host[]>([]);
  const [sshKeys, setSSHKeys] = useState<SSHKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddHost, setShowAddHost] = useState(false);
  const [showSSHKeyDialog, setShowSSHKeyDialog] = useState(false);
  const [newHost, setNewHost] = useState({
    hostname: '',
    ip: '',
    sshPort: 22,
    username: '',
    authMethod: 'password' as 'password' | 'key',
    password: '',
    sshKeyId: ''
  });

  // Fetch host data from backend API
  useEffect(() => {
    fetchHosts();
    fetchSSHKeys();
  }, []);

  const fetchHosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/v1/hosts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch hosts');
      }
      
      const data = await response.json();
      setHosts(data || []);
    } catch (err) {
      console.error('Error fetching hosts:', err);
      setError('Unable to fetch host data. Please check network connection or contact administrator.');
      setHosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSSHKeys = async () => {
    try {
      const response = await fetch('/api/v1/ssh-keys');
      if (response.ok) {
        const data = await response.json();
        setSSHKeys(data || []);
      }
    } catch (err) {
      console.error('Error fetching SSH keys:', err);
    }
  };

  const startScan = async () => {
    setIsScanning(true);
    setError(null);
    
    try {
      const response = await fetch('/api/v1/hosts/discover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          network_range: scanRange,
          scan_ssh: true,
          scan_snmp: true
        })
      });

      if (!response.ok) {
        throw new Error('Network scan failed');
      }

      // Refresh host list after scan completes
      setTimeout(() => {
        fetchHosts();
        setIsScanning(false);
      }, 3000);
    } catch (err) {
      console.error('Error during network scan:', err);
      setError('Network scan failed. Please check network range settings.');
      setIsScanning(false);
    }
  };

  const testHostConnection = async (hostId: string) => {
    setHosts(prev => prev.map(h => 
      h.id === hostId 
        ? { 
            ...h, 
            connectionTest: { 
              status: 'testing', 
              message: 'Testing connection...', 
              timestamp: new Date().toISOString() 
            } 
          }
        : h
    ));

    try {
      const response = await fetch(`/api/v1/hosts/${hostId}/test`, {
        method: 'POST'
      });

      const result = await response.json();

      setHosts(prev => prev.map(h => 
        h.id === hostId 
          ? { 
              ...h, 
              connectionTest: { 
                status: response.ok ? 'success' : 'failed', 
                message: result.message || (response.ok ? 'Connection successful' : 'Connection failed'), 
                timestamp: new Date().toISOString() 
              },
              status: response.ok ? 'connected' : 'error'
            }
          : h
      ));
    } catch (err) {
      setHosts(prev => prev.map(h => 
        h.id === hostId 
          ? { 
              ...h, 
              connectionTest: { 
                status: 'failed', 
                message: 'Connection test failed', 
                timestamp: new Date().toISOString() 
              },
              status: 'error'
            }
          : h
      ));
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
          name: newHost.hostname,
          ip: newHost.ip,
          ssh_port: newHost.sshPort,
          username: newHost.username,
          auth_method: newHost.authMethod,
          password: newHost.authMethod === 'password' ? newHost.password : '',
          ssh_key: newHost.authMethod === 'key' ? newHost.sshKeyId : ''
        })
      });

      if (response.ok) {
        setShowAddHost(false);
        setNewHost({
          hostname: '',
          ip: '',
          sshPort: 22,
          username: '',
          authMethod: 'password',
          password: '',
          sshKeyId: ''
        });
        fetchHosts();
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to add host');
      }
    } catch (err) {
      console.error('Error adding host:', err);
      setError('Error occurred while adding host');
    }
  };

  const deleteHost = async (hostId: string) => {
    try {
      const response = await fetch(`/api/v1/hosts/${hostId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchHosts();
      } else {
        setError('Failed to delete host');
      }
    } catch (err) {
      console.error('Error deleting host:', err);
      setError('Error occurred while deleting host');
    }
  };

  const generateSSHKey = async () => {
    try {
      const response = await fetch('/api/v1/ssh-keys/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `key-${Date.now()}`,
          type: 'rsa',
          bits: 2048
        })
      });

      if (response.ok) {
        fetchSSHKeys();
        setShowSSHKeyDialog(false);
      } else {
        setError('Failed to generate SSH key');
      }
    } catch (err) {
      console.error('Error generating SSH key:', err);
      setError('Error occurred while generating SSH key');
    }
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

  const connectedHosts = hosts.filter(h => h.status === 'connected').length;
  const totalComponents = hosts.reduce((sum, h) => sum + h.installedComponents.length, 0);

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
                <p className="text-2xl font-bold text-blue-400">{hosts.length}</p>
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
                <p className="text-sm text-slate-400">SSH Keys</p>
                <p className="text-2xl font-bold text-yellow-400">{sshKeys.length}</p>
              </div>
              <Key className="h-8 w-8 text-yellow-400" />
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
              Close
            </Button>
          </AlertDescription>
        </Alert>
      )}

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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <Network className="h-5 w-5 mr-2" />
                    Network Discovery
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Automatically discover hosts on your network
                  </CardDescription>
                </div>
                <Button onClick={fetchHosts} variant="outline" className="border-slate-600 text-slate-300">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh List
                </Button>
              </div>
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
                  <p className="text-xs text-slate-500 mt-1">Found {hosts.length} hosts, checking services...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discovered Hosts */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Discovered Hosts</CardTitle>
                  <CardDescription className="text-slate-400">
                    Select hosts for component installation and management
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddHost(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Manually
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-400 mr-2" />
                  <span className="text-slate-400">Loading host data...</span>
                </div>
              ) : hosts.length === 0 ? (
                <div className="text-center py-8">
                  <Server className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">No Hosts Found</h3>
                  <p className="text-slate-400 mb-4">
                    Try network scanning or manually add hosts.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button onClick={startScan} className="bg-blue-600 hover:bg-blue-700">
                      <Search className="h-4 w-4 mr-2" />
                      Start Scan
                    </Button>
                    <Button onClick={() => setShowAddHost(true)} variant="outline" className="border-slate-600 text-slate-300">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Manually
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {hosts.map((host) => (
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
                            {host.status === 'connected' ? 'Connected' : 
                             host.status === 'connecting' ? 'Connecting' :
                             host.status === 'error' ? 'Error' : 'Disconnected'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                          <div><strong>OS:</strong> {host.os}</div>
                          <div><strong>Arch:</strong> {host.architecture}</div>
                          <div><strong>User:</strong> {host.username}</div>
                          <div><strong>Auth:</strong> {host.authMethod === 'key' ? 'SSH Key' : 'Password'}</div>
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

                      {/* Connection Test Result */}
                      {host.connectionTest && (
                        <div className={`p-2 rounded text-xs mb-2 ${
                          host.connectionTest.status === 'success' ? 'bg-green-500/20 text-green-400' :
                          host.connectionTest.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {host.connectionTest.message}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                        <span>Components: {host.installedComponents.length}</span>
                        <span>Last seen: {host.lastSeen}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                          {host.specs.cpu} • {host.specs.memory}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              testHostConnection(host.id);
                            }}
                          >
                            <Target className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Terminal className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteHost(host.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                    value={newHost.hostname}
                    onChange={(e) => setNewHost({...newHost, hostname: e.target.value})}
                    placeholder="server.example.com"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="ip-address" className="text-slate-300">IP Address</Label>
                  <Input 
                    id="ip-address"
                    value={newHost.ip}
                    onChange={(e) => setNewHost({...newHost, ip: e.target.value})}
                    placeholder="192.168.1.100"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="ssh-port" className="text-slate-300">SSH Port</Label>
                  <Input 
                    id="ssh-port"
                    type="number"
                    value={newHost.sshPort}
                    onChange={(e) => setNewHost({...newHost, sshPort: parseInt(e.target.value)})}
                    placeholder="22"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="username" className="text-slate-300">Username</Label>
                  <Input 
                    id="username"
                    value={newHost.username}
                    onChange={(e) => setNewHost({...newHost, username: e.target.value})}
                    placeholder="root"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="auth-method" className="text-slate-300">Authentication Method</Label>
                  <select 
                    id="auth-method"
                    value={newHost.authMethod}
                    onChange={(e) => setNewHost({...newHost, authMethod: e.target.value as 'password' | 'key'})}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="password">Password</option>
                    <option value="key">SSH Key</option>
                  </select>
                </div>
                {newHost.authMethod === 'password' ? (
                  <div>
                    <Label htmlFor="password" className="text-slate-300">Password</Label>
                    <Input 
                      id="password"
                      type="password"
                      value={newHost.password}
                      onChange={(e) => setNewHost({...newHost, password: e.target.value})}
                      placeholder="••••••••"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="ssh-key" className="text-slate-300">SSH Key</Label>
                    <select 
                      id="ssh-key"
                      value={newHost.sshKeyId}
                      onChange={(e) => setNewHost({...newHost, sshKeyId: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Select SSH Key</option>
                      {sshKeys.map(key => (
                        <option key={key.id} value={key.id}>{key.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  className="border-slate-600 text-slate-300"
                  onClick={() => {
                    // Test connection logic
                  }}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button onClick={addHost} className="bg-blue-600 hover:bg-blue-700">
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    SSH Key Management
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage SSH keys for secure host connections
                  </CardDescription>
                </div>
                <Button onClick={() => setShowSSHKeyDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Key
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sshKeys.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">No SSH Keys</h3>
                  <p className="text-slate-400 mb-4">
                    Generate SSH keys for secure host connections.
                  </p>
                  <Button onClick={() => setShowSSHKeyDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate First Key
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sshKeys.map((key) => (
                    <div key={key.id} className="p-4 border border-slate-600 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4 text-blue-400" />
                          <span className="font-semibold text-white">{key.name}</span>
                          <Badge className={`${key.status === 'active' ? 'bg-green-600' : 'bg-gray-600'} text-white text-xs`}>
                            {key.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mb-2">{key.fingerprint}</p>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Used by hosts: {key.usedByHosts.length}</span>
                        <span>Created: {key.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                {hosts.filter(h => h.status === 'connected').map((host) => (
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

      {/* Add Host Dialog */}
      <Dialog open={showAddHost} onOpenChange={setShowAddHost}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Host</DialogTitle>
            <DialogDescription>
              Configure connection information for new host
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Hostname</Label>
                <Input 
                  value={newHost.hostname}
                  onChange={(e) => setNewHost({...newHost, hostname: e.target.value})}
                  placeholder="server.example.com"
                />
              </div>
              <div>
                <Label>IP Address</Label>
                <Input 
                  value={newHost.ip}
                  onChange={(e) => setNewHost({...newHost, ip: e.target.value})}
                  placeholder="192.168.1.100"
                />
              </div>
            </div>
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

      {/* SSH Key Generation Dialog */}
      <Dialog open={showSSHKeyDialog} onOpenChange={setShowSSHKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate SSH Key</DialogTitle>
            <DialogDescription>
              Generate new SSH key pair for secure connections
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Key Name</Label>
              <Input placeholder="production-key" />
            </div>
            <div>
              <Label>Key Type</Label>
              <select className="w-full p-2 border rounded">
                <option value="rsa">RSA</option>
                <option value="ed25519">Ed25519</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSSHKeyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={generateSSHKey}>
                Generate Key
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}