# Human-character art pilot (temporarily disabled)

**Status (November 2026): rolled back from active game rendering.**

The original 16×18/20×28 canvas-based character implementation is active for the player and NPCs again. The first illustrated human pilot introduced a 96×128 vector avatar and resized it to 20×28 for the world, which distorted faces, hair, and proportions when pixel-scaled on mobile. It was not an appropriate production replacement.

The 15 transparent 96×128 PNGs remain here as concept/reference art for Hazel, Pip/Andrew, Warden Fern, Grandma, and Grumble Grunt. The experimental renderer source `people-renderer.js` is retained for reference **but is not loaded by `index.html` or precached by `sw.js`**.

## Next implementation requirements

- Render directly to the game's native 20×28 character canvas (or author true pixel-art frames at that exact pixel grid) instead of shrinking vector portraits.
- Preserve the player creator's all hair, skin, eyes, face, clothes, accessories, and equipped hats.
- Add real 4-direction walk frames and clear silhouettes, and verify at 1×, CSS-scaled, 2.5-D and iPhone mobile resolutions.
- Only enable new art once the new player and NPC renderers have been visually compared at in-game size, in the actual character creator and overworld.

This is a rollback of the human-art pilot **only**; illustrated Rascal assets are unchanged.
