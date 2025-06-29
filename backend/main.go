package main

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

func main() {
	// Initialize database
	var err error
	db, err = gorm.Open(sqlite.Open("snmp_monitor.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate schemas
	db.AutoMigrate(&Host{}, &Component{}, &MIBFile{}, &MIBServerPath{}, &MIBArchive{}, &Device{}, &Alert{}, &Config{}, &User{}, &AuditLog{})

	// Initialize Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	// Health check endpoint
	r.GET("/health", healthCheck)

	// GitHub version checking endpoint
	r.GET("/api/v1/github/versions", checkGitHubVersions)

	// API routes
	api := r.Group("/api/v1")
	{
		// Host management
		api.GET("/hosts", getHosts)
		api.POST("/hosts", createHost)
		api.PUT("/hosts/:id", updateHost)
		api.DELETE("/hosts/:id", deleteHost)
		api.POST("/hosts/:id/test", testHostConnection)
		api.POST("/hosts/discover", discoverHosts)

		// Component management
		api.GET("/components", getComponents)
		api.POST("/components/install", installComponent)
		api.GET("/components/status/:id", getComponentStatus)
		api.POST("/components/start/:id", startComponent)
		api.POST("/components/stop/:id", stopComponent)
		api.GET("/installations", getInstallations)

		// MIB file management
		api.GET("/mibs", getMIBFiles)
		api.GET("/mibs/oids", getMIBOids)
		api.POST("/mibs/upload", uploadMIBFile)
		api.DELETE("/mibs/:id", deleteMIBFile)
		api.POST("/mibs/:id/validate", validateMIBFile)

		// MIB server paths
		api.GET("/mibs/server-paths", getMIBServerPaths)
		api.POST("/mibs/server-paths", createMIBServerPath)
		api.POST("/mibs/server-paths/:id/scan", scanMIBServerPath)

		// MIB archives
		api.GET("/mibs/archives", getMIBArchives)
		api.POST("/mibs/archives/upload", uploadMIBArchive)
		api.POST("/mibs/archives/:id/extract", extractMIBArchive)

		// Device monitoring
		api.GET("/devices", getDevices)
		api.POST("/devices", createDevice)
		api.PUT("/devices/:id", updateDevice)
		api.DELETE("/devices/:id", deleteDevice)
		api.POST("/devices/discover", discoverDevices)

		// Alert management
		api.GET("/alerts", getAlerts)
		api.POST("/alerts", createAlert)
		api.PUT("/alerts/:id", updateAlert)
		api.DELETE("/alerts/:id", deleteAlert)

		// Configuration management
		api.GET("/configs", getConfigs)
		api.POST("/configs", createConfig)
		api.POST("/configs/generate", generateConfig)
		api.POST("/configs/deploy", deployConfig)

		// SSH Key management
		api.GET("/ssh-keys", getSSHKeys)
		api.POST("/ssh-keys/generate", generateSSHKey)

		// Settings management
		api.GET("/settings", getSettings)
		api.PUT("/settings", updateSettings)

		// System management
		api.GET("/users", getUsers)
		api.POST("/users", createUser)
		api.GET("/audit-logs", getAuditLogs)
		api.GET("/system/health", getSystemHealth)
	}

	log.Println("SNMP Monitor Pro API server starting on :8080")
	r.Run(":8080")
}

// Health check endpoint
func healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "healthy",
		"message": "SNMP Monitor Pro API is running",
		"version": "2.1.0",
		"timestamp": "2025-01-15T10:00:00Z",
	})
}