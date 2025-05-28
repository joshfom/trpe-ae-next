import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ",
    {
      variants: {
        variant: {
          default: "bg-primary rounded-3xl text-primary-foreground hover:bg-primary/80",
          destructive:
              "bg-destructive rounded-3xl text-destructive-foreground hover:bg-destructive/80",
          outline:
              "border rounded-3xl border-input bg-background hover:bg-accent hover:text-accent-foreground",
          secondary:
              "bg-secondary rounded-3xl text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
          default: "py-1.5 px-6",
          xs: " px-2 py-1.5 text-xs",
          sm: "py-1  px-3 text-sm",
          md: "py-2  px-4",
          lg: "h-11  px-8",
          icon: "h-10 w-10",
        },
      },

      defaultVariants: {
        variant: "default",
        size: "default",
      },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

// Loading spinner component to avoid code duplication
const LoadingSpinner = () => (
  <div role="status" className="inline-flex mr-2">
    <svg 
      aria-hidden="true"
      className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-teal-500"
      viewBox="0 0 100 101" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
)

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, loading = false, disabled = false, asChild = false, children, ...props}, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Build the final disabled state
    const isDisabled = disabled || loading
    
    // Build the className for both button and slot cases
    const buttonClassName = cn(
      buttonVariants({variant, size, className}),
      loading && "cursor-progress",
      !loading && isDisabled && "opacity-50 cursor-not-allowed"
    )
    
    // When asChild is true, we can't add loading spinner as it would break Slot's single child requirement
    if (asChild) {
      if (loading) {
        console.warn("Loading state is not supported when asChild is true")
      }
      return (
        <Comp
          className={buttonClassName}
          ref={ref}
          disabled={isDisabled}
          {...props}
        >
          {children}
        </Comp>
      )
    }
    
    return (
      <Comp
        className={buttonClassName}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {children}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export {Button, buttonVariants}
