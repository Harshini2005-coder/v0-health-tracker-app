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
import { Pill, Plus, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TodaysMedicinesDialogProps {
  children: React.ReactNode
}

export function TodaysMedicinesDialog({ children }: TodaysMedicinesDialogProps) {
  const { user, addMedication, removeMedication } = useUser()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [medicinesTaken, setMedicinesTaken] = useState<string[]>([])

  const [newMedicine, setNewMedicine] = useState({
    name: "",
    dosage: "",
    frequency: "",
    instructions: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  })

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.dosage || !newMedicine.frequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const medicine = {
      id: Date.now().toString(),
      ...newMedicine,
    }

    addMedication(medicine)
    setNewMedicine({
      name: "",
      dosage: "",
      frequency: "",
      instructions: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    })
    setShowAddForm(false)
    toast({
      title: "Medicine Added",
      description: `${medicine.name} has been added to your medications`,
    })
  }

  const handleTakeMedicine = (medicineId: string, medicineName: string) => {
    setMedicinesTaken((prev) => [...prev, medicineId])
    toast({
      title: "Medicine Taken",
      description: `${medicineName} marked as taken`,
    })
  }

  const handleRemoveMedicine = (medicineId: string, medicineName: string) => {
    removeMedication(medicineId)
    toast({
      title: "Medicine Removed",
      description: `${medicineName} has been removed from your medications`,
    })
  }

  const todaysMedicines = user?.currentMedications || []
  const takenCount = medicinesTaken.length
  const totalCount = todaysMedicines.length

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-blue-600" />
            Today's Medicines
          </DialogTitle>
          <DialogDescription>Manage your daily medications and track your intake</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Today's Progress</h3>
                  <p className="text-sm text-gray-600">
                    {takenCount} of {totalCount} medicines taken
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0}%
                  </div>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Medicines */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Current Medications</h3>
              <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2" variant="outline">
                <Plus className="w-4 h-4" />
                Add Medicine
              </Button>
            </div>

            {/* Add Medicine Form */}
            {showAddForm && (
              <Card className="border-2 border-dashed border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Add New Medicine</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="medicine-name">Medicine Name *</Label>
                      <Input
                        id="medicine-name"
                        value={newMedicine.name}
                        onChange={(e) => setNewMedicine((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Aspirin"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dosage">Dosage *</Label>
                      <Input
                        id="dosage"
                        value={newMedicine.dosage}
                        onChange={(e) => setNewMedicine((prev) => ({ ...prev, dosage: e.target.value }))}
                        placeholder="e.g., 100mg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="frequency">Frequency *</Label>
                      <Select
                        value={newMedicine.frequency}
                        onValueChange={(value) => setNewMedicine((prev) => ({ ...prev, frequency: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Once daily">Once daily</SelectItem>
                          <SelectItem value="Twice daily">Twice daily</SelectItem>
                          <SelectItem value="Three times daily">Three times daily</SelectItem>
                          <SelectItem value="Four times daily">Four times daily</SelectItem>
                          <SelectItem value="As needed">As needed</SelectItem>
                          <SelectItem value="Weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={newMedicine.startDate}
                        onChange={(e) => setNewMedicine((prev) => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea
                      id="instructions"
                      value={newMedicine.instructions}
                      onChange={(e) => setNewMedicine((prev) => ({ ...prev, instructions: e.target.value }))}
                      placeholder="e.g., Take with food, avoid alcohol"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddMedicine} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Medicine
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Medicine List */}
            <div className="space-y-3">
              {todaysMedicines.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-8 text-center">
                    <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No medicines added yet</h3>
                    <p className="text-gray-500 mb-4">Add your first medicine to start tracking</p>
                    <Button onClick={() => setShowAddForm(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Medicine
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                todaysMedicines.map((medicine) => {
                  const isTaken = medicinesTaken.includes(medicine.id)
                  return (
                    <Card
                      key={medicine.id}
                      className={`transition-all ${isTaken ? "bg-green-50 border-green-200" : "bg-white"}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${isTaken ? "bg-green-500" : "bg-gray-300"}`} />
                              <div>
                                <h4
                                  className={`font-semibold ${isTaken ? "line-through text-gray-500" : "text-gray-900"}`}
                                >
                                  {medicine.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {medicine.dosage} • {medicine.frequency}
                                </p>
                                {medicine.instructions && (
                                  <p className="text-sm text-blue-600 mt-1">{medicine.instructions}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isTaken ? (
                              <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700">
                                <Check className="w-3 h-3" />
                                Taken
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleTakeMedicine(medicine.id, medicine.name)}
                                className="gap-2"
                              >
                                <Check className="w-4 h-4" />
                                Take
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveMedicine(medicine.id, medicine.name)}
                              className="gap-2 text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
