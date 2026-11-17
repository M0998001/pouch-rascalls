# Illustrated Rascal art — migration batches

This folder contains illustrated 96×96 transparent PNGs for all six middle and final starter evolutions.

**Middle evolutions:** Thornpup, Cindercat, Brookfin, Joltwolf, Frostbear, Shimmerwing.

**Final evolutions:** Bramblehound, Blazelynx, Tidalotl, Stormfang, Glaciursa, Celestrix.

Each of these 12 species now has `<id>.png` (front), `<id>_side.png` (left-facing profile), and `<id>_back.png` (rear view). The base starters' matching sets live in `assets/starter-sprites/`.

The renderer in `index.html` downsamples these to its existing 48×48 sprite canvas, while HTML portraits use 96×96 art. The existing renderer still handles other species, color-shifted variants, silhouettes, and any loading failures. Rightward followers mirror the side view. The directional images are currently static, not walk-cycle animation frames.

The service worker precaches the artwork for offline use. See `migration-status.json` for per-species progress.

## Batch 04: non-starter families (front / side / back)

- Fluffin and Fluffern — Plain / Glimmer fluffy creatures
- Pebblet and Boulderoo — Stone creatures
- Sparkmunk and Thundermunk — Spark creatures

All six species in this batch have 96×96 transparent `<id>.png`, `<id>_side.png`, and `<id>_back.png` assets. The game continues to mirror the left-profile side view when traveling right and retains its procedural renderer for missing species, silhouettes, and color-shifted variants. Current completion: **24 of 103 species** with all three views.

## Batch 05: three additional evolution families

- Breezle → Galefinch → Tempestork (Gust, Plain, Spark)
- Mushling → Toadstoll (Leaf / Shade)
- Frostbun → Glacihare (Frost / Glimmer)

Each of the seven species has transparent 96×96 front, left-facing side, and rear PNGs. The game uses these images for front and back views and mirrors the side view for right-facing followers. Procedural artwork remains the fallback for species without replacement art, silhouettes and hue-shifted forms.

**Progress: 31 of 103 species have three illustrated views.**

## Batch 06: lantern insects

- Glowbug → Lumimoth (Glimmer / Gust)

Both species have hand-designed transparent 96×96 front, left-facing side, and back sprites, derived from a consistent six-view turnaround. The game continues using procedural fallbacks for all unillustrated species and color-shifted/silhouette variants.

**Progress: 33 of 103 species have three illustrated views; 70 remain.**

## Batch 07: ghosts and coastal crabs

- Shadowisp → Gloomwraith (Shade)
- Crabble → Krabastion (Tide / Stone)

All four species now have 96×96 transparent front, left-profile side, and rear sprite images. Images are downscaled into the existing 48×48 game canvas, with mirrored right-side movement and original procedural fallback for non-migrated species, silhouettes, and color-shifted forms.

**Progress: 37 of 103 species have three illustrated views; 66 remain.**
