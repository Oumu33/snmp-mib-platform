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

#### Frontend Setup
```bash
# Clone repository
git clone <repository-url>
cd snmp-monitor-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Go dependencies
go mod tidy

# Run backend server
go run .
```

#### Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### 📖 Usage Guide

#### 1. Host Management
1. Navigate to **Component Installer** → **Host Management**
2. Add remote hosts with SSH credentials
3. Test connections and verify host status
4. Configure SSH keys for secure access

#### 2. Component Installation
1. Select target host from connected hosts
2. Choose monitoring components to install
3. Configure component-specific settings
4. Monitor installation progress in real-time

#### 3. MIB File Management
1. Upload individual MIB files or archives
2. Configure server paths for automatic sync
3. Validate and parse MIB files
4. Organize by vendor and category

#### 4. Device Monitoring
1. Discover network devices automatically
2. Configure SNMP settings (community, version)
3. Group devices logically
4. Apply monitoring templates

#### 5. Alert Configuration
1. Create device-specific alert rules
2. Configure metric thresholds
3. Set up notification channels
4. Test alert delivery

#### 6. Configuration Management
1. Generate monitoring configurations
2. Validate configuration syntax
3. Deploy to target hosts
4. Monitor deployment status

### 🔧 API Documentation

#### Host Management
```
GET    /api/v1/hosts              # List hosts
POST   /api/v1/hosts              # Create host
PUT    /api/v1/hosts/:id          # Update host
DELETE /api/v1/hosts/:id          # Delete host
POST   /api/v1/hosts/:id/test     # Test connection
```

#### Component Management
```
GET    /api/v1/components         # List components
POST   /api/v1/components/install # Install component
GET    /api/v1/components/status/:id # Get status
POST   /api/v1/components/start/:id  # Start component
POST   /api/v1/components/stop/:id   # Stop component
```

#### MIB Management
```
GET    /api/v1/mibs               # List MIB files
POST   /api/v1/mibs/upload        # Upload MIB file
DELETE /api/v1/mibs/:id           # Delete MIB file
POST   /api/v1/mibs/:id/validate  # Validate MIB
```

### 🛠️ Development

#### Project Structure
```
snmp-monitor-pro/
├── app/                    # Next.js app directory
├── components/             # React components
│   ├── alerts/            # Alert management
│   ├── config/            # Configuration generator
│   ├── dashboard/         # Real-time dashboard
│   ├── mib/              # MIB management
│   ├── monitoring/        # Device monitoring
│   ├── system/           # System management
│   └── ui/               # UI components
├── backend/               # Go backend
│   ├── main.go           # Main server
│   ├── models.go         # Data models
│   ├── handlers.go       # API handlers
│   ├── ssh.go            # SSH client
│   └── mib.go            # MIB management
└── lib/                  # Utility functions
```

#### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### 📄 License

MIT License - see LICENSE file for details

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

#### 前端设置
```bash
# 克隆仓库
git clone <repository-url>
cd snmp-monitor-pro

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 后端设置
```bash
# 进入后端目录
cd backend

# 安装Go依赖
go mod tidy

# 运行后端服务器
go run .
```

#### 访问应用
- 前端: http://localhost:3000
- 后端API: http://localhost:8080

### 📖 使用指南

#### 1. 主机管理
1. 导航到 **组件安装器** → **主机管理**
2. 添加带有SSH凭据的远程主机
3. 测试连接并验证主机状态
4. 配置SSH密钥以实现安全访问

#### 2. 组件安装
1. 从已连接的主机中选择目标主机
2. 选择要安装的监控组件
3. 配置组件特定设置
4. 实时监控安装进度

#### 3. MIB文件管理
1. 上传单个MIB文件或压缩包
2. 配置服务器路径以实现自动同步
3. 验证和解析MIB文件
4. 按厂商和类别组织

#### 4. 设备监控
1. 自动发现网络设备
2. 配置SNMP设置（团体字符串、版本）
3. 逻辑分组设备
4. 应用监控模板

#### 5. 告警配置
1. 创建设备特定的告警规则
2. 配置指标阈值
3. 设置通知渠道
4. 测试告警传递

#### 6. 配置管理
1. 生成监控配置
2. 验证配置语法
3. 部署到目标主机
4. 监控部署状态

### 🔧 API文档

#### 主机管理
```
GET    /api/v1/hosts              # 获取主机列表
POST   /api/v1/hosts              # 创建主机
PUT    /api/v1/hosts/:id          # 更新主机
DELETE /api/v1/hosts/:id          # 删除主机
POST   /api/v1/hosts/:id/test     # 测试连接
```

#### 组件管理
```
GET    /api/v1/components         # 获取组件列表
POST   /api/v1/components/install # 安装组件
GET    /api/v1/components/status/:id # 获取状态
POST   /api/v1/components/start/:id  # 启动组件
POST   /api/v1/components/stop/:id   # 停止组件
```

#### MIB管理
```
GET    /api/v1/mibs               # 获取MIB文件列表
POST   /api/v1/mibs/upload        # 上传MIB文件
DELETE /api/v1/mibs/:id           # 删除MIB文件
POST   /api/v1/mibs/:id/validate  # 验证MIB
```

### 🛠️ 开发

#### 项目结构
```
snmp-monitor-pro/
├── app/                    # Next.js应用目录
├── components/             # React组件
│   ├── alerts/            # 告警管理
│   ├── config/            # 配置生成器
│   ├── dashboard/         # 实时仪表板
│   ├── mib/              # MIB管理
│   ├── monitoring/        # 设备监控
│   ├── system/           # 系统管理
│   └── ui/               # UI组件
├── backend/               # Go后端
│   ├── main.go           # 主服务器
│   ├── models.go         # 数据模型
│   ├── handlers.go       # API处理器
│   ├── ssh.go            # SSH客户端
│   └── mib.go            # MIB管理
└── lib/                  # 工具函数
```

#### 贡献
1. Fork仓库
2. 创建功能分支
3. 进行更改
4. 如适用，添加测试
5. 提交拉取请求

### 📄 许可证

MIT许可证 - 详情请参阅LICENSE文件