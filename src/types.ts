export type UIStage = 1 | 2 | 3; // 1: Mild/Standard, 2: Moderate/Simplified, 3: Advanced/Ultra-Simple

export type AppView = 
  | 'elder' 
  | 'caregiver' 
  | 'doctor' 
  | 'memory-hub' 
  | 'music-games' 
  | 'companion-dost' 
  | 'audio-diary' 
  | 'jan-aushadhi' 
  | 'asha-connect' 
  | 'telemedicine' 
  | 'smart-home' 
  | 'geofence';

export type SupportedLanguageCode = 
  | 'hi' // Hindi
  | 'en' // English
  | 'bn' // Bengali
  | 'te' // Telugu
  | 'mr' // Marathi
  | 'ta' // Tamil
  | 'ur' // Urdu
  | 'gu' // Gujarati
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'or' // Odia
  | 'pa' // Punjabi
  | 'as' // Assamese
  | 'mai' // Maithili
  | 'sat' // Santali
  | 'ks' // Kashmiri
  | 'ne' // Nepali
  | 'gom' // Konkani
  | 'sd' // Sindhi
  | 'doi' // Dogri
  | 'mni' // Manipuri
  | 'brx' // Bodo
  | 'sa'; // Sanskrit

export interface LanguageInfo {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  script: string;
  region: string;
}

export type UserRole = 'senior' | 'caregiver' | 'doctor' | 'asha';

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  role: UserRole;
  age: number;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  bloodGroup?: string;
  city?: string;
  language: SupportedLanguageCode;
  stage: UIStage;
  emergencyPhone?: string;
  emergencyContactName?: string;
  isLoggedIn: boolean;
  avatarUrl?: string;
}

export interface ElderProfile {
  id: string;
  name: string;
  nickname: string;
  age: number;
  stage: UIStage;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  language: SupportedLanguageCode | string;
  avatarUrl: string;
  homeAddress: string;
  homeCoordinates: { lat: number; lng: number };
  emergencyContacts: EmergencyContact[];
  bloodGroup: string;
  allergies: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
  photoUrl: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  titleHindi: string;
  category: 'med' | 'water' | 'food' | 'walk' | 'doctor' | 'rest';
  time: string; // "08:30"
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  dosage?: string;
  instructions?: string;
  instructionsHindi?: string;
  voiceNoteUrl?: string;
  recordedBy?: string; // e.g. "Rohan (Son)"
  audioPromptText: string;
  takenToday: boolean;
  takenAt?: string;
  iconName: string;
  pillColor?: string;
}

export interface MemoryMember {
  id: string;
  name: string;
  relation: string;
  relationHindi: string;
  photoUrl: string;
  voiceNoteAudio?: string;
  voiceMessageText: string;
  storyCues: string[];
  phoneNumber?: string;
  lastVisited?: string;
}

export type FamilyMember = MemoryMember;

export interface AudioDiaryEntry {
  id: string;
  date: string;
  time: string;
  durationSeconds: number;
  transcriptHindi: string;
  moodSummary: string;
  sentiment: string;
  sentimentScore: number;
}

export interface DoctorNote {
  id: string;
  doctorName: string;
  date: string;
  note: string;
  priority: 'high' | 'normal' | 'low';
  acknowledgedByCaregiver: boolean;
}

export interface EmotionLog {
  id: string;
  date: string;
  time: string;
  userUtterance: string;
  detectedEmotion: string;
  sentimentScore: number;
  aiAnalysis: string;
}

export interface ClassicSong {
  id: string;
  title: string;
  artist: string;
  era: string;
  moodTag: 'Calm' | 'Joyful' | 'Devotional' | 'Nostalgic';
  audioSnippetUrl?: string;
  lyricsSnippet: string;
  coverArt: string;
  raag?: string;
  durationSeconds?: number;
  fullLyrics?: string[];
  singerStoryHindi?: string;
}

export interface ColorBellItem {
  id: number;
  name: string;
  nameHindi: string;
  note: string; // Indian Sargam note (Sa, Re, Ga, Pa)
  colorClass: string;
  activeColorClass: string;
  borderClass: string;
  freq: number;
}

export interface WordPuzzleItem {
  id: string;
  image: string;
  category: string;
  answerHindi: string;
  answerEnglish: string;
  hintHindi: string;
  factHindi: string;
  scrambledLetters: string[];
}

export interface GeofenceEvent {
  id: string;
  timestamp: string;
  type: 'exit' | 'entry' | 'warning';
  distanceMeters: number;
  latitude: number;
  longitude: number;
  status: 'active' | 'resolved';
  resolvedBy?: string;
}

export interface AudioDiaryRecord {
  id: string;
  timestamp: string;
  dateStr: string;
  transcript: string;
  mood: 'Happy' | 'Peaceful' | 'Nostalgic' | 'Tired' | 'Emotional';
  audioDuration: number;
  isFavorite: boolean;
}

export interface SmartHomeDevice {
  id: string;
  name: string;
  nameHindi: string;
  room: string;
  type: 'light' | 'fan' | 'nightlight' | 'thermostat' | 'geyser';
  isOn: boolean;
  value?: string | number;
  scheduleDescription: string;
  icon: string;
}

export interface HealthVitalLog {
  id: string;
  date: string;
  time: string;
  bpSystolic: number;
  bpDiastolic: number;
  bloodSugarFasting?: number;
  bloodSugarPostMeal?: number;
  pulseRate: number;
  sleepHours: number;
  moodRating: 1 | 2 | 3 | 4 | 5;
  adherencePercentage: number;
  loggedBy: 'Patient' | 'Caregiver' | 'ASHA Worker' | 'Doctor';
  notes?: string;
}

export interface AshaWorker {
  id: string;
  name: string;
  villageWard: string;
  phone: string;
  subCenter: string;
  photoUrl: string;
  nextScheduledVisit: string;
  recentVitalsReviewed: boolean;
  emergencyHelpline: string;
}

export interface JanAushadhiKendraItem {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  phone: string;
  timings: string;
  rating: number;
  lat: number;
  lng: number;
  availableStockCount: number;
}

export interface GenericMedicineItem {
  id: string;
  brandedName: string;
  brandedCompany: string;
  genericSalt: string;
  brandedPrice10Tablets: number;
  janAushadhiPrice10Tablets: number;
  savingsPercentage: number;
  category: string;
  janAushadhiCode: string;
  inStock: boolean;
  dosageAdvice: string;
}

export interface TelemedicineDoc {
  id: string;
  name: string;
  specialty: string;
  degree: string;
  experienceYears: number;
  availableTime: string;
  consultationFeeINR: number;
  photoUrl: string;
  languages: string[];
  rating: number;
}
