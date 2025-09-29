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
import { Users, Heart, Calendar, Plus, Bell } from "lucide-react"

interface FamilyCareDialogProps {
  children: React.ReactNode
}

export function FamilyCareDialog({ children }: FamilyCareDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("members")
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      relationship: "Spouse",
      age: 42,
      conditions: "Diabetes",
      medications: ["Metformin", "Insulin"],
      emergencyContact: true,
      lastCheckup: "2024-01-10",
    },
    {
      id: 2,
      name: "Robert Johnson",
      relationship: "Father",
      age: 68,
      conditions: "Hypertension, Arthritis",
      medications: ["Lisinopril", "Ibuprofen"],
      emergencyContact: false,
      lastCheckup: "2023-12-15",
    },
  ])

  const [newMember, setNewMember] = useState({
    name: "",
    relationship: "",
    age: "",
    conditions: "",
    medications: "",
    phone: "",
    emergencyContact: false,
  })

  const [careReminder, setCareReminder] = useState({
    memberId: "",
    type: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
  })

  const handleAddMember = () => {
    if (newMember.name && newMember.relationship) {
      const member = {
        id: Date.now(),
        name: newMember.name,
        relationship: newMember.relationship,
        age: Number.parseInt(newMember.age) || 0,
        conditions: newMember.conditions || "None",
        medications: newMember.medications ? newMember.medications.split(",").map((m) => m.trim()) : [],
        emergencyContact: newMember.emergencyContact,
        lastCheckup: "",
      }
      setFamilyMembers((prev) => [...prev, member])
      setNewMember({
        name: "",
        relationship: "",
        age: "",
        conditions: "",
        medications: "",
        phone: "",
        emergencyContact: false,
      })
    }
  }

  const handleSetReminder = () => {
    console.log("[v0] Care reminder set:", careReminder)
    alert("Care reminder has been set!")
    setCareReminder({
      memberId: "",
      type: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      time: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-600">
            <Users className="w-5 h-5" />
            Family Care Management
          </DialogTitle>
          <DialogDescription>Manage health information and care coordination for your family members</DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={activeTab === "members" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("members")}
            className="flex-1"
          >
            Family Members
          </Button>
          <Button
            variant={activeTab === "add" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("add")}
            className="flex-1"
          >
            Add Member
          </Button>
          <Button
            variant={activeTab === "reminders" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("reminders")}
            className="flex-1"
          >
            Care Reminders
          </Button>
        </div>

        <div className="space-y-6">
          {activeTab === "members" && (
            <div className="space-y-4">
              {familyMembers.map((member) => (
                <Card key={member.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {member.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{member.relationship}</Badge>
                        {member.emergencyContact && <Badge variant="destructive">Emergency Contact</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="font-medium">Age:</Label>
                        <p className="text-gray-600">{member.age} years old</p>
                      </div>
                      <div>
                        <Label className="font-medium">Last Checkup:</Label>
                        <p className="text-gray-600">{member.lastCheckup || "Not recorded"}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Conditions:</Label>
                        <p className="text-gray-600">{member.conditions}</p>
                      </div>
                      <div>
                        <Label className="font-medium">Medications:</Label>
                        <p className="text-gray-600">{member.medications.join(", ") || "None"}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Checkup
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="w-4 h-4 mr-2" />
                        Update Health Info
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "add" && (
            <Card>
              <CardHeader>
                <CardTitle>Add Family Member</CardTitle>
                <CardDescription>Add a family member to track their health information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="memberName">Full Name</Label>
                    <Input
                      id="memberName"
                      value={newMember.name}
                      onChange={(e) => setNewMember((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Select
                      value={newMember.relationship}
                      onValueChange={(value) => setNewMember((prev) => ({ ...prev, relationship: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="grandparent">Grandparent</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="memberAge">Age</Label>
                    <Input
                      id="memberAge"
                      type="number"
                      value={newMember.age}
                      onChange={(e) => setNewMember((prev) => ({ ...prev, age: e.target.value }))}
                      placeholder="Age in years"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memberPhone">Phone Number</Label>
                    <Input
                      id="memberPhone"
                      value={newMember.phone}
                      onChange={(e) => setNewMember((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memberConditions">Medical Conditions</Label>
                  <Input
                    id="memberConditions"
                    value={newMember.conditions}
                    onChange={(e) => setNewMember((prev) => ({ ...prev, conditions: e.target.value }))}
                    placeholder="List any medical conditions"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memberMedications">Current Medications</Label>
                  <Input
                    id="memberMedications"
                    value={newMember.medications}
                    onChange={(e) => setNewMember((prev) => ({ ...prev, medications: e.target.value }))}
                    placeholder="List current medications (comma separated)"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="emergencyContact"
                    checked={newMember.emergencyContact}
                    onChange={(e) => setNewMember((prev) => ({ ...prev, emergencyContact: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="emergencyContact" className="text-sm">
                    Set as emergency contact
                  </Label>
                </div>

                <Button onClick={handleAddMember} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Family Member
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "reminders" && (
            <Card>
              <CardHeader>
                <CardTitle>Set Care Reminder</CardTitle>
                <CardDescription>Create reminders for family member care tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminderMember">Family Member</Label>
                    <Select
                      value={careReminder.memberId}
                      onValueChange={(value) => setCareReminder((prev) => ({ ...prev, memberId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select family member" />
                      </SelectTrigger>
                      <SelectContent>
                        {familyMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id.toString()}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminderType">Reminder Type</Label>
                    <Select
                      value={careReminder.type}
                      onValueChange={(value) => setCareReminder((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medication">Medication</SelectItem>
                        <SelectItem value="appointment">Appointment</SelectItem>
                        <SelectItem value="checkup">Health Checkup</SelectItem>
                        <SelectItem value="exercise">Exercise</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminderDate">Date</Label>
                    <Input
                      id="reminderDate"
                      type="date"
                      value={careReminder.date}
                      onChange={(e) => setCareReminder((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminderTime">Time</Label>
                    <Input
                      id="reminderTime"
                      type="time"
                      value={careReminder.time}
                      onChange={(e) => setCareReminder((prev) => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminderDescription">Description</Label>
                  <Textarea
                    id="reminderDescription"
                    value={careReminder.description}
                    onChange={(e) => setCareReminder((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the care task or reminder"
                    rows={3}
                  />
                </div>

                <Button onClick={handleSetReminder} className="w-full">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Care Reminder
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
