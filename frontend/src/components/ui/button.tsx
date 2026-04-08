import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:-translate-y-0.5 hover:bg-foreground/92 shadow-soft",
        destructive: "bg-destructive text-destructive-foreground hover:-translate-y-0.5 hover:bg-destructive/90",
        outline: "border border-border bg-background/70 text-foreground hover:-translate-y-0.5 hover:border-primary/40 hover:bg-background shadow-soft",
        secondary: "bg-secondary/20 text-foreground hover:-translate-y-0.5 hover:bg-secondary/30 shadow-soft",
        ghost: "hover:bg-foreground/5 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "gradient-primary text-white hover:-translate-y-0.5 hover:shadow-glow shadow-medium",
        "gradient-outline": "border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:-translate-y-0.5 hover:bg-white/18",
        accent: "bg-accent text-accent-foreground hover:-translate-y-0.5 hover:bg-accent/90 shadow-soft",
        success: "bg-success text-success-foreground hover:-translate-y-0.5 hover:bg-success/90 shadow-soft",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
