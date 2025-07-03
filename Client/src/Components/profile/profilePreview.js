"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, User } from "lucide-react"

export function ProfilePreview({ profile }) {
  const getInitials = (firstName, lastName) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={profile.profileImage || undefined} alt="Profile picture" />
            <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {profile.firstName && profile.lastName ? (
                getInitials(profile.firstName, profile.lastName)
              ) : (
                <User className="h-8 w-8" />
              )}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-gray-500">{profile.email}</p>
          </div>

          {profile.bio && <p className="text-sm text-gray-600 max-w-sm">{profile.bio}</p>}

          <div className="flex flex-wrap gap-2 justify-center">
            {profile.phone && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {profile.phone}
              </Badge>
            )}
            {profile.location && (
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {profile.location}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
