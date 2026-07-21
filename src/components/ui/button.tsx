import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
        primary: "bg-gradient-primary text-white hover:opacity-90 shadow-glow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        marketing: "relative overflow-hidden bg-gradient-primary text-white text-[18px] leading-[140%] px-6 py-[15px] border-none shadow-glow group",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-[6px] px-3 text-xs",
        lg: "h-12 rounded-[10px] px-8",
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

    // Only apply the complex slide effect for the 'marketing' variant
    const isMarketing = variant === "marketing";

    if (isMarketing) {
      const child = asChild ? (React.Children.only(props.children) as React.ReactElement) : null;
      const childContent = child ? child.props.children : props.children;

      const slideContent = (
        <>
          <span className="flex items-center gap-1.5 transition-transform duration-300 ease-in-out group-hover:-translate-y-[150%]">
            {childContent}
          </span>
          <span className="absolute inset-0 flex h-full w-full items-center justify-center gap-1.5 transition-transform duration-300 ease-in-out translate-y-[150%] group-hover:translate-y-0 text-inherit">
            {childContent}
          </span>
        </>
      );

      if (asChild && child) {
        return (
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
          >
            {React.cloneElement(child, { children: slideContent } as React.Attributes)}
          </Comp>
        );
      }

      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {slideContent}
        </Comp>
      );
    }

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
