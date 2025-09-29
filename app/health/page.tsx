"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Droplets,
  Activity,
  Scale,
  Thermometer,
  Zap,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowLeft,
  Target,
} from "lucide-react"
import Link from "next/link"
import { WaterTracker } from "@/components/water-tracker"
import { VitalSignsChart } from "@/components/vital-signs-chart"
import { ActivityTracker } from "@/components/activity-tracker"
import { HealthInsights } from "@/components/health-insights"

export default function HealthPage() {
  const [waterIntake, setWaterIntake] = useState(6)
  const [dailyGoals] = useState({
    water: 8,
    steps: 10000,
    calories: 2000,
    sleep: 8,
  })

  const [healthMetrics] = useState({
    heartRate: {
      current: 72,
      trend: "stable",
      readings: [68, 70, 72, 71, 73, 72, 74],
    },
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
      trend: "good",
      readings: [
        { systolic: 118, diastolic: 78 },
        { systolic: 120, diastolic: 80 },
        { systolic: 122, diastolic: 82 },
      ],
    },
    weight: {
      current: 175,
      trend: "down",
      readings: [178, 177, 176, 175, 175, 174, 175],
    },
    temperature: {
      current: 98.6,
      trend: "normal",
      readings: [98.4, 98.6, 98.5, 98.6, 98.7, 98.6, 98.6],
    },
  })

  const [todayStats] = useState({
    steps: 8420,
    calories: 1650,
    activeMinutes: 45,
    sleep: 7.5,
    waterGlasses: waterIntake,
  })

  const addWaterGlass = () => {
    if (waterIntake < dailyGoals.water + 2) {
      setWaterIntake(waterIntake + 1)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <TrendingUp className="w-4 h-4 text-blue-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                Log Health Data
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Monitoring</h1>
          <p className="text-gray-600">Track your vital signs, activity, and wellness metrics</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Heart Rate</CardTitle>
              <Heart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{healthMetrics.heartRate.current}</div>
              <p className="text-xs text-blue-600 mb-2">BPM</p>
              <div className="flex items-center gap-1">
                {getTrendIcon(healthMetrics.heartRate.trend)}
                <span className={`text-xs ${getTrendColor(healthMetrics.heartRate.trend)}`}>Normal</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Water Intake</CardTitle>
              <Droplets className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {todayStats.waterGlasses}/{dailyGoals.water}
              </div>
              <p className="text-xs text-green-600 mb-2">glasses today</p>
              <Progress value={(todayStats.waterGlasses / dailyGoals.water) * 100} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Steps</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{todayStats.steps.toLocaleString()}</div>
              <p className="text-xs text-purple-600 mb-2">of {dailyGoals.steps.toLocaleString()}</p>
              <Progress value={(todayStats.steps / dailyGoals.steps) * 100} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Weight</CardTitle>
              <Scale className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{healthMetrics.weight.current}</div>
              <p className="text-xs text-orange-600 mb-2">lbs</p>
              <div className="flex items-center gap-1">
                {getTrendIcon(healthMetrics.weight.trend)}
                <span className={`text-xs ${getTrendColor(healthMetrics.weight.trend)}`}>-3 lbs this month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="water">Water Tracker</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Today's Goals
                  </CardTitle>
                  <CardDescription>Your daily health and wellness targets</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">Water</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {todayStats.waterGlasses}/{dailyGoals.water} glasses
                      </span>
                    </div>
                    <Progress value={(todayStats.waterGlasses / dailyGoals.water) * 100} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Steps</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {todayStats.steps.toLocaleString()}/{dailyGoals.steps.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={(todayStats.steps / dailyGoals.steps) * 100} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium">Calories</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {todayStats.calories}/{dailyGoals.calories}
                      </span>
                    </div>
                    <Progress value={(todayStats.calories / dailyGoals.calories) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Vitals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    Recent Vitals
                  </CardTitle>
                  <CardDescription>Your latest health measurements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-700">Heart Rate</span>
                      </div>
                      <div className="text-xl font-bold text-red-900">{healthMetrics.heartRate.current} BPM</div>
                      <Badge variant="secondary" className="text-xs">
                        Normal
                      </Badge>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Blood Pressure</span>
                      </div>
                      <div className="text-xl font-bold text-blue-900">
                        {healthMetrics.bloodPressure.systolic}/{healthMetrics.bloodPressure.diastolic}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Good
                      </Badge>
                    </div>

                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Scale className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">Weight</span>
                      </div>
                      <div className="text-xl font-bold text-orange-900">{healthMetrics.weight.current} lbs</div>
                      <Badge variant="secondary" className="text-xs">
                        -3 lbs
                      </Badge>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Thermometer className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Temperature</span>
                      </div>
                      <div className="text-xl font-bold text-green-900">{healthMetrics.temperature.current}°F</div>
                      <Badge variant="secondary" className="text-xs">
                        Normal
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="space-y-6">
            <VitalSignsChart healthMetrics={healthMetrics} />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityTracker todayStats={todayStats} dailyGoals={dailyGoals} />
          </TabsContent>

          <TabsContent value="water" className="space-y-6">
            <WaterTracker
              currentIntake={waterIntake}
              dailyGoal={dailyGoals.water}
              onAddGlass={addWaterGlass}
              onRemoveGlass={() => setWaterIntake(Math.max(0, waterIntake - 1))}
            />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <HealthInsights healthMetrics={healthMetrics} todayStats={todayStats} dailyGoals={dailyGoals} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
