"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Shield,
  Download,
  Monitor,
  Apple,
  Terminal,
  ArrowLeft,
  Check,
  Loader2,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface DownloadFormat {
  id: string;
  label: string;
  fileName: string;
  fileSize: string | null;
  description: string;
  available: boolean;
}

interface PlatformData {
  available: boolean;
  formats: Record<string, DownloadFormat>;
}

interface AvailableDownloads {
  version: string;
  platforms: Record<string, PlatformData>;
}

// Detect user's platform and architecture
function detectPlatform(): { platform: string; format: string } {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() || "";

  // Detect OS
  if (userAgent.includes("win")) {
    // Detect Windows architecture
    if (userAgent.includes("arm64") || userAgent.includes("aarch64")) {
      return { platform: "windows", format: "exe-arm64" };
    } else if (userAgent.includes("wow64") || userAgent.includes("win64") || platform.includes("x64")) {
      return { platform: "windows", format: "exe-x64" };
    } else {
      return { platform: "windows", format: "exe-x86" };
    }
  } else if (userAgent.includes("mac")) {
    // Detect macOS - check for Apple Silicon
    // Unfortunately, JS can't reliably detect M1/M2 vs Intel, so default to Universal
    return { platform: "macos", format: "dmg-universal" };
  } else if (userAgent.includes("linux")) {
    // Default to AppImage for Linux as it's most portable
    return { platform: "linux", format: "appimage" };
  }

  return { platform: "linux", format: "appimage" };
}

const platformIcons: Record<string, React.ElementType> = {
  windows: Monitor,
  macos: Apple,
  linux: Terminal,
};

const platformNames: Record<string, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};

const platformRequirements: Record<string, string> = {
  windows: "Windows 10/11",
  macos: "macOS 12+ (Monterey)",
  linux: "Ubuntu 20.04+, Debian 11+, Fedora 36+",
};

export default function DownloadPage() {
  const { user, isLoading, authFetch, logout } = useCustomerAuth();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [availableDownloads, setAvailableDownloads] = useState<AvailableDownloads | null>(null);
  const [loadingDownloads, setLoadingDownloads] = useState(true);
  const [selectedFormats, setSelectedFormats] = useState<Record<string, string>>({});
  const [showFormatMenu, setShowFormatMenu] = useState<string | null>(null);
  const [detectedPlatform, setDetectedPlatform] = useState<{ platform: string; format: string } | null>(null);

  // Fetch available downloads on mount
  useEffect(() => {
    const fetchAvailable = async () => {
      try {
        const response = await fetch(`${API_URL}/device/downloads/available`);
        if (response.ok) {
          const data = await response.json();
          setAvailableDownloads(data);

          // Detect user's platform
          const detected = detectPlatform();
          setDetectedPlatform(detected);

          // Set initial selected formats based on detection and availability
          const initialFormats: Record<string, string> = {};
          for (const [platformId, platformData] of Object.entries(data.platforms as Record<string, PlatformData>)) {
            // Find first available format, or use detected if it's available
            const formats = Object.values(platformData.formats);
            const availableFormats = formats.filter(f => f.available);

            if (platformId === detected.platform && platformData.formats[detected.format]?.available) {
              initialFormats[platformId] = detected.format;
            } else if (availableFormats.length > 0) {
              initialFormats[platformId] = availableFormats[0].id;
            } else if (formats.length > 0) {
              initialFormats[platformId] = formats[0].id;
            }
          }
          setSelectedFormats(initialFormats);
        }
      } catch (err) {
        console.error("Failed to fetch available downloads:", err);
      } finally {
        setLoadingDownloads(false);
      }
    };

    fetchAvailable();
  }, []);

  const handleDownload = async (platformId: string, format: DownloadFormat) => {
    if (!format.available) {
      setError(`${format.label} is not available yet. Please choose a different format.`);
      return;
    }

    setError(null);
    const downloadKey = `${platformId}-${format.id}`;
    setDownloading(downloadKey);

    try {
      // Track download via API
      const response = await authFetch(`${API_URL}/device/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: platformId,
          source: "dashboard",
          app_version: availableDownloads?.version || "0.1.0",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to initiate download");
      }

      const data = await response.json();

      // Store the download token for later use
      localStorage.setItem("download_token", data.download_token);

      // Mark as downloaded
      setDownloaded((prev) => [...prev, downloadKey]);

      // Construct the direct download URL based on format
      const downloadUrl = `${API_URL}/downloads/${platformId}/${format.fileName}`;

      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = format.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(null);
    }
  };

  const handleAutoDownload = async () => {
    if (!detectedPlatform || !availableDownloads) return;

    const platformData = availableDownloads.platforms[detectedPlatform.platform];
    if (!platformData) return;

    // Find the best available format for this platform
    let format = platformData.formats[detectedPlatform.format];
    if (!format?.available) {
      // Try to find any available format
      const availableFormat = Object.values(platformData.formats).find(f => f.available);
      if (availableFormat) {
        format = availableFormat;
      } else {
        setError(`No downloads available for ${platformNames[detectedPlatform.platform]} yet.`);
        return;
      }
    }

    await handleDownload(detectedPlatform.platform, format);
  };

  if (isLoading || loadingDownloads) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  const platformOrder = ["windows", "macos", "linux"];

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Header */}
      <header className="border-b border-white/5 bg-surface-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">ParentShield</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Download ParentShield
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-6">
            Install ParentShield on your devices to start protecting your family.
          </p>

          {/* Auto-detect download button */}
          {detectedPlatform && availableDownloads?.platforms[detectedPlatform.platform]?.available && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                size="lg"
                onClick={handleAutoDownload}
                disabled={downloading !== null}
                className="bg-linear-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-lg px-8 py-6"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Download for {platformNames[detectedPlatform.platform]}
                  </>
                )}
              </Button>
              <p className="text-gray-500 text-sm mt-2">
                Detected: {platformNames[detectedPlatform.platform]} • v{availableDownloads?.version}
              </p>
            </motion.div>
          )}
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-gray-500 text-sm">Or choose your platform</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {platformOrder.map((platformId, index) => {
            const platformData = availableDownloads?.platforms[platformId];
            if (!platformData) return null;

            const Icon = platformIcons[platformId];
            const formats = Object.values(platformData.formats);
            const selectedFormatId = selectedFormats[platformId] || formats[0]?.id;
            const selectedFormat = platformData.formats[selectedFormatId] || formats[0];
            const downloadKey = `${platformId}-${selectedFormat?.id}`;
            const isDownloading = downloading === downloadKey;
            const isDownloaded = downloaded.includes(downloadKey);
            const hasAvailableFormats = formats.some(f => f.available);
            const isDetected = detectedPlatform?.platform === platformId;

            return (
              <motion.div
                key={platformId}
                className={`relative bg-surface-card rounded-2xl border p-6 text-center transition-all duration-300 flex flex-col h-full ${
                  hasAvailableFormats
                    ? "border-white/5 hover:border-primary-500/20"
                    : "border-white/5 opacity-60"
                } ${isDetected ? "ring-2 ring-primary-500/30" : ""}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={hasAvailableFormats ? { y: -4, boxShadow: "0 0 40px rgba(6, 182, 212, 0.1)" } : {}}
              >
                {/* Detected Badge */}
                {isDetected && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-primary-500/20 text-primary-400 text-xs font-medium px-2 py-1 rounded-full">
                      Detected
                    </span>
                  </div>
                )}

                {/* Not Available Badge */}
                {!hasAvailableFormats && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-amber-500/20 text-amber-400 text-xs font-medium px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>
                )}

                {/* Icon */}
                <motion.div
                  className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 ${
                    hasAvailableFormats ? "bg-surface-elevated" : "bg-surface-elevated/50"
                  }`}
                  whileHover={hasAvailableFormats ? { rotate: -5, scale: 1.05 } : {}}
                >
                  <Icon className={`w-7 h-7 ${hasAvailableFormats ? "text-gray-400" : "text-gray-600"}`} />
                </motion.div>

                {/* Platform Info */}
                <h3 className="text-lg font-bold text-white mb-1">{platformNames[platformId]}</h3>
                <p className="text-primary-400 text-xs font-medium mb-1">v{availableDownloads?.version}</p>
                <p className="text-gray-500 text-xs h-6 flex items-center justify-center">{platformRequirements[platformId]}</p>

                {/* Spacer */}
                <div className="grow" />

                {/* Format Selector */}
                <div className="relative mb-3 mt-3">
                  <button
                    onClick={() => setShowFormatMenu(showFormatMenu === platformId ? null : platformId)}
                    disabled={!hasAvailableFormats}
                    className={`w-full flex items-center justify-between bg-surface-elevated border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white transition-colors ${
                      hasAvailableFormats ? "hover:border-white/20" : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <span className="flex flex-col items-start">
                      <span className="font-medium text-sm">
                        {selectedFormat?.label}
                        {!selectedFormat?.available && " (N/A)"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {selectedFormat?.available ? selectedFormat?.fileSize : "Not available"}
                      </span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showFormatMenu === platformId ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showFormatMenu === platformId && (
                    <motion.div
                      className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated border border-white/10 rounded-lg overflow-hidden z-10 shadow-xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {formats.map((format) => (
                        <button
                          key={format.id}
                          onClick={() => {
                            setSelectedFormats((prev) => ({ ...prev, [platformId]: format.id }));
                            setShowFormatMenu(null);
                          }}
                          className={`w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors ${
                            selectedFormat?.id === format.id ? "bg-white/5" : ""
                          } ${!format.available ? "opacity-50" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white">
                                {format.label}
                                {!format.available && <span className="text-amber-400 ml-1">(N/A)</span>}
                              </p>
                              <p className="text-xs text-gray-500">{format.description}</p>
                            </div>
                            <span className="text-xs text-gray-400 ml-2 shrink-0">
                              {format.available ? format.fileSize : "—"}
                            </span>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Download Button */}
                <Button
                  onClick={() => selectedFormat && handleDownload(platformId, selectedFormat)}
                  disabled={isDownloading || !selectedFormat?.available}
                  className={`w-full ${
                    !selectedFormat?.available
                      ? "bg-gray-600 cursor-not-allowed hover:bg-gray-600"
                      : isDownloaded
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-linear-to-r from-primary-500 to-secondary-500"
                  }`}
                >
                  {!selectedFormat?.available ? (
                    <>
                      <Download className="w-4 h-4" />
                      Not Available
                    </>
                  ) : isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Preparing...
                    </>
                  ) : isDownloaded ? (
                    <>
                      <Check className="w-4 h-4" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Installation Instructions */}
        <motion.div
          className="bg-surface-card rounded-2xl border border-white/5 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-white mb-6">Installation Instructions</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0">
                <span className="text-primary-400 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Download the installer</h3>
                <p className="text-gray-400 text-sm">
                  Click the download button above or choose a specific format for your system.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0">
                <span className="text-primary-400 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Run the installer</h3>
                <div className="text-gray-400 text-sm space-y-2">
                  <div>
                    <strong className="text-white">Windows:</strong> Double-click the .exe file and follow the setup wizard.
                  </div>
                  <div>
                    <strong className="text-white">macOS:</strong> Open the .dmg, drag to Applications, right-click to open.
                  </div>
                  <div>
                    <strong className="text-white">Linux:</strong> AppImage: <code className="bg-surface-elevated px-1 py-0.5 rounded text-xs">chmod +x</code> then run. DEB/RPM: use your package manager.
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center shrink-0">
                <span className="text-primary-400 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">Connect your account</h3>
                <p className="text-gray-400 text-sm">
                  Open ParentShield, go to Settings, and sign in with {user?.email}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">You&apos;re protected!</h3>
                <p className="text-gray-400 text-sm">
                  Configure your blocking rules. The app works even when closed.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-500 text-sm">
            Need help?{" "}
            <a href="/support" className="text-primary-400 hover:underline inline-flex items-center gap-1">
              Contact Support <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
