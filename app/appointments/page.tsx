"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TextToSpeech } from "@/components/text-to-speech"
import { ScheduleAppointmentDialog } from "@/components/schedule-appointment-dialog"
import { AppointmentCard } from "@/components/appointment-card"
import { DoctorCard } from "@/components/doctor-card"
import { Calendar, Clock, Plus, Filter, Video, Stethoscope } from "lucide-react"

export default function AppointmentsPage() {
  const { translate } = useLanguage()
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("all")

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2024-01-15",
      time: "10:30 AM",
      type: "in-person",
      location: "Heart Care Center, Room 205",
      phone: "+1 (555) 123-4567",
      notes: "Follow-up for blood pressure monitoring",
      status: "confirmed",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "General Physician",
      date: "2024-01-18",
      time: "2:15 PM",
      type: "video",
      location: "Video Call",
      phone: "+1 (555) 987-6543",
      notes: "Annual health checkup",
      status: "pending",
    },
    {
      id: 3,
      doctor: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      date: "2024-01-22",
      time: "11:00 AM",
      type: "in-person",
      location: "Skin Health Clinic, Floor 3",
      phone: "+1 (555) 456-7890",
      notes: "Skin examination and mole check",
      status: "confirmed",
    },
  ]

  const pastAppointments = [
    {
      id: 4,
      doctor: "Dr. James Wilson",
      specialty: "Orthopedist",
      date: "2024-01-08",
      time: "9:00 AM",
      type: "in-person",
      location: "Bone & Joint Center",
      phone: "+1 (555) 321-0987",
      notes: "Knee pain consultation",
      status: "completed",
    },
    {
      id: 5,
      doctor: "Dr. Lisa Park",
      specialty: "Ophthalmologist",
      date: "2024-01-05",
      time: "3:30 PM",
      type: "in-person",
      location: "Eye Care Institute",
      phone: "+1 (555) 654-3210",
      notes: "Annual eye exam",
      status: "completed",
    },
  ]

  const favoritesDoctors = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.9,
      experience: "15 years",
      location: "Heart Care Center",
      phone: "+1 (555) 123-4567",
      image: "/doctor-portrait.png",
      nextAvailable: "2024-01-20",
      acceptsInsurance: true,
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialty: "General Physician",
      rating: 4.8,
      experience: "12 years",
      location: "Family Health Clinic",
      phone: "+1 (555) 987-6543",
      image: "/doctor-portrait-asian.jpg",
      nextAvailable: "2024-01-16",
      acceptsInsurance: true,
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Dermatologist",
      rating: 4.7,
      experience: "10 years",
      location: "Skin Health Clinic",
      phone: "+1 (555) 456-7890",
      image: "/doctor-portrait-female.jpg",
      nextAvailable: "2024-01-25",
      acceptsInsurance: false,
    },
  ]

  const filteredAppointments = upcomingAppointments.filter((apt) => {
    if (selectedFilter === "all") return true
    if (selectedFilter === "today") {
      const today = new Date().toISOString().split("T")[0]
      return apt.date === today
    }
    if (selectedFilter === "video") return apt.type === "video"
    if (selectedFilter === "in-person") return apt.type === "in-person"
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {translate("nav.appointments")}
                  <TextToSpeech text={translate("nav.appointments")} />
                </h1>
                <p className="text-sm text-gray-600">Manage your healthcare appointments</p>
              </div>
            </div>
            <Button
              onClick={() => setShowScheduleDialog(true)}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 gap-2"
            >
              <Plus className="w-4 h-4" />
              {translate("dashboard.scheduleAppointment")}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-900">{upcomingAppointments.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">This Month</p>
                  <p className="text-2xl font-bold text-green-900">8</p>
                </div>
                <Clock className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Video Calls</p>
                  <p className="text-2xl font-bold text-purple-900">2</p>
                </div>
                <Video className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Doctors</p>
                  <p className="text-2xl font-bold text-orange-900">{favoritesDoctors.length}</p>
                </div>
                <Stethoscope className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="doctors">My Doctors</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>
              {["all", "today", "video", "in-person"].map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                  className="capitalize"
                >
                  {filter === "all" ? "All" : filter === "in-person" ? "In-Person" : filter}
                </Button>
              ))}
            </div>

            {/* Upcoming Appointments */}
            <div className="grid gap-6">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>

            {filteredAppointments.length === 0 && (
              <Card className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or schedule a new appointment</p>
                <Button onClick={() => setShowScheduleDialog(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Schedule Appointment
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="grid gap-6">
              {pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} isPast />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="doctors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritesDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <ScheduleAppointmentDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        doctors={favoritesDoctors}
      />
    </div>
  )
}
