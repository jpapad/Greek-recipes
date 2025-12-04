import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-20 w-full rounded-lg border bg-white/50 backdrop-blur-sm px-4 py-3 text-base shadow-sm transition-all duration-200 outline-none focus-visible:ring-[3px] focus-visible:shadow-md focus-visible:bg-white hover:border-ring/50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/50 dark:focus-visible:bg-input/70 resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
