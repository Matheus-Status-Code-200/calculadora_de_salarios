"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"


const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(
      // Altura ajustada responsivamente
      "peer inline-flex max-sm:h-[16px] items-center justify-start p-[2px] shrink-0 cursor-pointer rounded-full border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 w-9 h-2 border-[10px] px-0 py-0 bg-transparent",
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "block rounded-full shadow transition-transform duration-200 bg-lime-500",
        // Tamanhos responsivos
        "max-sm:h-[12px] max-sm:w-[12px] md:h-[20px] md:w-[20px] h-4 w-4",
        // Movimentação do botão conforme o estado
        "data-[state=checked]:translate-x-[16px] max-sm:data-[state=checked]:translate-x-[12px] md:data-[state=checked]:translate-x-[20px]",
        "data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))

Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
