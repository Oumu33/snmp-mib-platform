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

  // 从后端API获取主机数据
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
      setError('无法获取主机数据。请检查网络连接或联系管理员。');
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

      // 扫描完成后刷新主机列表
      setTimeout(() => {
        fetchHosts();
        setIsScanning(false);
      }, 3000);
    } catch (err) {
      console.error('Error during network scan:', err);
      setError('网络扫描失败。请检查网络范围设置。');
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
              message: '正在测试连接...', 
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
                message: result.message || (response.ok ? '连接成功' : '连接失败'), 
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
                message: '连接测试失败', 
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
        setError(error.message || '添加主机失败');
      }
    } catch (err) {
      console.error('Error adding host:', err);
      setError('添加主机时发生错误');
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
        setError('删除主机失败');
      }
    } catch (err) {
      console.error('Error deleting host:', err);
      setError('删除主机时发生错误');
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
        setError('生成SSH密钥失败');
      }
    } catch (err) {
      console.error('Error generating SSH key:', err);
      setError('生成SSH密钥时发生错误');
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
                <p className="text-sm text-slate-400">已连接主机</p>
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
                <p className="text-sm text-slate-400">总主机数</p>
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
                <p className="text-sm text-slate-400">已安装组件</p>
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
                <p className="text-sm text-slate-400">SSH密钥</p>
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
              关闭
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="discovery">
            <Search className="h-4 w-4 mr-2" />
            主机发现
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Plus className="h-4 w-4 mr-2" />
            手动添加
          </TabsTrigger>
          <TabsTrigger value="ssh">
            <Key className="h-4 w-4 mr-2" />
            SSH管理
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <Monitor className="h-4 w-4 mr-2" />
            主机监控
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
                    网络发现
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    自动发现网络中的主机
                  </CardDescription>
                </div>
                <Button onClick={fetchHosts} variant="outline" className="border-slate-600 text-slate-300">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新列表
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <Label htmlFor="scan-range" className="text-slate-300">网络范围</Label>
                  <Input 
                    id="scan-range"
                    value={scanRange}
                    onChange={(e) => setScanRange(e.target.value)}
                    placeholder="192.168.1.0/24"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">扫描选项</Label>
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
                      扫描中...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      开始扫描
                    </>
                  )}
                </Button>
              </div>
              
              {isScanning && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">正在扫描网络范围...</span>
                    <span className="text-slate-400">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-slate-500 mt-1">发现 {hosts.length} 台主机，正在检查服务...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Discovered Hosts */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">发现的主机</CardTitle>
                  <CardDescription className="text-slate-400">
                    选择主机进行组件安装和管理
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddHost(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  手动添加
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-400 mr-2" />
                  <span className="text-slate-400">正在加载主机数据...</span>
                </div>
              ) : hosts.length === 0 ? (
                <div className="text-center py-8">
                  <Server className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">没有发现主机</h3>
                  <p className="text-slate-400 mb-4">
                    请尝试网络扫描或手动添加主机。
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button onClick={startScan} className="bg-blue-600 hover:bg-blue-700">
                      <Search className="h-4 w-4 mr-2" />
                      开始扫描
                    </Button>
                    <Button onClick={() => setShowAddHost(true)} variant="outline" className="border-slate-600 text-slate-300">
                      <Plus className="h-4 w-4 mr-2" />
                      手动添加
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
                            {host.status === 'connected' ? '已连接' : 
                             host.status === 'connecting' ? '连接中' :
                             host.status === 'error' ? '连接失败' : '未连接'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                          <div><strong>系统:</strong> {host.os}</div>
                          <div><strong>架构:</strong> {host.architecture}</div>
                          <div><strong>用户:</strong> {host.username}</div>
                          <div><strong>认证:</strong> {host.authMethod === 'key' ? 'SSH密钥' : '密码'}</div>
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
                              内存
                            </span>
                            <span className="text-white">{host.resources.memory}%</span>
                          </div>
                          <Progress value={host.resources.memory} className="h-1" />
                          
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400 flex items-center">
                              <HardDrive className="h-3 w-3 mr-1" />
                              磁盘
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
                        <span>组件: {host.installedComponents.length}</span>
                        <span>最后连接: {host.lastSeen}</span>
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
              <CardTitle className="text-white">手动添加主机</CardTitle>
              <CardDescription className="text-slate-400">
                手动指定主机详细信息进行管理
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hostname" className="text-slate-300">主机名</Label>
                  <Input 
                    id="hostname"
                    value={newHost.hostname}
                    onChange={(e) => setNewHost({...newHost, hostname: e.target.value})}
                    placeholder="server.example.com"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="ip-address" className="text-slate-300">IP地址</Label>
                  <Input 
                    id="ip-address"
                    value={newHost.ip}
                    onChange={(e) => setNewHost({...newHost, ip: e.target.value})}
                    placeholder="192.168.1.100"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="ssh-port" className="text-slate-300">SSH端口</Label>
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
                  <Label htmlFor="username" className="text-slate-300">用户名</Label>
                  <Input 
                    id="username"
                    value={newHost.username}
                    onChange={(e) => setNewHost({...newHost, username: e.target.value})}
                    placeholder="root"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="auth-method" className="text-slate-300">认证方式</Label>
                  <select 
                    id="auth-method"
                    value={newHost.authMethod}
                    onChange={(e) => setNewHost({...newHost, authMethod: e.target.value as 'password' | 'key'})}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="password">密码</option>
                    <option value="key">SSH密钥</option>
                  </select>
                </div>
                {newHost.authMethod === 'password' ? (
                  <div>
                    <Label htmlFor="password" className="text-slate-300">密码</Label>
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
                    <Label htmlFor="ssh-key" className="text-slate-300">SSH密钥</Label>
                    <select 
                      id="ssh-key"
                      value={newHost.sshKeyId}
                      onChange={(e) => setNewHost({...newHost, sshKeyId: e.target.value})}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="">选择SSH密钥</option>
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
                    // 测试连接逻辑
                  }}
                >
                  <Target className="h-4 w-4 mr-2" />
                  测试连接
                </Button>
                <Button onClick={addHost} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  添加主机
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
                    SSH密钥管理
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    管理SSH密钥以实现安全的主机连接
                  </CardDescription>
                </div>
                <Button onClick={() => setShowSSHKeyDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  生成密钥
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sshKeys.length === 0 ? (
                <div className="text-center py-8">
                  <Key className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">没有SSH密钥</h3>
                  <p className="text-slate-400 mb-4">
                    生成SSH密钥以实现安全的主机连接。
                  </p>
                  <Button onClick={() => setShowSSHKeyDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    生成第一个密钥
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
                            {key.status === 'active' ? '活跃' : '非活跃'}
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
                        <span>使用主机: {key.usedByHosts.length}</span>
                        <span>创建时间: {key.createdAt}</span>
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
                主机性能监控
              </CardTitle>
              <CardDescription className="text-slate-400">
                实时主机资源监控和告警
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
                        <Badge className="bg-green-600 text-white">在线</Badge>
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
                            CPU使用率
                          </span>
                          <span className="text-white font-semibold">{host.resources.cpu}%</span>
                        </div>
                        <Progress value={host.resources.cpu} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 flex items-center">
                            <Monitor className="h-4 w-4 mr-1" />
                            内存
                          </span>
                          <span className="text-white font-semibold">{host.resources.memory}%</span>
                        </div>
                        <Progress value={host.resources.memory} className="h-3" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 flex items-center">
                            <HardDrive className="h-4 w-4 mr-1" />
                            磁盘使用率
                          </span>
                          <span className="text-white font-semibold">{host.resources.disk}%</span>
                        </div>
                        <Progress value={host.resources.disk} className="h-3" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700">
                      <div className="flex space-x-4 text-xs text-slate-500">
                        <span>运行时间: 45天</span>
                        <span>负载: 0.8, 0.6, 0.4</span>
                        <span>组件: {host.installedComponents.length}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                          <Terminal className="h-3 w-3 mr-1" />
                          SSH
                        </Button>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                          <Activity className="h-3 w-3 mr-1" />
                          指标
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
            <DialogTitle>添加新主机</DialogTitle>
            <DialogDescription>
              配置新主机的连接信息
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>主机名</Label>
                <Input 
                  value={newHost.hostname}
                  onChange={(e) => setNewHost({...newHost, hostname: e.target.value})}
                  placeholder="server.example.com"
                />
              </div>
              <div>
                <Label>IP地址</Label>
                <Input 
                  value={newHost.ip}
                  onChange={(e) => setNewHost({...newHost, ip: e.target.value})}
                  placeholder="192.168.1.100"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddHost(false)}>
                取消
              </Button>
              <Button onClick={addHost}>
                添加主机
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SSH Key Generation Dialog */}
      <Dialog open={showSSHKeyDialog} onOpenChange={setShowSSHKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>生成SSH密钥</DialogTitle>
            <DialogDescription>
              生成新的SSH密钥对用于安全连接
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>密钥名称</Label>
              <Input placeholder="production-key" />
            </div>
            <div>
              <Label>密钥类型</Label>
              <select className="w-full p-2 border rounded">
                <option value="rsa">RSA</option>
                <option value="ed25519">Ed25519</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSSHKeyDialog(false)}>
                取消
              </Button>
              <Button onClick={generateSSHKey}>
                生成密钥
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}