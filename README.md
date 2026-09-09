# 🛑 Bro-Stop (Guilt-Trap) — AI Impulse Spending Tracker

> **An unfiltered AI financial conscience designed for young Indian professionals, students, and Gen-Z consumers.**
> Roasts your late-night impulses with authentic Bollywood (Sanjay Dutt / Sanju Baba) Hinglish humor and shows the 10-year SIP opportunity cost before you blow your savings.

---

## ✨ Features

- **🔥 Multi-Factor Impulse Scoring Engine**:
  - Time-of-day detection (penalizes 11 PM – 4 AM late-night orders).
  - High-risk categories: Food Delivery (Swiggy/Zomato), Nightlife, Fast Fashion (Myntra/Zara), Tech Gadgets.
  - Ticket size & repeat order frequency heuristic scoring (0–100 normalized score).

- **🎙️ Sanjay Dutt (Sanju Baba / Munna Bhai) Voice Roasts**:
  - High-energy, masculine Indian baritone voice delivery.
  - Contextual Hinglish roasts (*"Aey Bhai! Bole toh sunn... fridge showpiece ke liye rakha hai kya mamu?"*).
  - Speech synthesis utilizing native Indian Hindi & English voices.

- **📈 10-Year SIP Reality Check**:
  - Automatically calculates what every impulse spend would become if invested in an index fund at 12% CAGR over 10 years.

- **📱 Mobile-First Native Experience**:
  - Designed for mobile screen viewports with thumb-friendly bottom navigation bar.
  - Sticky app bar with real-time Guilt Index meter.
  - 1-Tap quick profile login with persistent session storage (no need to log in every time).

- **📷 Bill & Receipt Image Upload**:
  - Integrated receipt scanner with file picker and thumbnail preview.

- **📊 Weekly Shame Report with Diagrams**:
  - Donut pie chart for category spending breakdown.
  - Day-of-week impulse peak bar graph highlighting weekend danger zones.
  - 10-Year SIP wealth lost vs compounding growth curve.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/aaryanghadi12/Bro-Stop.git
cd Bro-Stop

# Install dependencies
npm install

# Run locally in development mode
npm run dev
```

Open your browser at `http://localhost:5173/`.

### Build for Production

```bash
npm run build
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Vanilla CSS (Fintech design system inspired by Mercury, Splitwise & Linear)
- **Icons**: Lucide React
- **Confetti**: Canvas Confetti
- **Voice Synthesis**: Web Speech API (custom-tuned Sanjay Dutt persona)
- **Storage**: LocalStorage with multi-user isolation & session persistence
