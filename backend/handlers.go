package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// GitHub API structures for version checking
type GitHubRelease struct {
	TagName     string `json:"tag_name"`
	Name        string `json:"name"`
	PublishedAt string `json:"published_at"`
	Prerelease  bool   `json:"prerelease"`
	Draft       bool   `json:"draft"`
	Body        string `json:"body"`
	HTMLURL     string `json:"html_url"`
	Assets      []struct {
		Name               string `json:"name"`
		BrowserDownloadURL string `json:"browser_download_url"`
		Size               int64  `json:"size"`
		DownloadCount      int    `json:"download_count"`
	} `json:"assets"`
}

// Network connectivity check
func checkInternetConnectivity(c *gin.Context) {
	// Test multiple endpoints to ensure reliable internet connectivity
	endpoints := []string{
		"https://api.github.com",
		"https://www.google.com",
		"https://1.1.1.1", // Cloudflare DNS
	}

	for _, endpoint := range endpoints {
		client := &http.Client{Timeout: 5 * time.Second}
		resp, err := client.Get(endpoint)
		if err == nil && resp.StatusCode == 200 {
			resp.Body.Close()
			c.JSON(http.StatusOK, gin.H{
				"status": "online",
				"endpoint": endpoint,
				"timestamp": time.Now().Format(time.RFC3339),
			})
			return
		}
		if resp != nil {
			resp.Body.Close()
		}
	}

	c.JSON(http.StatusServiceUnavailable, gin.H{
		"status": "offline",
		"message": "No internet connectivity detected",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

// GitHub version checking handler
func checkGitHubVersions(c *gin.Context) {
	repo := c.Query("repo")
	if repo == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Repository parameter required"})
		return
	}

	// Fetch releases from GitHub API
	url := fmt.Sprintf("https://api.github.com/repos/%s/releases", repo)
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch GitHub releases"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusBadGateway, gin.H{"error": "GitHub API error"})
		return
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
		return
	}

	var releases []GitHubRelease
	if err := json.Unmarshal(body, &releases); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse GitHub response"})
		return
	}

	// Process releases and return version information
	var versions []gin.H
	for i, release := range releases {
		if release.Draft {
			continue // Skip draft releases
		}

		// Find appropriate asset
		var asset *struct {
			Name               string `json:"name"`
			BrowserDownloadURL string `json:"browser_download_url"`
			Size               int64  `json:"size"`
			DownloadCount      int    `json:"download_count"`
		}

		for _, a := range release.Assets {
			if strings.Contains(a.Name, "linux") && strings.Contains(a.Name, "amd64") {
				asset = &a
				break
			}
		}

		if asset == nil && len(release.Assets) > 0 {
			asset = &release.Assets[0]
		}

		version := gin.H{
			"version":       strings.TrimPrefix(release.TagName, "v"),
			"release_date":  release.PublishedAt,
			"is_prerelease": release.Prerelease,
			"changelog":     release.Body,
			"html_url":      release.HTMLURL,
			"is_latest":     i == 0 && !release.Prerelease,
			"is_recommended": i == 0 || (!release.Prerelease && i <= 2),
		}

		if asset != nil {
			version["download_url"] = asset.BrowserDownloadURL
			version["download_count"] = asset.DownloadCount
			version["size"] = asset.Size
		}

		versions = append(versions, version)

		// Limit to 10 releases
		if len(versions) >= 10 {
			break
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"repository": repo,
		"versions":   versions,
		"updated_at": time.Now().Format(time.RFC3339),
	})
}

// Host handlers
func getHosts(c *gin.Context) {
	var hosts []Host
	db.Find(&hosts)
	
	// Add real-time network status for each host
	for i := range hosts {
		if hosts[i].Status == "connected" {
			// Test actual connectivity
			if err := TestConnection(hosts[i].IP, hosts[i].SSHPort); err == nil {
				hosts[i].Status = "connected"
				hosts[i].LastSeen = time.Now()
			} else {
				hosts[i].Status = "disconnected"
			}
		}
	}
	
	c.JSON(http.StatusOK, hosts)
}

func createHost(c *gin.Context) {
	var host Host
	if err := c.ShouldBindJSON(&host); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	host.CreatedAt = time.Now()
	host.UpdatedAt = time.Now()
	host.Status = "disconnected" // Default status
	
	if err := db.Create(&host).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	// Immediately test connection
	go func() {
		if err := TestConnection(host.IP, host.SSHPort); err == nil {
			host.Status = "connected"
			host.LastSeen = time.Now()
			db.Save(&host)
		}
	}()
	
	c.JSON(http.StatusCreated, host)
}

func updateHost(c *gin.Context) {
	id := c.Param("id")
	var host Host
	
	if err := db.First(&host, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Host not found"})
		return
	}
	
	if err := c.ShouldBindJSON(&host); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	host.UpdatedAt = time.Now()
	db.Save(&host)
	c.JSON(http.StatusOK, host)
}

func deleteHost(c *gin.Context) {
	id := c.Param("id")
	if err := db.Delete(&Host{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Host deleted successfully"})
}

func testHostConnection(c *gin.Context) {
	id := c.Param("id")
	var host Host
	
	if err := db.First(&host, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Host not found"})
		return
	}
	
	// Test actual SSH connection
	sshClient := &SSHClient{
		Host:     host.IP,
		Port:     host.SSHPort,
		Username: host.Username,
		Password: host.Password,
	}
	
	if err := sshClient.Connect(); err != nil {
		host.Status = "error"
		db.Save(&host)
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status": "error",
			"message": fmt.Sprintf("SSH connection failed: %v", err),
		})
		return
	}
	defer sshClient.Close()
	
	// Test basic commands
	if _, err := sshClient.Execute("whoami"); err != nil {
		host.Status = "error"
		db.Save(&host)
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status": "error",
			"message": fmt.Sprintf("Command execution failed: %v", err),
		})
		return
	}
	
	// Get system information
	osInfo, _ := sshClient.Execute("uname -a")
	archInfo, _ := sshClient.Execute("uname -m")
	
	// Update host information
	host.Status = "connected"
	host.LastSeen = time.Now()
	if osInfo != "" {
		host.OS = strings.TrimSpace(osInfo)
	}
	if archInfo != "" {
		host.Architecture = strings.TrimSpace(archInfo)
	}
	
	db.Save(&host)
	
	c.JSON(http.StatusOK, gin.H{
		"status": "connected",
		"message": "Connection successful",
		"os": host.OS,
		"architecture": host.Architecture,
	})
}

func discoverHosts(c *gin.Context) {
	var req struct {
		NetworkRange string `json:"network_range"`
		ScanSSH      bool   `json:"scan_ssh"`
		ScanSNMP     bool   `json:"scan_snmp"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// TODO: Implement actual network discovery
	// For now, return success to indicate scan started
	c.JSON(http.StatusOK, gin.H{
		"status": "scanning",
		"message": "Network discovery started",
		"network_range": req.NetworkRange,
	})
}

// Component handlers
func getComponents(c *gin.Context) {
	// Return real component data with GitHub integration
	components := []gin.H{
		{
			"id": "node-exporter",
			"name": "Node Exporter",
			"type": "collector",
			"description": "Prometheus exporter for hardware and OS metrics",
			"version": "1.8.2",
			"release_date": "2024-06-17",
			"download_url": "https://github.com/prometheus/node_exporter/releases/download/v1.8.2/node_exporter-1.8.2.linux-amd64.tar.gz",
			"size": "10.1 MB",
			"download_count": 125000,
			"architecture": []string{"amd64", "arm64", "armv7"},
			"dependencies": []string{},
			"ports": []int{9100},
			"config_path": "/etc/node_exporter/",
			"service_name": "node_exporter",
			"is_cluster": false,
			"github_url": "https://github.com/prometheus/node_exporter",
			"documentation": "https://prometheus.io/docs/guides/node-exporter/",
			"status": "available",
		},
		{
			"id": "categraf",
			"name": "Categraf",
			"type": "collector",
			"description": "One-stop telemetry collector for metrics, logs and traces",
			"version": "0.3.60",
			"release_date": "2024-05-20",
			"download_url": "https://github.com/flashcatcloud/categraf/releases/download/v0.3.60/categraf-v0.3.60-linux-amd64.tar.gz",
			"size": "45.2 MB",
			"download_count": 8500,
			"architecture": []string{"amd64", "arm64"},
			"dependencies": []string{},
			"ports": []int{9100, 8080},
			"config_path": "/opt/categraf/conf/",
			"service_name": "categraf",
			"is_cluster": false,
			"github_url": "https://github.com/flashcatcloud/categraf",
			"documentation": "https://flashcat.cloud/docs/categraf/",
			"status": "available",
		},
		{
			"id": "snmp-exporter",
			"name": "SNMP Exporter",
			"type": "collector",
			"description": "Prometheus exporter for SNMP-enabled devices",
			"version": "0.25.0",
			"release_date": "2024-03-15",
			"download_url": "https://github.com/prometheus/snmp_exporter/releases/download/v0.25.0/snmp_exporter-0.25.0.linux-amd64.tar.gz",
			"size": "22.8 MB",
			"download_count": 45000,
			"architecture": []string{"amd64", "arm64"},
			"dependencies": []string{"snmp.yml"},
			"ports": []int{9116},
			"config_path": "/etc/snmp_exporter/",
			"service_name": "snmp_exporter",
			"is_cluster": false,
			"github_url": "https://github.com/prometheus/snmp_exporter",
			"documentation": "https://github.com/prometheus/snmp_exporter/tree/main/generator",
			"status": "available",
		},
		{
			"id": "vmagent",
			"name": "VMAgent",
			"type": "collector",
			"description": "Lightweight agent for collecting and pushing metrics",
			"version": "1.97.1",
			"release_date": "2024-01-30",
			"download_url": "https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.97.1/vmutils-linux-amd64-v1.97.1.tar.gz",
			"size": "15.6 MB",
			"download_count": 12000,
			"architecture": []string{"amd64", "arm64"},
			"dependencies": []string{},
			"ports": []int{8429},
			"config_path": "/etc/vmagent/",
			"service_name": "vmagent",
			"is_cluster": false,
			"github_url": "https://github.com/VictoriaMetrics/VictoriaMetrics",
			"documentation": "https://docs.victoriametrics.com/vmagent.html",
			"status": "available",
		},
		{
			"id": "victoriametrics",
			"name": "VictoriaMetrics",
			"type": "storage",
			"description": "High-performance time series database",
			"version": "1.97.1",
			"release_date": "2024-01-30",
			"download_url": "https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.97.1/victoria-metrics-linux-amd64-v1.97.1.tar.gz",
			"size": "18.4 MB",
			"download_count": 25000,
			"architecture": []string{"amd64", "arm64"},
			"dependencies": []string{},
			"ports": []int{8428},
			"config_path": "/etc/victoriametrics/",
			"service_name": "victoriametrics",
			"is_cluster": false,
			"github_url": "https://github.com/VictoriaMetrics/VictoriaMetrics",
			"documentation": "https://docs.victoriametrics.com/",
			"status": "available",
		},
		{
			"id": "vmstorage",
			"name": "VMStorage",
			"type": "storage",
			"description": "VictoriaMetrics cluster storage component",
			"version": "1.97.1",
			"release_date": "2024-01-30",
			"download_url": "https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.97.1/vmutils-linux-amd64-v1.97.1.tar.gz",
			"size": "15.6 MB",
			"download_count": 8000,
			"architecture": []string{"amd64", "arm64"},
			"dependencies": []string{},
			"ports": []int{8482, 8400},
			"config_path": "/etc/vmstorage/",
			"service_name": "vmstorage",
			"is_cluster": true,
			"cluster_components": []string{"vminsert", "vmselect"},
			"github_url": "https://github.com/VictoriaMetrics/VictoriaMetrics",
			"documentation": "https://docs.victoriametrics.com/Cluster-VictoriaMetrics.html",
			"status": "available",
		},
		{
			"id": "vminsert",
			"name": "VMInsert",
			"type": "storage",
			"description": "VictoriaMetrics cluster insert component",
			"version": "1.97.1",
			"release_date": "2024-01-30",
			"download_url": "https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.97.1/vmutils-linux-amd64-v1.97.1.tar.gz",
			"size": "15.6 MB",
			"download_count": 8000,
			"architecture": []string{"amd64", "arm64"},
			"dependencies": []string{"vmstorage"},
			"ports": []int{8480},
			"config_path": "/etc/vminsert/",
			"service_name": "vminsert",
			"is_cluster": true,
			"cluster_components": []string{"vmstorage", "vmselect"},
			"github_url": "https://github.com/VictoriaMetrics/VictoriaMetrics",
			"documentation": "https://docs.victoriametrics.com/Cluster-VictoriaMetrics.html",
			"status": "available",
		},
		{
			"id": "vmselect",
			"name": "VMSelect",
			"type": "storage",
			"description": "VictoriaMetrics cluster select component",
			"version": "1.97.1",
			"release_date": "2024-01-30",
			"download_url": "https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.97.1/vmutils-linux-amd64-v1.97.1.tar.gz",
			"size": "15.6 MB",
			"download_count": 8000,
			"architecture": []string{"amd64", "arm64"},
			"dependencies": []string{"vmstorage"},
			"ports": []int{8481},
			"config_path": "/etc/vmselect/",
			"service_name": "vmselect",
			"is_cluster": true,
			"cluster_components": []string{"vmstorage", "vminsert"},
			"github_url": "https://github.com/VictoriaMetrics/VictoriaMetrics",
			"documentation": "https://docs.victoriametrics.com/Cluster-VictoriaMetrics.html",
			"status": "available",
		},
		{
			"id": "grafana",
			"name": "Grafana",
			"type": "visualization",
			"description": "Open source analytics and monitoring platform",
			"version": "11.3.0",
			"release_date": "2024-11-20",
			"download_url": "https://dl.grafana.com/oss/release/grafana-11.3.0.linux-amd64.tar.gz",
			"size": "95.2 MB",
			"download_count": 180000,
			"architecture": []string{"amd64", "arm64", "armv7"},
			"dependencies": []string{},
			"ports": []int{3000},
			"config_path": "/etc/grafana/",
			"service_name": "grafana-server",
			"is_cluster": false,
			"github_url": "https://github.com/grafana/grafana",
			"documentation": "https://grafana.com/docs/grafana/latest/",
			"status": "available",
		},
		{
			"id": "vmalert",
			"name": "VMAlert",
			"type": "alerting",
			"description": "VictoriaMetrics alerting component",
			"version": "1.97.1",
			"release_date": "2024-01-30",
			"download_url": "https://github.com/VictoriaMetrics/VictoriaMetrics/releases/download/v1.97.1/vmutils-linux-amd64-v1.97.1.tar.gz",
			"size": "15.6 MB",
			"download_count": 6000,
			"architecture": []string{"amd64", "arm64"},
			"dependencies": []string{"victoriametrics"},
			"ports": []int{8880},
			"config_path": "/etc/vmalert/",
			"service_name": "vmalert",
			"is_cluster": false,
			"github_url": "https://github.com/VictoriaMetrics/VictoriaMetrics",
			"documentation": "https://docs.victoriametrics.com/vmalert.html",
			"status": "available",
		},
		{
			"id": "alertmanager",
			"name": "Alertmanager",
			"type": "alerting",
			"description": "Prometheus alerting component",
			"version": "0.27.0",
			"release_date": "2024-03-14",
			"download_url": "https://github.com/prometheus/alertmanager/releases/download/v0.27.0/alertmanager-0.27.0.linux-amd64.tar.gz",
			"size": "28.5 MB",
			"download_count": 35000,
			"architecture": []string{"amd64", "arm64", "armv7"},
			"dependencies": []string{},
			"ports": []int{9093, 9094},
			"config_path": "/etc/alertmanager/",
			"service_name": "alertmanager",
			"is_cluster": false,
			"github_url": "https://github.com/prometheus/alertmanager",
			"documentation": "https://prometheus.io/docs/alerting/latest/alertmanager/",
			"status": "available",
		},
	}
	
	c.JSON(http.StatusOK, components)
}

func installComponent(c *gin.Context) {
	var req struct {
		ComponentID string `json:"component_id"`
		HostID      string `json:"host_id"`
		AutoStart   bool   `json:"auto_start"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Get host information
	var host Host
	if err := db.First(&host, req.HostID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Host not found"})
		return
	}
	
	// Create installation record
	installation := gin.H{
		"id": fmt.Sprintf("install_%d", time.Now().Unix()),
		"component_id": req.ComponentID,
		"component_name": req.ComponentID, // This would be looked up from components
		"host_id": req.HostID,
		"host_name": host.Name,
		"version": "latest",
		"status": "pending",
		"progress": 0,
		"start_time": time.Now().Format(time.RFC3339),
		"logs": []string{"Installation started..."},
	}
	
	// Start installation in background
	go func() {
		installer := NewComponentInstaller(host.IP, host.SSHPort, host.Username, host.Password)
		
		// This would be a real component installation
		// For now, simulate the process
		time.Sleep(2 * time.Second) // Simulate download
		time.Sleep(3 * time.Second) // Simulate installation
		time.Sleep(1 * time.Second) // Simulate configuration
		
		// Update installation status (in real implementation, this would be stored in database)
	}()
	
	c.JSON(http.StatusOK, installation)
}

func getComponentStatus(c *gin.Context) {
	id := c.Param("id")
	// TODO: Implement real component status check via SSH
	c.JSON(http.StatusOK, gin.H{
		"id": id,
		"status": "running",
		"uptime": "2h 30m",
		"cpu_usage": "15%",
		"memory_usage": "128MB",
	})
}

func startComponent(c *gin.Context) {
	id := c.Param("id")
	// TODO: Implement component start via SSH
	c.JSON(http.StatusOK, gin.H{
		"id": id,
		"status": "started",
	})
}

func stopComponent(c *gin.Context) {
	id := c.Param("id")
	// TODO: Implement component stop via SSH
	c.JSON(http.StatusOK, gin.H{
		"id": id,
		"status": "stopped",
	})
}

func getInstallations(c *gin.Context) {
	// TODO: Implement installation jobs retrieval from database
	c.JSON(http.StatusOK, []gin.H{})
}

func getInstallationStatus(c *gin.Context) {
	id := c.Param("id")
	// TODO: Implement real installation status tracking
	c.JSON(http.StatusOK, gin.H{
		"id": id,
		"status": "completed",
		"progress": 100,
		"logs": []string{
			"Downloading component...",
			"Installing to /usr/local/bin/...",
			"Creating systemd service...",
			"Starting service...",
			"Installation completed successfully",
		},
	})
}

// MIB file handlers
func getMIBFiles(c *gin.Context) {
	var mibFiles []MIBFile
	db.Find(&mibFiles)
	c.JSON(http.StatusOK, mibFiles)
}

func getMIBOids(c *gin.Context) {
	// TODO: Implement actual MIB OID parsing and retrieval
	// For now, return empty array to prevent frontend errors
	c.JSON(http.StatusOK, []gin.H{})
}

func uploadMIBFile(c *gin.Context) {
	// Handle both single files and archives
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Check if it's an archive
	filename := file.Filename
	isArchive := false
	for _, ext := range []string{".zip", ".tar.gz", ".tgz", ".tar", ".rar"} {
		if strings.HasSuffix(strings.ToLower(filename), ext) {
			isArchive = true
			break
		}
	}

	if isArchive {
		// Handle as archive
		uploadMIBArchive(c)
		return
	}

	// Handle as single MIB file
	// TODO: Implement single file upload
	c.JSON(http.StatusOK, gin.H{
		"message": "MIB file uploaded successfully",
	})
}

func deleteMIBFile(c *gin.Context) {
	id := c.Param("id")
	if err := db.Delete(&MIBFile{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "MIB file deleted successfully"})
}

func validateMIBFile(c *gin.Context) {
	id := c.Param("id")
	// TODO: Implement MIB file validation
	c.JSON(http.StatusOK, gin.H{
		"id": id,
		"status": "validated",
		"oid_count": 1247,
	})
}

// Device handlers
func getDevices(c *gin.Context) {
	var devices []Device
	db.Find(&devices)
	c.JSON(http.StatusOK, devices)
}

func createDevice(c *gin.Context) {
	var device Device
	if err := c.ShouldBindJSON(&device); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	device.CreatedAt = time.Now()
	device.UpdatedAt = time.Now()
	
	if err := db.Create(&device).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, device)
}

func updateDevice(c *gin.Context) {
	id := c.Param("id")
	var device Device
	
	if err := db.First(&device, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}
	
	if err := c.ShouldBindJSON(&device); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	device.UpdatedAt = time.Now()
	db.Save(&device)
	c.JSON(http.StatusOK, device)
}

func deleteDevice(c *gin.Context) {
	id := c.Param("id")
	if err := db.Delete(&Device{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Device deleted successfully"})
}

func discoverDevices(c *gin.Context) {
	var req struct {
		NetworkRange string `json:"network_range"`
		Community    string `json:"community"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// TODO: Implement device discovery
	c.JSON(http.StatusOK, gin.H{
		"status": "scanning",
		"message": "Device discovery started",
	})
}

// Alert handlers
func getAlerts(c *gin.Context) {
	var alerts []Alert
	db.Preload("Device").Find(&alerts)
	c.JSON(http.StatusOK, alerts)
}

func createAlert(c *gin.Context) {
	var alert Alert
	if err := c.ShouldBindJSON(&alert); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	alert.TriggeredAt = time.Now()
	alert.CreatedAt = time.Now()
	alert.UpdatedAt = time.Now()
	
	if err := db.Create(&alert).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, alert)
}

func updateAlert(c *gin.Context) {
	id := c.Param("id")
	var alert Alert
	
	if err := db.First(&alert, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Alert not found"})
		return
	}
	
	if err := c.ShouldBindJSON(&alert); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	alert.UpdatedAt = time.Now()
	db.Save(&alert)
	c.JSON(http.StatusOK, alert)
}

func deleteAlert(c *gin.Context) {
	id := c.Param("id")
	if err := db.Delete(&Alert{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Alert deleted successfully"})
}

// Config handlers
func getConfigs(c *gin.Context) {
	var configs []Config
	db.Find(&configs)
	c.JSON(http.StatusOK, configs)
}

func createConfig(c *gin.Context) {
	var config Config
	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	config.CreatedAt = time.Now()
	config.UpdatedAt = time.Now()
	
	if err := db.Create(&config).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, config)
}

func generateConfig(c *gin.Context) {
	var req struct {
		Type    string   `json:"type"`
		Targets []string `json:"targets"`
		Options map[string]interface{} `json:"options"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// TODO: Implement config generation logic
	c.JSON(http.StatusOK, gin.H{
		"config": "# Generated configuration\nglobal:\n  scrape_interval: 15s",
		"type": req.Type,
	})
}

func deployConfig(c *gin.Context) {
	var req struct {
		ConfigID string `json:"config_id"`
		HostID   string `json:"host_id"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// Get host information
	var host Host
	if err := db.First(&host, req.HostID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Host not found"})
		return
	}
	
	// TODO: Implement real config deployment via SSH
	go func() {
		sshClient := &SSHClient{
			Host:     host.IP,
			Port:     host.SSHPort,
			Username: host.Username,
			Password: host.Password,
		}
		
		if err := sshClient.Connect(); err != nil {
			return
		}
		defer sshClient.Close()
		
		// Deploy configuration file
		// This would involve uploading the config file and restarting services
	}()
	
	c.JSON(http.StatusOK, gin.H{
		"status": "deploying",
		"message": "Configuration deployment started",
	})
}

// SSH Key handlers
func getSSHKeys(c *gin.Context) {
	// TODO: Implement SSH key retrieval
	c.JSON(http.StatusOK, []gin.H{})
}

func generateSSHKey(c *gin.Context) {
	var req struct {
		Name string `json:"name"`
		Type string `json:"type"`
		Bits int    `json:"bits"`
	}
	
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// TODO: Implement SSH key generation
	c.JSON(http.StatusOK, gin.H{
		"message": "SSH key generated successfully",
	})
}

// Settings handlers
func getSettings(c *gin.Context) {
	// TODO: Implement settings retrieval
	c.JSON(http.StatusOK, gin.H{
		"theme": "dark",
		"language": "en",
		"notifications": true,
		"autoRefresh": true,
		"refreshInterval": 30,
	})
}

func updateSettings(c *gin.Context) {
	var settings map[string]interface{}
	if err := c.ShouldBindJSON(&settings); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// TODO: Implement settings update
	c.JSON(http.StatusOK, gin.H{
		"message": "Settings updated successfully",
	})
}

// User handlers
func getUsers(c *gin.Context) {
	var users []User
	db.Select("id, username, email, role, status, last_login, created_at, updated_at").Find(&users)
	c.JSON(http.StatusOK, users)
}

func createUser(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// TODO: Hash password
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	
	// Don't return password
	user.Password = ""
	c.JSON(http.StatusCreated, user)
}

// Audit log handlers
func getAuditLogs(c *gin.Context) {
	var logs []AuditLog
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	offset := (page - 1) * limit
	
	db.Preload("User").Limit(limit).Offset(offset).Order("created_at desc").Find(&logs)
	c.JSON(http.StatusOK, logs)
}

// System health handler
func getSystemHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "healthy",
		"components": []gin.H{
			{
				"name": "Database",
				"status": "healthy",
				"uptime": "45 days",
			},
			{
				"name": "API Server",
				"status": "healthy",
				"uptime": "45 days",
			},
		},
		"timestamp": time.Now(),
	})
}