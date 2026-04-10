# 🥗 NutriSense — AI-Driven Nutritional Intelligence Platform

> Beyond calorie counting. NutriSense delivers real-time, contextualized health insights powered by biometric data, behavioral economics, and community-driven features.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Nutritional Quality Score (NQS)** | A dynamic daily score (0–100) that evaluates the overall nutritional quality of your diet — not just calories |
| 🔔 **Contextual Nudges** | AI-powered real-time suggestions triggered by biometrics (HRV, cortisol, sleep) to nudge you toward smarter eating |
| 🧬 **Biometric Integration** | Tracks cortisol index, sleep score, HRV, resting heart rate, steps, and readiness score |
| 🛒 **Smart Grocery Planner** | Budget-aware, nutrient-gap-driven weekly grocery lists with smart substitution suggestions |
| 🫙 **Social Fridge** | Community ingredient-swapping feature to reduce food waste and close nutritional gaps with neighbors |
| 🍽️ **Food Log** | Daily meal tracker with per-meal NQS ratings, macro breakdowns, and calorie tracking |
| 🏆 **Badges & Streaks** | Gamified rewards system to keep you motivated with streaks, badges, and karma points |

---

## 🛠️ Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** — High-performance Python REST API framework
- **[Uvicorn](https://www.uvicorn.org/)** — ASGI server for running FastAPI

### Frontend
- **Vanilla HTML5 / CSS3 / JavaScript** — Zero-dependency, premium minimalist UI
- **Google Fonts** — Modern typography
- **Custom CSS Animations** — Micro-interactions and smooth transitions

---

## 📁 Project Structure

```
foooood-apppppp/
│
├── main.py                 # FastAPI backend — all API endpoints
├── requirements.txt        # Python dependencies
├── .gitignore
│
└── static/
    ├── index.html          # Main frontend SPA
    ├── css/
    │   └── styles.css      # Full design system & component styles
    └── js/
        └── app.js          # Frontend logic, API calls, UI rendering
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- pip

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/samyaksahay01-prog/foooood-apppppp.git
   cd foooood-apppppp
   ```

2. **Create a virtual environment** *(recommended)*
   ```bash
   python -m venv venv
   venv\Scripts\activate      # Windows
   # source venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the development server**
   ```bash
   uvicorn main:app --reload
   ```

5. **Open in your browser**
   ```
   http://localhost:8000
   ```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Serves the frontend SPA |
| `GET` | `/api/dashboard` | User overview, NQS score, streaks, budget |
| `GET` | `/api/biometrics` | Cortisol, sleep, HRV, steps, readiness score |
| `GET` | `/api/nudges` | Contextual meal suggestions based on biometrics |
| `GET` | `/api/grocery` | Smart weekly grocery list with gap analysis |
| `GET` | `/api/fridge` | Social Fridge community ingredient listings |
| `GET` | `/api/foodlog` | Daily food log with macros and NQS per meal |
| `GET` | `/api/badges` | Earned badges, upcoming achievements & streaks |

> 📖 Interactive API docs available at `http://localhost:8000/docs` (FastAPI Swagger UI)

---

## 📸 Key Concepts

### Nutritional Quality Score (NQS)
The NQS is a composite score from 0–100 that considers macro balance, micronutrient coverage, meal timing, and diversity — going far beyond simple calorie tracking.

### Contextual Nudges
Instead of generic reminders, NutriSense uses biometric signals (e.g., a cortisol dip at 3 PM) to deliver hyper-relevant food suggestions at exactly the right moment.

### Social Fridge
A community feature that lets users share surplus ingredients with nearby users — reducing food waste while helping neighbors close their nutritional gaps.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ by <a href="https://github.com/samyaksahay01-prog">samyaksahay01-prog</a></p>
