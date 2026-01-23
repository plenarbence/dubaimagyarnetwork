import time
from collections import defaultdict
from fastapi import HTTPException, status, Request

# IP -> list[timestamp]
_RATE_LIMIT_STORE: dict[str, list[float]] = defaultdict(list)

WINDOW_SECONDS = 60
MAX_REQUESTS = 5


def rate_limit_5_per_minute(request: Request) -> None:
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()

    timestamps = _RATE_LIMIT_STORE[client_ip]

    # csak az elmúlt 60 mp-en belüliek maradnak
    timestamps[:] = [ts for ts in timestamps if now - ts < WINDOW_SECONDS]

    if len(timestamps) >= MAX_REQUESTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Túl sok kérés. Próbáld meg később.",
        )

    timestamps.append(now)
