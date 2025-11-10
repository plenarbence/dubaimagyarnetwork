import time
from fastapi import HTTPException, status, Request

# ================================
# ⚙️ Egyszerű IP alapú rate limiter
# ================================

# { ip_cím: [timestamp1, timestamp2, ...] }
_attempts: dict[str, list[float]] = {}

# konfiguráció
MAX_ATTEMPTS = 5           # max próbálkozás
WINDOW_SECONDS = 60        # időablak (másodpercben)


def check_rate_limit(request: Request):
    """
    Ellenőrzi, hogy az adott IP nem lépte-e túl a limitet.
    Ha igen -> HTTP 429 Too Many Requests hibát dob.
    """

    client_ip = request.client.host
    now = time.time()

    # IP-hez tartozó lista inicializálása
    if client_ip not in _attempts:
        _attempts[client_ip] = []

    # régi próbálkozások törlése (ablakon kívüliek)
    _attempts[client_ip] = [
        ts for ts in _attempts[client_ip] if now - ts < WINDOW_SECONDS
    ]

    # ha túl sok próbálkozás van
    if len(_attempts[client_ip]) >= MAX_ATTEMPTS:
        retry_after = int(WINDOW_SECONDS - (now - _attempts[client_ip][0]))
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Túl sok bejelentkezési próbálkozás. Próbáld újra {retry_after} mp múlva.",
            headers={"Retry-After": str(retry_after)},
        )

    # új próbálkozás rögzítése
    _attempts[client_ip].append(now)
