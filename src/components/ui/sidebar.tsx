
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useMobile } from "@/hooks/use-mobile"
import { Menu } from "lucide-react"

const sidebarVariants = cva(
  "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r bg-background shadow-sm transition-transform duration-300 ease-in-out data-[collapsed=true]:translate-x-0 data-[collapsed=false]:translate-x-0 md:relative md:w-64 md:translate-x-0 md:data-[collapsed=true]:w-20",
  {
    variants: {
      variant: {
        default: "border-r",
        minimal: "border-0 bg-transparent shadow-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  collapsed?: boolean
}

export const SidebarContext = React.createContext<{
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}>({
  collapsed: false,
  setCollapsed: () => {},
})

export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode
  defaultCollapsed?: boolean
}) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  const isMobile = useMobile()

  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    }
  }, [isMobile])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({
  className,
  variant,
  collapsed: collapsedProp,
  ...props
}: SidebarProps) {
  const { collapsed } = React.useContext(SidebarContext)
  const isCollapsed = collapsedProp !== undefined ? collapsedProp : collapsed

  return (
    <div
      className={cn(sidebarVariants({ variant }), className)}
      data-collapsed={isCollapsed}
      {...props}
    />
  )
}

export function SidebarTrigger() {
  const { collapsed, setCollapsed } = React.useContext(SidebarContext)
  const isMobile = useMobile()

  if (!isMobile) return null

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed left-4 top-4 z-50"
      onClick={() => setCollapsed(!collapsed)}
    >
      <Menu className="h-4 w-4" />
    </Button>
  )
}

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex h-14 items-center px-4", className)}
      {...props}
    />
  )
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-1 flex-col overflow-hidden", className)}
      {...props}
    />
  )
}

export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-4", className)}
      {...props}
    />
  )
}

export function SidebarGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("py-2", className)}
      {...props}
    />
  )
}

export function SidebarGroupLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { collapsed } = React.useContext(SidebarContext)

  return (
    <div
      className={cn(
        "px-4 py-2",
        collapsed && "sr-only",
        className
      )}
      {...props}
    />
  )
}

export function SidebarGroupContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("space-y-1", className)}
      {...props}
    />
  )
}

export function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn("space-y-1", className)}
      {...props}
    />
  )
}

export function SidebarMenuItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li
      className={cn(className)}
      {...props}
    />
  )
}

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, asChild = false, ...props }, ref) => {
  const { collapsed } = React.useContext(SidebarContext)
  const Comp = asChild ? React.Fragment : "button"

  return (
    <Comp
      ref={ref}
      className={cn(
        "flex w-full items-center rounded-md px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent",
        collapsed && "justify-center px-0",
        !asChild && "hover:bg-accent",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"
