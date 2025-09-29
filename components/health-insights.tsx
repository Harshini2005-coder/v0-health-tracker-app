"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Heart,
  Activity,
  Droplets,
  Target,
} from "lucide-react"

interface HealthInsightsProps {
  healthMetrics: any
  todayStats: any
  dailyGoals: any
}

export function HealthInsights({ healthMetrics, todayStats, dailyGoals }: HealthInsightsProps) {
  const insights = [
    {
      type: "positive",
      title: "Great Heart Rate Consistency",
      description: "Your heart rate has been stable within the normal range for the past week.",
      icon: Heart,
      color: "green",
    },
    {
      type: "suggestion",
      title: "Increase Water Intake",
      description: "You're averaging 6 glasses per day. Try to reach your 8-glass goal for better hydration.",
      icon: Droplets,
      color: "blue",
    },
    {
      type: "achievement",
      title: "Weight Loss Progress",
      description: "You've lost 3 pounds this month! Keep up the great work with your fitness routine.",
      icon: TrendingDown,
      color: "green",
    },
    {
      type: "warning",
      title: "Sleep Pattern Attention",
      description: "Your sleep has been below 8 hours for 3 consecutive days. Consider improving sleep hygiene.",
      icon: AlertTriangle,
      color: "orange",
    },
  ]

  const recommendations = [
    {
      category: "Hydration",
      suggestion: "Set hourly water reminders to reach your daily goal",
      priority: "high",
    },
    {
      category: "Activity",
      suggestion: "Add 10-minute walks after meals to increase daily steps",
      priority: "medium",
    },
    {
      category: "Sleep",
      suggestion: "Establish a consistent bedtime routine for better sleep quality",
      priority: "high",
    },
    {
      category: "Nutrition",
      suggestion: "Track your meals to ensure balanced nutrition with your medications",
      priority: "medium",
    },
  ]

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "achievement":
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case "suggestion":
        return <Lightbulb className="w-5 h-5 text-blue-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      default:
        return <Lightbulb className="w-5 h-5 text-gray-600" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive":
      case "achievement":
        return "border-green-200 bg-green-50"
      case "suggestion":
        return "border-blue-200 bg-blue-50"
      case "warning":
        return "border-orange-200 bg-orange-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Health Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Health Insights
          </CardTitle>
          <CardDescription>AI-powered analysis of your health data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-700">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>Tailored suggestions to improve your health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{rec.category}</span>
                    <Badge variant="secondary" className={getPriorityColor(rec.priority)}>
                      {rec.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{rec.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Overall Health Score
          </CardTitle>
          <CardDescription>Your comprehensive health rating based on all metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 rounded-full border-8 border-gray-200" />
              <div
                className="absolute inset-0 rounded-full border-8 border-green-500 transition-all duration-500"
                style={{ clipPath: "polygon(0 15%, 100% 15%, 100% 100%, 0% 100%)" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">85</div>
                  <div className="text-sm text-gray-600">/ 100</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-green-600">Excellent Health</h3>
              <p className="text-sm text-gray-600">
                You're maintaining great health habits! Keep up the excellent work with your medication adherence and
                activity levels.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">92%</div>
                <p className="text-xs text-gray-600">Medicine Adherence</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">78%</div>
                <p className="text-xs text-gray-600">Activity Goals</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">85%</div>
                <p className="text-xs text-gray-600">Vital Signs</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">88%</div>
                <p className="text-xs text-gray-600">Lifestyle</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Alerts */}
      <div className="space-y-3">
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Medication Reminder:</strong> Don't forget to take your evening blood pressure medication at 6:00
            PM.
          </AlertDescription>
        </Alert>

        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Health Tip:</strong> Your heart rate variability suggests good cardiovascular health. Consider
            adding meditation to maintain this trend.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
