"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/contexts/language-context"
import { useUser } from "@/contexts/user-context"
import { LanguageSelector } from "@/components/language-selector"
import { TextToSpeech } from "@/components/text-to-speech"
import { EmergencyActionsDialog } from "@/components/emergency-actions-dialog"
import { ChildSupportDialog } from "@/components/child-support-dialog"
import { FamilyCareDialog } from "@/components/family-care-dialog"
import { FitnessTrackerDialog } from "@/components/fitness-tracker-dialog"
import { TodaysMedicinesDialog } from "@/components/todays-medicines-dialog"
import { QuickActionsDialog } from "@/components/quick-actions-dialog"
import { UpcomingAppointmentsDialog } from "@/components/upcoming-appointments-dialog"
import { WaterIntakeTracker } from "@/components/water-intake-tracker"
import { MedicineTracker } from "@/components/medicine-tracker"
import { HeartRateTracker } from "@/components/heart-rate-tracker"
import { StepsTracker } from "@/components/steps-tracker"
import {
  Heart,
  Pill,
  Droplets,
  Calendar,
  MessageCircle,
  Camera,
  Activity,
  Clock,
  Bell,
  TrendingUp,
  AlertTriangle,
  Baby,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function HealthDashboard() {
  const { translate } = useLanguage()
  const { user } = useUser()
  const router = useRouter()

  const waterGoal = user?.healthGoals.find((goal) => goal.type === "water")
  const stepsGoal = user?.healthGoals.find((goal) => goal.type === "steps")
  const latestHeartRate = user?.vitalSigns.find((vital) => vital.type === "heart_rate")

  const todayStats = {
    waterGoal: waterGoal?.target || 8,
    waterCurrent: waterGoal?.current || 0,
    medicinesCompleted: 0, // This would be calculated from taken medicines
    medicinesTotal: user?.currentMedications.length || 0,
    heartRate: latestHeartRate?.value || 72,
    steps: stepsGoal?.current || 0,
    stepsGoal: stepsGoal?.target || 10000,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Arogya Mitra</h1>
                <p className="text-sm text-gray-600">Your Medical Companion</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Bell className="w-4 h-4" />
                <Badge variant="destructive" className="w-2 h-2 p-0 rounded-full" />
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 gap-2"
                onClick={() => router.push("/ai-chat")}
              >
                <MessageCircle className="w-4 h-4" />
                {translate("nav.chat")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {translate("dashboard.welcome")}, {user?.firstName || "Alex"}!
            </h2>
            <TextToSpeech text={`${translate("dashboard.welcome")}, ${user?.firstName || "Alex"}!`} />
          </div>
          <p className="text-gray-600 text-lg">Here's your health summary for today</p>
        </div>

        {/* Quick Stats - Now Interactive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <WaterIntakeTracker>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
                  {translate("dashboard.waterIntake")}
                </CardTitle>
                <Droplets className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">
                  {todayStats.waterCurrent}/{todayStats.waterGoal}
                </div>
                <p className="text-xs text-blue-600 mb-2">glasses today</p>
                <Progress value={(todayStats.waterCurrent / todayStats.waterGoal) * 100} className="h-2" />
              </CardContent>
            </Card>
          </WaterIntakeTracker>

          <MedicineTracker>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">{translate("nav.medicines")}</CardTitle>
                <Pill className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">
                  {todayStats.medicinesCompleted}/{todayStats.medicinesTotal}
                </div>
                <p className="text-xs text-green-600 mb-2">taken today</p>
                <Progress
                  value={
                    todayStats.medicinesTotal > 0
                      ? (todayStats.medicinesCompleted / todayStats.medicinesTotal) * 100
                      : 0
                  }
                  className="h-2"
                />
              </CardContent>
            </Card>
          </MedicineTracker>

          <HeartRateTracker>
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-700">{translate("dashboard.heartRate")}</CardTitle>
                <Heart className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900">{todayStats.heartRate}</div>
                <p className="text-xs text-red-600">BPM</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">Normal</span>
                </div>
              </CardContent>
            </Card>
          </HeartRateTracker>

          <StepsTracker>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">{translate("dashboard.steps")}</CardTitle>
                <Activity className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{todayStats.steps.toLocaleString()}</div>
                <p className="text-xs text-purple-600">steps today</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">
                    {Math.round((todayStats.steps / todayStats.stepsGoal) * 100)}% of goal
                  </span>
                </div>
              </CardContent>
            </Card>
          </StepsTracker>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Medicines */}
          <TodaysMedicinesDialog>
            <Card className="lg:col-span-1 cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  {translate("dashboard.todaysMedicines")}
                </CardTitle>
                <CardDescription>Manage your daily medications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user?.currentMedications.slice(0, 2).map((medicine, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{medicine.name}</p>
                      <p className="text-sm text-gray-600">
                        {medicine.dosage} • {medicine.frequency}
                      </p>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Pill className="w-3 h-3" />
                      Pending
                    </Badge>
                  </div>
                ))}
                {(!user?.currentMedications || user.currentMedications.length === 0) && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-2">No medicines added yet</p>
                    <p className="text-sm text-gray-400">Click to add your first medicine</p>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <p className="text-sm text-blue-600 font-medium">Click to manage all medicines →</p>
                </div>
              </CardContent>
            </Card>
          </TodaysMedicinesDialog>

          {/* Quick Actions */}
          <QuickActionsDialog>
            <Card className="lg:col-span-1 cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access your health tools instantly</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg">
                  <Camera className="w-6 h-6" />
                  <span className="text-sm">{translate("chat.scanPrescription")}</span>
                </div>
                <div className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg">
                  <Droplets className="w-6 h-6" />
                  <span className="text-sm">{translate("health.addWater")}</span>
                </div>
                <div className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg">
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-sm">{translate("nav.chat")}</span>
                </div>
                <div className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg">
                  <Activity className="w-6 h-6" />
                  <span className="text-sm">Health Log</span>
                </div>
              </CardContent>
            </Card>
          </QuickActionsDialog>

          {/* Upcoming Appointments */}
          <UpcomingAppointmentsDialog>
            <Card className="lg:col-span-1 cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  {translate("dashboard.upcomingAppointment")}
                </CardTitle>
                <CardDescription>Your scheduled doctor visits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user?.appointments.slice(0, 2).map((appointment, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                        <p className="text-sm text-blue-600 font-medium">
                          {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">{appointment.status}</Badge>
                    </div>
                  </div>
                ))}
                {(!user?.appointments || user.appointments.length === 0) && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-2">No appointments scheduled</p>
                    <p className="text-sm text-gray-400">Click to schedule your first appointment</p>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <p className="text-sm text-green-600 font-medium">Click to manage appointments →</p>
                </div>
              </CardContent>
            </Card>
          </UpcomingAppointmentsDialog>
        </div>

        {/* New Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <EmergencyActionsDialog>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-red-900 mb-2">Emergency Actions</h3>
                <p className="text-sm text-red-700">Quick access to emergency contacts and alerts</p>
              </CardContent>
            </Card>
          </EmergencyActionsDialog>

          <ChildSupportDialog>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Baby className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-pink-900 mb-2">Child Support</h3>
                <p className="text-sm text-pink-700">Manage your children's health information</p>
              </CardContent>
            </Card>
          </ChildSupportDialog>

          <FamilyCareDialog>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-purple-900 mb-2">Family Care</h3>
                <p className="text-sm text-purple-700">Coordinate care for family members</p>
              </CardContent>
            </Card>
          </FamilyCareDialog>

          <FitnessTrackerDialog>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-green-900 mb-2">Fitness Tracker</h3>
                <p className="text-sm text-green-700">Track workouts and fitness goals</p>
              </CardContent>
            </Card>
          </FitnessTrackerDialog>
        </div>

        {/* AI Assistant Prompt */}
        <Card className="mt-8 bg-gradient-to-br from-blue-500 to-green-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Need Health Guidance?</h3>
                <p className="text-blue-100">
                  Ask our AI assistant about your medications, symptoms, or health questions
                </p>
              </div>
              <Button size="lg" variant="secondary" className="gap-2" onClick={() => router.push("/ai-chat")}>
                <MessageCircle className="w-5 h-5" />
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
