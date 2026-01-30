# creative-originality

A vector function that ranks creative works by originality/novelty.

## Function Design

**Type:** `vector.function`

**Description:** Rank creative works by originality. Given multiple pieces of creative content, discover which is most novel, surprising, and free of clichés.

**Input Schema:**
```json
{
  "type": "object",
  "properties": {
    "works": {
      "type": "array",
      "description": "Creative works to be ranked by originality.",
      "minItems": 1,
      "items": {
        "type": "string",
        "description": "A creative work (story, idea, poem, pitch, etc.)"
      }
    },
    "context": {
      "type": "string",
      "description": "Optional domain context (e.g., 'sci-fi short stories', 'startup ideas')"
    }
  },
  "required": ["works"]
}
```

**Approach:**
- Single vector.completion task that asks LLMs to identify the most original work
- Responses are labeled options (A, B, C, etc.) corresponding to each work
- Output uses the task scores directly (already sum to ~1 for vector functions)

**Evaluation Criteria:**
- Avoidance of clichés and common tropes
- Unexpected combinations or perspectives
- Novelty of concept/premise
- Surprising execution or structure

## Profile Design

Use a diverse ensemble of models with varying temperatures to capture different perspectives on originality:
- Fast models (gpt-4.1-nano, gemini-2.5-flash-lite) for baseline
- Reasoning models (claude-haiku, grok) for deeper analysis
- Models with logprobs (deepseek, gpt-4o-mini) for probabilistic voting

## Example Inputs

10 diverse examples covering:
- Different numbers of works (including 1-item edge case)
- Various creative domains (stories, ideas, poems, pitches)
- Mix of clearly original vs derivative content
- With and without context field
