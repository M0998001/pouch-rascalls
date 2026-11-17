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

## Batch 10: aurora, storm birds, lightning beetles, magma moles, fire bats and frost penguins

- Aurorabun (Frost / Glimmer hybrid)
- Galeon (Gust / Tide; evolves from Seagulp)
- Boltbug → Voltbeetle (Spark / Stone)
- Magmole → Magmaul (Ember / Stone)
- Cinderbat → Pyrobat (Ember / Shade)
- Pengling → Emperguin (Frost / Tide)

These 10 species have complete custom transparent 96×96 front, left-facing side and back PNG sprite sets under `assets/rascals/`. The canvas renderer uses the new PNGs for normal appearances, mirrors side sprites for rightward facing, and retains procedural artwork for species without illustrations, silhouettes and alternative hues. All 30 new images are pre-cached for offline play.

**Progress: 67 of 103 species completely illustrated, 36 remaining.**

## Batch 11: mountain snow, aurora birds, shadow foxes, ember insects, and spellcats

- Yetot → Yetitan (Frost / Plain and Frost / Stone)
- Wisplume → Aurorowl (Glimmer / Gust)
- Nightkit → Umbrafox (Shade and Shade / Frost)
- Flarefly → Blazewing (Ember / Gust)
- Hexkit → Hexmyst (Shade / Glimmer)

Added 30 transparent 96×96 front, left-facing side, and rear PNG sprites. The native renderer retains 48×48 canvas output, mirrored right-facing profiles, procedural fallback for unmigrated species, silhouettes, and hue-shifted forms. The service worker precaches all new images for offline play.

**Art provenance:** The Yetot, Yetitan, Wisplume, Aurorowl, and Nightkit images were extracted and cleaned from newly generated turnarounds. The remaining five creatures were developed as recolored and embellished interpretations of existing illustrated families to keep visual consistency; they may benefit from future bespoke redraws.

**Progress: 77 / 103 species completely illustrated; 26 remain.**
  
## Batch 12: Prismatic, ocean, woodland and legendary Rascals

- Prismite → Prismajest (Glimmer / Stone)
- Finnip → Koishine (Tide / Glimmer)
- Snapjaw (Tide / Stone)
- Slithersprout → Vipervine → Briarconda (Leaf / Shade)
- Aurorion (Glimmer / Frost legendary)
- Solarion (Ember / Glimmer legendary)

Added 30 transparent 96×96 PNG files with front, left-facing side, and rear views. Sprite maps and service-worker precaching include all views, with the established procedural fallback kept for remaining species, alternate hues, and silhouettes.

**Art production notes:** Prismite, Prismajest, Finnip, Koishine, and Snapjaw use newly generated illustration turnarounds. The three serpent evolutions use hand-constructed vector artwork and may benefit from another expressive polish pass; Aurorion and Solarion are custom recolored and embellished interpretations of existing Celestag and Wisplume sprites, respectively, and may also benefit from a fully bespoke redraw.

**Progress: 87 of 103 species fully illustrated; 16 remain.**

## Batch 13: mountain dragons, astral beings, and tentacled creatures

- Scaleling → Ridgewyrm → Highwyrm (Stone / Gust)
- Lunarfang (Shade / Glimmer)
- Stellet → Astraloom → Constellux (Glimmer / Shade)
- Inklet → Tendrill → Krakulon (Tide / Shade)

All ten creatures received three 96×96 transparent PNG sprite views: `<id>.png` (front), `<id>_side.png` (left profile), and `<id>_back.png` (rear). They are integrated into the existing 48×48 canvas-based renderer, with rightward mirroring, color/shape variant fallback, and service-worker offline precaching.

**Artwork notes:** The rocky dragon family, Lunarfang, and Stellet were extracted from a newly generated full-turnaround design sheet. Astraloom and Constellux are bespoke palette/geometry variations evolved from Stellet, featuring starfield cloaks and celestial details. Inklet, Tendrill, and Krakulon are recolored and substantially reworked illustrated aquatic forms with additional tentacles, jewel crests, and stage-specific silhouettes. The adapted evolutionary designs may benefit from a future character-specific polish pass.

**Progress: 97 of 103 species have three illustrated views; 6 remain.**

## Batch 14 — final six species (roster completion)

- Leviathra — Tide / Shade abyssal sea serpent
- Astraeon — Glimmer / Shade astral guardian
- Ignivorn — Ember / Stone volcanic beast
- Galefenrir — Gust / Shade storm wolf
- Nightjack — Shade / Gust nocturnal jackal-like trickster
- Valorhound — Glimmer / Plain heroic hound

All six species have standalone transparent 96×96 PNGs for the front (`<id>.png`), left-facing profile (`<id>_side.png`) and rear (`<id>_back.png`). All 18 images were extracted and cleaned from dedicated three-view character turnarounds. Nightjack required a separate alpha-matte cleanup. The game still renders these as 48×48 canvases where needed and retains procedural fallback for hue-shifted variants, silhouettes, and unavailable artwork.

**Roster milestone: all 103 species now have front, side, and back illustrations (309 PNGs).** Live browser gameplay QA and further bespoke polish remain potential follow-ups.
