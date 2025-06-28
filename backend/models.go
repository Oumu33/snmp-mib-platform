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
	SSHPort      int       `json:"ssh_port" gorm:"default:22"`
	Username     string    `json:"username" gorm:"not null"`
	AuthMethod   string    `json:"auth_method" gorm:"not null"` // password, key
	Password     string    `json:"password,omitempty"`
	SSHKey       string    `json:"ssh_key,omitempty"`
	OS           string    `json:"os"`
	Architecture string    `json:"architecture"`
	Status       string    `json:"status" gorm:"default:disconnected"` // connected, disconnected, connecting, error
	LastSeen     time.Time `json:"last_seen"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
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
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
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
	UploadedAt  time.Time `json:"uploaded_at"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
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