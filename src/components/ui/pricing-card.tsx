import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  pricePeriod: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  isHighlighted?: boolean;
  backgroundImage?: string;
}

const PricingCard = React.forwardRef<HTMLDivElement, PricingCardProps>(
  (
    {
      title,
      description,
      price,
      pricePeriod,
      features,
      buttonText,
      buttonLink,
      isHighlighted = false,
      backgroundImage,
      ...props
    },
    ref
  ) => {
    return (
      <Card
        ref={ref}
        className="flex flex-col h-full relative overflow-hidden bg-card border-white/10"
        style={
          backgroundImage
            ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
            : undefined
        }
        {...props}
      >
        {backgroundImage && (
          <div className="absolute inset-0 z-0">
            <img src={backgroundImage} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative z-10 flex flex-col h-full">
          <CardHeader className="p-6">
            <CardTitle className="h2 mb-2">
              {title}
            </CardTitle>
            <CardDescription className="text-lg text-foreground max-w-[400px]">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-8">
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="h1">{price}</span>
                <span className="text-lg text-muted-foreground">
                  {pricePeriod}
                </span>
              </div>
            </div>
            <div className="h-px bg-white/10" />
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-foreground">
                What You Get
              </h4>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mt-0.5 flex-shrink-0"
                    >
                      <rect
                        x="0.5"
                        y="0.5"
                        width="23"
                        height="23"
                        rx="11.5"
                        stroke="white"
                        strokeOpacity="0.1"
                      />
                      <path
                        d="M14.6673 10L11.0007 13.6667L9.33398 12"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-lg text-white/80">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={isHighlighted ? "pricing" : "outline"}
              asChild
            >
              <Link to={buttonLink}>
                {buttonText}
              </Link>
            </Button>
          </CardFooter>
        </div>
      </Card>
    );
  }
);

PricingCard.displayName = "PricingCard";

export { PricingCard };

