"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Smartphone, Copy, Check } from "lucide-react"

export function Settings2FA() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [showBackupCodes, setShowBackupCodes] = useState(false)
  const [copied, setCopied] = useState(false)

  const mockSecret = "JBSWY3DPEBLW64TMMQ6XDOICJV2Z5C7M"
  const mockBackupCodes = ["1234-5678", "2345-6789", "3456-7890", "4567-8901", "5678-9012"]

  const handleCopy = () => {
    navigator.clipboard.writeText(mockSecret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* 2FA Status Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Two-Factor Authentication (2FA)
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${twoFAEnabled ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
              {twoFAEnabled ? "Enabled" : "Disabled"}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Two-factor authentication adds an extra layer of security to your account by requiring a second verification method in addition to your password.
          </p>

          {!twoFAEnabled ? (
            <Button
              onClick={() => setShowSetup(!showSetup)}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg transition-all"
            >
              {showSetup ? "Cancel Setup" : "Enable 2FA"}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={() => setShowBackupCodes(!showBackupCodes)}
                variant="outline"
                className="bg-transparent border-border/50 hover:bg-card/50"
              >
                View Backup Codes
              </Button>
              <Button
                onClick={() => setTwoFAEnabled(false)}
                variant="outline"
                className="bg-transparent border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                Disable 2FA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      {showSetup && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-lg">Set Up Two-Factor Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Download an Authenticator App</h3>
                  <p className="text-sm text-muted-foreground mt-1">Use Google Authenticator, Microsoft Authenticator, or Authy</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Scan the QR Code</h3>
                  <div className="mt-2 p-4 bg-card/50 rounded-lg border border-border/50 flex flex-col items-center gap-2">
                    <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center">
                      <div className="text-xs text-center text-gray-500 px-2">
                        QR Code would appear here in production
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Or enter this code manually:</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Manual Entry Code</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <code className="flex-1 p-3 bg-card/50 rounded-lg border border-border/50 font-mono text-sm text-foreground">
                      {mockSecret}
                    </code>
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-card/50 rounded-lg transition-colors"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-xs text-destructive font-medium">⚠️ Important: Save your backup codes in a secure location. You'll need them if you lose access to your authenticator app.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Enter the 6-digit code from your authenticator</label>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                className="w-full p-2 rounded-lg bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              />
            </div>

            <Button
              onClick={() => {
                setTwoFAEnabled(true)
                setShowSetup(false)
              }}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg transition-all"
            >
              Verify & Enable 2FA
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Backup Codes */}
      {showBackupCodes && (
        <Card className="border-warning/20 bg-gradient-to-br from-card/80 to-card/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              Backup Codes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Keep these codes in a safe place. Use them to regain access to your account if you lose your authenticator device.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mockBackupCodes.map((code, idx) => (
                <div key={idx} className="p-3 bg-card/50 rounded-lg border border-border/50 font-mono text-sm text-foreground flex items-center justify-between">
                  <span>{code}</span>
                  <button className="p-1 hover:bg-card/50 rounded transition-colors">
                    <Copy className="w-4 h-4 text-muted-foreground hover:text-primary" />
                  </button>
                </div>
              ))}
            </div>
            <Button
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg transition-all"
            >
              Regenerate Codes
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Password Security */}
      <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40">
        <CardHeader>
          <CardTitle>Password Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              className="w-full p-2 rounded-lg bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              className="w-full p-2 rounded-lg bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full p-2 rounded-lg bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <Button className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg transition-all">
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
