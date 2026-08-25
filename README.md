# 🌸 Companio — AI-Enabled Dementia Care & Life Assistant Platform

> **Smart India Hackathon (SIH) 2026 Project**  
> **Problem Statement ID:** SIH26003  
> **Focus Area:** Cognitive Gaming, Memory Assistance & Digital Healthcare Accessibility  

---

## 📌 Project Overview

**Companio** is an inclusive, accessibility-first digital healthcare platform designed to support elderly dementia patients and their caregivers. It bridges the gap between daily cognitive rehabilitation, personal safety, and healthcare management. 

Featuring an **auto-simplifying high-contrast UI**, **100% offline functionality**, **family voice-anchored reminders**, and **rural healthcare integrations (ASHA Workers & Jan Aushadhi Kendras)**, Companio brings digital health accessibility to every home, including remote and rural regions.

---

## 🚀 Key Features

### 👴 Patient View (Elderly-Accessible UI)
* **High Contrast & Stage-Adaptive UI:** Extra-large buttons, clean navigation, and dynamic UI scaling based on dementia progression stages.
* **Family Voice Reminders:** Audio-visual medication alerts recorded in familiar family voices (e.g., *"Dada ji, dawai kha lo"*).
* **100% Offline Memory Hub:** Family photo albums, name recognition, and relationship mapping available without active internet connection.
* **AI Mood & Music Therapy:** Camera-based emotion detection triggering nostalgic music and calming soundscapes.
* **Daily Audio Diary:** Hands-free vocal recording for patients who face difficulty typing.
* **One-Tap Emergency SOS:** Direct single-click emergency alert sending live location coordinates to caregivers.

### 🩺 Rural & Public Health Integrations
* **ASHA Worker Connect:** Direct helpline integration and monthly health check-up tracker (BP/Sugar metrics).
* **PM Jan Aushadhi Kendra Integration:** Generic medicine substitute checker and nearby store locator for affordable healthcare.

### 👨‍👩‍👧 Caregiver & Doctor Remote Portal
* **Remote Schedule & Media Uploads:** Add reminders, family photos, and voice notes remotely.
* **Silent Geofencing & Night Wander Alerts:** Instant alerts if the patient wanders outside home boundary limits or moves unexpectedly during nighttime.
* **Doctor-Shared Reports:** Automated weekly analytics summarizing medication compliance, sleep patterns, and mood trends.

---

## 🏗️ System Architecture

```text
+-----------------------------------------------------------------------------------+
|                                 USER / CLIENT LAYER                               |
|                                                                                   |
|   +------------------------------------+   +----------------------------------+   |
|   |    Elderly Patient Touch Interface |   |   Caregiver / Doctor Dashboard   |   |
|   | - High Contrast UI / Large Targets |   | - Cognitive Metrics & Analytics  |   |
|   | - Offline-First Local Storage      |   | - Real-time Emergency Alerts     |   |
|   +------------------------------------+   +----------------------------------+   |
+------------------------------------------+----------------------------------------+
                                           |
                              REST APIs / WebSockets (TLS)
                                           |
+------------------------------------------v----------------------------------------+
|                                API GATEWAY LAYER                                  |
|  - Rate Limiting & Validation            - Authentication & Role Management       |
|  - Multilingual Speech/Audio Engine      - Sensor Event Handling (Geofencing)     |
+------------------------------------------+----------------------------------------+
                                           |
              +----------------------------+----------------------------+
              |                                                         |
+-------------v---------------------------+   +-------------------------v-----------+
|             CORE BACKEND                |   |                AI ENGINE            |
|                                         |   |                                     |
|  +-----------------------------------+  |   |  +-------------------------------+  |
|  |     Cognitive Gaming Engine       |  |   |  |   Adaptive Difficulty Scaling |  |
|  +-----------------------------------+  |   |  +-------------------------------+  |
|  |    Reminiscence & Memory Hub      |  |   |  |   AI Emotion & Mood Tracker   |  |
|  +-----------------------------------+  |   |  +-------------------------------+  |
+-------------+---------------------------+   +-------------------------+-----------+
              |                                                         |
+-------------v---------------------------------------------------------v-----------+
|                                  DATA STORAGE LAYER                               |
|  +----------------------------+  +-------------------------+  +-----------------+ |
|  | Relational / Time-Series DB|  | Session Cache           |  | Audio/Media S3  | |
|  | (Metrics, Logs, Routine)   |  | (Real-time Alerts)      |  | (Voice Notes)   | |
|  +----------------------------+  +-------------------------+  +-----------------+ |
+-----------------------------------------------------------------------------------+

