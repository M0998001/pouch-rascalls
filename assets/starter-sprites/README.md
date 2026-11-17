# Starter Rascal artwork

The six starter creatures now have **three** transparent 96×96 PNG views each: `<id>.png` (front), `<id>_side.png` (left-facing profile), and `<id>_back.png` (rear-facing).

The game renders all three custom orientations as 48×48 canvases where needed. HTML portraits use the original 96×96 files. The follower renderer already mirrors the side view for rightward movement, and battles use the rear sprites for the player's active Rascal.

**Compatibility:** Hue-shifted forms and silhouettes, other species, and evolutions continue using the original procedural artwork. PNG files are pre-cached by the service worker for offline play. The directional art is static (no walk animation frames yet).
