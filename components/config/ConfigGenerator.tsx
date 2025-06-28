'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Settings, 
  FileCode, 
  Download, 
  Copy, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Trash2,
  Eye,
  Edit,
  Target,
  Database,
  Network,
  Server,
  Activity,
  Zap,
  Globe,
  Shield,
  Monitor,
  Router,
  Layers,
  Code,
  FileText,
  Upload,
  RefreshCw,
  Play,
  Pause,
  GitBranch,
  Package,
  Cpu,
  HardDrive,
  Wifi,
  Bell,
  Calendar,
  Clock,
  Users,
  Key,
  Lock
} from 'lucide-react';

interface MIBOid {
  id: string;
  name: string;
  oid: string;
  type: 'counter' | 'gauge' | 'string' | 'integer';
  description: string;
  vendor: string;
  category: string;
  unit?: string;
  mibFile: string;
  selected: boolean;
}

interface ConfigTemplate {
  id: string;
  name: string;
  type: 'snmp-exporter' | 'categraf' | 'prometheus' | 'grafana' | 'victoriametrics';
  description: string;
  version: string;
  features: string[];
  requiredOids: string[];
  optionalOids: string[];
  configSample: string;
}

interface GeneratedConfig {
  id: string;
  name: string;
  type: string;
  content: string;
  createdAt: string;
  status: 'draft' | 'validated' | 'deployed';
  targetDevices: string[];
  selectedOids: string[];
}

export function ConfigGenerator() {
  const [activeTab, setActiveTab] = useState('oid-selection');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedOids, setSelectedOids] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generatedConfig, setGeneratedConfig] = useState<string>('');
  const [configName, setConfigName] = useState('');

  // Mock MIB OIDs data from MIB module
  const mibOids: MIBOid[] = [
    {
      id: '1',
      name: 'sysDescr',
      oid: '1.3.6.1.2.1.1.1.0',
      type: 'string',
      description: 'System description',
      vendor: 'Standard',
      category: 'System',
      mibFile: 'SNMPv2-MIB',
      selected: false
    },
    {
      id: '2',
      name: 'sysUpTime',
      oid: '1.3.6.1.2.1.1.3.0',
      type: 'counter',
      description: 'System uptime in hundredths of seconds',
      vendor: 'Standard',
      category: 'System',
      unit: 'centiseconds',
      mibFile: 'SNMPv2-MIB',
      selected: false
    },
    {
      id: '3',
      name: 'ifInOctets',
      oid: '1.3.6.1.2.1.2.2.1.10',
      type: 'counter',
      description: 'Interface input octets',
      vendor: 'Standard',
      category: 'Interface',
      unit: 'bytes',
      mibFile: 'IF-MIB',
      selected: false
    },
    {
      id: '4',
      name: 'ifOutOctets',
      oid: '1.3.6.1.2.1.2.2.1.16',
      type: 'counter',
      description: 'Interface output octets',
      vendor: 'Standard',
      category: 'Interface',
      unit: 'bytes',
      mibFile: 'IF-MIB',
      selected: false
    },
    {
      id: '5',
      name: 'cpuUtilization',
      oid: '1.3.6.1.4.1.9.9.109.1.1.1.1.7',
      type: 'gauge',
      description: 'CPU utilization percentage',
      vendor: 'Cisco',
      category: 'Performance',
      unit: 'percent',
      mibFile: 'CISCO-PROCESS-MIB',
      selected: false
    },
    {
      id: '6',
      name: 'memoryUtilization',
      oid: '1.3.6.1.4.1.9.9.48.1.1.1.5',
      type: 'gauge',
      description: 'Memory utilization percentage',
      vendor: 'Cisco',
      category: 'Performance',
      unit: 'percent',
      mibFile: 'CISCO-MEMORY-POOL-MIB',
      selected: false
    },
    {
      id: '7',
      name: 'temperatureSensor',
      oid: '1.3.6.1.4.1.9.9.13.1.3.1.3',
      type: 'gauge',
      description: 'Temperature sensor reading',
      vendor: 'Cisco',
      category: 'Environmental',
      unit: 'celsius',
      mibFile: 'CISCO-ENVMON-MIB',
      selected: false
    },
    {
      id: '8',
      name: 'powerSupplyStatus',
      oid: '1.3.6.1.4.1.9.9.13.1.5.1.3',
      type: 'integer',
      description: 'Power supply operational status',
      vendor: 'Cisco',
      category: 'Environmental',
      mibFile: 'CISCO-ENVMON-MIB',
      selected: false
    }
  ];

  const configTemplates: ConfigTemplate[] = [
    {
      id: 'snmp-exporter-basic',
      name: 'SNMP Exporter - Basic Monitoring',
      type: 'snmp-exporter',
      description: 'Basic SNMP monitoring configuration for network devices',
      version: '0.25.0',
      features: ['System Metrics', 'Interface Statistics', 'SNMP v2c/v3 Support'],
      requiredOids: ['1', '2', '3', '4'],
      optionalOids: ['5', '6'],
      configSample: `# SNMP Exporter Configuration
modules:
  default:
    walk:
      - 1.3.6.1.2.1.1.1.0  # sysDescr
      - 1.3.6.1.2.1.1.3.0  # sysUpTime
    metrics:
      - name: snmp_up
        oid: 1.3.6.1.2.1.1.1.0
        type: gauge`
    },
    {
      id: 'categraf-network',
      name: 'Categraf - Network Device Monitoring',
      type: 'categraf',
      description: 'Comprehensive network device monitoring with Categraf',
      version: '0.3.60',
      features: ['Multi-vendor Support', 'Interface Monitoring', 'Performance Metrics'],
      requiredOids: ['1', '2', '3', '4'],
      optionalOids: ['5', '6', '7', '8'],
      configSample: `# Categraf SNMP Configuration
[[inputs.snmp]]
  agents = ["192.168.1.1:161"]
  version = 2
  community = "public"
  interval = "60s"
  
  [[inputs.snmp.field]]
    name = "hostname"
    oid = "1.3.6.1.2.1.1.5.0"`
    },
    {
      id: 'snmp-exporter-cisco',
      name: 'SNMP Exporter - Cisco Devices',
      type: 'snmp-exporter',
      description: 'Specialized configuration for Cisco network equipment',
      version: '0.25.0',
      features: ['Cisco-specific OIDs', 'CPU/Memory Monitoring', 'Environmental Sensors'],
      requiredOids: ['1', '2', '5', '6'],
      optionalOids: ['7', '8'],
      configSample: `# Cisco SNMP Exporter Configuration
modules:
  cisco_ios:
    walk:
      - 1.3.6.1.4.1.9.9.109.1.1.1.1.7  # CPU
      - 1.3.6.1.4.1.9.9.48.1.1.1.5     # Memory
    metrics:
      - name: cisco_cpu_utilization
        oid: 1.3.6.1.4.1.9.9.109.1.1.1.1.7
        type: gauge`
    },
    {
      id: 'categraf-performance',
      name: 'Categraf - Performance Monitoring',
      type: 'categraf',
      description: 'High-frequency performance monitoring configuration',
      version: '0.3.60',
      features: ['High-frequency Polling', 'Performance Metrics', 'Alerting Integration'],
      requiredOids: ['5', '6', '7'],
      optionalOids: ['8'],
      configSample: `# Categraf Performance Configuration
[[inputs.snmp]]
  agents = ["192.168.1.0/24"]
  version = 2
  community = "public"
  interval = "30s"
  timeout = "10s"
  
  [[inputs.snmp.table]]
    name = "interface"
    inherit_tags = ["hostname"]
    oid = "1.3.6.1.2.1.2.2"`
    }
  ];

  const generatedConfigs: GeneratedConfig[] = [
    {
      id: '1',
      name: 'Core Router SNMP Config',
      type: 'snmp-exporter',
      content: '# Generated SNMP Exporter configuration...',
      createdAt: '2024-01-15 14:30:00',
      status: 'deployed',
      targetDevices: ['Core-Router-01', 'Core-Router-02'],
      selectedOids: ['1', '2', '3', '4', '5']
    },
    {
      id: '2',
      name: 'Switch Monitoring Config',
      type: 'categraf',
      content: '# Generated Categraf configuration...',
      createdAt: '2024-01-15 13:45:00',
      status: 'validated',
      targetDevices: ['Access-Switch-01', 'Access-Switch-02'],
      selectedOids: ['1', '2', '3', '4']
    }
  ];

  const categories = ['all', 'System', 'Interface', 'Performance', 'Environmental', 'Security'];

  const getOidTypeIcon = (type: MIBOid['type']) => {
    switch (type) {
      case 'counter': return <Activity className="h-4 w-4 text-blue-400" />;
      case 'gauge': return <Cpu className="h-4 w-4 text-green-400" />;
      case 'string': return <FileText className="h-4 w-4 text-purple-400" />;
      case 'integer': return <Database className="h-4 w-4 text-orange-400" />;
      default: return <Globe className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTemplateIcon = (type: ConfigTemplate['type']) => {
    switch (type) {
      case 'snmp-exporter': return <Network className="h-5 w-5 text-blue-400" />;
      case 'categraf': return <Activity className="h-5 w-5 text-green-400" />;
      case 'prometheus': return <Database className="h-5 w-5 text-orange-400" />;
      case 'grafana': return <Monitor className="h-5 w-5 text-purple-400" />;
      case 'victoriametrics': return <Server className="h-5 w-5 text-red-400" />;
      default: return <Settings className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusIcon = (status: GeneratedConfig['status']) => {
    switch (status) {
      case 'deployed': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'validated': return <CheckCircle2 className="h-4 w-4 text-blue-400" />;
      case 'draft': return <Clock className="h-4 w-4 text-yellow-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-red-400" />;
    }
  };

  const filteredOids = mibOids.filter(oid => {
    const matchesSearch = oid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         oid.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         oid.oid.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || oid.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOidSelection = (oidId: string) => {
    setSelectedOids(prev => 
      prev.includes(oidId) 
        ? prev.filter(id => id !== oidId)
        : [...prev, oidId]
    );
  };

  const generateConfiguration = () => {
    if (!selectedTemplate || selectedOids.length === 0) return;

    const template = configTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const selectedOidObjects = mibOids.filter(oid => selectedOids.includes(oid.id));
    
    let config = '';
    
    if (template.type === 'snmp-exporter') {
      config = `# SNMP Exporter Configuration
# Generated on: ${new Date().toISOString()}
# Template: ${template.name}
# Selected OIDs: ${selectedOids.length}

modules:
  ${configName || 'default'}:
    walk:
${selectedOidObjects.map(oid => `      - ${oid.oid}  # ${oid.name} - ${oid.description}`).join('\n')}
    
    metrics:
${selectedOidObjects.map(oid => `      - name: ${oid.name.toLowerCase().replace(/([A-Z])/g, '_$1').toLowerCase()}
        oid: ${oid.oid}
        type: ${oid.type === 'counter' ? 'counter' : 'gauge'}
        help: "${oid.description}"
        indexes:
        - labelname: instance
          type: gauge`).join('\n')}

    lookups:
      - labels:
        - instance
        labelname: instance
        oid: ${selectedOidObjects[0]?.oid || '1.3.6.1.2.1.1.1.0'}
        type: DisplayString

# Usage Instructions:
# 1. Save this configuration to snmp.yml
# 2. Start SNMP Exporter: ./snmp_exporter --config.file=snmp.yml
# 3. Test with: curl 'http://localhost:9116/snmp?target=192.168.1.1&module=${configName || 'default'}'
# 4. Add to Prometheus scrape config:
#    - job_name: 'snmp'
#      static_configs:
#        - targets: ['192.168.1.1']
#      metrics_path: /snmp
#      params:
#        module: [${configName || 'default'}]
#      relabel_configs:
#        - source_labels: [__address__]
#          target_label: __param_target
#        - source_labels: [__param_target]
#          target_label: instance
#        - target_label: __address__
#          replacement: localhost:9116`;
    } else if (template.type === 'categraf') {
      config = `# Categraf SNMP Configuration
# Generated on: ${new Date().toISOString()}
# Template: ${template.name}
# Selected OIDs: ${selectedOids.length}

[[inputs.snmp]]
  # SNMP agent configuration
  agents = ["192.168.1.1:161"]  # Update with your device IPs
  version = 2
  community = "public"  # Update with your SNMP community
  interval = "60s"
  timeout = "10s"
  retries = 3
  
  # Agent host tag
  [inputs.snmp.tags]
    agent_host = "network-device"

${selectedOidObjects.map(oid => `  # ${oid.description}
  [[inputs.snmp.field]]
    name = "${oid.name.toLowerCase()}"
    oid = "${oid.oid}"
    conversion = "${oid.type === 'counter' ? 'float' : 'int'}"
    ${oid.unit ? `unit = "${oid.unit}"` : ''}`).join('\n\n')}

# Usage Instructions:
# 1. Save this configuration to conf.d/input.snmp/snmp.toml
# 2. Update the agents list with your device IPs
# 3. Update SNMP community string if different from 'public'
# 4. For SNMP v3, replace community with:
#    sec_name = "username"
#    auth_protocol = "MD5"
#    auth_password = "authpass"
#    sec_level = "authPriv"
#    priv_protocol = "DES"
#    priv_password = "privpass"
# 5. Restart Categraf: systemctl restart categraf
# 6. Check metrics: curl http://localhost:9100/metrics | grep snmp`;
    }

    setGeneratedConfig(config);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedConfig);
  };

  const downloadConfig = () => {
    const template = configTemplates.find(t => t.id === selectedTemplate);
    const filename = template?.type === 'snmp-exporter' ? 'snmp.yml' : 'snmp.toml';
    const blob = new Blob([generatedConfig], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Available OIDs</p>
                <p className="text-2xl font-bold text-blue-400">{mibOids.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Selected OIDs</p>
                <p className="text-2xl font-bold text-green-400">{selectedOids.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Templates</p>
                <p className="text-2xl font-bold text-purple-400">{configTemplates.length}</p>
              </div>
              <FileCode className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Generated Configs</p>
                <p className="text-2xl font-bold text-orange-400">{generatedConfigs.length}</p>
              </div>
              <Settings className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="oid-selection">
            <Database className="h-4 w-4 mr-2" />
            OID Selection
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileCode className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="generator">
            <Settings className="h-4 w-4 mr-2" />
            Generator
          </TabsTrigger>
          <TabsTrigger value="configs">
            <Package className="h-4 w-4 mr-2" />
            Generated Configs
          </TabsTrigger>
        </TabsList>

        {/* OID Selection Tab */}
        <TabsContent value="oid-selection" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">MIB OID Selection</CardTitle>
              <CardDescription className="text-slate-400">
                Select OIDs from your MIB library to include in the configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search OIDs by name, description, or OID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
                <Button 
                  onClick={() => setSelectedOids([])}
                  variant="outline" 
                  className="border-slate-600 text-slate-300"
                >
                  Clear Selection
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredOids.map((oid) => (
              <Card 
                key={oid.id} 
                className={`border transition-all cursor-pointer ${
                  selectedOids.includes(oid.id) 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-slate-600 hover:border-blue-400'
                }`}
                onClick={() => handleOidSelection(oid.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        checked={selectedOids.includes(oid.id)}
                        onChange={() => handleOidSelection(oid.id)}
                      />
                      {getOidTypeIcon(oid.type)}
                      <div>
                        <h3 className="font-semibold text-white">{oid.name}</h3>
                        <p className="text-sm text-slate-400 font-mono">{oid.oid}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${
                        oid.type === 'counter' ? 'bg-blue-600' :
                        oid.type === 'gauge' ? 'bg-green-600' :
                        oid.type === 'string' ? 'bg-purple-600' : 'bg-orange-600'
                      } text-white`}>
                        {oid.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                        {oid.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-3">{oid.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div><strong>Vendor:</strong> {oid.vendor}</div>
                    <div><strong>MIB File:</strong> {oid.mibFile}</div>
                    {oid.unit && <div><strong>Unit:</strong> {oid.unit}</div>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Configuration Templates</CardTitle>
              <CardDescription className="text-slate-400">
                Choose a template for your monitoring configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {configTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`border transition-all cursor-pointer ${
                      selectedTemplate === template.id 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-slate-600 hover:border-blue-400'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getTemplateIcon(template.type)}
                          <div>
                            <h3 className="font-semibold text-white">{template.name}</h3>
                            <p className="text-sm text-slate-400">{template.type} v{template.version}</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-600 text-white">
                          {template.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-300 mb-4">{template.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {template.features.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Required OIDs: {template.requiredOids.length}</p>
                          <p className="text-xs text-slate-500">Optional OIDs: {template.optionalOids.length}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-slate-700">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full border-slate-600 text-slate-300"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Generator Tab */}
        <TabsContent value="generator" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Configuration Generator</CardTitle>
              <CardDescription className="text-slate-400">
                Generate complete monitoring configuration from selected OIDs and template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Configuration Name</Label>
                  <Input 
                    placeholder="my-network-config"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Selected Template</Label>
                  <div className="p-2 bg-slate-700 border border-slate-600 rounded-md text-white">
                    {selectedTemplate ? 
                      configTemplates.find(t => t.id === selectedTemplate)?.name || 'None' 
                      : 'No template selected'
                    }
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Selected OIDs ({selectedOids.length})</Label>
                  <div className="max-h-32 overflow-y-auto p-2 bg-slate-700 border border-slate-600 rounded-md">
                    {selectedOids.length > 0 ? (
                      <div className="space-y-1">
                        {selectedOids.map(oidId => {
                          const oid = mibOids.find(o => o.id === oidId);
                          return oid ? (
                            <div key={oidId} className="text-xs text-slate-300">
                              {oid.name} ({oid.oid})
                            </div>
                          ) : null;
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No OIDs selected</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300">Generation Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <span className="text-sm text-slate-400">Include usage instructions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <span className="text-sm text-slate-400">Add metric descriptions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox />
                      <span className="text-sm text-slate-400">Generate Prometheus rules</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={generateConfiguration}
                  disabled={!selectedTemplate || selectedOids.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Generate Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          {generatedConfig && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Generated Configuration</CardTitle>
                    <CardDescription className="text-slate-400">
                      Ready to deploy monitoring configuration
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={copyToClipboard}
                      variant="outline" 
                      size="sm"
                      className="border-slate-600 text-slate-300"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button 
                      onClick={downloadConfig}
                      variant="outline" 
                      size="sm"
                      className="border-slate-600 text-slate-300"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                    {generatedConfig}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Generated Configs Tab */}
        <TabsContent value="configs" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Generated Configurations</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage and deploy your generated configurations
                  </CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Configuration
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedConfigs.map((config) => (
                  <div key={config.id} className="p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(config.status)}
                        <div>
                          <h3 className="font-semibold text-white">{config.name}</h3>
                          <p className="text-sm text-slate-400">{config.type} • {config.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${
                          config.status === 'deployed' ? 'bg-green-600' :
                          config.status === 'validated' ? 'bg-blue-600' : 'bg-yellow-600'
                        } text-white`}>
                          {config.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-slate-500">Target Devices</p>
                        <p className="text-white">{config.targetDevices.length} devices</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Selected OIDs</p>
                        <p className="text-white">{config.selectedOids.length} OIDs</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Configuration Type</p>
                        <p className="text-white">{config.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-1">
                        {config.targetDevices.slice(0, 2).map((device, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                            {device}
                          </Badge>
                        ))}
                        {config.targetDevices.length > 2 && (
                          <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                            +{config.targetDevices.length - 2}
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Upload className="h-4 w-4" />
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
      </Tabs>
    </div>
  );
}