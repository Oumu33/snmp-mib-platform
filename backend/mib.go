package main

import (
	"archive/tar"
	"archive/zip"
	"compress/gzip"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

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

// MIBManager handles MIB file operations
type MIBManager struct {
	uploadDir   string
	extractDir  string
	sshClients  map[string]*SSHClient
}

// NewMIBManager creates a new MIB manager
func NewMIBManager() *MIBManager {
	return &MIBManager{
		uploadDir:  "./uploads/mibs",
		extractDir: "./extracted/mibs",
		sshClients: make(map[string]*SSHClient),
	}
}

// ScanServerPath scans a server path for MIB files
func (mm *MIBManager) ScanServerPath(pathConfig MIBServerPath) error {
	// Create SSH client
	sshClient := &SSHClient{
		Host:     pathConfig.Host,
		Port:     pathConfig.SSHPort,
		Username: pathConfig.Username,
		Password: pathConfig.Password,
	}

	// Connect to server
	if err := sshClient.Connect(); err != nil {
		return fmt.Errorf("failed to connect to server: %v", err)
	}
	defer sshClient.Close()

	// List MIB files in the directory
	listCmd := fmt.Sprintf("find %s -name '*.mib' -o -name '*.txt' | head -1000", pathConfig.Path)
	output, err := sshClient.Execute(listCmd)
	if err != nil {
		return fmt.Errorf("failed to list files: %v", err)
	}

	// Parse file list
	files := strings.Split(strings.TrimSpace(output), "\n")
	fileCount := 0

	for _, file := range files {
		if strings.TrimSpace(file) == "" {
			continue
		}

		// Get file info
		statCmd := fmt.Sprintf("stat -c '%%s %%Y' %s", file)
		statOutput, err := sshClient.Execute(statCmd)
		if err != nil {
			continue
		}

		// Parse file info and create MIB record
		// This would create MIBFile records with source='server'
		fileCount++
	}

	// Update path configuration
	pathConfig.FileCount = fileCount
	pathConfig.LastScan = time.Now()
	pathConfig.Status = "connected"

	return nil
}

// ExtractArchive extracts a MIB archive
func (mm *MIBManager) ExtractArchive(archiveID uint) error {
	var archive MIBArchive
	if err := db.First(&archive, archiveID).Error; err != nil {
		return fmt.Errorf("archive not found: %v", err)
	}

	// Update status to extracting
	archive.Status = "extracting"
	archive.Progress = 0
	db.Save(&archive)

	// Create extraction directory
	extractPath := filepath.Join(mm.extractDir, fmt.Sprintf("archive_%d", archive.ID))
	if err := os.MkdirAll(extractPath, 0755); err != nil {
		return fmt.Errorf("failed to create extract directory: %v", err)
	}

	// Determine archive type and extract
	var err error
	switch {
	case strings.HasSuffix(archive.Name, ".zip"):
		err = mm.extractZip(archive.FilePath, extractPath, &archive)
	case strings.HasSuffix(archive.Name, ".tar.gz") || strings.HasSuffix(archive.Name, ".tgz"):
		err = mm.extractTarGz(archive.FilePath, extractPath, &archive)
	case strings.HasSuffix(archive.Name, ".tar"):
		err = mm.extractTar(archive.FilePath, extractPath, &archive)
	default:
		err = fmt.Errorf("unsupported archive format")
	}

	if err != nil {
		archive.Status = "error"
		archive.ErrorMessage = err.Error()
		db.Save(&archive)
		return err
	}

	// Update archive status
	now := time.Now()
	archive.Status = "extracted"
	archive.Progress = 100
	archive.ExtractedAt = &now
	db.Save(&archive)

	// Scan extracted files and create MIB records
	return mm.scanExtractedFiles(extractPath, archive.ID)
}

// extractZip extracts a ZIP archive
func (mm *MIBManager) extractZip(archivePath, extractPath string, archive *MIBArchive) error {
	reader, err := zip.OpenReader(archivePath)
	if err != nil {
		return err
	}
	defer reader.Close()

	archive.TotalFiles = len(reader.File)
	db.Save(archive)

	for i, file := range reader.File {
		// Update progress
		archive.Progress = (i * 100) / len(reader.File)
		archive.ExtractedFiles = i
		db.Save(archive)

		// Skip directories
		if file.FileInfo().IsDir() {
			continue
		}

		// Only extract MIB files
		if !mm.isMIBFile(file.Name) {
			continue
		}

		// Extract file
		if err := mm.extractZipFile(file, extractPath); err != nil {
			return err
		}
	}

	return nil
}

// extractTarGz extracts a tar.gz archive
func (mm *MIBManager) extractTarGz(archivePath, extractPath string, archive *MIBArchive) error {
	file, err := os.Open(archivePath)
	if err != nil {
		return err
	}
	defer file.Close()

	gzReader, err := gzip.NewReader(file)
	if err != nil {
		return err
	}
	defer gzReader.Close()

	return mm.extractTarReader(tar.NewReader(gzReader), extractPath, archive)
}

// extractTar extracts a tar archive
func (mm *MIBManager) extractTar(archivePath, extractPath string, archive *MIBArchive) error {
	file, err := os.Open(archivePath)
	if err != nil {
		return err
	}
	defer file.Close()

	return mm.extractTarReader(tar.NewReader(file), extractPath, archive)
}

// extractTarReader extracts files from a tar reader
func (mm *MIBManager) extractTarReader(tarReader *tar.Reader, extractPath string, archive *MIBArchive) error {
	extractedCount := 0

	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			return err
		}

		// Skip directories
		if header.Typeflag == tar.TypeDir {
			continue
		}

		// Only extract MIB files
		if !mm.isMIBFile(header.Name) {
			continue
		}

		// Extract file
		if err := mm.extractTarFile(tarReader, header, extractPath); err != nil {
			return err
		}

		extractedCount++
		archive.ExtractedFiles = extractedCount
		db.Save(archive)
	}

	return nil
}

// extractZipFile extracts a single file from ZIP
func (mm *MIBManager) extractZipFile(file *zip.File, extractPath string) error {
	reader, err := file.Open()
	if err != nil {
		return err
	}
	defer reader.Close()

	// Create file path
	filePath := filepath.Join(extractPath, file.Name)
	if err := os.MkdirAll(filepath.Dir(filePath), 0755); err != nil {
		return err
	}

	// Create file
	outFile, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer outFile.Close()

	// Copy content
	_, err = io.Copy(outFile, reader)
	return err
}

// extractTarFile extracts a single file from tar
func (mm *MIBManager) extractTarFile(tarReader *tar.Reader, header *tar.Header, extractPath string) error {
	// Create file path
	filePath := filepath.Join(extractPath, header.Name)
	if err := os.MkdirAll(filepath.Dir(filePath), 0755); err != nil {
		return err
	}

	// Create file
	outFile, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer outFile.Close()

	// Copy content
	_, err = io.Copy(outFile, tarReader)
	return err
}

// isMIBFile checks if a file is a MIB file
func (mm *MIBManager) isMIBFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	return ext == ".mib" || ext == ".txt" || 
		   strings.Contains(strings.ToLower(filename), "mib")
}

// scanExtractedFiles scans extracted files and creates MIB records
func (mm *MIBManager) scanExtractedFiles(extractPath string, archiveID uint) error {
	return filepath.Walk(extractPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Skip directories
		if info.IsDir() {
			return nil
		}

		// Only process MIB files
		if !mm.isMIBFile(path) {
			return nil
		}

		// Create MIB file record
		mibFile := MIBFile{
			Name:        strings.TrimSuffix(info.Name(), filepath.Ext(info.Name())),
			Filename:    info.Name(),
			Size:        info.Size(),
			FilePath:    path,
			Status:      "pending",
			UploadedAt:  time.Now(),
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		}

		// Parse MIB file to extract metadata
		if err := mm.parseMIBFile(&mibFile); err != nil {
			mibFile.Status = "error"
		} else {
			mibFile.Status = "validated"
		}

		// Save to database
		return db.Create(&mibFile).Error
	})
}

// parseMIBFile parses a MIB file to extract metadata
func (mm *MIBManager) parseMIBFile(mibFile *MIBFile) error {
	// Read file content
	content, err := os.ReadFile(mibFile.FilePath)
	if err != nil {
		return err
	}

	// Basic MIB parsing (simplified)
	contentStr := string(content)
	
	// Extract vendor from file content
	if strings.Contains(strings.ToUpper(contentStr), "CISCO") {
		mibFile.Vendor = "Cisco"
		mibFile.Category = "Network Equipment"
	} else if strings.Contains(strings.ToUpper(contentStr), "HUAWEI") {
		mibFile.Vendor = "Huawei"
		mibFile.Category = "Network Equipment"
	} else if strings.Contains(strings.ToUpper(contentStr), "HP") {
		mibFile.Vendor = "HP"
		mibFile.Category = "Printers"
	}

	// Count OIDs (simplified)
	mibFile.OIDCount = strings.Count(contentStr, "OBJECT-TYPE")

	// Extract description (first comment block)
	lines := strings.Split(contentStr, "\n")
	for _, line := range lines {
		if strings.HasPrefix(strings.TrimSpace(line), "--") {
			desc := strings.TrimPrefix(strings.TrimSpace(line), "--")
			if len(desc) > 10 && mibFile.Description == "" {
				mibFile.Description = strings.TrimSpace(desc)
				break
			}
		}
	}

	return nil
}

// API Handlers for MIB management

func getMIBServerPaths(c *gin.Context) {
	var paths []MIBServerPath
	db.Find(&paths)
	c.JSON(200, paths)
}

func createMIBServerPath(c *gin.Context) {
	var path MIBServerPath
	if err := c.ShouldBindJSON(&path); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	path.CreatedAt = time.Now()
	path.UpdatedAt = time.Now()

	if err := db.Create(&path).Error; err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, path)
}

func scanMIBServerPath(c *gin.Context) {
	id := c.Param("id")
	var path MIBServerPath

	if err := db.First(&path, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Server path not found"})
		return
	}

	// Start scanning in background
	go func() {
		mibManager := NewMIBManager()
		if err := mibManager.ScanServerPath(path); err != nil {
			path.Status = "error"
		} else {
			path.Status = "connected"
		}
		db.Save(&path)
	}()

	c.JSON(200, gin.H{
		"status": "scanning",
		"message": "Server path scan started",
	})
}

func getMIBArchives(c *gin.Context) {
	var archives []MIBArchive
	db.Find(&archives)
	c.JSON(200, archives)
}

func uploadMIBArchive(c *gin.Context) {
	// Handle file upload
	file, err := c.FormFile("archive")
	if err != nil {
		c.JSON(400, gin.H{"error": "No file uploaded"})
		return
	}

	// Create upload directory
	uploadDir := "./uploads/archives"
	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		c.JSON(500, gin.H{"error": "Failed to create upload directory"})
		return
	}

	// Save uploaded file
	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
	filepath := filepath.Join(uploadDir, filename)
	
	if err := c.SaveUploadedFile(file, filepath); err != nil {
		c.JSON(500, gin.H{"error": "Failed to save file"})
		return
	}

	// Create archive record
	archive := MIBArchive{
		Name:         filename,
		OriginalName: file.Filename,
		Size:         file.Size,
		FilePath:     filepath,
		Status:       "uploaded",
		UploadedAt:   time.Now(),
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	if err := db.Create(&archive).Error; err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(201, archive)
}

func extractMIBArchive(c *gin.Context) {
	id := c.Param("id")
	var archive MIBArchive

	if err := db.First(&archive, id).Error; err != nil {
		c.JSON(404, gin.H{"error": "Archive not found"})
		return
	}

	// Start extraction in background
	go func() {
		mibManager := NewMIBManager()
		if err := mibManager.ExtractArchive(archive.ID); err != nil {
			archive.Status = "error"
			archive.ErrorMessage = err.Error()
			db.Save(&archive)
		}
	}()

	c.JSON(200, gin.H{
		"status": "extracting",
		"message": "Archive extraction started",
	})
}