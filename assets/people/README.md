# Human sprite art — native-pixel v2

**Active:** `assets/people/native-pixel-renderer.js` (game caches `rascalls-v20-native-pixel-people`).

The character creator, overworld, battle intros, wardrobe previews, and 2.5-D view now share a **20×28 native pixel-art canvas**. Unlike the rolled-back 96×128 vector-to-tiny scaling attempt, the active renderer draws every shape and face detail directly on its final pixel grid, with no large-source downsampling. It preserves the existing game's character positions, collision footprint, depth sorting, and sprite API. Player skin, hair, eyes, expression, clothing type/colors, pants, shoes and equipped hats remain dynamic. Walking frame 1 and 3 alternate leg and arm poses in all directions; left mirrors the distinct right-side view.

Five named looks—Hazel, Andrew/Pip, Warden Fern, Grandma, and Grumble Grunt—receive identity-specific **native-pixel accessories** using their existing look references. Other NPCs use the same customizable pixel renderer. The earlier 15 hand-illustrated PNGs and `people-renderer.js` remain in this directory for reference but are **not loaded by the game**.

## QA and safety

An isolated Chromium/mobile-viewport renderer harness tested 372 output combinations across hairstyle, face, top, hat, direction, and walking frame. All canvases measured 20×28; no blank sprites, browser errors, or 390-pixel mobile-page overflow occurred. The player creator, five NPCs, and an overworld-size approximation were visually reviewed at mobile and desktop sizes. **This is a renderer-component test, not a full deployed iPhone gameplay test.**

Emergency fallback: append `?classicPeople=1` to the game URL. This skips the v2 renderer entirely and uses the old built-in `personSprite`/`personCanvas` without affecting saved progress.

Future art work: richer pixel-authored NPC class costumes, custom walking motions per archetype, and live device testing at user-selected mobile zoom levels.
