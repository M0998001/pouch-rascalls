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

## Batch 08: ten-species complete directional art

- Snoozle (Plain)
- Smoglet → Pyrohog (Ember / Stone)
- Buzzlet → Queenbloom (Leaf / Gust)
- Starfawn → Celestag (Glimmer / Leaf)
- Drakelet → Wyvernal (Ember / Gust)
- Steamwhelp (Ember / Tide hybrid)

These 10 species each have three transparent 96×96 PNGs: `<id>.png` for front-facing, `<id>_side.png` facing left, and `<id>_back.png` from behind. The existing renderer downsamples sprite assets to 48×48 as needed, mirrors side sprites to face right, and retains procedural fallback for unreplaced species, silhouettes, and hue variants. The offline cache precaches all 30 additions.

**Progress: 47 of 103 species completely illustrated, 56 remaining.**

## Batch 09: ten-species directional redesigns

- Lilyhop → Lotusking (Tide / Leaf)
- Masklet → Banditail (Shade / Plain)
- Bubblub → Jellumi (Tide / Glimmer)
- Seagulp (Gust / Tide; Galeon art still pending)
- Duskpup → Gloamwolf (Shade; Lunarfang art still pending)
- Thornbolt (Leaf / Spark hybrid)

Each of these ten species now has 96×96 transparent front, left-profile side, and rear PNG artwork in `assets/rascals/`. The original procedural renderer remains a fallback for all remaining species, alternate-hue forms and silhouettes. The existing follower renderer mirrors left-facing profiles to show right-facing views. The offline service worker precaches all 30 added PNGs.

**Progress: 57 of 103 species have all three illustrated views; 46 remain.**
