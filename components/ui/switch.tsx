"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Default (630px~767px): tamanho médio
      "peer inline-flex h-[20px] w-[36px] items-center justify-start p-[2px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      "max-sm:h-[16px] max-sm:w-[32px] md:h-[24px] md:w-[44px]",
      "data-[state=checked]:bg-red data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "block rounded-full bg-background shadow transition-transform duration-200",
        "h-[16px] w-[16px] max-sm:h-[12px] max-sm:w-[12px] md:h-[20px] md:w-[20px]",
        "data-[state=checked]:translate-x-[16px] max-sm:data-[state=checked]:translate-x-[16px] md:data-[state=checked]:translate-x-[20px]",
        "data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
