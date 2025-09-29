"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, FileText, Scan, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface PrescriptionData {
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    instructions: string
  }>
  doctorName?: string
  patientName?: string
  date?: string
  pharmacy?: string
}

interface PrescriptionScannerProps {
  onScanComplete: (data: string) => void
}

export function PrescriptionScanner({ onScanComplete }: PrescriptionScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<PrescriptionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setIsScanning(true)
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      // Simulate prescription scanning with AI
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Mock prescription data - in real app, this would use AI vision API
      const mockData: PrescriptionData = {
        medications: [
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
            instructions: "Take with or without food. Do not skip doses.",
          },
          {
            name: "Metformin",
            dosage: "500mg",
            frequency: "Twice daily",
            instructions: "Take with meals to reduce stomach upset.",
          },
        ],
        doctorName: "Dr. Sarah Johnson",
        patientName: "Alex Johnson",
        date: new Date().toLocaleDateString(),
        pharmacy: "HealthCare Pharmacy",
      }

      setScannedData(mockData)
      onScanComplete(JSON.stringify(mockData, null, 2))
    } catch (err) {
      setError("Failed to scan prescription. Please try again with a clearer image.")
    } finally {
      setIsScanning(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const resetScanner = () => {
    setScannedData(null)
    setPreviewImage(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-blue-600" />
            Prescription Scanner
          </CardTitle>
          <CardDescription>
            Upload or take a photo of your prescription to get detailed medication information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!scannedData && !isScanning && (
            <div className="space-y-4">
              {/* Upload Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-32 flex-col gap-3 bg-gradient-to-br from-blue-500 to-blue-600"
                  size="lg"
                >
                  <Upload className="w-8 h-8" />
                  <span>Upload from Gallery</span>
                </Button>

                <Button
                  onClick={() => cameraInputRef.current?.click()}
                  className="h-32 flex-col gap-3 bg-gradient-to-br from-green-500 to-green-600"
                  size="lg"
                >
                  <Camera className="w-8 h-8" />
                  <span>Take Photo</span>
                </Button>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Tips */}
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tips for best results:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• Ensure good lighting and clear image quality</li>
                    <li>• Include the entire prescription in the frame</li>
                    <li>• Avoid shadows and glare on the document</li>
                    <li>• Make sure text is readable and not blurry</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Scanning State */}
          {isScanning && (
            <div className="text-center py-8">
              {previewImage && (
                <div className="mb-6">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Prescription preview"
                    className="max-w-md mx-auto rounded-lg shadow-lg"
                  />
                </div>
              )}
              <div className="flex items-center justify-center gap-3 mb-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="text-lg font-medium">Analyzing prescription...</span>
              </div>
              <p className="text-gray-600">Our AI is extracting medication information from your prescription</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Scanned Results */}
          {scannedData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Prescription scanned successfully!</span>
                </div>
                <Button variant="outline" onClick={resetScanner} size="sm">
                  Scan Another
                </Button>
              </div>

              {/* Prescription Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Prescription Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {scannedData.patientName && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Patient:</span>
                        <p className="font-medium">{scannedData.patientName}</p>
                      </div>
                    )}
                    {scannedData.doctorName && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Doctor:</span>
                        <p className="font-medium">{scannedData.doctorName}</p>
                      </div>
                    )}
                    {scannedData.date && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Date:</span>
                        <p className="font-medium">{scannedData.date}</p>
                      </div>
                    )}
                    {scannedData.pharmacy && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Pharmacy:</span>
                        <p className="font-medium">{scannedData.pharmacy}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Medications Found</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="mb-3">
                      {scannedData.medications.length} medication(s) detected
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Medications List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Medication Details</h3>
                {scannedData.medications.map((medication, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Medication</span>
                          <p className="font-bold text-lg text-blue-900">{medication.name}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Dosage</span>
                          <p className="font-medium">{medication.dosage}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Frequency</span>
                          <p className="font-medium">{medication.frequency}</p>
                        </div>
                      </div>
                      {medication.instructions && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <span className="text-sm font-medium text-yellow-800">Instructions:</span>
                          <p className="text-sm text-yellow-700 mt-1">{medication.instructions}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 gap-2">
                  <FileText className="w-4 h-4" />
                  Add to Medicine Tracker
                </Button>
                <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                  <AlertCircle className="w-4 h-4" />
                  Check Interactions
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
