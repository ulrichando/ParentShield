"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Monitor,
  Apple,
  Terminal,
  Check,
  Loader2,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

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
    // Default to .deb for Linux since Debian-based distros (Debian, Ubuntu, Mint, Pop!_OS)
    // are the most common desktop Linux distributions. Users on other distros can select AppImage.
    return { platform: "linux", format: "deb" };
  }

  return { platform: "linux", format: "deb" };
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
  const { user, isLoading, authFetch } = useCustomerAuth();
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
          app_version: availableDownloads?.version || "0.2.0",
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
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-neutral-900 dark:text-white animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const platformOrder = ["windows", "macos", "linux"];

  return (
    <DashboardLayout>
        {/* Editorial Page Header */}
        <motion.div
          className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            Downloads
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
            Download ParentShield
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-2xl">
            Install ParentShield on your devices to start protecting your family. Choose your platform below or let us detect it automatically.
          </p>
        </motion.div>

        {/* Auto-detect download button */}
        {detectedPlatform && availableDownloads?.platforms[detectedPlatform.platform]?.available && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              size="md"
              onClick={handleAutoDownload}
              disabled={downloading !== null}
              className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 px-6 py-2"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download for {platformNames[detectedPlatform.platform]}
                </>
              )}
            </Button>
            <p className="text-neutral-500 text-xs mt-2">
              Detected: {platformNames[detectedPlatform.platform]} · v{availableDownloads?.version}
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-3 mb-5 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          <span className="text-neutral-500 text-xs">Or choose your platform</span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
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
                className={`relative bg-white dark:bg-neutral-900 border p-4 text-center transition-all duration-300 flex flex-col h-full ${
                  hasAvailableFormats
                    ? "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                    : "border-neutral-200 dark:border-neutral-800 opacity-60"
                } ${isDetected ? "ring-1 ring-neutral-900 dark:ring-white" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={hasAvailableFormats ? { y: -2 } : {}}
              >
                {/* Detected Badge */}
                {isDetected && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-caption-2 font-medium px-1.5 py-0.5">
                      Detected
                    </span>
                  </div>
                )}

                {/* Not Available Badge */}
                {!hasAvailableFormats && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-caption-2 font-medium px-1.5 py-0.5">
                      Coming Soon
                    </span>
                  </div>
                )}

                {/* Icon */}
                <motion.div
                  className={`w-10 h-10 mx-auto flex items-center justify-center mb-2 ${
                    hasAvailableFormats ? "bg-[#FAFAFA] dark:bg-neutral-800" : "bg-[#FAFAFA]/50 dark:bg-neutral-800/50"
                  }`}
                  whileHover={hasAvailableFormats ? { rotate: -5, scale: 1.05 } : {}}
                >
                  <Icon className={`w-5 h-5 ${hasAvailableFormats ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-400 dark:text-neutral-600"}`} />
                </motion.div>

                {/* Platform Info */}
                <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-0.5">{platformNames[platformId]}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-caption-2 font-medium">v{availableDownloads?.version}</p>
                <p className="text-neutral-500 text-caption-2 h-4 flex items-center justify-center">{platformRequirements[platformId]}</p>

                {/* Spacer */}
                <div className="grow" />

                {/* Format Selector */}
                <div className="relative mb-2 mt-2">
                  <button
                    onClick={() => setShowFormatMenu(showFormatMenu === platformId ? null : platformId)}
                    disabled={!hasAvailableFormats}
                    className={`w-full flex items-center justify-between bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2 py-1.5 text-xs text-neutral-900 dark:text-white transition-colors ${
                      hasAvailableFormats ? "hover:border-neutral-400 dark:hover:border-neutral-600" : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <span className="flex flex-col items-start">
                      <span className="font-medium text-xs">
                        {selectedFormat?.label}
                        {!selectedFormat?.available && " (N/A)"}
                      </span>
                      <span className="text-caption-2 text-neutral-500">
                        {selectedFormat?.available ? selectedFormat?.fileSize : "Not available"}
                      </span>
                    </span>
                    <ChevronDown className={`w-3 h-3 text-neutral-500 dark:text-neutral-400 transition-transform ${showFormatMenu === platformId ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showFormatMenu === platformId && (
                    <motion.div
                      className="absolute top-full left-0 right-0 mt-1 bg-[#FAFAFA] dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden z-10 shadow-xl"
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
                          className={`w-full text-left px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
                            selectedFormat?.id === format.id ? "bg-neutral-100 dark:bg-neutral-700" : ""
                          } ${!format.available ? "opacity-50" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-neutral-900 dark:text-white">
                                {format.label}
                                {!format.available && <span className="text-amber-600 dark:text-amber-400 ml-1">(N/A)</span>}
                              </p>
                              <p className="text-caption-2 text-neutral-500">{format.description}</p>
                            </div>
                            <span className="text-caption-2 text-neutral-500 dark:text-neutral-400 ml-2 shrink-0">
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
                  size="sm"
                  onClick={() => selectedFormat && handleDownload(platformId, selectedFormat)}
                  disabled={isDownloading || !selectedFormat?.available}
                  className={`w-full text-xs ${
                    !selectedFormat?.available
                      ? "bg-neutral-300 dark:bg-neutral-600 cursor-not-allowed hover:bg-neutral-300 dark:hover:bg-neutral-600"
                      : isDownloaded
                      ? "bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white"
                      : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100"
                  }`}
                >
                  {!selectedFormat?.available ? (
                    <>
                      <Download className="w-3 h-3" />
                      Not Available
                    </>
                  ) : isDownloading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Preparing...
                    </>
                  ) : isDownloaded ? (
                    <>
                      <Check className="w-3 h-3" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="w-3 h-3" />
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
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-base font-bold text-neutral-900 dark:text-white mb-3">Installation Instructions</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                <span className="text-neutral-900 dark:text-white font-bold text-xs">1</span>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-white text-sm mb-0.5">Download the installer</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                  Click the download button above or choose a specific format for your system.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                <span className="text-neutral-900 dark:text-white font-bold text-xs">2</span>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-white text-sm mb-0.5">Run the installer</h3>
                <div className="text-neutral-500 dark:text-neutral-400 text-xs space-y-1">
                  <div><strong className="text-neutral-900 dark:text-white">Windows:</strong> Double-click the .exe and follow the wizard.</div>
                  <div><strong className="text-neutral-900 dark:text-white">macOS:</strong> Open the .dmg, drag to Applications.</div>
                  <div><strong className="text-neutral-900 dark:text-white">Linux:</strong> AppImage: <code className="bg-[#FAFAFA] dark:bg-neutral-800 px-1 text-caption-2">chmod +x</code> then run.</div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                <span className="text-neutral-900 dark:text-white font-bold text-xs">3</span>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-white text-sm mb-0.5">Connect your account</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                  Open ParentShield, go to Settings, and sign in with {user?.email}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-green-100 dark:bg-green-500/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-white text-sm mb-0.5">You&apos;re protected!</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                  Configure your blocking rules. The app works even when closed.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-neutral-500 text-xs">
            Need help?{" "}
            <a href="/support" className="text-neutral-600 dark:text-neutral-400 hover:underline inline-flex items-center gap-1">
              Contact Support <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </p>
        </motion.div>
    </DashboardLayout>
  );
}
