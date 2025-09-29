"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, XCircle } from "lucide-react"

interface Medicine {
  id: string
  name: string
  dosage: string
  frequency: string
  times: string[]
  startDate: string
  endDate?: string
  instructions: string
  color: string
  taken: boolean[]
  totalDoses: number
  takenDoses: number
}

interface MedicineHistoryProps {
  medicines: Medicine[]
}

export function MedicineHistory({ medicines }: MedicineHistoryProps) {
  // Generate mock history data for the last 7 days
  const generateHistory = () => {
    const history = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const dayHistory = {
        date: date.toDateString(),
        medicines: medicines.map((med) => ({
          ...med,
          scheduled: med.times.length,
          taken: Math.floor(Math.random() * (med.times.length + 1)),
          missed: Math.max(0, med.times.length - Math.floor(Math.random() * (med.times.length + 1))),
        })),
      }

      history.push(dayHistory)
    }

    return history
  }

  const history = generateHistory()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Medicine History
          </CardTitle>
          <CardDescription>Your medication adherence over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {history.map((day, index) => (
              <div key={index} className="border-l-2 border-gray-200 pl-4 relative">
                <div className="absolute -left-2 top-0 w-4 h-4 bg-white border-2 border-gray-300 rounded-full" />
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {index === 6 ? "Today" : index === 5 ? "Yesterday" : day.date}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {day.medicines.reduce((acc, med) => acc + med.taken, 0)} of{" "}
                    {day.medicines.reduce((acc, med) => acc + med.scheduled, 0)} doses taken
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {day.medicines.map((medicine) => (
                    <div key={medicine.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-${medicine.color}-500`} />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{medicine.name}</p>
                          <p className="text-xs text-gray-600">{medicine.dosage}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {medicine.taken > 0 && (
                          <Badge variant="secondary" className="gap-1 text-xs">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            {medicine.taken}
                          </Badge>
                        )}
                        {medicine.missed > 0 && (
                          <Badge variant="destructive" className="gap-1 text-xs">
                            <XCircle className="w-3 h-3" />
                            {medicine.missed}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Summary</CardTitle>
          <CardDescription>Your medication adherence statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {history.reduce((acc, day) => acc + day.medicines.reduce((acc2, med) => acc2 + med.taken, 0), 0)}
              </div>
              <p className="text-sm text-gray-600">Total Doses Taken</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {history.reduce((acc, day) => acc + day.medicines.reduce((acc2, med) => acc2 + med.missed, 0), 0)}
              </div>
              <p className="text-sm text-gray-600">Doses Missed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round(
                  (history.reduce((acc, day) => acc + day.medicines.reduce((acc2, med) => acc2 + med.taken, 0), 0) /
                    history.reduce(
                      (acc, day) => acc + day.medicines.reduce((acc2, med) => acc2 + med.scheduled, 0),
                      0,
                    )) *
                    100,
                )}
                %
              </div>
              <p className="text-sm text-gray-600">Adherence Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
