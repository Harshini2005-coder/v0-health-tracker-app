"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/contexts/user-context"
import { Calendar, Plus, Clock, Stethoscope } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UpcomingAppointmentsDialogProps {
  children: React.ReactNode
}

export function UpcomingAppointmentsDialog({ children }: UpcomingAppointmentsDialogProps) {
  const { user, addAppointment } = useUser()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  const [newAppointment, setNewAppointment] = useState({
    doctorName: "",
    specialty: "",
    date: "",
    time: "",
    type: "",
    notes: "",
  })

  const handleAddAppointment = () => {
    if (!newAppointment.doctorName || !newAppointment.specialty || !newAppointment.date || !newAppointment.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const appointment = {
      id: Date.now().toString(),
      ...newAppointment,
      status: "scheduled",
    }

    addAppointment(appointment)
    setNewAppointment({
      doctorName: "",
      specialty: "",
      date: "",
      time: "",
      type: "",
      notes: "",
    })
    setShowAddForm(false)
    toast({
      title: "Appointment Scheduled",
      description: `Appointment with ${appointment.doctorName} has been added`,
    })
  }

  const appointments = user?.appointments || []
  const upcomingAppointments = appointments.filter((apt) => new Date(apt.date) >= new Date())
  const pastAppointments = appointments.filter((apt) => new Date(apt.date) < new Date())

  const specialties = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Neurologist",
    "Orthopedist",
    "Pediatrician",
    "Psychiatrist",
    "Pulmonologist",
    "Urologist",
    "Ophthalmologist",
    "ENT Specialist",
    "Gynecologist",
    "Dentist",
  ]

  const appointmentTypes = [
    "Consultation",
    "Follow-up",
    "Check-up",
    "Procedure",
    "Test Results",
    "Emergency",
    "Vaccination",
    "Screening",
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      case "completed":
        return "bg-green-100 text-green-700"
      case "cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Upcoming Appointments
          </DialogTitle>
          <DialogDescription>Manage your scheduled doctor visits and medical appointments</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{upcomingAppointments.length}</div>
                <p className="text-sm text-blue-700">Upcoming</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-50 to-green-100">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{pastAppointments.length}</div>
                <p className="text-sm text-green-700">Completed</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{appointments.length}</div>
                <p className="text-sm text-purple-700">Total</p>
              </CardContent>
            </Card>
          </div>

          {/* Add Appointment Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Manage Appointments</h3>
            <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
              <Plus className="w-4 h-4" />
              Schedule Appointment
            </Button>
          </div>

          {/* Add Appointment Form */}
          {showAddForm && (
            <Card className="border-2 border-dashed border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">Schedule New Appointment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="doctor-name">Doctor Name *</Label>
                    <Input
                      id="doctor-name"
                      value={newAppointment.doctorName}
                      onChange={(e) => setNewAppointment((prev) => ({ ...prev, doctorName: e.target.value }))}
                      placeholder="e.g., Dr. Sarah Johnson"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specialty">Specialty *</Label>
                    <Select
                      value={newAppointment.specialty}
                      onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, specialty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="appointment-date">Date *</Label>
                    <Input
                      id="appointment-date"
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment((prev) => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="appointment-time">Time *</Label>
                    <Input
                      id="appointment-time"
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment((prev) => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="appointment-type">Type</Label>
                    <Select
                      value={newAppointment.type}
                      onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="appointment-notes">Notes</Label>
                  <Textarea
                    id="appointment-notes"
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special instructions or notes..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddAppointment} className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Schedule Appointment
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Appointments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
            {upcomingAppointments.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No upcoming appointments</h3>
                  <p className="text-gray-500 mb-4">Schedule your next appointment to stay on top of your health</p>
                  <Button onClick={() => setShowAddForm(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Schedule Appointment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Stethoscope className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{appointment.doctorName}</h4>
                              <p className="text-sm text-gray-600">{appointment.specialty}</p>
                            </div>
                          </div>
                          <div className="ml-13 space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-blue-600">
                                {formatDate(appointment.date)} at {appointment.time}
                              </span>
                            </div>
                            {appointment.type && (
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{appointment.type}</span>
                              </div>
                            )}
                            {appointment.notes && <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Past Appointments</h3>
              <div className="space-y-3">
                {pastAppointments.slice(-3).map((appointment) => (
                  <Card key={appointment.id} className="opacity-75">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-700">{appointment.doctorName}</h4>
                          <p className="text-sm text-gray-500">{appointment.specialty}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(appointment.date)} at {appointment.time}
                          </p>
                        </div>
                        <Badge className="bg-gray-100 text-gray-600">Completed</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
