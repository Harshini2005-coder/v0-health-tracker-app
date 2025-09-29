"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Activity, Scale, Thermometer, Plus, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface HealthMetrics {
  heartRate: {
    current: number
    trend: string
    readings: number[]
  }
  bloodPressure: {
    systolic: number
    diastolic: number
    trend: string
    readings: { systolic: number; diastolic: number }[]
  }
  weight: {
    current: number
    trend: string
    readings: number[]
  }
  temperature: {
    current: number
    trend: string
    readings: number[]
  }
}

interface VitalSignsChartProps {
  healthMetrics: HealthMetrics
}

export function VitalSignsChart({ healthMetrics }: VitalSignsChartProps) {
  // Generate chart data for the last 7 days
  const generateChartData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return days.map((day, index) => ({
      day,
      heartRate: healthMetrics.heartRate.readings[index] || 72,
      weight: healthMetrics.weight.readings[index] || 175,
      temperature: healthMetrics.temperature.readings[index] || 98.6,
      systolic: healthMetrics.bloodPressure.readings[index % 3]?.systolic || 120,
      diastolic: healthMetrics.bloodPressure.readings[index % 3]?.diastolic || 80,
    }))
  }

  const chartData = generateChartData()

  const getStatusColor = (value: number, type: string) => {
    switch (type) {
      case "heartRate":
        if (value >= 60 && value <= 100) return "text-green-600"
        return "text-yellow-600"
      case "bloodPressure":
        if (value <= 120) return "text-green-600"
        if (value <= 140) return "text-yellow-600"
        return "text-red-600"
      case "weight":
        return "text-blue-600"
      case "temperature":
        if (value >= 97 && value <= 99) return "text-green-600"
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Vitals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Heart className="w-5 h-5" />
              Heart Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900 mb-2">{healthMetrics.heartRate.current}</div>
            <p className="text-sm text-red-600 mb-3">BPM</p>
            <Badge variant="secondary" className={getStatusColor(healthMetrics.heartRate.current, "heartRate")}>
              Normal Range
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Activity className="w-5 h-5" />
              Blood Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-2">
              {healthMetrics.bloodPressure.systolic}/{healthMetrics.bloodPressure.diastolic}
            </div>
            <p className="text-sm text-blue-600 mb-3">mmHg</p>
            <Badge
              variant="secondary"
              className={getStatusColor(healthMetrics.bloodPressure.systolic, "bloodPressure")}
            >
              Good
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Scale className="w-5 h-5" />
              Weight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-2">{healthMetrics.weight.current}</div>
            <p className="text-sm text-orange-600 mb-3">lbs</p>
            <Badge variant="secondary" className="text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              -3 lbs
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Thermometer className="w-5 h-5" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-2">{healthMetrics.temperature.current}</div>
            <p className="text-sm text-green-600 mb-3">°F</p>
            <Badge variant="secondary" className={getStatusColor(healthMetrics.temperature.current, "temperature")}>
              Normal
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Heart Rate Trend
              </span>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                Add Reading
              </Button>
            </CardTitle>
            <CardDescription>Your heart rate over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="heartRate" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-orange-600" />
                Weight Trend
              </span>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                Add Reading
              </Button>
            </CardTitle>
            <CardDescription>Your weight changes over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[170, 180]} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#ea580c" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Blood Pressure
              </span>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                Add Reading
              </Button>
            </CardTitle>
            <CardDescription>Systolic and diastolic pressure</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[70, 140]} />
                <Tooltip />
                <Line type="monotone" dataKey="systolic" stroke="#2563eb" strokeWidth={2} />
                <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-green-600" />
                Temperature
              </span>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                Add Reading
              </Button>
            </CardTitle>
            <CardDescription>Body temperature readings</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis domain={[97, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="temperature" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
