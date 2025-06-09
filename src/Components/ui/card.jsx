import React, { forwardRef } from "react";

const Card = forwardRef(({ className = "", ...props }, ref) => {
  const baseClasses = "rounded-xl border bg-card text-card-foreground shadow";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return <div ref={ref} className={combinedClasses} {...props} />;
});
Card.displayName = "Card";

const CardHeader = forwardRef(({ className = "", ...props }, ref) => {
  const baseClasses = "flex flex-col space-y-1.5 p-6";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return <div ref={ref} className={combinedClasses} {...props} />;
});
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className = "", ...props }, ref) => {
  const baseClasses = "font-semibold leading-none tracking-tight";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return <h3 ref={ref} className={combinedClasses} {...props} />;
});
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className = "", ...props }, ref) => {
  const baseClasses = "text-sm text-muted-foreground";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return <p ref={ref} className={combinedClasses} {...props} />;
});
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(({ className = "", ...props }, ref) => {
  const baseClasses = "p-6 pt-0";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return <div ref={ref} className={combinedClasses} {...props} />;
});
CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className = "", ...props }, ref) => {
  const baseClasses = "flex items-center p-6 pt-0";
  const combinedClasses = `${baseClasses} ${className}`.trim();

  return <div ref={ref} className={combinedClasses} {...props} />;
});
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
