---
name: corte-video-respect
description: Use when cutting videos with the corte_video_respect rule: do not select clips that talk about people, point to people, imply people, resemble people, mention names, describe identifiable persons, compare someone to a person, or create a cut whose hook depends on a person reference. Trigger on "corte_video_respect", "corte video respect", "corte respeitoso", "nao pegue cortes sobre pessoas", "sem falar de pessoas", "sem remeter a pessoas", or "sem lembrar pessoas".
---

# Corte Video Respect

Alias pedido pelo usuario: `corte_video_respect`.

Use this skill as a safety/editorial filter whenever selecting cuts from a video. It does not replace `video-use`, `corte-opus-xml-padilha`, or `cortes-padilha`; it constrains which moments can be selected.

## Goal

Generate cuts that focus on ideas, concepts, processes, tools, methods, lessons, products, systems, or events without making the cut about a person or implying a person.

If a strong clip depends on a person reference, reject it. Do not anonymize it just to keep it. Removing a name is not enough when the context still points to a person.

## Hard Rules

- Reject any candidate that names a person, nickname, public figure, client, family member, friend, employee, creator, politician, celebrity, influencer, teacher, doctor, ex-partner, or private individual.
- Reject indirect references to a specific person: `aquele cara`, `a menina`, `o cliente`, `meu amigo`, `minha ex`, `meu chefe`, `o professor`, `o medico`, `ele`, `ela`, `essa pessoa`, when the context identifies someone.
- Reject resemblance or comparison references: `parece com`, `lembra`, `igual a`, `tipo fulano`, `estilo fulano`, `clone de`, `voz de`, `rosto de`, `jeito de`, `falando como`, `age como`, `cara de`.
- Reject cuts about a person's body, face, voice, appearance, age, behavior, reputation, health, relationship, mistake, scandal, blame, praise, or moral judgment.
- Reject cuts that visually or textually point to an identifiable person as the subject of the clip.
- If the source is a talking-head video, the speaker may remain on screen as narrator. The rule is about the cut's subject and hook, not the mere presence of a presenter.
- If a candidate is ambiguous, mark it rejected or ask the user before using it.
- Never create titles, subtitles, hooks, descriptions, markers, XML names, or report text that add a person reference back into an otherwise safe clip.

## Allowed Cut Topics

Prefer clips about:

- Concepts and principles.
- Processes, systems, frameworks, workflows, and operations.
- Tools, apps, platforms, products, and features.
- Market trends, technology, education, business, creativity, productivity, and strategy.
- Lessons stated generically without pointing to a specific person.
- Stories only when the people are fully non-identifiable and not the hook.

## Candidate Filter

For every proposed clip, assign a respect status before it enters the EDL:

- `approved`: no direct, indirect, visual, or resemblance-based person reference.
- `rejected_person_name`: includes a name, nickname, title tied to a person, or public figure.
- `rejected_identifiable_person`: describes or points to a specific person without naming them.
- `rejected_resemblance`: compares, reminds, imitates, or evokes a person.
- `rejected_person_judgment`: evaluates a person's behavior, image, body, reputation, mistake, or private life.
- `rejected_ambiguous`: unclear whether a person can be identified.

Only `approved` clips can be rendered.

## Workflow

1. Transcribe the video with word-level timestamps.
2. Build normal cut candidates using the active video cutting skill.
3. Run the `corte_video_respect` filter on every candidate before ranking final clips.
4. Remove rejected candidates from the cut pool.
5. If the best moments are rejected, find safer concept-based moments instead.
6. If no safe clips remain, stop and tell the user instead of forcing a risky cut.
7. In `edl.json`, include `respect_status: "approved"` for kept cuts.
8. In the report, list rejected categories only in aggregate unless the user asks for detailed audit.

## EDL Requirements

Every kept clip should include:

```json
{
  "source": "input.mp4",
  "start": 12.34,
  "end": 45.67,
  "beat": "concept",
  "quote": "safe generic quote",
  "reason": "strong concept-based cut",
  "respect_status": "approved"
}
```

Do not include rejected clips in final render EDLs.

## Rejection Examples

Reject:

```text
O Joao fez isso errado.
```

Reason: `rejected_person_name`.

Reject:

```text
Aquele cliente sempre fazia a mesma coisa.
```

Reason: `rejected_identifiable_person`.

Reject:

```text
Esse produto parece coisa do Elon Musk.
```

Reason: `rejected_resemblance`.

Reject:

```text
Ela tem uma voz igual a de uma apresentadora famosa.
```

Reason: `rejected_resemblance`.

Approve:

```text
O processo fica mais simples quando voce separa coleta, analise e execucao.
```

Reason: concept/process, no person reference.

Approve:

```text
A automacao economiza tempo porque tira tarefas repetitivas do fluxo manual.
```

Reason: tool/process, no person reference.

## Strategy Confirmation Add-On

When this skill is active, the strategy confirmation must include:

- `Filtro corte_video_respect ativo`.
- No cuts about people, references to people, resemblance to people, or identifiable person stories.
- If a candidate is ambiguous, it will be rejected or brought back for confirmation.

## Final Report Add-On

End with a short respect audit:

- `Filtro corte_video_respect`: active.
- `Clipes aprovados`: count.
- `Candidatos rejeitados por referencia a pessoas`: count.
- `Ambiguidades`: count, if any.
