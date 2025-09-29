"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, Settings } from "lucide-react"

interface VoiceControlsProps {
  selectedLanguage: string
  onLanguageChange: (language: string) => void
  onVoiceInput: (text: string) => void
}

export function VoiceControls({ selectedLanguage, onLanguageChange, onVoiceInput }: VoiceControlsProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  const languages = [
    { code: "en-US", name: "English (US)", flag: "🇺🇸" },
    { code: "fr-FR", name: "French", flag: "🇫🇷" },
    { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
    { code: "kn-IN", name: "Kannada", flag: "🇮🇳" },
    { code: "it-IT", name: "Italian", flag: "🇮🇹" },
    { code: "es-ES", name: "Spanish", flag: "🇪🇸" },
    { code: "de-DE", name: "German", flag: "🇩🇪" },
  ]

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = true
        recognitionInstance.interimResults = true
        recognitionInstance.lang = selectedLanguage

        recognitionInstance.onresult = (event) => {
          let finalTranscript = ""
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            }
          }
          if (finalTranscript) {
            setTranscript(finalTranscript)
          }
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [selectedLanguage])

  const startListening = () => {
    if (recognition) {
      setTranscript("")
      setIsListening(true)
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }

  const sendVoiceInput = () => {
    if (transcript.trim()) {
      onVoiceInput(transcript)
      setTranscript("")
    }
  }

  const speakText = (text: string) => {
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

  const testPhrases = [
    "What are the side effects of aspirin?",
    "When should I take my blood pressure medication?",
    "Can I take ibuprofen with my current medications?",
    "How should I store my insulin?",
  ]

  if (!isSupported) {
    return (
      <Alert>
        <AlertDescription>
          Voice controls are not supported in your browser. Please use a modern browser with speech recognition support.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Voice Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-blue-600" />
            Voice Input
          </CardTitle>
          <CardDescription>Speak your questions and get voice responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Voice Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={isListening ? stopListening : startListening}
              className={`w-20 h-20 rounded-full ${
                isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </Button>
          </div>

          <div className="text-center">
            <Badge variant={isListening ? "destructive" : "secondary"}>
              {isListening ? "Listening..." : "Click to speak"}
            </Badge>
          </div>

          {/* Transcript */}
          {transcript && (
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-600 mb-1">You said:</p>
                <p className="font-medium">{transcript}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={sendVoiceInput} className="flex-1 gap-2">
                  <Play className="w-4 h-4" />
                  Send Message
                </Button>
                <Button variant="outline" onClick={() => setTranscript("")}>
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Text-to-Speech */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-green-600" />
            Text-to-Speech
          </CardTitle>
          <CardDescription>Test voice output in different languages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => stopSpeaking()}
              disabled={!isSpeaking}
              variant="outline"
              className="w-16 h-16 rounded-full"
            >
              {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
            </Button>
            <Badge variant={isSpeaking ? "default" : "secondary"}>
              {isSpeaking ? "Speaking..." : "Ready to speak"}
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Test phrases:</p>
            <div className="grid grid-cols-1 gap-2">
              {testPhrases.map((phrase, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => speakText(phrase)}
                  disabled={isSpeaking}
                  className="justify-start text-left h-auto p-3 bg-transparent"
                >
                  <Volume2 className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{phrase}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            Voice Settings
          </CardTitle>
          <CardDescription>Customize your voice experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Speech Rate</label>
              <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="w-full" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Speech Pitch</label>
              <input type="range" min="0" max="2" step="0.1" defaultValue="1" className="w-full" />
            </div>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Voice Tips:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Speak clearly and at a normal pace</li>
                <li>• Use a quiet environment for better recognition</li>
                <li>• Allow microphone access when prompted</li>
                <li>• Try different languages for multilingual support</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
