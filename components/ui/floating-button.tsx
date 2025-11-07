"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit3, X, Minimize2, Maximize2, Share2, Copy } from "lucide-react"
import { ShareComponent } from "@/components/shared/share-component"
import { useShare } from "@/lib/hooks/use-share"

export function FloatingButton() {
  const [position, setPosition] = useState({ x: 0, y: 80 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isExpanded, setIsExpanded] = useState(false)
  const [notepadPosition, setNotepadPosition] = useState({ x: 0, y: 0 })
  const [notepadDragging, setNotepadDragging] = useState(false)
  const [notepadDragOffset, setNotepadDragOffset] = useState({ x: 0, y: 0 })
  const [noteText, setNoteText] = useState("")
  const { isShareOpen, shareData, openShare, closeShare } = useShare()
  const [copied, setCopied] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const notepadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set initial position to upper right
    setPosition({ x: window.innerWidth - 80, y: 80 })
    setNotepadPosition({ x: window.innerWidth - 350, y: 80 })
    
    // Load saved note from localStorage
    const savedNote = localStorage.getItem('floating-notepad')
    if (savedNote) {
      setNoteText(savedNote)
    }
  }, [])

  // Save note to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('floating-notepad', noteText)
  }, [noteText])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!buttonRef.current) return
    
    const rect = buttonRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsDragging(true)
  }

  const handleNotepadMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setNotepadDragOffset({
      x: e.clientX - notepadPosition.x,
      y: e.clientY - notepadPosition.y
    })
    setNotepadDragging(true)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      
      // Keep button within viewport
      const maxX = window.innerWidth - 60
      const maxY = window.innerHeight - 60
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }
    
    if (notepadDragging) {
      const newX = e.clientX - notepadDragOffset.x
      const newY = e.clientY - notepadDragOffset.y
      
      // Keep notepad within viewport
      const maxX = window.innerWidth - 320
      const maxY = window.innerHeight - 400
      
      setNotepadPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }
  }, [isDragging, notepadDragging, dragOffset, notepadDragOffset])

  const handleMouseUp = () => {
    setIsDragging(false)
    setNotepadDragging(false)
  }

  useEffect(() => {
    if (isDragging || notepadDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, notepadDragging, handleMouseMove])

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={buttonRef}
              className="fixed z-50 w-12 h-12 rounded-xl shadow-xl cursor-move"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
              }}
              onMouseDown={handleMouseDown}
              onClick={() => setIsExpanded(!isExpanded)}
              size="icon"
            >
              <Edit3 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click for notepad</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isExpanded && (
        <div ref={notepadRef}>
          <FloatingNotepad
            position={notepadPosition}
            onMouseDown={handleNotepadMouseDown}
            noteText={noteText}
            setNoteText={setNoteText}
            onClose={() => setIsExpanded(false)}
            onShare={() => openShare({ content: noteText, title: "Quick Notes", type: "text" })}
            onCopy={async () => {
              try {
                await navigator.clipboard.writeText(noteText)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              } catch (err) {
                console.error('Failed to copy:', err)
              }
            }}
            copied={copied}
          />
        </div>
      )}
      
      {isShareOpen && shareData && (
        <ShareComponent
          content={shareData.content}
          title={shareData.title}
          type={shareData.type}
          onClose={closeShare}
        />
      )}
    </>
  )
}

function FloatingNotepad({ 
  position, 
  onMouseDown, 
  noteText, 
  setNoteText, 
  onClose,
  onShare,
  onCopy,
  copied
}: {
  position: { x: number; y: number }
  onMouseDown: (e: React.MouseEvent) => void
  noteText: string
  setNoteText: (text: string) => void
  onClose: () => void
  onShare: () => void
  onCopy: () => void
  copied: boolean
}) {
  return (
    <Card 
      className="fixed z-40 w-80 h-96 shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <CardHeader 
        className="cursor-move pb-2"
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Quick Notes</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <Textarea
          placeholder="Write your notes here..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="h-56 resize-none mb-3"
        />
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            disabled={!noteText.trim()}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
            disabled={!noteText.trim()}
            className={`flex items-center gap-2 ${copied ? 'bg-green-100' : ''}`}
          >
            <Copy className="h-4 w-4" />
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}