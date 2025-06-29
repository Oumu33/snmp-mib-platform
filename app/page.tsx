'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Gauge,
  User,
  Lock,
  Key,
  Palette,
  Moon,
  Sun,
  Languages,
  HelpCircle,
  LogOut,
  Save,
  Info,
  Loader2
} from 'lucide-react';
import ComponentInstaller from '@/components/monitoring/ComponentInstaller';
import { HostSelection } from '@/components/monitoring/HostSelection';
import { MIBManager } from '@/components/mib/MIBManager';
import { DeviceMonitoring } from '@/components/monitoring/DeviceMonitoring';
import { AlertManager } from '@/components/alerts/AlertManager';
import ConfigGenerator from '@/components/config/ConfigGenerator';
import { SystemManagement } from '@/components/system/SystemManagement';
import { RealTimeDashboard } from '@/components/dashboard/RealTimeDashboard';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
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

  // Settings state with backend integration
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'en',
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30,
    compactMode: false,
    showTooltips: true,
    enableSounds: false
  });

  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Load settings from backend on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/v1/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const handleSettingsSave = async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    
    try {
      const response = await fetch('/api/v1/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setShowSettings(false);
        
        // Apply theme changes immediately
        if (settings.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (settings.theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          // Auto theme - check system preference
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        
        // Show success message
        alert('Settings saved successfully!');
      } else {
        const error = await response.json();
        setSettingsError(error.message || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setSettingsError('Error occurred while saving settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const quickActions = [
    { 
      title: 'Install Components', 
      description: 'Deploy monitoring components',
      icon: Download,
      action: () => setActiveTab('installer'),
      color: 'bg-blue-600'
    },
    { 
      title: 'Upload MIB Files', 
      description: 'Manage MIB file library',
      icon: Upload,
      action: () => setActiveTab('mib'),
      color: 'bg-green-600'
    },
    { 
      title: 'Add Device', 
      description: 'Register new network device',
      icon: Router,
      action: () => setActiveTab('monitoring'),
      color: 'bg-purple-600'
    },
    { 
      title: 'Create Alert', 
      description: 'Configure monitoring alerts',
      icon: Bell,
      action: () => setActiveTab('alerts'),
      color: 'bg-orange-600'
    }
  ];

  const recentActivities = [
    { 
      action: 'Grafana v11.3.0 deployed successfully on server-01', 
      timestamp: '2 minutes ago', 
      status: 'success',
      type: 'deployment'
    },
    { 
      action: 'Node Exporter v1.8.2 configuration updated', 
      timestamp: '5 minutes ago', 
      status: 'info',
      type: 'config'
    },
    { 
      action: 'SNMP device 192.168.1.1 discovered', 
      timestamp: '8 minutes ago', 
      status: 'success',
      type: 'discovery'
    },
    { 
      action: 'Alert rule created for CPU threshold', 
      timestamp: '12 minutes ago', 
      status: 'info',
      type: 'alert'
    },
    { 
      action: 'MIB file cisco-switch.mib uploaded', 
      timestamp: '15 minutes ago', 
      status: 'success',
      type: 'mib'
    },
    { 
      action: 'VictoriaMetrics v1.97.1 cluster scaled up', 
      timestamp: '20 minutes ago', 
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
                <p className="text-sm text-slate-400">Enterprise Network Monitoring Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-400 border-green-400 animate-pulse">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                System Healthy
              </Badge>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Globe className="h-4 w-4" />
                <span>24 Devices Online</span>
              </div>
              
              {/* Enhanced Settings Dialog */}
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      System Settings
                    </DialogTitle>
                    <DialogDescription>
                      Configure your monitoring platform preferences and system settings
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-8 py-6">
                    {settingsError && (
                      <Alert className="border-red-500 bg-red-500/10">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="text-red-400">
                          {settingsError}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Appearance Settings */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Appearance & Interface
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-slate-300">Theme Preference</Label>
                          <select 
                            value={settings.theme}
                            onChange={(e) => setSettings({...settings, theme: e.target.value})}
                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                          >
                            <option value="dark">Dark Theme</option>
                            <option value="light">Light Theme</option>
                            <option value="auto">Auto (System)</option>
                          </select>
                          <p className="text-xs text-slate-500">Choose your preferred color scheme</p>
                        </div>
                        
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-slate-300">Language</Label>
                          <select 
                            value={settings.language}
                            onChange={(e) => setSettings({...settings, language: e.target.value})}
                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                          >
                            <option value="en">English</option>
                            <option value="zh">中文 (Chinese)</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                            <option value="ja">日本語</option>
                          </select>
                          <p className="text-xs text-slate-500">Select your preferred language</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                          <div>
                            <Label className="text-sm font-medium text-slate-300">Compact Mode</Label>
                            <p className="text-xs text-slate-500">Reduce spacing and padding</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={settings.compactMode}
                            onChange={(e) => setSettings({...settings, compactMode: e.target.checked})}
                            className="rounded"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                          <div>
                            <Label className="text-sm font-medium text-slate-300">Show Tooltips</Label>
                            <p className="text-xs text-slate-500">Display helpful tooltips</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={settings.showTooltips}
                            onChange={(e) => setSettings({...settings, showTooltips: e.target.checked})}
                            className="rounded"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notifications Settings */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications & Alerts
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                          <div>
                            <Label className="text-sm font-medium text-slate-300">Enable Notifications</Label>
                            <p className="text-xs text-slate-500">Receive system notifications</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={settings.notifications}
                            onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                            className="rounded"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                          <div>
                            <Label className="text-sm font-medium text-slate-300">Sound Alerts</Label>
                            <p className="text-xs text-slate-500">Play sounds for alerts</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={settings.enableSounds}
                            onChange={(e) => setSettings({...settings, enableSounds: e.target.checked})}
                            className="rounded"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Performance Settings */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Performance & Data
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                          <div>
                            <Label className="text-sm font-medium text-slate-300">Auto Refresh</Label>
                            <p className="text-xs text-slate-500">Automatically refresh data</p>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={settings.autoRefresh}
                            onChange={(e) => setSettings({...settings, autoRefresh: e.target.checked})}
                            className="rounded"
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-slate-300">Refresh Interval</Label>
                          <select 
                            value={settings.refreshInterval}
                            onChange={(e) => setSettings({...settings, refreshInterval: Number(e.target.value)})}
                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                            disabled={!settings.autoRefresh}
                          >
                            <option value={5}>5 seconds</option>
                            <option value={10}>10 seconds</option>
                            <option value={30}>30 seconds</option>
                            <option value={60}>1 minute</option>
                            <option value={300}>5 minutes</option>
                          </select>
                          <p className="text-xs text-slate-500">How often to refresh dashboard data</p>
                        </div>
                      </div>
                    </div>

                    {/* Security Settings */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Security & Access
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full border-slate-600 text-slate-300 justify-start">
                          <Key className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                        
                        <Button variant="outline" className="w-full border-slate-600 text-slate-300 justify-start">
                          <Lock className="h-4 w-4 mr-2" />
                          Two-Factor Authentication
                        </Button>
                        
                        <Button variant="outline" className="w-full border-slate-600 text-slate-300 justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          Session Management
                        </Button>
                        
                        <Button variant="outline" className="w-full border-red-600 text-red-400 justify-start">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out All Sessions
                        </Button>
                      </div>
                    </div>

                    {/* System Information */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        System Information
                      </h3>
                      
                      <div className="bg-slate-700/50 rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Platform Version:</span>
                              <span className="text-white font-semibold">v2.1.0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Build Date:</span>
                              <span className="text-white">2025-01-15</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">License Type:</span>
                              <span className="text-white">Enterprise</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">API Version:</span>
                              <span className="text-white">v1</span>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Support Status:</span>
                              <Badge className="bg-green-600 text-white">Active</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Last Update:</span>
                              <span className="text-white">2025-01-15</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Database:</span>
                              <span className="text-white">SQLite</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Backend:</span>
                              <span className="text-white">Go 1.21+</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Settings */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Advanced Configuration
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="w-full border-slate-600 text-slate-300 justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          Export Settings
                        </Button>
                        
                        <Button variant="outline" className="w-full border-slate-600 text-slate-300 justify-start">
                          <Upload className="h-4 w-4 mr-2" />
                          Import Settings
                        </Button>
                        
                        <Button variant="outline" className="w-full border-slate-600 text-slate-300 justify-start">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reset to Defaults
                        </Button>
                        
                        <Button variant="outline" className="w-full border-slate-600 text-slate-300 justify-start">
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Help & Documentation
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
                    <Button variant="outline" onClick={() => setShowSettings(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSettingsSave} 
                      disabled={settingsLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {settingsLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Settings
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="installer" className="data-[state=active]:bg-blue-600">
              <Download className="h-4 w-4 mr-2" />
              Installer
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-600">
              <Eye className="h-4 w-4 mr-2" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="mib" className="data-[state=active]:bg-blue-600">
              <FileText className="h-4 w-4 mr-2" />
              MIB Manager
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="config" className="data-[state=active]:bg-blue-600">
              <Settings className="h-4 w-4 mr-2" />
              Config Gen
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-blue-600">
              <Shield className="h-4 w-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="realtime" className="data-[state=active]:bg-blue-600">
              <Activity className="h-4 w-4 mr-2" />
              Real-time
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
                      <p className="text-sm text-slate-400">Active Devices</p>
                      <p className="text-3xl font-bold text-white">{systemStats.activeDevices}</p>
                      <p className="text-xs text-green-400 mt-1">+2 from yesterday</p>
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
                      <p className="text-sm text-slate-400">Components</p>
                      <p className="text-3xl font-bold text-white">{systemStats.installedComponents}</p>
                      <p className="text-xs text-green-400 mt-1">All running</p>
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
                      <p className="text-sm text-slate-400">Active Alerts</p>
                      <p className="text-3xl font-bold text-white">{systemStats.activeAlerts}</p>
                      <p className="text-xs text-yellow-400 mt-1">2 critical</p>
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
                      <p className="text-sm text-slate-400">System Uptime</p>
                      <p className="text-3xl font-bold text-white">{systemStats.systemUptime}%</p>
                      <p className="text-xs text-green-400 mt-1">30 days</p>
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
                      Quick Actions
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Common tasks and operations
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
                      System Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 flex items-center">
                            <Cpu className="h-4 w-4 mr-1" />
                            CPU Usage
                          </span>
                          <span className="text-white font-semibold">{systemStats.cpuUsage}%</span>
                        </div>
                        <Progress value={systemStats.cpuUsage} className="h-3" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 flex items-center">
                            <Monitor className="h-4 w-4 mr-1" />
                            Memory
                          </span>
                          <span className="text-white font-semibold">{systemStats.memoryUsage}%</span>
                        </div>
                        <Progress value={systemStats.memoryUsage} className="h-3" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 flex items-center">
                            <HardDrive className="h-4 w-4 mr-1" />
                            Disk Usage
                          </span>
                          <span className="text-white font-semibold">{systemStats.diskUsage}%</span>
                        </div>
                        <Progress value={systemStats.diskUsage} className="h-3" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 flex items-center">
                            <Wifi className="h-4 w-4 mr-1" />
                            Network
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
                      Recent Activity
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