"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings2FA } from "@/components/setting-2fa"
import { SettingsCompany } from "@/components/setting-company"
import { Bell, Lock, Shield, Building2, FileText, Eye } from "lucide-react"

type SettingsTab = "security" | "notifications" | "privacy" | "company"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("security")

  const settingsTabs = [
    { id: "security" as const, label: "Security & 2FA", icon: Shield },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "privacy" as const, label: "Privacy", icon: Eye },
    { id: "company" as const, label: "Company Info", icon: Building2 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-8">
        {/* <div className="mb-2"> */}
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account, security, and preferences</p>
        {/* </div> */}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
                    : "bg-card/50 border border-border/50 text-foreground hover:border-primary/50 hover:bg-card/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Security & 2FA Tab */}
          {activeTab === "security" && <Settings2FA />}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      "Quiz completions and scores",
                      "Leaderboard ranking changes",
                      "Achievement unlocks",
                      "Comments on discussion posts",
                      "Weekly summary digest",
                      "New quiz releases in favorite topics",
                    ].map((pref, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/20 hover:border-primary/30 transition-colors">
                        <label className="text-sm font-medium cursor-pointer">{pref}</label>
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { title: "Public Profile", desc: "Allow others to view your profile" },
                      { title: "Show Leaderboard Rank", desc: "Display your ranking publicly" },
                      { title: "Share Achievements", desc: "Let others see your achievements" },
                      { title: "Allow Messages", desc: "Receive messages from other users" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between p-4 rounded-lg bg-card/30 border border-border/20">
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded cursor-pointer mt-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/20 bg-gradient-to-br from-destructive/5 to-destructive/2">
                <CardHeader>
                  <CardTitle className="text-destructive">Delete Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <Button className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete Account</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Company Info Tab */}
          {activeTab === "company" && <SettingsCompany />}
        </div>
      </main>
    </div>
  )
}
