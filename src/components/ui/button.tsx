import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold uppercase tracking-wider ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-neon-green text-black border-2 border-neon-green hover:bg-neon-green/80 shadow-[4px_4px_0px_0px_rgba(0,255,65,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(0,255,65,0.5)] hover:translate-x-[2px] hover:translate-y-[2px]",
        destructive:
          "bg-neon-red text-white border-2 border-neon-red hover:bg-neon-red/80 shadow-[4px_4px_0px_0px_rgba(255,0,60,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(255,0,60,0.5)] hover:translate-x-[2px] hover:translate-y-[2px]",
        outline:
          "border-2 border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white hover:border-white shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)] hover:translate-x-[2px] hover:translate-y-[2px]",
        secondary:
          "bg-neon-blue text-black border-2 border-neon-blue hover:bg-neon-blue/80 shadow-[4px_4px_0px_0px_rgba(0,243,255,0.5)] hover:shadow-[2px_2px_0px_0px_rgba(0,243,255,0.5)] hover:translate-x-[2px] hover:translate-y-[2px]",
        ghost: "hover:bg-gray-800 hover:text-white",
        link: "text-neon-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
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
