"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { categoryGroups } from "@/lib/categories"

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo60.png"
                alt={siteConfig.name}
                width={60}
                height={30}
                className="h-10 w-auto"
                priority
              />
            </Link>
            <nav className="hidden md:flex gap-6">
              {categoryGroups.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {category.title}
                </Link>
              ))}
            </nav>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="fixed right-0 top-16 h-full w-80 bg-background border-l shadow-lg">
            <nav className="flex flex-col gap-4 p-6">
              {categoryGroups.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-3 border-b border-border/50"
                >
                  <category.icon className="mr-3 h-5 w-5" />
                  {category.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
