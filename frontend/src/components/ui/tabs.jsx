import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  )
}

const TabsList = ({ children, className, activeTab, setActiveTab }) => (
  <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-gray-100 p-1 text-muted-foreground", className)}>
    {React.Children.map(children, child => 
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
)

const TabsTrigger = ({ value, children, activeTab, setActiveTab, className }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      activeTab === value ? "bg-white text-gray-950 shadow" : "hover:text-gray-900",
      className
    )}
  >
    {children}
  </button>
)

const TabsContent = ({ value, children, activeTab, className }) => {
  if (activeTab !== value) return null
  return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
