import * as React from "react"

import { cn } from "@/shared/lib/utils"

export interface InputProps extends Omit<React.ComponentProps<"input">, 'size'> {
  label?: string
  fullWidth?: boolean
  error?: string
  helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, fullWidth, error, helperText, ...props }, ref) => {
    const inputId = React.useId()
    const hasError = !!error

    if (label) {
      return (
        <div className={cn("space-y-2", fullWidth && "w-full")}>
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            id={inputId}
            ref={ref}
            type={type}
            data-slot="input"
            aria-invalid={hasError}
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 rounded-md border bg-white px-3 py-2 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-[3px]",
              hasError && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20",
              className
            )}
            {...props}
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
      )
    }

    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        aria-invalid={hasError}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-12 w-full min-w-0 rounded-md border bg-white px-3 py-2 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-[3px]",
          hasError && "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20",
          fullWidth && "w-full",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
