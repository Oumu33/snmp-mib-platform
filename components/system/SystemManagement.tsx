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
  Users, 
  Shield, 
  Settings, 
  Database, 
  Activity, 
  FileText, 
  Download, 
  Upload,
  Key,
  Lock,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Calendar,
  Globe,
  Server,
  HardDrive,
  Cpu,
  Monitor,
  Wifi,
  Zap,
  Archive,
  History,
  Bell
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  status: 'active' | 'inactive' | 'locked';
  lastLogin: string;
  permissions: string[];
  createdAt: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: 'success' | 'warning' | 'error';
  ip: string;
  details: string;
}

interface SystemHealth {
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  lastCheck: string;
  metrics: {
    cpu?: number;
    memory?: number;
    disk?: number;
    connections?: number;
  };
}

export function SystemManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const users: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@company.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15 14:30:00',
      permissions: ['all'],
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      username: 'john.doe',
      email: 'john.doe@company.com',
      role: 'operator',
      status: 'active',
      lastLogin: '2024-01-15 13:45:00',
      permissions: ['view_devices', 'manage_alerts', 'deploy_configs'],
      createdAt: '2024-01-05'
    },
    {
      id: '3',
      username: 'jane.smith',
      email: 'jane.smith@company.com',
      role: 'viewer',
      status: 'active',
      lastLogin: '2024-01-15 12:20:00',
      permissions: ['view_devices', 'view_alerts'],
      createdAt: '2024-01-08'
    },
    {
      id: '4',
      username: 'bob.wilson',
      email: 'bob.wilson@company.com',
      role: 'operator',
      status: 'locked',
      lastLogin: '2024-01-14 16:30:00',
      permissions: ['view_devices', 'manage_alerts'],
      createdAt: '2024-01-03'
    }
  ];

  const auditLogs: LogEntry[] = [
    {
      id: '1',
      timestamp: '2024-01-15 14:30:00',
      user: 'admin',
      action: 'User Login',
      resource: 'Authentication',
      status: 'success',
      ip: '192.168.1.100',
      details: 'Successful login from web interface'
    },
    {
      id: '2',
      timestamp: '2024-01-15 14:25:00',
      user: 'john.doe',
      action: 'Deploy Configuration',
      resource: 'prometheus-config',
      status: 'success',
      ip: '192.168.1.101',
      details: 'Deployed Prometheus configuration to server-01'
    },
    {
      id: '3',
      timestamp: '2024-01-15 14:20:00',
      user: 'jane.smith',
      action: 'View Device',
      resource: 'Core-Router-01',
      status: 'success',
      ip: '192.168.1.102',
      details: 'Accessed device monitoring dashboard'
    },
    {
      id: '4',
      timestamp: '2024-01-15 14:15:00',
      user: 'bob.wilson',
      action: 'Failed Login',
      resource: 'Authentication',
      status: 'error',
      ip: '192.168.1.103',
      details: 'Failed login attempt - invalid password'
    },
    {
      id: '5',
      timestamp: '2024-01-15 14:10:00',
      user: 'admin',
      action: 'Create Alert Rule',
      resource: 'cpu-usage-alert',
      status: 'success',
      ip: '192.168.1.100',
      details: 'Created new alert rule for CPU usage monitoring'
    }
  ];

  const systemHealth: SystemHealth[] = [
    {
      component: 'Web Server',
      status: 'healthy',
      uptime: '45 days',
      lastCheck: '30 seconds ago',
      metrics: { cpu: 15, memory: 32, connections: 24 }
    },
    {
      component: 'Database',
      status: 'healthy',
      uptime: '45 days',
      lastCheck: '1 minute ago',
      metrics: { cpu: 8, memory: 45, disk: 67 }
    },
    {
      component: 'SNMP Service',
      status: 'warning',
      uptime: '12 days',
      lastCheck: '2 minutes ago',
      metrics: { cpu: 25, memory: 78, connections: 156 }
    },
    {
      component: 'Alert Manager',
      status: 'healthy',
      uptime: '30 days',
      lastCheck: '45 seconds ago',
      metrics: { cpu: 5, memory: 23, connections: 8 }
    },
    {
      component: 'Config Service',
      status: 'critical',
      uptime: '2 hours',
      lastCheck: '5 minutes ago',
      metrics: { cpu: 95, memory: 89, disk: 12 }
    }
  ];

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4 text-red-400" />;
      case 'operator': return <Settings className="h-4 w-4 text-blue-400" />;
      case 'viewer': return <Eye className="h-4 w-4 text-green-400" />;
      default: return <Users className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: User['status']) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'inactive': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'locked': return <Lock className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLogStatusIcon = (status: LogEntry['status']) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getHealthIcon = (status: SystemHealth['status']) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const activeUsers = users.filter(u => u.status === 'active').length;
  const lockedUsers = users.filter(u => u.status === 'locked').length;
  const totalLogs = auditLogs.length;
  const healthyComponents = systemHealth.filter(h => h.status === 'healthy').length;

  return (
    <div className="space-y-6">
      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Users</p>
                <p className="text-2xl font-bold text-green-400">{activeUsers}</p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Locked Users</p>
                <p className="text-2xl font-bold text-red-400">{lockedUsers}</p>
              </div>
              <Lock className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Audit Logs</p>
                <p className="text-2xl font-bold text-blue-400">{totalLogs}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">System Health</p>
                <p className="text-2xl font-bold text-green-400">{healthyComponents}/{systemHealth.length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="logs">
            <FileText className="h-4 w-4 mr-2" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="health">
            <Activity className="h-4 w-4 mr-2" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="backup">
            <Database className="h-4 w-4 mr-2" />
            Backup & Recovery
          </TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">User Management</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage user accounts, roles, and permissions
                  </CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search users by username or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="operator">Operator</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="border border-slate-600 hover:border-blue-500 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getRoleIcon(user.role)}
                      <div>
                        <h3 className="font-semibold text-white">{user.username}</h3>
                        <p className="text-sm text-slate-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(user.status)}
                      <Badge className={`${
                        user.role === 'admin' ? 'bg-red-600' :
                        user.role === 'operator' ? 'bg-blue-600' : 'bg-green-600'
                      } text-white`}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div><strong>Status:</strong> {user.status}</div>
                      <div><strong>Created:</strong> {user.createdAt}</div>
                      <div><strong>Last Login:</strong> {user.lastLogin}</div>
                      <div><strong>Permissions:</strong> {user.permissions.length}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {user.permissions.slice(0, 3).map((permission, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                        {permission}
                      </Badge>
                    ))}
                    {user.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                        +{user.permissions.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className={`border-slate-600 ${
                      user.status === 'active' ? 'text-green-400' :
                      user.status === 'locked' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {user.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Password Policy</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-slate-400">Minimum 8 characters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm text-slate-400">Require special characters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <span className="text-sm text-slate-400">Two-factor authentication</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Session Settings</Label>
                  <Input 
                    placeholder="Session timeout (minutes)"
                    defaultValue="30"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Login Attempts</Label>
                  <Input 
                    placeholder="Max failed attempts"
                    defaultValue="5"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Update Security Settings
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  API Keys
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border border-slate-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">Monitoring API</span>
                      <Badge className="bg-green-600 text-white">Active</Badge>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">sk_live_51H...7Qm2</p>
                    <p className="text-xs text-slate-500">Created: 2024-01-10</p>
                  </div>
                  
                  <div className="p-3 border border-slate-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">Config API</span>
                      <Badge variant="outline" className="border-slate-600 text-slate-400">Inactive</Badge>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">sk_test_4e...9Kl1</p>
                    <p className="text-xs text-slate-500">Created: 2024-01-08</p>
                  </div>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New API Key
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Audit Logs
              </CardTitle>
              <CardDescription className="text-slate-400">
                System activity and security audit trail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getLogStatusIcon(log.status)}
                        <div>
                          <h4 className="font-semibold text-white">{log.action}</h4>
                          <p className="text-sm text-slate-400">{log.resource}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-300">{log.timestamp}</p>
                        <p className="text-xs text-slate-500">{log.ip}</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-2">{log.details}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                          {log.user}
                        </Badge>
                        <Badge className={`text-xs ${
                          log.status === 'success' ? 'bg-green-600' :
                          log.status === 'warning' ? 'bg-yellow-600' : 'bg-red-600'
                        } text-white`}>
                          {log.status}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="health" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                System Health Monitor
              </CardTitle>
              <CardDescription className="text-slate-400">
                Monitor system components and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemHealth.map((component, index) => (
                  <div key={index} className="p-4 border border-slate-600 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getHealthIcon(component.status)}
                        <div>
                          <h3 className="font-semibold text-white">{component.component}</h3>
                          <p className="text-sm text-slate-400">Uptime: {component.uptime}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${
                          component.status === 'healthy' ? 'bg-green-600' :
                          component.status === 'warning' ? 'bg-yellow-600' : 'bg-red-600'
                        } text-white`}>
                          {component.status}
                        </Badge>
                        <p className="text-xs text-slate-500 mt-1">{component.lastCheck}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {component.metrics.cpu !== undefined && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400 flex items-center">
                              <Cpu className="h-3 w-3 mr-1" />
                              CPU
                            </span>
                            <span className="text-white">{component.metrics.cpu}%</span>
                          </div>
                          <Progress value={component.metrics.cpu} className="h-2" />
                        </div>
                      )}
                      
                      {component.metrics.memory !== undefined && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400 flex items-center">
                              <Monitor className="h-3 w-3 mr-1" />
                              Memory
                            </span>
                            <span className="text-white">{component.metrics.memory}%</span>
                          </div>
                          <Progress value={component.metrics.memory} className="h-2" />
                        </div>
                      )}
                      
                      {component.metrics.disk !== undefined && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400 flex items-center">
                              <HardDrive className="h-3 w-3 mr-1" />
                              Disk
                            </span>
                            <span className="text-white">{component.metrics.disk}%</span>
                          </div>
                          <Progress value={component.metrics.disk} className="h-2" />
                        </div>
                      )}
                      
                      {component.metrics.connections !== undefined && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400 flex items-center">
                              <Wifi className="h-3 w-3 mr-1" />
                              Connections
                            </span>
                            <span className="text-white">{component.metrics.connections}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Recovery Tab */}
        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Backup Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border border-slate-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">Daily Backup</span>
                      <Badge className="bg-green-600 text-white">Enabled</Badge>
                    </div>
                    <p className="text-xs text-slate-400">Last backup: 2024-01-15 02:00:00</p>
                    <p className="text-xs text-slate-500">Size: 245 MB</p>
                  </div>
                  
                  <div className="p-3 border border-slate-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">Weekly Backup</span>
                      <Badge className="bg-green-600 text-white">Enabled</Badge>
                    </div>
                    <p className="text-xs text-slate-400">Last backup: 2024-01-14 02:00:00</p>
                    <p className="text-xs text-slate-500">Size: 1.2 GB</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Download className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>
                  <Button variant="outline" className="border-slate-600 text-slate-300">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Recovery Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border border-slate-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">System Restore</span>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        Restore
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400">Restore from latest backup</p>
                  </div>
                  
                  <div className="p-3 border border-slate-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">Configuration Reset</span>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        Reset
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400">Reset to factory defaults</p>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-400">Warning</span>
                  </div>
                  <p className="text-xs text-slate-300">Recovery operations will temporarily interrupt service</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}