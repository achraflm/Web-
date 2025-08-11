"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

interface ThemeToggleProps {
  isDark: boolean
  toggleTheme: () => void
}

export function ThemeToggle({ isDark, toggleTheme }: ThemeToggleProps) {
  const { setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        toggleTheme() // Update local state
        setTheme(isDark ? "light" : "dark") // Update next-themes
      }}
      className={isDark ? "text-purple-300 hover:text-purple-400" : "text-cyan-700 hover:text-cyan-600"}
    >
      {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
