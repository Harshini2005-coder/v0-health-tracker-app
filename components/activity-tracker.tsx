"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, Footprints, Zap, Moon, Target, Trophy } from "lucide-react"

interface ActivityTrackerProps {
  todayStats: {
    steps: number
    calories: number
    activeMinutes: number
    sleep: number
  }
  dailyGoals: {
    steps: number
    calories: number
    sleep: number
  }
}

export function ActivityTracker({ todayStats, dailyGoals }: ActivityTrackerProps) {
  const stepsPercentage = Math.min((todayStats.steps / dailyGoals.steps) * 100, 100)
  const caloriesPercentage = Math.min((todayStats.calories / dailyGoals.calories) * 100, 100)
  const sleepPercentage = Math.min((todayStats.sleep / dailyGoals.sleep) * 100, 100)

  const achievements = [
    {
      title: "Step Master",
      description: "Reached 10,000 steps",
      achieved: todayStats.steps >= 10000,
      icon: Footprints,
    },
    {
      title: "Active Hour",
      description: "45+ active minutes",
      achieved: todayStats.activeMinutes >= 45,
      icon: Activity,
    },
    {
      title: "Calorie Burner",
      description: "Burned 2000+ calories",
      achieved: todayStats.calories >= 2000,
      icon: Zap,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Footprints className="w-5 h-5" />
              Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-2">{todayStats.steps.toLocaleString()}</div>
            <p className="text-sm text-purple-600 mb-3">of {dailyGoals.steps.toLocaleString()}</p>
            <Progress value={stepsPercentage} className="h-2 mb-2" />
            <Badge variant="secondary" className={stepsPercentage >= 100 ? "text-green-600" : "text-purple-600"}>
              {Math.round(stepsPercentage)}% of goal
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Zap className="w-5 h-5" />
              Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-2">{todayStats.calories}</div>
            <p className="text-sm text-orange-600 mb-3">burned today</p>
            <Progress value={caloriesPercentage} className="h-2 mb-2" />
            <Badge variant="secondary" className={caloriesPercentage >= 100 ? "text-green-600" : "text-orange-600"}>
              {Math.round(caloriesPercentage)}% of goal
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Activity className="w-5 h-5" />
              Active Minutes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-2">{todayStats.activeMinutes}</div>
            <p className="text-sm text-green-600 mb-3">minutes today</p>
            <Badge variant="secondary" className="text-green-600">
              Great job!
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-indigo-700">
              <Moon className="w-5 h-5" />
              Sleep
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-900 mb-2">{todayStats.sleep}h</div>
            <p className="text-sm text-indigo-600 mb-3">last night</p>
            <Progress value={sleepPercentage} className="h-2 mb-2" />
            <Badge variant="secondary" className={sleepPercentage >= 100 ? "text-green-600" : "text-indigo-600"}>
              {Math.round(sleepPercentage)}% of goal
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Weekly Activity Summary
          </CardTitle>
          <CardDescription>Your activity levels over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
              const daySteps = Math.floor(Math.random() * 15000) + 5000 // Mock data
              const dayPercentage = Math.min((daySteps / dailyGoals.steps) * 100, 100)
              const isToday = index === 6 // Assuming Sunday is today

              return (
                <div key={day} className="flex items-center gap-4">
                  <span className={`text-sm font-medium w-12 ${isToday ? "text-blue-600" : "text-gray-600"}`}>
                    {day}
                  </span>
                  <div className="flex-1">
                    <Progress value={dayPercentage} className="h-3" />
                  </div>
                  <span className="text-sm text-gray-600 w-20">{daySteps.toLocaleString()}</span>
                  <Badge variant={dayPercentage >= 100 ? "default" : "secondary"} className="w-16 justify-center">
                    {Math.round(dayPercentage)}%
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Today's Achievements
          </CardTitle>
          <CardDescription>Celebrate your health milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  achievement.achieved
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <achievement.icon
                    className={`w-6 h-6 ${achievement.achieved ? "text-green-600" : "text-gray-400"}`}
                  />
                  <span className="font-medium">{achievement.title}</span>
                  {achievement.achieved && <Trophy className="w-4 h-4 text-yellow-500" />}
                </div>
                <p className="text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Activity Goals
          </CardTitle>
          <CardDescription>Set and track your fitness targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Footprints className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">Daily Steps</p>
                  <p className="text-sm text-gray-600">Current: {dailyGoals.steps.toLocaleString()}</p>
                </div>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-medium">Calories Burned</p>
                  <p className="text-sm text-gray-600">Current: {dailyGoals.calories}</p>
                </div>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="font-medium">Sleep Hours</p>
                  <p className="text-sm text-gray-600">Current: {dailyGoals.sleep} hours</p>
                </div>
              </div>
              <Badge variant="outline">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
