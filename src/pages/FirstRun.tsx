import { useState, useEffect } from "react";
import { Shield, Eye, EyeOff, Check, Copy, Server, AlertTriangle, X } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/stores/auth-store";
import { useDaemonStore } from "@/stores/daemon-store";

export function FirstRun() {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [daemonError, setDaemonError] = useState("");

  const { setupPassword, completeSetup, masterPassword, isLoading } = useAuthStore();
  const { status: daemonStatus, fetchStatus: fetchDaemonStatus, installDaemon, isLoading: daemonLoading } = useDaemonStore();

  useEffect(() => {
    if (step === 3) {
      fetchDaemonStatus();
    }
  }, [step]);

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = getPasswordStrength(password);
  const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"][strength] || "Very Weak";
  const strengthColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"][strength] || "bg-gray-300";

  const handleSetupPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const result = await setupPassword(password);
    if (result.success) {
      setStep(2);
    } else {
      setError(result.error || "Failed to set up password");
    }
  };

  const handleCopyMasterPassword = () => {
    if (masterPassword) {
      navigator.clipboard.writeText(masterPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInstallDaemon = async () => {
    setDaemonError("");
    const success = await installDaemon();
    if (!success) {
      setDaemonError("Failed to install daemon. You may need to run the install command manually with sudo.");
    }
  };

  const handleSkipDaemon = () => {
    completeSetup();
  };

  const handleFinishWithDaemon = () => {
    completeSetup();
  };

  const handleCloseApp = async () => {
    try {
      await invoke("force_quit_unconfigured");
    } catch (error) {
      console.error("Failed to close app:", error);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md relative fluent-card">
          <button
            onClick={handleCloseApp}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Welcome to ParentShield</CardTitle>
            <CardDescription>
              Set up your parent password to protect the settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Parent Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded ${i < strength ? strengthColor : "bg-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Strength: {strengthText}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              className="w-full"
              onClick={handleSetupPassword}
              disabled={!password || !confirmPassword || isLoading}
            >
              {isLoading ? "Setting up..." : "Continue"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 2) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md relative fluent-card">
        <button
          onClick={handleCloseApp}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success">
            <Check className="h-8 w-8 text-success-foreground" />
          </div>
          <CardTitle className="text-2xl">Save Your Recovery Password</CardTitle>
          <CardDescription>
            Write this down and keep it safe. You'll need it if you forget your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4">
            <p className="text-xs text-amber-700 dark:text-amber-400 mb-2">
              Master Recovery Password
            </p>
            <div className="flex items-center justify-between gap-2">
              <code className="text-lg font-mono font-bold text-amber-900 dark:text-amber-200">
                {masterPassword}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyMasterPassword}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
            <p className="text-sm text-red-700 dark:text-red-400">
              <strong>Important:</strong> This password is never stored and cannot be recovered.
              Write it down and keep it in a safe place.
            </p>
          </div>

          <Button className="w-full" onClick={() => setStep(3)}>
            I've saved my recovery password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
  }

  // Step 3: Daemon installation
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md relative fluent-card">
        <button
          onClick={handleCloseApp}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Server className="h-8 w-8 text-secondary-foreground" />
          </div>
          <CardTitle className="text-2xl">Install Background Service</CardTitle>
          <CardDescription>
            The background service ensures blocking works even when the app is closed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
            <p className="text-sm text-primary">
              <strong>Why install the service?</strong>
            </p>
            <ul className="text-sm text-primary/80 mt-2 space-y-1 list-disc list-inside">
              <li>Blocking continues when app is closed</li>
              <li>No password prompts for settings changes</li>
              <li>Automatic firewall protection</li>
              <li>Continuous process monitoring</li>
            </ul>
          </div>

          {daemonStatus?.installed && daemonStatus?.running && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                Service is installed and running!
              </AlertDescription>
            </Alert>
          )}

          {daemonError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{daemonError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            {!daemonStatus?.installed ? (
              <Button
                className="w-full"
                onClick={handleInstallDaemon}
                disabled={daemonLoading}
              >
                {daemonLoading ? "Installing..." : "Install Background Service"}
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handleFinishWithDaemon}
              >
                Continue to Dashboard
              </Button>
            )}

            {!daemonStatus?.installed && (
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={handleSkipDaemon}
              >
                Skip for now (not recommended)
              </Button>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            The service requires administrator privileges to install.
            You can install it later from Settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
