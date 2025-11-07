export interface ShareOptions {
  content: string
  title?: string
  url?: string
  type?: 'text' | 'result' | 'calculation' | 'conversion'
}

export class ShareService {
  static async shareViaEmail(options: ShareOptions, recipientEmail: string): Promise<void> {
    const { content, title = "Shared Content" } = options
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(content)}`
    window.open(mailtoUrl, '_blank')
  }

  static async shareViaPrint(options: ShareOptions): Promise<void> {
    const { content, title = "Shared Content" } = options
    const printWindow = window.open('', '_blank')
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                line-height: 1.6;
              }
              .header {
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
                margin-bottom: 20px;
              }
              .content {
                white-space: pre-wrap; 
                word-wrap: break-word;
                background: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
              }
              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #666;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${title}</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="content">${content}</div>
            <div class="footer">
              <p>Shared from ${window.location.hostname}</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  static async shareToClipboard(options: ShareOptions): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(options.content)
      return true
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      return false
    }
  }

  static shareToSocialMedia(platform: 'twitter' | 'facebook' | 'linkedin', options: ShareOptions): void {
    const { content, title = "Check this out!", url = window.location.href } = options
    const encodedContent = encodeURIComponent(content.substring(0, 280))
    const encodedTitle = encodeURIComponent(title)
    const encodedUrl = encodeURIComponent(url)
    
    let shareUrl = ""
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}%0A${encodedContent}&url=${encodedUrl}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedContent}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedContent}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  static formatContentForSharing(content: string, type: ShareOptions['type'] = 'text'): string {
    const timestamp = new Date().toLocaleString()
    
    switch (type) {
      case 'result':
        return `📊 Result:\n${content}\n\n🕒 Generated: ${timestamp}\n🔗 From: ${window.location.hostname}`
      case 'calculation':
        return `🧮 Calculation Result:\n${content}\n\n🕒 Calculated: ${timestamp}\n🔗 From: ${window.location.hostname}`
      case 'conversion':
        return `🔄 Conversion Result:\n${content}\n\n🕒 Converted: ${timestamp}\n🔗 From: ${window.location.hostname}`
      default:
        return `${content}\n\n🕒 Shared: ${timestamp}\n🔗 From: ${window.location.hostname}`
    }
  }
}