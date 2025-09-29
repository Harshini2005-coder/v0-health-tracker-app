"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TextToSpeech } from "@/components/text-to-speech"
import { Calendar, Clock, MapPin, Phone, Video, User, MoreHorizontal, Edit, Trash2, Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Appointment {
  id: number
  doctor: string
  specialty: string
  date: string
  time: string
  type: "in-person" | "video"
  location: string
  phone: string
  notes: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
}

interface AppointmentCardProps {
  appointment: Appointment
  isPast?: boolean
}

export function AppointmentCard({ appointment, isPast = false }: AppointmentCardProps) {
  const { translate } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return translate("common.today")
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return translate("common.tomorrow")
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isPast ? "opacity-75" : ""}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                <TextToSpeech text={appointment.doctor} />
              </div>
              <p className="text-sm text-gray-600 mb-2">{appointment.specialty}</p>
              <Badge className={getStatusColor(appointment.status)} variant="secondary">
                {appointment.status}
              </Badge>
            </div>
          </div>

          {!isPast && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  {translate("common.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="h-4 w-4 mr-2" />
                  Set Reminder
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {translate("common.cancel")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{appointment.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {appointment.type === "video" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
            <span>{appointment.location}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{appointment.notes}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{appointment.phone}</span>
          </div>

          {!isPast && (
            <div className="flex gap-2">
              {appointment.type === "video" && (
                <Button size="sm" className="gap-2">
                  <Video className="h-4 w-4" />
                  Join Call
                </Button>
              )}
              <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                <Phone className="h-4 w-4" />
                Call
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
