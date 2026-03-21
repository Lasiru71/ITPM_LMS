import * as React from "react"
import { cn } from "../../lib/utils"

const Select = ({ children, onValueChange, defaultValue }) => {
  const [value, setValue] = React.useState(defaultValue)
  
  const handleSelect = (val) => {
    setValue(val)
    if (onValueChange) onValueChange(val)
  }

  return (
    <div className="relative w-full">
      {React.Children.map(children, child => {
        if (child.type.displayName === "SelectTrigger") {
          return React.cloneElement(child, { value })
        }
        if (child.type.displayName === "SelectContent") {
          return React.cloneElement(child, { onSelect: handleSelect, activeValue: value })
        }
        return child
      })}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, value, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {value || children}
    <span className="ml-2">▼</span>
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, value }) => (
  <span className="pointer-events-none">{value || placeholder}</span>
)

const SelectContent = ({ children, onSelect, activeValue, className }) => (
  <div className={cn("absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white p-1 text-popover-foreground shadow-md", className)}>
    {React.Children.map(children, child => 
      React.cloneElement(child, { onSelect, active: activeValue === child.props.value })
    )}
  </div>
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef(({ className, children, value, onSelect, active, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100",
      active && "bg-gray-100",
      className
    )}
    onClick={() => onSelect(value)}
    {...props}
  >
    {children}
  </div>
))
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }
