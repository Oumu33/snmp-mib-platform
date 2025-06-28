package main

import (
	"fmt"
	"net"
	"time"

	"golang.org/x/crypto/ssh"
)

// SSHClient represents an SSH connection
type SSHClient struct {
	Host     string
	Port     int
	Username string
	Password string
	KeyPath  string
	client   *ssh.Client
}

// Connect establishes SSH connection
func (s *SSHClient) Connect() error {
	config := &ssh.ClientConfig{
		User:            s.Username,
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
		Timeout:         30 * time.Second,
	}

	// Configure authentication
	if s.Password != "" {
		config.Auth = []ssh.AuthMethod{
			ssh.Password(s.Password),
		}
	} else if s.KeyPath != "" {
		// TODO: Implement key-based authentication
		return fmt.Errorf("key-based authentication not implemented yet")
	}

	// Connect to SSH server
	addr := fmt.Sprintf("%s:%d", s.Host, s.Port)
	client, err := ssh.Dial("tcp", addr, config)
	if err != nil {
		return fmt.Errorf("failed to connect to SSH server: %v", err)
	}

	s.client = client
	return nil
}

// Execute runs a command on the remote host
func (s *SSHClient) Execute(command string) (string, error) {
	if s.client == nil {
		return "", fmt.Errorf("SSH client not connected")
	}

	session, err := s.client.NewSession()
	if err != nil {
		return "", fmt.Errorf("failed to create SSH session: %v", err)
	}
	defer session.Close()

	output, err := session.CombinedOutput(command)
	if err != nil {
		return string(output), fmt.Errorf("command execution failed: %v", err)
	}

	return string(output), nil
}

// UploadFile uploads a file to the remote host
func (s *SSHClient) UploadFile(localPath, remotePath string) error {
	// TODO: Implement SCP file upload
	return fmt.Errorf("file upload not implemented yet")
}

// DownloadFile downloads a file from the remote host
func (s *SSHClient) DownloadFile(remotePath, localPath string) error {
	// TODO: Implement SCP file download
	return fmt.Errorf("file download not implemented yet")
}

// Close closes the SSH connection
func (s *SSHClient) Close() error {
	if s.client != nil {
		return s.client.Close()
	}
	return nil
}

// TestConnection tests if the host is reachable
func TestConnection(host string, port int) error {
	timeout := 5 * time.Second
	conn, err := net.DialTimeout("tcp", fmt.Sprintf("%s:%d", host, port), timeout)
	if err != nil {
		return err
	}
	defer conn.Close()
	return nil
}

// ComponentInstaller handles component installation on remote hosts
type ComponentInstaller struct {
	sshClient *SSHClient
}

// NewComponentInstaller creates a new component installer
func NewComponentInstaller(host string, port int, username, password string) *ComponentInstaller {
	return &ComponentInstaller{
		sshClient: &SSHClient{
			Host:     host,
			Port:     port,
			Username: username,
			Password: password,
		},
	}
}

// InstallComponent installs a component on the remote host
func (ci *ComponentInstaller) InstallComponent(component Component) error {
	// Connect to SSH
	if err := ci.sshClient.Connect(); err != nil {
		return fmt.Errorf("SSH connection failed: %v", err)
	}
	defer ci.sshClient.Close()

	// Check system architecture
	arch, err := ci.sshClient.Execute("uname -m")
	if err != nil {
		return fmt.Errorf("failed to detect architecture: %v", err)
	}

	// Download component binary
	downloadCmd := fmt.Sprintf("wget -O /tmp/%s %s", component.ServiceName, component.DownloadURL)
	if _, err := ci.sshClient.Execute(downloadCmd); err != nil {
		return fmt.Errorf("failed to download component: %v", err)
	}

	// Make binary executable
	chmodCmd := fmt.Sprintf("chmod +x /tmp/%s", component.ServiceName)
	if _, err := ci.sshClient.Execute(chmodCmd); err != nil {
		return fmt.Errorf("failed to make binary executable: %v", err)
	}

	// Move to system directory
	moveCmd := fmt.Sprintf("sudo mv /tmp/%s /usr/local/bin/", component.ServiceName)
	if _, err := ci.sshClient.Execute(moveCmd); err != nil {
		return fmt.Errorf("failed to move binary: %v", err)
	}

	// Create systemd service
	serviceContent := fmt.Sprintf(`[Unit]
Description=%s
After=network.target

[Service]
Type=simple
User=nobody
ExecStart=/usr/local/bin/%s
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target`, component.Name, component.ServiceName)

	// Write service file
	serviceCmd := fmt.Sprintf("echo '%s' | sudo tee /etc/systemd/system/%s.service", serviceContent, component.ServiceName)
	if _, err := ci.sshClient.Execute(serviceCmd); err != nil {
		return fmt.Errorf("failed to create service file: %v", err)
	}

	// Reload systemd and start service
	reloadCmd := "sudo systemctl daemon-reload"
	if _, err := ci.sshClient.Execute(reloadCmd); err != nil {
		return fmt.Errorf("failed to reload systemd: %v", err)
	}

	enableCmd := fmt.Sprintf("sudo systemctl enable %s", component.ServiceName)
	if _, err := ci.sshClient.Execute(enableCmd); err != nil {
		return fmt.Errorf("failed to enable service: %v", err)
	}

	startCmd := fmt.Sprintf("sudo systemctl start %s", component.ServiceName)
	if _, err := ci.sshClient.Execute(startCmd); err != nil {
		return fmt.Errorf("failed to start service: %v", err)
	}

	return nil
}

// GetComponentStatus gets the status of a component
func (ci *ComponentInstaller) GetComponentStatus(serviceName string) (string, error) {
	if err := ci.sshClient.Connect(); err != nil {
		return "", fmt.Errorf("SSH connection failed: %v", err)
	}
	defer ci.sshClient.Close()

	statusCmd := fmt.Sprintf("sudo systemctl is-active %s", serviceName)
	status, err := ci.sshClient.Execute(statusCmd)
	if err != nil {
		return "inactive", nil
	}

	return status, nil
}

// StartComponent starts a component service
func (ci *ComponentInstaller) StartComponent(serviceName string) error {
	if err := ci.sshClient.Connect(); err != nil {
		return fmt.Errorf("SSH connection failed: %v", err)
	}
	defer ci.sshClient.Close()

	startCmd := fmt.Sprintf("sudo systemctl start %s", serviceName)
	_, err := ci.sshClient.Execute(startCmd)
	return err
}

// StopComponent stops a component service
func (ci *ComponentInstaller) StopComponent(serviceName string) error {
	if err := ci.sshClient.Connect(); err != nil {
		return fmt.Errorf("SSH connection failed: %v", err)
	}
	defer ci.sshClient.Close()

	stopCmd := fmt.Sprintf("sudo systemctl stop %s", serviceName)
	_, err := ci.sshClient.Execute(stopCmd)
	return err
}