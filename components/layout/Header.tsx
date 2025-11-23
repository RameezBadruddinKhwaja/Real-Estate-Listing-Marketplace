'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Heart, User, Menu, Plus } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Prime Properties</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Properties
          </Link>
          <Link href="/agents" className="text-sm font-medium hover:text-primary transition-colors">
            Agents
          </Link>
          <Link href="/favorites" className="text-sm font-medium hover:text-primary transition-colors">
            <Heart className="h-5 w-5" />
          </Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard/agent">
            <Button variant="outline">
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/agent/properties/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              List Property
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link href="/" className="block py-2 hover:text-primary transition-colors">
              Properties
            </Link>
            <Link href="/agents" className="block py-2 hover:text-primary transition-colors">
              Agents
            </Link>
            <Link href="/favorites" className="block py-2 hover:text-primary transition-colors">
              Favorites
            </Link>
            <Link href="/dashboard/agent">
              <Button variant="outline" className="w-full">
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/agent/properties/new">
              <Button className="w-full">
                List Property
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
