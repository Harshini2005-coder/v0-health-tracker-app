"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pill, Clock, CheckCircle, MoreVertical, Edit, Trash2, Calendar } from "lucide-react"

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

interface MedicineCardProps {
  medicine: Medicine
  onTake: () => void
  onDelete: () => void
  showFullDetails?: boolean
}

export function MedicineCard({ medicine, onTake, onDelete, showFullDetails = false }: MedicineCardProps) {
  const completionRate = Math.round((medicine.takenDoses / medicine.totalDoses) * 100)
  const nextDoseTime = medicine.times[0] // Simplified - would be more complex in real app

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full bg-${medicine.color}-500`} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Pill className={`w-5 h-5 text-${medicine.color}-600`} />
            <div>
              <CardTitle className="text-lg">{medicine.name}</CardTitle>
              <CardDescription>{medicine.dosage}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{medicine.frequency}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {nextDoseTime}
          </Badge>
        </div>

        {showFullDetails && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">
                  {medicine.takenDoses}/{medicine.totalDoses}
                </span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>

            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Instructions:</p>
              <p>{medicine.instructions}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Started {new Date(medicine.startDate).toLocaleDateString()}</span>
            </div>
          </>
        )}

        <div className="flex gap-2">
          <Button onClick={onTake} className="flex-1 gap-2" size="sm">
            <CheckCircle className="w-4 h-4" />
            Take Now
          </Button>
          <Button variant="outline" size="sm">
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
