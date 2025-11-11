import google.generativeai as genai
from django.conf import settings


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
