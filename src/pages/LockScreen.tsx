import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";
import { useBlockingStore } from "@/stores/blocking-store";

export function LockScreen() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const { login, resetWithMaster, isLoading } = useAuthStore();
  const { currentlyBlocking } = useBlockingStore();

  const handleLogin = async () => {
    setError("");
    const success = await login(password);
    if (!success) {
      setError("Invalid password");
      setPassword("");
    }
  };

  const handleRecovery = async () => {
    setError("");
    if (!newPassword || newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    const success = await resetWithMaster(masterPassword, newPassword);
    if (!success) {
      setError("Invalid recovery password");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (showRecovery) {
        handleRecovery();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary">
            {currentlyBlocking ? (
              <Shield className="h-8 w-8 text-white" />
            ) : (
              <Lock className="h-8 w-8 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl font-semibold">ParentShield</CardTitle>
          <CardDescription className="text-muted-foreground">
            {currentlyBlocking
              ? "Protection is active. Enter password to access settings."
              : "Enter your password to access settings."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {!showRecovery ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your password"
                    autoFocus
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                className="w-full bg-gradient-primary hover:opacity-90"
                onClick={handleLogin}
                disabled={!password || isLoading}
              >
                {isLoading ? "Verifying..." : "Unlock"}
              </Button>

              <Button
                variant="ghost"
                className="w-full text-sm text-muted-foreground hover:text-foreground"
                onClick={() => setShowRecovery(true)}
              >
                Forgot password?
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="recovery">Recovery Password</Label>
                <Input
                  id="recovery"
                  value={masterPassword}
                  onChange={(e) => {
                    setMasterPassword(e.target.value.toUpperCase());
                    setError("");
                  }}
                  placeholder="WORD-WORD-0000-WORD"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the recovery password you saved during setup
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter new password"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                className="w-full bg-gradient-primary hover:opacity-90"
                onClick={handleRecovery}
                disabled={!masterPassword || !newPassword || isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>

              <Button
                variant="ghost"
                className="w-full text-sm text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setShowRecovery(false);
                  setError("");
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
