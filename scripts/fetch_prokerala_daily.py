#!/usr/bin/env python3

import json
import os
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo
from urllib.parse import quote

import requests


# PRODUCTION MODE — Mac mini / Bhakti Daily repo
REPO_DIR = Path("/Users/axl/Documents/web-projects/bhakti-daily")
OUT_DIR = REPO_DIR / "data" / "panchang"
ENV_FILE = Path("/Users/axl/.secrets/bhakti-daily/prokerala.env")

LOCATION_NAME = "Philadelphia, PA"

TOKEN_URL = "https://api.prokerala.com/token"
PANCHANG_URL = "https://api.prokerala.com/v2/astrology/panchang/advanced"
PLANET_POSITION_URL = "https://api.prokerala.com/v2/astrology/kp-planet-position"


def load_env_file(path: Path) -> None:
    if not path.exists():
        raise FileNotFoundError(f"Missing .env file at: {path.resolve()}")

    for line in path.read_text().splitlines():
        line = line.strip()

        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ[key.strip()] = value.strip().strip('"').strip("'")


def require_env(name: str) -> str:
    value = os.environ.get(name)

    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")

    return value


def get_target_datetime(timezone_name: str) -> datetime:
    tz = ZoneInfo(timezone_name)

    # 6 AM local avoids midnight/date-boundary weirdness.
    return datetime.now(tz).replace(
        hour=6,
        minute=0,
        second=0,
        microsecond=0,
    )


def get_access_token(client_id: str, client_secret: str) -> str:
    response = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
        },
        timeout=30,
    )

    if response.status_code >= 400:
        raise RuntimeError(
            f"Token request failed: {response.status_code}\n{response.text}"
        )

    payload = response.json()
    token = payload.get("access_token")

    if not token:
        raise RuntimeError(f"No access_token found in token response:\n{payload}")

    return token


def api_get(
    url: str,
    token: str,
    ayanamsa: str,
    coordinates: str,
    timezone_name: str,
    target_dt: datetime,
) -> dict:
    params = {
        "ayanamsa": ayanamsa,
        "coordinates": coordinates,
        "datetime": target_dt.isoformat(),
    }

    response = requests.get(
        url,
        headers={
            "Authorization": f"Bearer {token}",
        },
        params=params,
        timeout=30,
    )

    if response.status_code >= 400:
        debug_url = (
            f"{url}"
            f"?ayanamsa={quote(ayanamsa)}"
            f"&coordinates={quote(coordinates)}"
            f"&datetime={quote(target_dt.isoformat())}"
        )

        raise RuntimeError(
            f"API request failed: {response.status_code}\n"
            f"URL without token:\n{debug_url}\n\n"
            f"Response:\n{response.text}"
        )

    return response.json()


def find_planet(planet_positions: list, planet_name: str):
    for item in planet_positions:
        if item.get("planet", {}).get("name") == planet_name:
            return item
    return None


def build_summary(panchang_data: dict, planet_data: dict) -> dict:
    planets = planet_data.get("planet_positions", [])

    sun = find_planet(planets, "Sun")
    moon = find_planet(planets, "Moon")

    current_tithi = panchang_data.get("tithi", [{}])[0] if panchang_data.get("tithi") else {}
    current_nakshatra = (
        panchang_data.get("nakshatra", [{}])[0]
        if panchang_data.get("nakshatra")
        else {}
    )
    current_yoga = panchang_data.get("yoga", [{}])[0] if panchang_data.get("yoga") else {}
    current_karana = (
        panchang_data.get("karana", [{}])[0]
        if panchang_data.get("karana")
        else {}
    )

    return {
        "vaara": panchang_data.get("vaara"),
        "tithi": {
            "name": current_tithi.get("name"),
            "paksha": current_tithi.get("paksha"),
            "start": current_tithi.get("start"),
            "end": current_tithi.get("end"),
        },
        "nakshatra": {
            "name": current_nakshatra.get("name"),
            "lord": current_nakshatra.get("lord"),
            "start": current_nakshatra.get("start"),
            "end": current_nakshatra.get("end"),
        },
        "yoga": {
            "name": current_yoga.get("name"),
            "start": current_yoga.get("start"),
            "end": current_yoga.get("end"),
        },
        "karana": {
            "name": current_karana.get("name"),
            "start": current_karana.get("start"),
            "end": current_karana.get("end"),
        },
        "sun": {
            "rasi": sun.get("rasi") if sun else None,
            "nakshatra": sun.get("nakshatra") if sun else None,
            "longitude": sun.get("longitude"),
            "longitude_dms": sun.get("longitude_dms"),
        }
        if sun
        else None,
        "moon": {
            "rasi": moon.get("rasi") if moon else None,
            "nakshatra": moon.get("nakshatra") if moon else None,
            "longitude": moon.get("longitude"),
            "longitude_dms": moon.get("longitude_dms"),
        }
        if moon
        else None,
        "sunrise": panchang_data.get("sunrise"),
        "sunset": panchang_data.get("sunset"),
        "moonrise": panchang_data.get("moonrise"),
        "moonset": panchang_data.get("moonset"),
        "auspicious_period": panchang_data.get("auspicious_period", []),
        "inauspicious_period": panchang_data.get("inauspicious_period", []),
    }


def main() -> int:
    load_env_file(ENV_FILE)

    client_id = require_env("PROKERALA_CLIENT_ID")
    client_secret = require_env("PROKERALA_CLIENT_SECRET")
    ayanamsa = require_env("PROKERALA_AYANAMSA")
    coordinates = require_env("PROKERALA_COORDINATES")
    timezone_name = require_env("PROKERALA_TIMEZONE")

    tz = ZoneInfo(timezone_name)
    target_dt = get_target_datetime(timezone_name)
    date_key = target_dt.date().isoformat()

    token = get_access_token(client_id, client_secret)

    panchang_response = api_get(
        url=PANCHANG_URL,
        token=token,
        ayanamsa=ayanamsa,
        coordinates=coordinates,
        timezone_name=timezone_name,
        target_dt=target_dt,
    )

    planet_response = api_get(
        url=PLANET_POSITION_URL,
        token=token,
        ayanamsa=ayanamsa,
        coordinates=coordinates,
        timezone_name=timezone_name,
        target_dt=target_dt,
    )

    panchang_data = panchang_response.get("data", {})
    planet_data = planet_response.get("data", {})

    daily_payload = {
        "source": "prokerala",
        "date": date_key,
        "fetched_at": datetime.now(tz).isoformat(),
        "request_datetime": target_dt.isoformat(),
        "location": {
            "name": LOCATION_NAME,
            "coordinates": coordinates,
            "timezone": timezone_name,
        },
        "ayanamsa": ayanamsa,
        "api": {
            "panchang_endpoint": PANCHANG_URL,
            "planet_positions_endpoint": PLANET_POSITION_URL,
        },
        "summary": build_summary(
            panchang_data=panchang_data,
            planet_data=planet_data,
        ),
        "raw": {
            "panchang": panchang_response,
            "planet_positions": planet_response,
        },
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    output_file = OUT_DIR / f"{date_key}-panchang.json"
    tmp_file = output_file.with_suffix(".json.tmp")

    tmp_file.write_text(
        json.dumps(daily_payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    tmp_file.replace(output_file)

    print(f"Wrote: {output_file.resolve()}")
    print("")
    print("SUMMARY CHECK")
    print("-------------")
    print(f"date: {daily_payload['date']}")
    print(f"location: {daily_payload['location']['name']}")
    print(f"vaara: {daily_payload['summary']['vaara']}")
    print(f"tithi: {daily_payload['summary']['tithi']['name']}")
    print(f"paksha: {daily_payload['summary']['tithi']['paksha']}")
    print(f"nakshatra: {daily_payload['summary']['nakshatra']['name']}")
    print(f"yoga: {daily_payload['summary']['yoga']['name']}")
    print(f"karana: {daily_payload['summary']['karana']['name']}")
    print(f"sun_rasi: {daily_payload['summary']['sun']['rasi']['name']}")
    print(f"moon_rasi: {daily_payload['summary']['moon']['rasi']['name']}")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"\nERROR: {exc}", file=sys.stderr)
        raise SystemExit(1)