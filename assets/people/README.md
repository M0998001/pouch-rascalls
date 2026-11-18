# Illustrated player and NPC artwork

The first character-art pilot updates the overworld, battle intro portraits, wardrobe previews, and existing 2.5D character drawing through a single renderer hook in `people-renderer.js`.

## Hand-illustrated named NPCs

These five shared NPC looks have transparent 96×128 PNG turnarounds: **Hazel**, **Andrew / Pip**, **Warden Fern**, **Grandma**, and the **Grumble Grunt**. Every look has `_down.png` (front), `_side.png` (left-facing), and `_up.png` (back) views. The right-facing image is mirrored from the side. Movement uses an alternating one-pixel bob while walking, not hand-drawn footstep frames yet.

## Customizable player and other NPCs

To avoid breaking saved player looks and the wardrobe, the player uses a newly drawn, higher-resolution, palette-driven chibi renderer rather than a single fixed illustration. Existing options for skin tone, hairstyle, hair and eye colors, face details, tops, pants, shoes, and wearable hats remain supported. All other NPC looks use the same flexible renderer until they receive dedicated PNG art.

The map still receives **20×28** canvases so pathfinding, drawing order, collisions, follower alignment, and 2.5D billboards retain their existing expectations. Character previews render at higher resolution. Original `drawPerson` is not removed and remains available to legacy code. If a PNG fails to load, its actor renders with the flexible character renderer instead. Assets are precached for offline play in `sw.js`.

**Planned next:** hand-illustrated sailor, ranger, mystic, baker, bug catcher, and additional named characters; then true walking frames and a player-portrait quality pass.
