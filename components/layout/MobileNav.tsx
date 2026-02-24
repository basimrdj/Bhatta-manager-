'use client'
import { Home, BookOpen, Package, User, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/customers', label: 'Ledger', icon: BookOpen },
    { href: '/stock', label: 'Stock', icon: Package },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  // Split links into left and right groups
  const leftLinks = links.slice(0, 2)
  const rightLinks = links.slice(2)

  return (
    <div className="fixed bottom-0 left-0 w-full z-20 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-[#2c1b15] pb-safe pt-2">
      <div className="flex items-center justify-between px-2 pb-2">

        {/* Left Group */}
        <div className="flex flex-1 justify-around">
          {leftLinks.map((link) => {
            const Icon = link.icon
            // Active if exact match OR starts with (except home which is root)
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center justify-end gap-1 p-2 transition-colors group min-w-[64px]",
                  isActive ? "text-primary" : "text-slate-400 dark:text-slate-500 hover:text-primary"
                )}
              >
                <Icon className={cn("w-6 h-6 group-hover:scale-110 transition-transform")} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Center Floating Button */}
        <div className="relative -top-6 px-2">
          <Link href="/dispatch">
            <button className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 hover:scale-105 transition-transform active:scale-95">
              <Plus className="w-7 h-7" />
            </button>
          </Link>
        </div>

        {/* Right Group */}
        <div className="flex flex-1 justify-around">
          {rightLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex flex-col items-center justify-end gap-1 p-2 transition-colors group min-w-[64px]",
                  isActive ? "text-primary" : "text-slate-400 dark:text-slate-500 hover:text-primary"
                )}
              >
                <Icon className={cn("w-6 h-6 group-hover:scale-110 transition-transform")} />
                <span className="text-[10px] font-medium">{link.label}</span>
              </Link>
            )
          })}
        </div>

      </div>
    </div>
  )
}
