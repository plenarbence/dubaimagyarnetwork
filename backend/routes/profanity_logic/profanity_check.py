import re
from typing import List


def censor_profanities(text: str | None, banned_words: List[str]) -> str | None:
    """
    Káromkodások kicsillagozása egy szövegben.

    - text: eredeti szöveg (lehet None)
    - banned_words: tiltott szavak listája (pl. ["fasz", "kurva"])
    """

    if not text or not banned_words:
        return text

    cleaned = text

    for word in banned_words:
        if not word:
            continue

        pattern = re.compile(
            re.escape(word),
            flags=re.IGNORECASE,
        )


        cleaned = pattern.sub("*" * len(word), cleaned)

    return cleaned
