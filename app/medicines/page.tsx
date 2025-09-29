"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Pill, Clock, Plus, Calendar, Bell, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { AddMedicineDialog } from "@/components/add-medicine-dialog"
import { MedicineCard } from "@/components/medicine-card"
import { MedicineHistory } from "@/components/medicine-history"

interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  startDate: string
  endDate?: string
  instructions: string
  color: string
  taken: boolean[]
  totalDoses: number
  takenDoses: number
}

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: "1",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      times: ["08:00"],
      startDate: "2024-01-01",
      instructions: "Take with food",
      color: "blue",
      taken: [true, true, false, false],
      totalDoses: 30,
      takenDoses: 25,
    },
    {
      id: "2",
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      times: ["08:00", "20:00"],
      startDate: "2024-01-01",
      instructions: "Take with meals",
      color: "green",
      taken: [true, false, false, true],
      totalDoses: 60,
      takenDoses: 48,
    },
    {
      id: "3",
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      times: ["08:00"],
      startDate: "2024-01-01",
      instructions: "Take with breakfast",
      color: "orange",
      taken: [false, false, false, false],
      totalDoses: 30,
      takenDoses: 22,
    },
  ])

  const [showAddDialog, setShowAddDialog] = useState(false)

  const todaysMedicines = medicines.filter((med) => {
    const today = new Date().toDateString()
    return med.times.some((time) => {
      const medicineTime = new Date(`${today} ${time}`)
      return medicineTime <= new Date()
    })
  })

  const upcomingMedicines = medicines.filter((med) => {
    const today = new Date().toDateString()
    return med.times.some((time) => {
      const medicineTime = new Date(`${today} ${time}`)
      return medicineTime > new Date()
    })
  })

  const completionRate = Math.round(
    (medicines.reduce((acc, med) => acc + med.takenDoses, 0) /
      medicines.reduce((acc, med) => acc + med.totalDoses, 0)) *
      100,
  )

  const handleAddMedicine = (newMedicine: Omit<Medicine, "id" | "taken" | "takenDoses">) => {
    const medicine: Medicine = {
      ...newMedicine,
      id: Date.now().toString(),
      taken: [],
      takenDoses: 0,
    }
    setMedicines([...medicines, medicine])
    setShowAddDialog(false)
  }

  const handleTakeMedicine = (medicineId: string) => {
    setMedicines(medicines.map((med) => (med.id === medicineId ? { ...med, takenDoses: med.takenDoses + 1 } : med)))
  }

  const handleDeleteMedicine = (medicineId: string) => {
    setMedicines(medicines.filter((med) => med.id !== medicineId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Bell className="w-4 h-4" />
                Reminders
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-blue-500 to-green-500">
                    <Plus className="w-4 h-4" />
                    Add Medicine
                  </Button>
                </DialogTrigger>
                <AddMedicineDialog onAdd={handleAddMedicine} />
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medicine Tracker</h1>
          <p className="text-gray-600">Manage your medications and stay on track with your health</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Medicines</CardTitle>
              <Pill className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{medicines.length}</div>
              <p className="text-xs text-blue-600">Active prescriptions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Today's Doses</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {medicines.reduce((acc, med) => acc + med.times.length, 0)}
              </div>
              <p className="text-xs text-green-600">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Completion Rate</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{completionRate}%</div>
              <p className="text-xs text-orange-600 mb-2">This month</p>
              <Progress value={completionRate} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Missed Doses</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">
                {medicines.reduce((acc, med) => acc + (med.totalDoses - med.takenDoses), 0)}
              </div>
              <p className="text-xs text-red-600">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="all">All Medicines</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>Medicines you need to take today</CardDescription>
              </CardHeader>
              <CardContent>
                {todaysMedicines.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">All done for today! Great job staying on track.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {todaysMedicines.map((medicine) => (
                      <MedicineCard
                        key={medicine.id}
                        medicine={medicine}
                        onTake={() => handleTakeMedicine(medicine.id)}
                        onDelete={() => handleDeleteMedicine(medicine.id)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  onTake={() => handleTakeMedicine(medicine.id)}
                  onDelete={() => handleDeleteMedicine(medicine.id)}
                  showFullDetails
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-600" />
                  Upcoming Doses
                </CardTitle>
                <CardDescription>Medicines scheduled for later today</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingMedicines.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No upcoming doses scheduled for today.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingMedicines.map((medicine) => (
                      <div key={medicine.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-${medicine.color}-500`} />
                          <div>
                            <p className="font-medium text-gray-900">{medicine.name}</p>
                            <p className="text-sm text-gray-600">{medicine.dosage}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{medicine.times.join(", ")}</p>
                          <p className="text-xs text-gray-600">{medicine.frequency}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <MedicineHistory medicines={medicines} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
