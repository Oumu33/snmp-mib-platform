package main

import (
	"time"

	"gorm.io/gorm"
)

// Host represents a remote host for component deployment
type Host struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Name         string    `json:"name" gorm:"not null"`
	IP           string    `json:"ip" gorm:"not null;unique"`
	Type         string    `json:"type" gorm:"default:internal"` // cloud, internal, edge
	Location     string    `json:"location"`
	Region       string    `json:"region"`       // For cloud hosts
	Provider     string    `json:"provider"`     // AWS, Azure, GCP, etc.
	SSHPort      int       `json:"ssh_port" gorm:"default:22"`
	Username     string    `json:"username" gorm:"not null"`
	AuthMethod   string    `json:"auth_method" gorm:"not null"` // password, key
	Password     string    `json:"password,omitempty"`
	SSHKey       string    `json:"ssh_key,omitempty"`
	SSHKeyID     string    `json:"ssh_key_id,omitempty"`
	OS           string    `json:"os"`
	Architecture string    `json:"architecture"`
	Status       string    `json:"status" gorm:"default:disconnected"` // connected, disconnected, connecting, error
	LastSeen     time.Time `json:"last_seen"`
	
	// System specifications
	CPUCores     int    `json:"cpu_cores"`
	CPUModel     string `json:"cpu_model"`
	MemoryGB     int    `json:"memory_gb"`
	DiskGB       int    `json:"disk_gb"`
	
	// Network access capabilities
	InternalAccess bool `json:"internal_access" gorm:"default:true"`
	ExternalAccess bool `json:"external_access" gorm:"default:false"`
	NetworkLatency int  `json:"network_latency"` // in milliseconds
	
	// Installed components
	InstalledComponents string `json:"installed_components" gorm:"type:text"` // JSON array
	
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Component represents a monitoring component
type Component struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Name         string    `json:"name" gorm:"not null"`
	Type         string    `json:"type" gorm:"not null"` // collector, storage, visualization, alerting
	Version      string    `json:"version" gorm:"not null"`
	Port         int       `json:"port"`
	Description  string    `json:"description"`
	DownloadURL  string    `json:"download_url"`
	ConfigPath   string    `json:"config_path"`
	ServiceName  string    `json:"service_name"`
	Status       string    `json:"status" gorm:"default:available"` // available, installing, installed, failed
	HostID       *uint     `json:"host_id"`
	Host         Host      `json:"host,omitempty" gorm:"foreignKey:HostID"`
	
	// Component metadata
	ReleaseDate    string `json:"release_date"`
	Size           string `json:"size"`
	DownloadCount  int    `json:"download_count"`
	Architecture   string `json:"architecture" gorm:"type:text"` // JSON array
	Dependencies   string `json:"dependencies" gorm:"type:text"` // JSON array
	Ports          string `json:"ports" gorm:"type:text"`        // JSON array
	IsCluster      bool   `json:"is_cluster" gorm:"default:false"`
	ClusterComponents string `json:"cluster_components" gorm:"type:text"` // JSON array
	GitHubURL      string `json:"github_url"`
	Documentation  string `json:"documentation"`
	
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Installation represents a component installation job
type Installation struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	ComponentID   string    `json:"component_id" gorm:"not null"`
	ComponentName string    `json:"component_name"`
	HostID        uint      `json:"host_id" gorm:"not null"`
	HostName      string    `json:"host_name"`
	Version       string    `json:"version"`
	Status        string    `json:"status" gorm:"default:pending"` // pending, downloading, installing, configuring, starting, completed, failed
	Progress      int       `json:"progress" gorm:"default:0"`
	StartTime     time.Time `json:"start_time"`
	EndTime       *time.Time `json:"end_time"`
	Logs          string    `json:"logs" gorm:"type:text"` // JSON array
	Error         string    `json:"error"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// MIBFile represents a MIB file
type MIBFile struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Filename    string    `json:"filename" gorm:"not null"`
	Vendor      string    `json:"vendor"`
	Version     string    `json:"version"`
	Size        int64     `json:"size"`
	FilePath    string    `json:"file_path"`
	Status      string    `json:"status" gorm:"default:pending"` // pending, validated, error
	OIDCount    int       `json:"oid_count"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	Source      string    `json:"source" gorm:"default:upload"` // upload, server, archive
	SourcePath  string    `json:"source_path"`
	ArchiveID   *uint     `json:"archive_id"`
	UploadedAt  time.Time `json:"uploaded_at"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// MIBServerPath represents a server path configuration
type MIBServerPath struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Name     string `json:"name" gorm:"not null"`
	Host     string `json:"host" gorm:"not null"`
	Path     string `json:"path" gorm:"not null"`
	SSHPort  int    `json:"ssh_port" gorm:"default:22"`
	Username string `json:"username"`
	Password string `json:"password,omitempty"`
	SSHKey   string `json:"ssh_key,omitempty"`
	AutoSync bool   `json:"auto_sync" gorm:"default:false"`
	Status   string `json:"status" gorm:"default:disconnected"` // connected, disconnected, scanning
	LastScan time.Time `json:"last_scan"`
	FileCount int    `json:"file_count" gorm:"default:0"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// MIBArchive represents an uploaded archive
type MIBArchive struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	Name          string    `json:"name" gorm:"not null"`
	OriginalName  string    `json:"original_name"`
	Size          int64     `json:"size"`
	FilePath      string    `json:"file_path"`
	Status        string    `json:"status" gorm:"default:uploaded"` // uploaded, extracting, extracted, error
	ExtractedFiles int      `json:"extracted_files" gorm:"default:0"`
	TotalFiles    int       `json:"total_files" gorm:"default:0"`
	Progress      int       `json:"progress" gorm:"default:0"`
	ErrorMessage  string    `json:"error_message,omitempty"`
	UploadedAt    time.Time `json:"uploaded_at"`
	ExtractedAt   *time.Time `json:"extracted_at"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// Device represents a network device
type Device struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Name         string    `json:"name" gorm:"not null"`
	IP           string    `json:"ip" gorm:"not null;unique"`
	Type         string    `json:"type" gorm:"not null"` // router, switch, server, printer, ups, firewall
	Vendor       string    `json:"vendor"`
	Model        string    `json:"model"`
	Location     string    `json:"location"`
	SNMPVersion  string    `json:"snmp_version" gorm:"default:v2c"`
	Community    string    `json:"community" gorm:"default:public"`
	SNMPPort     int       `json:"snmp_port" gorm:"default:161"`
	Status       string    `json:"status" gorm:"default:unknown"` // online, offline, warning, critical
	LastPolled   time.Time `json:"last_polled"`
	GroupName    string    `json:"group_name"`
	
	// Performance metrics
	CPUUsage     float64 `json:"cpu_usage"`
	MemoryUsage  float64 `json:"memory_usage"`
	DiskUsage    float64 `json:"disk_usage"`
	Temperature  float64 `json:"temperature"`
	Uptime       string  `json:"uptime"`
	
	// Network interfaces
	InterfaceCount       int `json:"interface_count"`
	ActiveInterfaceCount int `json:"active_interface_count"`
	
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Alert represents an alert
type Alert struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Description string    `json:"description"`
	Severity    string    `json:"severity" gorm:"not null"` // critical, warning, info
	Status      string    `json:"status" gorm:"default:active"` // active, resolved, silenced
	Source      string    `json:"source"`
	Metric      string    `json:"metric"`
	Threshold   string    `json:"threshold"`
	Value       string    `json:"value"`
	DeviceID    *uint     `json:"device_id"`
	Device      Device    `json:"device,omitempty" gorm:"foreignKey:DeviceID"`
	TriggeredAt time.Time `json:"triggered_at"`
	ResolvedAt  *time.Time `json:"resolved_at"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Config represents a configuration template
type Config struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Type        string    `json:"type" gorm:"not null"` // prometheus, grafana, victoriametrics, etc.
	Version     string    `json:"version"`
	Content     string    `json:"content" gorm:"type:text"`
	Description string    `json:"description"`
	Status      string    `json:"status" gorm:"default:draft"` // draft, active, deprecated
	CreatedBy   string    `json:"created_by"`
	TargetHosts string    `json:"target_hosts" gorm:"type:text"` // JSON array
	DeployedAt  *time.Time `json:"deployed_at"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// User represents a system user
type User struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Username  string    `json:"username" gorm:"not null;unique"`
	Email     string    `json:"email" gorm:"not null;unique"`
	Password  string    `json:"password,omitempty" gorm:"not null"`
	Role      string    `json:"role" gorm:"default:viewer"` // admin, operator, viewer
	Status    string    `json:"status" gorm:"default:active"` // active, inactive, locked
	LastLogin *time.Time `json:"last_login"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// AuditLog represents system audit logs
type AuditLog struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id"`
	User      User      `json:"user" gorm:"foreignKey:UserID"`
	Action    string    `json:"action" gorm:"not null"`
	Resource  string    `json:"resource"`
	Details   string    `json:"details"`
	IP        string    `json:"ip"`
	Status    string    `json:"status"` // success, warning, error
	CreatedAt time.Time `json:"created_at"`
}

// SSHKey represents an SSH key pair
type SSHKey struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Fingerprint string    `json:"fingerprint"`
	PublicKey   string    `json:"public_key" gorm:"type:text"`
	PrivateKey  string    `json:"private_key,omitempty" gorm:"type:text"`
	Status      string    `json:"status" gorm:"default:active"` // active, inactive
	UsedByHosts string    `json:"used_by_hosts" gorm:"type:text"` // JSON array
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}