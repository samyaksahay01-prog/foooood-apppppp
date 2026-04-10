from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI(title="NutriSense API", version="1.0.0")

os.makedirs("static/css", exist_ok=True)
os.makedirs("static/js", exist_ok=True)


@app.get("/api/dashboard")
def get_dashboard():
    return {
        "user": {"name": "Samyak", "tier": "Pro Member", "avatar": "S", "joined_days": 47},
        "nqs_score": 78,
        "nqs_delta": +8,
        "nqs_history": [61, 65, 60, 71, 68, 75, 78],
        "streak_days": 18,
        "streak_freeze_available": 1,
        "next_reward_at": 20,
        "budget_remaining": 54.20,
        "budget_total": 60.00,
        "weekly_nqs_avg": 69.7,
        "next_meal_target": "Protein & Magnesium",
        "water_glasses": 5,
        "water_goal": 8
    }


@app.get("/api/biometrics")
def get_biometrics():
    return {
        "cortisol_index": 0.35,
        "cortisol_label": "Low",
        "sleep_score": 71,
        "sleep_hours": 6.8,
        "sleep_quality": "Fair",
        "hrv": 58,
        "resting_hr": 64,
        "steps_today": 5420,
        "steps_goal": 8000,
        "calories_burned": 1840,
        "active_minutes": 32,
        "readiness_score": 74
    }


@app.get("/api/nudges")
def get_nudges():
    return {
        "time": "3:00 PM",
        "trigger": "Cortisol dip predictive model",
        "message": "You're entering the 3 PM slump window 📉",
        "sub_message": "Your HRV data shows cortisol peaked at 2:40 PM — a smart snack NOW prevents a crash and closes your Magnesium gap.",
        "suggestions": [
            {
                "name": "Handful of Almonds",
                "nqs_impact": "+5",
                "icon": "🥜",
                "macros": "6g protein · 14g fat · 2g fiber",
                "description": "High in magnesium, supports cortisol balance and sustained energy."
            },
            {
                "name": "Green Tea + Edamame",
                "nqs_impact": "+7",
                "icon": "🍵",
                "macros": "8g protein · 4g fat · 4g fiber",
                "description": "L-theanine promotes calm focus. Edamame closes your protein gap."
            },
            {
                "name": "Greek Yogurt (plain)",
                "nqs_impact": "+6",
                "icon": "🥛",
                "macros": "17g protein · 5g fat · 0g fiber",
                "description": "Probiotic-rich and supports gut-brain axis regulation."
            }
        ]
    }


@app.get("/api/grocery")
def get_grocery():
    return {
        "week": "Apr 14 – Apr 20",
        "budget_total": 45.00,
        "budget_used": 32.60,
        "items": [
            {"name": "Baby Spinach (250g)", "reason": "Closes Iron gap (−34%)", "price": 1.20, "priority": "high", "icon": "🥬", "category": "Greens"},
            {"name": "Salmon Fillet (400g)", "reason": "Top Omega-3 priority", "price": 6.80, "priority": "high", "icon": "🐟", "category": "Protein"},
            {"name": "Lentils (500g)", "reason": "Closes Iron + Folate gap", "price": 1.90, "priority": "high", "icon": "🫘", "category": "Legumes"},
            {"name": "Greek Yogurt (plain)", "reason": "Probiotic + Protein boost", "price": 3.40, "priority": "medium", "icon": "🥛", "category": "Dairy"},
            {"name": "Almonds (200g)", "reason": "Magnesium + Vitamin E", "price": 4.20, "priority": "medium", "icon": "🥜", "category": "Snacks"},
            {"name": "Blueberries (300g)", "reason": "Antioxidant punch", "price": 3.50, "priority": "low", "icon": "🫐", "category": "Fruit"},
            {"name": "Dark Chocolate 85%", "reason": "Mood + Iron (swap for Snickers)", "price": 2.80, "priority": "low", "icon": "🍫", "category": "Snacks"},
            {"name": "Pumpkin Seeds (150g)", "reason": "Zinc gap (−28%)", "price": 2.60, "priority": "medium", "icon": "🌱", "category": "Snacks"},
        ],
        "substitutions": [
            {"swap_out": "Activia yogurt", "swap_in": "Plain Greek Yogurt", "savings": 1.40, "benefit": "−8g added sugar"}
        ]
    }


@app.get("/api/fridge")
def get_fridge():
    return {
        "nearby_users": 12,
        "karma_points": 145,
        "karma_rank": "Verified Contributor",
        "items": [
            {
                "user": "@sarah_k",
                "avatar": "S",
                "distance": "0.3 km",
                "item": "Fresh Spinach",
                "icon": "🥬",
                "expires_in": "2 days",
                "quantity": "~150g",
                "match_reason": "Closes your Iron gap (−34%)",
                "match_score": 92
            },
            {
                "user": "@fit_dave",
                "avatar": "D",
                "distance": "1.1 km",
                "item": "Navel Oranges",
                "icon": "🍊",
                "expires_in": "4 days",
                "quantity": "3 pieces",
                "match_reason": "Vitamin C & Folate boost for you",
                "match_score": 84
            },
            {
                "user": "@rach_cooks",
                "avatar": "R",
                "distance": "0.7 km",
                "item": "Brown Rice (cooked)",
                "icon": "🍚",
                "expires_in": "1 day",
                "quantity": "~2 cups",
                "match_reason": "Complex carbs for your active day",
                "match_score": 78
            }
        ],
        "my_offerings": [
            {"item": "Cherry Tomatoes", "icon": "🍅", "expires_in": "3 days", "claimed": False},
            {"item": "Chickpeas (canned)", "icon": "🫘", "expires_in": "180 days", "claimed": True}
        ]
    }


@app.get("/api/foodlog")
def get_food_log():
    return {
        "today_calories": 1420,
        "calorie_target": 1900,
        "macros": {"protein": 78, "carbs": 162, "fat": 49, "fiber": 18},
        "macro_targets": {"protein": 120, "carbs": 220, "fat": 65, "fiber": 25},
        "entries": [
            {"time": "8:15 AM", "name": "Overnight Oats + Banana", "icon": "🌾", "calories": 380, "nqs": 72},
            {"time": "1:00 PM", "name": "Turkey Avocado Wrap", "icon": "🌯", "calories": 640, "nqs": 81},
            {"time": "3:30 PM", "name": "Almonds (handful)", "icon": "🥜", "calories": 165, "nqs": 88},
            {"time": "7:00 PM", "name": "Salmon + Steamed Greens", "icon": "🐟", "calories": 235, "nqs": 91}
        ]
    }


@app.get("/api/badges")
def get_badges():
    return {
        "earned": [
            {"id": "consistent", "name": "Consistent", "icon": "🔥", "description": "3-day log streak", "earned_date": "Apr 3"},
            {"id": "iron_warrior", "name": "Iron Warrior", "icon": "💪", "description": "Closed Iron gap for 7 days", "earned_date": "Apr 5"},
            {"id": "green_thumb", "name": "Green Thumb", "icon": "🌿", "description": "Logged greens 5 days in a row", "earned_date": "Apr 7"},
            {"id": "social_fridge", "name": "First Swap", "icon": "🫙", "description": "Completed first Social Fridge exchange", "earned_date": "Apr 9"}
        ],
        "upcoming": [
            {"id": "streak_20", "name": "Streak Legend", "icon": "⚡", "description": "Reach a 20-day streak", "progress": 90},
            {"id": "nqs_80", "name": "NutriElite", "icon": "🏆", "description": "Achieve NQS of 80+", "progress": 78},
            {"id": "waste_reducer", "name": "Waste Reducer", "icon": "♻️", "description": "5 Social Fridge swaps", "progress": 40}
        ]
    }


@app.get("/")
def serve_root():
    return FileResponse("static/index.html")

app.mount("/", StaticFiles(directory="static"), name="static")
