'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Settings, 
  Plus, 
  Search, 
  Filter,
  Mail,
  MessageSquare,
  Webhook,
  Smartphone,
  Volume2,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  Target,
  Zap,
  Activity,
  TrendingUp,
  BarChart3,
  Users,
  Calendar,
  RefreshCw
} from 'lucide-react';

interface Alert {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'resolved' | 'silenced';
  source: string;
  metric: string;
  threshold: string;
  currentValue: string;
  triggeredAt: string;
  duration: string;
  assignee?: string;
  tags: string[];
}

interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  condition: string;
  threshold: number;
  severity: 'critical' | 'warning' | 'info';
  enabled: boolean;
  targets: string[];
  notifications: string[];
  evaluationInterval: string;
  forDuration: string;
  createdAt: string;
}

export function AlertManager() {
  const [activeTab, setActiveTab] = useState('alerts');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const alerts: Alert[] = [
    {
      id: '1',
      name: 'High CPU Usage',
      description: 'CPU usage exceeded 80% threshold on DB-Server-01',
      severity: 'critical',
      status: 'active',
      source: 'DB-Server-01',
      metric: 'cpu_usage_percent',
      threshold: '> 80%',
      currentValue: '87%',
      triggeredAt: '2024-01-15 14:30:00',
      duration: '15 minutes',
      assignee: 'John Doe',
      tags: ['server', 'performance', 'database']
    },
    {
      id: '2',
      name: 'Interface Down',
      description: 'Network interface eth0 is down on Core-Router-01',
      severity: 'critical',
      status: 'active',
      source: 'Core-Router-01',
      metric: 'interface_status',
      threshold: '== down',
      currentValue: 'down',
      triggeredAt: '2024-01-15 14:25:00',
      duration: '20 minutes',
      tags: ['network', 'interface', 'connectivity']
    },
    {
      id: '3',
      name: 'Memory Usage Warning',
      description: 'Memory usage is approaching threshold on Access-Switch-01',
      severity: 'warning',
      status: 'active',
      source: 'Access-Switch-01',
      metric: 'memory_usage_percent',
      threshold: '> 70%',
      currentValue: '75%',
      triggeredAt: '2024-01-15 14:20:00',
      duration: '25 minutes',
      assignee: 'Jane Smith',
      tags: ['switch', 'memory', 'performance']
    },
    {
      id: '4',
      name: 'Disk Space Low',
      description: 'Disk space is running low on backup server',
      severity: 'warning',
      status: 'resolved',
      source: 'Backup-Server-01',
      metric: 'disk_usage_percent',
      threshold: '> 85%',
      currentValue: '78%',
      triggeredAt: '2024-01-15 13:45:00',
      duration: '2 hours',
      tags: ['server', 'storage', 'backup']
    },
    {
      id: '5',
      name: 'SNMP Timeout',
      description: 'SNMP polling timeout on UPS device',
      severity: 'info',
      status: 'silenced',
      source: 'UPS-Main',
      metric: 'snmp_response_time',
      threshold: '> 5s',
      currentValue: '8s',
      triggeredAt: '2024-01-15 13:30:00',
      duration: '3 hours',
      tags: ['ups', 'snmp', 'timeout']
    }
  ];

  const alertRules: AlertRule[] = [
    {
      id: '1',
      name: 'CPU Usage Critical',
      description: 'Alert when CPU usage exceeds 80%',
      metric: 'cpu_usage_percent',
      condition: '>',
      threshold: 80,
      severity: 'critical',
      enabled: true,
      targets: ['servers', 'routers'],
      notifications: ['email', 'slack'],
      evaluationInterval: '1m',
      forDuration: '5m',
      createdAt: '2024-01-10'
    },
    {
      id: '2',
      name: 'Memory Usage Warning',
      description: 'Alert when memory usage exceeds 70%',
      metric: 'memory_usage_percent',
      condition: '>',
      threshold: 70,
      severity: 'warning',
      enabled: true,
      targets: ['servers', 'switches'],
      notifications: ['email'],
      evaluationInterval: '2m',
      forDuration: '10m',
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      name: 'Interface Down',
      description: 'Alert when network interface goes down',
      metric: 'interface_status',
      condition: '==',
      threshold: 0,
      severity: 'critical',
      enabled: true,
      targets: ['routers', 'switches'],
      notifications: ['email', 'sms', 'webhook'],
      evaluationInterval: '30s',
      forDuration: '1m',
      createdAt: '2024-01-09'
    },
    {
      id: '4',
      name: 'Disk Space Low',
      description: 'Alert when disk usage exceeds 85%',
      metric: 'disk_usage_percent',
      condition: '>',
      threshold: 85,
      severity: 'warning',
      enabled: false,
      targets: ['servers'],
      notifications: ['email'],
      evaluationInterval: '5m',
      forDuration: '15m',
      createdAt: '2024-01-08'
    }
  ];

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default: return <Bell className="h-4 w-4 text-blue-400" />;
    }
  };

  const getStatusIcon = (status: Alert['status']) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4 text-red-400" />;
      case 'resolved': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      default: return <Pause className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'warning': return 'border-yellow-500 bg-yellow-500/10';
      default: return 'border-blue-500 bg-blue-500/10';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  const activeAlerts = alerts.filter(a => a.status === 'active').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const warningAlerts = alerts.filter(a => a.severity === 'warning' && a.status === 'active').length;
  const resolvedToday = alerts.filter(a => a.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Alerts</p>
                <p className="text-2xl font-bold text-red-400">{activeAlerts}</p>
              </div>
              <Activity className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Critical</p>
                <p className="text-2xl font-bold text-red-400">{criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Warnings</p>
                <p className="text-2xl font-bold text-yellow-400">{warningAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Resolved Today</p>
                <p className="text-2xl font-bold text-green-400">{resolvedToday}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="alerts">
            <Bell className="h-4 w-4 mr-2" />
            Active Alerts
          </TabsTrigger>
          <TabsTrigger value="rules">
            <Settings className="h-4 w-4 mr-2" />
            Alert Rules
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Mail className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Active Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          {/* Search and Filter */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Alert Management</CardTitle>
              <CardDescription className="text-slate-400">
                Monitor and manage system alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search alerts by name, source, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="all">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`border transition-all hover:shadow-lg ${getSeverityColor(alert.severity)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getSeverityIcon(alert.severity)}
                      <div>
                        <h3 className="font-semibold text-white text-lg">{alert.name}</h3>
                        <p className="text-sm text-slate-400">{alert.source}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(alert.status)}
                      <Badge className={`${
                        alert.severity === 'critical' ? 'bg-red-600' :
                        alert.severity === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
                      } text-white`}>
                        {alert.severity}
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {alert.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 mb-4">{alert.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Metric</p>
                      <p className="text-sm text-white">{alert.metric}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Threshold</p>
                      <p className="text-sm text-white">{alert.threshold}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Current Value</p>
                      <p className="text-sm text-white font-semibold">{alert.currentValue}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {alert.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-slate-500">
                      <p>Triggered: {alert.triggeredAt}</p>
                      <p>Duration: {alert.duration}</p>
                      {alert.assignee && <p>Assignee: {alert.assignee}</p>}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      {alert.status === 'active' && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Resolve
                          </Button>
                          <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-400">
                            <Pause className="h-3 w-3 mr-1" />
                            Silence
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Alert Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Alert Rules</CardTitle>
                  <CardDescription className="text-slate-400">
                    Configure and manage alert rules and thresholds
                  </CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <div key={rule.id} className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        <div>
                          <h3 className="font-semibold text-white">{rule.name}</h3>
                          <p className="text-sm text-slate-400">{rule.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${
                          rule.severity === 'critical' ? 'bg-red-600' :
                          rule.severity === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
                        } text-white`}>
                          {rule.severity}
                        </Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {rule.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-slate-500">Metric</p>
                        <p className="text-white">{rule.metric}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Condition</p>
                        <p className="text-white">{rule.condition} {rule.threshold}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Evaluation</p>
                        <p className="text-white">Every {rule.evaluationInterval}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">For Duration</p>
                        <p className="text-white">{rule.forDuration}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {rule.targets.map((target, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                            {target}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          {rule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Notification Channels
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure notification methods and recipients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-600 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Mail className="h-8 w-8 text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-white">Email</h3>
                      <p className="text-sm text-slate-400">SMTP notifications</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-300">Server: smtp.company.com</p>
                    <p className="text-slate-300">Recipients: 3 configured</p>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                </div>
                
                <div className="p-4 border border-slate-600 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <MessageSquare className="h-8 w-8 text-green-400" />
                    <div>
                      <h3 className="font-semibold text-white">Slack</h3>
                      <p className="text-sm text-slate-400">Team messaging</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-300">Channel: #alerts</p>
                    <p className="text-slate-300">Webhook configured</p>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                </div>
                
                <div className="p-4 border border-slate-600 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Smartphone className="h-8 w-8 text-purple-400" />
                    <div>
                      <h3 className="font-semibold text-white">SMS</h3>
                      <p className="text-sm text-slate-400">Text messages</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-300">Provider: Twilio</p>
                    <p className="text-slate-300">Numbers: 2 configured</p>
                    <Badge variant="outline" className="border-slate-600 text-slate-400">Inactive</Badge>
                  </div>
                </div>
                
                <div className="p-4 border border-slate-600 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Webhook className="h-8 w-8 text-orange-400" />
                    <div>
                      <h3 className="font-semibold text-white">Webhook</h3>
                      <p className="text-sm text-slate-400">Custom integrations</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-300">Endpoints: 1 configured</p>
                    <p className="text-slate-300">Format: JSON</p>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Alert History
              </CardTitle>
              <CardDescription className="text-slate-400">
                View historical alert data and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                      <span className="text-sm text-slate-400">Alerts This Week</span>
                    </div>
                    <p className="text-2xl font-bold text-white">47</p>
                    <p className="text-xs text-green-400">-12% from last week</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                      <span className="text-sm text-slate-400">Avg Resolution Time</span>
                    </div>
                    <p className="text-2xl font-bold text-white">23m</p>
                    <p className="text-xs text-blue-400">+5m from last week</p>
                  </div>
                  
                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-purple-400" />
                      <span className="text-sm text-slate-400">Resolution Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-white">94%</p>
                    <p className="text-xs text-green-400">+2% from last week</p>
                  </div>
                </div>
                
                <div className="border border-slate-600 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-4">Recent Alert Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-3">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <div>
                          <p className="text-sm text-white">High CPU Usage resolved</p>
                          <p className="text-xs text-slate-400">DB-Server-01 • 2 hours ago</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white">Resolved</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <div>
                          <p className="text-sm text-white">Interface Down triggered</p>
                          <p className="text-xs text-slate-400">Core-Router-01 • 3 hours ago</p>
                        </div>
                      </div>
                      <Badge className="bg-red-600 text-white">Critical</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded">
                      <div className="flex items-center space-x-3">
                        <Pause className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-white">SNMP Timeout silenced</p>
                          <p className="text-xs text-slate-400">UPS-Main • 4 hours ago</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="border-slate-600 text-slate-400">Silenced</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}