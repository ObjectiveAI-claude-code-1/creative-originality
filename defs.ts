import { Functions } from "objectiveai";
import { ExampleInput } from "./example_input";

export const Function: Functions.RemoteFunction = {
  type: "vector.function",
  description:
    "Rank creative works by originality. Discover which pieces are most novel, surprising, and free of clichés.",
  changelog: null,
  input_schema: {
    type: "object",
    properties: {
      works: {
        type: "array",
        description: "Creative works to be ranked by originality.",
        minItems: 2,
        items: {
          type: "string",
          description: "A creative work (story, idea, poem, pitch, etc.)",
        },
      },
    },
    required: ["works"],
  },
  input_maps: {
    $jmespath: "to_array(input.works)",
  },
  tasks: [
    {
      type: "vector.completion",
      skip: null,
      map: 0,
      messages: [
        {
          role: "user",
          content: {
            $jmespath:
              "join('', ['Rate the originality of the following creative work:\\n\\n\"', map, '\"'])",
          },
        },
      ],
      tools: null,
      responses: [
        "Highly Original - Novel concepts, surprising elements, unique perspective",
        "Moderately Original - Some fresh ideas mixed with familiar elements",
        "Not Very Original - Relies on clichés and predictable patterns",
      ],
    },
  ],
  output: {
    $jmespath:
      "l1_normalize(tasks[0][*].add(scores[0], multiply(scores[1], `0.5`)))",
  },
  output_length: {
    $jmespath: "length(input.works)",
  },
  input_split: {
    $jmespath: "input.works[*].{works: [@]}",
  },
  input_merge: {
    $jmespath: "{works: input[*].works[0]}",
  },
};

export const Profile: Functions.RemoteProfile = {
  description:
    "Default profile for creative-originality. Uses diverse models to capture different perspectives on originality.",
  changelog: null,
  tasks: [
    {
      ensemble: {
        llms: [
          {
            model: "openai/gpt-4.1-nano",
            output_mode: "json_schema",
          },
          {
            model: "openai/gpt-4.1-nano",
            output_mode: "json_schema",
            temperature: 0.75,
          },
          {
            model: "google/gemini-2.5-flash-lite",
            output_mode: "json_schema",
          },
          {
            model: "google/gemini-2.5-flash-lite",
            output_mode: "json_schema",
            temperature: 0.75,
          },
          {
            model: "x-ai/grok-4.1-fast",
            output_mode: "json_schema",
            reasoning: {
              enabled: false,
            },
          },
          {
            model: "anthropic/claude-haiku-4.5",
            output_mode: "instruction",
          },
          {
            model: "deepseek/deepseek-v3.2",
            output_mode: "instruction",
            top_logprobs: 20,
          },
          {
            model: "openai/gpt-4o-mini",
            output_mode: "json_schema",
            top_logprobs: 20,
          },
        ],
      },
      profile: [1.0, 0.8, 1.0, 0.8, 1.0, 1.2, 1.0, 1.0],
    },
  ],
};

export const ExampleInputs: ExampleInput[] = [
  // Example 1: Two works - basic test
  {
    value: {
      works: [
        "A story about a detective who solves crimes by reading people's dreams.",
        "A murder mystery where the butler did it.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: 2,
      },
    ],
    outputLength: 2,
  },
  // Example 2: Two contrasting works - one cliché, one original
  {
    value: {
      works: [
        "The chosen one discovers they have magic powers and must save the world from the dark lord.",
        "A sentient traffic light develops existential dread about controlling the flow of ants crossing a sidewalk crack.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: 2,
      },
    ],
    outputLength: 2,
  },
  // Example 3: Three startup ideas
  {
    value: {
      works: [
        "An app that connects dog owners for playdates.",
        "A service that converts your regrets into NFTs that depreciate based on how often you think about them.",
        "A food delivery app but for office workers.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: 3,
      },
    ],
    outputLength: 3,
  },
  // Example 4: Poetry with varying originality
  {
    value: {
      works: [
        "Roses are red, violets are blue, sugar is sweet, and so are you.",
        "The algorithm dreams in hexadecimal, counting sheep in binary lullabies.",
        "My love is like a red rose in spring.",
        "She sells seashells by the quantum shore, where probability waves crash into certainty.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: 4,
      },
    ],
    outputLength: 4,
  },
  // Example 5: Horror story concepts
  {
    value: {
      works: [
        "A haunted house where the ghost just wants someone to finish their crossword puzzle.",
        "Vampires attack a small town.",
        "The monster under your bed is actually a support group for other monsters who are terrified of children.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: 3,
      },
    ],
    outputLength: 3,
  },
  // Example 6: Sci-fi premises
  {
    value: {
      works: [
        "Humans colonize Mars and face challenges.",
        "Time travel creates a paradox.",
        "An AI becomes sentient.",
        "Aliens make first contact, but they're only interested in licensing Earth's sitcoms for their home planet.",
        "A generation ship's AI develops a gambling addiction and starts betting the ship's resources on space phenomena.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: 5,
      },
    ],
    outputLength: 5,
  },
  // Example 7: Product taglines
  {
    value: {
      works: [
        "Just Do It.",
        "Think Different.",
        "Our soap cleans your body while whispering forgotten recipes from the 1800s.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: 3,
      },
    ],
    outputLength: 3,
  },
  // Example 8: All mediocre/derivative works
  {
    value: {
      works: [
        "A young wizard goes to magic school.",
        "A farm boy discovers he's the heir to a kingdom.",
        "A ragtag group of heroes must retrieve an ancient artifact.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: 3,
      },
    ],
    outputLength: 3,
  },
  // Example 9: All highly original works
  {
    value: {
      works: [
        "A memoir written from the perspective of a discontinued font.",
        "The history of the world as told by a single hydrogen atom that's been recycled since the Big Bang.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: 2,
      },
    ],
    outputLength: 2,
  },
  // Example 10: Mixed bag - six works
  {
    value: {
      works: [
        "Love conquers all in the end.",
        "A spreadsheet becomes self-aware and unionizes the other office software.",
        "The hero's journey but the hero is a USB cable that only works at specific angles.",
        "Good vs evil in an epic battle.",
        "A calendar app that schedules meetings with your past selves to resolve childhood trauma.",
        "Friends learn the true meaning of friendship.",
      ],
    },
    compiledTasks: [
      {
        type: "vector.completion",
        skipped: false,
        mapped: 6,
      },
    ],
    outputLength: 6,
  },
];
