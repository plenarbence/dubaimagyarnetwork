# backend/auth_code_logic/send_auth_code_email.py

import httpx

from backend.config import RESEND_API_KEY
from backend.models.auth_code import AuthCodePurpose


RESEND_API_URL = "https://api.resend.com/emails"
FROM_EMAIL = "noreply@dubaimagyarnetwork.com"


async def send_auth_code_email(
    email: str,
    code: str,
    purpose: AuthCodePurpose,
) -> None:
    """
    Auth kód email kiküldése Resend segítségével.
    Csak küldés, nincs DB, nincs logika.
    """

    if purpose == AuthCodePurpose.email_verify:
        subject = "Email cím megerősítése"
        html = f"""
        <p>Szia!</p>
        <p>Az email címed megerősítéséhez használd az alábbi kódot:</p>
        <h2>{code}</h2>
        <p>A kód 10 percig érvényes.</p>
        """
    else:
        subject = "Jelszó visszaállítás"
        html = f"""
        <p>Szia!</p>
        <p>A jelszavad visszaállításához használd az alábbi kódot:</p>
        <h2>{code}</h2>
        <p>A kód 10 percig érvényes.</p>
        """

    headers = {
        "Authorization": f"Bearer {RESEND_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "from": FROM_EMAIL,
        "to": [email],
        "subject": subject,
        "html": html,
    }

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(
            RESEND_API_URL,
            headers=headers,
            json=payload,
        )

        # nem dobunk hibát → auth flow ne áruljon el semmit
        # de logolni lehet majd
        if response.status_code >= 400:
            # opcionálisan: logger.error(response.text)
            print("RESEND ERROR:", response.status_code, response.text)
