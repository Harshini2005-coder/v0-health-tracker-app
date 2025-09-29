"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
]

type LanguageContextType = {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  translate: (key: string) => string
  speak: (text: string) => void
  isSupported: boolean
  languages: Language[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.medicines": "Medicines",
    "nav.health": "Health",
    "nav.appointments": "Appointments",
    "nav.chat": "AI Assistant",
    "nav.profile": "Profile",

    // Dashboard
    "dashboard.title": "Health Dashboard",
    "dashboard.welcome": "Welcome back",
    "dashboard.todaysMedicines": "Today's Medicines",
    "dashboard.waterIntake": "Water Intake",
    "dashboard.heartRate": "Heart Rate",
    "dashboard.steps": "Steps",
    "dashboard.upcomingAppointment": "Upcoming Appointment",
    "dashboard.scheduleAppointment": "Schedule Appointment",

    // Medicines
    "medicines.title": "Medicine Tracker",
    "medicines.addMedicine": "Add Medicine",
    "medicines.takeMedicine": "Take Medicine",
    "medicines.skipDose": "Skip Dose",
    "medicines.dosage": "Dosage",
    "medicines.frequency": "Frequency",
    "medicines.nextDose": "Next Dose",

    // Health
    "health.title": "Health Monitoring",
    "health.vitals": "Vital Signs",
    "health.activity": "Activity",
    "health.insights": "Health Insights",
    "health.addWater": "Add Water",
    "health.goal": "Goal",
    "health.achieved": "Achieved",

    // AI Chat
    "chat.title": "AI Health Assistant",
    "chat.placeholder": "Ask me about your health, medicines, or scan a prescription...",
    "chat.scanPrescription": "Scan Prescription",
    "chat.voiceInput": "Voice Input",
    "chat.listening": "Listening...",
    "chat.processing": "Processing...",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.today": "Today",
    "common.tomorrow": "Tomorrow",
    "common.yesterday": "Yesterday",
  },
  fr: {
    // Navigation
    "nav.dashboard": "Tableau de bord",
    "nav.medicines": "Médicaments",
    "nav.health": "Santé",
    "nav.appointments": "Rendez-vous",
    "nav.chat": "Assistant IA",
    "nav.profile": "Profil",

    // Dashboard
    "dashboard.title": "Tableau de bord santé",
    "dashboard.welcome": "Bon retour",
    "dashboard.todaysMedicines": "Médicaments d'aujourd'hui",
    "dashboard.waterIntake": "Consommation d'eau",
    "dashboard.heartRate": "Rythme cardiaque",
    "dashboard.steps": "Pas",
    "dashboard.upcomingAppointment": "Prochain rendez-vous",
    "dashboard.scheduleAppointment": "Planifier un rendez-vous",

    // Medicines
    "medicines.title": "Suivi des médicaments",
    "medicines.addMedicine": "Ajouter un médicament",
    "medicines.takeMedicine": "Prendre le médicament",
    "medicines.skipDose": "Ignorer la dose",
    "medicines.dosage": "Dosage",
    "medicines.frequency": "Fréquence",
    "medicines.nextDose": "Prochaine dose",

    // Health
    "health.title": "Surveillance de la santé",
    "health.vitals": "Signes vitaux",
    "health.activity": "Activité",
    "health.insights": "Aperçus santé",
    "health.addWater": "Ajouter de l'eau",
    "health.goal": "Objectif",
    "health.achieved": "Atteint",

    // AI Chat
    "chat.title": "Assistant santé IA",
    "chat.placeholder": "Demandez-moi à propos de votre santé, médicaments, ou scannez une ordonnance...",
    "chat.scanPrescription": "Scanner l'ordonnance",
    "chat.voiceInput": "Entrée vocale",
    "chat.listening": "Écoute...",
    "chat.processing": "Traitement...",

    // Common
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.today": "Aujourd'hui",
    "common.tomorrow": "Demain",
    "common.yesterday": "Hier",
  },
  hi: {
    // Navigation
    "nav.dashboard": "डैशबोर्ड",
    "nav.medicines": "दवाइयां",
    "nav.health": "स्वास्थ्य",
    "nav.appointments": "अपॉइंटमेंट",
    "nav.chat": "AI सहायक",
    "nav.profile": "प्रोफाइल",

    // Dashboard
    "dashboard.title": "स्वास्थ्य डैशबोर्ड",
    "dashboard.welcome": "वापसी पर स्वागत",
    "dashboard.todaysMedicines": "आज की दवाइयां",
    "dashboard.waterIntake": "पानी का सेवन",
    "dashboard.heartRate": "हृदय गति",
    "dashboard.steps": "कदम",
    "dashboard.upcomingAppointment": "आगामी अपॉइंटमेंट",
    "dashboard.scheduleAppointment": "अपॉइंटमेंट शेड्यूल करें",

    // Medicines
    "medicines.title": "दवा ट्रैकर",
    "medicines.addMedicine": "दवा जोड़ें",
    "medicines.takeMedicine": "दवा लें",
    "medicines.skipDose": "खुराक छोड़ें",
    "medicines.dosage": "खुराक",
    "medicines.frequency": "आवृत्ति",
    "medicines.nextDose": "अगली खुराक",

    // Health
    "health.title": "स्वास्थ्य निगरानी",
    "health.vitals": "महत्वपूर्ण संकेत",
    "health.activity": "गतिविधि",
    "health.insights": "स्वास्थ्य अंतर्दृष्टि",
    "health.addWater": "पानी जोड़ें",
    "health.goal": "लक्ष्य",
    "health.achieved": "प्राप्त",

    // AI Chat
    "chat.title": "AI स्वास्थ्य सहायक",
    "chat.placeholder": "अपने स्वास्थ्य, दवाओं के बारे में पूछें या प्रिस्क्रिप्शन स्कैन करें...",
    "chat.scanPrescription": "प्रिस्क्रिप्शन स्कैन करें",
    "chat.voiceInput": "आवाज इनपुट",
    "chat.listening": "सुन रहा है...",
    "chat.processing": "प्रसंस्करण...",

    // Common
    "common.save": "सेव करें",
    "common.cancel": "रद्द करें",
    "common.delete": "हटाएं",
    "common.edit": "संपादित करें",
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि",
    "common.success": "सफलता",
    "common.today": "आज",
    "common.tomorrow": "कल",
    "common.yesterday": "कल",
  },
  kn: {
    // Navigation
    "nav.dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "nav.medicines": "ಔಷಧಿಗಳು",
    "nav.health": "ಆರೋಗ್ಯ",
    "nav.appointments": "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು",
    "nav.chat": "AI ಸಹಾಯಕ",
    "nav.profile": "ಪ್ರೊಫೈಲ್",

    // Dashboard
    "dashboard.title": "ಆರೋಗ್ಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "dashboard.welcome": "ಮರಳಿ ಸ್ವಾಗತ",
    "dashboard.todaysMedicines": "ಇಂದಿನ ಔಷಧಿಗಳು",
    "dashboard.waterIntake": "ನೀರಿನ ಸೇವನೆ",
    "dashboard.heartRate": "ಹೃದಯ ಬಡಿತ",
    "dashboard.steps": "ಹೆಜ್ಜೆಗಳು",
    "dashboard.upcomingAppointment": "ಮುಂಬರುವ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್",
    "dashboard.scheduleAppointment": "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ನಿಗದಿಪಡಿಸಿ",

    // Medicines
    "medicines.title": "ಔಷಧಿ ಟ್ರ್ಯಾಕರ್",
    "medicines.addMedicine": "ಔಷಧಿ ಸೇರಿಸಿ",
    "medicines.takeMedicine": "ಔಷಧಿ ತೆಗೆದುಕೊಳ್ಳಿ",
    "medicines.skipDose": "ಡೋಸ್ ಬಿಟ್ಟುಬಿಡಿ",
    "medicines.dosage": "ಡೋಸೇಜ್",
    "medicines.frequency": "ಆವರ್ತನೆ",
    "medicines.nextDose": "ಮುಂದಿನ ಡೋಸ್",

    // Health
    "health.title": "ಆರೋಗ್ಯ ಮೇಲ್ವಿಚಾರಣೆ",
    "health.vitals": "ಪ್ರಮುಖ ಚಿಹ್ನೆಗಳು",
    "health.activity": "ಚಟುವಟಿಕೆ",
    "health.insights": "ಆರೋಗ್ಯ ಒಳನೋಟಗಳು",
    "health.addWater": "ನೀರು ಸೇರಿಸಿ",
    "health.goal": "ಗುರಿ",
    "health.achieved": "ಸಾಧಿಸಲಾಗಿದೆ",

    // AI Chat
    "chat.title": "AI ಆರೋಗ್ಯ ಸಹಾಯಕ",
    "chat.placeholder": "ನಿಮ್ಮ ಆರೋಗ್ಯ, ಔಷಧಿಗಳ ಬಗ್ಗೆ ಕೇಳಿ ಅಥವಾ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ...",
    "chat.scanPrescription": "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
    "chat.voiceInput": "ಧ್ವನಿ ಇನ್‌ಪುಟ್",
    "chat.listening": "ಕೇಳುತ್ತಿದೆ...",
    "chat.processing": "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸುತ್ತಿದೆ...",

    // Common
    "common.save": "ಉಳಿಸಿ",
    "common.cancel": "ರದ್ದುಮಾಡಿ",
    "common.delete": "ಅಳಿಸಿ",
    "common.edit": "ಸಂಪಾದಿಸಿ",
    "common.loading": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    "common.error": "ದೋಷ",
    "common.success": "ಯಶಸ್ಸು",
    "common.today": "ಇಂದು",
    "common.tomorrow": "ನಾಳೆ",
    "common.yesterday": "ನಿನ್ನೆ",
  },
  it: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.medicines": "Medicinali",
    "nav.health": "Salute",
    "nav.appointments": "Appuntamenti",
    "nav.chat": "Assistente IA",
    "nav.profile": "Profilo",

    // Dashboard
    "dashboard.title": "Dashboard Salute",
    "dashboard.welcome": "Bentornato",
    "dashboard.todaysMedicines": "Medicinali di oggi",
    "dashboard.waterIntake": "Assunzione d'acqua",
    "dashboard.heartRate": "Frequenza cardiaca",
    "dashboard.steps": "Passi",
    "dashboard.upcomingAppointment": "Prossimo appuntamento",
    "dashboard.scheduleAppointment": "Programma appuntamento",

    // Medicines
    "medicines.title": "Tracker Medicinali",
    "medicines.addMedicine": "Aggiungi medicinale",
    "medicines.takeMedicine": "Prendi medicinale",
    "medicines.skipDose": "Salta dose",
    "medicines.dosage": "Dosaggio",
    "medicines.frequency": "Frequenza",
    "medicines.nextDose": "Prossima dose",

    // Health
    "health.title": "Monitoraggio Salute",
    "health.vitals": "Segni vitali",
    "health.activity": "Attività",
    "health.insights": "Approfondimenti salute",
    "health.addWater": "Aggiungi acqua",
    "health.goal": "Obiettivo",
    "health.achieved": "Raggiunto",

    // AI Chat
    "chat.title": "Assistente Salute IA",
    "chat.placeholder": "Chiedimi della tua salute, medicinali, o scansiona una prescrizione...",
    "chat.scanPrescription": "Scansiona prescrizione",
    "chat.voiceInput": "Input vocale",
    "chat.listening": "Ascolto...",
    "chat.processing": "Elaborazione...",

    // Common
    "common.save": "Salva",
    "common.cancel": "Annulla",
    "common.delete": "Elimina",
    "common.edit": "Modifica",
    "common.loading": "Caricamento...",
    "common.error": "Errore",
    "common.success": "Successo",
    "common.today": "Oggi",
    "common.tomorrow": "Domani",
    "common.yesterday": "Ieri",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if speech synthesis is supported
    setIsSupported("speechSynthesis" in window)

    // Load saved language preference
    const savedLang = localStorage.getItem("preferred-language")
    if (savedLang) {
      const lang = languages.find((l) => l.code === savedLang)
      if (lang) setCurrentLanguage(lang)
    }
  }, [])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
    localStorage.setItem("preferred-language", language.code)
  }

  const translate = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations.en[key] || key
  }

  const speak = (text: string) => {
    if (!isSupported) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = currentLanguage.code
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    // Try to find a voice for the current language
    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find((v) => v.lang.startsWith(currentLanguage.code))
    if (voice) utterance.voice = voice

    window.speechSynthesis.speak(utterance)
  }

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        translate,
        speak,
        isSupported,
        languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
