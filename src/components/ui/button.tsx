import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-all rounded-full disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "relative overflow-hidden bg-gradient-primary text-white text-[18px] leading-[140%] px-6 py-[15px] border-none shadow-glow",
        pricing: "relative overflow-hidden bg-gradient-primary text-white text-[18px] leading-[140%] px-6 py-[15px] border-none shadow-glow",
        outline: "bg-background border border-border text-foreground hover:bg-muted hover:text-foreground",
        form: "relative overflow-hidden bg-gradient-primary text-white text-[18px] leading-[140%] px-6 py-[15px] border-none",
        link: "text-foreground hover:underline",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-12",
        sm: "h-9 px-3",
        lg: "h-[55px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // Logic: Apply slide if default (undefined), primary, OR form
    const shouldSlide = !variant || variant === "primary" || variant === "form";

    // 1. Extract the content
    const child = asChild ? React.Children.only(props.children) as React.ReactElement : null;
    const childChildren = child ? child.props.children : props.children;

    // 2. Create the sliding content structure
    const content = shouldSlide ? (
      <>
        <span className="flex items-center gap-1.5 transition-transform duration-300 ease-in-out group-hover:-translate-y-[150%]">
          {childChildren}
        </span>
        <span className="absolute inset-0 flex h-full w-full items-center justify-center gap-1.5 transition-transform duration-300 ease-in-out translate-y-[150%] group-hover:translate-y-0 text-inherit">
          {childChildren}
        </span>
      </>
    ) : (
      childChildren
    );

    // 3. Render logic
    if (asChild && child) {
      return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
          {React.cloneElement(child, { children: content } as React.Attributes)}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
