'use client'
import { ArrowLeft, MoreVertical } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title: string
  showBack?: boolean
  className?: string
  actions?: React.ReactNode
}

export function Header({ title, showBack = true, className, actions }: HeaderProps) {
  const router = useRouter()
  return (
    <header className={cn("sticky top-0 z-10 bg-white/90 dark:bg-[#2c1b15]/90 backdrop-blur-md border-b border-slate-100 dark:border-white/10 px-4 pt-4 pb-3 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        {showBack ? (
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full w-10 h-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <div className="w-10 h-10" />
        )}

        <h2 className="text-lg font-bold text-center flex-1 mx-2 truncate">{title}</h2>

        <div className="flex items-center gap-2">
          {actions}
          <Button variant="ghost" size="icon" className="rounded-full w-10 h-10">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
