"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Phone, Calendar, Shield, Heart, MessageCircle } from "lucide-react"

interface Doctor {
  id: number
  name: string
  specialty: string
  rating: number
  experience: string
  location: string
  phone: string
  image: string
  nextAvailable: string
  acceptsInsurance: boolean
}

interface DoctorCardProps {
  doctor: Doctor
  onSchedule?: (doctorId: number) => void
}

export function DoctorCard({ doctor, onSchedule }: DoctorCardProps) {
  const { translate } = useLanguage()
  const [isFavorite, setIsFavorite] = useState(true)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
              <AvatarFallback>
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{doctor.rating}</span>
                <span className="text-sm text-gray-500">({doctor.experience})</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className="text-red-500 hover:text-red-600"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{doctor.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{doctor.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Next available: {formatDate(doctor.nextAvailable)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {doctor.acceptsInsurance && (
            <Badge variant="secondary" className="gap-1">
              <Shield className="h-3 w-3" />
              Insurance
            </Badge>
          )}
          <Badge variant="outline">{doctor.experience} experience</Badge>
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1 gap-2" onClick={() => onSchedule?.(doctor.id)}>
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <MessageCircle className="h-4 w-4" />
            Message
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Phone className="h-4 w-4" />
            Call
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
