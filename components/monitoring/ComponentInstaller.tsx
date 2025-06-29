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
import { 
  Download, 
  Server, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Eye,
  Trash2,
  Target,
  Globe,
  Shield,
  Database,
  Monitor,
  Zap,
  Network,
  BarChart3,
  GitBranch,
  ExternalLink,
  Info,
  AlertCircle,
  Loader2,
  Star,
  Calendar,
  Package,
  Code,
  FileText,
  Users,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';
import { HostSelection } from './HostSelection';

// GitHub API interfaces for real-time version checking
interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  body: string;
  html_url: string;
  assets: Array<{
    name: string;
    browser_download_url: string;
    size: number;
    download_count: number;
  }>;
}

interface ComponentVersion {
  version: string;
  releaseDate: string;
  isPrerelease: boolean;
  downloadUrl: string;
  changelog: string;
  downloadCount: number;
  size: number;
  isLatest: boolean;
  isRecommended: boolean;
}

interface Component {
  id: string;
  name: string;
  type: 'collector' | 'storage' | 'visualization' | 'alerting';
  description: string;
  githubRepo: string; // GitHub repository for version checking
  officialSite: string;
  documentation: string;
  defaultPort: number;
  configPath: string;
  serviceName: string;
  supportedOS: string[];
  supportedArch: string[];
  dependencies: string[];
  versions: ComponentVersion[]; // Real-time versions from GitHub
  lastVersionCheck: string;
  status: 'available' | 'checking' | 'error';
  category: string;
  vendor: string;
  license: string;
  minSystemRequirements: {
    cpu: string;
    memory: string;
    disk: string;
  };
}

interface Installation {
  id: string;
  componentId: string;
  componentName: string;
  version: string;
  hostId: string;
  hostName: string;
  status: 'pending' | 'installing' | 'completed' | 'failed' | 'running' | 'stopped';
  progress: number;
  startTime: string;
  endTime?: string;
  logs: string[];
  error?: string;
}

export default function ComponentInstaller() {
  const [activeTab, setActiveTab] = useState('components');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [selectedHost, setSelectedHost] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showConfigGuide, setShowConfigGuide] = useState(false);
  const [selectedComponentForGuide, setSelectedComponentForGuide] = useState<Component | null>(null);
  const [versionCheckInProgress, setVersionCheckInProgress] = useState<string[]>([]);

  // Initialize components with GitHub repositories
  const initializeComponents = (): Component[] => [
    {
      id: 'node-exporter',
      name: 'Node Exporter',
      type: 'collector',
      description: 'Prometheus exporter for hardware and OS metrics',
      githubRepo: 'prometheus/node_exporter',
      officialSite: 'https://prometheus.io/docs/guides/node-exporter/',
      documentation: 'https://github.com/prometheus/node_exporter/blob/master/README.md',
      defaultPort: 9100,
      configPath: '/etc/node_exporter/node_exporter.yml',
      serviceName: 'node_exporter',
      supportedOS: ['Linux', 'macOS', 'Windows'],
      supportedArch: ['amd64', 'arm64', 'armv7'],
      dependencies: [],
      versions: [],
      lastVersionCheck: '',
      status: 'available',
      category: 'System Monitoring',
      vendor: 'Prometheus',
      license: 'Apache 2.0',
      minSystemRequirements: {
        cpu: '1 core',
        memory: '128MB',
        disk: '100MB'
      }
    },
    {
      id: 'categraf',
      name: 'Categraf',
      type: 'collector',
      description: 'All-in-one telemetry collector for metrics, logs and traces',
      githubRepo: 'flashcatcloud/categraf',
      officialSite: 'https://flashcat.cloud/categraf/',
      documentation: 'https://github.com/flashcatcloud/categraf/blob/main/README.md',
      defaultPort: 9100,
      configPath: '/etc/categraf/conf.d/',
      serviceName: 'categraf',
      supportedOS: ['Linux', 'Windows'],
      supportedArch: ['amd64', 'arm64'],
      dependencies: [],
      versions: [],
      lastVersionCheck: '',
      status: 'available',
      category: 'Telemetry Collection',
      vendor: 'FlashCat',
      license: 'MIT',
      minSystemRequirements: {
        cpu: '1 core',
        memory: '256MB',
        disk: '200MB'
      }
    },
    {
      id: 'snmp-exporter',
      name: 'SNMP Exporter',
      type: 'collector',
      description: 'Prometheus exporter for SNMP devices',
      githubRepo: 'prometheus/snmp_exporter',
      officialSite: 'https://prometheus.io/docs/instrumenting/exporters/',
      documentation: 'https://github.com/prometheus/snmp_exporter/blob/main/README.md',
      defaultPort: 9116,
      configPath: '/etc/snmp_exporter/snmp.yml',
      serviceName: 'snmp_exporter',
      supportedOS: ['Linux', 'macOS', 'Windows'],
      supportedArch: ['amd64', 'arm64'],
      dependencies: [],
      versions: [],
      lastVersionCheck: '',
      status: 'available',
      category: 'Network Monitoring',
      vendor: 'Prometheus',
      license: 'Apache 2.0',
      minSystemRequirements: {
        cpu: '1 core',
        memory: '512MB',
        disk: '100MB'
      }
    },
    {
      id: 'victoriametrics',
      name: 'VictoriaMetrics',
      type: 'storage',
      description: 'Fast, cost-effective monitoring solution and time series database',
      githubRepo: 'VictoriaMetrics/VictoriaMetrics',
      officialSite: 'https://victoriametrics.com/',
      documentation: 'https://docs.victoriametrics.com/',
      defaultPort: 8428,
      configPath: '/etc/victoriametrics/victoria-metrics.conf',
      serviceName: 'victoriametrics',
      supportedOS: ['Linux', 'macOS', 'Windows'],
      supportedArch: ['amd64', 'arm64'],
      dependencies: [],
      versions: [],
      lastVersionCheck: '',
      status: 'available',
      category: 'Time Series Database',
      vendor: 'VictoriaMetrics',
      license: 'Apache 2.0',
      minSystemRequirements: {
        cpu: '2 cores',
        memory: '1GB',
        disk: '10GB'
      }
    },
    {
      id: 'vmstorage',
      name: 'VMStorage',
      type: 'storage',
      description: 'VictoriaMetrics cluster storage component',
      githubRepo: 'VictoriaMetrics/VictoriaMetrics',
      officialSite: 'https://docs.victoriametrics.com/Cluster-VictoriaMetrics.html',
      documentation: 'https://docs.victoriametrics.com/Cluster-VictoriaMetrics.html#vmstorage',
      defaultPort: 8482,
      configPath: '/etc/victoriametrics/vmstorage.conf',
      serviceName: 'vmstorage',
      supportedOS: ['Linux'],
      supportedArch: ['amd64', 'arm64'],
      dependencies: [],
      versions: [],
      lastVersionCheck: '',
      status: 'available',
      category: 'Cluster Storage',
      vendor: 'VictoriaMetrics',
      license: 'Apache 2.0',
      minSystemRequirements: {
        cpu: '4 cores',
        memory: '4GB',
        disk: '100GB'
      }
    },
    {
      id: 'vminsert',
      name: 'VMInsert',
      type: 'storage',
      description: 'VictoriaMetrics cluster insert component',
      githubRepo: 'VictoriaMetrics/VictoriaMetrics',
      officialSite: 'https://docs.victoriametrics.com/Cluster-VictoriaMetrics.html',
      documentation: 'https://docs.victoriametrics.com/Cluster-VictoriaMetrics.html#vminsert',
      defaultPort: 8480,
      configPath: '/etc/victoriametrics/vminsert.conf',
      serviceName: 'vminsert',
      supportedOS: ['Linux'],
      supportedArch: ['amd64', 'arm64'],
      dependencies: ['vmstorage'],
      versions: [],
      lastVersionCheck: '',
      status: 'available',
      category: 'Cluster Insert',
      vendor: 'VictoriaMetrics',
      license: 'Apache 2.0',
      minSystemRequirements: {
        cpu: '2 cores',
        memory: '2GB',
        disk: '10GB'
      }
    },
    {
      id: 'vmselect',
      name: 'VMSelect',
      type: 'storage',
      description: 'VictoriaMetrics cluster select component',
      githubRepo: 'VictoriaMetrics/VictoriaMetrics',
      officialSite: 'https://docs.victoriametrics.com/Cluster-VictoriaMetrics.html',
      documentation: 'https://docs.victoriametrics.com/Cluster-VictoriaMetrics.html#vmselect',
      defaultPort: 8481,
      configPath: '/etc/victoriametrics/vmselect.conf',
      serviceName: 'vmselect',
      supportedOS: ['Linux'],
      supportedArch: ['amd64', 'arm64'],
      dependencies: ['vmstorage'],
      versions: [],
      lastVersionCheck: '',
      status: 'available',
      category: 'Cluster Select',
      vendor: 'VictoriaMetrics',
      license: 'Apache 2.0',
      minSystemRequirements: {
        cpu: '2 cores',
        memory: '2GB',
        disk: '10GB'
      }
    },
    {
      id: 'vmagent',
      name: 'VMAgent',
      type: 'collector',
      description: 'VictoriaMetrics agent for collecting metrics',
      githubRepo: 'VictoriaMetrics/VictoriaMetrics',
      officialSite: 'https://docs.victoriametrics.com/vmagent.html',
      documentation: 'https://docs.victoriametrics.com/vmagent.html',
      defaultPort: 8429,
      configPath: '/etc/vmagent/vmagent.yml',
      serviceName: 'vmagent',
      supportedOS: ['Linux', 'macOS', 'Windows'],
      supportedArch: ['amd64', 'arm64'],
      dependencies: [],
      versions: [],
      lastVersionCheck: '',
      status: 'available',
      category: 'Metrics Collection',
      vendor: 'VictoriaMetrics',
      license: 'Apache 2.0',
      minSystemRequirements: {
        cpu: '1 core',
        memory: '512MB',
        disk: '1GB'
      }
    },
    {
      id: 'grafana',
      name: 'Grafana',
      type: 'visualization',
      description: 'Open source analytics and interactive visualization platform',
      githubRepo: 'grafana/grafana',
      officialSite: 'https://grafana.com/',
      documentation: 'https://grafana.com/docs/',
      defaultPort: 3000,
      configPath: '/etc/grafana/grafana.ini',
      serviceName: 'grafana-server',
      supportedOS: ['Linux', 'macOS', 'Windows'],
      supportedArch: ['amd64', 'arm64'],
      dependencies: [],
      versions: [],
      lastVersionCheck: '',
      status: 'available',
      category: 'Visualization',
      vendor: 'Grafana Labs',
      license: 'AGPL-3.0',
      minSystemRequirements: {
        cpu: '2 cores',
        memory: '1GB',
        disk: '2GB'
      }
    },
    {
      id: 'vmalert',
      name: 'VMAlert',
      type: 'alerting',
      description: 'VictoriaMetrics alerting component',
      githubRepo: 'VictoriaMetrics/VictoriaMetrics',
      officialSite: 'https://docs.victoriametrics.com/vmalert.html',
      documentation: 'https://docs.victoriametrics.com/vmalert.html',
      defaultPort: 8880,
      configPath: '/etc/vmalert/vmalert.yml',
      serviceName: 'vmalert',
      supportedOS: ['Linux', 'macOS', 'Windows'],
      supportedArch: ['amd64', 'arm64'],
      dependencies: ['victoriametrics'],
      versions: [],
      lastVersionCheck: '',
      status: 'available',
      category: 'Alerting',
      vendor: 'VictoriaMetrics',
      license: 'Apache 2.0',
      minSystemRequirements: {
        cpu: '1 core',
        memory: '512MB',
        disk: '1GB'
      }
    },
    {
      id: 'alertmanager',
      name: 'Alertmanager',
      type: 'alerting',
      description: 'Prometheus Alertmanager handles alerts sent by client applications',
      githubRepo: 'prometheus/alertmanager',
      officialSite: 'https://prometheus.io/docs/alerting/latest/alertmanager/',
      documentation: 'https://github.com/prometheus/alertmanager/blob/main/README.md',
      defaultPort: 9093,
      configPath: '/etc/alertmanager/alertmanager.yml',
      serviceName: 'alertmanager',
      supportedOS: ['Linux', 'macOS', 'Windows'],
      supportedArch: ['amd64', 'arm64'],
      dependencies: [],
      versions: [],
      lastVersionCheck: '',
      status: 'available',
      category: 'Alert Management',
      vendor: 'Prometheus',
      license: 'Apache 2.0',
      minSystemRequirements: {
        cpu: '1 core',
        memory: '512MB',
        disk: '1GB'
      }
    }
  ];

  // Fetch real-time versions from GitHub API
  const fetchVersionsFromGitHub = async (component: Component): Promise<ComponentVersion[]> => {
    try {
      const response = await fetch(`https://api.github.com/repos/${component.githubRepo}/releases`);
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const releases: GitHubRelease[] = await response.json();
      
      // Filter and process releases
      const versions: ComponentVersion[] = releases
        .filter(release => !release.draft) // Exclude draft releases
        .slice(0, 10) // Limit to latest 10 releases
        .map((release, index) => {
          // Find appropriate asset for download
          const asset = release.assets.find(asset => 
            asset.name.includes('linux') && asset.name.includes('amd64')
          ) || release.assets[0];

          return {
            version: release.tag_name.replace(/^v/, ''), // Remove 'v' prefix
            releaseDate: new Date(release.published_at).toLocaleDateString(),
            isPrerelease: release.prerelease,
            downloadUrl: asset?.browser_download_url || '',
            changelog: release.body || 'No changelog available',
            downloadCount: asset?.download_count || 0,
            size: asset?.size || 0,
            isLatest: index === 0 && !release.prerelease,
            isRecommended: index === 0 || (!release.prerelease && index <= 2)
          };
        });

      return versions;
    } catch (error) {
      console.error(`Error fetching versions for ${component.name}:`, error);
      return [];
    }
  };

  // Check versions for all components
  const checkAllVersions = async () => {
    const componentList = initializeComponents();
    setComponents(componentList);
    setLoading(true);

    for (const component of componentList) {
      setVersionCheckInProgress(prev => [...prev, component.id]);
      
      try {
        const versions = await fetchVersionsFromGitHub(component);
        
        setComponents(prev => prev.map(c => 
          c.id === component.id 
            ? { 
                ...c, 
                versions, 
                lastVersionCheck: new Date().toISOString(),
                status: versions.length > 0 ? 'available' : 'error'
              }
            : c
        ));
      } catch (error) {
        setComponents(prev => prev.map(c => 
          c.id === component.id 
            ? { ...c, status: 'error', lastVersionCheck: new Date().toISOString() }
            : c
        ));
      } finally {
        setVersionCheckInProgress(prev => prev.filter(id => id !== component.id));
      }
    }

    setLoading(false);
  };

  // Check versions for a specific component
  const checkComponentVersions = async (componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    setVersionCheckInProgress(prev => [...prev, componentId]);
    
    try {
      const versions = await fetchVersionsFromGitHub(component);
      
      setComponents(prev => prev.map(c => 
        c.id === componentId 
          ? { 
              ...c, 
              versions, 
              lastVersionCheck: new Date().toISOString(),
              status: versions.length > 0 ? 'available' : 'error'
            }
          : c
      ));
    } catch (error) {
      setComponents(prev => prev.map(c => 
        c.id === componentId 
          ? { ...c, status: 'error', lastVersionCheck: new Date().toISOString() }
          : c
      ));
    } finally {
      setVersionCheckInProgress(prev => prev.filter(id => id !== componentId));
    }
  };

  // Initialize on component mount
  useEffect(() => {
    checkAllVersions();
    fetchInstallations();
  }, []);

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

  const installComponent = async () => {
    if (!selectedComponent || !selectedHost || !selectedVersion) {
      setError('Please select component, host, and version');
      return;
    }

    setIsInstalling(true);
    setError(null);

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
        // Create installation record
        const newInstallation: Installation = {
          id: Date.now().toString(),
          componentId: selectedComponent,
          componentName: components.find(c => c.id === selectedComponent)?.name || '',
          version: selectedVersion,
          hostId: selectedHost,
          hostName: `Host-${selectedHost}`,
          status: 'installing',
          progress: 0,
          startTime: new Date().toISOString(),
          logs: ['Installation started...']
        };

        setInstallations(prev => [newInstallation, ...prev]);
        
        // Simulate installation progress
        simulateInstallation(newInstallation.id);
        
        // Reset selections
        setSelectedComponent(null);
        setSelectedHost(null);
        setSelectedVersion('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Installation failed');
      }
    } catch (err) {
      console.error('Error installing component:', err);
      setError('Error occurred during installation');
    } finally {
      setIsInstalling(false);
    }
  };

  const simulateInstallation = (installationId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      
      setInstallations(prev => prev.map(inst => 
        inst.id === installationId 
          ? { 
              ...inst, 
              progress: Math.min(progress, 100),
              logs: [
                ...inst.logs,
                `Progress: ${Math.min(progress, 100).toFixed(1)}%`,
                ...(progress > 50 ? ['Configuring service...'] : []),
                ...(progress > 80 ? ['Starting service...'] : [])
              ]
            }
          : inst
      ));

      if (progress >= 100) {
        clearInterval(interval);
        setInstallations(prev => prev.map(inst => 
          inst.id === installationId 
            ? { 
                ...inst, 
                status: 'completed',
                progress: 100,
                endTime: new Date().toISOString(),
                logs: [...inst.logs, 'Installation completed successfully!']
              }
            : inst
        ));
      }
    }, 1000);
  };

  const getTypeIcon = (type: Component['type']) => {
    switch (type) {
      case 'collector': return <Activity className="h-5 w-5 text-blue-400" />;
      case 'storage': return <Database className="h-5 w-5 text-green-400" />;
      case 'visualization': return <BarChart3 className="h-5 w-5 text-purple-400" />;
      case 'alerting': return <Zap className="h-5 w-5 text-orange-400" />;
      default: return <Package className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: Installation['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'installing': return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'running': return <Play className="h-4 w-4 text-green-400" />;
      case 'stopped': return <Pause className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDownloadCount = (count: number): string => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  const openConfigGuide = (component: Component) => {
    setSelectedComponentForGuide(component);
    setShowConfigGuide(true);
  };

  const availableComponents = components.filter(c => c.status === 'available').length;
  const totalInstallations = installations.length;
  const runningInstallations = installations.filter(i => i.status === 'installing').length;
  const completedInstallations = installations.filter(i => i.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Available Components</p>
                <p className="text-2xl font-bold text-blue-400">{availableComponents}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Installations</p>
                <p className="text-2xl font-bold text-green-400">{totalInstallations}</p>
              </div>
              <Download className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Installing</p>
                <p className="text-2xl font-bold text-yellow-400">{runningInstallations}</p>
              </div>
              <Loader2 className="h-8 w-8 text-yellow-400 animate-spin" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-purple-400">{completedInstallations}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-purple-400" />
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
            <Download className="h-4 w-4 mr-2" />
            Installations
          </TabsTrigger>
        </TabsList>

        {/* Components Tab */}
        <TabsContent value="components" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Available Components</CardTitle>
                  <CardDescription className="text-slate-400">
                    Real-time versions from GitHub repositories
                  </CardDescription>
                </div>
                <Button 
                  onClick={checkAllVersions} 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking Versions...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh All Versions
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {components.map((component) => (
                  <Card 
                    key={component.id} 
                    className={`border transition-all cursor-pointer ${
                      selectedComponent === component.id 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-slate-600 hover:border-blue-400'
                    }`}
                    onClick={() => setSelectedComponent(component.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(component.type)}
                          <div>
                            <h3 className="font-semibold text-white">{component.name}</h3>
                            <p className="text-sm text-slate-400">{component.vendor}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${
                            component.type === 'collector' ? 'bg-blue-600' :
                            component.type === 'storage' ? 'bg-green-600' :
                            component.type === 'visualization' ? 'bg-purple-600' : 'bg-orange-600'
                          } text-white`}>
                            {component.type}
                          </Badge>
                          {versionCheckInProgress.includes(component.id) && (
                            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-300 mb-4">{component.description}</p>
                      
                      {/* Version Information */}
                      <div className="space-y-3 mb-4">
                        {component.versions.length > 0 ? (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-500">Latest Version:</span>
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-green-600 text-white text-xs">
                                  v{component.versions[0]?.version}
                                </Badge>
                                {component.versions[0]?.isPrerelease && (
                                  <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-400">
                                    Pre-release
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-xs text-slate-500">
                              Released: {component.versions[0]?.releaseDate}
                            </div>
                            {component.versions[0]?.downloadCount > 0 && (
                              <div className="text-xs text-slate-500">
                                Downloads: {formatDownloadCount(component.versions[0].downloadCount)}
                              </div>
                            )}
                          </div>
                        ) : component.status === 'checking' ? (
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                            <span className="text-xs text-slate-400">Checking versions...</span>
                          </div>
                        ) : (
                          <div className="text-xs text-red-400">
                            Unable to fetch versions
                          </div>
                        )}
                      </div>
                      
                      {/* GitHub Repository Link */}
                      <div className="flex items-center space-x-2 mb-4">
                        <GitBranch className="h-3 w-3 text-slate-500" />
                        <a 
                          href={`https://github.com/${component.githubRepo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>{component.githubRepo}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      
                      {/* System Requirements */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
                        <div><strong>CPU:</strong> {component.minSystemRequirements.cpu}</div>
                        <div><strong>Memory:</strong> {component.minSystemRequirements.memory}</div>
                        <div><strong>Port:</strong> {component.defaultPort}</div>
                        <div><strong>License:</strong> {component.license}</div>
                      </div>
                      
                      {/* Supported Platforms */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {component.supportedOS.map((os, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                            {os}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-slate-500">
                          {component.lastVersionCheck && (
                            <span>Updated: {new Date(component.lastVersionCheck).toLocaleTimeString()}</span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              checkComponentVersions(component.id);
                            }}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              openConfigGuide(component);
                            }}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(component.documentation, '_blank');
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Installation Panel */}
          {selectedComponent && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Install Component</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure installation settings for {components.find(c => c.id === selectedComponent)?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-300">Select Version</Label>
                    <select 
                      value={selectedVersion}
                      onChange={(e) => setSelectedVersion(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Choose version...</option>
                      {components.find(c => c.id === selectedComponent)?.versions.map((version) => (
                        <option key={version.version} value={version.version}>
                          v{version.version} 
                          {version.isLatest && ' (Latest)'} 
                          {version.isPrerelease && ' (Pre-release)'}
                          {version.isRecommended && !version.isLatest && ' (Recommended)'}
                        </option>
                      ))}
                    </select>
                    {selectedVersion && (
                      <div className="mt-2 p-2 bg-slate-700/50 rounded text-xs">
                        {(() => {
                          const version = components.find(c => c.id === selectedComponent)?.versions.find(v => v.version === selectedVersion);
                          return version ? (
                            <div className="space-y-1">
                              <div>Released: {version.releaseDate}</div>
                              {version.size > 0 && <div>Size: {formatFileSize(version.size)}</div>}
                              {version.downloadCount > 0 && <div>Downloads: {formatDownloadCount(version.downloadCount)}</div>}
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-slate-300">Target Host</Label>
                    <select 
                      value={selectedHost || ''}
                      onChange={(e) => setSelectedHost(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="">Choose host...</option>
                      <option value="localhost">localhost (127.0.0.1)</option>
                      <option value="server-01">monitoring-server-01 (192.168.1.10)</option>
                      <option value="server-02">storage-server-01 (192.168.1.11)</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    className="border-slate-600 text-slate-300"
                    onClick={() => {
                      setSelectedComponent(null);
                      setSelectedHost(null);
                      setSelectedVersion('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={installComponent}
                    disabled={!selectedComponent || !selectedHost || !selectedVersion || isInstalling}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isInstalling ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Installing...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Install Component
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Host Management Tab */}
        <TabsContent value="hosts">
          <HostSelection />
        </TabsContent>

        {/* Installations Tab */}
        <TabsContent value="installations" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Installation History</CardTitle>
                  <CardDescription className="text-slate-400">
                    Monitor component installation progress and status
                  </CardDescription>
                </div>
                <Button onClick={fetchInstallations} variant="outline" className="border-slate-600 text-slate-300">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {installations.length === 0 ? (
                <div className="text-center py-8">
                  <Download className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-300 mb-2">No Installations</h3>
                  <p className="text-slate-400">
                    Install components to see installation history here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {installations.map((installation) => (
                    <div key={installation.id} className="p-4 border border-slate-600 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(installation.status)}
                          <div>
                            <h3 className="font-semibold text-white">{installation.componentName}</h3>
                            <p className="text-sm text-slate-400">
                              v{installation.version} on {installation.hostName}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${
                            installation.status === 'completed' ? 'bg-green-600' :
                            installation.status === 'installing' ? 'bg-blue-600' :
                            installation.status === 'failed' ? 'bg-red-600' : 'bg-yellow-600'
                          } text-white`}>
                            {installation.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {installation.status === 'installing' && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-white">{installation.progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={installation.progress} className="h-2" />
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <p className="text-slate-500">Started</p>
                          <p className="text-white">{new Date(installation.startTime).toLocaleString()}</p>
                        </div>
                        {installation.endTime && (
                          <div>
                            <p className="text-slate-500">Completed</p>
                            <p className="text-white">{new Date(installation.endTime).toLocaleString()}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-slate-500">Duration</p>
                          <p className="text-white">
                            {installation.endTime 
                              ? `${Math.round((new Date(installation.endTime).getTime() - new Date(installation.startTime).getTime()) / 1000)}s`
                              : 'In progress...'
                            }
                          </p>
                        </div>
                      </div>
                      
                      {installation.error && (
                        <div className="p-2 bg-red-500/20 border border-red-500 rounded text-sm text-red-400 mb-3">
                          {installation.error}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-slate-500">
                          Last log: {installation.logs[installation.logs.length - 1]}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {installation.status === 'completed' && (
                            <>
                              <Button variant="ghost" size="sm">
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Pause className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-400">
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
      </Tabs>

      {/* Configuration Guide Dialog */}
      <Dialog open={showConfigGuide} onOpenChange={setShowConfigGuide}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              {selectedComponentForGuide?.name} Configuration Guide
            </DialogTitle>
            <DialogDescription>
              Complete setup and configuration instructions
            </DialogDescription>
          </DialogHeader>
          
          {selectedComponentForGuide && (
            <div className="space-y-6 py-4">
              {/* Component Overview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Component Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><strong className="text-slate-300">Type:</strong> {selectedComponentForGuide.type}</p>
                    <p><strong className="text-slate-300">Default Port:</strong> {selectedComponentForGuide.defaultPort}</p>
                    <p><strong className="text-slate-300">Service Name:</strong> {selectedComponentForGuide.serviceName}</p>
                    <p><strong className="text-slate-300">License:</strong> {selectedComponentForGuide.license}</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong className="text-slate-300">Config Path:</strong> {selectedComponentForGuide.configPath}</p>
                    <p><strong className="text-slate-300">Supported OS:</strong> {selectedComponentForGuide.supportedOS.join(', ')}</p>
                    <p><strong className="text-slate-300">Architectures:</strong> {selectedComponentForGuide.supportedArch.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* System Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">System Requirements</h3>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">CPU</p>
                      <p className="text-white">{selectedComponentForGuide.minSystemRequirements.cpu}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Memory</p>
                      <p className="text-white">{selectedComponentForGuide.minSystemRequirements.memory}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Disk Space</p>
                      <p className="text-white">{selectedComponentForGuide.minSystemRequirements.disk}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Installation Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Installation Steps</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <p className="text-white font-medium">Download and Install</p>
                      <p className="text-slate-400 text-sm">Component will be automatically downloaded and installed on the selected host</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <p className="text-white font-medium">Configure Service</p>
                      <p className="text-slate-400 text-sm">Default configuration will be applied and service will be registered</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <p className="text-white font-medium">Start Service</p>
                      <p className="text-slate-400 text-sm">Service will be started and enabled for automatic startup</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <p className="text-white font-medium">Verify Installation</p>
                      <p className="text-slate-400 text-sm">Check service status and verify component is running correctly</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuration Example */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Default Configuration</h3>
                <div className="bg-slate-900 border border-slate-600 rounded-lg p-4">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap">
{selectedComponentForGuide.id === 'node-exporter' && `# Node Exporter Configuration
# Service will listen on port ${selectedComponentForGuide.defaultPort}
# Metrics endpoint: http://localhost:${selectedComponentForGuide.defaultPort}/metrics

# Systemd service configuration
[Unit]
Description=Node Exporter
After=network.target

[Service]
Type=simple
User=node_exporter
ExecStart=/usr/local/bin/node_exporter
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target`}

{selectedComponentForGuide.id === 'grafana' && `# Grafana Configuration
# Default admin credentials: admin/admin
# Web interface: http://localhost:${selectedComponentForGuide.defaultPort}

[server]
http_port = ${selectedComponentForGuide.defaultPort}
domain = localhost

[database]
type = sqlite3
path = grafana.db

[security]
admin_user = admin
admin_password = admin

[users]
allow_sign_up = false`}

{selectedComponentForGuide.id === 'victoriametrics' && `# VictoriaMetrics Configuration
# HTTP endpoint: http://localhost:${selectedComponentForGuide.defaultPort}
# Metrics ingestion: http://localhost:${selectedComponentForGuide.defaultPort}/api/v1/write

# Command line flags
-storageDataPath=/var/lib/victoriametrics
-retentionPeriod=12
-httpListenAddr=:${selectedComponentForGuide.defaultPort}
-loggerLevel=INFO`}

{!['node-exporter', 'grafana', 'victoriametrics'].includes(selectedComponentForGuide.id) && `# ${selectedComponentForGuide.name} Configuration
# Service will be configured with default settings
# Port: ${selectedComponentForGuide.defaultPort}
# Config file: ${selectedComponentForGuide.configPath}

# Default configuration will be applied during installation
# You can customize the configuration after installation`}
                  </pre>
                </div>
              </div>

              {/* Useful Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Useful Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a 
                    href={selectedComponentForGuide.documentation}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-3 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <FileText className="h-5 w-5 text-blue-400" />
                    <span className="text-white">Documentation</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                  <a 
                    href={`https://github.com/${selectedComponentForGuide.githubRepo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-3 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <GitBranch className="h-5 w-5 text-green-400" />
                    <span className="text-white">GitHub Repository</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                  <a 
                    href={selectedComponentForGuide.officialSite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 p-3 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <Globe className="h-5 w-5 text-purple-400" />
                    <span className="text-white">Official Website</span>
                    <ExternalLink className="h-4 w-4 text-slate-400" />
                  </a>
                  <div className="flex items-center space-x-2 p-3 border border-slate-600 rounded-lg">
                    <Info className="h-5 w-5 text-orange-400" />
                    <span className="text-white">License: {selectedComponentForGuide.license}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end pt-4 border-t border-slate-700">
            <Button onClick={() => setShowConfigGuide(false)}>
              Close Guide
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}