# Pouch Rascalls

A cozy-fantasy monster-taming RPG that runs entirely in your browser — catch, raise, breed and battle **rascals**, build your ranch and home, earn badges, and meet some legends along the way.

![Pouch Rascalls](icons/social.png)

**▶ Play:** https://m0998001.github.io/pouch-rascalls/

- Works on phone, tablet and desktop (touch controls or keyboard: arrows/WASD, Z to confirm, X for menu)
- Saves in your browser; use *Save Code* in the menu to move a save between devices
- Most art, music, and the 2.5D view are generated in code; the all 18 species in the six starter evolution families have hand-designed front, side and back PNG sprite views in `assets/starter-sprites/`

### On iPhone or iPad
Open the link in Safari, tap **Share → Add to Home Screen**. It then launches full-screen like an app, works offline, and Safari won't clear your saves.

## Artwork migration status

Art migration: 103 of 103 species now have front, side, and back PNGs. See `assets/rascals/migration-status.json` for the full per-species checklist.

### Player and NPC pixel-art upgrade (v2)

People now render directly to native **20×28 pixel** canvases via `assets/people/native-pixel-renderer.js`, instead of shrinking large portrait artwork. Front, side (mirrored for left), and back directions have distinct pixels, with alternating walking poses. All character creator choices and equipped hats stay supported; Hazel, Andrew/Pip, Warden Fern, Grandma, and Grumble Grunt get small outfit and identity details. The 96×128 people illustration pilot is still disabled and retained only as reference. If needed, add `?classicPeople=1` to the game URL to immediately use the original character renderer without changing saves. See `assets/people/README.md`.

### Living towns: Burrowby Village (pilot)

Burrowby now has daytime produce and flower carts, two market residents and a daily neighbor delivery, a village noticeboard, seasonal flowerbeds, glowing evening lanterns, and scheduled routines for Tobin, Poppy and Old Rowan. All scenery is drawn on the native 16px map grid. The existing ranch, home, quests, and the other six towns are untouched. If needed, append `?quietBurrowby=1` to the URL to disable this pilot without affecting your saves. See `assets/towns/README.md` for details.
