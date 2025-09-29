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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Baby, Heart, Plus } from "lucide-react"

interface ChildSupportDialogProps {
  childrenDialogTrigger: React.ReactNode
}

export function ChildSupportDialog({ childrenDialogTrigger }: ChildSupportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [childList, setChildList] = useState([
    {
      id: 1,
      name: "Emma Johnson",
      age: 8,
      allergies: "Peanuts, Dairy",
      medications: ["Children's Tylenol"],
      lastCheckup: "2024-01-15",
      nextAppointment: "2024-03-15",
    },
    {
      id: 2,
      name: "Liam Johnson",
      age: 5,
      allergies: "None",
      medications: ["Vitamin D"],
      lastCheckup: "2024-01-20",
      nextAppointment: "2024-03-20",
    },
  ])

  const [newChild, setNewChild] = useState({
    name: "",
    age: "",
    allergies: "",
    medications: "",
    pediatrician: "",
  })

  const [healthLog, setHealthLog] = useState({
    childId: "",
    date: new Date().toISOString().split("T")[0],
    temperature: "",
    symptoms: "",
    medication: "",
    notes: "",
  })

  const handleAddChild = () => {
    if (newChild.name && newChild.age) {
      const child = {
        id: Date.now(),
        name: newChild.name,
        age: Number.parseInt(newChild.age),
        allergies: newChild.allergies || "None",
        medications: newChild.medications ? newChild.medications.split(",").map((m) => m.trim()) : [],
        lastCheckup: "",
        nextAppointment: "",
      }
      setChildList((prev) => [...prev, child])
      setNewChild({ name: "", age: "", allergies: "", medications: "", pediatrician: "" })
    }
  }

  const handleLogHealth = () => {
    console.log("[v0] Health log entry:", healthLog)
    alert("Health log entry saved!")
    setHealthLog({
      childId: "",
      date: new Date().toISOString().split("T")[0],
      temperature: "",
      symptoms: "",
      medication: "",
      notes: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{childrenDialogTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-pink-600">
            <Baby className="w-5 h-5" />
            Child Health Support
          </DialogTitle>
          <DialogDescription>Manage your children's health information and track their wellbeing</DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
            className="flex-1"
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "add" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("add")}
            className="flex-1"
          >
            Add Child
          </Button>
          <Button
            variant={activeTab === "log" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("log")}
            className="flex-1"
          >
            Health Log
          </Button>
        </div>

        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-4">
              {childList.map((child) => (
                <Card key={child.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Baby className="w-5 h-5" />
                        {child.name}
                      </CardTitle>
                      <Badge variant="secondary">{child.age} years old</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="font-medium">Allergies:</Label>
                        <p className="text-gray-600">{child.allergies}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Medications:</Label>
                        <p className="text-gray-600">{child.medications.join(", ") || "None"}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Last Checkup:</Label>
                        <p className="text-gray-600">{child.lastCheckup || "Not recorded"}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Next Appointment:</Label>
                        <p className="text-gray-600">{child.nextAppointment || "Not scheduled"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "add" && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Child</CardTitle>
                <CardDescription>Enter your child's basic health information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="childName">Child's Name</Label>
                    <Input
                      id="childName"
                      value={newChild.name}
                      onChange={(e) => setNewChild((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter child's full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="childAge">Age</Label>
                    <Input
                      id="childAge"
                      type="number"
                      value={newChild.age}
                      onChange={(e) => setNewChild((prev) => ({ ...prev, age: e.target.value }))}
                      placeholder="Age in years"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="childAllergies">Known Allergies</Label>
                  <Input
                    id="childAllergies"
                    value={newChild.allergies}
                    onChange={(e) => setNewChild((prev) => ({ ...prev, allergies: e.target.value }))}
                    placeholder="List any known allergies (comma separated)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="childMedications">Current Medications</Label>
                  <Input
                    id="childMedications"
                    value={newChild.medications}
                    onChange={(e) => setNewChild((prev) => ({ ...prev, medications: e.target.value }))}
                    placeholder="List current medications (comma separated)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pediatrician">Pediatrician</Label>
                  <Input
                    id="pediatrician"
                    value={newChild.pediatrician}
                    onChange={(e) => setNewChild((prev) => ({ ...prev, pediatrician: e.target.value }))}
                    placeholder="Pediatrician name and contact"
                  />
                </div>

                <Button onClick={handleAddChild} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Child
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "log" && (
            <Card>
              <CardHeader>
                <CardTitle>Health Log Entry</CardTitle>
                <CardDescription>Record health information for your child</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logChild">Select Child</Label>
                    <Select
                      value={healthLog.childId}
                      onValueChange={(value) => setHealthLog((prev) => ({ ...prev, childId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a child" />
                      </SelectTrigger>
                      <SelectContent>
                        {childList.map((child) => (
                          <SelectItem key={child.id} value={child.id.toString()}>
                            {child.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logDate">Date</Label>
                    <Input
                      id="logDate"
                      type="date"
                      value={healthLog.date}
                      onChange={(e) => setHealthLog((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°F)</Label>
                    <Input
                      id="temperature"
                      value={healthLog.temperature}
                      onChange={(e) => setHealthLog((prev) => ({ ...prev, temperature: e.target.value }))}
                      placeholder="98.6"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication Given</Label>
                    <Input
                      id="medication"
                      value={healthLog.medication}
                      onChange={(e) => setHealthLog((prev) => ({ ...prev, medication: e.target.value }))}
                      placeholder="Medication name and dosage"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    value={healthLog.symptoms}
                    onChange={(e) => setHealthLog((prev) => ({ ...prev, symptoms: e.target.value }))}
                    placeholder="Describe any symptoms observed"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={healthLog.notes}
                    onChange={(e) => setHealthLog((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional observations or notes"
                    rows={2}
                  />
                </div>

                <Button onClick={handleLogHealth} className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Save Health Log Entry
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
