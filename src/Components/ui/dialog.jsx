"use client";

import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(function DialogOverlay({ className = "", ...props }, ref) {
  const overlayClasses =
    "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0";
  return (
    <DialogPrimitive.Overlay ref={ref} className={`${overlayClasses} ${className}`} {...props} />
  );
});
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(function DialogContent({ className = "", children, ...props }, ref) {
  const contentClasses =
    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg";
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref} className={`${contentClasses} ${className}`} {...props}>
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className = "", ...props }) => {
  const headerClasses = "flex flex-col space-y-1.5 text-center sm:text-left";
  return <div className={`${headerClasses} ${className}`} {...props} />;
};
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className = "", ...props }) => {
  const footerClasses = "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2";
  return <div className={`${footerClasses} ${className}`} {...props} />;
};
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(function DialogTitle({ className = "", ...props }, ref) {
  const titleClasses = "text-lg font-semibold leading-none tracking-tight";
  return (
    <DialogPrimitive.Title ref={ref} className={`${titleClasses} ${className}`} {...props} />
  );
});
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(function DialogDescription({ className = "", ...props }, ref) {
  const descriptionClasses = "text-sm text-muted-foreground";
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={`${descriptionClasses} ${className}`}
      {...props}
    />
  );
});
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
