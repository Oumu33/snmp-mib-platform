'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Settings, 
  Code, 
  FileText,
  ExternalLink,
  Copy,
  Check,
  BookOpen,
  Lightbulb,
  Wrench,
  Play,
  Terminal,
  FileCode,
  Globe,
  Shield,
  Database,
  Activity,
  Monitor,
  Bell,
  Zap,
  Server,
  Network,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Package,
  Cpu,
  HardDrive,
  Wifi,
  ArrowRight,
  Users,
  Target,
  Clock,
  Layers,
  Plus,
  GitBranch,
  Tag,
  History,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HostSelection } from './HostSelection';

interface ComponentVersion {
  version: string;
  releaseDate: string;
  isLatest: boolean;
  isStable: boolean;
  changelog: string[];
  downloadUrl: string;
  systemRequirements: {
    cpu: string;
    memory: string;
    disk: string;
  };
}

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

interface Component {
  id: string;
  name: string;
  description: string;
  category: 'collector' | 'storage' | 'visualization' | 'alerting';
  status: 'available' | 'installed' | 'updating';
  currentVersion?: string;
  availableVersions: ComponentVersion[];
  dependencies: string[];
  configRequired: boolean;
  ports: number[];
  systemRequirements: {
    cpu: string;
    memory: string;
    disk: string;
  };
  configGuide?: {
    title: string;
    description: string;
    steps: Array<{
      title: string;
      description: string;
      code?: string;
      note?: string;
      type?: 'info' | 'warning' | 'success';
    }>;
  };
  usageGuide?: {
    title: string;
    description: string;
    quickStart: Array<{
      title: string;
      description: string;
      code?: string;
      url?: string;
    }>;
    commonTasks: Array<{
      title: string;
      description: string;
      steps: string[];
    }>;
  };
  deploymentTips?: Array<{
    type: 'tip' | 'warning' | 'info';
    title: string;
    content: string;
  }>;
}

interface InstallationStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  message: string;
}

const components: Component[] = [
  {
    id: 'node-exporter',
    name: 'Node Exporter',
    description: 'System metrics collector for monitoring CPU, memory, disk, and network resources',
    category: 'collector',
    status: 'available',
    currentVersion: '1.7.0',
    availableVersions: [
      {
        version: '1.7.0',
        releaseDate: '2024-01-15',
        isLatest: true,
        isStable: true,
        changelog: [
          'Added new filesystem metrics',
          'Improved memory usage reporting',
          'Fixed CPU temperature collection on ARM64'
        ],
        downloadUrl: 'https://github.com/prometheus/node_exporter/releases/download/v1.7.0/node_exporter-1.7.0.linux-amd64.tar.gz',
        systemRequirements: {
          cpu: '100m',
          memory: '50Mi',
          disk: '100Mi'
        }
      },
      {
        version: '1.6.1',
        releaseDate: '2023-12-10',
        isLatest: false,
        isStable: true,
        changelog: [
          'Security fixes for metric collection',
          'Performance improvements',
          'Bug fixes for network interface detection'
        ],
        downloadUrl: 'https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz',
        systemRequirements: {
          cpu: '100m',
          memory: '45Mi',
          disk: '90Mi'
        }
      },
      {
        version: '1.6.0',
        releaseDate: '2023-11-20',
        isLatest: false,
        isStable: true,
        changelog: [
          'Added support for new kernel metrics',
          'Improved error handling',
          'Updated dependencies'
        ],
        downloadUrl: 'https://github.com/prometheus/node_exporter/releases/download/v1.6.0/node_exporter-1.6.0.linux-amd64.tar.gz',
        systemRequirements: {
          cpu: '100m',
          memory: '45Mi',
          disk: '90Mi'
        }
      }
    ],
    dependencies: ['systemd'],
    configRequired: true,
    ports: [9100],
    systemRequirements: {
      cpu: '100m',
      memory: '50Mi',
      disk: '100Mi'
    },
    configGuide: {
      title: 'Node Exporter Configuration Guide',
      description: 'Configure Node Exporter to monitor system resource metrics',
      steps: [
        {
          title: '1. Create Configuration File',
          description: 'Create Node Exporter startup configuration',
          code: `# Create configuration directory
sudo mkdir -p /etc/node_exporter

# Create startup configuration file
sudo tee /etc/node_exporter/node_exporter.yml << 'EOF'
# Node Exporter Configuration
web:
  listen-address: ":9100"
  telemetry-path: "/metrics"
  
# Enabled collectors
collectors:
  enabled:
    - cpu
    - meminfo
    - diskstats
    - filesystem
    - netdev
    - loadavg
    - time
    - uname
    - vmstat
EOF`,
          note: 'Enable or disable specific collectors based on your monitoring needs',
          type: 'info'
        }
      ]
    },
    usageGuide: {
      title: 'Node Exporter Usage Guide',
      description: 'How to use Node Exporter for system monitoring',
      quickStart: [
        {
          title: 'Verify Installation',
          description: 'Check if Node Exporter is running properly',
          code: `# Check service status
sudo systemctl status node_exporter

# Test metrics endpoint
curl http://localhost:9100/metrics | head -20`
        }
      ],
      commonTasks: [
        {
          title: 'Monitor Disk Usage',
          description: 'Set up disk space monitoring alerts',
          steps: [
            'Create alert rules in Prometheus',
            'Set disk usage threshold (e.g., 85%)',
            'Configure notification channels (email, Slack, etc.)',
            'Test alert triggering'
          ]
        }
      ]
    },
    deploymentTips: [
      {
        type: 'tip',
        title: 'Performance Optimization',
        content: 'Disable unnecessary collectors to reduce resource consumption and metric count. Only enable collectors you actually need for monitoring.'
      }
    ]
  },
  {
    id: 'snmp-exporter',
    name: 'SNMP Exporter',
    description: 'SNMP protocol monitoring exporter for network devices like routers and switches',
    category: 'collector',
    status: 'available',
    currentVersion: '0.25.0',
    availableVersions: [
      {
        version: '0.25.0',
        releaseDate: '2024-01-10',
        isLatest: true,
        isStable: true,
        changelog: [
          'Added support for SNMPv3 authentication',
          'Improved MIB parsing performance',
          'Fixed memory leaks in long-running instances'
        ],
        downloadUrl: 'https://github.com/prometheus/snmp_exporter/releases/download/v0.25.0/snmp_exporter-0.25.0.linux-amd64.tar.gz',
        systemRequirements: {
          cpu: '200m',
          memory: '100Mi',
          disk: '200Mi'
        }
      },
      {
        version: '0.24.1',
        releaseDate: '2023-12-05',
        isLatest: false,
        isStable: true,
        changelog: [
          'Bug fixes for SNMP timeout handling',
          'Improved error messages',
          'Updated SNMP library dependencies'
        ],
        downloadUrl: 'https://github.com/prometheus/snmp_exporter/releases/download/v0.24.1/snmp_exporter-0.24.1.linux-amd64.tar.gz',
        systemRequirements: {
          cpu: '200m',
          memory: '90Mi',
          disk: '180Mi'
        }
      }
    ],
    dependencies: ['net-snmp'],
    configRequired: true,
    ports: [9116],
    systemRequirements: {
      cpu: '200m',
      memory: '100Mi',
      disk: '200Mi'
    }
  },
  {
    id: 'categraf',
    name: 'Categraf',
    description: 'Modern monitoring data collector supporting multiple protocols and data sources, compatible with Telegraf plugins',
    category: 'collector',
    status: 'available',
    currentVersion: '0.3.60',
    availableVersions: [
      {
        version: '0.3.60',
        releaseDate: '2024-01-12',
        isLatest: true,
        isStable: true,
        changelog: [
          'Added new input plugins for cloud services',
          'Improved configuration validation',
          'Enhanced error reporting and logging'
        ],
        downloadUrl: 'https://github.com/flashcatcloud/categraf/releases/download/v0.3.60/categraf-v0.3.60-linux-amd64.tar.gz',
        systemRequirements: {
          cpu: '100m',
          memory: '100Mi',
          disk: '200Mi'
        }
      },
      {
        version: '0.3.59',
        releaseDate: '2023-12-20',
        isLatest: false,
        isStable: true,
        changelog: [
          'Performance improvements for high-frequency metrics',
          'Bug fixes for SNMP input plugin',
          'Updated documentation and examples'
        ],
        downloadUrl: 'https://github.com/flashcatcloud/categraf/releases/download/v0.3.59/categraf-v0.3.59-linux-amd64.tar.gz',
        systemRequirements: {
          cpu: '100m',
          memory: '90Mi',
          disk: '180Mi'
        }
      }
    ],
    dependencies: [],
    configRequired: true,
    ports: [9100],
    systemRequirements: {
      cpu: '100m',
      memory: '100Mi',
      disk: '200Mi'
    }
  },
  {
    id: 'victoriametrics',
    name: 'VictoriaMetrics',
    description: 'High-performance time series database, Prometheus-compatible with long-term storage support',
    category: 'storage',
    status: 'available',
    currentVersion: '1.95.1',
    availableVersions: [
      {
        version: '1.95.1',
        releaseDate: '2024-01-08',
        isLatest: true,
        isStable: true,
        changelog: [
          'Improved query performance for large datasets',
          'Added new streaming aggregation functions',
          'Enhanced memory management and reduced RAM usage'
        ],
        downloadUrl: 'https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.95.1/victoria-metrics-linux-amd64-v1.95.1.tar.gz',
        systemRequirements: {
          cpu: '500m',
          memory: '1Gi',
          disk: '10Gi'
        }
      },
      {
        version: '1.94.0',
        releaseDate: '2023-12-15',
        isLatest: false,
        isStable: true,
        changelog: [
          'Added support for new PromQL functions',
          'Improved data compression algorithms',
          'Bug fixes for data ingestion edge cases'
        ],
        downloadUrl: 'https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.94.0/victoria-metrics-linux-amd64-v1.94.0.tar.gz',
        systemRequirements: {
          cpu: '500m',
          memory: '900Mi',
          disk: '10Gi'
        }
      }
    ],
    dependencies: [],
    configRequired: true,
    ports: [8428, 8089, 4242],
    systemRequirements: {
      cpu: '500m',
      memory: '1Gi',
      disk: '10Gi'
    }
  },
  {
    id: 'grafana',
    name: 'Grafana',
    description: 'Open-source visualization and monitoring platform supporting multiple data sources with rich charts and dashboards',
    category: 'visualization',
    status: 'available',
    currentVersion: '10.2.0',
    availableVersions: [
      {
        version: '10.2.0',
        releaseDate: '2024-01-05',
        isLatest: true,
        isStable: true,
        changelog: [
          'New panel types and visualization options',
          'Improved dashboard performance',
          'Enhanced alerting capabilities'
        ],
        downloadUrl: 'https://dl.grafana.com/oss/release/grafana-10.2.0.linux-amd64.tar.gz',
        systemRequirements: {
          cpu: '200m',
          memory: '200Mi',
          disk: '1Gi'
        }
      },
      {
        version: '10.1.5',
        releaseDate: '2023-12-01',
        isLatest: false,
        isStable: true,
        changelog: [
          'Security updates and bug fixes',
          'Improved plugin management',
          'Performance optimizations'
        ],
        downloadUrl: 'https://dl.grafana.com/oss/release/grafana-10.1.5.linux-amd64.tar.gz',
        systemRequirements: {
          cpu: '200m',
          memory: '180Mi',
          disk: '900Mi'
        }
      }
    ],
    dependencies: ['sqlite3'],
    configRequired: true,
    ports: [3000],
    systemRequirements: {
      cpu: '200m',
      memory: '200Mi',
      disk: '1Gi'
    }
  }
];

// Mock host data
const availableHosts: Host[] = [
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
  }
];

export default function ComponentInstaller() {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showConfigGuide, setShowConfigGuide] = useState(false);
  const [showUsageGuide, setShowUsageGuide] = useState(false);
  const [showHostSelection, setShowHostSelection] = useState(false);
  const [showVersionSelection, setShowVersionSelection] = useState(false);
  const [showInstallProgress, setShowInstallProgress] = useState(false);
  const [installationSteps, setInstallationSteps] = useState<InstallationStep[]>([]);
  const [activeTab, setActiveTab] = useState('installer');
  const { toast } = useToast();

  const handleInstall = (component: Component) => {
    setSelectedComponent(component);
    // Set default to latest version
    const latestVersion = component.availableVersions.find(v => v.isLatest);
    setSelectedVersion(latestVersion?.version || component.availableVersions[0]?.version || '');
    setShowVersionSelection(true);
  };

  const handleVersionConfirm = () => {
    setShowVersionSelection(false);
    setShowHostSelection(true);
  };

  const handleHostSelect = (host: Host) => {
    setSelectedHost(host);
    setShowHostSelection(false);
    startInstallation();
  };

  const handleUpdate = (component: Component) => {
    setSelectedComponent(component);
    const latestVersion = component.availableVersions.find(v => v.isLatest);
    setSelectedVersion(latestVersion?.version || '');
    
    toast({
      title: "Starting Update",
      description: `Updating ${component.name} to version ${latestVersion?.version}...`,
    });
    
    // Simulate update process
    setTimeout(() => {
      toast({
        title: "Update Complete",
        description: `${component.name} has been updated successfully.`,
      });
    }, 2000);
  };

  const startInstallation = () => {
    if (!selectedComponent || !selectedHost || !selectedVersion) return;

    const selectedVersionInfo = selectedComponent.availableVersions.find(v => v.version === selectedVersion);

    const steps: InstallationStep[] = [
      {
        id: 'connect',
        title: 'Connect to Target Host',
        status: 'pending',
        progress: 0,
        message: `Connecting to ${selectedHost.hostname} (${selectedHost.ip})`
      },
      {
        id: 'download',
        title: 'Download Component',
        status: 'pending',
        progress: 0,
        message: `Downloading ${selectedComponent.name} v${selectedVersion}`
      },
      {
        id: 'install',
        title: 'Install Component',
        status: 'pending',
        progress: 0,
        message: 'Installing binary files and dependencies'
      },
      {
        id: 'configure',
        title: 'Configure Service',
        status: 'pending',
        progress: 0,
        message: 'Creating system service and configuration files'
      },
      {
        id: 'start',
        title: 'Start Service',
        status: 'pending',
        progress: 0,
        message: 'Starting and verifying service status'
      }
    ];

    setInstallationSteps(steps);
    setShowInstallProgress(true);

    // Simulate installation process
    simulateInstallation(steps);
  };

  const simulateInstallation = async (steps: InstallationStep[]) => {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Start current step
      setInstallationSteps(prev => prev.map(s => 
        s.id === step.id 
          ? { ...s, status: 'running', progress: 0 }
          : s
      ));

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setInstallationSteps(prev => prev.map(s => 
          s.id === step.id 
            ? { ...s, progress }
            : s
        ));
      }

      // Complete current step
      setInstallationSteps(prev => prev.map(s => 
        s.id === step.id 
          ? { ...s, status: 'completed', progress: 100 }
          : s
      ));

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Installation complete
    toast({
      title: "Installation Complete",
      description: `${selectedComponent?.name} v${selectedVersion} has been successfully installed on ${selectedHost?.hostname}.`,
    });

    // Auto show configuration guide
    setTimeout(() => {
      setShowInstallProgress(false);
      if (selectedComponent?.configGuide) {
        setShowConfigGuide(true);
      }
    }, 1000);
  };

  const handleUninstall = (component: Component) => {
    toast({
      title: "Starting Uninstall",
      description: `Uninstalling ${component.name}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Uninstall Complete",
        description: `${component.name} has been removed.`,
      });
    }, 1500);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
      toast({
        title: "Copied to Clipboard",
        description: "Configuration code has been copied.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: Component['status']) => {
    switch (status) {
      case 'installed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'updating':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Download className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: Component['status']) => {
    const colors = {
      installed: 'bg-green-600',
      updating: 'bg-yellow-600',
      available: 'bg-blue-600'
    };

    return (
      <Badge className={`${colors[status]} text-white text-xs`}>
        {status === 'installed' ? 'Installed' : status === 'updating' ? 'Updating' : 'Available'}
      </Badge>
    );
  };

  const getCategoryIcon = (category: Component['category']) => {
    switch (category) {
      case 'collector': return <Activity className="h-5 w-5 text-blue-400" />;
      case 'storage': return <Database className="h-5 w-5 text-green-400" />;
      case 'visualization': return <Monitor className="h-5 w-5 text-purple-400" />;
      case 'alerting': return <Bell className="h-5 w-5 text-orange-400" />;
      default: return <Package className="h-5 w-5 text-gray-400" />;
    }
  };

  const getHostStatusIcon = (status: Host['status']) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'connecting': return <Clock className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStepIcon = (status: InstallationStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'running': return <RefreshCw className="h-5 w-5 text-blue-400 animate-spin" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-400" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getVersionBadge = (version: ComponentVersion) => {
    if (version.isLatest) {
      return <Badge className="bg-green-600 text-white text-xs">Latest</Badge>;
    }
    if (version.isStable) {
      return <Badge className="bg-blue-600 text-white text-xs">Stable</Badge>;
    }
    return <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">Legacy</Badge>;
  };

  const categorizedComponents = components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, Component[]>);

  const categoryNames = {
    collector: 'Data Collection',
    storage: 'Data Storage',
    visualization: 'Data Visualization',
    alerting: 'Alert Management'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Intelligent Component Installer</h2>
          <p className="text-slate-400">
            One-click installation of monitoring system components with version selection and complete configuration guides
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="installer" className="data-[state=active]:bg-blue-600">
            <Download className="h-4 w-4 mr-2" />
            Component Installer
          </TabsTrigger>
          <TabsTrigger value="hosts" className="data-[state=active]:bg-green-600">
            <Server className="h-4 w-4 mr-2" />
            Host Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="installer" className="space-y-4">
          <Tabs defaultValue="collector" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
              <TabsTrigger value="collector" className="data-[state=active]:bg-blue-600">
                <Activity className="h-4 w-4 mr-2" />
                Data Collection
              </TabsTrigger>
              <TabsTrigger value="storage" className="data-[state=active]:bg-green-600">
                <Database className="h-4 w-4 mr-2" />
                Data Storage
              </TabsTrigger>
              <TabsTrigger value="visualization" className="data-[state=active]:bg-purple-600">
                <Monitor className="h-4 w-4 mr-2" />
                Data Visualization
              </TabsTrigger>
              <TabsTrigger value="alerting" className="data-[state=active]:bg-orange-600">
                <Bell className="h-4 w-4 mr-2" />
                Alert Management
              </TabsTrigger>
            </TabsList>

            {Object.entries(categorizedComponents).map(([category, categoryComponents]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {categoryComponents.map((component) => (
                    <Card key={component.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getCategoryIcon(component.category)}
                            <div>
                              <CardTitle className="text-lg text-white">{component.name}</CardTitle>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-slate-400">
                                  {component.status === 'installed' && component.currentVersion 
                                    ? `v${component.currentVersion}` 
                                    : `v${component.availableVersions[0]?.version}`
                                  }
                                </span>
                                {getStatusBadge(component.status)}
                                {component.availableVersions.length > 1 && (
                                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                    {component.availableVersions.length} versions
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {getStatusIcon(component.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription className="text-slate-300">{component.description}</CardDescription>
                        
                        {/* Version Information */}
                        {component.status === 'installed' && component.currentVersion && (
                          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-400">Currently Installed</p>
                                <p className="text-xs text-slate-400">Version {component.currentVersion}</p>
                              </div>
                              {component.availableVersions.find(v => v.isLatest)?.version !== component.currentVersion && (
                                <div className="flex items-center space-x-2">
                                  <ArrowUp className="h-4 w-4 text-yellow-400" />
                                  <span className="text-xs text-yellow-400">Update Available</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* System Requirements */}
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                          <p className="text-sm font-medium text-slate-300 mb-2">System Requirements:</p>
                          <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Cpu className="h-3 w-3" />
                              <span>{component.systemRequirements.cpu}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <HardDrive className="h-3 w-3" />
                              <span>{component.systemRequirements.memory}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Database className="h-3 w-3" />
                              <span>{component.systemRequirements.disk}</span>
                            </div>
                          </div>
                        </div>

                        {/* Port Information */}
                        <div>
                          <p className="text-sm font-medium text-slate-300 mb-2">Ports Used:</p>
                          <div className="flex flex-wrap gap-1">
                            {component.ports.map((port) => (
                              <Badge key={port} variant="outline" className="text-xs border-slate-600 text-slate-400">
                                {port}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Dependencies */}
                        {component.dependencies.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-slate-300 mb-2">Dependencies:</p>
                            <div className="flex flex-wrap gap-1">
                              {component.dependencies.map((dep) => (
                                <Badge key={dep} variant="secondary" className="text-xs bg-slate-600 text-slate-300">
                                  {dep}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Deployment Tips */}
                        {component.deploymentTips && (
                          <div className="space-y-2">
                            {component.deploymentTips.slice(0, 1).map((tip, index) => (
                              <Alert key={index} className={`border-l-4 ${
                                tip.type === 'tip' ? 'border-l-blue-500 bg-blue-500/10' :
                                tip.type === 'warning' ? 'border-l-yellow-500 bg-yellow-500/10' :
                                'border-l-green-500 bg-green-500/10'
                              }`}>
                                <Lightbulb className="h-4 w-4" />
                                <AlertDescription className="text-sm">
                                  <strong>{tip.title}:</strong> {tip.content}
                                </AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          {component.status === 'available' && (
                            <Button 
                              onClick={() => handleInstall(component)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Install
                            </Button>
                          )}
                          
                          {component.status === 'installed' && (
                            <>
                              {component.availableVersions.find(v => v.isLatest)?.version !== component.currentVersion && (
                                <Button 
                                  onClick={() => handleUpdate(component)}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  <ArrowUp className="h-4 w-4 mr-2" />
                                  Update
                                </Button>
                              )}
                              <Button 
                                variant="outline"
                                onClick={() => handleUninstall(component)}
                                className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Uninstall
                              </Button>
                            </>
                          )}
                          
                          {component.status === 'updating' && (
                            <Button disabled className="flex-1">
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Updating...
                            </Button>
                          )}

                          {/* Version History Button */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                              >
                                <History className="h-4 w-4 mr-1" />
                                Versions
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <GitBranch className="h-5 w-5" />
                                  {component.name} - Version History
                                </DialogTitle>
                                <DialogDescription>
                                  Available versions and release information
                                </DialogDescription>
                              </DialogHeader>
                              
                              <ScrollArea className="max-h-[60vh] pr-4">
                                <div className="space-y-4">
                                  {component.availableVersions.map((version, index) => (
                                    <div key={version.version} className="p-4 border border-slate-600 rounded-lg">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                          <Tag className="h-4 w-4 text-blue-400" />
                                          <div>
                                            <h4 className="font-semibold text-white">v{version.version}</h4>
                                            <p className="text-sm text-slate-400">{version.releaseDate}</p>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          {getVersionBadge(version)}
                                          {component.currentVersion === version.version && (
                                            <Badge className="bg-green-600 text-white text-xs">Current</Badge>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <p className="text-sm font-medium text-slate-300">Changes:</p>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-400">
                                          {version.changelog.map((change, idx) => (
                                            <li key={idx}>{change}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      
                                      <div className="mt-3 pt-3 border-t border-slate-700">
                                        <div className="grid grid-cols-3 gap-2 text-xs text-slate-500">
                                          <div><strong>CPU:</strong> {version.systemRequirements.cpu}</div>
                                          <div><strong>Memory:</strong> {version.systemRequirements.memory}</div>
                                          <div><strong>Disk:</strong> {version.systemRequirements.disk}</div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>

                          {/* Configuration Guide Button */}
                          {component.configGuide && (
                            <Dialog open={showConfigGuide && selectedComponent?.id === component.id} 
                                   onOpenChange={(open) => {
                                     setShowConfigGuide(open);
                                     if (!open) setSelectedComponent(null);
                                   }}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                                  onClick={() => {
                                    setSelectedComponent(component);
                                    setShowConfigGuide(true);
                                  }}
                                >
                                  <Wrench className="h-4 w-4 mr-1" />
                                  Config
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Wrench className="h-5 w-5" />
                                    {component.configGuide.title}
                                  </DialogTitle>
                                  <DialogDescription>
                                    {component.configGuide.description}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <ScrollArea className="max-h-[60vh] pr-4">
                                  <div className="space-y-6">
                                    {component.configGuide.steps.map((step, index) => (
                                      <div key={index} className="space-y-3">
                                        <div className="flex items-center gap-2">
                                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                            {index + 1}
                                          </div>
                                          <h4 className="font-semibold">{step.title}</h4>
                                        </div>
                                        
                                        <p className="text-sm text-muted-foreground ml-8">
                                          {step.description}
                                        </p>
                                        
                                        {step.code && (
                                          <div className="ml-8 space-y-2">
                                            <div className="relative">
                                              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                                <code>{step.code}</code>
                                              </pre>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => copyToClipboard(step.code!, `${component.id}-config-${index}`)}
                                              >
                                                {copiedCode === `${component.id}-config-${index}` ? (
                                                  <Check className="h-4 w-4" />
                                                ) : (
                                                  <Copy className="h-4 w-4" />
                                                )}
                                              </Button>
                                            </div>
                                            
                                            {step.note && (
                                              <div className={`flex items-start gap-2 p-3 rounded-lg ${
                                                step.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/20' :
                                                step.type === 'success' ? 'bg-green-50 dark:bg-green-950/20' :
                                                'bg-blue-50 dark:bg-blue-950/20'
                                              }`}>
                                                <Info className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                                  step.type === 'warning' ? 'text-yellow-500' :
                                                  step.type === 'success' ? 'text-green-500' :
                                                  'text-blue-500'
                                                }`} />
                                                <p className={`text-sm ${
                                                  step.type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
                                                  step.type === 'success' ? 'text-green-700 dark:text-green-300' :
                                                  'text-blue-700 dark:text-blue-300'
                                                }`}>
                                                  {step.note}
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                        
                                        {index < component.configGuide.steps.length - 1 && (
                                          <Separator className="ml-8" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                          )}

                          {/* Usage Guide Button */}
                          {component.usageGuide && (
                            <Dialog open={showUsageGuide && selectedComponent?.id === component.id} 
                                   onOpenChange={(open) => {
                                     setShowUsageGuide(open);
                                     if (!open) setSelectedComponent(null);
                                   }}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                                  onClick={() => {
                                    setSelectedComponent(component);
                                    setShowUsageGuide(true);
                                  }}
                                >
                                  <BookOpen className="h-4 w-4 mr-1" />
                                  Usage
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh]">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5" />
                                    {component.usageGuide.title}
                                  </DialogTitle>
                                  <DialogDescription>
                                    {component.usageGuide.description}
                                  </DialogDescription>
                                </DialogHeader>
                                
                                <ScrollArea className="max-h-[60vh] pr-4">
                                  <Tabs defaultValue="quickstart" className="space-y-4">
                                    <TabsList>
                                      <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
                                      <TabsTrigger value="tasks">Common Tasks</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="quickstart" className="space-y-4">
                                      {component.usageGuide.quickStart.map((item, index) => (
                                        <div key={index} className="space-y-3">
                                          <h4 className="font-semibold flex items-center gap-2">
                                            <Play className="h-4 w-4" />
                                            {item.title}
                                          </h4>
                                          <p className="text-sm text-muted-foreground">{item.description}</p>
                                          {item.code && (
                                            <div className="relative">
                                              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                                <code>{item.code}</code>
                                              </pre>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => copyToClipboard(item.code!, `${component.id}-usage-${index}`)}
                                              >
                                                {copiedCode === `${component.id}-usage-${index}` ? (
                                                  <Check className="h-4 w-4" />
                                                ) : (
                                                  <Copy className="h-4 w-4" />
                                                )}
                                              </Button>
                                            </div>
                                          )}
                                          {item.url && (
                                            <Button variant="outline" size="sm" asChild>
                                              <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Visit Link
                                              </a>
                                            </Button>
                                          )}
                                        </div>
                                      ))}
                                    </TabsContent>
                                    
                                    <TabsContent value="tasks" className="space-y-4">
                                      {component.usageGuide.commonTasks.map((task, index) => (
                                        <div key={index} className="space-y-3">
                                          <h4 className="font-semibold flex items-center gap-2">
                                            <Terminal className="h-4 w-4" />
                                            {task.title}
                                          </h4>
                                          <p className="text-sm text-muted-foreground">{task.description}</p>
                                          <ol className="list-decimal list-inside space-y-1 text-sm">
                                            {task.steps.map((step, stepIndex) => (
                                              <li key={stepIndex} className="text-muted-foreground">{step}</li>
                                            ))}
                                          </ol>
                                        </div>
                                      ))}
                                    </TabsContent>
                                  </Tabs>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="hosts" className="space-y-4">
          {/* Host Management Section */}
          <HostSelection />
        </TabsContent>
      </Tabs>

      {/* Version Selection Dialog */}
      <Dialog open={showVersionSelection} onOpenChange={setShowVersionSelection}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Select Version to Install
            </DialogTitle>
            <DialogDescription>
              Choose the version of {selectedComponent?.name} to install
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              {selectedComponent?.availableVersions.map((version) => (
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
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedVersion === version.version 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-slate-400'
                      }`}>
                        {selectedVersion === version.version && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">v{version.version}</h4>
                        <p className="text-sm text-slate-400">{version.releaseDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getVersionBadge(version)}
                    </div>
                  </div>
                  
                  <div className="ml-7 space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-500">
                      <div><strong>CPU:</strong> {version.systemRequirements.cpu}</div>
                      <div><strong>Memory:</strong> {version.systemRequirements.memory}</div>
                      <div><strong>Disk:</strong> {version.systemRequirements.disk}</div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-slate-300 mb-1">Changes:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-slate-400">
                        {version.changelog.slice(0, 2).map((change, idx) => (
                          <li key={idx}>{change}</li>
                        ))}
                        {version.changelog.length > 2 && (
                          <li className="text-slate-500">...and {version.changelog.length - 2} more</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowVersionSelection(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleVersionConfirm}
                disabled={!selectedVersion}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Continue with v{selectedVersion}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Host Selection Dialog */}
      <Dialog open={showHostSelection} onOpenChange={setShowHostSelection}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Select Deployment Host
            </DialogTitle>
            <DialogDescription>
              Choose the target host to install {selectedComponent?.name} v{selectedVersion}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-4">
              {availableHosts.map((host) => (
                <Card 
                  key={host.id} 
                  className={`border transition-all cursor-pointer hover:border-blue-400 ${
                    host.status !== 'connected' ? 'opacity-50' : ''
                  }`}
                  onClick={() => host.status === 'connected' && handleHostSelect(host)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getHostStatusIcon(host.status)}
                        <div>
                          <h3 className="font-semibold text-white">{host.hostname}</h3>
                          <p className="text-sm text-slate-400">{host.ip} • {host.os}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${
                          host.status === 'connected' ? 'bg-green-600' : 'bg-red-600'
                        } text-white`}>
                          {host.status === 'connected' ? 'Connected' : 'Disconnected'}
                        </Badge>
                        {host.status === 'connected' && (
                          <ArrowRight className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Specs</p>
                        <p className="text-white">{host.specs.cpu}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Memory</p>
                        <p className="text-white">{host.specs.memory}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Storage</p>
                        <p className="text-white">{host.specs.disk}</p>
                      </div>
                    </div>
                    
                    {host.status === 'connected' && (
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">CPU Usage</span>
                          <span className="text-white">{host.resources.cpu}%</span>
                        </div>
                        <Progress value={host.resources.cpu} className="h-1" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowHostSelection(false)}>
                Cancel
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-600 text-blue-400"
                onClick={() => {
                  // Navigate to host management page
                  setShowHostSelection(false);
                  setActiveTab('hosts');
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Hosts
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Installation Progress Dialog */}
      <Dialog open={showInstallProgress} onOpenChange={setShowInstallProgress}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Installation Progress
            </DialogTitle>
            <DialogDescription>
              Installing {selectedComponent?.name} v{selectedVersion} on {selectedHost?.hostname}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {installationSteps.map((step, index) => (
              <div key={step.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStepIcon(step.status)}
                    <div>
                      <p className="font-medium text-white">{step.title}</p>
                      <p className="text-sm text-slate-400">{step.message}</p>
                    </div>
                  </div>
                  {step.status === 'running' && (
                    <span className="text-sm text-blue-400">{step.progress}%</span>
                  )}
                </div>
                
                {step.status === 'running' && (
                  <Progress value={step.progress} className="h-2" />
                )}
                
                {index < installationSteps.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}