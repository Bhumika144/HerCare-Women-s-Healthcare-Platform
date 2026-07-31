import requests
import os
from dotenv import load_dotenv

load_dotenv()

BREVO_API_KEY = os.getenv("BREVO_API_KEY")

def send_period_reminder(to_email, subject, message):
    try:
        url = "https://api.brevo.com/v3/smtp/email"

        headers = {
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json"
        }

        data = {
            "sender": {
                "name": "HerCare 🌸",
                "email": "bhumikabhavre23@gmail.com"  # ⚠️ MUST be verified in Brevo
            },
            "to": [{"email": to_email}],
            "subject": subject,
            "htmlContent": f"""
                <h2>🌸 Period Update</h2>
                <p>{message}</p>
            """
        }

        response = requests.post(url, headers=headers, json=data)

        print("📨 EMAIL STATUS:", response.status_code)
        print("📨 EMAIL RESPONSE:", response.text)

    except Exception as e:
        print("❌ EMAIL ERROR:", str(e))