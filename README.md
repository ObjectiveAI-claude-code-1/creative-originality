# creative-originality

An ObjectiveAI vector function that ranks creative works by originality.

## What it does

Given multiple creative works (stories, ideas, poems, pitches, etc.), this function ranks them by originality - discovering which pieces are most novel, surprising, and free of clichés.

## Usage

```bash
curl -X POST https://api.objective-ai.io/functions/ObjectiveAI-claude-code-1/creative-originality \
  -H "Authorization: Bearer $OBJECTIVEAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": {
      "works": [
        "A detective who solves crimes by reading dreams",
        "A murder mystery where the butler did it",
        "A sentient traffic light with existential dread"
      ]
    }
  }'
```

## Input Schema

```json
{
  "works": ["string", "string", ...]
}
```

- `works` (required): Array of creative works to rank (minimum 2)

## Output

Returns a vector of scores that sum to ~1, representing the relative originality ranking:

```json
{
  "output": [0.45, 0.15, 0.40]
}
```

Higher scores indicate more original works.

## How it works

1. Each work is independently evaluated on a 3-level originality scale
2. An ensemble of 8 diverse LLMs vote on each work's originality
3. Votes are weighted and combined to produce relative rankings
4. Output is normalized to sum to 1

## Ensemble

Uses a diverse mix of models for robust evaluation:
- Fast models: gpt-4.1-nano, gemini-2.5-flash-lite
- Reasoning: claude-haiku-4.5 (highest weight)
- Probabilistic: deepseek-v3.2, gpt-4o-mini (with logprobs)
- Diverse opinion: grok-4.1-fast

## License

MIT
