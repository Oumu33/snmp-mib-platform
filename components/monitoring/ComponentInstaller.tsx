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
  Wifi
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Component {
  id: string;
  name: string;
  description: string;
  category: 'collector' | 'storage' | 'visualization' | 'alerting';
  status: 'available' | 'installed' | 'updating';
  version: string;
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

const components: Component[] = [
  {
    id: 'node-exporter',
    name: 'Node Exporter',
    description: '系统指标采集器，监控CPU、内存、磁盘、网络等系统资源',
    category: 'collector',
    status: 'available',
    version: '1.7.0',
    dependencies: ['systemd'],
    configRequired: true,
    ports: [9100],
    systemRequirements: {
      cpu: '100m',
      memory: '50Mi',
      disk: '100Mi'
    },
    configGuide: {
      title: 'Node Exporter 配置指南',
      description: '配置Node Exporter以监控系统资源指标',
      steps: [
        {
          title: '1. 创建配置文件',
          description: '创建Node Exporter的启动配置',
          code: `# 创建配置目录
sudo mkdir -p /etc/node_exporter

# 创建启动配置文件
sudo tee /etc/node_exporter/node_exporter.yml << 'EOF'
# Node Exporter 配置
web:
  listen-address: ":9100"
  telemetry-path: "/metrics"
  
# 启用的收集器
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
  
# 禁用的收集器  
  disabled:
    - arp
    - bcache
    - bonding
    - conntrack
    - entropy
    - hwmon
    - infiniband
    - ipvs
    - mdadm
    - nfs
    - nfsd
    - sockstat
    - stat
    - textfile
    - wifi
    - xfs
    - zfs
EOF`,
          note: '根据需要启用或禁用特定的收集器',
          type: 'info'
        },
        {
          title: '2. 配置文本文件收集器（可选）',
          description: '启用文本文件收集器以支持自定义指标',
          code: `# 创建文本文件目录
sudo mkdir -p /var/lib/node_exporter/textfile_collector

# 设置权限
sudo chown -R node_exporter:node_exporter /var/lib/node_exporter

# 示例：创建自定义指标文件
sudo tee /var/lib/node_exporter/textfile_collector/custom_metrics.prom << 'EOF'
# HELP custom_application_status Application status (1=running, 0=stopped)
# TYPE custom_application_status gauge
custom_application_status{service="web"} 1
custom_application_status{service="database"} 1

# HELP custom_backup_last_success_timestamp Last successful backup timestamp
# TYPE custom_backup_last_success_timestamp gauge
custom_backup_last_success_timestamp 1640995200
EOF`,
          note: '文本文件收集器允许您导出自定义指标',
          type: 'info'
        },
        {
          title: '3. 配置防火墙',
          description: '开放Node Exporter端口',
          code: `# Ubuntu/Debian
sudo ufw allow 9100/tcp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=9100/tcp
sudo firewall-cmd --reload

# 验证端口开放
sudo netstat -tlnp | grep :9100`,
          note: '确保防火墙允许Prometheus访问9100端口',
          type: 'warning'
        }
      ]
    },
    usageGuide: {
      title: 'Node Exporter 使用指南',
      description: '如何使用Node Exporter监控系统指标',
      quickStart: [
        {
          title: '验证安装',
          description: '检查Node Exporter是否正常运行',
          code: `# 检查服务状态
sudo systemctl status node_exporter

# 测试指标端点
curl http://localhost:9100/metrics | head -20

# 检查特定指标
curl -s http://localhost:9100/metrics | grep "node_cpu_seconds_total"`
        },
        {
          title: '在Prometheus中配置',
          description: '将Node Exporter添加到Prometheus配置',
          code: `# 在prometheus.yml中添加
scrape_configs:
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
    scrape_interval: 15s
    metrics_path: /metrics`
        },
        {
          title: 'Grafana仪表板',
          description: '导入预制的Grafana仪表板',
          url: 'https://grafana.com/grafana/dashboards/1860'
        }
      ],
      commonTasks: [
        {
          title: '监控磁盘使用率',
          description: '设置磁盘空间监控告警',
          steps: [
            '在Prometheus中创建告警规则',
            '设置磁盘使用率阈值（如85%）',
            '配置通知渠道（邮件、Slack等）',
            '测试告警触发'
          ]
        },
        {
          title: '监控系统负载',
          description: '监控系统负载和CPU使用率',
          steps: [
            '查看node_load1, node_load5, node_load15指标',
            '监控node_cpu_seconds_total指标',
            '设置负载过高的告警规则',
            '创建负载趋势图表'
          ]
        }
      ]
    },
    deploymentTips: [
      {
        type: 'tip',
        title: '性能优化',
        content: '禁用不需要的收集器可以减少资源消耗和指标数量。只启用您实际需要监控的收集器。'
      },
      {
        type: 'warning',
        title: '安全注意事项',
        content: '确保Node Exporter只在内网访问，不要将9100端口暴露到公网。考虑使用TLS和基本认证。'
      },
      {
        type: 'info',
        title: '文本文件收集器',
        content: '使用文本文件收集器可以导出自定义指标，如应用程序状态、备份状态等。'
      }
    ]
  },
  {
    id: 'snmp-exporter',
    name: 'SNMP Exporter',
    description: 'SNMP协议监控导出器，用于监控网络设备如路由器、交换机等',
    category: 'collector',
    status: 'available',
    version: '0.25.0',
    dependencies: ['net-snmp'],
    configRequired: true,
    ports: [9116],
    systemRequirements: {
      cpu: '200m',
      memory: '100Mi',
      disk: '200Mi'
    },
    configGuide: {
      title: 'SNMP Exporter 配置指南',
      description: '配置SNMP Exporter以监控网络设备',
      steps: [
        {
          title: '1. 准备SNMP配置文件',
          description: '使用配置生成器创建snmp.yml配置文件',
          code: `# 将生成的配置保存到文件
sudo mkdir -p /etc/snmp_exporter
sudo tee /etc/snmp_exporter/snmp.yml << 'EOF'
# 在这里粘贴从配置生成器生成的完整配置
# 包含modules、auth、walk、metrics等所有配置
EOF

# 验证配置文件语法
/usr/local/bin/snmp_exporter --config.check --config.file=/etc/snmp_exporter/snmp.yml`,
          note: '使用本系统的配置生成器生成完整的snmp.yml配置文件',
          type: 'info'
        },
        {
          title: '2. 测试SNMP连接',
          description: '验证SNMP设备连接和配置',
          code: `# 测试SNMP连接
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1.1.1.0

# 测试SNMP Exporter
curl 'http://localhost:9116/snmp?target=192.168.1.1&module=default'

# 检查特定OID
curl 'http://localhost:9116/snmp?target=192.168.1.1&module=default' | grep "snmp_up"`,
          note: '确保目标设备的SNMP服务已启用且community字符串正确',
          type: 'warning'
        },
        {
          title: '3. 配置多设备监控',
          description: '设置监控多个网络设备',
          code: `# 在Prometheus中配置多设备监控
scrape_configs:
  - job_name: 'snmp'
    static_configs:
      - targets:
        - 192.168.1.1    # 路由器
        - 192.168.1.10   # 交换机1  
        - 192.168.1.11   # 交换机2
        - 192.168.1.100  # UPS
    metrics_path: /snmp
    params:
      module: [default]  # 使用的SNMP模块
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: localhost:9116`,
          note: '可以为不同类型的设备使用不同的模块配置',
          type: 'info'
        }
      ]
    },
    usageGuide: {
      title: 'SNMP Exporter 使用指南',
      description: '如何使用SNMP Exporter监控网络设备',
      quickStart: [
        {
          title: '验证SNMP监控',
          description: '测试SNMP设备监控是否正常',
          code: `# 检查SNMP Exporter状态
sudo systemctl status snmp_exporter

# 测试设备连接
curl 'http://localhost:9116/snmp?target=192.168.1.1&module=default'

# 查看可用模块
curl http://localhost:9116/snmp`
        },
        {
          title: '常用SNMP OID',
          description: '网络设备常用的监控指标',
          code: `# 系统信息
1.3.6.1.2.1.1.1.0    # sysDescr - 系统描述
1.3.6.1.2.1.1.3.0    # sysUpTime - 系统运行时间

# 接口统计
1.3.6.1.2.1.2.2.1.10  # ifInOctets - 接口入流量
1.3.6.1.2.1.2.2.1.16  # ifOutOctets - 接口出流量
1.3.6.1.2.1.2.2.1.8   # ifOperStatus - 接口状态`
        }
      ],
      commonTasks: [
        {
          title: '监控接口流量',
          description: '设置网络接口流量监控',
          steps: [
            '配置接口流量相关的OID',
            '设置流量阈值告警',
            '创建流量趋势图表',
            '监控接口状态变化'
          ]
        },
        {
          title: '设备状态监控',
          description: '监控设备在线状态和健康度',
          steps: [
            '监控snmp_up指标',
            '设置设备离线告警',
            '监控设备重启事件',
            '跟踪设备运行时间'
          ]
        }
      ]
    },
    deploymentTips: [
      {
        type: 'tip',
        title: '配置优化',
        content: '使用本系统的配置生成器可以自动生成包含表格遍历、标签映射等完整功能的配置文件。'
      },
      {
        type: 'warning',
        title: 'SNMP安全',
        content: '生产环境建议使用SNMP v3，配置用户名、密码和加密。避免使用默认的community字符串。'
      },
      {
        type: 'info',
        title: '性能调优',
        content: '调整max_repetitions和timeout参数以优化大型网络的监控性能。'
      }
    ]
  },
  {
    id: 'categraf',
    name: 'Categraf',
    description: '现代化的监控数据采集器，支持多种协议和数据源，兼容Telegraf插件',
    category: 'collector',
    status: 'available',
    version: '0.3.60',
    dependencies: [],
    configRequired: true,
    ports: [9100],
    systemRequirements: {
      cpu: '100m',
      memory: '100Mi',
      disk: '200Mi'
    },
    configGuide: {
      title: 'Categraf 配置指南',
      description: '配置Categraf进行多协议数据采集',
      steps: [
        {
          title: '1. 创建主配置文件',
          description: '配置Categraf的全局设置',
          code: `# 创建配置目录
sudo mkdir -p /etc/categraf/conf.d

# 创建主配置文件
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
          note: '根据您的时序数据库调整writer配置',
          type: 'info'
        },
        {
          title: '2. 配置SNMP插件',
          description: '配置SNMP设备监控',
          code: `# 创建SNMP配置文件
sudo mkdir -p /etc/categraf/conf.d/inputs.snmp
sudo tee /etc/categraf/conf.d/inputs.snmp/snmp.toml << 'EOF'
[[inputs.snmp]]
  agents = ["192.168.1.1:161"]
  version = 2
  community = "public"
  interval = "60s"
  timeout = "10s"
  retries = 3
  
  [inputs.snmp.tags]
    device_type = "router"
    location = "datacenter"
  
  # 系统信息
  [[inputs.snmp.field]]
    name = "uptime"
    oid = "1.3.6.1.2.1.1.3.0"
    conversion = "float"
  
  # 接口表格
  [[inputs.snmp.table]]
    name = "interface"
    inherit_tags = ["agent_host"]
    oid = "1.3.6.1.2.1.2.2"
    
    [[inputs.snmp.table.field]]
      name = "ifInOctets"
      oid = "1.3.6.1.2.1.2.2.1.10"
      conversion = "float"
EOF`,
          note: '使用配置生成器可以生成更完整的SNMP配置',
          type: 'info'
        },
        {
          title: '3. 配置系统监控',
          description: '启用系统资源监控',
          code: `# 创建系统监控配置
sudo tee /etc/categraf/conf.d/inputs.cpu/cpu.toml << 'EOF'
[[inputs.cpu]]
  percpu = true
  totalcpu = true
  collect_cpu_time = false
  report_active = false
EOF

sudo tee /etc/categraf/conf.d/inputs.mem/mem.toml << 'EOF'
[[inputs.mem]]
  # 无需额外配置
EOF

sudo tee /etc/categraf/conf.d/inputs.disk/disk.toml << 'EOF'
[[inputs.disk]]
  ignore_fs = ["tmpfs", "devtmpfs", "devfs", "iso9660", "overlay", "aufs", "squashfs"]
EOF`,
          note: '可以根据需要启用更多系统监控插件',
          type: 'info'
        }
      ]
    },
    usageGuide: {
      title: 'Categraf 使用指南',
      description: '如何使用Categraf进行多协议监控',
      quickStart: [
        {
          title: '验证安装',
          description: '检查Categraf是否正常运行',
          code: `# 检查服务状态
sudo systemctl status categraf

# 测试配置
/usr/local/bin/categraf --test --configs /etc/categraf

# 查看指标输出
curl http://localhost:9100/metrics | head -20`
        },
        {
          title: '配置文件结构',
          description: '了解Categraf配置文件组织',
          code: `# 配置文件结构
/etc/categraf/
├── config.toml              # 主配置文件
└── conf.d/                  # 插件配置目录
    ├── inputs.cpu/          # CPU监控
    ├── inputs.mem/          # 内存监控
    ├── inputs.disk/         # 磁盘监控
    ├── inputs.snmp/         # SNMP监控
    └── inputs.mysql/        # MySQL监控`
        }
      ],
      commonTasks: [
        {
          title: '添加新的监控目标',
          description: '配置新的设备或服务监控',
          steps: [
            '在conf.d目录下创建对应的插件配置',
            '配置目标地址和认证信息',
            '设置采集间隔和标签',
            '重启Categraf服务'
          ]
        },
        {
          title: '自定义指标标签',
          description: '为指标添加自定义标签',
          steps: [
            '在插件配置中添加tags部分',
            '设置环境、位置等标识标签',
            '配置动态标签映射',
            '验证标签是否正确添加'
          ]
        }
      ]
    },
    deploymentTips: [
      {
        type: 'tip',
        title: '插件生态',
        content: 'Categraf兼容大部分Telegraf插件，可以监控数据库、中间件、云服务等多种数据源。'
      },
      {
        type: 'info',
        title: '配置管理',
        content: '使用conf.d目录结构可以更好地组织和管理不同类型的监控配置。'
      },
      {
        type: 'warning',
        title: '资源控制',
        content: '合理设置采集间隔和批量大小，避免对目标系统造成过大压力。'
      }
    ]
  },
  {
    id: 'victoriametrics',
    name: 'VictoriaMetrics',
    description: '高性能时序数据库，兼容Prometheus，支持长期存储和高可用',
    category: 'storage',
    status: 'available',
    version: '1.95.1',
    dependencies: [],
    configRequired: true,
    ports: [8428, 8089, 4242],
    systemRequirements: {
      cpu: '500m',
      memory: '1Gi',
      disk: '10Gi'
    },
    configGuide: {
      title: 'VictoriaMetrics 配置指南',
      description: '配置VictoriaMetrics作为时序数据存储',
      steps: [
        {
          title: '1. 基础配置',
          description: '配置VictoriaMetrics基本参数',
          code: `# 创建配置目录
sudo mkdir -p /etc/victoriametrics
sudo mkdir -p /var/lib/victoriametrics

# 创建配置文件
sudo tee /etc/victoriametrics/victoriametrics.conf << 'EOF'
# VictoriaMetrics 配置
-storageDataPath=/var/lib/victoriametrics
-httpListenAddr=:8428
-retentionPeriod=12
-memory.allowedPercent=60
-search.maxConcurrentRequests=8
-insert.maxQueueDuration=30s
-search.maxQueryDuration=30s
EOF`,
          note: 'retentionPeriod设置数据保留时间（月），根据需要调整',
          type: 'info'
        },
        {
          title: '2. 配置Prometheus写入',
          description: '配置Prometheus将数据写入VictoriaMetrics',
          code: `# 在prometheus.yml中添加remote_write配置
global:
  scrape_interval: 15s

remote_write:
  - url: http://localhost:8428/api/v1/write
    queue_config:
      max_samples_per_send: 10000
      batch_send_deadline: 5s
      max_shards: 20

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']`,
          note: '配置后Prometheus会将数据同时写入本地和VictoriaMetrics',
          type: 'info'
        },
        {
          title: '3. 配置Grafana数据源',
          description: '在Grafana中添加VictoriaMetrics数据源',
          code: `# Grafana数据源配置
Name: VictoriaMetrics
Type: Prometheus
URL: http://localhost:8428
Access: Server (Default)

# 测试连接
curl http://localhost:8428/api/v1/query?query=up`,
          note: 'VictoriaMetrics完全兼容Prometheus查询API',
          type: 'success'
        }
      ]
    },
    usageGuide: {
      title: 'VictoriaMetrics 使用指南',
      description: '如何使用VictoriaMetrics进行时序数据存储和查询',
      quickStart: [
        {
          title: '验证安装',
          description: '检查VictoriaMetrics是否正常运行',
          code: `# 检查服务状态
sudo systemctl status victoriametrics

# 检查健康状态
curl http://localhost:8428/health

# 查看指标统计
curl http://localhost:8428/api/v1/status/tsdb`
        },
        {
          title: '数据查询',
          description: '使用PromQL查询存储的数据',
          code: `# 查询所有up指标
curl 'http://localhost:8428/api/v1/query?query=up'

# 查询时间范围数据
curl 'http://localhost:8428/api/v1/query_range?query=up&start=2024-01-01T00:00:00Z&end=2024-01-02T00:00:00Z&step=1h'`
        }
      ],
      commonTasks: [
        {
          title: '数据备份',
          description: '备份VictoriaMetrics数据',
          steps: [
            '停止VictoriaMetrics服务',
            '备份/var/lib/victoriametrics目录',
            '使用vmbackup工具进行在线备份',
            '验证备份完整性'
          ]
        },
        {
          title: '性能优化',
          description: '优化VictoriaMetrics性能',
          steps: [
            '调整memory.allowedPercent参数',
            '配置SSD存储以提高性能',
            '监控内存和磁盘使用情况',
            '根据负载调整并发参数'
          ]
        }
      ]
    },
    deploymentTips: [
      {
        type: 'tip',
        title: '存储优化',
        content: 'VictoriaMetrics具有优秀的压缩率，通常比Prometheus节省50-70%的存储空间。'
      },
      {
        type: 'info',
        title: '集群部署',
        content: '对于大规模环境，可以部署VictoriaMetrics集群版本，包含vminsert、vmselect和vmstorage组件。'
      },
      {
        type: 'warning',
        title: '资源规划',
        content: '根据数据量规划存储空间，建议为数据目录配置独立的磁盘分区。'
      }
    ]
  },
  {
    id: 'vmstorage',
    name: 'VMStorage',
    description: 'VictoriaMetrics集群存储节点，负责数据持久化和查询',
    category: 'storage',
    status: 'available',
    version: '1.95.1',
    dependencies: [],
    configRequired: true,
    ports: [8482, 8400],
    systemRequirements: {
      cpu: '1000m',
      memory: '2Gi',
      disk: '50Gi'
    },
    configGuide: {
      title: 'VMStorage 配置指南',
      description: '配置VictoriaMetrics集群存储节点',
      steps: [
        {
          title: '1. 存储节点配置',
          description: '配置VMStorage基本参数',
          code: `# 创建配置文件
sudo tee /etc/victoriametrics/vmstorage.conf << 'EOF'
-storageDataPath=/var/lib/vmstorage
-httpListenAddr=:8482
-vminsertAddr=:8400
-retentionPeriod=12
-memory.allowedPercent=80
-search.maxConcurrentRequests=16
EOF`,
          note: '存储节点需要更多内存用于数据缓存',
          type: 'info'
        }
      ]
    },
    usageGuide: {
      title: 'VMStorage 使用指南',
      description: '如何管理VictoriaMetrics存储节点',
      quickStart: [
        {
          title: '验证存储节点',
          description: '检查存储节点状态',
          code: `# 检查服务状态
sudo systemctl status vmstorage

# 检查存储统计
curl http://localhost:8482/metrics | grep vm_`
        }
      ],
      commonTasks: [
        {
          title: '存储扩容',
          description: '扩展存储容量',
          steps: [
            '添加新的存储磁盘',
            '更新存储路径配置',
            '重启存储服务',
            '验证数据分布'
          ]
        }
      ]
    },
    deploymentTips: [
      {
        type: 'tip',
        title: '集群部署',
        content: 'VMStorage是VictoriaMetrics集群的核心组件，建议部署多个实例以实现高可用。'
      },
      {
        type: 'warning',
        title: '数据安全',
        content: '定期备份存储数据，配置RAID以防止硬件故障导致的数据丢失。'
      }
    ]
  },
  {
    id: 'vminsert',
    name: 'VMInsert',
    description: 'VictoriaMetrics集群写入节点，负责接收和分发数据',
    category: 'storage',
    status: 'available',
    version: '1.95.1',
    dependencies: [],
    configRequired: true,
    ports: [8480],
    systemRequirements: {
      cpu: '500m',
      memory: '512Mi',
      disk: '1Gi'
    },
    configGuide: {
      title: 'VMInsert 配置指南',
      description: '配置VictoriaMetrics集群写入节点',
      steps: [
        {
          title: '1. 写入节点配置',
          description: '配置VMInsert连接存储节点',
          code: `# 创建配置文件
sudo tee /etc/victoriametrics/vminsert.conf << 'EOF'
-httpListen=:8480
-storageNode=localhost:8400
-replicationFactor=1
-maxLabelsPerTimeseries=30
-maxLabelValueLen=256
EOF`,
          note: '配置存储节点地址和复制因子',
          type: 'info'
        }
      ]
    },
    usageGuide: {
      title: 'VMInsert 使用指南',
      description: '如何配置数据写入节点',
      quickStart: [
        {
          title: '验证写入节点',
          description: '测试数据写入功能',
          code: `# 检查服务状态
sudo systemctl status vminsert

# 测试数据写入
curl -X POST http://localhost:8480/api/v1/write`
        }
      ],
      commonTasks: [
        {
          title: '负载均衡',
          description: '配置多个写入节点',
          steps: [
            '部署多个VMInsert实例',
            '配置负载均衡器',
            '更新Prometheus配置',
            '验证数据分布'
          ]
        }
      ]
    },
    deploymentTips: [
      {
        type: 'tip',
        title: '高可用',
        content: '部署多个VMInsert实例并使用负载均衡器可以提高写入可用性。'
      }
    ]
  },
  {
    id: 'vmselect',
    name: 'VMSelect',
    description: 'VictoriaMetrics集群查询节点，负责数据查询和聚合',
    category: 'storage',
    status: 'available',
    version: '1.95.1',
    dependencies: [],
    configRequired: true,
    ports: [8481],
    systemRequirements: {
      cpu: '500m',
      memory: '1Gi',
      disk: '1Gi'
    },
    configGuide: {
      title: 'VMSelect 配置指南',
      description: '配置VictoriaMetrics集群查询节点',
      steps: [
        {
          title: '1. 查询节点配置',
          description: '配置VMSelect连接存储节点',
          code: `# 创建配置文件
sudo tee /etc/victoriametrics/vmselect.conf << 'EOF'
-httpListen=:8481
-storageNode=localhost:8482
-search.maxConcurrentRequests=32
-search.maxQueryDuration=30s
-search.maxPointsPerTimeseries=30000
EOF`,
          note: '调整查询参数以优化性能',
          type: 'info'
        }
      ]
    },
    usageGuide: {
      title: 'VMSelect 使用指南',
      description: '如何配置数据查询节点',
      quickStart: [
        {
          title: '验证查询节点',
          description: '测试数据查询功能',
          code: `# 检查服务状态
sudo systemctl status vmselect

# 测试数据查询
curl 'http://localhost:8481/api/v1/query?query=up'`
        }
      ],
      commonTasks: [
        {
          title: '查询优化',
          description: '优化查询性能',
          steps: [
            '调整并发查询数量',
            '设置查询超时时间',
            '配置查询缓存',
            '监控查询性能'
          ]
        }
      ]
    },
    deploymentTips: [
      {
        type: 'tip',
        title: '查询性能',
        content: '增加VMSelect实例数量可以提高查询并发能力和响应速度。'
      }
    ]
  },
  {
    id: 'grafana',
    name: 'Grafana',
    description: '开源可视化和监控平台，支持多种数据源，提供丰富的图表和仪表板',
    category: 'visualization',
    status: 'installed',
    version: '10.2.0',
    dependencies: ['sqlite3'],
    configRequired: true,
    ports: [3000],
    systemRequirements: {
      cpu: '200m',
      memory: '200Mi',
      disk: '1Gi'
    },
    configGuide: {
      title: 'Grafana 配置指南',
      description: '配置Grafana可视化平台',
      steps: [
        {
          title: '1. 基础配置',
          description: '配置Grafana基本设置',
          code: `# 编辑Grafana配置文件
sudo tee /etc/grafana/grafana.ini << 'EOF'
[server]
http_addr = 0.0.0.0
http_port = 3000
domain = localhost
root_url = http://localhost:3000

[database]
type = sqlite3
path = /var/lib/grafana/grafana.db

[security]
admin_user = admin
admin_password = admin123
secret_key = SW2YcwTIb9zpOOhoPsMm

[users]
allow_sign_up = false
allow_org_create = false

[auth.anonymous]
enabled = false
EOF`,
          note: '请修改默认的admin密码以提高安全性',
          type: 'warning'
        },
        {
          title: '2. 配置数据源',
          description: '添加Prometheus和VictoriaMetrics数据源',
          code: `# 通过API添加数据源
curl -X POST \
  http://admin:admin123@localhost:3000/api/datasources \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Prometheus",
    "type": "prometheus",
    "url": "http://localhost:9090",
    "access": "proxy",
    "isDefault": true
  }'

# 添加VictoriaMetrics数据源
curl -X POST \
  http://admin:admin123@localhost:3000/api/datasources \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "VictoriaMetrics",
    "type": "prometheus",
    "url": "http://localhost:8428",
    "access": "proxy"
  }'`,
          note: '也可以通过Web界面手动添加数据源',
          type: 'info'
        },
        {
          title: '3. 导入仪表板',
          description: '导入预制的监控仪表板',
          code: `# 常用仪表板ID
# Node Exporter Full: 1860
# SNMP Stats: 11169
# VictoriaMetrics: 10229

# 通过API导入仪表板
curl -X POST \
  http://admin:admin123@localhost:3000/api/dashboards/import \
  -H 'Content-Type: application/json' \
  -d '{
    "dashboard": {
      "id": null,
      "title": "Node Exporter Full",
      "tags": ["prometheus", "node-exporter"],
      "timezone": "browser",
      "panels": [],
      "time": {
        "from": "now-1h",
        "to": "now"
      },
      "refresh": "30s"
    },
    "folderId": 0,
    "overwrite": true
  }'`,
          note: '可以从grafana.com下载更多仪表板模板',
          type: 'info'
        }
      ]
    },
    usageGuide: {
      title: 'Grafana 使用指南',
      description: '如何使用Grafana创建监控仪表板',
      quickStart: [
        {
          title: '首次登录',
          description: '访问Grafana Web界面',
          code: `# 访问Grafana
URL: http://localhost:3000
用户名: admin
密码: admin123

# 首次登录后建议修改密码`,
          url: 'http://localhost:3000'
        },
        {
          title: '创建仪表板',
          description: '创建自定义监控仪表板',
          code: `# 常用查询示例
# CPU使用率
100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# 内存使用率
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100

# 磁盘使用率
100 - ((node_filesystem_avail_bytes * 100) / node_filesystem_size_bytes)`
        }
      ],
      commonTasks: [
        {
          title: '配置告警',
          description: '设置Grafana告警规则',
          steps: [
            '在仪表板面板中配置告警条件',
            '设置通知渠道（邮件、Slack等）',
            '配置告警规则和阈值',
            '测试告警通知'
          ]
        },
        {
          title: '用户管理',
          description: '管理Grafana用户和权限',
          steps: [
            '创建组织和团队',
            '添加用户并分配角色',
            '配置仪表板权限',
            '设置数据源访问权限'
          ]
        }
      ]
    },
    deploymentTips: [
      {
        type: 'tip',
        title: '仪表板管理',
        content: '使用文件夹组织仪表板，为不同团队创建专门的仪表板分类。'
      },
      {
        type: 'info',
        title: '插件扩展',
        content: 'Grafana支持丰富的插件生态，可以安装额外的面板类型和数据源插件。'
      },
      {
        type: 'warning',
        title: '安全配置',
        content: '生产环境中应配置HTTPS、修改默认密码，并限制匿名访问。'
      }
    ]
  },
  {
    id: 'vmalert',
    name: 'VMAlert',
    description: 'VictoriaMetrics告警管理器，支持PromQL告警规则和多种通知方式',
    category: 'alerting',
    status: 'available',
    version: '1.95.1',
    dependencies: [],
    configRequired: true,
    ports: [8880],
    systemRequirements: {
      cpu: '100m',
      memory: '128Mi',
      disk: '500Mi'
    },
    configGuide: {
      title: 'VMAlert 配置指南',
      description: '配置VictoriaMetrics告警管理器',
      steps: [
        {
          title: '1. 基础配置',
          description: '配置VMAlert基本参数',
          code: `# 创建配置文件
sudo tee /etc/victoriametrics/vmalert.conf << 'EOF'
-datasource.url=http://localhost:8428
-notifier.url=http://localhost:9093
-rule=/etc/vmalert/rules/*.yml
-httpListenAddr=:8880
-evaluationInterval=15s
-external.label=cluster=prod
EOF`,
          note: '配置数据源和告警管理器地址',
          type: 'info'
        },
        {
          title: '2. 创建告警规则',
          description: '配置监控告警规则',
          code: `# 创建告警规则目录
sudo mkdir -p /etc/vmalert/rules

# 创建告警规则文件
sudo tee /etc/vmalert/rules/node.yml << 'EOF'
groups:
  - name: node.rules
    rules:
      - alert: NodeDown
        expr: up{job="node-exporter"} == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Node {{ $labels.instance }} is down"
          description: "Node {{ $labels.instance }} has been down for more than 5 minutes."
      
      - alert: HighCPUUsage
        expr: 100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
          description: "CPU usage is above 80% for more than 10 minutes."
EOF`,
          note: '根据实际需求调整告警规则和阈值',
          type: 'info'
        }
      ]
    },
    usageGuide: {
      title: 'VMAlert 使用指南',
      description: '如何使用VMAlert管理告警',
      quickStart: [
        {
          title: '验证告警服务',
          description: '检查VMAlert是否正常运行',
          code: `# 检查服务状态
sudo systemctl status vmalert

# 查看告警规则
curl http://localhost:8880/api/v1/rules

# 查看活跃告警
curl http://localhost:8880/api/v1/alerts`
        }
      ],
      commonTasks: [
        {
          title: '管理告警规则',
          description: '添加和修改告警规则',
          steps: [
            '编辑告警规则文件',
            '验证规则语法',
            '重新加载配置',
            '测试告警触发'
          ]
        }
      ]
    },
    deploymentTips: [
      {
        type: 'tip',
        title: '规则管理',
        content: '将告警规则按服务或团队分组，便于管理和维护。'
      },
      {
        type: 'warning',
        title: '告警风暴',
        content: '合理设置告警阈值和持续时间，避免产生过多的误报告警。'
      }
    ]
  },
  {
    id: 'alertmanager',
    name: 'Alertmanager',
    description: 'Prometheus生态的告警管理器，支持告警分组、抑制和多种通知渠道',
    category: 'alerting',
    status: 'available',
    version: '0.26.0',
    dependencies: [],
    configRequired: true,
    ports: [9093],
    systemRequirements: {
      cpu: '100m',
      memory: '128Mi',
      disk: '500Mi'
    },
    configGuide: {
      title: 'Alertmanager 配置指南',
      description: '配置Prometheus告警管理器',
      steps: [
        {
          title: '1. 基础配置',
          description: '配置Alertmanager基本设置',
          code: `# 创建配置文件
sudo tee /etc/alertmanager/alertmanager.yml << 'EOF'
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alertmanager@company.com'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'

receivers:
  - name: 'web.hook'
    email_configs:
      - to: 'admin@company.com'
        subject: 'Alert: {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          Alert: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          {{ end }}

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'dev', 'instance']
EOF`,
          note: '配置SMTP服务器和通知接收者',
          type: 'info'
        },
        {
          title: '2. 配置通知渠道',
          description: '设置多种通知方式',
          code: `# 添加Slack通知
receivers:
  - name: 'slack-notifications'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
        channel: '#alerts'
        title: 'Alert: {{ .GroupLabels.alertname }}'
        text: |
          {{ range .Alerts }}
          {{ .Annotations.summary }}
          {{ .Annotations.description }}
          {{ end }}

# 添加钉钉通知
  - name: 'dingtalk-notifications'
    webhook_configs:
      - url: 'https://oapi.dingtalk.com/robot/send?access_token=YOUR_TOKEN'
        send_resolved: true`,
          note: '根据需要配置不同的通知渠道',
          type: 'info'
        }
      ]
    },
    usageGuide: {
      title: 'Alertmanager 使用指南',
      description: '如何使用Alertmanager管理告警通知',
      quickStart: [
        {
          title: '验证告警管理器',
          description: '检查Alertmanager是否正常运行',
          code: `# 检查服务状态
sudo systemctl status alertmanager

# 查看告警状态
curl http://localhost:9093/api/v1/alerts

# 测试配置
/usr/local/bin/amtool config check --config.file=/etc/alertmanager/alertmanager.yml`
        }
      ],
      commonTasks: [
        {
          title: '告警静默',
          description: '临时静默特定告警',
          steps: [
            '通过Web界面或API创建静默规则',
            '设置静默时间和匹配条件',
            '验证告警是否被静默',
            '管理和删除静默规则'
          ]
        }
      ]
    },
    deploymentTips: [
      {
        type: 'tip',
        title: '告警分组',
        content: '合理配置告警分组可以减少通知数量，避免告警风暴。'
      },
      {
        type: 'info',
        title: '高可用',
        content: '部署多个Alertmanager实例可以实现告警管理的高可用性。'
      }
    ]
  }
];

export default function ComponentInstaller() {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showConfigGuide, setShowConfigGuide] = useState(false);
  const [showUsageGuide, setShowUsageGuide] = useState(false);
  const { toast } = useToast();

  const handleInstall = (component: Component) => {
    toast({
      title: "开始安装",
      description: `正在安装 ${component.name}...`,
    });
    
    // 模拟安装过程
    setTimeout(() => {
      toast({
        title: "安装完成",
        description: `${component.name} 已成功安装。请查看配置指南进行后续配置。`,
      });
      // 自动显示配置指南
      setSelectedComponent(component);
      setShowConfigGuide(true);
    }, 2000);
  };

  const handleUninstall = (component: Component) => {
    toast({
      title: "开始卸载",
      description: `正在卸载 ${component.name}...`,
    });
    
    setTimeout(() => {
      toast({
        title: "卸载完成",
        description: `${component.name} 已被移除。`,
      });
    }, 1500);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
      toast({
        title: "已复制到剪贴板",
        description: "配置代码已复制。",
      });
    } catch (err) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板。",
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
        {status === 'installed' ? '已安装' : status === 'updating' ? '更新中' : '可安装'}
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

  const categorizedComponents = components.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as Record<string, Component[]>);

  const categoryNames = {
    collector: '数据采集',
    storage: '数据存储',
    visualization: '数据可视化',
    alerting: '告警管理'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">智能组件安装器</h2>
          <p className="text-slate-400">
            一键安装监控系统组件，包含完整的配置指南和使用说明
          </p>
        </div>
      </div>

      <Tabs defaultValue="collector" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
          <TabsTrigger value="collector" className="data-[state=active]:bg-blue-600">
            <Activity className="h-4 w-4 mr-2" />
            数据采集
          </TabsTrigger>
          <TabsTrigger value="storage" className="data-[state=active]:bg-green-600">
            <Database className="h-4 w-4 mr-2" />
            数据存储
          </TabsTrigger>
          <TabsTrigger value="visualization" className="data-[state=active]:bg-purple-600">
            <Monitor className="h-4 w-4 mr-2" />
            数据可视化
          </TabsTrigger>
          <TabsTrigger value="alerting" className="data-[state=active]:bg-orange-600">
            <Bell className="h-4 w-4 mr-2" />
            告警管理
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
                            <span className="text-sm text-slate-400">v{component.version}</span>
                            {getStatusBadge(component.status)}
                          </div>
                        </div>
                      </div>
                      {getStatusIcon(component.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-slate-300">{component.description}</CardDescription>
                    
                    {/* 系统要求 */}
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-sm font-medium text-slate-300 mb-2">系统要求:</p>
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

                    {/* 端口信息 */}
                    <div>
                      <p className="text-sm font-medium text-slate-300 mb-2">使用端口:</p>
                      <div className="flex flex-wrap gap-1">
                        {component.ports.map((port) => (
                          <Badge key={port} variant="outline" className="text-xs border-slate-600 text-slate-400">
                            {port}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 依赖项 */}
                    {component.dependencies.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-slate-300 mb-2">依赖项:</p>
                        <div className="flex flex-wrap gap-1">
                          {component.dependencies.map((dep) => (
                            <Badge key={dep} variant="secondary" className="text-xs bg-slate-600 text-slate-300">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 部署提示 */}
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

                    {/* 操作按钮 */}
                    <div className="flex gap-2 pt-2">
                      {component.status === 'available' && (
                        <Button 
                          onClick={() => handleInstall(component)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          安装
                        </Button>
                      )}
                      
                      {component.status === 'installed' && (
                        <Button 
                          variant="outline"
                          onClick={() => handleUninstall(component)}
                          className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          卸载
                        </Button>
                      )}
                      
                      {component.status === 'updating' && (
                        <Button disabled className="flex-1">
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          更新中...
                        </Button>
                      )}

                      {/* 配置指南按钮 */}
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
                              配置
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

                      {/* 使用指南按钮 */}
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
                              使用
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
                                  <TabsTrigger value="quickstart">快速开始</TabsTrigger>
                                  <TabsTrigger value="tasks">常用任务</TabsTrigger>
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
                                            访问链接
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
    </div>
  );
}