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
  Settings, 
  FileCode, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  RefreshCw,
  Target,
  Layers,
  Database,
  Activity,
  Zap,
  GitBranch,
  History,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Server,
  Monitor,
  Network,
  Cpu,
  HardDrive,
  Wifi,
  Globe,
  Search,
  Filter,
  LineChart,
  BarChart3,
  PieChart,
  Gauge,
  TrendingUp,
  Router,
  Shield,
  TestTube,
  Beaker,
  FlaskConical,
  Microscope,
  Stethoscope,
  Radar,
  Crosshair,
  MousePointer,
  Hand,
  Sparkles
} from 'lucide-react';

interface ConfigTemplate {
  id: string;
  name: string;
  type: 'prometheus' | 'grafana' | 'victoriametrics' | 'alertmanager' | 'snmp';
  description: string;
  version: string;
  targets: string[];
  lastModified: string;
  status: 'active' | 'draft' | 'deprecated';
  deployments: number;
  testStatus?: 'passed' | 'failed' | 'testing' | 'not-tested';
  metricsEndpoint?: string;
}

interface Deployment {
  id: string;
  configId: string;
  target: string;
  status: 'deployed' | 'deploying' | 'failed' | 'pending';
  deployedAt: string;
  version: string;
  health: 'healthy' | 'warning' | 'error';
  testResults?: TestResult[];
}

interface TestResult {
  id: string;
  type: 'connection' | 'config' | 'metrics' | 'data';
  name: string;
  status: 'passed' | 'failed' | 'testing';
  message: string;
  timestamp: string;
  duration?: string;
  details?: any;
}

interface MetricDefinition {
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  description: string;
  labels: string[];
  unit?: string;
  help: string;
  example: string;
}

interface DeviceMetrics {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  metrics: MetricDefinition[];
  endpoints: string[];
}

export function ConfigGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');
  const [testingConfig, setTestingConfig] = useState<string | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [configContent, setConfigContent] = useState('');

  const configTemplates: ConfigTemplate[] = [
    {
      id: '1',
      name: 'Prometheus Server Config',
      type: 'prometheus',
      description: 'Main Prometheus server configuration with scrape targets',
      version: '2.45.0',
      targets: ['node-exporter', 'snmp-exporter', 'victoriametrics'],
      lastModified: '2024-01-15',
      status: 'active',
      deployments: 3,
      testStatus: 'passed',
      metricsEndpoint: 'http://localhost:9090/metrics'
    },
    {
      id: '2',
      name: 'Grafana Datasources',
      type: 'grafana',
      description: 'Grafana datasource configuration for VictoriaMetrics',
      version: '10.2.2',
      targets: ['grafana-01', 'grafana-02'],
      lastModified: '2024-01-14',
      status: 'active',
      deployments: 2,
      testStatus: 'testing'
    },
    {
      id: '3',
      name: 'VictoriaMetrics Cluster',
      type: 'victoriametrics',
      description: 'VictoriaMetrics cluster configuration with storage nodes',
      version: '1.95.1',
      targets: ['vm-storage', 'vm-insert', 'vm-select'],
      lastModified: '2024-01-13',
      status: 'active',
      deployments: 1,
      testStatus: 'failed'
    },
    {
      id: '4',
      name: 'SNMP Exporter Config',
      type: 'snmp',
      description: 'SNMP exporter configuration with device modules',
      version: '0.25.0',
      targets: ['cisco-router', 'huawei-switch', 'dell-server'],
      lastModified: '2024-01-12',
      status: 'draft',
      deployments: 0,
      testStatus: 'not-tested'
    }
  ];

  const deployments: Deployment[] = [
    {
      id: '1',
      configId: '1',
      target: 'prometheus-server-01',
      status: 'deployed',
      deployedAt: '2024-01-15 14:30:00',
      version: '2.45.0',
      health: 'healthy',
      testResults: [
        {
          id: '1',
          type: 'connection',
          name: 'SSH Connection Test',
          status: 'passed',
          message: 'Successfully connected to target host',
          timestamp: '2024-01-15 14:30:00',
          duration: '2.3s'
        },
        {
          id: '2',
          type: 'config',
          name: 'Configuration Validation',
          status: 'passed',
          message: 'Configuration syntax is valid',
          timestamp: '2024-01-15 14:30:15',
          duration: '1.1s'
        },
        {
          id: '3',
          type: 'metrics',
          name: 'Metrics Endpoint Test',
          status: 'passed',
          message: 'Metrics endpoint is accessible',
          timestamp: '2024-01-15 14:30:30',
          duration: '0.8s'
        },
        {
          id: '4',
          type: 'data',
          name: 'Data Collection Test',
          status: 'passed',
          message: 'Successfully collected 1247 metrics',
          timestamp: '2024-01-15 14:30:45',
          duration: '3.2s'
        }
      ]
    },
    {
      id: '2',
      configId: '2',
      target: 'grafana-01',
      status: 'deployed',
      deployedAt: '2024-01-15 14:25:00',
      version: '10.2.2',
      health: 'healthy'
    },
    {
      id: '3',
      configId: '1',
      target: 'prometheus-server-02',
      status: 'deploying',
      deployedAt: '2024-01-15 14:35:00',
      version: '2.45.0',
      health: 'warning'
    },
    {
      id: '4',
      configId: '3',
      target: 'vm-cluster-01',
      status: 'failed',
      deployedAt: '2024-01-15 14:20:00',
      version: '1.95.1',
      health: 'error',
      testResults: [
        {
          id: '1',
          type: 'connection',
          name: 'SSH Connection Test',
          status: 'passed',
          message: 'Successfully connected to target host',
          timestamp: '2024-01-15 14:20:00',
          duration: '2.1s'
        },
        {
          id: '2',
          type: 'config',
          name: 'Configuration Validation',
          status: 'failed',
          message: 'Invalid storage configuration: missing retention policy',
          timestamp: '2024-01-15 14:20:15',
          duration: '0.9s'
        }
      ]
    }
  ];

  const deviceMetrics: DeviceMetrics[] = [
    {
      deviceId: 'router-01',
      deviceName: 'Core Router 01',
      deviceType: 'router',
      metrics: [
        {
          name: 'ifInOctets',
          type: 'counter',
          description: 'The total number of octets received on the interface',
          labels: ['device', 'interface', 'ifName', 'ifAlias'],
          unit: 'bytes',
          help: 'Interface input traffic in bytes',
          example: 'ifInOctets{device="router-01",interface="1",ifName="GigabitEthernet0/1"} 1234567890'
        },
        {
          name: 'ifOutOctets',
          type: 'counter',
          description: 'The total number of octets transmitted out of the interface',
          labels: ['device', 'interface', 'ifName', 'ifAlias'],
          unit: 'bytes',
          help: 'Interface output traffic in bytes',
          example: 'ifOutOctets{device="router-01",interface="1",ifName="GigabitEthernet0/1"} 987654321'
        },
        {
          name: 'ifOperStatus',
          type: 'gauge',
          description: 'The current operational state of the interface',
          labels: ['device', 'interface', 'ifName'],
          help: 'Interface operational status (1=up, 2=down, 3=testing)',
          example: 'ifOperStatus{device="router-01",interface="1",ifName="GigabitEthernet0/1"} 1'
        },
        {
          name: 'sysUpTime',
          type: 'gauge',
          description: 'The time since the network management portion of the system was last re-initialized',
          labels: ['device'],
          unit: 'seconds',
          help: 'System uptime in seconds',
          example: 'sysUpTime{device="router-01"} 3888000'
        }
      ],
      endpoints: ['http://192.168.1.1:9116/snmp?target=192.168.1.1&module=cisco_router']
    },
    {
      deviceId: 'switch-01',
      deviceName: 'Access Switch 01',
      deviceType: 'switch',
      metrics: [
        {
          name: 'dot1dTpFdbAddress',
          type: 'gauge',
          description: 'A unicast MAC address for which the bridge has forwarding information',
          labels: ['device', 'mac'],
          help: 'MAC address table entries',
          example: 'dot1dTpFdbAddress{device="switch-01",mac="00:11:22:33:44:55"} 1'
        },
        {
          name: 'dot1qVlanStaticName',
          type: 'gauge',
          description: 'An administratively assigned string which may be used to identify the VLAN',
          labels: ['device', 'vlan'],
          help: 'VLAN configuration',
          example: 'dot1qVlanStaticName{device="switch-01",vlan="100"} 1'
        }
      ],
      endpoints: ['http://192.168.1.2:9116/snmp?target=192.168.1.2&module=huawei_switch']
    },
    {
      deviceId: 'server-01',
      deviceName: 'Database Server 01',
      deviceType: 'server',
      metrics: [
        {
          name: 'node_cpu_seconds_total',
          type: 'counter',
          description: 'Seconds the CPUs spent in each mode',
          labels: ['device', 'cpu', 'mode'],
          unit: 'seconds',
          help: 'CPU time spent in different modes',
          example: 'node_cpu_seconds_total{device="server-01",cpu="0",mode="idle"} 123456.78'
        },
        {
          name: 'node_memory_MemTotal_bytes',
          type: 'gauge',
          description: 'Memory information field MemTotal_bytes',
          labels: ['device'],
          unit: 'bytes',
          help: 'Total memory in bytes',
          example: 'node_memory_MemTotal_bytes{device="server-01"} 8589934592'
        },
        {
          name: 'node_filesystem_size_bytes',
          type: 'gauge',
          description: 'Filesystem size in bytes',
          labels: ['device', 'fstype', 'mountpoint'],
          unit: 'bytes',
          help: 'Filesystem size',
          example: 'node_filesystem_size_bytes{device="server-01",fstype="ext4",mountpoint="/"} 107374182400'
        }
      ],
      endpoints: ['http://192.168.1.10:9100/metrics']
    }
  ];

  const getTypeIcon = (type: ConfigTemplate['type']) => {
    switch (type) {
      case 'prometheus': return <Activity className="h-5 w-5 text-orange-400" />;
      case 'grafana': return <Monitor className="h-5 w-5 text-blue-400" />;
      case 'victoriametrics': return <Database className="h-5 w-5 text-purple-400" />;
      case 'alertmanager': return <Zap className="h-5 w-5 text-yellow-400" />;
      case 'snmp': return <Server className="h-5 w-5 text-green-400" />;
      default: return <FileCode className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusIcon = (status: ConfigTemplate['status']) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'draft': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'deprecated': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTestStatusIcon = (status?: ConfigTemplate['testStatus']) => {
    switch (status) {
      case 'passed': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'testing': return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      default: return <TestTube className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDeploymentStatusIcon = (status: Deployment['status']) => {
    switch (status) {
      case 'deployed': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'deploying': return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getHealthIcon = (health: Deployment['health']) => {
    switch (health) {
      case 'healthy': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTestResultIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'testing': return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getMetricTypeIcon = (type: MetricDefinition['type']) => {
    switch (type) {
      case 'counter': return <TrendingUp className="h-4 w-4 text-blue-400" />;
      case 'gauge': return <Gauge className="h-4 w-4 text-green-400" />;
      case 'histogram': return <BarChart3 className="h-4 w-4 text-purple-400" />;
      case 'summary': return <PieChart className="h-4 w-4 text-orange-400" />;
      default: return <LineChart className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleCopyConfig = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConfig = (configId: string) => {
    setTestingConfig(configId);
    // Simulate testing process
    setTimeout(() => {
      setTestingConfig(null);
    }, 5000);
  };

  const handleMetricSelect = (metricName: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricName) 
        ? prev.filter(m => m !== metricName)
        : [...prev, metricName]
    );
  };

  const generateConfigFromMetrics = () => {
    const selectedMetricObjects = deviceMetrics.flatMap(device => 
      device.metrics.filter(metric => selectedMetrics.includes(metric.name))
    );

    let config = `# Generated Prometheus Configuration
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
`;

    // Group by device type
    const deviceTypes = [...new Set(deviceMetrics.map(d => d.deviceType))];
    
    deviceTypes.forEach(type => {
      const devicesOfType = deviceMetrics.filter(d => d.deviceType === type);
      if (devicesOfType.some(d => d.metrics.some(m => selectedMetrics.includes(m.name)))) {
        config += `
  - job_name: '${type}-monitoring'
    static_configs:
      - targets:`;
        
        devicesOfType.forEach(device => {
          device.endpoints.forEach(endpoint => {
            const url = new URL(endpoint);
            config += `\n        - '${url.host}'`;
          });
        });

        config += `
    scrape_interval: 30s
    metrics_path: /metrics
    params:
      module: [${type}_module]
`;
      }
    });

    setConfigContent(config);
  };

  const sampleConfig = `# Prometheus Configuration
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
    scrape_interval: 30s
    metrics_path: /metrics

  - job_name: 'snmp-exporter'
    static_configs:
      - targets: ['192.168.1.1:9116']
    params:
      module: [cisco_router]
    scrape_interval: 60s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093`;

  const activeConfigs = configTemplates.filter(c => c.status === 'active').length;
  const draftConfigs = configTemplates.filter(c => c.status === 'draft').length;
  const totalDeployments = deployments.length;
  const healthyDeployments = deployments.filter(d => d.health === 'healthy').length;

  return (
    <div className="space-y-6">
      {/* Configuration Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Configs</p>
                <p className="text-2xl font-bold text-green-400">{activeConfigs}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Draft Configs</p>
                <p className="text-2xl font-bold text-yellow-400">{draftConfigs}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Deployments</p>
                <p className="text-2xl font-bold text-blue-400">{totalDeployments}</p>
              </div>
              <Target className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Healthy</p>
                <p className="text-2xl font-bold text-green-400">{healthyDeployments}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="templates">
            <Layers className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="generator">
            <Settings className="h-4 w-4 mr-2" />
            Visual Generator
          </TabsTrigger>
          <TabsTrigger value="testing">
            <TestTube className="h-4 w-4 mr-2" />
            Testing
          </TabsTrigger>
          <TabsTrigger value="deployments">
            <Target className="h-4 w-4 mr-2" />
            Deployments
          </TabsTrigger>
          <TabsTrigger value="validation">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Validation
          </TabsTrigger>
        </TabsList>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Configuration Templates</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage and deploy monitoring configuration templates
                  </CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {configTemplates.map((template) => (
                  <Card key={template.id} className="border border-slate-600 hover:border-blue-500 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(template.type)}
                          <div>
                            <h3 className="font-semibold text-white">{template.name}</h3>
                            <p className="text-sm text-slate-400">{template.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(template.status)}
                          {getTestStatusIcon(template.testStatus)}
                          <Badge className={`${
                            template.status === 'active' ? 'bg-green-600' :
                            template.status === 'draft' ? 'bg-yellow-600' : 'bg-red-600'
                          } text-white`}>
                            {template.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-300 mb-4">{template.description}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
                        <div><strong>Version:</strong> {template.version}</div>
                        <div><strong>Deployments:</strong> {template.deployments}</div>
                        <div><strong>Modified:</strong> {template.lastModified}</div>
                        <div><strong>Targets:</strong> {template.targets.length}</div>
                      </div>
                      
                      {template.testStatus && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTestStatusIcon(template.testStatus)}
                            <span className="text-sm font-medium text-slate-300">
                              Test Status: {template.testStatus}
                            </span>
                          </div>
                          {template.metricsEndpoint && (
                            <p className="text-xs text-slate-500 font-mono">
                              Endpoint: {template.metricsEndpoint}
                            </p>
                          )}
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.targets.slice(0, 3).map((target, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                            {target}
                          </Badge>
                        ))}
                        {template.targets.length > 3 && (
                          <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                            +{template.targets.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(template.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleTestConfig(template.id)}
                            disabled={testingConfig === template.id}
                          >
                            {testingConfig === template.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <TestTube className="h-4 w-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Target className="h-3 w-3 mr-1" />
                          Deploy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visual Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Metric Selection */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MousePointer className="h-5 w-5 mr-2" />
                  Visual Metric Selection
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Select metrics from monitored devices to generate configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Search metrics..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <Button 
                    onClick={generateConfigFromMetrics}
                    disabled={selectedMetrics.length === 0}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Config
                  </Button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {deviceMetrics.map((device) => (
                    <div key={device.deviceId} className="border border-slate-600 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                          {device.deviceType === 'router' && <Router className="h-5 w-5 text-blue-400" />}
                          {device.deviceType === 'switch' && <Network className="h-5 w-5 text-green-400" />}
                          {device.deviceType === 'server' && <Server className="h-5 w-5 text-purple-400" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{device.deviceName}</h3>
                          <p className="text-sm text-slate-400">{device.deviceType}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {device.metrics.map((metric) => (
                          <div 
                            key={metric.name}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              selectedMetrics.includes(metric.name)
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-700 hover:border-slate-600'
                            }`}
                            onClick={() => handleMetricSelect(metric.name)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                {getMetricTypeIcon(metric.type)}
                                <div>
                                  <h4 className="font-medium text-white text-sm">{metric.name}</h4>
                                  <p className="text-xs text-slate-400">{metric.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={`text-xs ${
                                  metric.type === 'counter' ? 'bg-blue-600' :
                                  metric.type === 'gauge' ? 'bg-green-600' :
                                  metric.type === 'histogram' ? 'bg-purple-600' : 'bg-orange-600'
                                } text-white`}>
                                  {metric.type}
                                </Badge>
                                {selectedMetrics.includes(metric.name) && (
                                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                                )}
                              </div>
                            </div>
                            
                            {metric.unit && (
                              <p className="text-xs text-slate-500 mt-1">Unit: {metric.unit}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              {metric.labels.slice(0, 3).map((label, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-500">
                                  {label}
                                </Badge>
                              ))}
                              {metric.labels.length > 3 && (
                                <Badge variant="outline" className="text-xs border-slate-700 text-slate-500">
                                  +{metric.labels.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                  <span className="text-sm text-slate-400">
                    Selected: {selectedMetrics.length} metrics
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedMetrics([])}
                    className="border-slate-600 text-slate-300"
                  >
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Generated Configuration */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <FileCode className="h-5 w-5 mr-2" />
                    Generated Configuration
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={handleCopyConfig}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-auto max-h-96">
                  <pre>{configContent || sampleConfig}</pre>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Badge className="bg-green-600 text-white">Valid</Badge>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {(configContent || sampleConfig).split('\n').length} lines
                    </Badge>
                    <Badge variant="outline" className="border-slate-600 text-slate-300">
                      {selectedMetrics.length} metrics
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="h-3 w-3 mr-1" />
                      Save Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TestTube className="h-5 w-5 mr-2" />
                Configuration Testing & Validation
              </CardTitle>
              <CardDescription className="text-slate-400">
                Test configuration files and validate metric collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="font-semibold text-green-400">Prometheus Server Config</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">All tests passed - Configuration is ready for deployment</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-3 w-3 text-green-400" />
                        <span>✓ SSH Connection Test (2.3s)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-3 w-3 text-green-400" />
                        <span>✓ Configuration Syntax (1.1s)</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-3 w-3 text-green-400" />
                        <span>✓ Metrics Endpoint (0.8s)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-3 w-3 text-green-400" />
                        <span>✓ Data Collection (3.2s)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="outline" className="border-green-500 text-green-400">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Target className="h-3 w-3 mr-1" />
                      Deploy Now
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />
                    <span className="font-semibold text-blue-400">Grafana Datasources</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">Testing in progress...</p>
                  <Progress value={65} className="h-2 mb-2" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-3 w-3 text-green-400" />
                        <span>✓ SSH Connection Test</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="h-3 w-3 text-blue-400 animate-spin" />
                        <span>⏳ Configuration Validation</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span>⏳ Datasource Connection</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span>⏳ Query Test</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <span className="font-semibold text-red-400">VictoriaMetrics Cluster</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">Configuration test failed - Issues found</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-3 w-3 text-green-400" />
                        <span>✓ SSH Connection Test</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-3 w-3 text-red-400" />
                        <span>✗ Configuration Validation</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-red-400">
                        Error: Invalid storage configuration
                      </div>
                      <div className="text-red-400">
                        Missing retention policy
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="outline" className="border-red-500 text-red-400">
                      <Eye className="h-3 w-3 mr-1" />
                      View Errors
                    </Button>
                    <Button size="sm" variant="outline" className="border-blue-500 text-blue-400">
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry Test
                    </Button>
                  </div>
                </div>

                {/* Test Configuration Form */}
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Manual Configuration Test</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-300">Target Host</Label>
                        <Input 
                          placeholder="192.168.1.10"
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-slate-300">Configuration Type</Label>
                        <select className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2">
                          <option value="prometheus">Prometheus</option>
                          <option value="grafana">Grafana</option>
                          <option value="victoriametrics">VictoriaMetrics</option>
                          <option value="snmp">SNMP Exporter</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-slate-300">Test Options</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm text-slate-400">Connection Test</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm text-slate-400">Syntax Validation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm text-slate-400">Metrics Endpoint</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm text-slate-400">Data Collection</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <TestTube className="h-4 w-4 mr-2" />
                      Run Configuration Test
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployments Tab */}
        <TabsContent value="deployments" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Configuration Deployments
              </CardTitle>
              <CardDescription className="text-slate-400">
                Monitor and manage configuration deployments with test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deployments.map((deployment) => {
                  const template = configTemplates.find(t => t.id === deployment.configId);
                  return (
                    <div key={deployment.id} className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getDeploymentStatusIcon(deployment.status)}
                          <div>
                            <h3 className="font-semibold text-white">{template?.name}</h3>
                            <p className="text-sm text-slate-400">{deployment.target}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getHealthIcon(deployment.health)}
                          <Badge className={`${
                            deployment.status === 'deployed' ? 'bg-green-600' :
                            deployment.status === 'deploying' ? 'bg-blue-600' :
                            deployment.status === 'failed' ? 'bg-red-600' : 'bg-yellow-600'
                          } text-white`}>
                            {deployment.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-slate-500">Version</p>
                          <p className="text-white">{deployment.version}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Deployed At</p>
                          <p className="text-white">{deployment.deployedAt}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Health Status</p>
                          <p className="text-white capitalize">{deployment.health}</p>
                        </div>
                      </div>

                      {/* Test Results */}
                      {deployment.testResults && deployment.testResults.length > 0 && (
                        <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                          <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                            <TestTube className="h-4 w-4 mr-2" />
                            Test Results
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {deployment.testResults.map((test) => (
                              <div key={test.id} className="flex items-center space-x-3">
                                {getTestResultIcon(test.status)}
                                <div className="flex-1">
                                  <p className="text-sm text-white">{test.name}</p>
                                  <p className="text-xs text-slate-400">{test.message}</p>
                                  {test.duration && (
                                    <p className="text-xs text-slate-500">Duration: {test.duration}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700">
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          {template?.type}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <TestTube className="h-4 w-4" />
                          </Button>
                          {deployment.status === 'deployed' && (
                            <Button variant="ghost" size="sm">
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validation Tab */}
        <TabsContent value="validation" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Configuration Validation
              </CardTitle>
              <CardDescription className="text-slate-400">
                Validate configuration files before deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-500/10 border border-green-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="font-semibold text-green-400">Prometheus Server Config</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">Configuration is valid and ready for deployment</p>
                  <div className="flex space-x-4 text-xs text-slate-400">
                    <span>✓ Syntax check passed</span>
                    <span>✓ Target validation passed</span>
                    <span>✓ Rule validation passed</span>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold text-yellow-400">SNMP Exporter Config</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">Configuration has warnings but is deployable</p>
                  <div className="flex space-x-4 text-xs text-slate-400">
                    <span>✓ Syntax check passed</span>
                    <span>⚠ Some targets unreachable</span>
                    <span>✓ Module validation passed</span>
                  </div>
                </div>
                
                <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <span className="font-semibold text-red-400">Alertmanager Config</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2">Configuration has errors and cannot be deployed</p>
                  <div className="flex space-x-4 text-xs text-slate-400">
                    <span>✗ Syntax error on line 23</span>
                    <span>✗ Invalid webhook URL</span>
                    <span>✓ Route validation passed</span>
                  </div>
                  <Button size="sm" variant="outline" className="border-red-500 text-red-400 mt-2">
                    View Details
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