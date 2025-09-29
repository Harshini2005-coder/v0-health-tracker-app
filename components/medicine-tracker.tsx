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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/contexts/user-context"
import { Pill, Clock, CheckCircle, AlertCircle, Calendar, Plus } from "lucide-react"
import { toast } from "sonner"

interface MedicineTrackerProps {
  children: React.ReactNode
}

interface MedicineTaken {
  medicineId: string
  date: string
  time: string
  taken: boolean
}

export function MedicineTracker({ children }: MedicineTrackerProps) {
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [takenMedicines, setTakenMedicines] = useState<MedicineTaken[]>([])

  const today = new Date().toISOString().split("T")[0]
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  })

  const markMedicineTaken = (medicineId: string, taken: boolean) => {
    const existingIndex = takenMedicines.findIndex((med) => med.medicineId === medicineId && med.date === today)

    if (existingIndex >= 0) {
      const updated = [...takenMedicines]
      updated[existingIndex] = { ...updated[existingIndex], taken, time: currentTime }
      setTakenMedicines(updated)
    } else {
      setTakenMedicines([...takenMedicines, { medicineId, date: today, time: currentTime, taken }])
    }

    const medicine = user?.currentMedications.find((med) => med.id === medicineId)
    if (taken) {
      toast.success(`✅ Marked ${medicine?.name} as taken`)
    } else {
      toast.info(`Unmarked ${medicine?.name}`)
    }
  }

  const isMedicineTaken = (medicineId: string) => {
    return takenMedicines.some((med) => med.medicineId === medicineId && med.date === today && med.taken)
  }

  const getTakenCount = () => {
    return takenMedicines.filter((med) => med.date === today && med.taken).length
  }

  const totalMedicines = user?.currentMedications.length || 0
  const takenCount = getTakenCount()
  const adherencePercentage = totalMedicines > 0 ? (takenCount / totalMedicines) * 100 : 0

  const getTimeBasedRecommendation = () => {
    const hour = new Date().getHours()
    if (hour < 9) return "Morning medications"
    if (hour < 14) return "Afternoon medications"
    if (hour < 20) return "Evening medications"
    return "Night medications"
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-green-600" />
            Medicine Tracker
          </DialogTitle>
          <DialogDescription>Track your daily medication adherence and manage your prescriptions</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Today's Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Adherence</CardTitle>
              <CardDescription>
                {takenCount} of {totalMedicines} medications taken
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  {takenCount}/{totalMedicines}
                </span>
                <Badge variant={adherencePercentage >= 100 ? "default" : "secondary"}>
                  {Math.round(adherencePercentage)}%
                </Badge>
              </div>
              <Progress value={adherencePercentage} className="h-3" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                {getTimeBasedRecommendation()}
              </div>
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Medications</CardTitle>
              <CardDescription>Mark medications as taken throughout the day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.currentMedications.map((medicine) => {
                const taken = isMedicineTaken(medicine.id)
                return (
                  <div
                    key={medicine.id}
                    className={`p-4 rounded-lg border transition-all ${
                      taken ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${taken ? "bg-green-500" : "bg-gray-300"}`} />
                          <div>
                            <h4 className="font-semibold text-gray-900">{medicine.name}</h4>
                            <p className="text-sm text-gray-600">
                              {medicine.dosage} • {medicine.frequency}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{medicine.instructions}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {taken ? (
                          <Button
                            onClick={() => markMedicineTaken(medicine.id, false)}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Taken
                          </Button>
                        ) : (
                          <Button onClick={() => markMedicineTaken(medicine.id, true)} size="sm" className="gap-2">
                            <Pill className="w-4 h-4" />
                            Mark Taken
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {(!user?.currentMedications || user.currentMedications.length === 0) && (
                <div className="text-center py-8">
                  <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">No medications added yet</p>
                  <p className="text-sm text-gray-400 mb-4">Add your medications to start tracking</p>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Plus className="w-4 h-4" />
                    Add Medication
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medication Reminders */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Medication Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 space-y-2">
              <p>• Take medications at the same time each day</p>
              <p>• Set phone alarms for medication times</p>
              <p>• Keep medications in a visible location</p>
              <p>• Use a pill organizer for weekly planning</p>
              <p>• Never skip doses without consulting your doctor</p>
            </CardContent>
          </Card>

          {/* Weekly Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                This Week's Adherence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }, (_, i) => {
                  const date = new Date()
                  date.setDate(date.getDate() - (6 - i))
                  const dateStr = date.toISOString().split("T")[0]
                  const dayTaken = takenMedicines.filter((med) => med.date === dateStr && med.taken).length
                  const isToday = dateStr === today

                  return (
                    <div
                      key={i}
                      className={`p-2 text-center rounded-lg text-xs ${
                        isToday ? "bg-blue-100 border-2 border-blue-300" : "bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {dayTaken}/{totalMedicines}
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full mx-auto mt-1 ${
                          dayTaken === totalMedicines && totalMedicines > 0
                            ? "bg-green-500"
                            : dayTaken > 0
                              ? "bg-yellow-500"
                              : "bg-gray-300"
                        }`}
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
