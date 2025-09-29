"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useUser } from "@/contexts/user-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  Camera,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ArrowLeft,
  Bot,
  User,
  FileText,
  Pill,
  AlertCircle,
  CheckCircle,
  Heart,
  Activity,
  Calendar,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { PrescriptionScanner } from "@/components/prescription-scanner"
import { VoiceControls } from "@/components/voice-controls"

export default function AIChatPage() {
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { user } = useUser()

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai-chat" }),
    body: {
      userProfile: user,
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && status !== "in_progress") {
      sendMessage({ text: inputValue })
      setInputValue("")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        sendMessage({
          text: "I've uploaded a prescription image. Please analyze it and provide guidance.",
          experimental_attachments: [
            {
              name: file.name,
              contentType: file.type,
              url: imageData,
            },
          ],
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const quickQuestions = user
    ? [
        `What are the side effects of ${user.currentMedications?.[0]?.name || "my blood pressure medication"}?`,
        `Can I take ibuprofen with my current medications (${user.currentMedications?.map((m) => m.name).join(", ")})?`,
        `How should I manage my ${user.medicalConditions.split(",")[0]?.trim() || "condition"} better?`,
        `What foods should I avoid with my ${user.allergies} allergy?`,
        "What should I do if I miss a dose?",
        `Given my ${user.medicalConditions}, what symptoms should I watch for?`,
        "How should I prepare for my next doctor appointment?",
        `What lifestyle changes can help with ${user.medicalConditions.split(",")[0]?.trim() || "my condition"}?`,
      ]
    : [
        "What are the side effects of my blood pressure medication?",
        "When should I take my diabetes medication?",
        "Can I take ibuprofen with my current medications?",
        "What should I do if I miss a dose?",
        "How should I store my medications?",
        "What foods should I avoid with my medications?",
      ]

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "kn", name: "Kannada", flag: "🇮🇳" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "de", name: "German", flag: "🇩🇪" },
  ]

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
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
              {user && <span className="text-sm text-gray-600">Hello, {user.firstName}!</span>}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              <Badge variant="secondary" className="gap-1">
                <Bot className="w-3 h-3" />
                AI Assistant
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Health Assistant {user ? `for ${user.firstName}` : ""}
          </h1>
          <p className="text-gray-600">
            Get instant help with your medications, scan prescriptions, and ask health questions
            {user && user.medicalConditions && (
              <span className="block text-sm mt-1">Managing: {user.medicalConditions}</span>
            )}
          </p>
        </div>

        {user && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Your Health Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-blue-500" />
                  <span>{user.currentMedications?.length || 0} Medications</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span>Blood Type: {user.bloodType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span>{user.allergies ? "Has Allergies" : "No Known Allergies"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span>{user.appointments?.length || 0} Upcoming</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
            <TabsTrigger value="scanner">Prescription Scanner</TabsTrigger>
            <TabsTrigger value="voice">Voice Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-3">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-blue-600" />
                      Health Assistant Chat
                    </CardTitle>
                    <CardDescription>
                      Ask questions about your medications, symptoms, or health concerns
                    </CardDescription>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <Bot className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Welcome {user?.firstName ? `${user.firstName}` : ""} to your AI Health Assistant!
                        </h3>
                        <p className="text-gray-600 mb-4">
                          I can help you with medication questions, prescription analysis, and health guidance
                          {user && user.medicalConditions && (
                            <span className="block mt-2 text-sm">
                              I'm aware of your {user.medicalConditions} and current medications.
                            </span>
                          )}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Badge variant="secondary">Personalized Advice</Badge>
                          <Badge variant="secondary">Medication Info</Badge>
                          <Badge variant="secondary">Drug Interactions</Badge>
                          <Badge variant="secondary">Health Monitoring</Badge>
                        </div>
                      </div>
                    )}

                    {messages.map((message) => (
                      <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                        <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              message.role === "user" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                            }`}
                          >
                            {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div
                            className={`p-3 rounded-lg ${
                              message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {message.parts.map((part, index) => {
                              if (part.type === "text") {
                                return (
                                  <div key={index} className="whitespace-pre-wrap">
                                    {part.text}
                                    {message.role === "assistant" && (
                                      <div className="flex gap-2 mt-2">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => speakMessage(part.text)}
                                          disabled={isSpeaking}
                                          className="h-6 px-2 text-xs"
                                        >
                                          {isSpeaking ? (
                                            <VolumeX className="w-3 h-3" />
                                          ) : (
                                            <Volume2 className="w-3 h-3" />
                                          )}
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )
                              }
                              return null
                            })}
                          </div>
                        </div>
                      </div>
                    ))}

                    {status === "in_progress" && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                            <span className="text-sm text-gray-600 ml-2">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  {/* Input */}
                  <div className="border-t p-4">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <div className="flex-1 relative">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Ask about your medications or health..."
                          disabled={status === "in_progress"}
                          className="pr-20"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-6 w-6 p-0"
                          >
                            <Camera className="w-3 h-3" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsListening(!isListening)}
                            className="h-6 w-6 p-0"
                          >
                            {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                      <Button type="submit" disabled={!inputValue.trim() || status === "in_progress"} className="gap-2">
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </Card>
              </div>

              {/* Quick Questions */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{user ? "Personalized Questions" : "Quick Questions"}</CardTitle>
                    <CardDescription>
                      {user ? "Based on your health profile" : "Common medication questions"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start h-auto p-3 text-xs bg-transparent"
                        onClick={() => {
                          setInputValue(question)
                          sendMessage({ text: question })
                        }}
                        disabled={status === "in_progress"}
                      >
                        {question}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">AI Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>Personalized for you</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Pill className="w-4 h-4 text-blue-500" />
                      <span>Your medication info</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-green-500" />
                      <span>Prescription analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span>Drug interactions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>Condition management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Health guidance</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scanner" className="space-y-6">
            <PrescriptionScanner onScanComplete={(data) => sendMessage({ text: `Prescription scanned: ${data}` })} />
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <VoiceControls
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              onVoiceInput={(text) => {
                setInputValue(text)
                sendMessage({ text })
              }}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
