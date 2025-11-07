"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ShareService, ShareOptions } from "@/lib/services/share-service"
import { 
  Share2, 
  Mail, 
  Printer, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Copy,
  X 
} from "lucide-react"

interface ShareComponentProps {
  content: string
  title?: string
  type?: ShareOptions['type']
  onClose: () => void
}

export function ShareComponent({ content, title = "Shared Content", type = 'text', onClose }: ShareComponentProps) {
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState(title)
  const [copied, setCopied] = useState(false)

  const handleEmailShare = async () => {
    if (!email) return
    const formattedContent = ShareService.formatContentForSharing(content, type)
    await ShareService.shareViaEmail({ content: formattedContent, title: subject }, email)
  }

  const handlePrint = async () => {
    const formattedContent = ShareService.formatContentForSharing(content, type)
    await ShareService.shareViaPrint({ content: formattedContent, title })
  }

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const formattedContent = ShareService.formatContentForSharing(content, type)
    ShareService.shareToSocialMedia(platform, { content: formattedContent, title })
  }

  const handleCopyToClipboard = async () => {
    const formattedContent = ShareService.formatContentForSharing(content, type)
    const success = await ShareService.shareToClipboard({ content: formattedContent })
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card className="fixed inset-0 z-50 m-4 max-w-md mx-auto mt-20 h-fit shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Content
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Share */}
        <div className="space-y-2">
          <Label htmlFor="email">Share via Email</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              placeholder="recipient@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={handleEmailShare} disabled={!email}>
              <Mail className="h-4 w-4" />
            </Button>
          </div>
          <Input
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Print */}
        <div className="flex items-center justify-between">
          <Label>Print Content</Label>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>

        {/* Copy to Clipboard */}
        <div className="flex items-center justify-between">
          <Label>Copy to Clipboard</Label>
          <Button 
            variant="outline" 
            onClick={handleCopyToClipboard}
            className={copied ? "bg-green-100" : ""}
          >
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        {/* Social Media */}
        <div className="space-y-2">
          <Label>Share on Social Media</Label>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSocialShare('twitter')}
              className="flex-1"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSocialShare('facebook')}
              className="flex-1"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSocialShare('linkedin')}
              className="flex-1"
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
          </div>
        </div>

        {/* Content Preview */}
        <div className="space-y-2">
          <Label>Content Preview</Label>
          <Textarea
            value={content}
            readOnly
            className="h-20 text-sm"
          />
        </div>
      </CardContent>
    </Card>
  )
}