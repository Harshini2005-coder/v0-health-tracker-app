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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/user-context"
import { Camera, Droplets, Activity, MessageCircle, Heart, Scale, Thermometer, Stethoscope } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface QuickActionsDialogProps {
  children: React.ReactNode
}

export function QuickActionsDialog({ children }: QuickActionsDialogProps) {
  const { user, addVitalSign, updateHealthGoal } = useUser()
  const { toast } = useToast()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const [vitalData, setVitalData] = useState({
    type: "",
    value: "",
    unit: "",
    notes: "",
  })

  const [waterIntake, setWaterIntake] = useState("")
  const [prescriptionText, setPrescriptionText] = useState("")

  const handleAddWater = () => {
    if (!waterIntake) {
      toast({
        title: "Missing Information",
        description: "Please enter the amount of water",
        variant: "destructive",
      })
      return
    }

    const waterGoal = user?.healthGoals.find((goal) => goal.type === "water")
    if (waterGoal) {
      const newCurrent = waterGoal.current + Number.parseInt(waterIntake)
      updateHealthGoal(waterGoal.id, { current: newCurrent })
    }

    toast({
      title: "Water Added",
      description: `Added ${waterIntake} glasses of water to your daily intake`,
    })
    setWaterIntake("")
    setActiveAction(null)
  }

  const handleAddVital = () => {
    if (!vitalData.type || !vitalData.value) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const vital = {
      id: Date.now().toString(),
      type: vitalData.type,
      value: Number.parseFloat(vitalData.value),
      unit: vitalData.unit,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
    }

    addVitalSign(vital)
    setVitalData({ type: "", value: "", unit: "", notes: "" })
    setActiveAction(null)
    toast({
      title: "Vital Sign Added",
      description: `${vitalData.type.replace("_", " ")} recorded successfully`,
    })
  }

  const handleScanPrescription = () => {
    if (!prescriptionText.trim()) {
      toast({
        title: "No Text Entered",
        description: "Please enter prescription text to analyze",
        variant: "destructive",
      })
      return
    }

    // Simulate prescription analysis
    toast({
      title: "Prescription Analyzed",
      description: "Prescription text has been processed. Check your medications list for updates.",
    })
    setPrescriptionText("")
    setActiveAction(null)
  }

  const quickActions = [
    {
      id: "scan_prescription",
      title: "Scan Prescription",
      description: "Upload or enter prescription text",
      icon: Camera,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "add_water",
      title: "Add Water",
      description: "Log your water intake",
      icon: Droplets,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      id: "health_log",
      title: "Health Log",
      description: "Record vital signs and symptoms",
      icon: Activity,
      color: "from-green-500 to-green-600",
    },
    {
      id: "ai_chat",
      title: "AI Assistant",
      description: "Get health guidance and answers",
      icon: MessageCircle,
      color: "from-purple-500 to-purple-600",
    },
  ]

  const vitalTypes = [
    { value: "blood_pressure", label: "Blood Pressure", unit: "mmHg", icon: Heart },
    { value: "heart_rate", label: "Heart Rate", unit: "bpm", icon: Heart },
    { value: "temperature", label: "Temperature", unit: "°F", icon: Thermometer },
    { value: "weight", label: "Weight", unit: "lbs", icon: Scale },
    { value: "blood_sugar", label: "Blood Sugar", unit: "mg/dL", icon: Stethoscope },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Quick Actions
          </DialogTitle>
          <DialogDescription>Access your health tools and log important data instantly</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!activeAction ? (
            <>
              {/* Action Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Card
                      key={action.id}
                      className="cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => setActiveAction(action.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{action.title}</h3>
                            <p className="text-sm text-gray-600">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Health Data</CardTitle>
                  <CardDescription>Your latest recorded vital signs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user?.vitalSigns.slice(-3).map((vital) => (
                      <div key={vital.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium capitalize">{vital.type.replace("_", " ")}</p>
                          <p className="text-sm text-gray-600">
                            {vital.date} at {vital.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {vital.value} {vital.unit}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!user?.vitalSigns || user.vitalSigns.length === 0) && (
                      <p className="text-center text-gray-500 py-4">No recent vital signs recorded</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="space-y-4">
              <Button variant="outline" onClick={() => setActiveAction(null)} className="mb-4">
                ← Back to Actions
              </Button>

              {/* Scan Prescription */}
              {activeAction === "scan_prescription" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Scan Prescription
                    </CardTitle>
                    <CardDescription>Enter prescription text for analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="prescription-text">Prescription Text</Label>
                      <Textarea
                        id="prescription-text"
                        value={prescriptionText}
                        onChange={(e) => setPrescriptionText(e.target.value)}
                        placeholder="Enter the prescription text here..."
                        rows={6}
                      />
                    </div>
                    <Button onClick={handleScanPrescription} className="w-full gap-2">
                      <Camera className="w-4 h-4" />
                      Analyze Prescription
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Add Water */}
              {activeAction === "add_water" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="w-5 h-5" />
                      Add Water Intake
                    </CardTitle>
                    <CardDescription>Log how much water you've consumed</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="water-amount">Number of Glasses</Label>
                      <Input
                        id="water-amount"
                        type="number"
                        value={waterIntake}
                        onChange={(e) => setWaterIntake(e.target.value)}
                        placeholder="e.g., 2"
                        min="1"
                        max="20"
                      />
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Current progress: {user?.healthGoals.find((g) => g.type === "water")?.current || 0} /{" "}
                        {user?.healthGoals.find((g) => g.type === "water")?.target || 8} glasses
                      </p>
                    </div>
                    <Button onClick={handleAddWater} className="w-full gap-2">
                      <Droplets className="w-4 h-4" />
                      Add Water
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Health Log */}
              {activeAction === "health_log" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Health Log
                    </CardTitle>
                    <CardDescription>Record your vital signs and health metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="vital-type">Vital Sign Type</Label>
                      <Select
                        value={vitalData.type}
                        onValueChange={(value) => {
                          const selectedVital = vitalTypes.find((v) => v.value === value)
                          setVitalData((prev) => ({
                            ...prev,
                            type: value,
                            unit: selectedVital?.unit || "",
                          }))
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vital sign type" />
                        </SelectTrigger>
                        <SelectContent>
                          {vitalTypes.map((vital) => (
                            <SelectItem key={vital.value} value={vital.value}>
                              {vital.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vital-value">Value</Label>
                        <Input
                          id="vital-value"
                          type="number"
                          value={vitalData.value}
                          onChange={(e) => setVitalData((prev) => ({ ...prev, value: e.target.value }))}
                          placeholder="Enter value"
                        />
                      </div>
                      <div>
                        <Label htmlFor="vital-unit">Unit</Label>
                        <Input
                          id="vital-unit"
                          value={vitalData.unit}
                          onChange={(e) => setVitalData((prev) => ({ ...prev, unit: e.target.value }))}
                          placeholder="Unit"
                          readOnly
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="vital-notes">Notes (Optional)</Label>
                      <Textarea
                        id="vital-notes"
                        value={vitalData.notes}
                        onChange={(e) => setVitalData((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any additional notes..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleAddVital} className="w-full gap-2">
                      <Activity className="w-4 h-4" />
                      Record Vital Sign
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* AI Chat */}
              {activeAction === "ai_chat" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      AI Health Assistant
                    </CardTitle>
                    <CardDescription>Get personalized health guidance and answers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg text-center">
                      <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Ready to Help!</h3>
                      <p className="text-gray-600 mb-4">
                        Ask me about your medications, symptoms, health goals, or any medical questions you have.
                      </p>
                      <Button
                        onClick={() => {
                          router.push("/ai-chat")
                          setIsOpen(false)
                        }}
                        className="gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Start Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
