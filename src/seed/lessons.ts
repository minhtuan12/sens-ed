import type { Lesson, LessonStep, VocabularyItem } from "@/types/sensed";

const vocabulary: VocabularyItem[] = [
  {
    id: "tray",
    word: "Tray",
    transcription: 'trā',
    translation: "Khay đựng",
    description: "A tray is a flat board with low raised edges, used to carry multiple items at once without them falling.",
    tactilePrompt:
      "Find card B1. Feel the wax outline forming a flat rectangle. Now hold both hands flat, side by side, palms up like a tray.",
    interactionPrompt: "You have learned tray. Now lift the tray by pressing Up Arrow firmly and hold for two seconds.",
    keyboardAction: "ArrowUp",
    position: "left",
    imageKind: "tray"
  },
  {
    id: "tong",
    word: "Tong",
    transcription: 'tôNG',
    translation: "Kẹp gắp",
    description: "A tong is a tool with two long springy arms used to grip and move bread from the display into a tray hygienically.",
    tactilePrompt:
      "Find card B2. Feel the wax wire bent into a flexible V-shape. Pinch your right thumb and fingers together, then open and close repeatedly.",
    interactionPrompt: "You have finished tong. Now test its spring by pressing Spacebar twice quickly.",
    keyboardAction: " ",
    position: "left",
    imageKind: "tong"
  },
  {
    id: "breadbox",
    word: "Breadbox",
    transcription: 'ˈbredˌbäks',
    translation: "Tủ đựng bánh",
    description: "A breadbox is a lidded box or glass cabinet used to protect bread from dust and keep it fresh and fragrant.",
    tactilePrompt:
      "Find card B3. Feel the wax arch shape, hollow inside. Cup your left hand into a fixed dome and slide your right hand underneath it.",
    interactionPrompt: "You have finished breadbox. Press and hold Up Arrow for three seconds, then release.",
    keyboardAction: "ArrowUp",
    position: "center",
    imageKind: "breadbox"
  },
  {
    id: "bread",
    word: "Bread",
    transcription: 'ˈbred',
    translation: "Bánh mì",
    description:
      "Bread is a baked food made from wheat flour with a golden crust outside and a soft warm interior that fills your stomach.",
    tactilePrompt: "Find card B4. Run your fingers along the thick, elongated wax shape in the center of the card.",
    interactionPrompt: "You have finished bread. Press Right Arrow to move the tong over and drop bread onto the tray.",
    keyboardAction: "ArrowRight",
    position: "center",
    imageKind: "bread"
  },
  {
    id: "cashier",
    word: "Cashier",
    transcription: 'kaˈSHir',
    translation: "Quầy thu ngân",
    description: "A cashier is a public payment counter where you wait in line to exchange money before taking your bread home.",
    tactilePrompt:
      "Find card B5. Trace your finger over the bumpy wax buttons representing a cash register keyboard. Tap the table three times like pressing keys to pay.",
    interactionPrompt: "You have finished cashier. Now place the tray on the counter. Press Down Arrow decisively.",
    keyboardAction: "ArrowDown",
    position: "right",
    imageKind: "cashier"
  }
];

const spellingOrder = ["breadbox", "bread", "cashier", "tong", "tray"];

function wordSteps(item: VocabularyItem): LessonStep[] {
  const wordUpper = item.word.toUpperCase();
  const spellOut = wordUpper.split("").join(" - ");

  return [
    {
      id: `map-${item.id}`,
      kind: "bakery-map",
      title: item.word,
      visual: "bakery-map",
      activeVocabularyId: item.id,
      highlightedZone: item.position,
      mapMarker: item.id as LessonStep["mapMarker"],
      narration: navigationNarration(item.id),
      prompt: navigationPrompt(item.id),
      targetKey: navigationKey(item.id)
    },
    {
      id: `word-${item.id}`,
      kind: "vocabulary",
      title: item.word,
      visual: "word-card",
      vocabularyId: item.id,
      narration: `${wordUpper}. ${wordUpper}. ${spellOut}. ${item.word}. ${wordLabel(item.id)}.`,
      prompt: "Press Next for pronunciation practice.",
      targetKey: "Enter"
    },
    {
      id: `mic-${item.id}`,
      kind: "vocabulary",
      title: `Repeat ${item.word}`,
      visual: "mic",
      vocabularyId: item.id,
      narration: `Repeat the word ${item.word}. Countdown. Three. Two. One. Press Tab to activate the mic.`,
      prompt: "Press Tab to activate mic practice.",
      targetKey: "Tab"
    },
    {
      id: `tactile-${item.id}`,
      kind: "vocabulary",
      title: `${item.word} tactile card`,
      visual: "word-card",
      vocabularyId: item.id,
      narration: item.tactilePrompt,
      prompt: "Press Next for the definition.",
      targetKey: "Enter"
    },
    {
      id: `definition-${item.id}`,
      kind: "vocabulary",
      title: `${item.word} definition`,
      visual: "word-card",
      vocabularyId: item.id,
      narration: item.description,
      prompt: "Press Next for the interaction.",
      targetKey: "Enter"
    },
    {
      id: `interact-${item.id}`,
      kind: "vocabulary",
      title: `${item.word} interaction`,
      visual: "word-card",
      vocabularyId: item.id,
      narration: item.interactionPrompt,
      prompt: `Press ${keyLabel(item.keyboardAction)}.`,
      targetKey: item.keyboardAction
    }
  ];
}

function navigationNarration(id: string) {
  switch (id) {
    case "tray":
      return "You just entered the bakery. To your left is the tray station. Press Left Arrow then Up Arrow three times to approach. You have reached the tray. Press Tab to explore this word.";
    case "tong":
      return "Next to the tray, hear the tiny metal clicking sound. That is the bread tong. Step right one step. You have reached the tong. Press Tab to interact.";
    case "breadbox":
      return "In the center, hear someone opening the bread cabinet. Turn left and walk three steps forward. You have reached the breadbox. Press Tab to interact.";
    case "bread":
      return "Inside the breadbox, hear the sound of crispy bread. Press Tab to explore it.";
    default:
      return "The bread is on the tray. Last step. Hear the register sound to your right. Press Right Arrow three times then Tab. You have reached the cashier. Press Tab.";
  }
}

function navigationPrompt(id: string) {
  if (id === "tray") {
    return "Press Tab after reaching the tray.";
  }

  if (id === "cashier") {
    return "Press Tab at the cashier.";
  }

  return "Press Tab to interact.";
}

function navigationKey(id: string) {
  return id === "tray" ? "Tab" : "Tab";
}

function wordLabel(id: string) {
  switch (id) {
    case "tray":
      return "The serving tray";
    case "tong":
      return "The bread tong";
    case "breadbox":
      return "The bread cabinet";
    case "bread":
      return "Banh mi";
    default:
      return "The payment counter";
  }
}

function keyLabel(key: string) {
  if (key === " ") {
    return "Spacebar";
  }

  return key.replace("Arrow", "Arrow ");
}

const sentenceSteps: LessonStep[] = [
  {
    id: "social-intro",
    kind: "sentence-pattern",
    title: "Social Interaction Skills",
    visual: "cashier",
    narration:
      "Welcome to Social Interaction Skills. We will learn two sentence patterns to help you communicate confidently at the bakery.",
    prompt: "Press Next.",
    targetKey: "Enter"
  },
  {
    id: "pattern-have-frame",
    kind: "sentence-pattern",
    title: "Can I have..., please?",
    visual: "sentence-card",
    sentenceText: "Can I have ______, please?",
    narration:
      "Sentence pattern one. Can I have, please? Cross your arms and practice the rhythm: clap left hand and say Can I have a, clap right hand and say please.",
    prompt: "Press Next to fill in the word.",
    targetKey: "Enter"
  },
  {
    id: "pattern-have-filled",
    kind: "sentence-pattern",
    title: "Can I have a tong, please?",
    visual: "sentence-card",
    sentenceText: "Can I have a tong, please?",
    narration:
      "This means may I have a, please. The word please makes you very polite. Now insert tong from Lesson 1. Can I have a tong, please?",
    prompt: "Press Next for cashier dialogue.",
    targetKey: "Enter"
  },
  {
    id: "pattern-have-cashier",
    kind: "sentence-pattern",
    title: "Cashier dialogue",
    visual: "cashier",
    narration:
      "Hello. What do you want, little friend? The cashier voice is clear and close. When someone is close, do not shout and do not mumble. Face forward and speak in a clear, normal voice.",
    prompt: "Press Spacebar to activate mic practice.",
    targetKey: " "
  },
  {
    id: "pattern-buy-frame",
    kind: "sentence-pattern",
    title: "I want to buy some..., please.",
    visual: "sentence-card",
    sentenceText: "I want to buy ______, please",
    narration:
      "Sentence pattern two. I want to buy some, please. Cross arms again: clap left for I want to buy, clap right for please.",
    prompt: "Press Next to fill in the word.",
    targetKey: "Enter"
  },
  {
    id: "pattern-buy-filled",
    kind: "sentence-pattern",
    title: "I want to buy some bread, please",
    visual: "sentence-card",
    sentenceText: "I want to buy some bread, please",
    narration:
      "This means I would like to buy some, please. This shows you are an independent and mature customer. I want to buy some bread, please.",
    prompt: "Press Next for cashier dialogue.",
    targetKey: "Enter"
  },
  {
    id: "pattern-buy-cashier",
    kind: "sentence-pattern",
    title: "Cashier dialogue",
    visual: "cashier",
    narration:
      "Hello. What do you want, little friend? The cashier voice is close. Speak clearly, normally, and gently.",
    prompt: "Press Spacebar to activate mic practice.",
    targetKey: " "
  },
  {
    id: "pattern-complete",
    kind: "sentence-pattern",
    title: "Excellent",
    visual: "waveform",
    narration: "Excellent. You have mastered the sentence patterns. Press Next for the Practice Challenge.",
    prompt: "Press Next.",
    targetKey: "Enter"
  }
];

export const lessons: Lesson[] = [
  {
    id: "getting-started",
    number: 0,
    title: "Getting Started",
    unitTitle: "Keyboard practice",
    summary: "Learn how to move, select, and listen with the SensED keyboard controls.",
    vocabulary: [],
    stages: [
      {
        id: "controls",
        title: "Keyboard controls",
        description: "Practice the keys used across every lesson.",
        steps: [
          {
            id: "welcome-controls",
            kind: "intro",
            title: "Welcome to SensED",
            narration: "Welcome to SensED. Use Tab, Enter, Spacebar, arrow keys, and number keys to learn.",
            prompt: "Press Space to continue.",
            targetKey: " "
          },
          {
            id: "arrow-practice",
            kind: "intro",
            title: "Arrow keys",
            narration: "The arrow keys help you move, choose, and respond. Press the Right Arrow now.",
            prompt: "Press Right Arrow.",
            targetKey: "ArrowRight"
          },
          {
            id: "controls-complete",
            kind: "complete",
            title: "Ready",
            narration: "You are ready for Unit 1.",
            prompt: "Press Enter to return to lessons.",
            targetKey: "Enter"
          }
        ]
      }
    ]
  },
  {
    id: "unit-7-bakery",
    number: 1,
    title: "Lesson 1",
    unitTitle: "In the bakery",
    summary: "Learn bakery vocabulary and polite buying sentences through audio-guided keyboard practice.",
    vocabulary,
    stages: [
      {
        id: "vocabulary-learning",
        title: "Vocabulary learning",
        description: "Open the bakery, orient to the shop, and learn five words.",
        steps: [
          {
            id: "bakery-storefront",
            kind: "bakery-map",
            title: "In the bakery",
            visual: "bakery-storefront",
            narration: "Welcome to the bakery. Press Spacebar to enter.",
            prompt: "Press Spacebar to enter the bakery.",
            targetKey: " "
          },
          {
            id: "shop-orientation",
            kind: "bakery-map",
            title: "In the bakery",
            visual: "bakery-map",
            mapMarker: "entrance",
            narration:
              "Please listen to the guide. To your left is the tray and tongs. In the middle is the breadbox full of warm bread. To your right near the door is the cashier.",
            prompt: "Press Next to explore vocabulary.",
            targetKey: "Enter"
          },
          ...vocabulary.flatMap((item) => wordSteps(item))
        ]
      },
      {
        id: "spelling-test",
        title: "Audio Spelling Bee",
        description: "Type each bakery word after hearing the clue.",
        steps: [
          {
            id: "spelling-intro",
            kind: "spelling-test",
            title: "Audio Spelling Bee",
            visual: "choice-cards",
            narration: "Welcome to the Audio Spelling Bee.",
            prompt: "Press Next.",
            targetKey: "Enter"
          },
          ...spellingOrder.map((id, index) => {
            const item = vocabulary.find((entry) => entry.id === id)!;
            return {
              id: `spell-${item.id}`,
              kind: "spelling-test" as const,
              title: `${index + 1}.`,
              visual: "choice-cards" as const,
              narration: `Question ${index + 1}. Spell the word for ${item.translation}.`,
              prompt: `Type ${item.word}, then press Enter.`,
              answer: item.word
            };
          })
        ]
      },
      {
        id: "sentence-patterns",
        title: "Social interaction",
        description: "Practice polite sentence patterns for the bakery.",
        steps: sentenceSteps
      },
      {
        id: "dilemma",
        title: "Situation testing",
        description: "Choose the polite response with arrow keys.",
        steps: [
          {
            id: "dilemma-intro",
            kind: "dilemma",
            title: "SITUATION",
            visual: "situation",
            narration:
              "Your mission: listen to each situation and choose the right sentence pattern. Press Left Arrow for option A, Right Arrow for option B.",
            prompt: "Press Next to begin Situation 1.",
            targetKey: "Enter"
          },
          {
            id: "busy-cashier",
            kind: "dilemma",
            title: "Situation 1",
            visual: "choice-cards",
            narration:
              "The cashier is very busy processing orders. A polite person waits until she is free before ordering. What do you do?",
            prompt: "Press Left Arrow for A. Press Right Arrow for B.",
            options: [
              {
                id: "rush",
                key: "ArrowLeft",
                label: "A",
                correct: false,
                feedback: "Hey, please wait. Do not shout."
              },
              {
                id: "wait",
                key: "ArrowRight",
                label: "B",
                correct: true,
                feedback: "Oh, thank you for waiting. Yes, here is your cake."
              }
            ]
          },
          {
            id: "tired-cashier",
            kind: "dilemma",
            title: "Situation 2",
            visual: "choice-cards",
            narration:
              "The cashier sighs and speaks very slowly. She is exhausted after a long day. Speak in a soft, warm, gentle tone. Which approach do you choose?",
            prompt: "Press Left Arrow for A. Press Right Arrow for B.",
            options: [
              {
                id: "impatient",
                key: "ArrowLeft",
                label: "A",
                correct: false,
                feedback: "Please do not rush me. Wait a minute."
              },
              {
                id: "gentle",
                key: "ArrowRight",
                label: "B",
                correct: true,
                feedback: "Oh, thank you for being so sweet. Here is your delicious bread."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "lesson-2-placeholder",
    number: 2,
    title: "Lesson 2",
    unitTitle: "Coming soon",
    summary: "A reserved topic slot for the next audio-guided English lesson.",
    vocabulary: [],
    stages: [
      {
        id: "soon",
        title: "Coming soon",
        description: "This lesson slot is ready for new content.",
        steps: [
          {
            id: "soon-step",
            kind: "intro",
            title: "Coming soon",
            narration: "Lesson 2 is coming soon. Return to Lesson 1 to practice the bakery.",
            prompt: "Press Backspace to return.",
            targetKey: "Backspace"
          }
        ]
      }
    ]
  }
];
