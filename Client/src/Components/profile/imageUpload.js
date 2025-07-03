"use client"

import React, { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, X, User } from "lucide-react"

export function ImageUpload({ currentImage, onImageChange, className }) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [previewUrl, setPreviewUrl] = useState(currentImage || null)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    setError("")
    setIsUploading(true)

    try {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      await new Promise((resolve) => setTimeout(resolve, 1500))

      onImageChange(url)
    } catch (err) {
      setError("Failed to upload image. Please try again.")
      setPreviewUrl(currentImage || null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className || ""}`}>
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
          <AvatarImage src={previewUrl || undefined} alt="Profile picture" />
          <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>

        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={triggerFileSelect}
        >
          <Camera className="h-8 w-8 text-white" />
        </div>

        {previewUrl && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center space-y-2">
        <Button
          variant="outline"
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? "Uploading..." : previewUrl ? "Change Photo" : "Upload Photo"}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          JPG, PNG or GIF. Max size 5MB.
          <br />
          Recommended: 400x400px
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="w-full max-w-sm">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload profile picture"
      />
    </div>
  )
}
