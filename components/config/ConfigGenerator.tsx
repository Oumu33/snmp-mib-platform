'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Lock,
  Info
} from 'lucide-react';

// 从MIB模块获取真实OID数据的接口
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

export default function ConfigGenerator() {
  const [activeTab, setActiveTab] = useState('oid-selection');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedOids, setSelectedOids] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generatedConfig, setGeneratedConfig] = useState<string>('');
  const [configName, setConfigName] = useState('');
  const [mibOids, setMibOids] = useState<MIBOid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从后端API获取真实的MIB OID数据
  useEffect(() => {
    fetchMIBOids();
  }, []);

  const fetchMIBOids = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 调用后端API获取已解析的MIB文件中的OID
      const response = await fetch('/api/v1/mibs/oids');
      
      if (!response.ok) {
        throw new Error('Failed to fetch MIB OIDs');
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        setError('没有找到可用的MIB OID。请先上传并解析MIB文件。');
        setMibOids([]);
      } else {
        setMibOids(data.map((oid: any) => ({
          ...oid,
          selected: false
        })));
      }
    } catch (err) {
      console.error('Error fetching MIB OIDs:', err);
      setError('无法获取MIB OID数据。请检查网络连接或联系管理员。');
      setMibOids([]);
    } finally {
      setLoading(false);
    }
  };

  const configTemplates: ConfigTemplate[] = [
    {
      id: 'snmp-exporter-basic',
      name: 'SNMP Exporter - 基础监控',
      type: 'snmp-exporter',
      description: '基础SNMP监控配置，适用于网络设备',
      version: '0.25.0',
      features: ['系统指标', '接口统计', 'SNMP v2c/v3支持'],
      requiredOids: [],
      optionalOids: [],
      configSample: `# SNMP Exporter 基础配置模板`
    },
    {
      id: 'categraf-network',
      name: 'Categraf - 网络设备监控',
      type: 'categraf',
      description: 'Categraf网络设备监控配置',
      version: '0.3.60',
      features: ['多厂商支持', '接口监控', '性能指标'],
      requiredOids: [],
      optionalOids: [],
      configSample: `# Categraf SNMP配置模板`
    }
  ];

  const generatedConfigs: GeneratedConfig[] = [
    {
      id: '1',
      name: '核心路由器SNMP配置',
      type: 'snmp-exporter',
      content: '# 生成的SNMP Exporter配置...',
      createdAt: '2024-01-15 14:30:00',
      status: 'deployed',
      targetDevices: ['Core-Router-01', 'Core-Router-02'],
      selectedOids: []
    }
  ];

  // 获取可用的类别和厂商（从真实数据中提取）
  const categories = ['all', ...Array.from(new Set(mibOids.map(oid => oid.category)))];
  const vendors = ['all', ...Array.from(new Set(mibOids.map(oid => oid.vendor)))];

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
    const matchesVendor = selectedVendor === 'all' || oid.vendor === selectedVendor;
    return matchesSearch && matchesCategory && matchesVendor;
  });

  const handleOidSelection = (oidId: string) => {
    setSelectedOids(prev => 
      prev.includes(oidId) 
        ? prev.filter(id => id !== oidId)
        : [...prev, oidId]
    );
  };

  const handleSelectAllByVendor = (vendor: string) => {
    const vendorOids = mibOids.filter(oid => oid.vendor === vendor).map(oid => oid.id);
    setSelectedOids(prev => {
      const newSelection = [...prev];
      vendorOids.forEach(oidId => {
        if (!newSelection.includes(oidId)) {
          newSelection.push(oidId);
        }
      });
      return newSelection;
    });
  };

  const generateConfiguration = () => {
    if (!selectedTemplate || selectedOids.length === 0) {
      setError('请选择模板和至少一个OID');
      return;
    }

    const template = configTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const selectedOidObjects = mibOids.filter(oid => selectedOids.includes(oid.id));
    
    let config = '';
    
    if (template.type === 'snmp-exporter') {
      config = generateSNMPExporterConfig(selectedOidObjects, configName || 'default');
    } else if (template.type === 'categraf') {
      config = generateCategrafConfig(selectedOidObjects, configName || 'default');
    }

    setGeneratedConfig(config);
  };

  const generateSNMPExporterConfig = (oids: MIBOid[], moduleName: string) => {
    const walkOids = oids.map(oid => oid.oid);
    const metrics = oids.map(oid => ({
      name: oid.name.toLowerCase().replace(/([A-Z])/g, '_$1').toLowerCase(),
      oid: oid.oid,
      type: oid.type === 'counter' ? 'counter' : 'gauge',
      help: oid.description,
      unit: oid.unit || ''
    }));

    return `# SNMP Exporter Configuration
# Generated on: ${new Date().toISOString()}
# Module: ${moduleName}
# Selected OIDs: ${oids.length}
# Source MIB Files: ${Array.from(new Set(oids.map(o => o.mibFile))).join(', ')}

modules:
  ${moduleName}:
    walk:
${walkOids.map(oid => `      - ${oid}  # ${oids.find(o => o.oid === oid)?.name} - ${oids.find(o => o.oid === oid)?.description}`).join('\n')}
    
    metrics:
${metrics.map(metric => `      - name: ${metric.name}
        oid: ${metric.oid}
        type: ${metric.type}
        help: "${metric.help}"${metric.unit ? `\n        unit: "${metric.unit}"` : ''}
        indexes:
        - labelname: instance
          type: gauge`).join('\n')}

    lookups:
      - labels:
        - instance
        labelname: instance
        oid: ${walkOids[0] || '1.3.6.1.2.1.1.1.0'}
        type: DisplayString

# Usage Instructions:
# 1. Save this configuration to snmp.yml
# 2. Start SNMP Exporter: ./snmp_exporter --config.file=snmp.yml
# 3. Test with: curl 'http://localhost:9116/snmp?target=192.168.1.1&module=${moduleName}'
# 4. Add to Prometheus scrape config:
#    - job_name: 'snmp'
#      static_configs:
#        - targets: ['192.168.1.1']
#      metrics_path: /snmp
#      params:
#        module: [${moduleName}]
#      relabel_configs:
#        - source_labels: [__address__]
#          target_label: __param_target
#        - source_labels: [__param_target]
#          target_label: instance
#        - target_label: __address__
#          replacement: localhost:9116`;
  };

  const generateCategrafConfig = (oids: MIBOid[], configName: string) => {
    return `# Categraf SNMP Configuration
# Generated on: ${new Date().toISOString()}
# Configuration: ${configName}
# Selected OIDs: ${oids.length}
# Source MIB Files: ${Array.from(new Set(oids.map(o => o.mibFile))).join(', ')}

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
    config_name = "${configName}"

${oids.map(oid => `  # ${oid.description}
  [[inputs.snmp.field]]
    name = "${oid.name.toLowerCase()}"
    oid = "${oid.oid}"
    conversion = "${oid.type === 'counter' ? 'float' : 'int'}"${oid.unit ? `\n    unit = "${oid.unit}"` : ''}
    # Source: ${oid.mibFile} (${oid.vendor})`).join('\n\n')}

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
                <p className="text-sm text-slate-400">可用OIDs</p>
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
                <p className="text-sm text-slate-400">已选OIDs</p>
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
                <p className="text-sm text-slate-400">厂商数量</p>
                <p className="text-2xl font-bold text-purple-400">{vendors.length - 1}</p>
              </div>
              <Package className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">配置模板</p>
                <p className="text-2xl font-bold text-orange-400">{configTemplates.length}</p>
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
            OID选择
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileCode className="h-4 w-4 mr-2" />
            配置模板
          </TabsTrigger>
          <TabsTrigger value="generator">
            <Settings className="h-4 w-4 mr-2" />
            配置生成
          </TabsTrigger>
          <TabsTrigger value="configs">
            <Package className="h-4 w-4 mr-2" />
            已生成配置
          </TabsTrigger>
        </TabsList>

        {/* OID Selection Tab */}
        <TabsContent value="oid-selection" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">MIB OID选择</CardTitle>
                  <CardDescription className="text-slate-400">
                    从已解析的MIB文件中选择OID用于配置生成
                  </CardDescription>
                </div>
                <Button onClick={fetchMIBOids} variant="outline" className="border-slate-600 text-slate-300">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  刷新数据
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-400 mr-2" />
                  <span className="text-slate-400">正在加载MIB数据...</span>
                </div>
              ) : error ? (
                <Alert className="border-yellow-500 bg-yellow-500/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-yellow-400">
                    {error}
                    <div className="mt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-yellow-500 text-yellow-400"
                        onClick={() => setActiveTab('mib-upload')}
                      >
                        前往MIB管理
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="搜索OID名称、描述或OID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-slate-400" />
                      <select
                        value={selectedVendor}
                        onChange={(e) => setSelectedVendor(e.target.value)}
                        className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                      >
                        {vendors.map(vendor => (
                          <option key={vendor} value={vendor}>
                            {vendor === 'all' ? '所有厂商' : vendor}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? '所有类别' : category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button 
                      onClick={() => setSelectedOids([])}
                      variant="outline" 
                      className="border-slate-600 text-slate-300"
                    >
                      清空选择
                    </Button>
                  </div>

                  {/* 快速选择按钮 */}
                  {vendors.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm text-slate-400 mr-2">快速选择:</span>
                      {vendors.filter(v => v !== 'all').map(vendor => (
                        <Button
                          key={vendor}
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 text-xs"
                          onClick={() => handleSelectAllByVendor(vendor)}
                        >
                          选择所有{vendor}
                        </Button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {!loading && !error && filteredOids.length === 0 && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 text-center">
                <Database className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">没有找到匹配的OID</h3>
                <p className="text-slate-400 mb-4">
                  {mibOids.length === 0 
                    ? '请先上传并解析MIB文件，然后返回此页面选择OID。'
                    : '请调整搜索条件或筛选器。'
                  }
                </p>
                {mibOids.length === 0 && (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.location.href = '#mib-manager'}
                  >
                    前往MIB管理
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* OID Grid */}
          {!loading && !error && filteredOids.length > 0 && (
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
                      <div><strong>厂商:</strong> {oid.vendor}</div>
                      <div><strong>MIB文件:</strong> {oid.mibFile}</div>
                      {oid.unit && <div><strong>单位:</strong> {oid.unit}</div>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">配置模板</CardTitle>
              <CardDescription className="text-slate-400">
                选择监控配置模板
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
                          <p className="text-xs text-slate-500 mb-1">特性:</p>
                          <div className="flex flex-wrap gap-1">
                            {template.features.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-slate-700">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full border-slate-600 text-slate-300"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          预览模板
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
              <CardTitle className="text-white">配置生成器</CardTitle>
              <CardDescription className="text-slate-400">
                基于选择的OID和模板生成完整的监控配置
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">配置名称</Label>
                  <Input 
                    placeholder="my-network-config"
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">选择的模板</Label>
                  <div className="p-2 bg-slate-700 border border-slate-600 rounded-md text-white">
                    {selectedTemplate ? 
                      configTemplates.find(t => t.id === selectedTemplate)?.name || '无' 
                      : '未选择模板'
                    }
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">已选OIDs ({selectedOids.length})</Label>
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
                      <p className="text-xs text-slate-500">未选择OID</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-slate-300">生成选项</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <span className="text-sm text-slate-400">包含使用说明</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <span className="text-sm text-slate-400">添加指标描述</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox />
                      <span className="text-sm text-slate-400">生成Prometheus规则</span>
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
                  生成配置
                </Button>
              </div>

              {error && (
                <Alert className="border-red-500 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {generatedConfig && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">生成的配置</CardTitle>
                    <CardDescription className="text-slate-400">
                      可部署的监控配置文件
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
                      复制
                    </Button>
                    <Button 
                      onClick={downloadConfig}
                      variant="outline" 
                      size="sm"
                      className="border-slate-600 text-slate-300"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      下载
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
                  <CardTitle className="text-white">已生成的配置</CardTitle>
                  <CardDescription className="text-slate-400">
                    管理和部署已生成的配置文件
                  </CardDescription>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  新建配置
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
                          {config.status === 'deployed' ? '已部署' : 
                           config.status === 'validated' ? '已验证' : '草稿'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-slate-500">目标设备</p>
                        <p className="text-white">{config.targetDevices.length} 台设备</p>
                      </div>
                      <div>
                        <p className="text-slate-500">选择的OIDs</p>
                        <p className="text-white">{config.selectedOids.length} 个OID</p>
                      </div>
                      <div>
                        <p className="text-slate-500">配置类型</p>
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