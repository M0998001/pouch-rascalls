# Illustrated Rascal art — migration batches

The game originally draws 48×48 monster sprites procedurally from species definitions in `index.html`. This directory contains replacement transparent 96×96 front-view art for six first-stage starter evolutions, part of the ongoing migration to individually illustrated Rascal designs.

**Batch 01:** Thornpup, Cindercat, Brookfin, Joltwolf, Frostbear, and Shimmerwing.

The six starters have front/side/back illustrations under `assets/starter-sprites/`. These six new evolutions have **front views only**; their side/back views, color-shifted versions, and silhouettes still use the original procedural renderer. The loader in `index.html` selects illustrated views only when an actual PNG mapping exists. Right-facing follower sprites continue to mirror any available side view.

All replacement sprites are 96×96 transparent PNGs downscaled into 48×48 canvases by the renderer; `sw.js` precaches the additions for offline use.
