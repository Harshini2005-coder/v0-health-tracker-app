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
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/contexts/user-context"
import { Activity, Target, TrendingUp, Plus, Minus, Award } from "lucide-react"
import { toast } from "sonner"

interface StepsTrackerProps {
  children: React.ReactNode
}

export function StepsTracker({ children }: StepsTrackerProps) {
  const { user, updateHealthGoal } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [customSteps, setCustomSteps] = useState("")

  const stepsGoal = user?.healthGoals.find((goal) => goal.type === "steps")
  const currentSteps = stepsGoal?.current || 0
  const targetSteps = stepsGoal?.target || 10000
  const progressPercentage = Math.min((currentSteps / targetSteps) * 100, 100)

  const addSteps = (amount: number) => {
    if (stepsGoal) {
      const newCurrent = Math.max(0, currentSteps + amount)
      updateHealthGoal(stepsGoal.id, { current: newCurrent })

      if (amount > 0) {
        toast.success(`Added ${amount.toLocaleString()} steps!`)
        if (newCurrent >= targetSteps) {
          toast.success("🎉 Daily step goal achieved! Great job!")
        }
      } else {
        toast.info(`Removed ${Math.abs(amount).toLocaleString()} steps`)
      }
    }
  }

  const addCustomSteps = () => {
    const amount = Number.parseInt(customSteps)
    if (amount && amount > 0) {
      addSteps(amount)
      setCustomSteps("")
    }
  }

  const resetDaily = () => {
    if (stepsGoal) {
      updateHealthGoal(stepsGoal.id, { current: 0 })
      toast.info("Daily steps reset")
    }
  }

  const updateTarget = (newTarget: number) => {
    if (stepsGoal && newTarget > 0) {
      updateHealthGoal(stepsGoal.id, { target: newTarget })
      toast.success(`Step goal updated to ${newTarget.toLocaleString()} steps`)
    }
  }

  const getCaloriesBurned = () => {
    // Rough estimate: 0.04 calories per step for average person
    return Math.round(currentSteps * 0.04)
  }

  const getDistanceWalked = () => {
    // Rough estimate: 2000 steps = 1 mile
    return (currentSteps / 2000).toFixed(1)
  }

  const getActivityLevel = () => {
    if (currentSteps < 5000) return { level: "Sedentary", color: "red", description: "Try to move more!" }
    if (currentSteps < 7500) return { level: "Lightly Active", color: "yellow", description: "Good start!" }
    if (currentSteps < 10000) return { level: "Moderately Active", color: "blue", description: "Almost there!" }
    if (currentSteps < 12500) return { level: "Active", color: "green", description: "Great job!" }
    return { level: "Very Active", color: "purple", description: "Excellent!" }
  }

  const activityLevel = getActivityLevel()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Steps Tracker
          </DialogTitle>
          <DialogDescription>Track your daily steps and monitor your activity level</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Progress</CardTitle>
              <CardDescription>
                {currentSteps.toLocaleString()} of {targetSteps.toLocaleString()} steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-purple-600">{currentSteps.toLocaleString()}</span>
                <Badge
                  variant={progressPercentage >= 100 ? "default" : "secondary"}
                  className={`${
                    activityLevel.color === "purple"
                      ? "bg-purple-100 text-purple-800"
                      : activityLevel.color === "green"
                        ? "bg-green-100 text-green-800"
                        : activityLevel.color === "blue"
                          ? "bg-blue-100 text-blue-800"
                          : activityLevel.color === "yellow"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                  }`}
                >
                  {activityLevel.level}
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                {activityLevel.description}
              </div>
            </CardContent>
          </Card>

          {/* Activity Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Distance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {getDistanceWalked()} <span className="text-sm text-gray-600">miles</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Calories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {getCaloriesBurned()} <span className="text-sm text-gray-600">cal</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Goal Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{Math.round(progressPercentage)}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Add Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Add</CardTitle>
              <CardDescription>Add steps with preset amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button onClick={() => addSteps(500)} variant="outline" className="h-16 flex flex-col gap-1">
                  <Activity className="w-5 h-5" />
                  <span>500 Steps</span>
                </Button>
                <Button onClick={() => addSteps(1000)} variant="outline" className="h-16 flex flex-col gap-1">
                  <Activity className="w-5 h-5" />
                  <span>1K Steps</span>
                </Button>
                <Button onClick={() => addSteps(2000)} variant="outline" className="h-16 flex flex-col gap-1">
                  <Activity className="w-5 h-5" />
                  <span>2K Steps</span>
                </Button>
                <Button onClick={() => addSteps(5000)} variant="outline" className="h-16 flex flex-col gap-1">
                  <Activity className="w-5 h-5" />
                  <span>5K Steps</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Custom Amount */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Amount</CardTitle>
              <CardDescription>Add a specific number of steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="custom-steps">Steps</Label>
                  <Input
                    id="custom-steps"
                    type="number"
                    min="0"
                    placeholder="Enter steps..."
                    value={customSteps}
                    onChange={(e) => setCustomSteps(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addCustomSteps} disabled={!customSteps}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => addSteps(-500)} variant="outline" size="sm" disabled={currentSteps <= 0}>
                  <Minus className="w-4 h-4 mr-1" />
                  Remove 500
                </Button>
                <Button onClick={resetDaily} variant="outline" size="sm">
                  Reset Today
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Goal Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Daily Goal
              </CardTitle>
              <CardDescription>Customize your daily step target</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  onClick={() => updateTarget(5000)}
                  variant={targetSteps === 5000 ? "default" : "outline"}
                  size="sm"
                >
                  5K Steps
                </Button>
                <Button
                  onClick={() => updateTarget(8000)}
                  variant={targetSteps === 8000 ? "default" : "outline"}
                  size="sm"
                >
                  8K Steps
                </Button>
                <Button
                  onClick={() => updateTarget(10000)}
                  variant={targetSteps === 10000 ? "default" : "outline"}
                  size="sm"
                >
                  10K Steps
                </Button>
                <Button
                  onClick={() => updateTarget(12000)}
                  variant={targetSteps === 12000 ? "default" : "outline"}
                  size="sm"
                >
                  12K Steps
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg text-purple-900 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div
                  className={`p-2 rounded ${currentSteps >= 5000 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                >
                  🚶 First 5K Steps
                </div>
                <div
                  className={`p-2 rounded ${currentSteps >= 10000 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                >
                  🏃 Daily Goal Reached
                </div>
                <div
                  className={`p-2 rounded ${currentSteps >= 15000 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                >
                  ⭐ Super Active Day
                </div>
                <div
                  className={`p-2 rounded ${currentSteps >= 20000 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                >
                  🏆 Step Champion
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">💡 Activity Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 space-y-2">
              <p>• Take the stairs instead of elevators</p>
              <p>• Park farther away from your destination</p>
              <p>• Take walking breaks during work hours</p>
              <p>• Walk while talking on the phone</p>
              <p>• Set hourly reminders to move around</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
