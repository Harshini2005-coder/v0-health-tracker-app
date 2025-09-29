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
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, Target, Clock, Flame, TrendingUp, Plus } from "lucide-react"

interface FitnessTrackerDialogProps {
  children: React.ReactNode
}

export function FitnessTrackerDialog({ children }: FitnessTrackerDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [fitnessData, setFitnessData] = useState({
    dailySteps: 8420,
    stepGoal: 10000,
    caloriesBurned: 320,
    calorieGoal: 500,
    activeMinutes: 45,
    activeGoal: 60,
    workoutsThisWeek: 3,
    workoutGoal: 5,
  })

  const [newWorkout, setNewWorkout] = useState({
    type: "",
    duration: "",
    intensity: "",
    caloriesBurned: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  })

  const [fitnessGoals, setFitnessGoals] = useState({
    dailySteps: "10000",
    weeklyWorkouts: "5",
    dailyCalories: "500",
    weeklyDistance: "20",
  })

  const recentWorkouts = [
    { type: "Running", duration: "30 min", calories: 280, date: "Today" },
    { type: "Yoga", duration: "45 min", calories: 150, date: "Yesterday" },
    { type: "Weight Training", duration: "60 min", calories: 400, date: "2 days ago" },
  ]

  const handleLogWorkout = () => {
    console.log("[v0] Workout logged:", newWorkout)
    alert("Workout has been logged!")
    setNewWorkout({
      type: "",
      duration: "",
      intensity: "",
      caloriesBurned: "",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    })
  }

  const handleUpdateGoals = () => {
    console.log("[v0] Fitness goals updated:", fitnessGoals)
    alert("Fitness goals have been updated!")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <Activity className="w-5 h-5" />
            Fitness Tracker
          </DialogTitle>
          <DialogDescription>Track your fitness activities, set goals, and monitor your progress</DialogDescription>
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
            variant={activeTab === "log" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("log")}
            className="flex-1"
          >
            Log Workout
          </Button>
          <Button
            variant={activeTab === "goals" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("goals")}
            className="flex-1"
          >
            Set Goals
          </Button>
        </div>

        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Daily Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Steps</CardTitle>
                    <Activity className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{fitnessData.dailySteps.toLocaleString()}</div>
                    <p className="text-xs text-gray-600 mb-2">of {fitnessData.stepGoal.toLocaleString()} goal</p>
                    <Progress value={(fitnessData.dailySteps / fitnessData.stepGoal) * 100} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Calories</CardTitle>
                    <Flame className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{fitnessData.caloriesBurned}</div>
                    <p className="text-xs text-gray-600 mb-2">of {fitnessData.calorieGoal} goal</p>
                    <Progress value={(fitnessData.caloriesBurned / fitnessData.calorieGoal) * 100} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Minutes</CardTitle>
                    <Clock className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{fitnessData.activeMinutes}</div>
                    <p className="text-xs text-gray-600 mb-2">of {fitnessData.activeGoal} goal</p>
                    <Progress value={(fitnessData.activeMinutes / fitnessData.activeGoal) * 100} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Workouts</CardTitle>
                    <Target className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{fitnessData.workoutsThisWeek}</div>
                    <p className="text-xs text-gray-600 mb-2">of {fitnessData.workoutGoal} this week</p>
                    <Progress value={(fitnessData.workoutsThisWeek / fitnessData.workoutGoal) * 100} className="h-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Recent Workouts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recent Workouts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentWorkouts.map((workout, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{workout.type}</p>
                        <p className="text-sm text-gray-600">
                          {workout.duration} • {workout.calories} calories
                        </p>
                      </div>
                      <Badge variant="secondary">{workout.date}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "log" && (
            <Card>
              <CardHeader>
                <CardTitle>Log New Workout</CardTitle>
                <CardDescription>Record your fitness activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workoutType">Workout Type</Label>
                    <Select
                      value={newWorkout.type}
                      onValueChange={(value) => setNewWorkout((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select workout type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="running">Running</SelectItem>
                        <SelectItem value="walking">Walking</SelectItem>
                        <SelectItem value="cycling">Cycling</SelectItem>
                        <SelectItem value="swimming">Swimming</SelectItem>
                        <SelectItem value="yoga">Yoga</SelectItem>
                        <SelectItem value="weight-training">Weight Training</SelectItem>
                        <SelectItem value="cardio">Cardio</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workoutDate">Date</Label>
                    <Input
                      id="workoutDate"
                      type="date"
                      value={newWorkout.date}
                      onChange={(e) => setNewWorkout((prev) => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newWorkout.duration}
                      onChange={(e) => setNewWorkout((prev) => ({ ...prev, duration: e.target.value }))}
                      placeholder="30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="intensity">Intensity</Label>
                    <Select
                      value={newWorkout.intensity}
                      onValueChange={(value) => setNewWorkout((prev) => ({ ...prev, intensity: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select intensity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="very-high">Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories Burned</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={newWorkout.caloriesBurned}
                      onChange={(e) => setNewWorkout((prev) => ({ ...prev, caloriesBurned: e.target.value }))}
                      placeholder="250"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workoutNotes">Notes</Label>
                  <Textarea
                    id="workoutNotes"
                    value={newWorkout.notes}
                    onChange={(e) => setNewWorkout((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="How did the workout feel? Any observations?"
                    rows={3}
                  />
                </div>

                <Button onClick={handleLogWorkout} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Workout
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "goals" && (
            <Card>
              <CardHeader>
                <CardTitle>Set Fitness Goals</CardTitle>
                <CardDescription>Customize your fitness targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stepGoal">Daily Steps Goal</Label>
                    <Input
                      id="stepGoal"
                      type="number"
                      value={fitnessGoals.dailySteps}
                      onChange={(e) => setFitnessGoals((prev) => ({ ...prev, dailySteps: e.target.value }))}
                      placeholder="10000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workoutGoal">Weekly Workouts Goal</Label>
                    <Input
                      id="workoutGoal"
                      type="number"
                      value={fitnessGoals.weeklyWorkouts}
                      onChange={(e) => setFitnessGoals((prev) => ({ ...prev, weeklyWorkouts: e.target.value }))}
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calorieGoal">Daily Calories Goal</Label>
                    <Input
                      id="calorieGoal"
                      type="number"
                      value={fitnessGoals.dailyCalories}
                      onChange={(e) => setFitnessGoals((prev) => ({ ...prev, dailyCalories: e.target.value }))}
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distanceGoal">Weekly Distance Goal (miles)</Label>
                    <Input
                      id="distanceGoal"
                      type="number"
                      value={fitnessGoals.weeklyDistance}
                      onChange={(e) => setFitnessGoals((prev) => ({ ...prev, weeklyDistance: e.target.value }))}
                      placeholder="20"
                    />
                  </div>
                </div>

                <Button onClick={handleUpdateGoals} className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  Update Fitness Goals
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
