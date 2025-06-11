"use client";

import React from "react";

export function Textarea({ className = "", ...props }, ref) {
  const baseClass =
    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <textarea
      className={`${baseClass} ${className}`}
      ref={ref}
      {...props}
    />
  );
}

Textarea.displayName = "Textarea";
export const ForwardedTextarea = React.forwardRef(Textarea);
