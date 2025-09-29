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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/contexts/user-context"
import { Heart, Activity, TrendingUp, TrendingDown, AlertTriangle, Plus } from "lucide-react"
import { toast } from "sonner"

interface HeartRateTrackerProps {
  children: React.ReactNode
}

export function HeartRateTracker({ children }: HeartRateTrackerProps) {
  const { user, addVitalSign } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [heartRate, setHeartRate] = useState("")
  const [context, setContext] = useState("resting")

  const heartRateReadings = user?.vitalSigns.filter((vital) => vital.type === "heart_rate") || []
  const latestReading = heartRateReadings[heartRateReadings.length - 1]
  const currentHeartRate = latestReading?.value || 0

  const addHeartRate = () => {
    const rate = Number.parseInt(heartRate)
    if (rate && rate > 0 && rate < 300) {
      const now = new Date()
      addVitalSign({
        id: Date.now().toString(),
        type: "heart_rate",
        value: rate,
        unit: "bpm",
        date: now.toISOString().split("T")[0],
        time: now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      })

      toast.success(`Heart rate recorded: ${rate} BPM`)
      setHeartRate("")

      // Provide feedback based on heart rate
      if (rate < 60) {
        toast.info("💙 Low heart rate - consider consulting your doctor if you feel unwell")
      } else if (rate > 100) {
        toast.warning("❤️ Elevated heart rate - make sure you're relaxed and hydrated")
      } else {
        toast.success("💚 Normal heart rate range!")
      }
    } else {
      toast.error("Please enter a valid heart rate (1-299 BPM)")
    }
  }

  const getHeartRateCategory = (rate: number) => {
    if (rate < 60) return { category: "Low", color: "blue", description: "Bradycardia" }
    if (rate <= 100) return { category: "Normal", color: "green", description: "Healthy range" }
    if (rate <= 120) return { category: "Elevated", color: "yellow", description: "Slightly high" }
    return { category: "High", color: "red", description: "Tachycardia" }
  }

  const getAverageHeartRate = () => {
    if (heartRateReadings.length === 0) return 0
    const sum = heartRateReadings.reduce((acc, reading) => acc + reading.value, 0)
    return Math.round(sum / heartRateReadings.length)
  }

  const getTrend = () => {
    if (heartRateReadings.length < 2) return null
    const recent = heartRateReadings.slice(-3)
    const older = heartRateReadings.slice(-6, -3)

    if (older.length === 0) return null

    const recentAvg = recent.reduce((acc, r) => acc + r.value, 0) / recent.length
    const olderAvg = older.reduce((acc, r) => acc + r.value, 0) / older.length

    const diff = recentAvg - olderAvg
    if (Math.abs(diff) < 2) return { direction: "stable", change: 0 }
    return { direction: diff > 0 ? "up" : "down", change: Math.abs(diff) }
  }

  const currentCategory = getHeartRateCategory(currentHeartRate)
  const averageRate = getAverageHeartRate()
  const trend = getTrend()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            Heart Rate Tracker
          </DialogTitle>
          <DialogDescription>Monitor your heart rate and track cardiovascular health</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Reading */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Reading</CardTitle>
              <CardDescription>
                {latestReading ? `Last recorded: ${latestReading.date} at ${latestReading.time}` : "No readings yet"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8 text-red-500" />
                  <div>
                    <span className="text-3xl font-bold text-red-600">{currentHeartRate || "--"}</span>
                    <span className="text-lg text-gray-600 ml-1">BPM</span>
                  </div>
                </div>
                <Badge
                  variant={currentCategory.color === "green" ? "default" : "secondary"}
                  className={`${
                    currentCategory.color === "red"
                      ? "bg-red-100 text-red-800"
                      : currentCategory.color === "yellow"
                        ? "bg-yellow-100 text-yellow-800"
                        : currentCategory.color === "blue"
                          ? "bg-blue-100 text-blue-800"
                          : ""
                  }`}
                >
                  {currentCategory.category}
                </Badge>
              </div>

              {trend && (
                <div className="flex items-center gap-2 text-sm">
                  {trend.direction === "up" ? (
                    <TrendingUp className="w-4 h-4 text-red-500" />
                  ) : trend.direction === "down" ? (
                    <TrendingDown className="w-4 h-4 text-green-500" />
                  ) : (
                    <Activity className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-gray-600">
                    {trend.direction === "stable"
                      ? "Stable"
                      : `${trend.direction === "up" ? "Increasing" : "Decreasing"} by ${Math.round(trend.change)} BPM`}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add New Reading */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Record New Reading</CardTitle>
              <CardDescription>Manually enter your heart rate measurement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="heart-rate">Heart Rate (BPM)</Label>
                  <Input
                    id="heart-rate"
                    type="number"
                    min="30"
                    max="250"
                    placeholder="Enter BPM..."
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="context">Context</Label>
                  <select
                    id="context"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  >
                    <option value="resting">Resting</option>
                    <option value="exercise">During Exercise</option>
                    <option value="post-exercise">Post Exercise</option>
                    <option value="stressed">Stressed</option>
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
              </div>

              <Button onClick={addHeartRate} disabled={!heartRate} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Record Heart Rate
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Average Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {averageRate || "--"} <span className="text-lg text-gray-600">BPM</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Based on {heartRateReadings.length} reading{heartRateReadings.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Health Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-gray-900">{currentCategory.description}</div>
                <p className="text-sm text-gray-600 mt-1">
                  {currentHeartRate ? `Current: ${currentHeartRate} BPM` : "No recent readings"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Readings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Readings</CardTitle>
              <CardDescription>Your last 5 heart rate measurements</CardDescription>
            </CardHeader>
            <CardContent>
              {heartRateReadings.length > 0 ? (
                <div className="space-y-2">
                  {heartRateReadings
                    .slice(-5)
                    .reverse()
                    .map((reading, index) => {
                      const category = getHeartRateCategory(reading.value)
                      return (
                        <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Heart className="w-4 h-4 text-red-500" />
                            <div>
                              <span className="font-semibold">{reading.value} BPM</span>
                              <p className="text-sm text-gray-600">
                                {reading.date} at {reading.time}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`${
                              category.color === "red"
                                ? "border-red-300 text-red-700"
                                : category.color === "yellow"
                                  ? "border-yellow-300 text-yellow-700"
                                  : category.color === "blue"
                                    ? "border-blue-300 text-blue-700"
                                    : "border-green-300 text-green-700"
                            }`}
                          >
                            {category.category}
                          </Badge>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No heart rate readings yet</p>
                  <p className="text-sm text-gray-400">Record your first measurement above</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Tips */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-lg text-red-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Heart Health Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-red-800 space-y-2">
              <p>• Measure your heart rate when you're calm and rested</p>
              <p>• Normal resting heart rate is 60-100 BPM for adults</p>
              <p>• Regular exercise can help lower resting heart rate</p>
              <p>• Consult your doctor if you notice irregular patterns</p>
              <p>• Avoid caffeine and stress before measuring</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
