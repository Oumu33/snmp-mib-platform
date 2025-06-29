'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Info,
  Check,
  BookOpen,
  ExternalLink
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
  // 新增字段用于完整配置生成
  snmpIndex?: string;
  tableOid?: string;
  indexPattern?: string;
  metricType?: 'counter' | 'gauge' | 'histogram';
  labels?: string[];
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
  // 新增完整配置模板
  fullConfigTemplate: string;
  deploymentGuide: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
      code?: string;
      note?: string;
    }>;
  };
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
  const [showDeploymentGuide, setShowDeploymentGuide] = useState(false);

  // 从MIB模块获取的完整OID数据（模拟真实数据）
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
      selected: false,
      metricType: 'gauge',
      labels: ['instance']
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
      selected: false,
      metricType: 'counter',
      labels: ['instance']
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
      selected: false,
      tableOid: '1.3.6.1.2.1.2.2',
      snmpIndex: '1.3.6.1.2.1.2.2.1.1',
      indexPattern: 'ifIndex',
      metricType: 'counter',
      labels: ['instance', 'ifIndex', 'ifDescr']
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
      selected: false,
      tableOid: '1.3.6.1.2.1.2.2',
      snmpIndex: '1.3.6.1.2.1.2.2.1.1',
      indexPattern: 'ifIndex',
      metricType: 'counter',
      labels: ['instance', 'ifIndex', 'ifDescr']
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
      selected: false,
      tableOid: '1.3.6.1.4.1.9.9.109.1.1.1',
      snmpIndex: '1.3.6.1.4.1.9.9.109.1.1.1.1.1',
      indexPattern: 'cpmCPUTotalIndex',
      metricType: 'gauge',
      labels: ['instance', 'cpmCPUTotalIndex']
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
      selected: false,
      tableOid: '1.3.6.1.4.1.9.9.48.1.1.1',
      snmpIndex: '1.3.6.1.4.1.9.9.48.1.1.1.1',
      indexPattern: 'ciscoMemoryPoolType',
      metricType: 'gauge',
      labels: ['instance', 'ciscoMemoryPoolType', 'ciscoMemoryPoolName']
    }
  ];

  const configTemplates: ConfigTemplate[] = [
    {
      id: 'snmp-exporter-complete',
      name: 'SNMP Exporter - 完整生产配置',
      type: 'snmp-exporter',
      description: '生产级SNMP Exporter完整配置，包含认证、重试、超时等所有参数',
      version: '0.25.0',
      features: ['完整模块配置', '认证支持', '表格遍历', '标签映射', '指标重命名'],
      requiredOids: ['1', '2', '3', '4'],
      optionalOids: ['5', '6'],
      configSample: `# SNMP Exporter 完整配置示例`,
      fullConfigTemplate: `# SNMP Exporter 完整生产配置
# 生成时间: {{timestamp}}
# 配置名称: {{configName}}
# 选择的OID数量: {{oidCount}}

modules:
  {{moduleName}}:
    # 认证配置
    auth:
      community: "{{community}}"
      security_level: "{{securityLevel}}"
      username: "{{username}}"
      password: "{{password}}"
      auth_protocol: "{{authProtocol}}"
      priv_protocol: "{{privProtocol}}"
      priv_password: "{{privPassword}}"
      context_name: "{{contextName}}"
    
    # 遍历配置
    walk:
{{walkOids}}
    
    # 表格配置
{{tableConfigs}}
    
    # 指标配置
    metrics:
{{metricsConfig}}
    
    # 标签查找配置
    lookups:
{{lookupsConfig}}
    
    # 重写规则
    overrides:
{{overridesConfig}}
    
    # 超时和重试配置
    timeout: 20s
    retries: 3
    max_repetitions: 25
    
    # 版本配置
    version: 2
    
    # 最大OID数量
    max_oids: 60`,
      deploymentGuide: {
        title: 'SNMP Exporter 部署指南',
        steps: [
          {
            title: '1. 下载和安装 SNMP Exporter',
            description: '从官方GitHub下载最新版本的SNMP Exporter',
            code: `# 下载 SNMP Exporter
wget https://github.com/prometheus/snmp_exporter/releases/download/v0.25.0/snmp_exporter-0.25.0.linux-amd64.tar.gz

# 解压
tar xzf snmp_exporter-0.25.0.linux-amd64.tar.gz

# 移动到系统目录
sudo mv snmp_exporter-0.25.0.linux-amd64/snmp_exporter /usr/local/bin/

# 创建配置目录
sudo mkdir -p /etc/snmp_exporter`,
            note: '确保下载适合您系统架构的版本'
          },
          {
            title: '2. 保存配置文件',
            description: '将生成的配置保存到指定位置',
            code: `# 保存配置文件
sudo tee /etc/snmp_exporter/snmp.yml << 'EOF'
# 在这里粘贴生成的配置内容
EOF

# 设置权限
sudo chmod 644 /etc/snmp_exporter/snmp.yml`,
            note: '配置文件路径可以根据需要调整'
          },
          {
            title: '3. 创建 Systemd 服务',
            description: '创建系统服务以便管理SNMP Exporter',
            code: `# 创建服务文件
sudo tee /etc/systemd/system/snmp_exporter.service << 'EOF'
[Unit]
Description=SNMP Exporter
After=network.target

[Service]
Type=simple
User=prometheus
Group=prometheus
ExecStart=/usr/local/bin/snmp_exporter --config.file=/etc/snmp_exporter/snmp.yml
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 重新加载systemd
sudo systemctl daemon-reload

# 启用并启动服务
sudo systemctl enable snmp_exporter
sudo systemctl start snmp_exporter`,
            note: '需要先创建prometheus用户和组'
          },
          {
            title: '4. 验证部署',
            description: '测试SNMP Exporter是否正常工作',
            code: `# 检查服务状态
sudo systemctl status snmp_exporter

# 测试指标抓取
curl 'http://localhost:9116/snmp?target=192.168.1.1&module={{moduleName}}'

# 查看可用模块
curl http://localhost:9116/snmp

# 检查日志
sudo journalctl -u snmp_exporter -f`,
            note: '替换192.168.1.1为您的实际设备IP'
          },
          {
            title: '5. 配置 Prometheus',
            description: '在Prometheus中添加SNMP Exporter作为抓取目标',
            code: `# 在 prometheus.yml 中添加以下配置
scrape_configs:
  - job_name: 'snmp'
    static_configs:
      - targets:
        - 192.168.1.1  # SNMP设备IP
        - 192.168.1.2
    metrics_path: /snmp
    params:
      module: [{{moduleName}}]
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: localhost:9116  # SNMP exporter地址`,
            note: '重启Prometheus以应用新配置'
          }
        ]
      }
    },
    {
      id: 'categraf-complete',
      name: 'Categraf - 完整SNMP配置',
      type: 'categraf',
      description: '完整的Categraf SNMP插件配置，支持多设备、表格、认证等',
      version: '0.3.60',
      features: ['多设备支持', '表格遍历', '标签映射', '认证配置', '批量采集'],
      requiredOids: ['1', '2', '3', '4'],
      optionalOids: ['5', '6'],
      configSample: `# Categraf SNMP 完整配置示例`,
      fullConfigTemplate: `# Categraf SNMP 完整配置
# 生成时间: {{timestamp}}
# 配置名称: {{configName}}
# 选择的OID数量: {{oidCount}}

[[inputs.snmp]]
  # 代理配置
  agents = [
    "{{targetDevices}}"
  ]
  
  # SNMP版本和认证
  version = {{snmpVersion}}
  community = "{{community}}"
  
  # SNMP v3 认证 (如果使用v3)
  sec_name = "{{username}}"
  auth_protocol = "{{authProtocol}}"
  auth_password = "{{authPassword}}"
  sec_level = "{{secLevel}}"
  priv_protocol = "{{privProtocol}}"
  priv_password = "{{privPassword}}"
  context_name = "{{contextName}}"
  
  # 超时和重试
  timeout = "{{timeout}}"
  retries = {{retries}}
  
  # 采集间隔
  interval = "{{interval}}"
  
  # 最大重复次数
  max_repetitions = {{maxRepetitions}}
  
  # 全局标签
  [inputs.snmp.tags]
    device_type = "{{deviceType}}"
    location = "{{location}}"
    environment = "{{environment}}"

{{fieldConfigs}}

{{tableConfigs}}

# 输出配置
[[outputs.prometheus]]
  listen = ":9100"
  metric_version = 2
  
  # 指标前缀
  metric_prefix = "snmp_"
  
  # 标签映射
  [outputs.prometheus.tagpass]
    device_type = ["{{deviceType}}"]`,
      deploymentGuide: {
        title: 'Categraf 部署指南',
        steps: [
          {
            title: '1. 下载和安装 Categraf',
            description: '从官方仓库下载Categraf',
            code: `# 下载 Categraf
wget https://github.com/flashcatcloud/categraf/releases/download/v0.3.60/categraf-v0.3.60-linux-amd64.tar.gz

# 解压
tar xzf categraf-v0.3.60-linux-amd64.tar.gz

# 移动到系统目录
sudo mv categraf /usr/local/bin/

# 创建配置目录
sudo mkdir -p /etc/categraf/conf.d/inputs.snmp`,
            note: '选择适合您系统的版本'
          },
          {
            title: '2. 配置主配置文件',
            description: '创建Categraf主配置文件',
            code: `# 创建主配置文件
sudo tee /etc/categraf/config.toml << 'EOF'
[global]
hostname = ""
omit_hostname = false
precision = "s"
interval = 15
providers = ["local"]

[writer_opt]
batch = 2000
chan_size = 10000

[[writers]]
url = "http://localhost:8428/api/v1/write"

[log]
file_name = "stdout"
level = "INFO"
EOF`,
            note: '根据您的时序数据库调整writer配置'
          },
          {
            title: '3. 保存SNMP配置',
            description: '将生成的SNMP配置保存到指定位置',
            code: `# 保存SNMP配置
sudo tee /etc/categraf/conf.d/inputs.snmp/snmp.toml << 'EOF'
# 在这里粘贴生成的SNMP配置
EOF

# 设置权限
sudo chmod 644 /etc/categraf/conf.d/inputs.snmp/snmp.toml`,
            note: '可以创建多个配置文件用于不同的设备组'
          },
          {
            title: '4. 创建系统服务',
            description: '创建Systemd服务管理Categraf',
            code: `# 创建服务文件
sudo tee /etc/systemd/system/categraf.service << 'EOF'
[Unit]
Description=Categraf
After=network.target

[Service]
Type=simple
User=categraf
Group=categraf
ExecStart=/usr/local/bin/categraf --configs /etc/categraf
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 创建用户
sudo useradd -r -s /bin/false categraf

# 设置权限
sudo chown -R categraf:categraf /etc/categraf

# 启用服务
sudo systemctl daemon-reload
sudo systemctl enable categraf
sudo systemctl start categraf`,
            note: '确保categraf用户有访问配置文件的权限'
          },
          {
            title: '5. 验证和监控',
            description: '验证Categraf是否正常采集数据',
            code: `# 检查服务状态
sudo systemctl status categraf

# 查看日志
sudo journalctl -u categraf -f

# 测试配置
/usr/local/bin/categraf --test --configs /etc/categraf

# 检查指标输出
curl http://localhost:9100/metrics | grep snmp_`,
            note: '确保目标设备的SNMP服务正常运行'
          }
        ]
      }
    }
  ];

  const categories = ['all', 'System', 'Interface', 'Performance', 'Environmental', 'Security'];

  const generateCompleteConfig = () => {
    if (!selectedTemplate || selectedOids.length === 0) return;

    const template = configTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const selectedOidObjects = mibOids.filter(oid => selectedOids.includes(oid.id));
    const timestamp = new Date().toISOString();
    const moduleName = configName || 'default';
    
    let config = template.fullConfigTemplate;
    
    // 替换基本变量
    config = config.replace(/\{\{timestamp\}\}/g, timestamp);
    config = config.replace(/\{\{configName\}\}/g, moduleName);
    config = config.replace(/\{\{oidCount\}\}/g, selectedOids.length.toString());
    config = config.replace(/\{\{moduleName\}\}/g, moduleName);

    if (template.type === 'snmp-exporter') {
      // 生成walk OIDs
      const walkOids = selectedOidObjects
        .filter(oid => !oid.tableOid) // 非表格OID
        .map(oid => `      - ${oid.oid}  # ${oid.name} - ${oid.description}`)
        .join('\n');

      // 生成表格配置
      const tableConfigs = selectedOidObjects
        .filter(oid => oid.tableOid)
        .reduce((acc, oid) => {
          if (!acc[oid.tableOid!]) {
            acc[oid.tableOid!] = {
              name: oid.category.toLowerCase(),
              oid: oid.tableOid!,
              columns: []
            };
          }
          acc[oid.tableOid!].columns.push({
            name: oid.name,
            oid: oid.oid,
            type: oid.type
          });
          return acc;
        }, {} as any);

      const tableConfigStr = Object.values(tableConfigs).map((table: any) => 
        `    # ${table.name} 表格
    - name: ${table.name}
      oid: ${table.oid}
      indexes:
      - labelname: ${table.name}_index
        type: gauge`
      ).join('\n');

      // 生成指标配置
      const metricsConfig = selectedOidObjects.map(oid => 
        `      - name: ${oid.name.toLowerCase().replace(/([A-Z])/g, '_$1').toLowerCase()}
        oid: ${oid.oid}
        type: ${oid.metricType || (oid.type === 'counter' ? 'counter' : 'gauge')}
        help: "${oid.description}"
        indexes:
        - labelname: instance
          type: gauge${oid.labels ? '\n        - labelname: ' + oid.labels.slice(1).join('\n        - labelname: ') : ''}`
      ).join('\n');

      // 生成查找配置
      const lookupsConfig = selectedOidObjects
        .filter(oid => oid.snmpIndex)
        .map(oid => 
          `      - labels:
        - instance
        labelname: ${oid.indexPattern || 'index'}
        oid: ${oid.snmpIndex}
        type: DisplayString`
        ).join('\n');

      // 生成重写规则
      const overridesConfig = selectedOidObjects
        .filter(oid => oid.unit)
        .map(oid => 
          `      ${oid.oid}:
        type: ${oid.metricType || 'gauge'}
        help: ${oid.description} (${oid.unit})`
        ).join('\n');

      config = config.replace(/\{\{walkOids\}\}/g, walkOids);
      config = config.replace(/\{\{tableConfigs\}\}/g, tableConfigStr);
      config = config.replace(/\{\{metricsConfig\}\}/g, metricsConfig);
      config = config.replace(/\{\{lookupsConfig\}\}/g, lookupsConfig);
      config = config.replace(/\{\{overridesConfig\}\}/g, overridesConfig);

      // 设置默认值
      config = config.replace(/\{\{community\}\}/g, 'public');
      config = config.replace(/\{\{securityLevel\}\}/g, 'noAuthNoPriv');
      config = config.replace(/\{\{username\}\}/g, '');
      config = config.replace(/\{\{password\}\}/g, '');
      config = config.replace(/\{\{authProtocol\}\}/g, 'MD5');
      config = config.replace(/\{\{privProtocol\}\}/g, 'DES');
      config = config.replace(/\{\{privPassword\}\}/g, '');
      config = config.replace(/\{\{contextName\}\}/g, '');

    } else if (template.type === 'categraf') {
      // 生成字段配置
      const fieldConfigs = selectedOidObjects
        .filter(oid => !oid.tableOid)
        .map(oid => 
          `  # ${oid.description}
  [[inputs.snmp.field]]
    name = "${oid.name.toLowerCase()}"
    oid = "${oid.oid}"
    conversion = "${oid.type === 'counter' ? 'float' : 'int'}"${oid.unit ? `\n    unit = "${oid.unit}"` : ''}`
        ).join('\n\n');

      // 生成表格配置
      const tableConfigs = selectedOidObjects
        .filter(oid => oid.tableOid)
        .reduce((acc, oid) => {
          if (!acc[oid.tableOid!]) {
            acc[oid.tableOid!] = {
              name: oid.category.toLowerCase(),
              oid: oid.tableOid!,
              fields: []
            };
          }
          acc[oid.tableOid!].fields.push(oid);
          return acc;
        }, {} as any);

      const tableConfigStr = Object.values(tableConfigs).map((table: any) => 
        `  # ${table.name} 表格数据
  [[inputs.snmp.table]]
    name = "${table.name}"
    inherit_tags = ["agent_host"]
    oid = "${table.oid}"
    
${table.fields.map((field: any) => 
  `    [[inputs.snmp.table.field]]
      name = "${field.name.toLowerCase()}"
      oid = "${field.oid}"
      conversion = "${field.type === 'counter' ? 'float' : 'int'}"`
).join('\n\n')}`
      ).join('\n\n');

      config = config.replace(/\{\{fieldConfigs\}\}/g, fieldConfigs);
      config = config.replace(/\{\{tableConfigs\}\}/g, tableConfigStr);

      // 设置默认值
      config = config.replace(/\{\{targetDevices\}\}/g, '"192.168.1.1:161"');
      config = config.replace(/\{\{snmpVersion\}\}/g, '2');
      config = config.replace(/\{\{community\}\}/g, 'public');
      config = config.replace(/\{\{username\}\}/g, '');
      config = config.replace(/\{\{authProtocol\}\}/g, 'MD5');
      config = config.replace(/\{\{authPassword\}\}/g, '');
      config = config.replace(/\{\{secLevel\}\}/g, 'noAuthNoPriv');
      config = config.replace(/\{\{privProtocol\}\}/g, 'DES');
      config = config.replace(/\{\{privPassword\}\}/g, '');
      config = config.replace(/\{\{contextName\}\}/g, '');
      config = config.replace(/\{\{timeout\}\}/g, '10s');
      config = config.replace(/\{\{retries\}\}/g, '3');
      config = config.replace(/\{\{interval\}\}/g, '60s');
      config = config.replace(/\{\{maxRepetitions\}\}/g, '25');
      config = config.replace(/\{\{deviceType\}\}/g, 'network_device');
      config = config.replace(/\{\{location\}\}/g, 'datacenter');
      config = config.replace(/\{\{environment\}\}/g, 'production');
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

  return (
    <div className="space-y-6">
      {/* 配置统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">可用OID</p>
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
                <p className="text-sm text-slate-400">已选OID</p>
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
                <p className="text-sm text-slate-400">配置模板</p>
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
                <p className="text-sm text-slate-400">表格OID</p>
                <p className="text-2xl font-bold text-orange-400">
                  {mibOids.filter(oid => oid.tableOid).length}
                </p>
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
            生成配置
          </TabsTrigger>
        </TabsList>

        {/* OID选择标签页 */}
        <TabsContent value="oid-selection" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">MIB OID选择</CardTitle>
              <CardDescription className="text-slate-400">
                从MIB库中选择要监控的OID指标，支持单个OID和表格遍历
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      {oid.tableOid && (
                        <Badge className="text-xs bg-yellow-600 text-white">
                          表格
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-3">{oid.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-3">
                    <div><strong>厂商:</strong> {oid.vendor}</div>
                    <div><strong>MIB文件:</strong> {oid.mibFile}</div>
                    <div><strong>类别:</strong> {oid.category}</div>
                    {oid.unit && <div><strong>单位:</strong> {oid.unit}</div>}
                  </div>

                  {oid.tableOid && (
                    <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded mb-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Database className="h-3 w-3 text-yellow-400" />
                        <span className="text-xs text-yellow-400">表格遍历配置</span>
                      </div>
                      <p className="text-xs text-slate-300">表格OID: {oid.tableOid}</p>
                      {oid.snmpIndex && (
                        <p className="text-xs text-slate-300">索引OID: {oid.snmpIndex}</p>
                      )}
                      {oid.labels && (
                        <p className="text-xs text-slate-300">标签: {oid.labels.join(', ')}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 配置模板标签页 */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">完整配置模板</CardTitle>
              <CardDescription className="text-slate-400">
                选择生产级配置模板，包含完整的部署和使用指南
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
                          <p className="text-xs text-slate-500 mb-1">功能特性:</p>
                          <div className="flex flex-wrap gap-1">
                            {template.features.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs border-slate-700 text-slate-400">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs text-slate-500 mb-1">必需OID: {template.requiredOids.length}</p>
                          <p className="text-xs text-slate-500">可选OID: {template.optionalOids.length}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-slate-700 flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 border-slate-600 text-slate-300"
                            >
                              <BookOpen className="h-3 w-3 mr-1" />
                              部署指南
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                {template.deploymentGuide.title}
                              </DialogTitle>
                              <DialogDescription>
                                完整的部署和配置指南
                              </DialogDescription>
                            </DialogHeader>
                            
                            <ScrollArea className="max-h-[60vh] pr-4">
                              <div className="space-y-6">
                                {template.deploymentGuide.steps.map((step, index) => (
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
                                            onClick={() => navigator.clipboard.writeText(step.code!)}
                                          >
                                            <Copy className="h-4 w-4" />
                                          </Button>
                                        </div>
                                        
                                        {step.note && (
                                          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                              {step.note}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-slate-600 text-slate-300"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          预览
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 配置生成器标签页 */}
        <TabsContent value="generator" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">完整配置生成器</CardTitle>
              <CardDescription className="text-slate-400">
                基于选择的OID和模板生成完整的生产级监控配置
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
                      configTemplates.find(t => t.id === selectedTemplate)?.name || '未选择' 
                      : '请选择配置模板'
                    }
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">已选OID ({selectedOids.length})</Label>
                  <div className="max-h-32 overflow-y-auto p-2 bg-slate-700 border border-slate-600 rounded-md">
                    {selectedOids.length > 0 ? (
                      <div className="space-y-1">
                        {selectedOids.map(oidId => {
                          const oid = mibOids.find(o => o.id === oidId);
                          return oid ? (
                            <div key={oidId} className="text-xs text-slate-300 flex items-center space-x-2">
                              <span>{oid.name}</span>
                              {oid.tableOid && <Badge className="text-xs bg-yellow-600">表格</Badge>}
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
                      <Checkbox defaultChecked />
                      <span className="text-sm text-slate-400">生成表格遍历配置</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox defaultChecked />
                      <span className="text-sm text-slate-400">包含认证配置</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={generateCompleteConfig}
                  disabled={!selectedTemplate || selectedOids.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  生成完整配置
                </Button>
                
                {generatedConfig && (
                  <Dialog open={showDeploymentGuide} onOpenChange={setShowDeploymentGuide}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-green-600 text-green-400">
                        <BookOpen className="h-4 w-4 mr-2" />
                        查看部署指南
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>部署指南</DialogTitle>
                        <DialogDescription>
                          按照以下步骤部署您的监控配置
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-[60vh]">
                        {selectedTemplate && configTemplates.find(t => t.id === selectedTemplate)?.deploymentGuide && (
                          <div className="space-y-6">
                            {configTemplates.find(t => t.id === selectedTemplate)!.deploymentGuide.steps.map((step, index) => (
                              <div key={index} className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                    {index + 1}
                                  </div>
                                  <h4 className="font-semibold">{step.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground ml-8">{step.description}</p>
                                {step.code && (
                                  <div className="ml-8">
                                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                      <code>{step.code.replace(/\{\{moduleName\}\}/g, configName || 'default')}</code>
                                    </pre>
                                  </div>
                                )}
                                {step.note && (
                                  <div className="ml-8 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                    <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-blue-700 dark:text-blue-300">{step.note}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>

          {generatedConfig && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">生成的完整配置</CardTitle>
                    <CardDescription className="text-slate-400">
                      生产级监控配置，包含所有必要参数
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
                
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">配置生成完成</span>
                  </div>
                  <p className="text-sm text-slate-300">
                    已生成包含 {selectedOids.length} 个OID的完整监控配置。
                    配置包含表格遍历、标签映射、认证设置等生产环境所需的所有参数。
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    请根据部署指南进行安装和配置。如需帮助，请查看相应的部署文档。
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}