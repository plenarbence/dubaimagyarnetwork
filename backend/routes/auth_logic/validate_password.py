import re
from fastapi import HTTPException, status

def validate_password(password: str) -> None:
    """
    Ellenőrzi, hogy a jelszó megfelel-e az alapkövetelményeknek.
    Ha nem, HTTP 400 hibát dob a megfelelő üzenettel.
    """
    rules = [
        (re.compile(r".{8,}"), "A jelszónak legalább 8 karakter hosszúnak kell lennie."),
        (re.compile(r"[A-Z]"), "A jelszónak tartalmaznia kell legalább egy nagybetűt."),
        (re.compile(r"[a-z]"), "A jelszónak tartalmaznia kell legalább egy kisbetűt."),
        (re.compile(r"[0-9]"), "A jelszónak tartalmaznia kell legalább egy számot."),
    ]

    for pattern, msg in rules:
        if not pattern.search(password or ""):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=msg,
            )
