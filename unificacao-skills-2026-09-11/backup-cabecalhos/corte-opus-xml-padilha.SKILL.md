---
name: corte-opus-xml-padilha
description: Use when the user asks to make video cuts, Opus Clip style clips, Cortes-Padilha edits, social video cuts, Premiere XML, DaVinci XML, FCPXML, EDL, or says "faz um corte", "corta esse video", "gera cortes", "estilo Opus Clip", "abre no Premiere", or "abre no DaVinci". Enforces the user's saved workflow: use OpenAI key from IA_PADILHA/.env.local, no burned subtitles by default, deliver clean videos plus timeline interchange files.
---

# Corte Opus XML Padilha

Skill autoral Padilha para transformar videos longos em cortes curtos no estilo Opus Clip, com entrega limpa e arquivos de timeline para Premiere ou DaVinci.

## Default User Preferences

Use this workflow whenever the user asks for video cuts unless they explicitly override it.

- Use the saved OpenAI key from `/Users/ppvfx/Documents/IA_PADILHA/.env.local` as `OPENAI_API_KEY` for AI reasoning, transcription, hook selection, and clip planning.
- Do not burn subtitles into the video by default.
- Do not generate caption styling by default.
- Only generate `SRT`, `ASS`, or burned captions if the user explicitly asks.
- Deliver clean video files ready for the user to subtitle manually.
- Deliver an XML/timeline interchange file whenever practical.
- Preserve original media files untouched.
- Write session outputs in the source video's `edit/` directory, not in the skill directory.

## Trigger Phrases

Use this skill when the user says any equivalent of:

- `faz um corte`
- `corta esse video`
- `gera cortes`
- `estilo Opus Clip`
- `cortes pra reels`
- `cortes pro TikTok`
- `cortes pro Shorts`
- `me entrega XML`
- `abrir no Premiere`
- `abrir no DaVinci`
- `FCPXML`
- `EDL`
- `sem legenda`

## Required Companion Skills

Load and follow these skills when applicable:

- `video-use` for transcription, EDL, render pipeline, verification, project memory, and video editing hard rules.
- `cortes-padilha` for spoken-video tightening, removing dead air, stutters, false starts, repeated words, and filler.
- `video-tracking-padilha` when the target is vertical social video and a talking person must stay centered.

## Default Output

Unless the user specifies otherwise, produce:

- 5 to 8 short clips.
- 30 to 60 seconds per clip when the material supports it.
- Clean video exports without burned captions.
- A project-level `edl.json` with source ranges and reasons.
- A Premiere/DaVinci timeline interchange file: prefer `FCPXML` for DaVinci, and also provide `EDL` as fallback.
- A short report listing clip titles/hooks, duration, source timecodes, and output paths.

If the user asks for a single cut, produce one clean cut plus timeline interchange.

## XML And Timeline Delivery

Prefer this order:

1. `FCPXML` for DaVinci Resolve.
2. `FCPXML` or Premiere-compatible XML when Premiere compatibility is requested.
3. `EDL` fallback if XML generation is not reliable for the edit shape.
4. Keep `edl.json` as the internal source of truth.

The timeline file should reference the original media whenever possible so the user can open the edit in Premiere or DaVinci and adjust it there.

## Workflow

1. Inventory the source video with `ffprobe`.
2. Load `OPENAI_API_KEY` from `/Users/ppvfx/Documents/IA_PADILHA/.env.local` before running AI/transcription tools when needed.
3. Transcribe with word-level timestamps and cache transcripts in `edit/transcripts/`.
4. Build or reuse `takes_packed.md`.
5. Identify strong standalone moments in Opus Clip style: hook, context, value, payoff, and clean ending.
6. Apply `Cortes-Padilha` defaults: direct pacing, no dead air, no repeated starts, no gaguejos, no false starts, preserve meaning.
7. If vertical social format is requested or implied, apply `Video-Tracking-Padilha`: 9:16, no black bars, smooth face/torso centering.
8. Propose the strategy in plain Portuguese and wait for confirmation before editing, following `video-use` hard rules.
9. Render previews without subtitles.
10. Generate timeline interchange files after the EDL is stable.
11. Verify output duration, audio transitions, framing, and that no subtitles were burned.
12. Persist decisions in `edit/project.md`.

## Strategy Confirmation Template

Before touching the edit, summarize:

- Quantos cortes vou gerar.
- Duracao alvo de cada corte.
- Se sera horizontal, vertical, or both.
- Nivel de ritmo: `Padilha Natural`, `Padilha Direto`, or `Padilha Agressivo`.
- Entrega XML: `Premiere`, `DaVinci`, or `ambos`.
- Confirmacao de que nao havera legenda queimada.

Then wait for user approval before executing.

## Defaults When The User Does Not Specify

- Rhythm: `Padilha Direto`.
- Captions: none.
- Timeline: `FCPXML` plus `EDL` fallback.
- Format: keep source aspect unless the user says Reels, TikTok, Shorts, vertical, or Opus Clip; for those, use 9:16 `1080x1920`.
- Grade: neutral unless the source clearly needs correction.
- Output folder: `<source_video_dir>/edit/`.

## Hard Rules

- Never expose or print the API key.
- Never write the API key into project outputs, XML files, reports, transcripts, or logs.
- Never burn subtitles unless explicitly requested.
- Never cut inside a word.
- Always add micro-fades at cut boundaries.
- Preserve meaning and legal/commercial claims.
- Preserve original media untouched.
- Verify that exported videos have no burned captions before delivery.
- If XML cannot be produced reliably, provide `EDL` and `edl.json` and clearly state the limitation.

## Report Format

End each completed job with:

- `Videos:` paths to clean exports.
- `Timeline:` paths to XML/FCPXML/EDL files.
- `Project:` path to `edl.json` and `project.md`.
- `Notes:` any compatibility caveats for Premiere or DaVinci.
