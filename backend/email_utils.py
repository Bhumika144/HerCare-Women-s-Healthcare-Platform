import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from dotenv import load_dotenv

load_dotenv()

# Brevo API Key
BREVO_API_KEY = os.getenv("BREVO_API_KEY")

# Sender email
SENDER_EMAIL = "bhumikabhavre23@gmail.com"
SENDER_NAME = "HerCare"


def send_otp_email(to_email, otp):
    subject = "Email Verification OTP"

    html_content = f"""
    <html>
        <body>
            <h2>Welcome to HerCare 💙</h2>

            <p>Your OTP is:</p>

            <h1>{otp}</h1>

            <p>Valid for 5 minutes.</p>

            <p>Do not share this OTP with anyone.</p>

            <p>Thank you,<br>
            HerCare Team</p>
        </body>
    </html>
    """

    try:
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key["api-key"] = BREVO_API_KEY

        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
            sib_api_v3_sdk.ApiClient(configuration)
        )

        sender = sib_api_v3_sdk.SendSmtpEmailSender(
            name=SENDER_NAME,
            email=SENDER_EMAIL
        )

        to = [
            sib_api_v3_sdk.SendSmtpEmailTo(
                email=to_email
            )
        ]

        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            sender=sender,
            to=to,
            subject=subject,
            html_content=html_content
        )

        api_instance.send_transac_email(send_smtp_email)

        print("✅ OTP Email sent successfully")

    except ApiException as e:
        print("❌ OTP EMAIL ERROR:", e)


def send_period_email(to_email, subject, message):

    html_content = f"""
    <html>
        <body>
            <h2>HerCare 🌸</h2>

            <p>{message}</p>

            <p>Take care,<br>
            HerCare Team</p>
        </body>
    </html>
    """

    try:
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key["api-key"] = BREVO_API_KEY

        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
            sib_api_v3_sdk.ApiClient(configuration)
        )

        sender = sib_api_v3_sdk.SendSmtpEmailSender(
            name=SENDER_NAME,
            email=SENDER_EMAIL
        )

        to = [
            sib_api_v3_sdk.SendSmtpEmailTo(
                email=to_email
            )
        ]

        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            sender=sender,
            to=to,
            subject=subject,
            html_content=html_content
        )

        api_instance.send_transac_email(send_smtp_email)

        print("✅ Period Email sent successfully")

    except ApiException as e:
        print("❌ PERIOD EMAIL ERROR:", e)