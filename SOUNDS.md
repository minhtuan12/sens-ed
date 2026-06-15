# SensED Sound Asset Placeholders

The attached bakery lesson specification requires layered ambient audio, directional cues, interaction sound effects, low-pass fade-outs, success/error feedback, and spatial cashier voice movement.

The current app uses browser SpeechSynthesis for narration. Sound files should be added under `public/sounds/` using the names below so the lesson player can be wired to stable paths without renaming assets later.

## Required Files

| File | Use | Pan |
| --- | --- | --- |
| `/sounds/bakery-ambient.mp3` | Bakery ambience during map/orientation screens | Center |
| `/sounds/door-open.mp3` | Door opening after Spacebar on bakery opening screen | Center |
| `/sounds/tray-station.mp3` | Tray placement/navigation cue | Left |
| `/sounds/tray-lift.mp3` | Tray lift interaction | Left |
| `/sounds/tong-click.mp3` | Tong clinking/navigation cue and clamp interaction | Right |
| `/sounds/breadbox-open.mp3` | Bread cabinet opening cue | Center |
| `/sounds/bread-crunch.mp3` | Bread cue inside breadbox | Center |
| `/sounds/bread-drop.mp3` | Bread landing on tray | Center |
| `/sounds/cash-register.mp3` | Cashier/register cue | Right |
| `/sounds/tray-counter.mp3` | Tray placed on counter | Right |
| `/sounds/ding.mp3` | Correct pronunciation/spelling/choice | Center |
| `/sounds/wrong.mp3` | Incorrect spelling/choice | Center |
| `/sounds/fanfare.mp3` | Completion sound | Center |
| `/sounds/cashier-close.mp3` | Cashier voice close/center spatial dialogue placeholder | Center |
| `/sounds/typing-fast.mp3` | Busy cashier dilemma ambience | Center |
| `/sounds/tired-sigh.mp3` | Tired cashier dilemma cue | Center |
| `/sounds/left-clap.mp3` | Sentence rhythm left-hand clap | Left |
| `/sounds/right-clap.mp3` | Sentence rhythm right-hand clap | Right |

## Audio Implementation Rules

- Directional sounds should use Web Audio API `StereoPannerNode` or `PannerNode`.
- Fade-outs should reduce gain to 10%, apply a `BiquadFilterNode` low-pass filter at 200 Hz, then fade to silence over about 1-2 seconds.
- Ambient sounds and interaction sounds must use separate gain nodes so they can overlap safely.
- Cashier approach dialogue should use a `PannerNode` distance model when recorded dialogue assets are available.
- Missing files should fail silently in development; do not block keyboard navigation if an asset is not available yet.
