import { cva, type VariantProps } from "class-variance-authority";
import Lottie from "lottie-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// FeatureCard Root Component
interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imagePosition?: "left" | "right";
  variant?: "default" | "full-width" | "split";
}

// Create a context to pass imagePosition to children
const FeatureCardContext = React.createContext<{ imagePosition: "left" | "right" }>({ imagePosition: "right" });

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, imagePosition = "right", variant = "default", children, ...props }, ref) => {
    return (
      <FeatureCardContext.Provider value={{ imagePosition }}>
        <Card
          ref={ref}
          className={cn(
            "overflow-hidden md:p-8 p-5 md:rounded-[30px] rounded-lg border-0 bg-[url(images/common/feature-card-bg.webp)] bg-cover",
            variant === "full-width" && "w-full",
            variant === "split" && "grid md:grid-cols-2 md:gap-[90px] md:items-center",
            variant === "default" && "flex flex-col-reverse md:flex-row md:items-center justify-between md:gap-[90px] gap-6",
            className
          )}
          {...props}
        >
          {children}
        </Card>
      </FeatureCardContext.Provider>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

// FeatureCardContent - Container for text content
const FeatureCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { imagePosition } = React.useContext(FeatureCardContext);
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-start md:p-4 p-0 max-w-[440px]",
          imagePosition === "left" ? "md:order-2" : "md:order-1",
          className
        )}
        {...props}
      />
    );
  }
);

FeatureCardContent.displayName = "FeatureCardContent";

// FeatureCardBadge - Category badge
const FeatureCardBadge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;

    return (
      <div ref={ref} className={cn("mb-4", className)} {...props}>
        <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm font-medium">
          {children}
        </Badge>
      </div>
    );
  }
);
FeatureCardBadge.displayName = "FeatureCardBadge";

// FeatureCardTitle - Main heading
const FeatureCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("h3 mb-5", className)}
      {...props}
    />
  )
);
FeatureCardTitle.displayName = "FeatureCardTitle";

// FeatureCardDescription - Description paragraph
const FeatureCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-base md:text-lg text-muted-foreground", className)}
      {...props}
    />
  )
);
FeatureCardDescription.displayName = "FeatureCardDescription";

// FeatureCardBenefits - List container
const FeatureCardBenefits = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("space-y-3 mb-6", className)} {...props} />
  )
);
FeatureCardBenefits.displayName = "FeatureCardBenefits";

// FeatureCardBenefitItem - Individual benefit with checkmark
const FeatureCardBenefitItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn("flex items-start gap-3 text-muted-foreground", className)}
      {...props}
    >
      <div className="mt-1">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.8253 15.8334H15.8332H15.8253ZM15.8253 15.8334C15.3063 16.348 14.3659 16.2198 13.7064 16.2198C12.8969 16.2198 12.5071 16.3782 11.9293 16.9559C11.4374 17.4479 10.7779 18.3334 9.99984 18.3334C9.22175 18.3334 8.56225 17.4479 8.07031 16.9559C7.49257 16.3782 7.10275 16.2198 6.29322 16.2198C5.63374 16.2198 4.69332 16.348 4.17441 15.8334C3.65135 15.3147 3.78007 14.3704 3.78007 13.7067C3.78007 12.8679 3.59664 12.4822 2.99932 11.8849C2.11079 10.9964 1.66652 10.5521 1.6665 10.0001C1.66651 9.448 2.11077 9.00375 2.9993 8.11522C3.5325 7.58201 3.78007 7.05365 3.78007 6.29346C3.78007 5.63396 3.65191 4.69353 4.1665 4.17461C4.6852 3.65156 5.6295 3.7803 6.29324 3.7803C7.0534 3.7803 7.58177 3.53275 8.11496 2.99956C9.0035 2.11101 9.44775 1.66675 9.99984 1.66675C10.5519 1.66675 10.9962 2.11101 11.8847 2.99956C12.4178 3.53264 12.9461 3.7803 13.7064 3.7803C14.3659 3.7803 15.3064 3.65214 15.8253 4.16675C16.3483 4.68544 16.2196 5.62974 16.2196 6.29346C16.2196 7.13223 16.4031 7.51789 17.0003 8.11522C17.8889 9.00375 18.3332 9.448 18.3332 10.0001C18.3332 10.5521 17.8889 10.9964 17.0003 11.8849C16.403 12.4822 16.2196 12.8679 16.2196 13.7067C16.2196 14.3704 16.3483 15.3147 15.8253 15.8334Z" fill="white" />
          <path d="M15.8253 15.8334H15.8332M15.8253 15.8334C15.3063 16.348 14.3659 16.2198 13.7064 16.2198C12.8969 16.2198 12.5071 16.3782 11.9293 16.9559C11.4374 17.4479 10.7779 18.3334 9.99984 18.3334C9.22175 18.3334 8.56225 17.4479 8.07031 16.9559C7.49257 16.3782 7.10275 16.2198 6.29322 16.2198C5.63374 16.2198 4.69332 16.348 4.17441 15.8334C3.65135 15.3147 3.78007 14.3704 3.78007 13.7067C3.78007 12.8679 3.59664 12.4822 2.99932 11.8849C2.11079 10.9964 1.66652 10.5521 1.6665 10.0001C1.66651 9.448 2.11077 9.00375 2.9993 8.11522C3.5325 7.58201 3.78007 7.05365 3.78007 6.29346C3.78007 5.63396 3.65191 4.69353 4.1665 4.17461C4.6852 3.65156 5.6295 3.7803 6.29324 3.7803C7.0534 3.7803 7.58177 3.53275 8.11496 2.99956C9.0035 2.11101 9.44775 1.66675 9.99984 1.66675C10.5519 1.66675 10.9962 2.11101 11.8847 2.99956C12.4178 3.53264 12.9461 3.7803 13.7064 3.7803C14.3659 3.7803 15.3064 3.65214 15.8253 4.16675C16.3483 4.68544 16.2196 5.62974 16.2196 6.29346C16.2196 7.13223 16.4031 7.51789 17.0003 8.11522C17.8889 9.00375 18.3332 9.448 18.3332 10.0001C18.3332 10.5521 17.8889 10.9964 17.0003 11.8849C16.403 12.4822 16.2196 12.8679 16.2196 13.7067C16.2196 14.3704 16.3483 15.3147 15.8253 15.8334Z" stroke="white" />
          <path d="M7.5 10.7442C7.5 10.7442 8.5 11.2873 9 12.0834C9 12.0834 10.5 8.95841 12.5 7.91675" stroke="#141414" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>

      <span className="text-muted-foreground">{children}</span>
    </li>
  )
);

FeatureCardBenefitItem.displayName = "FeatureCardBenefitItem";

// FeatureCardAction - Button/CTA area
const FeatureCardAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("md:mt-[50px] mt-4", className)} {...props} />
  )
);
FeatureCardAction.displayName = "FeatureCardAction";

// FeatureCardImage - Image container with overlay support
interface FeatureCardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
}

const FeatureCardImage = React.forwardRef<HTMLDivElement, FeatureCardImageProps>(
  ({ className, src, alt, children, ...props }, ref) => {
    const { imagePosition } = React.useContext(FeatureCardContext);
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full flex-shrink-0 max-w-[494px] md:rounded-[20px] rounded-md",
          imagePosition === "left" ? "md:order-1" : "md:order-2",
          className
        )}
        style={{ aspectRatio: "494/496" }}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
        {children}
      </div>
    );
  }
);

FeatureCardImage.displayName = "FeatureCardImage";

// Overlay position variants
const overlayPositionVariants = cva(
  "absolute bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg",
  {
    variants: {
      position: {
        "top-right": "top-4 right-[-20%]",
        "top-left": "top-4 left-[-20%]",
        "bottom-right": "bottom-4 right-[-20%]",
        "bottom-left": "bottom-4 left-[-20%]",
      },
    },
    defaultVariants: {
      position: "top-right",
    },
  }
);

// FeatureCardOverlay - Overlay UI component
interface FeatureCardOverlayProps extends VariantProps<typeof overlayPositionVariants> {
  src?: string;
  alt?: string;
  animationData?: any;
  className?: string;
}

const FeatureCardOverlay = React.forwardRef<HTMLDivElement, FeatureCardOverlayProps>(
  ({ src, alt, animationData, position = "top-right", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(overlayPositionVariants({ position }), "p-0 bg-transparent border-0 backdrop-blur-0 shadow-none", className)}
        {...props}
      >
        {animationData ? (
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-full h-full object-contain"
          />
        ) : src ? (
          <img
            src={src}
            alt={alt || ""}
            className="w-full h-full object-contain"
          />
        ) : null}
      </div>
    );
  }
);
FeatureCardOverlay.displayName = "FeatureCardOverlay";

export {
  FeatureCard, FeatureCardAction, FeatureCardBadge, FeatureCardBenefitItem, FeatureCardBenefits, FeatureCardContent, FeatureCardDescription, FeatureCardImage,
  FeatureCardOverlay, FeatureCardTitle
};

