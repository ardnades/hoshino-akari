# CLAUDE.md — 星野灯 (Hoshino Akari) Project

Project-level working rules for this repo. When developing inside the `M:\ai-games` workspace, the workspace-root `M:\ai-games\CLAUDE.md` also loads and additionally covers the shared cross-session **memory store** and the **graphify** code map; this file is the rulebook that ships with the repo.

## Identity & scope

- A 7-night idol-romance AVG (static web game, zero player-runtime backend) + a local Anima/ComfyUI art pipeline. Personal, non-commercial.
- The active game is `projects/hoshino-akari/`. `archive/` is retired (雨夜偵探社 detective game + generic story factory) — reference only; never wire it into the runtime.
- Prefer small, auditable changes. Don't expand scope, rewrite unrelated systems, or do broad reformat/rename/dependency/architecture changes without explicit request. When uncertain, report `BLOCKED` instead of guessing.

## Layers (identify which one a task belongs to before editing)

player runtime · story data · art pipeline · production tools · validator/inspector · deployment · docs. Do not modify files outside the requested layer unless the task requires it.

## Strict no-touch (unless explicitly instructed)

deployed player behavior · route/ending logic · story canon · existing valid data format · public asset paths · `localStorage` contract · validator rules · engine runtime assumptions. If a task needs one of these, stop and explain.

**Exception — approved reform baseline (Option A):** the user has approved a full-script reform. Within that scope, `spec/23`+`spec/26` are the new baseline; rewriting landed `day*.js`, adding scores `stance`/`heat`, and going from 4 to 7 fate endings are permitted (see Data contract). Editing the validator allowlists (`story_schema.js` `SCORE_KEYS`/`REQUIRED_TONES`) and the engine save-restore points to add `stance`/`heat` defaults and the 3 new tones is part of this scope — but no existing validator rule may be weakened. The exception does not license unrelated-system edits or broad reformat/rename/dep/architecture work. Reform progress/decisions go in `DECISIONS.md`/`STORY_BIBLE.md`, not here.

## Story editing

Preserve emotional pacing, character voice, day-to-day continuity, and choice consequences. Don't shorten scenes just for length or remove quiet beats. Keep Hoshino Akari guarded/sharp in public; let softness surface gradually and indirectly. For Traditional Chinese: natural Taiwan/HK readable prose, no AI-ish phrasing or awkward literal translation. Punctuation/blacklist rules are enforced by `scripts/check-text.ps1` — run it on any changed text; canonical performance text is `play/data/*.js`.

## Data contract

Before editing story data, inspect `play/data/{meta,chapters,day*,endings,assets}.js`, `play/art.js`, `play/engine.js`. Don't invent fields the engine/tools don't support. If a new field is truly needed: explain why → update validator/inspector → confirm runtime still works → document it.

**Reform score model (approved):** scores are `bond` (reuse `affection`), `seen` (reuse `awareness`), `regret` (kept), `distance` (kept as an internal sub-term of `warmth`), plus two new fields — `stance` (signed; must allow negative `add`) and `heat` (0-100, accrued by a fixed per-night opening `add:{heat}`, NOT a time-driven sub-system). Any new score/flag must be **actually read** by `judge` (meta.js) or a choice gate — no dead flags. The ending set is **7 fate endings** (was 4); each tone needs an `endingMeta` entry, an `endings.js` playback array, and a resolvable `ART[badge]` function — adding a tone to `judge` without all three is a validator error/crash.

**Save-file contract:** `localStorage` stores `{day, scores, flags}`. Adding score fields must stay backward-compatible — supply `{...M.initScores, ...save.scores}` defaults at every restore point; never break or silently discard an old save.

## Art pipeline

Preserve canon identity and cross-expression consistency (same face structure, hair, age, silhouette). Don't replace the whole character when only a face fix is asked. Keep overlay parts (eyes/mouth/brows/blush) aligned to the base and color-consistent. Model is **Anima** (Cosmos-Predict2-2B DiT, not SDXL/Qwen-Image) — non-commercial license propagates to derived art.

## Verify before claiming done

- Story data / tools: `node projects/hoshino-akari/tools/validate_story.js` (or `npm run validate`). Don't weaken rules to silence errors; explain any change in error/warning counts.
- JS: `node --check <file>`. Art backend: `python -m pytest art_tool/tests`.
- Don't claim "tested" unless runtime behavior was actually executed.

## Completion report

Every task report states: files added/modified/deleted; whether `engine.js` changed; whether `play/data/*` changed; whether deps were added; validation/test commands run + results; remaining risks.
