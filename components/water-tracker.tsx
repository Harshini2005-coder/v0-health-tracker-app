"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Droplets, Plus, Minus, Trophy, Target } from "lucide-react"

interface WaterTrackerProps {
  currentIntake: number
  dailyGoal: number
  onAddGlass: () => void
  onRemoveGlass: () => void
}

export function WaterTracker({ currentIntake, dailyGoal, onAddGlass, onRemoveGlass }: WaterTrackerProps) {
  const percentage = Math.min((currentIntake / dailyGoal) * 100, 100)
  const isGoalReached = currentIntake >= dailyGoal

  const getMotivationalMessage = () => {
    if (isGoalReached) {
      return "Excellent! You've reached your daily water goal!"
    }
    if (percentage >= 75) {
      return "Almost there! Just a few more glasses to go."
    }
    if (percentage >= 50) {
      return "Great progress! Keep it up."
    }
    if (percentage >= 25) {
      return "Good start! Remember to stay hydrated."
    }
    return "Let's start hydrating! Your body will thank you."
  }

  return (
    <div className="space-y-6">
      {/* Main Water Tracker */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Droplets className="w-8 h-8 text-blue-600" />
            Water Intake Tracker
          </CardTitle>
          <CardDescription className="text-lg">{getMotivationalMessage()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Visual Progress */}
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full border-8 border-blue-100" />
              <div
                className="absolute inset-0 rounded-full border-8 border-blue-500 transition-all duration-500"
                style={{
                  clipPath: `polygon(0 ${100 - percentage}%, 100% ${100 - percentage}%, 100% 100%, 0% 100%)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">{currentIntake}</div>
                  <div className="text-sm text-blue-600">glasses</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">
                {currentIntake} / {dailyGoal}
              </div>
              <Progress value={percentage} className="h-3 w-full max-w-md mx-auto" />
              <p className="text-sm text-gray-600">{Math.round(percentage)}% of daily goal</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={onRemoveGlass}
              disabled={currentIntake === 0}
              className="gap-2 bg-transparent"
            >
              <Minus className="w-5 h-5" />
              Remove Glass
            </Button>
            <Button size="lg" onClick={onAddGlass} className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500">
              <Plus className="w-5 h-5" />
              Add Glass
            </Button>
          </div>

          {isGoalReached && (
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-medium">Congratulations! Daily goal achieved!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Water Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Hydration Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <p className="text-sm text-gray-700">Start your day with a glass of water</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <p className="text-sm text-gray-700">Keep a water bottle at your desk</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <p className="text-sm text-gray-700">Drink water before, during, and after exercise</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <p className="text-sm text-gray-700">Set reminders to drink water regularly</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const dayProgress = Math.random() * 100 // Mock data
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{day}</span>
                    <Progress value={dayProgress} className="flex-1 h-2" />
                    <span className="text-xs text-gray-600 w-12">{Math.round(dayProgress)}%</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
