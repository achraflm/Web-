"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useOnClickOutside } from "usehooks-ts"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface TabsContextType {
  value: string | null
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("useTabsContext must be used within ExpandableTabs")
  }
  return context
}

interface Tab {
  title: string
  icon: LucideIcon
  type?: never
}

interface Separator {
  type: "separator"
  title?: never
  icon?: never
}

type TabItem = Tab | Separator

interface ExpandableTabsProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

interface ExpandableTabsListProps {
  children: React.ReactNode
  className?: string
  activeColor?: string
}

interface ExpandableTabsTriggerProps {
  value: string
  icon: LucideIcon
  children: React.ReactNode
  className?: string
  activeColor?: string
}

interface ExpandableTabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function ExpandableTabs({ children, value: controlledValue, onValueChange, className }: ExpandableTabsProps) {
  const [internalValue, setInternalValue] = React.useState<string | null>(null)
  const value = controlledValue ?? internalValue

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value: value ?? null, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function ExpandableTabsList({ children, className, activeColor = "text-primary" }: ExpandableTabsListProps) {
  const { value: selected, onValueChange } = useTabsContext()
  const outsideClickRef = React.useRef(null)

  useOnClickOutside(outsideClickRef, () => {
    onValueChange("")
  })

  return (
    <div
      ref={outsideClickRef}
      className={cn("flex flex-wrap items-center gap-2 rounded-2xl border bg-background p-1 shadow-sm", className)}
    >
      {children}
    </div>
  )
}

export function ExpandableTabsTrigger({
  value,
  icon: Icon,
  children,
  className,
  activeColor = "text-primary",
}: ExpandableTabsTriggerProps) {
  const { value: selected, onValueChange } = useTabsContext()
  const isSelected = selected === value

  const buttonVariants = {
    initial: {
      gap: 0,
      paddingLeft: ".5rem",
      paddingRight: ".5rem",
    },
    animate: (isSelected: boolean) => ({
      gap: isSelected ? ".5rem" : 0,
      paddingLeft: isSelected ? "1rem" : ".5rem",
      paddingRight: isSelected ? "1rem" : ".5rem",
    }),
  }

  const spanVariants = {
    initial: { width: 0, opacity: 0 },
    animate: { width: "auto", opacity: 1 },
    exit: { width: 0, opacity: 0 },
  }

  const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 }

  return (
    <motion.button
      variants={buttonVariants}
      initial={false}
      animate="animate"
      custom={isSelected}
      onClick={() => onValueChange(value)}
      transition={transition}
      className={cn(
        "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300",
        isSelected ? cn("bg-muted", activeColor) : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <Icon size={20} />
      <AnimatePresence initial={false}>
        {isSelected && (
          <motion.span
            variants={spanVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            className="overflow-hidden"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export function ExpandableTabsContent({ value, children, className }: ExpandableTabsContentProps) {
  const { value: selected } = useTabsContext()

  if (selected !== value) {
    return null
  }

  return <div className={className}>{children}</div>
}
