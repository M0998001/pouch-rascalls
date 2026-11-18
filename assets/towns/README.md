# Burrowby Village — full map redesign v2

**Status:** Active in `assets/towns/burrowby-redesign-v2.js`. The older additive-only `burrowby-living-v1.js` remains in the repository for historical reference but is no longer loaded.

## Town plan

- Expanded native tile layout from **32×24** to **40×32** with winding village lanes and a new **Juniper Square** fountain / market plaza.
- **North:** relocated Grandma Juniper's red-roof cottage and Professor Hazel's green-roof lab. The northern Clover Path gate retains the starter-safety story trigger.
- **West:** the blue-roof general shop, an enterable pink-roof **Craft & Post Hall**, tended flowerbeds, and low-density residential greenery.
- **South:** a small pond and wooden crossing, an enterable **Tea Room**, gardens, and meandering footpaths.
- **East:** the existing **Ranch**, **barn**, paddocks, crop plots and upgraded **player home**, with a new enterable **Garden House** and orchard planting.
- Building roofs, doors, cobbled/dirt paths, trees, water and fences use the game's native tiles; fountain and decorative objects are independently pixel-drawn through `drawFn` for both 2D and 2.5D.

## Preserved core functionality

The original Grandma healing and wardrobe dialogue, Hazel story and starter sequence, village general shop, ranch gate, barn, player home upgrade system, Clover Path exits, fast travel, and the 103 Rascal species remain intact. The map keeps the ranch's required **(20,9) gate**, **(27,5) barn**, and **(22,18) player-home doorway** to avoid breaking downstream systems. All other main entrances are relocated via their existing functions. New indoor rooms use the established interior map machinery and return to safe outdoor tiles.

Existing saves are migrated once: players saved directly inside old Burrowby arrive at the new square, existing Burrowby respawn points redirect to Grandma's door, and other town saves are left unchanged. The classic fallback also rescues saves made inside new interiors.

## Town life

Two illustrated market stalls and vendors open **7:00 AM–6:30 PM**. Marnie sells a daily Sweet Berry bundle; Bram accepts one Berry for a neighbor delivery reward. Daily interaction records in `G.burrowbyLife` are retained. Tobin, Poppy, Old Rowan and Groundskeeper Sage follow collision-safe routines; lanterns and stalls change with the clock; flowerbeds respond to the season. The Tea Room offers a paid Rascal rest, while the Craft Hall and Garden House are accessible interiors.

## Testing and opt-out

- The script is syntactically validated with Node; a VM harness checks the layout dimensions, retained doorway callbacks, bidirectional connections, ranch gate, new indoor returns, a flood-fill from the village square to all critical entrances, market hours and once-per-day interactions.
- This is an **isolated implementation test** and visual map-plan review, not yet a complete gameplay test on an actual iPhone.
- Emergency fallback: `?classicBurrowby=1` (or the previous `?quietBurrowby=1`) disables the new layout. Existing saves are not erased. If the save is inside a new building when fallback is enabled, the player is safely returned to the classic village.
- Maintain mobile speed: only one resident pathfinding/walking step is attempted about every 1.6 seconds when the player is in Burrowby and no game modal/cutscene is open.

## Next planned redesign

Mossbrook should receive its own terrain plan, bakery/festival district and mapped building interiors, not merely extra decorative NPCs.
