"""Download the CC0 assets (Poly Haven) used by the photoreal fly-through render.

Usage: python3 fetch_assets.py <asset_dir>
All assets are CC0 (https://polyhaven.com/license) – free for commercial use, no attribution required.
"""
import json
import os
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

DEST = sys.argv[1] if len(sys.argv) > 1 else "assets"

HDRIS = {
    "kloofendal_48d_partly_cloudy_puresky": "4k",  # daylight sky
    "qwantani_sunset_puresky": "4k",  # golden-hour finale
}
TEXTURES = {
    "leafy_grass": "2k",
    "aerial_grass_rock": "2k",
    "raked_dirt": "2k",
    "farm_soil": "1k",
    "clean_asphalt": "2k",
    "interlocking_concrete_pavers": "1k",
    "concrete_floor_02": "1k",
    "white_plaster_rough_01": "1k",
    "plastered_wall": "1k",
    "large_red_bricks": "1k",
    "fine_grained_wood": "1k",
    "rectangular_facade_tiles": "1k",
    "blue_floor_tiles_01": "1k",
    "wood_floor_deck": "1k",
    "rubber_tiles": "1k",
    "painted_concrete": "1k",
    "sparse_grass": "1k",
}
MODELS = {
    "jacaranda_tree": "1k",
    "searsia_lucida": "1k",
    "shrub_02": "1k",
    "shrub_04": "1k",
    "street_lamp_01": "1k",
}
MAPS = {"Diffuse": "diff", "nor_gl": "nor_gl", "Rough": "rough"}

jobs = []
UA = {"User-Agent": "DangeAssociates-Flythrough/1.0 (asset fetch script)"}


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA))


def api(asset):
    with get(f"https://api.polyhaven.com/files/{asset}") as r:
        return json.load(r)


for asset, res in HDRIS.items():
    f = api(asset)["hdri"][res]["hdr"]
    jobs.append((f["url"], os.path.join(DEST, "hdri", f"{asset}_{res}.hdr")))

for asset, res in TEXTURES.items():
    info = api(asset)
    for key, short in MAPS.items():
        if key in info:
            f = info[key][res]["jpg"]
            jobs.append((f["url"], os.path.join(DEST, "textures", asset, f"{short}.jpg")))

for asset, res in MODELS.items():
    g = api(asset)["gltf"][res]["gltf"]
    jobs.append((g["url"], os.path.join(DEST, "models", asset, f"{asset}.gltf")))
    for rel, inc in g["include"].items():
        jobs.append((inc["url"], os.path.join(DEST, "models", asset, rel)))


def fetch(job):
    url, path = job
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return 0
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with get(url) as r, open(path, "wb") as out:
        while chunk := r.read(1 << 20):
            out.write(chunk)
    return os.path.getsize(path)


with ThreadPoolExecutor(8) as ex:
    total = sum(ex.map(fetch, jobs))
print(f"{len(jobs)} files, {total / 1e6:.1f} MB downloaded into {DEST}")
