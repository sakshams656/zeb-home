"""
Remove dark background from a logo image, leaving the foreground opaque.

By default the foreground is forced to white (clean cutouts for white marks
on dark backgrounds). Pass --keep-color to preserve the source RGB (e.g. a
blue mark stays blue) — the alpha is still derived from brightness.

Usage:
  python3 scripts/strip-bg.py <input.png> <output.png> [threshold] [--keep-color]
"""

import sys
from pathlib import Path

from PIL import Image


def strip_dark_bg(
    src: Path, dst: Path, threshold: int = 60, keep_color: bool = False
) -> None:
    img = Image.open(src).convert("RGBA")
    px = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            brightness = max(r, g, b)
            if brightness <= threshold:
                # Solid background -> fully transparent
                px[x, y] = (0, 0, 0, 0)
            elif brightness < 200:
                # Soft edge -> proportional alpha (smooths the cutout)
                alpha = int((brightness - threshold) / (200 - threshold) * 255)
                if keep_color:
                    px[x, y] = (r, g, b, alpha)
                else:
                    px[x, y] = (255, 255, 255, alpha)
            else:
                # Bright foreground
                if keep_color:
                    px[x, y] = (r, g, b, 255)
                else:
                    px[x, y] = (255, 255, 255, 255)

    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst, "PNG", optimize=True)
    print(f"wrote {dst} ({dst.stat().st_size} bytes)")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])
    keep_color = "--keep-color" in sys.argv
    args = [a for a in sys.argv[3:] if not a.startswith("--")]
    thresh = int(args[0]) if args else 60
    strip_dark_bg(src, dst, thresh, keep_color)
