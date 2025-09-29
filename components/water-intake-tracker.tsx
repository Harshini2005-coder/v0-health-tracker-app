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
import { Droplets, Plus, Minus, Target, TrendingUp } from "lucide-react"
import { toast } from "sonner"

interface WaterIntakeTrackerProps {
  children: React.ReactNode
}

export function WaterIntakeTracker({ children }: WaterIntakeTrackerProps) {
  const { user, updateHealthGoal } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [customAmount, setCustomAmount] = useState("")

  const waterGoal = user?.healthGoals.find((goal) => goal.type === "water")
  const currentIntake = waterGoal?.current || 0
  const targetIntake = waterGoal?.target || 8
  const progressPercentage = Math.min((currentIntake / targetIntake) * 100, 100)

  const addWater = (amount: number) => {
    if (waterGoal) {
      const newCurrent = Math.max(0, currentIntake + amount)
      updateHealthGoal(waterGoal.id, { current: newCurrent })

      if (amount > 0) {
        toast.success(`Added ${amount} glass${amount !== 1 ? "es" : ""} of water!`)
        if (newCurrent >= targetIntake) {
          toast.success("🎉 Daily water goal achieved!")
        }
      } else {
        toast.info(`Removed ${Math.abs(amount)} glass${Math.abs(amount) !== 1 ? "es" : ""} of water`)
      }
    }
  }

  const addCustomAmount = () => {
    const amount = Number.parseFloat(customAmount)
    if (amount && amount > 0) {
      addWater(amount)
      setCustomAmount("")
    }
  }

  const resetDaily = () => {
    if (waterGoal) {
      updateHealthGoal(waterGoal.id, { current: 0 })
      toast.info("Daily water intake reset")
    }
  }

  const updateTarget = (newTarget: number) => {
    if (waterGoal && newTarget > 0) {
      updateHealthGoal(waterGoal.id, { target: newTarget })
      toast.success(`Water goal updated to ${newTarget} glasses`)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            Water Intake Tracker
          </DialogTitle>
          <DialogDescription>Track your daily water consumption and stay hydrated</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Progress</CardTitle>
              <CardDescription>
                {currentIntake} of {targetIntake} glasses consumed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  {currentIntake}/{targetIntake}
                </span>
                <Badge variant={progressPercentage >= 100 ? "default" : "secondary"}>
                  {Math.round(progressPercentage)}%
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                {progressPercentage >= 100
                  ? "Goal achieved! Great job!"
                  : progressPercentage >= 75
                    ? "Almost there! Keep going!"
                    : progressPercentage >= 50
                      ? "Good progress!"
                      : "Let's start hydrating!"}
              </div>
            </CardContent>
          </Card>

          {/* Quick Add Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Add</CardTitle>
              <CardDescription>Add water intake with preset amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button onClick={() => addWater(1)} variant="outline" className="h-16 flex flex-col gap-1">
                  <Droplets className="w-5 h-5" />
                  <span>1 Glass</span>
                </Button>
                <Button onClick={() => addWater(2)} variant="outline" className="h-16 flex flex-col gap-1">
                  <Droplets className="w-5 h-5" />
                  <span>2 Glasses</span>
                </Button>
                <Button onClick={() => addWater(0.5)} variant="outline" className="h-16 flex flex-col gap-1">
                  <Droplets className="w-5 h-5" />
                  <span>Half Glass</span>
                </Button>
                <Button onClick={() => addWater(3)} variant="outline" className="h-16 flex flex-col gap-1">
                  <Droplets className="w-5 h-5" />
                  <span>Bottle (3)</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Custom Amount */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom Amount</CardTitle>
              <CardDescription>Add a specific amount of water</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="custom-water">Glasses</Label>
                  <Input
                    id="custom-water"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Enter amount..."
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addCustomAmount} disabled={!customAmount}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => addWater(-1)} variant="outline" size="sm" disabled={currentIntake <= 0}>
                  <Minus className="w-4 h-4 mr-1" />
                  Remove 1
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
              <CardDescription>Customize your daily water intake target</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button onClick={() => updateTarget(6)} variant={targetIntake === 6 ? "default" : "outline"} size="sm">
                  6 Glasses
                </Button>
                <Button onClick={() => updateTarget(8)} variant={targetIntake === 8 ? "default" : "outline"} size="sm">
                  8 Glasses
                </Button>
                <Button
                  onClick={() => updateTarget(10)}
                  variant={targetIntake === 10 ? "default" : "outline"}
                  size="sm"
                >
                  10 Glasses
                </Button>
                <Button
                  onClick={() => updateTarget(12)}
                  variant={targetIntake === 12 ? "default" : "outline"}
                  size="sm"
                >
                  12 Glasses
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Hydration Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">💡 Hydration Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 space-y-2">
              <p>• Start your day with a glass of water</p>
              <p>• Keep a water bottle nearby as a visual reminder</p>
              <p>• Set hourly reminders to drink water</p>
              <p>• Eat water-rich foods like fruits and vegetables</p>
              <p>• Drink water before, during, and after exercise</p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
