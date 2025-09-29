"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import type { SpeechRecognition } from "types/speech-recognition" // Assuming SpeechRecognition type is defined in a separate file

interface EnhancedVoiceControlsProps {
  onVoiceInput?: (text: string) => void
  onSpeechEnd?: () => void
  className?: string
}

export function EnhancedVoiceControls({ onVoiceInput, onSpeechEnd, className }: EnhancedVoiceControlsProps) {
  const { currentLanguage, speak, isSupported, translate } = useLanguage()
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = currentLanguage.code

      recognitionInstance.onstart = () => {
        setIsListening(true)
      }

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onVoiceInput?.(transcript)
        setIsListening(false)
      }

      recognitionInstance.onerror = () => {
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [currentLanguage.code, onVoiceInput])

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.lang = currentLanguage.code
      recognition.start()
    }
  }

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      setIsSpeaking(true)
      speak(text)

      // Monitor speech end
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => {
        setIsSpeaking(false)
        onSpeechEnd?.()
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
      }
    }
  }

  if (!isSupported) return null

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Voice Input */}
      <div className="relative">
        <Button
          variant={isListening ? "default" : "outline"}
          size="sm"
          onClick={isListening ? stopListening : startListening}
          className="gap-2"
          disabled={!recognition}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          <span className="hidden sm:inline">
            {isListening ? translate("chat.listening") : translate("chat.voiceInput")}
          </span>
        </Button>
        {isListening && (
          <Badge variant="destructive" className="absolute -top-2 -right-2 w-3 h-3 p-0 rounded-full animate-pulse" />
        )}
      </div>

      {/* Text-to-Speech for responses */}
      <Button
        variant={isSpeaking ? "default" : "outline"}
        size="sm"
        onClick={() => handleSpeak("Hello! How can I help you with your health today?")}
        className="gap-2"
      >
        {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        <span className="hidden sm:inline">{isSpeaking ? "Stop" : "Speak"}</span>
      </Button>

      {/* Language indicator */}
      <Badge variant="secondary" className="text-xs">
        {currentLanguage.flag} {currentLanguage.code.toUpperCase()}
      </Badge>
    </div>
  )
}
