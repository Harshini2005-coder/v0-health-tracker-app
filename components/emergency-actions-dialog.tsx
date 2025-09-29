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
import { AlertTriangle, Phone } from "lucide-react"

interface EmergencyActionsDialogProps {
  children: React.ReactNode
}

export function EmergencyActionsDialog({ children }: EmergencyActionsDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [emergencyData, setEmergencyData] = useState({
    primaryContact: "",
    secondaryContact: "",
    medicalConditions: "",
    allergies: "",
    currentLocation: "",
    symptoms: "",
  })

  const emergencyContacts = [
    { name: "Emergency Services", number: "911", type: "emergency" },
    { name: "Poison Control", number: "1-800-222-1222", type: "poison" },
    { name: "Primary Doctor", number: "+1 (555) 123-4567", type: "doctor" },
    { name: "Emergency Contact", number: "+1 (555) 987-6543", type: "family" },
  ]

  const handleEmergencyCall = (number: string) => {
    // In a real app, this would initiate a call
    window.open(`tel:${number}`)
  }

  const handleSendAlert = () => {
    // In a real app, this would send emergency alerts
    console.log("[v0] Emergency alert sent with data:", emergencyData)
    alert("Emergency alert sent to your contacts!")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Emergency Actions
          </DialogTitle>
          <DialogDescription>Quick access to emergency contacts and alert system</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Emergency Contacts
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emergencyContacts.map((contact, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 justify-start bg-transparent"
                  onClick={() => handleEmergencyCall(contact.number)}
                >
                  <div className="text-left">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-gray-600">{contact.number}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Emergency Alert Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Send Emergency Alert
              </CardTitle>
              <CardDescription>Fill out this form to send an alert to your emergency contacts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryContact">Primary Contact</Label>
                  <Input
                    id="primaryContact"
                    value={emergencyData.primaryContact}
                    onChange={(e) => setEmergencyData((prev) => ({ ...prev, primaryContact: e.target.value }))}
                    placeholder="Name and phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentLocation">Current Location</Label>
                  <Input
                    id="currentLocation"
                    value={emergencyData.currentLocation}
                    onChange={(e) => setEmergencyData((prev) => ({ ...prev, currentLocation: e.target.value }))}
                    placeholder="Your current address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Current Symptoms/Situation</Label>
                <Textarea
                  id="symptoms"
                  value={emergencyData.symptoms}
                  onChange={(e) => setEmergencyData((prev) => ({ ...prev, symptoms: e.target.value }))}
                  placeholder="Describe your current situation or symptoms"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Input
                  id="medicalConditions"
                  value={emergencyData.medicalConditions}
                  onChange={(e) => setEmergencyData((prev) => ({ ...prev, medicalConditions: e.target.value }))}
                  placeholder="Relevant medical conditions"
                />
              </div>

              <Button onClick={handleSendAlert} className="w-full bg-red-600 hover:bg-red-700" size="lg">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Send Emergency Alert
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
