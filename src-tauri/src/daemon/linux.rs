//! Linux service management using systemd.

use super::{ServiceError, ServiceManager, ServiceStatus};
use std::process::Command;

const SERVICE_NAME: &str = "parentshield";
const SERVICE_FILE: &str = "/etc/systemd/system/parentshield.service";

pub struct LinuxServiceManager {
    daemon_path: String,
}

impl LinuxServiceManager {
    pub fn new() -> Self {
        // The daemon binary is installed alongside the main binary
        let daemon_path = std::env::current_exe()
            .ok()
            .and_then(|exe| exe.parent().map(|p| p.to_path_buf()))
            .map(|dir| dir.join("parentshield-daemon").display().to_string())
            .unwrap_or_else(|| "/opt/parentshield/parentshield-daemon".to_string());

        Self { daemon_path }
    }

    /// Run a command with pkexec for privilege escalation
    fn run_privileged(&self, args: &[&str]) -> Result<(), ServiceError> {
        let output = Command::new("pkexec")
            .args(args)
            .output()
            .map_err(|e| ServiceError::ControlFailed(format!("Failed to run pkexec: {}", e)))?;

        if !output.status.success() {
            let stderr = String::from_utf8_lossy(&output.stderr);
            // Check if user cancelled the authentication dialog
            if output.status.code() == Some(126) {
                return Err(ServiceError::ControlFailed(
                    "Authentication cancelled by user".to_string(),
                ));
            }
            return Err(ServiceError::ControlFailed(stderr.to_string()));
        }

        Ok(())
    }
}

impl ServiceManager for LinuxServiceManager {
    fn install(&self) -> Result<(), ServiceError> {
        let service_content = format!(
            r#"[Unit]
Description=ParentShield Parental Control Daemon
After=network.target

[Service]
Type=simple
ExecStart={}
Restart=always
RestartSec=5
User=root

# Create runtime directory for socket
RuntimeDirectory=parentshield
RuntimeDirectoryMode=0755

# Prevent manual stop (parental control)
RefuseManualStop=true

[Install]
WantedBy=multi-user.target
"#,
            self.daemon_path
        );

        // Write service content to a temp file first, then use pkexec to copy it
        let temp_path = "/tmp/parentshield.service.tmp";
        std::fs::write(temp_path, &service_content)
            .map_err(|e| ServiceError::InstallFailed(format!("Failed to write temp file: {}", e)))?;

        // Use pkexec with cp to copy the service file as root
        let result = self.run_privileged(&["cp", temp_path, SERVICE_FILE]);

        // Clean up temp file
        let _ = std::fs::remove_file(temp_path);

        result.map_err(|e| ServiceError::InstallFailed(e.to_string()))?;

        // Reload systemd with pkexec
        self.run_privileged(&["systemctl", "daemon-reload"])
            .map_err(|e| ServiceError::InstallFailed(e.to_string()))?;

        // Enable service with pkexec
        self.run_privileged(&["systemctl", "enable", SERVICE_NAME])
            .map_err(|e| ServiceError::InstallFailed(e.to_string()))?;

        // Start the service
        self.run_privileged(&["systemctl", "start", SERVICE_NAME])
            .map_err(|e| ServiceError::InstallFailed(e.to_string()))?;

        tracing::info!("ParentShield service installed and started");
        Ok(())
    }

    fn uninstall(&self) -> Result<(), ServiceError> {
        // Stop service first (ignore errors)
        let _ = self.stop();

        // Disable service with pkexec
        let _ = self.run_privileged(&["systemctl", "disable", SERVICE_NAME]);

        // Remove service file with pkexec
        self.run_privileged(&["rm", "-f", SERVICE_FILE])
            .map_err(|e| ServiceError::RemoveFailed(e.to_string()))?;

        // Reload systemd
        let _ = self.run_privileged(&["systemctl", "daemon-reload"]);

        tracing::info!("ParentShield service uninstalled");
        Ok(())
    }

    fn start(&self) -> Result<(), ServiceError> {
        self.run_privileged(&["systemctl", "start", SERVICE_NAME])
    }

    fn stop(&self) -> Result<(), ServiceError> {
        self.run_privileged(&["systemctl", "stop", SERVICE_NAME])
    }

    fn status(&self) -> ServiceStatus {
        let output = Command::new("systemctl")
            .args(["is-active", SERVICE_NAME])
            .output();

        match output {
            Ok(out) => {
                let status = String::from_utf8_lossy(&out.stdout);
                if status.trim() == "active" {
                    ServiceStatus::Running
                } else if status.trim() == "inactive" {
                    ServiceStatus::Stopped
                } else {
                    ServiceStatus::Unknown
                }
            }
            Err(_) => ServiceStatus::NotInstalled,
        }
    }

    fn is_installed(&self) -> bool {
        std::path::Path::new(SERVICE_FILE).exists()
    }
}
