import google.generativeai as genai
from django.conf import settings
import json


def generate_human_readable_message(data: dict) -> str:
    genai.configure(api_key=settings.GOOGLE_CLOUD_API_KEY)
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    json_data = json.dumps(data, indent=2)
    
    prompt = f"""Convert this JSON data into a clear, human-readable message for LifeLine, a health emergency assistant app which provides assitance regarding donor,medicine availibility ,nearby hospitals and other helpful stuff.
    Make sure no info is lost and like dont make it too verbose. 

Data:
{json_data}

Generate a concise, natural message that presents this information in a way users can easily understand. Focus on the most important health-related details. Keep it brief and conversational.

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
    
    prompt = f"""Route the user's medical request to the correct endpoint.

User: "{message}"

Available routes:
{chr(10).join(f"- {route}" for route in available_routes)}

Routing rules:
- /user/emergency: Person needs immediate help RIGHT NOW and is NOT yet at hospital or getting treatment
- /user/ambulance: Person needs transportation to hospital
- /user/raise_blood_request: Person specifically needs BLOOD or mentions blood donation/transfusion/blood loss/blood requirement

Priority: If the message mentions "blood", "transfusion", "donation", or "blood loss/need", always choose /user/raise_blood_request even if there's an emergency context.

Return only the route path:"""
    
    response = model.generate_content(prompt)
    selected_route = response.text.strip()
    
    for route in available_routes:
        if route in selected_route:
            return route
    
    return ''
