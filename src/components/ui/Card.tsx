
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "rounded-2xl overflow-hidden transition-all",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground shadow-sm",
        glass: "glass-panel",
        outline: "border border-border bg-transparent",
        elevated: "bg-card text-card-foreground shadow-lg hover:shadow-xl transition-shadow duration-300",
      },
      animation: {
        none: "",
        fadeIn: "animate-fade-in",
        slideUp: "animate-slide-up",
        scale: "animate-scale-up",
        blur: "animate-blur-in",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1 hover:shadow-md transition-all duration-300",
        glow: "hover:shadow-[0_0_15px_rgba(0,255,0,0.15)] transition-shadow duration-300",
      }
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
      hover: "none",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({ className, variant, animation, hover, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant, animation, hover }), className)}
    style={{
      ...style,
    }}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
