import google.generativeai as genai
from django.conf import settings
import json


def generate_human_readable_message(data: dict) -> str:
    genai.configure(api_key=settings.GOOGLE_CLOUD_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')

    json_data = json.dumps(data, indent=2)

    prompt = f"""Convert this JSON data into a clear, human-readable message for LifeLine, 
    a health emergency assistant app which provides assistance regarding donors, medicine 
    availability, nearby hospitals, and other emergency features.

    Make sure no info is lost, keep it concise and natural.

Data:
{json_data}

Generate a short and easy-to-understand message focusing on health-related information.

Message:"""

    response = model.generate_content(prompt)
    return response.text.strip()


def select_route_from_message(message: str, action: str, assist_routes: list, navigate_routes: list) -> str:
    genai.configure(api_key=settings.GOOGLE_CLOUD_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')

    if action == 'AS':
        available_routes = assist_routes
    else:
        available_routes = navigate_routes

    if not available_routes:
        return ''

    prompt = f"""Route the user's medical or emergency message to the correct endpoint.

User message:
"{message}"

Available routes:
{chr(10).join(f"- {route}" for route in available_routes)}

Routing rules:
- /user/emergency: Person needs immediate help or is in an emergency situation (e.g., accident, injury, etc.)
- /user/ambulance: Person needs an ambulance or transportation to hospital
- /user/raise_blood_request: Person needs blood, donation, or transfusion

Always return only the correct route path, no extra text."""

    response = model.generate_content(prompt)
    selected_route = response.text.strip()

    for route in available_routes:
        if route in selected_route:
            return route

    return ''


def medical_assist_advice(symptom_message: str) -> str:
    genai.configure(api_key=settings.GOOGLE_CLOUD_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')

    prompt = f"""
You are an experienced general physician in an AI health assistant app called LifeLine.
Your job is to provide short, general, safe medical recommendations based on a user's message.

Guidelines:
- If the symptom seems mild (cold, fever, fatigue, sore throat, etc.), give simple home-care suggestions.
- If symptoms indicate serious conditions (chest pain, difficulty breathing, high fever, bleeding, unconsciousness, etc.), 
  firmly suggest seeing a doctor immediately.
- Keep the reply under 3 lines.
- Always include a disclaimer: "This is general guidance, not a medical diagnosis."

User's message: "{symptom_message}"

Respond with a short, human-friendly recommendation:
"""

    response = model.generate_content(prompt)
    return response.text.strip()
