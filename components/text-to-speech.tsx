"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

interface TextToSpeechProps {
  text: string
  className?: string
  size?: "sm" | "default" | "lg"
}

export function TextToSpeech({ text, className, size = "sm" }: TextToSpeechProps) {
  const { speak, isSupported } = useLanguage()
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleSpeak = () => {
    if (!isSupported) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      setIsSpeaking(true)
      speak(text)

      // Reset speaking state when speech ends
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
    }
  }

  if (!isSupported) return null

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleSpeak}
      className={className}
      title={isSpeaking ? "Stop speaking" : "Read aloud"}
    >
      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </Button>
  )
}
