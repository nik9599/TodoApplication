"use client";

import React from "react";

// Base class for all badges
const baseBadgeClasses =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

// Variant class mappings
const badgeVariantClasses = {
  default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
  outline: "text-foreground",
};

function Badge({ className = "", variant = "default", ...props }) {
  const variantClass = badgeVariantClasses[variant] || badgeVariantClasses.default;
  const combinedClasses = `${baseBadgeClasses} ${variantClass} ${className}`.trim();

  return <div className={combinedClasses} {...props} />;
}

export { Badge };
