# Living towns — Burrowby pilot

## Town 1: Burrowby Village

Implemented by `assets/towns/burrowby-living-v1.js` loaded after the core game and the native-pixel people renderer. No original map rows, doors, warps, gates, triggers, homes, ranch geometry, or other towns are replaced.

### Activity

- **Daily market:** a produce cart and a seasonal flower cart open **7:00 AM–6:30 PM** on the in-game clock (or device clock if Real Time is enabled). Both are pixel-drawn directly at the game's **16px tile scale** and are covered after closing.
- **Two residents:** Marnie the Gardener sells a daily two-Sweet-Berry bundle. Bram the Delivery Baker accepts one Berry daily for a modest neighbor-delivery reward. These transactions use the existing inventory, currency, save, and sound systems.
- **Town props:** an interactive noticeboard, a seasonal flowerbed, and two lanterns that illuminate at night. Props are pixel-authored at the native map size, with subtle animated details, and use existing `drawFn` support in 2D and 2.5-D.
- **Residents' daily routines:** Tobin, Poppy, and Old Rowan walk one safe tile at a time toward different destinations during morning, daytime, evening, and night. Their first conversation in each time period includes a short local remark before the existing original dialogue. The planner avoids blocked tiles, doors, exits, story triggers, other residents, and the player's position, and pauses during cutscenes/dialogues.
- **Gentle save integration:** only the optional `G.burrowbyLife` record is created when interacting with residents/vendors. No migration is required and existing save slots are preserved.

### Safeguards and testing

Node VM smoke tests checked placement, daytime and nighttime schedules, tile-safe movement, opening hours, one-per-day market transactions, and the opt-out switch. This **does not constitute a full deployed iPhone gameplay test**. The original NPC behavior remains intact when the module is disabled.

**Emergency fallback:** open the game with `?quietBurrowby=1` to skip this town extension entirely, without modifying any save data or disabling the player/NPC sprite updates. Remove the parameter to re-enable the living-town features.

### Planned town 2

Mossbrook: working bakery, shopkeeper routines, expanding flower gardens, festival crowds and seasonal visitors. Implement only after Burrowby has been reviewed in the real game.
