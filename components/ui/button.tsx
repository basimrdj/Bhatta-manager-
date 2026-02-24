import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'danger'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variant === 'default' && "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20",
          variant === 'outline' && "border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-900 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800",
          variant === 'ghost' && "bg-transparent hover:bg-slate-100 text-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
          variant === 'secondary' && "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100",
          variant === 'danger' && "bg-red-500 text-white hover:bg-red-600",
          size === 'default' && "h-11 px-4 py-2 text-sm",
          size === 'sm' && "h-9 px-3 text-xs",
          size === 'lg' && "h-14 px-8 text-base",
          size === 'icon' && "h-11 w-11",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
