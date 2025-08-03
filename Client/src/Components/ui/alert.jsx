"use client";

import React from "react";
import { X } from "lucide-react";

// Base alert class
const baseAlertClasses =
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";

// Variant class map
const variantClassMap = {
  default: "bg-background text-foreground",
  destructive:
  "border-red-500 bg-red-100 text-red-700 dark:border-red-500 dark:bg-red-950 dark:text-red-400 [&>svg]:text-red-700 dark:[&>svg]:text-red-400",
  success:
    "border-green-500/50 text-green-700 bg-green-50 dark:border-green-500 dark:bg-green-950 dark:text-green-400 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
  warning:
    "border-yellow-500/50 text-yellow-700 bg-yellow-50 dark:border-yellow-500 dark:bg-yellow-950 dark:text-yellow-400 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
  info:
    "border-blue-500/50 text-blue-700 bg-blue-50 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-400 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
};

function getAlertClassName(variant = "default", dismissible, className = "") {
  const variantClasses = variantClassMap[variant] || variantClassMap.default;
  const paddingRight = dismissible ? "pr-10" : "";
  return `${baseAlertClasses} ${variantClasses} ${paddingRight} ${className}`.trim();
}

const Alert = React.forwardRef(function Alert(
  { className = "", variant = "default", dismissible = false, onDismiss, children, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      role="alert"
      className={getAlertClassName(variant, dismissible, className)}
      {...props}
    >
      {children}
      {dismissible && (
        <button
          onClick={onDismiss}
          className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});

const AlertTitle = React.forwardRef(function AlertTitle(
  { className = "", ...props },
  ref
) {
  return (
    <h5
      ref={ref}
      className={`mb-1 font-medium leading-none tracking-tight ${className}`.trim()}
      {...props}
    />
  );
});

const AlertDescription = React.forwardRef(function AlertDescription(
  { className = "", ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`text-sm [&_p]:leading-relaxed ${className}`.trim()}
      {...props}
    />
  );
});

Alert.displayName = "Alert";
AlertTitle.displayName = "AlertTitle";
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
