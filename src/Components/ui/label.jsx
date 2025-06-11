"use client";

import React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

// Default label styling
const baseLabelClasses =
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

const Label = React.forwardRef(function Label(
  { className = "", ...props },
  ref
) {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={`${baseLabelClasses} ${className}`.trim()}
      {...props}
    />
  );
});

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
