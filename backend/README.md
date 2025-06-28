# SNMP Monitor Pro Backend | SNMP监控专业版后端

[English](#english) | [中文](#chinese)

---

## English

### 🚀 Enterprise SNMP Monitoring Backend Service

High-performance Go backend service for SNMP Monitor Pro, providing comprehensive API endpoints for network monitoring, device management, and system administration.

### 🏗️ Technology Stack

- **Language**: Go 1.21+
- **Framework**: Gin (HTTP Web Framework)
- **Database**: SQLite with GORM ORM
- **Authentication**: JWT-based authentication
- **SSH Client**: Built-in SSH client for remote operations
- **Deployment**: Binary deployment

### ✨ Core Modules

#### 1. **Host Management**
- SSH connection management
- Remote host discovery
- Host status monitoring
- Batch host operations
- Key-based and password authentication

#### 2. **Component Installation**
- Automated component deployment
- Service status management
- Configuration file management
- Version control
- Multi-architecture support (x86_64, ARM64, ARMv7)

#### 3. **MIB File Management**
- File upload and parsing
- Format validation
- Version control
- Batch operations
- Archive extraction (ZIP, TAR.GZ, RAR)
- Server path synchronization

#### 4. **Device Monitoring**
- SNMP device discovery
- Real-time status monitoring
- Alert management
- Performance metrics collection
- Device grouping and templates

#### 5. **Configuration Management**
- Intelligent configuration generation
- Template system
- Configuration validation
- Remote deployment
- Version control and rollback

#### 6. **System Management**
- User permission management
- Audit logging
- System health monitoring
- Backup and recovery
- Role-based access control

### 🔌 API Endpoints

#### Host Management
```
GET    /api/v1/hosts              # Get host list
POST   /api/v1/hosts              # Create host
PUT    /api/v1/hosts/:id          # Update host
DELETE /api/v1/hosts/:id          # Delete host
POST   /api/v1/hosts/:id/test     # Test connection
```

#### Component Management
```
GET    /api/v1/components         # Get component list
POST   /api/v1/components/install # Install component
GET    /api/v1/components/status/:id # Get component status
POST   /api/v1/components/start/:id  # Start component
POST   /api/v1/components/stop/:id   # Stop component
```

#### MIB Management
```
GET    /api/v1/mibs               # Get MIB file list
POST   /api/v1/mibs/upload        # Upload MIB file
DELETE /api/v1/mibs/:id           # Delete MIB file
POST   /api/v1/mibs/:id/validate  # Validate MIB file
GET    /api/v1/mibs/server-paths  # Get server paths
POST   /api/v1/mibs/server-paths  # Create server path
POST   /api/v1/mibs/server-paths/:id/scan # Scan server path
GET    /api/v1/mibs/archives      # Get archives
POST   /api/v1/mibs/archives/upload # Upload archive
POST   /api/v1/mibs/archives/:id/extract # Extract archive
```

#### Device Management
```
GET    /api/v1/devices            # Get device list
POST   /api/v1/devices            # Create device
PUT    /api/v1/devices/:id        # Update device
DELETE /api/v1/devices/:id        # Delete device
POST   /api/v1/devices/discover   # Device discovery
```

#### Alert Management
```
GET    /api/v1/alerts             # Get alert list
POST   /api/v1/alerts             # Create alert
PUT    /api/v1/alerts/:id         # Update alert
DELETE /api/v1/alerts/:id         # Delete alert
```

#### Configuration Management
```
GET    /api/v1/configs            # Get configuration list
POST   /api/v1/configs            # Create configuration
POST   /api/v1/configs/generate   # Generate configuration
POST   /api/v1/configs/deploy     # Deploy configuration
```

#### System Management
```
GET    /api/v1/users              # Get user list
POST   /api/v1/users              # Create user
GET    /api/v1/audit-logs         # Get audit logs
GET    /api/v1/system/health      # System health check
```

### 🚀 Quick Start

#### 1. Install Dependencies
```bash
cd backend
go mod tidy
```

#### 2. Run Service
```bash
go run .
```

#### 3. Access API
Service will start on `http://localhost:8080`

### 📊 Database Models

#### Host
- Host information and SSH connection configuration
- Support for password and key authentication
- Real-time status monitoring

#### Component
- Monitoring component definitions
- Version management
- Deployment status tracking

#### MIBFile
- MIB file metadata
- Parsing status
- OID statistics

#### Device
- Network device information
- SNMP configuration
- Monitoring status

#### Alert
- Alert rules and status
- Severity level classification
- Associated device information

#### Config
- Configuration templates
- Version control
- Deployment history

#### User
- User account management
- Role permission control
- Login status tracking

#### AuditLog
- Operation records
- Security auditing
- User behavior tracking

### 🚀 Deployment

#### Binary Deployment
```bash
# Build
go build -o snmp-monitor-pro

# Run
./snmp-monitor-pro
```

#### System Requirements
- Go 1.21+
- Minimum 512MB RAM
- Minimum 1GB disk space
- Linux/macOS/Windows

### 🔐 Security Features

- JWT authentication mechanism
- Fine-grained permission control
- Sensitive data encryption
- Complete audit logging
- SSH key management

### 📦 Supported Components

#### Data Collectors
- Node Exporter
- Categraf
- SNMP Exporter
- VMAgent

#### Storage Systems
- VictoriaMetrics (Single Node)
- VictoriaMetrics Cluster
  - VMStorage
  - VMInsert
  - VMSelect

#### Visualization
- Grafana

#### Alerting Systems
- VMAlert
- Alertmanager

### 🛠️ Development Guide

#### Adding New API Endpoints
1. Define data models in `models.go`
2. Implement handler functions in `handlers.go`
3. Register routes in `main.go`

#### Adding New Component Support
1. Update component definitions
2. Implement installation logic
3. Add configuration templates
4. Update documentation

### 📄 License

MIT License

---

## Chinese

### 🚀 企业级SNMP监控后端服务

SNMP Monitor Pro的高性能Go后端服务，为网络监控、设备管理和系统管理提供全面的API端点。

### 🏗️ 技术栈

- **语言**: Go 1.21+
- **框架**: Gin (HTTP Web框架)
- **数据库**: SQLite with GORM ORM
- **认证**: 基于JWT的认证
- **SSH客户端**: 内置SSH客户端用于远程操作
- **部署**: 二进制部署

### ✨ 核心模块

#### 1. **主机管理**
- SSH连接管理
- 远程主机发现
- 主机状态监控
- 批量主机操作
- 基于密钥和密码的认证

#### 2. **组件安装**
- 自动化组件部署
- 服务状态管理
- 配置文件管理
- 版本控制
- 多架构支持 (x86_64, ARM64, ARMv7)

#### 3. **MIB文件管理**
- 文件上传和解析
- 格式验证
- 版本控制
- 批量操作
- 压缩包解压 (ZIP, TAR.GZ, RAR)
- 服务器路径同步

#### 4. **设备监控**
- SNMP设备发现
- 实时状态监控
- 告警管理
- 性能指标收集
- 设备分组和模板

#### 5. **配置管理**
- 智能配置生成
- 模板系统
- 配置验证
- 远程部署
- 版本控制和回滚

#### 6. **系统管理**
- 用户权限管理
- 审计日志
- 系统健康监控
- 备份恢复
- 基于角色的访问控制

### 🔌 API接口

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
GET    /api/v1/components/status/:id # 获取组件状态
POST   /api/v1/components/start/:id  # 启动组件
POST   /api/v1/components/stop/:id   # 停止组件
```

#### MIB管理
```
GET    /api/v1/mibs               # 获取MIB文件列表
POST   /api/v1/mibs/upload        # 上传MIB文件
DELETE /api/v1/mibs/:id           # 删除MIB文件
POST   /api/v1/mibs/:id/validate  # 验证MIB文件
GET    /api/v1/mibs/server-paths  # 获取服务器路径
POST   /api/v1/mibs/server-paths  # 创建服务器路径
POST   /api/v1/mibs/server-paths/:id/scan # 扫描服务器路径
GET    /api/v1/mibs/archives      # 获取压缩包
POST   /api/v1/mibs/archives/upload # 上传压缩包
POST   /api/v1/mibs/archives/:id/extract # 解压压缩包
```

#### 设备管理
```
GET    /api/v1/devices            # 获取设备列表
POST   /api/v1/devices            # 创建设备
PUT    /api/v1/devices/:id        # 更新设备
DELETE /api/v1/devices/:id        # 删除设备
POST   /api/v1/devices/discover   # 设备发现
```

#### 告警管理
```
GET    /api/v1/alerts             # 获取告警列表
POST   /api/v1/alerts             # 创建告警
PUT    /api/v1/alerts/:id         # 更新告警
DELETE /api/v1/alerts/:id         # 删除告警
```

#### 配置管理
```
GET    /api/v1/configs            # 获取配置列表
POST   /api/v1/configs            # 创建配置
POST   /api/v1/configs/generate   # 生成配置
POST   /api/v1/configs/deploy     # 部署配置
```

#### 系统管理
```
GET    /api/v1/users              # 获取用户列表
POST   /api/v1/users              # 创建用户
GET    /api/v1/audit-logs         # 获取审计日志
GET    /api/v1/system/health      # 系统健康检查
```

### 🚀 快速开始

#### 1. 安装依赖
```bash
cd backend
go mod tidy
```

#### 2. 运行服务
```bash
go run .
```

#### 3. 访问API
服务将在 `http://localhost:8080` 启动

### 📊 数据库模型

#### Host (主机)
- 主机信息和SSH连接配置
- 支持密码和密钥认证
- 实时状态监控

#### Component (组件)
- 监控组件定义
- 版本管理
- 部署状态跟踪

#### MIBFile (MIB文件)
- MIB文件元数据
- 解析状态
- OID统计

#### Device (设备)
- 网络设备信息
- SNMP配置
- 监控状态

#### Alert (告警)
- 告警规则和状态
- 严重级别分类
- 关联设备信息

#### Config (配置)
- 配置模板
- 版本控制
- 部署历史

#### User (用户)
- 用户账户管理
- 角色权限控制
- 登录状态跟踪

#### AuditLog (审计日志)
- 操作记录
- 安全审计
- 用户行为跟踪

### 🚀 部署说明

#### 二进制部署
```bash
# 编译
go build -o snmp-monitor-pro

# 运行
./snmp-monitor-pro
```

#### 系统要求
- Go 1.21+
- 最低512MB内存
- 最低1GB磁盘空间
- Linux/macOS/Windows

### 🔐 安全特性

- JWT认证机制
- 细粒度权限控制
- 敏感数据加密
- 完整审计日志
- SSH密钥管理

### 📦 支持的组件

#### 数据采集器
- Node Exporter
- Categraf
- SNMP Exporter
- VMAgent

#### 存储系统
- VictoriaMetrics (单机版)
- VictoriaMetrics 集群版
  - VMStorage
  - VMInsert
  - VMSelect

#### 可视化
- Grafana

#### 告警系统
- VMAlert
- Alertmanager

### 🛠️ 开发指南

#### 添加新的API接口
1. 在 `models.go` 中定义数据模型
2. 在 `handlers.go` 中实现处理函数
3. 在 `main.go` 中注册路由

#### 添加新的组件支持
1. 更新组件定义
2. 实现安装逻辑
3. 添加配置模板
4. 更新文档

### 📄 许可证

MIT许可证