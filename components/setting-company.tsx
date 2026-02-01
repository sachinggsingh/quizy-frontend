"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Mail, Globe, MapPin, FileText } from "lucide-react"

export function SettingsCompany() {
  const companyInfo = [
    { label: "Company Name", value: "MindClash Inc." },
    { label: "Founded", value: "2024" },
    { label: "Headquarters", value: "San Francisco, CA, USA" },
    { label: "Team Size", value: "50+ team members" },
  ]

  const legalLinks = [
    { title: "Terms of Service", description: "Our terms and conditions", url: "#" },
    { title: "Privacy Policy", description: "How we handle your data", url: "#" },
    { title: "Cookie Policy", description: "Information about cookies", url: "#" },
    { title: "GDPR Compliance", description: "Data protection compliance", url: "#" },
  ]

  const contactInfo = [
    { label: "Email", value: "support@MindClash.com", icon: Mail },
    { label: "Website", value: "www.MindClash.com", icon: Globe },
    { label: "Address", value: "123 Tech Street, San Francisco, CA 94102", icon: MapPin },
  ]

  return (
    <div className="space-y-4">
      {/* Company Information */}
      <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40">
        <CardHeader>
          <CardTitle>About MindClash</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            MindClash is a leading platform for interactive learning and skill assessment. We empower learners worldwide to test their knowledge, compete with peers, and achieve mastery in diverse topics. Our mission is to make quality education accessible and engaging for everyone.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {companyInfo.map((info, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-card/30 border border-border/20">
                <p className="text-xs font-medium text-muted-foreground mb-1">{info.label}</p>
                <p className="text-sm font-semibold text-foreground">{info.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {contactInfo.map((info, idx) => {
            const Icon = info.icon
            return (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-card/30 border border-border/20 hover:border-primary/30 transition-colors">
                <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{info.label}</p>
                  <p className="text-sm text-foreground">{info.value}</p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Legal Documents */}
      <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Legal & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Please review our legal documents to understand how we operate and protect your rights.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {legalLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                className="group p-4 rounded-lg bg-card/30 border border-border/20 hover:border-primary/30 hover:bg-card/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{link.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{link.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Company Mission & Values */}
      <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40">
        <CardHeader>
          <CardTitle>Our Mission & Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium text-foreground mb-2">Mission</h3>
            <p className="text-sm text-muted-foreground">
              To democratize learning and assessment by providing innovative, engaging, and accessible quiz platforms that empower individuals to achieve their educational goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { title: "Innovation", desc: "Constantly improving our platform with cutting-edge features" },
              { title: "Accessibility", desc: "Making quality education accessible to learners worldwide" },
              { title: "Community", desc: "Building a supportive ecosystem of learners and educators" },
            ].map((value, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-card/30 border border-border/20">
                <p className="font-medium text-foreground text-sm">{value.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{value.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Version & Support */}
      <Card className="border-primary/20 bg-gradient-to-br from-card/80 to-card/40">
        <CardHeader>
          <CardTitle>Support & Version Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-card/30 border border-border/20">
              <p className="text-xs font-medium text-muted-foreground">Current Version</p>
              <p className="text-sm font-semibold text-foreground mt-1">v2.4.1</p>
            </div>
            <div className="p-3 rounded-lg bg-card/30 border border-border/20">
              <p className="text-xs font-medium text-muted-foreground">Last Updated</p>
              <p className="text-sm font-semibold text-foreground mt-1">Jan 2024</p>
            </div>
          </div>
          <Button className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg transition-all">
            <ExternalLink className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
