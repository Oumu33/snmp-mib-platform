# SNMP Monitor Pro | SNMP监控专业版

[English](#english) | [中文](#chinese)

---

## English

### 🚀 Enterprise SNMP MIB Management and Network Monitoring Platform

SNMP Monitor Pro is a comprehensive enterprise-grade network monitoring platform that provides intelligent SNMP MIB management, automated component deployment, real-time device monitoring, and advanced alerting capabilities.

### ✨ Key Features

#### 🔧 **Intelligent Component Installer**
- **Automated Deployment**: One-click installation of monitoring components on remote hosts
- **Multi-Architecture Support**: x86_64, ARM64, ARMv7 compatibility
- **SSH Management**: Secure key-based and password authentication
- **Cluster Components**: VictoriaMetrics cluster deployment support
- **Real-time Status**: Live deployment progress and health monitoring

#### 📊 **Advanced MIB Management**
- **Multi-Source Support**: Upload files, server path sync, archive extraction
- **Smart Validation**: Automatic MIB file parsing and validation
- **Archive Processing**: ZIP, TAR.GZ, RAR automatic extraction
- **Version Control**: MIB file versioning and dependency tracking
- **Vendor Classification**: Automatic vendor and category detection

#### 🌐 **Comprehensive Device Monitoring**
- **Auto Discovery**: Network device automatic discovery
- **SNMP Support**: v1/v2c/v3 protocol support
- **Real-time Metrics**: CPU, memory, interface monitoring
- **Device Grouping**: Logical device organization
- **Template System**: Pre-configured monitoring templates

#### 🚨 **Intelligent Alert Management**
- **Smart Rules**: Device-specific metric-based alerting
- **Interface Monitoring**: Network interface status alerts
- **Multi-channel Notifications**: Email, Slack, SMS, Webhook
- **Alert Templates**: Pre-defined alert rule templates
- **Escalation Policies**: Advanced alert routing and escalation

#### ⚙️ **Smart Configuration Generator**
- **Template Engine**: Intelligent configuration generation
- **Multi-format Support**: Prometheus, Grafana, VictoriaMetrics
- **Validation Engine**: Configuration syntax validation
- **Remote Deployment**: SSH-based configuration deployment
- **Version Control**: Configuration versioning and rollback

#### 🔐 **Enterprise System Management**
- **User Management**: Role-based access control (Admin, Operator, Viewer)
- **Audit Logging**: Comprehensive security audit trail
- **SSH Key Management**: Centralized SSH key management
- **System Health**: Real-time system component monitoring
- **Backup & Recovery**: Automated backup and recovery system

### 🏗️ Architecture

#### Frontend (Next.js 13)
- **Framework**: Next.js with TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks
- **Real-time Updates**: WebSocket integration
- **Responsive Design**: Mobile-first responsive design

#### Backend (Go)
- **Language**: Go 1.21+
- **Framework**: Gin HTTP framework
- **Database**: SQLite with GORM ORM
- **Authentication**: JWT-based authentication
- **SSH Client**: Built-in SSH client for remote operations

#### Supported Components
- **Collectors**: Node Exporter, Categraf, SNMP Exporter, VMAgent
- **Storage**: VictoriaMetrics (Single/Cluster), VMStorage, VMInsert, VMSelect
- **Visualization**: Grafana
- **Alerting**: VMAlert, Alertmanager

### 🚀 Quick Start

#### Prerequisites
- Node.js 18+ and npm/yarn
- Go 1.21+
- Git

#### 1. Clone Repository
```bash
git clone https://github.com/your-username/snmp-monitor-pro.git
cd snmp-monitor-pro
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Go dependencies
go mod tidy

# Run backend server
go run .
```

The backend will start on `http://localhost:8080`

#### 3. Frontend Setup
```bash
# Open new terminal and navigate to project root
cd snmp-monitor-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

#### 4. Production Build
```bash
# Build frontend for production
npm run build

# Start production server
npm start
```

### 📖 Usage Guide

#### 1. Initial Setup
1. **Start Backend**: Ensure Go backend is running on port 8080
2. **Access Frontend**: Open http://localhost:3000 in your browser
3. **Check System Health**: Verify all components are healthy in the dashboard

#### 2. Host Management
1. Navigate to **Component Installer** → **Host Discovery**
2. Add remote hosts with SSH credentials:
   - **Hostname**: server.example.com
   - **IP Address**: 192.168.1.100
   - **SSH Port**: 22 (default)
   - **Username**: root or your user
   - **Authentication**: Password or SSH Key
3. Test connections and verify host status
4. Configure SSH keys for secure access

#### 3. Component Installation
1. Go to **Component Installer** → **Component Library**
2. **Select Target Host** from the dropdown (required)
3. Browse available components:
   - **Data Collectors**: Node Exporter, Categraf, SNMP Exporter
   - **Storage Systems**: VictoriaMetrics Single/Cluster
   - **Visualization**: Grafana
   - **Alerting**: VMAlert, Alertmanager
4. Click **Install** button on desired components
5. Monitor installation progress in real-time
6. Manage installed components (Start/Stop/Remove)

#### 4. MIB File Management
1. Navigate to **MIB Manager**
2. **Upload MIB Files**:
   - Single files (.mib, .txt)
   - Archives (.zip, .tar.gz, .rar)
3. **Configure Server Paths** for automatic sync
4. **Validate and Parse** MIB files
5. **Organize by Vendor** and category
6. **Extract OIDs** for configuration generation

#### 5. Device Monitoring
1. Go to **Device Monitoring**
2. **Auto-discover** network devices:
   - Set network range (e.g., 192.168.1.0/24)
   - Configure SNMP community string
   - Select SNMP version (v1/v2c/v3)
3. **Manual device addition**:
   - Device name and IP
   - SNMP configuration
   - Device type and location
4. **Group devices** logically
5. **Apply monitoring templates**

#### 6. Alert Configuration
1. Navigate to **Alert Manager**
2. **Create Alert Rules**:
   - Select target devices
   - Define metric thresholds
   - Set severity levels
3. **Configure Notifications**:
   - Email (SMTP)
   - Slack webhooks
   - SMS (Twilio)
   - Custom webhooks
4. **Test alert delivery**

#### 7. Configuration Management
1. Go to **Config Generator**
2. **Select OIDs** from parsed MIB files
3. **Choose configuration template**:
   - SNMP Exporter
   - Categraf
   - Prometheus
4. **Generate configuration** files
5. **Deploy to target hosts** via SSH
6. **Monitor deployment** status

### 🔧 API Documentation

#### Host Management
```bash
# List all hosts
GET /api/v1/hosts

# Create new host
POST /api/v1/hosts
{
  "name": "server-01",
  "ip": "192.168.1.100",
  "ssh_port": 22,
  "username": "root",
  "auth_method": "password",
  "password": "your-password"
}

# Test host connection
POST /api/v1/hosts/:id/test

# Delete host
DELETE /api/v1/hosts/:id
```

#### Component Management
```bash
# List available components
GET /api/v1/components

# Install component
POST /api/v1/components/install
{
  "component_id": "node-exporter",
  "host_id": "1",
  "version": "1.8.2",
  "auto_start": true
}

# Get component status
GET /api/v1/components/status/:id

# Start/Stop component
POST /api/v1/components/start/:id
POST /api/v1/components/stop/:id
```

#### MIB Management
```bash
# List MIB files
GET /api/v1/mibs

# Upload MIB file
POST /api/v1/mibs/upload
Content-Type: multipart/form-data

# Get parsed OIDs
GET /api/v1/mibs/oids

# Validate MIB file
POST /api/v1/mibs/:id/validate
```

### 🛠️ Development

#### Project Structure
```
snmp-monitor-pro/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard
├── components/             # React components
│   ├── alerts/            # Alert management
│   ├── config/            # Configuration generator
│   ├── dashboard/         # Real-time dashboard
│   ├── mib/              # MIB management
│   ├── monitoring/        # Device monitoring & installer
│   ├── system/           # System management
│   └── ui/               # UI components (shadcn/ui)
├── backend/               # Go backend
│   ├── main.go           # Main server
│   ├── models.go         # Data models
│   ├── handlers.go       # API handlers
│   ├── ssh.go            # SSH client
│   └── mib.go            # MIB management
├── lib/                  # Utility functions
└── public/               # Static assets
```

#### Adding New Components
1. **Define Component** in backend/models.go
2. **Add Installation Logic** in backend/handlers.go
3. **Update Frontend** component list
4. **Add Configuration Templates**
5. **Update Documentation**

#### Database Schema
The platform uses SQLite with the following main tables:
- **hosts**: Remote host information
- **components**: Available monitoring components
- **mib_files**: Uploaded MIB files
- **devices**: Network devices
- **alerts**: Alert rules and status
- **configs**: Configuration templates
- **users**: User accounts
- **audit_logs**: System audit trail

### 🔐 Security Features

- **JWT Authentication**: Secure API access
- **SSH Key Management**: Centralized key storage
- **Role-based Access**: Admin, Operator, Viewer roles
- **Audit Logging**: Complete activity tracking
- **Encrypted Storage**: Sensitive data encryption

### 📊 Monitoring Stack Integration

#### Prometheus Ecosystem
- **Node Exporter**: System metrics collection
- **SNMP Exporter**: Network device monitoring
- **Alertmanager**: Alert routing and notifications

#### VictoriaMetrics
- **Single Node**: High-performance time series database
- **Cluster Mode**: Horizontally scalable deployment
- **VMAlert**: Fast alerting engine

#### Grafana
- **Dashboard Creation**: Rich visualization
- **Data Source Integration**: Multiple backend support
- **Alert Visualization**: Integrated alerting

### 🚨 Troubleshooting

#### Common Issues

1. **Backend Connection Failed**
   ```bash
   # Check if backend is running
   curl http://localhost:8080/health
   
   # Restart backend
   cd backend && go run .
   ```

2. **No Hosts Available**
   - Ensure SSH connectivity to target hosts
   - Verify credentials and network access
   - Check firewall settings

3. **Component Installation Failed**
   - Verify host architecture compatibility
   - Check SSH permissions
   - Review installation logs

4. **MIB Upload Issues**
   - Ensure file format is correct (.mib, .txt)
   - Check file size limits
   - Verify MIB syntax

#### Debug Mode
```bash
# Enable debug logging
export DEBUG=true
go run .
```

### 📄 License

MIT License - see LICENSE file for details

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 📞 Support

- **Documentation**: [Wiki](https://github.com/your-username/snmp-monitor-pro/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/snmp-monitor-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/snmp-monitor-pro/discussions)

---

## Chinese

### 🚀 企业级SNMP MIB管理和网络监控平台

SNMP Monitor Pro是一个全面的企业级网络监控平台，提供智能SNMP MIB管理、自动化组件部署、实时设备监控和高级告警功能。

### ✨ 核心功能

#### 🔧 **智能组件安装器**
- **自动化部署**: 一键安装监控组件到远程主机
- **多架构支持**: 兼容x86_64、ARM64、ARMv7架构
- **SSH管理**: 安全的密钥和密码认证
- **集群组件**: 支持VictoriaMetrics集群部署
- **实时状态**: 实时部署进度和健康监控

#### 📊 **高级MIB管理**
- **多源支持**: 文件上传、服务器路径同步、压缩包解压
- **智能验证**: 自动MIB文件解析和验证
- **压缩包处理**: ZIP、TAR.GZ、RAR自动解压
- **版本控制**: MIB文件版本管理和依赖跟踪
- **厂商分类**: 自动厂商和类别检测

#### 🌐 **全面设备监控**
- **自动发现**: 网络设备自动发现
- **SNMP支持**: v1/v2c/v3协议支持
- **实时指标**: CPU、内存、接口监控
- **设备分组**: 逻辑设备组织
- **模板系统**: 预配置监控模板

#### 🚨 **智能告警管理**
- **智能规则**: 基于设备特定指标的告警
- **接口监控**: 网络接口状态告警
- **多通道通知**: 邮件、Slack、短信、Webhook
- **告警模板**: 预定义告警规则模板
- **升级策略**: 高级告警路由和升级

#### ⚙️ **智能配置生成器**
- **模板引擎**: 智能配置生成
- **多格式支持**: Prometheus、Grafana、VictoriaMetrics
- **验证引擎**: 配置语法验证
- **远程部署**: 基于SSH的配置部署
- **版本控制**: 配置版本管理和回滚

#### 🔐 **企业系统管理**
- **用户管理**: 基于角色的访问控制（管理员、操作员、查看者）
- **审计日志**: 全面的安全审计跟踪
- **SSH密钥管理**: 集中式SSH密钥管理
- **系统健康**: 实时系统组件监控
- **备份恢复**: 自动化备份和恢复系统

### 🏗️ 系统架构

#### 前端 (Next.js 13)
- **框架**: Next.js with TypeScript
- **UI库**: Tailwind CSS + shadcn/ui
- **状态管理**: React Hooks
- **实时更新**: WebSocket集成
- **响应式设计**: 移动优先响应式设计

#### 后端 (Go)
- **语言**: Go 1.21+
- **框架**: Gin HTTP框架
- **数据库**: SQLite with GORM ORM
- **认证**: 基于JWT的认证
- **SSH客户端**: 内置SSH客户端用于远程操作

#### 支持的组件
- **采集器**: Node Exporter、Categraf、SNMP Exporter、VMAgent
- **存储**: VictoriaMetrics（单机/集群）、VMStorage、VMInsert、VMSelect
- **可视化**: Grafana
- **告警**: VMAlert、Alertmanager

### 🚀 快速开始

#### 环境要求
- Node.js 18+ 和 npm/yarn
- Go 1.21+
- Git

#### 1. 克隆仓库
```bash
git clone https://github.com/your-username/snmp-monitor-pro.git
cd snmp-monitor-pro
```

#### 2. 后端设置
```bash
# 进入后端目录
cd backend

# 安装Go依赖
go mod tidy

# 运行后端服务器
go run .
```

后端将在 `http://localhost:8080` 启动

#### 3. 前端设置
```bash
# 打开新终端并导航到项目根目录
cd snmp-monitor-pro

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端将在 `http://localhost:3000` 启动

#### 4. 生产环境构建
```bash
# 构建前端生产版本
npm run build

# 启动生产服务器
npm start
```

### 📖 使用指南

#### 1. 初始设置
1. **启动后端**: 确保Go后端在8080端口运行
2. **访问前端**: 在浏览器中打开 http://localhost:3000
3. **检查系统健康**: 在仪表板中验证所有组件健康状态

#### 2. 主机管理
1. 导航到 **组件安装器** → **主机发现**
2. 添加带有SSH凭据的远程主机：
   - **主机名**: server.example.com
   - **IP地址**: 192.168.1.100
   - **SSH端口**: 22（默认）
   - **用户名**: root或您的用户
   - **认证方式**: 密码或SSH密钥
3. 测试连接并验证主机状态
4. 配置SSH密钥以实现安全访问

#### 3. 组件安装
1. 转到 **组件安装器** → **组件库**
2. **选择目标主机**（必需）
3. 浏览可用组件：
   - **数据采集器**: Node Exporter、Categraf、SNMP Exporter
   - **存储系统**: VictoriaMetrics单机/集群版
   - **可视化**: Grafana
   - **告警**: VMAlert、Alertmanager
4. 点击所需组件的**安装**按钮
5. 实时监控安装进度
6. 管理已安装的组件（启动/停止/移除）

#### 4. MIB文件管理
1. 导航到 **MIB管理器**
2. **上传MIB文件**：
   - 单个文件（.mib、.txt）
   - 压缩包（.zip、.tar.gz、.rar）
3. **配置服务器路径**以实现自动同步
4. **验证和解析**MIB文件
5. **按厂商分类**组织
6. **提取OID**用于配置生成

#### 5. 设备监控
1. 转到 **设备监控**
2. **自动发现**网络设备：
   - 设置网络范围（如192.168.1.0/24）
   - 配置SNMP团体字符串
   - 选择SNMP版本（v1/v2c/v3）
3. **手动添加设备**：
   - 设备名称和IP
   - SNMP配置
   - 设备类型和位置
4. **逻辑分组**设备
5. **应用监控模板**

#### 6. 告警配置
1. 导航到 **告警管理器**
2. **创建告警规则**：
   - 选择目标设备
   - 定义指标阈值
   - 设置严重级别
3. **配置通知**：
   - 邮件（SMTP）
   - Slack webhook
   - 短信（Twilio）
   - 自定义webhook
4. **测试告警传递**

#### 7. 配置管理
1. 转到 **配置生成器**
2. **选择OID**从解析的MIB文件
3. **选择配置模板**：
   - SNMP Exporter
   - Categraf
   - Prometheus
4. **生成配置**文件
5. **通过SSH部署**到目标主机
6. **监控部署**状态

### 🔧 API文档

#### 主机管理
```bash
# 获取所有主机
GET /api/v1/hosts

# 创建新主机
POST /api/v1/hosts
{
  "name": "server-01",
  "ip": "192.168.1.100",
  "ssh_port": 22,
  "username": "root",
  "auth_method": "password",
  "password": "your-password"
}

# 测试主机连接
POST /api/v1/hosts/:id/test

# 删除主机
DELETE /api/v1/hosts/:id
```

#### 组件管理
```bash
# 获取可用组件
GET /api/v1/components

# 安装组件
POST /api/v1/components/install
{
  "component_id": "node-exporter",
  "host_id": "1",
  "version": "1.8.2",
  "auto_start": true
}

# 获取组件状态
GET /api/v1/components/status/:id

# 启动/停止组件
POST /api/v1/components/start/:id
POST /api/v1/components/stop/:id
```

#### MIB管理
```bash
# 获取MIB文件列表
GET /api/v1/mibs

# 上传MIB文件
POST /api/v1/mibs/upload
Content-Type: multipart/form-data

# 获取解析的OID
GET /api/v1/mibs/oids

# 验证MIB文件
POST /api/v1/mibs/:id/validate
```

### 🛠️ 开发

#### 项目结构
```
snmp-monitor-pro/
├── app/                    # Next.js应用目录
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主仪表板
├── components/             # React组件
│   ├── alerts/            # 告警管理
│   ├── config/            # 配置生成器
│   ├── dashboard/         # 实时仪表板
│   ├── mib/              # MIB管理
│   ├── monitoring/        # 设备监控和安装器
│   ├── system/           # 系统管理
│   └── ui/               # UI组件（shadcn/ui）
├── backend/               # Go后端
│   ├── main.go           # 主服务器
│   ├── models.go         # 数据模型
│   ├── handlers.go       # API处理器
│   ├── ssh.go            # SSH客户端
│   └── mib.go            # MIB管理
├── lib/                  # 工具函数
└── public/               # 静态资源
```

#### 添加新组件
1. **定义组件**在backend/models.go中
2. **添加安装逻辑**在backend/handlers.go中
3. **更新前端**组件列表
4. **添加配置模板**
5. **更新文档**

#### 数据库架构
平台使用SQLite，主要表包括：
- **hosts**: 远程主机信息
- **components**: 可用监控组件
- **mib_files**: 上传的MIB文件
- **devices**: 网络设备
- **alerts**: 告警规则和状态
- **configs**: 配置模板
- **users**: 用户账户
- **audit_logs**: 系统审计跟踪

### 🔐 安全特性

- **JWT认证**: 安全的API访问
- **SSH密钥管理**: 集中式密钥存储
- **基于角色的访问**: 管理员、操作员、查看者角色
- **审计日志**: 完整的活动跟踪
- **加密存储**: 敏感数据加密

### 📊 监控栈集成

#### Prometheus生态系统
- **Node Exporter**: 系统指标收集
- **SNMP Exporter**: 网络设备监控
- **Alertmanager**: 告警路由和通知

#### VictoriaMetrics
- **单节点**: 高性能时间序列数据库
- **集群模式**: 水平可扩展部署
- **VMAlert**: 快速告警引擎

#### Grafana
- **仪表板创建**: 丰富的可视化
- **数据源集成**: 多后端支持
- **告警可视化**: 集成告警

### 🚨 故障排除

#### 常见问题

1. **后端连接失败**
   ```bash
   # 检查后端是否运行
   curl http://localhost:8080/health
   
   # 重启后端
   cd backend && go run .
   ```

2. **没有可用主机**
   - 确保SSH连接到目标主机
   - 验证凭据和网络访问
   - 检查防火墙设置

3. **组件安装失败**
   - 验证主机架构兼容性
   - 检查SSH权限
   - 查看安装日志

4. **MIB上传问题**
   - 确保文件格式正确（.mib、.txt）
   - 检查文件大小限制
   - 验证MIB语法

#### 调试模式
```bash
# 启用调试日志
export DEBUG=true
go run .
```

### 📄 许可证

MIT许可证 - 详情请参阅LICENSE文件

### 🤝 贡献

1. Fork仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

### 📞 支持

- **文档**: [Wiki](https://github.com/your-username/snmp-monitor-pro/wiki)
- **问题**: [GitHub Issues](https://github.com/your-username/snmp-monitor-pro/issues)
- **讨论**: [GitHub Discussions](https://github.com/your-username/snmp-monitor-pro/discussions)