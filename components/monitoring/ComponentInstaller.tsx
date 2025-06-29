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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Play, 
  Pause, 
  RefreshCw,
  Settings,
  Eye,
  Trash2,
  Package,
  Activity,
  Database,
  Monitor,
  Shield,
  Bell,
  Zap,
  Network,
  Cpu,
  HardDrive,
  Globe,
  Target,
  GitBranch,
  Calendar,
  Info,
  ExternalLink,
  FileText,
  Code,
  Terminal,
  Layers,
  BarChart3,
  TrendingUp,
  Users,
  Lock,
  Key,
  Upload,
  Plus,
  Search,
  Filter,
  Tag,
  Star,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface Component {
  id: string;
  name: string;
  type: 'collector' | 'storage' | 'visualization' | 'alerting' | 'proxy';
  description: string;
  category: string;
  vendor: string;
  currentVersion: string;
  availableVersions: ComponentVersion[];
  downloadUrl: string;
  configPath: string;
  serviceName: string;
  defaultPort: number;
  status: 'available' | 'installing' | 'installed' | 'failed' | 'updating';
  hostId?: string;
  installProgress?: number;
  lastUpdated: string;
  dependencies: string[];
  systemRequirements: {
    minCpu: string;
    minMemory: string;
    minDisk: string;
    supportedOS: string[];
    supportedArch: string[];
  };
  features: string[];
  documentation: string;
  configGuide: string;
  healthCheck: {
    endpoint: string;
    expectedStatus: number;
  };
}

interface ComponentVersion {
  version: string;
  releaseDate: string;
  status: 'latest' | 'stable' | 'legacy' | 'beta';
  changelog: string[];
  downloadUrl: string;
  systemRequirements: {
    minCpu: string;
    minMemory: string;
    minDisk: string;
    supportedOS: string[];
    supportedArch: string[];
  };
  breaking: boolean;
  security: boolean;
}

interface Host {
  id: string;
  name: string;
  ip: string;
  status: 'connected' | 'disconnected' | 'error';
  os: string;
  architecture: string;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
  };
  installedComponents: string[];
}

interface InstallationJob {
  id: string;
  componentId: string;
  hostId: string;
  version: string;
  status: 'pending' | 'downloading' | 'installing' | 'configuring' | 'starting' | 'completed' | 'failed';
  progress: number;
  logs: string[];
  startTime: string;
  endTime?: string;
  error?: string;
}

export default function ComponentInstaller() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [selectedHost, setSelectedHost] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [showConfigGuide, setShowConfigGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('components');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [components, setComponents] = useState<Component[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [installations, setInstallations] = useState<InstallationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from backend APIs
  useEffect(() => {
    fetchComponents();
    fetchHosts();
    fetchInstallations();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/components');
      if (!response.ok) throw new Error('Failed to fetch components');
      
      const data = await response.json();
      setComponents(data || getDefaultComponents());
    } catch (err) {
      console.error('Error fetching components:', err);
      setError('Unable to fetch component data. Using default components.');
      setComponents(getDefaultComponents());
    } finally {
      setLoading(false);
    }
  };

  const fetchHosts = async () => {
    try {
      const response = await fetch('/api/v1/hosts');
      if (!response.ok) throw new Error('Failed to fetch hosts');
      
      const data = await response.json();
      setHosts(data || []);
    } catch (err) {
      console.error('Error fetching hosts:', err);
      setHosts([]);
    }
  };

  const fetchInstallations = async () => {
    try {
      const response = await fetch('/api/v1/installations');
      if (response.ok) {
        const data = await response.json();
        setInstallations(data || []);
      }
    } catch (err) {
      console.error('Error fetching installations:', err);
    }
  };

  // Default components with 2025 updated versions
  const getDefaultComponents = (): Component[] => [
    {
      id: 'node-exporter',
      name: 'Node Exporter',
      type: 'collector',
      description: 'Prometheus exporter for hardware and OS metrics exposed by *NIX kernels',
      category: 'System Monitoring',
      vendor: 'Prometheus',
      currentVersion: '1.8.2',
      availableVersions: [
        {
          version: '1.8.2',
          releaseDate: '2024-12-15',
          status: 'latest',
          changelog: ['Enhanced cgroup v2 support', 'New filesystem metrics', 'Performance improvements'],
          downloadUrl: 'https://github.com/prometheus/node_exporter/releases/download/v1.8.2/node_exporter-1.8.2.linux-amd64.tar.gz',
          systemRequirements: {
            minCpu: '1 core',
            minMemory: '128MB',
            minDisk: '50MB',
            supportedOS: ['Linux', 'FreeBSD', 'OpenBSD', 'macOS'],
            supportedArch: ['amd64', 'arm64', 'armv7']
          },
          breaking: false,
          security: true
        },
        {
          version: '1.8.1',
          releaseDate: '2024-11-20',
          status: 'stable',
          changelog: ['Bug fixes', 'Security updates'],
          downloadUrl: 'https://github.com/prometheus/node_exporter/releases/download/v1.8.1/node_exporter-1.8.1.linux-amd64.tar.gz',
          systemRequirements: {
            minCpu: '1 core',
            minMemory: '128MB',
            minDisk: '50MB',
            supportedOS: ['Linux', 'FreeBSD', 'OpenBSD', 'macOS'],
            supportedArch: ['amd64', 'arm64', 'armv7']
          },
          breaking: false,
          security: false
        },
        {
          version: '1.7.0',
          releaseDate: '2024-09-10',
          status: 'legacy',
          changelog: ['Legacy version for compatibility'],
          downloadUrl: 'https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz',
          systemRequirements: {
            minCpu: '1 core',
            minMemory: '128MB',
            minDisk: '50MB',
            supportedOS: ['Linux', 'FreeBSD', 'OpenBSD'],
            supportedArch: ['amd64', 'arm64']
          },
          breaking: false,
          security: false
        }
      ],
      downloadUrl: 'https://github.com/prometheus/node_exporter/releases/download/v1.8.2/node_exporter-1.8.2.linux-amd64.tar.gz',
      configPath: '/etc/node_exporter/node_exporter.yml',
      serviceName: 'node_exporter',
      defaultPort: 9100,
      status: 'available',
      lastUpdated: '2024-12-15',
      dependencies: [],
      systemRequirements: {
        minCpu: '1 core',
        minMemory: '128MB',
        minDisk: '50MB',
        supportedOS: ['Linux', 'FreeBSD', 'OpenBSD', 'macOS'],
        supportedArch: ['amd64', 'arm64', 'armv7']
      },
      features: ['Hardware metrics', 'OS metrics', 'Process monitoring', 'Network statistics'],
      documentation: 'https://prometheus.io/docs/guides/node-exporter/',
      configGuide: 'Node Exporter configuration guide...',
      healthCheck: {
        endpoint: '/metrics',
        expectedStatus: 200
      }
    },
    {
      id: 'categraf',
      name: 'Categraf',
      type: 'collector',
      description: 'One-stop telemetry collector for metrics, logs and traces',
      category: 'Telemetry Collection',
      vendor: 'Flashcat',
      currentVersion: '0.3.78',
      availableVersions: [
        {
          version: '0.3.78',
          releaseDate: '2024-12-20',
          status: 'latest',
          changelog: ['Enhanced SNMP support', 'New input plugins', 'Performance optimizations', 'Better error handling'],
          downloadUrl: 'https://github.com/flashcatcloud/categraf/releases/download/v0.3.78/categraf-v0.3.78-linux-amd64.tar.gz',
          systemRequirements: {
            minCpu: '1 core',
            minMemory: '256MB',
            minDisk: '100MB',
            supportedOS: ['Linux', 'Windows', 'macOS'],
            supportedArch: ['amd64', 'arm64', 'armv7']
          },
          breaking: false,
          security: true
        },
        {
          version: '0.3.75',
          releaseDate: '2024-11-15',
          status: 'stable',
          changelog: ['Stable release with bug fixes'],
          downloadUrl: 'https://github.com/flashcatcloud/categraf/releases/download/v0.3.75/categraf-v0.3.75-linux-amd64.tar.gz',
          systemRequirements: {
            minCpu: '1 core',
            minMemory: '256MB',
            minDisk: '100MB',
            supportedOS: ['Linux', 'Windows', 'macOS'],
            supportedArch: ['amd64', 'arm64', 'armv7']
          },
          breaking: false,
          security: false
        }
      ],
      downloadUrl: 'https://github.com/flashcatcloud/categraf/releases/download/v0.3.78/categraf-v0.3.78-linux-amd64.tar.gz',
      configPath: '/etc/categraf/conf.d/',
      serviceName: 'categraf',
      defaultPort: 9100,
      status: 'available',
      lastUpdated: '2024-12-20',
      dependencies: [],
      systemRequirements: {
        minCpu: '1 core',
        minMemory: '256MB',
        minDisk: '100MB',
        supportedOS: ['Linux', 'Windows', 'macOS'],
        supportedArch: ['amd64', 'arm64', 'armv7']
      },
      features: ['Multi-protocol support', 'Plugin architecture', 'SNMP monitoring', 'Log collection'],
      documentation: 'https://github.com/flashcatcloud/categraf',
      configGuide: 'Categraf configuration guide...',
      healthCheck: {
        endpoint: '/metrics',
        expectedStatus: 200
      }
    },
    {
      id: 'snmp-exporter',
      name: 'SNMP Exporter',
      type: 'collector',
      description: 'Prometheus exporter for SNMP-enabled devices',
      category: 'Network Monitoring',
      vendor: 'Prometheus',
      currentVersion: '0.26.0',
      availableVersions: [
        {
          version: '0.26.0',
          releaseDate: '2024-12-10',
          status: 'latest',
          changelog: ['Enhanced MIB support', 'Better error handling', 'Performance improvements'],
          downloadUrl: 'https://github.com/prometheus/snmp_exporter/releases/download/v0.26.0/snmp_exporter-0.26.0.linux-amd64.tar.gz',
          systemRequirements: {
            minCpu: '1 core',
            minMemory: '256MB',
            minDisk: '100MB',
            supportedOS: ['Linux', 'Windows', 'macOS'],
            supportedArch: ['amd64', 'arm64', 'armv7']
          },
          breaking: false,
          security: true
        },
        {
          version: '0.25.0',
          releaseDate: '2024-10-15',
          status: 'stable',
          changelog: ['Stable release'],
          downloadUrl: 'https://github.com/prometheus/snmp_exporter/releases/download/v0.25.0/snmp_exporter-0.25.0.linux-amd64.tar.gz',
          systemRequirements: {
            minCpu: '1 core',
            minMemory: '256MB',
            minDisk: '100MB',
            supportedOS: ['Linux', 'Windows', 'macOS'],
            supportedArch: ['amd64', 'arm64', 'armv7']
          },
          breaking: false,
          security: false
        }
      ],
      downloadUrl: 'https://github.com/prometheus/snmp_exporter/releases/download/v0.26.0/snmp_exporter-0.26.0.linux-amd64.tar.gz',
      configPath: '/etc/snmp_exporter/snmp.yml',
      serviceName: 'snmp_exporter',
      defaultPort: 9116,
      status: 'available',
      lastUpdated: '2024-12-10',
      dependencies: [],
      systemRequirements: {
        minCpu: '1 core',
        minMemory: '256MB',
        minDisk: '100MB',
        supportedOS: ['Linux', 'Windows', 'macOS'],
        supportedArch: ['amd64', 'arm64', 'armv7']
      },
      features: ['SNMP v1/v2c/v3', 'MIB support', 'Multi-target', 'Custom modules'],
      documentation: 'https://github.com/prometheus/snmp_exporter',
      configGuide: 'SNMP Exporter configuration guide...',
      healthCheck: {
        endpoint: '/metrics',
        expectedStatus: 200
      }
    },
    {
      id: 'victoriametrics',
      name: 'VictoriaMetrics',
      type: 'storage',
      description: 'Fast, cost-effective monitoring solution and time series database',
      category: 'Time Series Database',
      vendor: 'VictoriaMetrics',
      currentVersion: '1.97.1',
      availableVersions: [
        {
          version: '1.97.1',
          releaseDate: '2024-12-18',
          status: 'latest',
          changelog: ['Performance improvements', 'New query features', 'Bug fixes', 'Enhanced clustering'],
          downloadUrl: 'https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.97.1/victoria-metrics-linux-amd64-v1.97.1.tar.gz',
          systemRequirements: {
            minCpu: '2 cores',
            minMemory: '1GB',
            minDisk: '10GB',
            supportedOS: ['Linux', 'Windows', 'macOS'],
            supportedArch: ['amd64', 'arm64', 'armv7']
          },
          breaking: false,
          security: true
        },
        {
          version: '1.96.0',
          releaseDate: '2024-11-25',
          status: 'stable',
          changelog: ['Stable release with proven reliability'],
          downloadUrl: 'https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.96.0/victoria-metrics-linux-amd64-v1.96.0.tar.gz',
          systemRequirements: {
            minCpu: '2 cores',
            minMemory: '1GB',
            minDisk: '10GB',
            supportedOS: ['Linux', 'Windows', 'macOS'],
            supportedArch: ['amd64', 'arm64', 'armv7']
          },
          breaking: false,
          security: false
        }
      ],
      downloadUrl: 'https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.97.1/victoria-metrics-linux-amd64-v1.97.1.tar.gz',
      configPath: '/etc/victoriametrics/victoria-metrics.yml',
      serviceName: 'victoriametrics',
      defaultPort: 8428,
      status: 'available',
      lastUpdated: '2024-12-18',
      dependencies: [],
      systemRequirements: {
        minCpu: '2 cores',
        minMemory: '1GB',
        minDisk: '10GB',
        supportedOS: ['Linux', 'Windows', 'macOS'],
        supportedArch: ['amd64', 'arm64', 'armv7']
      },
      features: ['High performance', 'Low resource usage', 'PromQL support', 'Clustering'],
      documentation: 'https://docs.victoriametrics.com/',
      configGuide: 'VictoriaMetrics configuration guide...',
      healthCheck: {
        endpoint: '/health',
        expectedStatus: 200
      }
    },
    {
      id: 'grafana',
      name: 'Grafana',
      type: 'visualization',
      description: 'Open source analytics and interactive visualization web application',
      category: 'Visualization',
      vendor: 'Grafana Labs',
      currentVersion: '11.3.0',
      availableVersions: [
        {
          version: '11.3.0',
          releaseDate: '2024-12-12',
          status: 'latest',
          changelog: ['New dashboard features', 'Enhanced alerting', 'Performance improvements', 'Security updates'],
          downloadUrl: 'https://dl.grafana.com/oss/release/grafana-11.3.0.linux-amd64.tar.gz',
          systemRequirements: {
            minCpu: '2 cores',
            minMemory: '1GB',
            minDisk: '2GB',
            supportedOS: ['Linux', 'Windows', 'macOS'],
            supportedArch: ['amd64', 'arm64', 'armv7']
          },
          breaking: false,
          security: true
        },
        {
          version: '11.2.2',
          releaseDate: '2024-11-20',
          status: 'stable',
          changelog: ['LTS release with long-term support'],
          downloadUrl: 'https://dl.grafana.com/oss/release/grafana-11.2.2.linux-amd64.tar.gz',
          systemRequirements: {
            minCpu: '2 cores',
            minMemory: '1GB',
            minDisk: '2GB',
            supportedOS: ['Linux', 'Windows', 'macOS'],
            supportedArch: ['amd64', 'arm64', 'armv7']
          },
          breaking: false,
          security: false
        }
      ],
      downloadUrl: 'https://dl.grafana.com/oss/release/grafana-11.3.0.linux-amd64.tar.gz',
      configPath: '/etc/grafana/grafana.ini',
      serviceName: 'grafana-server',
      defaultPort: 3000,
      status: 'available',
      lastUpdated: '2024-12-12',
      dependencies: [],
      systemRequirements: {
        minCpu: '2 cores',
        minMemory: '1GB',
        minDisk: '2GB',
        supportedOS: ['Linux', 'Windows', 'macOS'],
        supportedArch: ['amd64', 'arm64', 'armv7']
      },
      features: ['Rich dashboards', 'Alerting', 'Data sources', 'Plugins'],
      documentation: 'https://grafana.com/docs/',
      configGuide: 'Grafana configuration guide...',
      healthCheck: {
        endpoint: '/api/health',
        expectedStatus: 200
      }
    },
    {
      id: 'vmalert',
      name: 'VMAlert',
      type: 'alerting',
      description: 'VictoriaMetrics alerting component',
      category: 'Alerting',
      vendor: 'VictoriaMetrics',
      currentVersion: '1.97.1',
      availableVersions: [
        {
          version: '1.97.1',
          releaseDate: '2024-12-18',
          status: 'latest',
          changelog: ['Enhanced alerting rules', 'Better integration', 'Performance improvements'],
          downloadUrl: 'https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.97.1/vmalert-linux-amd64-v1.97.1.tar.gz',
          systemRequirements: {
            minCpu: '1 core',
            minMemory: '512MB',
            minDisk: '1GB',
            supportedOS: ['Linux', 'Windows', 'macOS'],
            supportedArch: ['amd64', 'arm64', 'armv7']
          },
          breaking: false,
          security: true
        }
      ],
      downloadUrl: 'https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.97.1/vmalert-linux-amd64-v1.97.1.tar.gz',
      configPath: '/etc/vmalert/alerts.yml',
      serviceName: 'vmalert',
      defaultPort: 8880,
      status: 'available',
      lastUpdated: '2024-12-18',
      dependencies: ['victoriametrics'],
      systemRequirements: {
        minCpu: '1 core',
        minMemory: '512MB',
        minDisk: '1GB',
        supportedOS: ['Linux', 'Windows', 'macOS'],
        supportedArch: ['amd64', 'arm64', 'armv7']
      },
      features: ['Alert rules', 'Notifications', 'Recording rules', 'High availability'],
      documentation: 'https://docs.victoriametrics.com/vmalert.html',
      configGuide: 'VMAlert configuration guide...',
      healthCheck: {
        endpoint: '/health',
        expectedStatus: 200
      }
    }
  ];

  const handleInstallComponent = async () => {
    if (!selectedComponent || !selectedHost || !selectedVersion) {
      setError('Please select component, host, and version');
      return;
    }

    try {
      const response = await fetch('/api/v1/components/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          component_id: selectedComponent,
          host_id: selectedHost,
          version: selectedVersion
        })
      });

      if (response.ok) {
        setShowVersionDialog(false);
        setSelectedComponent(null);
        setSelectedHost(null);
        setSelectedVersion('');
        fetchComponents();
        fetchInstallations();
      } else {
        const error = await response.json();
        setError(error.message || 'Installation failed');
      }
    } catch (err) {
      console.error('Error installing component:', err);
      setError('Error occurred during installation');
    }
  };

  const openVersionDialog = (componentId: string) => {
    setSelectedComponent(componentId);
    const component = components.find(c => c.id === componentId);
    if (component && component.availableVersions.length > 0) {
      setSelectedVersion(component.availableVersions[0].version);
    }
    setShowVersionDialog(true);
  };

  const getStatusIcon = (status: Component['status']) => {
    switch (status) {
      case 'installed':
        return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'installing':
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'updating':
        return <RefreshCw className="h-4 w-4 text-yellow-400 animate-spin" />;
      default:
        return <Package className="h-4 w-4 text-slate-400" />;
    }
  };

  const getTypeIcon = (type: Component['type']) => {
    switch (type) {
      case 'collector': return <Activity className="h-5 w-5 text-blue-400" />;
      case 'storage': return <Database className="h-5 w-5 text-green-400" />;
      case 'visualization': return <Monitor className="h-5 w-5 text-purple-400" />;
      case 'alerting': return <Bell className="h-5 w-5 text-orange-400" />;
      case 'proxy': return <Network className="h-5 w-5 text-cyan-400" />;
      default: return <Package className="h-5 w-5 text-gray-400" />;
    }
  };

  const getVersionBadgeColor = (status: ComponentVersion['status']) => {
    switch (status) {
      case 'latest': return 'bg-green-600';
      case 'stable': return 'bg-blue-600';
      case 'beta': return 'bg-yellow-600';
      case 'legacy': return 'bg-gray-600';
      default: return 'bg-slate-600';
    }
  };

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(components.map(c => c.category)))];
  const connectedHosts = hosts.filter(h => h.status === 'connected');

  return (
    <div className="space-y-6">
      {/* Component Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Available Components</p>
                <p className="text-2xl font-bold text-blue-400">{components.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Connected Hosts</p>
                <p className="text-2xl font-bold text-green-400">{connectedHosts.length}</p>
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
                <p className="text-2xl font-bold text-purple-400">
                  {components.filter(c => c.status === 'installed').length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Jobs</p>
                <p className="text-2xl font-bold text-orange-400">
                  {installations.filter(i => ['pending', 'downloading', 'installing'].includes(i.status)).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-400" />
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
          <TabsTrigger value="components">
            <Package className="h-4 w-4 mr-2" />
            Components
          </TabsTrigger>
          <TabsTrigger value="hosts">
            <Server className="h-4 w-4 mr-2" />
            Host Management
          </TabsTrigger>
          <TabsTrigger value="installations">
            <Activity className="h-4 w-4 mr-2" />
            Installation Jobs
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
                    Deploy and manage monitoring stack components
                  </CardDescription>
                </div>
                <Button onClick={fetchComponents} variant="outline" className="border-slate-600 text-slate-300">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search components..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Components Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredComponents.map((component) => (
              <Card key={component.id} className="bg-slate-800/50 border-slate-700 hover:border-blue-500 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(component.type)}
                      <div>
                        <h3 className="font-semibold text-white text-lg">{component.name}</h3>
                        <p className="text-sm text-slate-400">{component.vendor}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(component.status)}
                      <Badge className="bg-blue-600 text-white text-xs">
                        v{component.currentVersion}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-4 line-clamp-2">{component.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Category:</span>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {component.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Default Port:</span>
                      <span className="text-white font-mono">{component.defaultPort}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Available Versions:</span>
                      <span className="text-white">{component.availableVersions.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Last Updated:</span>
                      <span className="text-white">{component.lastUpdated}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-xs text-slate-500">System Requirements:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <Cpu className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-400">{component.systemRequirements.minCpu}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Monitor className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-400">{component.systemRequirements.minMemory}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HardDrive className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-400">{component.systemRequirements.minDisk}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Globe className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-400">{component.systemRequirements.supportedOS.length} OS</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
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
                  
                  {component.dependencies.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 mb-1">Dependencies:</p>
                      <div className="flex flex-wrap gap-1">
                        {component.dependencies.map((dep, idx) => (
                          <Badge key={idx} className="text-xs bg-yellow-600 text-white">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-4 border-t border-slate-700">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedComponent(component.id);
                          setShowConfigGuide(true);
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      {component.status === 'installed' ? (
                        <>
                          <Button size="sm" variant="outline" className="border-green-600 text-green-400">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Installed
                          </Button>
                          {component.availableVersions.some(v => v.version !== component.currentVersion) && (
                            <Button 
                              size="sm" 
                              className="bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => openVersionDialog(component.id)}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Update
                            </Button>
                          )}
                        </>
                      ) : component.status === 'installing' ? (
                        <Button size="sm" disabled className="bg-blue-600">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Installing...
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => openVersionDialog(component.id)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Install
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Host Management Tab */}
        <TabsContent value="hosts" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Host Management</CardTitle>
              <CardDescription className="text-slate-400">
                Manage deployment target hosts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {connectedHosts.length === 0 ? (
                <div className="text-center py-8">
                  <Server className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">No Connected Hosts</h3>
                  <p className="text-slate-400 mb-4">
                    Please add and connect hosts before installing components.
                  </p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab('hosts')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Hosts
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connectedHosts.map((host) => (
                    <div key={host.id} className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <div>
                            <h3 className="font-semibold text-white">{host.name}</h3>
                            <p className="text-sm text-slate-400">{host.ip}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-600 text-white text-xs">Connected</Badge>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">OS:</span>
                          <span className="text-white">{host.os}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Architecture:</span>
                          <span className="text-white">{host.architecture}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Components:</span>
                          <span className="text-white">{host.installedComponents.length}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">CPU:</span>
                          <span className="text-white">{host.resources.cpu}%</span>
                        </div>
                        <Progress value={host.resources.cpu} className="h-1" />
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Memory:</span>
                          <span className="text-white">{host.resources.memory}%</span>
                        </div>
                        <Progress value={host.resources.memory} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Installation Jobs Tab */}
        <TabsContent value="installations" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Installation Jobs</CardTitle>
              <CardDescription className="text-slate-400">
                Monitor component installation progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {installations.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">No Installation Jobs</h3>
                  <p className="text-slate-400">
                    Installation jobs will appear here when you deploy components.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {installations.map((job) => (
                    <div key={job.id} className="p-4 border border-slate-600 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-white">
                            {components.find(c => c.id === job.componentId)?.name || job.componentId}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {hosts.find(h => h.id === job.hostId)?.name || job.hostId} • v{job.version}
                          </p>
                        </div>
                        <Badge className={`${
                          job.status === 'completed' ? 'bg-green-600' :
                          job.status === 'failed' ? 'bg-red-600' :
                          'bg-blue-600'
                        } text-white`}>
                          {job.status}
                        </Badge>
                      </div>
                      
                      {['pending', 'downloading', 'installing', 'configuring', 'starting'].includes(job.status) && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">{job.status}...</span>
                            <span className="text-white">{job.progress}%</span>
                          </div>
                          <Progress value={job.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Started: {job.startTime}</span>
                        {job.endTime && <span>Completed: {job.endTime}</span>}
                      </div>
                      
                      {job.error && (
                        <div className="mt-2 p-2 bg-red-500/20 border border-red-500 rounded text-xs text-red-400">
                          {job.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Deployment Templates</CardTitle>
              <CardDescription className="text-slate-400">
                Pre-configured component stacks for common use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <BarChart3 className="h-8 w-8 text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-white">Basic Monitoring Stack</h3>
                      <p className="text-sm text-slate-400">Node Exporter + VictoriaMetrics + Grafana</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">
                    Complete monitoring solution for system metrics visualization
                  </p>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                    Deploy Stack
                  </Button>
                </div>
                
                <div className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <Network className="h-8 w-8 text-green-400" />
                    <div>
                      <h3 className="font-semibold text-white">Network Monitoring</h3>
                      <p className="text-sm text-slate-400">SNMP Exporter + Categraf + Alerting</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">
                    Comprehensive network device monitoring with SNMP support
                  </p>
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    Deploy Stack
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Version Selection Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Version and Host</DialogTitle>
            <DialogDescription>
              Choose the version to install and target host
            </DialogDescription>
          </DialogHeader>
          
          {selectedComponent && (
            <div className="space-y-6">
              {/* Component Info */}
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  {getTypeIcon(components.find(c => c.id === selectedComponent)?.type || 'collector')}
                  <h3 className="font-semibold text-white text-lg">
                    {components.find(c => c.id === selectedComponent)?.name}
                  </h3>
                </div>
                <p className="text-sm text-slate-400">
                  {components.find(c => c.id === selectedComponent)?.description}
                </p>
              </div>

              {/* Version Selection */}
              <div>
                <Label className="text-slate-300 text-base font-semibold">Select Version</Label>
                <div className="grid grid-cols-1 gap-3 mt-3">
                  {components.find(c => c.id === selectedComponent)?.availableVersions.map((version) => (
                    <div 
                      key={version.version}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedVersion === version.version 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-slate-600 hover:border-blue-400'
                      }`}
                      onClick={() => setSelectedVersion(version.version)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white">v{version.version}</span>
                            <Badge className={`${getVersionBadgeColor(version.status)} text-white text-xs`}>
                              {version.status}
                            </Badge>
                            {version.security && (
                              <Badge className="bg-red-600 text-white text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Security
                              </Badge>
                            )}
                            {version.breaking && (
                              <Badge className="bg-orange-600 text-white text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Breaking
                              </Badge>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-slate-400">{version.releaseDate}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-slate-300">
                          <strong>Changes:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {version.changelog.map((change, idx) => (
                              <li key={idx} className="text-slate-400">{change}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <strong className="text-slate-300">System Requirements:</strong>
                            <div className="mt-1 space-y-1">
                              <div className="flex items-center space-x-1">
                                <Cpu className="h-3 w-3 text-slate-400" />
                                <span className="text-slate-400">{version.systemRequirements.minCpu}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Monitor className="h-3 w-3 text-slate-400" />
                                <span className="text-slate-400">{version.systemRequirements.minMemory}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <HardDrive className="h-3 w-3 text-slate-400" />
                                <span className="text-slate-400">{version.systemRequirements.minDisk}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <strong className="text-slate-300">Supported Platforms:</strong>
                            <div className="mt-1 space-y-1">
                              <div className="flex flex-wrap gap-1">
                                {version.systemRequirements.supportedOS.map((os, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                                    {os}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {version.systemRequirements.supportedArch.map((arch, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                                    {arch}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Host Selection */}
              <div>
                <Label className="text-slate-300 text-base font-semibold">Select Target Host</Label>
                {connectedHosts.length === 0 ? (
                  <div className="mt-3 p-4 border border-yellow-500 bg-yellow-500/10 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-400">No connected hosts available</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Please add and connect hosts before installing components.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {connectedHosts.map((host) => (
                      <div 
                        key={host.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedHost === host.id 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-slate-600 hover:border-blue-400'
                        }`}
                        onClick={() => setSelectedHost(host.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                            <span className="font-semibold text-white">{host.name}</span>
                          </div>
                          <Badge className="bg-green-600 text-white text-xs">Connected</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400">IP:</span>
                            <span className="text-white ml-1">{host.ip}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">OS:</span>
                            <span className="text-white ml-1">{host.os}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Arch:</span>
                            <span className="text-white ml-1">{host.architecture}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Components:</span>
                            <span className="text-white ml-1">{host.installedComponents.length}</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">CPU:</span>
                            <span className="text-white">{host.resources.cpu}%</span>
                          </div>
                          <Progress value={host.resources.cpu} className="h-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Installation Options */}
              <div>
                <Label className="text-slate-300 text-base font-semibold">Installation Options</Label>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm text-slate-400">Start service after installation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm text-slate-400">Enable service auto-start</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm text-slate-400">Create default configuration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span className="text-sm text-slate-400">Configure firewall rules</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                <Button variant="outline" onClick={() => setShowVersionDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleInstallComponent}
                  disabled={!selectedVersion || !selectedHost}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install Component
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Configuration Guide Dialog */}
      <Dialog open={showConfigGuide} onOpenChange={setShowConfigGuide}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configuration Guide</DialogTitle>
            <DialogDescription>
              Setup and configuration instructions
            </DialogDescription>
          </DialogHeader>
          
          {selectedComponent && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <h3 className="font-semibold text-white mb-2">
                  {components.find(c => c.id === selectedComponent)?.name} Configuration
                </h3>
                <p className="text-sm text-slate-400">
                  Detailed configuration instructions and examples will be displayed here.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={() => setShowConfigGuide(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}