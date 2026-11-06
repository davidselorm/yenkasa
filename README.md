# Yenkasa (Yɛnkasa) 🇬🇭🗣️
### Inclusive Assistive Speech Recognition (ASR) & Text-to-Speech (TTS) Platform for Ghanaian Languages

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Ghanaian Languages](https://img.shields.io/badge/Languages-Akan%20%7C%20Ga%20%7C%20Ewe%20%7C%20Dagbani%20%7C%20Fante-gold.svg)](#supported-languages)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%20AAA%20%7C%20Switch%20Access-blue.svg)](#accessibility)
[![Status](https://img.shields.io/badge/Status-Active%20Development-success.svg)](#)

> **"Yɛnkasa"** is Akan (Twi) for *"Let's Talk"* or *"We Shall Speak"*.

**Yenkasa** is an assistive speech technology platform designed specifically for individuals with speech impairment, non-verbal conditions, and dysarthria in Ghana and across the West African diaspora. By combining **culturally contextual Augmentative and Alternative Communication (AAC)**, **indigenous Ghanaian Text-to-Speech (TTS)** synthesis, and **dysarthric/atypical Automatic Speech Recognition (ASR) "Speech Repair"**, Yenkasa bridges communication barriers in everyday Ghanaian life—from trotro stations and vibrant open markets to family living rooms and healthcare clinics.

---

## 🌟 The Challenge & Context

Traditional speech-assistive devices and AAC software (e.g., Tobii Dynavox, Proloquo2Go) suffer from three critical bottlenecks in the Ghanaian context:

1. **Western Linguistic Bias**: They speak robotic American or British English. There is virtually zero native support for **Asante Twi, Akuapem Twi, Fante, Ga, Ewe, or Dagbani**.
2. **Cultural Disconnect**: Built-in visual symbol vocabularies depict hotdogs, baseball, and subway trains—not *Waakye*, *Trotro*, *Kenkey*, *Chorkor*, *Kente*, or local greeting rituals (*"Mema wo akye"*, *"Akpe na wò"*).
3. **Dysarthria & Slurred Speech Failure**: Conventional ASR engines (Google Assistant, Siri, standard Whisper) instantly reject dysarthric speech, spastic pauses, and low-volume tonal approximations common in stroke survivors, cerebral palsy, and ALS patients.

**Yenkasa solves all three.**

---

## 🚀 Key Innovations & Pillars

- 🗣️ **Ghanaian Native TTS Synthesizer**: Natural voice generation supporting tonal markers (ɔ, ɛ, ŋ, ɖ, ʋ) and indigenous phonemes for Akan, Ga, Ewe, and Dagbani.
- 🧩 **Culturally Grounded AAC Grid**: Over 180+ localized communication tiles organized by Fitzgerald Key standards (Food, Health, Emergencies, Trotro/Transport, Market, Family).
- 🎙️ **Dysarthric ASR & Speech Repair**: Acoustic feature calibration adapting to individual vocal distortions and repairing slurred vocalizations into fluent Ghanaian speech.
- 🔄 **Two-Way Dialogue Bridge**: Translates caregiver speech into visual tiles/text, and converts user tiles/gestures into crystal-clear spoken Ghanaian audio.
- ♿ **Assistive Hardware Ready**: Dwell-click timers for eye-tracking/head-pointing, single-key Switch Access scanning, and high-contrast WCAG AAA visual themes.
- 📶 **Offline-First PWA**: Zero-data local speech engine ensuring reliable operation in rural clinics and remote Ghanaian communities.

---

## 🇬🇭 Supported Languages

| Language | Dialect / Variant | TTS Engine | ASR / Speech Repair | AAC Grid |
|---|---|---|---|---|
| **Akan (Twi)** | Asante Twi | ✅ Active | ✅ Calibrated | ✅ Full |
| **Akan (Twi)** | Akuapem Twi | ✅ Active | ✅ Calibrated | ✅ Full |
| **Fante** | Mfantse | ✅ Active | ✅ Calibrated | ✅ Full |
| **Gã** | Greater Accra Ga | ✅ Active | ✅ Calibrated | ✅ Full |
| **Ewe (Èʋegbe)** | Anlo / Tongu / Vedome | ✅ Active | ✅ Calibrated | ✅ Full |
| **Dagbani** | Northern Ghana Dagbani | ✅ Active | ✅ Calibrated | ✅ Full |

---

## 💻 Tech Architecture

Built with modern, lightweight web technologies for instant responsiveness on low-cost smartphones, tablets, and desktop setups:

- **Frontend**: Vite, React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Audio Visualizer
- **Speech Engine**: Web Audio API Formant & Phoneme Synthesizer + Native Audio Soundbank + Khaya/MMS Cloud Bridge
- **Acoustic ASR**: Spectral Centroid & Zero-Crossing Rate Acoustic Matcher with Dysarthria Calibration
- **Storage**: IndexedDB & LocalStorage for offline voice banking and personalized phrases

---

## 🛠️ Quick Start

```bash
# Clone the repository
git clone https://github.com/davidselorm/yenkasa.git

# Navigate into project directory
cd yenkasa

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
