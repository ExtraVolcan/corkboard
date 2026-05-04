import type { VnScene } from "../../../types";
import { characterNameRevealFlag } from "../../../nameReveal";

/** Picks up immediately after scene1’s closing beat; branches resolve via path flags (see hub scenes). */
export const shipDay2Room: VnScene = {
  id: "ship-day2-room",
  title: "Across the Hall",
  background: "bg:ship-cabin",
  lines: [
    {
      speakerId: "narrator",
      text: "I force myself to catalogue the room like evidence—because it is.",
    },
    {
      speakerId: "narrator",
      text: "One door. It opens onto a corridor—the only way in or out from here.",
    },
    {
      speakerId: "narrator",
      text: "My berth is straight across the hall. First thing I saw when I woke and stepped out was… her.",
    },
    {
      speakerId: "narrator",
      text: "Not exactly the morning greeting you dream about.",
    },
    {
      speakerId: "narrator",
      text: "She's splayed on the floor like someone dropped a mannequin mid-pose—arms wrong, head rolled aside.",
    },
    {
      speakerId: "narrator",
      text: "There's a bed pushed against the bulkhead. Crumpled bedding. A torn snack pouch.",
    },
    {
      speakerId: "narrator",
      text: "More wrappers than actual food—like whoever stayed here grazed and never cleaned up.",
    },
    {
      speakerId: "narrator",
      text: "Poison flashes through my head uninvited. Some toxins love looking innocent.",
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "I swallow the thought and step into the hall.",
      background: "bg:ship-meeting",
    },
    {
      speakerId: "narrator",
      text: "No little plaques. No etched names by the frames. The doors could belong to anyone.",
      unlocks: [
        { type: "revealProfile", profileId: "ship-corridor" },
        {
          type: "revealEntry",
          profileId: "ship-corridor",
          entryId: "noDoorLabels",
        },
      ],
    },
    {
      speakerId: "narrator",
      text: "Down the corridor—voices. Low laughter threaded with tension. Not close enough to make out words.",
    },
    {
      speakerId: "narrator",
      text: "If I've learned anything from bad mornings, it's that gossip travels faster than truth.",
    },
    {
      speakerId: "narrator",
      text: "I follow the sound toward what feels like the belly of the ship.",
      choices: [
        {
          id: "toward-crew",
          label: "Find whoever's talking",
          nextSceneId: "ship-day2-crew",
        },
      ],
    },
  ],
};

export const shipDay2Crew: VnScene = {
  id: "ship-day2-crew",
  title: "The Mission",
  background: "bg:ship-meeting",
  lines: [
    {
      speakerId: "narrator",
      text: "The corridor spills into a communal wedge—console benches, a scratched table, dim overhead strips pretending to be daylight.",
    },
    {
      speakerId: "narrator",
      text: "Three people cluster like they've rehearsed this triangle before.",
    },
    {
      speakerId: "titania",
      text: "If thrust slips we're compost—not spreadsheets. Tell me alignment holds.",
      setFlags: [characterNameRevealFlag("titania")],
    },
    {
      speakerId: "stephano",
      text: "Telemetry says stable—for now. I'm allowed paranoia.",
      setFlags: [characterNameRevealFlag("stephano")],
    },
    {
      speakerId: "miranda",
      text: "P-please don't fight… we're supposed to be focused on the mission.",
      setFlags: [characterNameRevealFlag("miranda")],
    },
    {
      speakerId: "detective",
      text: "Morning.",
    },
    {
      speakerId: "titania",
      text: "New face. You lost?",
    },
    {
      speakerId: "detective",
      text: "Caliban. Assigned wherever they wedge me. You're?",
    },
    {
      speakerId: "stephano",
      text: "Stephano. Systems biomata—mostly diagnostics and rebuild telemetry.",
      setFlags: [characterNameRevealFlag("stephano")],
    },
    {
      speakerId: "titania",
      text: "Titania. Engine deck when I'm allowed to be honest about it.",
    },
    {
      speakerId: "miranda",
      text: "Miranda. I—I handle nutrient schedules and food prep rotations.",
    },
    {
      speakerId: "narrator",
      text: "Three names. Three familiar postures, like... ",
    },
    {
      speakerId: "narrator",
      text: "...like they're already sick of each other.",
    },
    {
      speakerId: "detective",
      text: "Sounds like you're all tight on procedure.",
    },
    {
      speakerId: "titania",
      text: "We have to be. Out here the mission isn't a slogan—it's the reason any of us wake up at all.",
    },
    {
      speakerId: "stephano",
      text: "We carry bodies because bodies carry memory. That's the bargain.",
    },
    {
      speakerId: "miranda",
      text: "These vessels—they're… they're more human than people admit. Hunger. Fatigue. Fear.",
    },
    {
      speakerId: "detective",
      text: "Bodies that die?",
    },
    {
      speakerId: "stephano",
      text: "Die messy, yes. Permanently? Not on this ship—not if maintenance holds.",
    },
    {
      speakerId: "stephano",
      text: "We're biomata. Skin and nerves behave like baseline humans—until they don't. When we lose one, the system queues a re-print.",
    },
    {
      speakerId: "stephano",
      text: "Upload snapshots capture everything recoverable up to the moment of death.",
    },
    {
      speakerId: "stephano",
      text: "Say you lose the gap between last backup and death: Whatever didn't sync is gone forever. The rest comes home.",
    },
    {
      speakerId: "stephano",
      text: "Luckily the backups are pretty frequent; it's designed that way so we don't worry over it.",
    },
    {
      speakerId: "detective",
      text: "How frequent?",
    },
    {
      speakerId: "stephano",
      text: "The standard is every minute.",
    },
    {
      speakerId: "stephano",
      text: "It doesn't take too much bandwidth if that's what you're asking.",
    },
    {
      speakerId: "narrator",
      text: "That's another wrinkle in this case. With backups that frequent, it's likely that the victim will remember the circumstances leading to their death.",
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "My mind flashes back to picture the blue blood pooling on metal decking.",
    },
    {
      speakerId: "narrator",
      text: "Well, they'll remember just as soon as they're resurrected.",
      emotion: "detective-think",
    },
    {
      speakerId: "stephano",
      text: "Maintenance rotation keeps everything honest: No matter how much wear your body takes, you'll go offline during your assigned maintenance window."
    },
    {
      speakerId: "stephano",
      text: "Then, when you wake up, you'll be in a brand-spanking-new body.",
    },
    {
      speakerId: "stephano",
      text: "Take a look at the maintenance schedule: you'll live in this sheet anyway.",
      unlocks: [
        { type: "revealProfile", profileId: "maintenance-schedule" },
        { type: "revealImage", profileId: "maintenance-schedule" },
        {
          type: "revealEntry",
          profileId: "maintenance-schedule",
          entryId: "rotation-columns",
        },
      ],
    },
    {
      speakerId: "narrator",
      text: "He pulls up a grid: each column represents a ship-day. Names are highlighted where someone's marked active, so anyone not highlighted is offline for that day.",
    },
    {
      speakerId: "detective",
      text: "Give me a second. Let me actually read it.",
    },
    {
      speakerId: "narrator",
      text: "First, let's get our bearings. I have enough info to make a deduction.",
      interaction: {
        kind: "mcq",
        prompt: "Which column is today?",
        redoable: true,
        options: [
          { id: "col-1", label: "First column (Day 1)" },
          {
            id: "col-2",
            label: "Second column (Day 2)",
            correct: true,
          },
          { id: "col-3", label: "Third column (Day 3)" },
          { id: "col-4", label: "Fourth column (Day 4)" },
        ],
      },
    },
    {
      speakerId: "narrator",
      text: "Second column. We're on day two.",
    },
    {
      speakerId: "narrator",
      text: "Wish I'd been awake for day one; whatever happened yesterday, I slept through the prologue.",
    },
    {
      speakerId: "narrator",
      text: "Or is it more accurate to say I was dead?",
    },
    {
      speakerId: "narrator",
      text: "I stare at the maintenance schedule for a little while longer.",
    },
    {
      speakerId: "narrator",
      text: "This is good intel.",
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "In fact, I know the victim's name now.",
      interaction: {
        kind: "mcq",
        prompt: "What is the victim's name?",
        redoable: true,
        //TODO: include other characters as guesses,
        // OR, change to a text input field
        options: [
          { id: "guess-miranda", label: "Miranda" },
          { id: "guess-titania", label: "Titania" },
          { id: "guess-stephano", label: "Stephano" },
          {
            id: "guess-cressida",
            label: "Cressida",
            correct: true,
          },
          { id: "guess-detective", label: "Caliban" },
        ],
      },
    },
    {
      speakerId: "narrator",
      text: "So your name's Cressida.",
      unlocks: [{ type: "revealName", profileId: "cressida" }],
    },
    {
      speakerId: "narrator",
      text: "By this schedule, Cressida was awake yesterday.",
    },
    {
      speakerId: "narrator",
      text: "Maintenance slots her rebuild two days out.",
    },
    {
      speakerId: "narrator",
      text: "Wait.",
      emotion: "think",
    },
    {
      speakerId: "narrator",
      text: "I can't believe I didn't think of this earlier...",
    },
    {
      speakerId: "narrator",
      text: "...what's the point of killing someone who's just going to come back?",
    },
    {
      speakerId: "narrator",
      text: "What's the motive?",
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "Hmm... we've learned a lot, but it's still too risky to mention what I saw.",
    },
    {
      speakerId: "detective",
      text: "So… what abilities does everyone have?",
    },
    {
      speakerId: "titania",
      text: "Why? So you can get to know our weaknesses better?",
    },
    {
      speakerId: "narrator",
      text: "Welp, it was worth a shot.",
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "And now she's eyeing me suspiciously with furrowed brows.",
    },
    {
      speakerId: "detective",
      text: "Guess this crew isn't as cozy as I hoped.",
    },
    {
      speakerId: "detective",
      text: "Why's everyone so on edge anyway?",
    },
    {
      speakerId: "detective",
      text: "Did something happen?",
    },
    {
      speakerId: "narrator",
      text: "I try my hardest not to sound smug as I say it, because I KNOW something's up.",
    },
    {
      speakerId: "stephano",
      text: "Well, it was our first day yesterday, so, y'know...",
    },
    {
      speakerId: "miranda",
      text: "W-well… there was a bit of arguing.",
    },
    {
      speakerId: "titania",
      text: "That's diplomat speak. It was a damn knife fight with words.",
    },
    {
      speakerId: "titania",
      text: "Cressida carved Miranda up!",
    },
    {
      speakerId: "titania",
      text: "Not literally.",
    },
    {
      speakerId: "titania",
      text: "Figuratively.",
    },
    {
      speakerId: "narrator",
      text: "...",
    },
    {
      speakerId: "titania",
      text: "Ugh, come on, if they actually drew blood there's no way I'd keep that gossip to myself.",
    },
    {
      speakerId: "titania",
      text: "But like, Cressida really laid into Miranda, she had some... choice words.",
    },
    {
      speakerId: "miranda",
      text: "Y-yes, and I didn't want us to fight, so...",
    },
    {
      speakerId: "miranda",
      text: "...so I made her chocolates.",
    },
    {
      speakerId: "detective",
      text: "You made chocolates for Cressida after she tore into you?",
    },
    {
      speakerId: "titania",
      text: "Figuratively.",
    },
    {
      speakerId: "detective",
      text: "Yeah, figuratively.",
    },
    {
      speakerId: "miranda",
      text: "Th-that's right. It was a peace offering.",
    },
    {
      speakerId: "miranda",
      text: "I was the one who made the mistake anyway, so...",
    },
    {
      speakerId: "narrator",
      text: "'The mistake'?",
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "Also, did she ever actually deliver the chocolates?",
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "Two obvious seams to pull.",
      choices: [
        {
          id: "into-miranda-hub",
          label: "What should I ask first?",
          nextSceneId: "ship-miranda-hub-a",
        },
      ],
    },
  ],
};

export const shipMirandaHubA: VnScene = {
  id: "ship-miranda-hub-a",
  title: "Miranda — follow-up",
  background: "bg:ship-meeting",
  lines: [
    {
      speakerId: "narrator",
      text: "What should I ask first?",
      choices: [
        {
          id: "hub-a-choc",
          label: "Did you give her the chocolates?",
          nextSceneId: "ship-branch-chocolates",
          setFlags: ["path-from-a-choc"],
        },
        {
          id: "hub-a-mist",
          label: "What mistake?",
          nextSceneId: "ship-branch-mistake",
          setFlags: ["path-from-a-mist"],
        },
      ],
    },
  ],
};

export const shipMirandaHubB: VnScene = {
  id: "ship-miranda-hub-b",
  title: "Miranda — one thread left",
  background: "bg:ship-meeting",
  lines: [
    {
      speakerId: "narrator",
      text: "Chocolates accounted for—at least her version. There's still the other angle.",
    },
    {
      speakerId: "narrator",
      text: "What should I ask?",
      choices: [
        {
          id: "hub-b-mist",
          label: "What mistake?",
          nextSceneId: "ship-branch-mistake",
          setFlags: ["path-from-b-mist"],
        },
      ],
    },
  ],
};

export const shipMirandaHubC: VnScene = {
  id: "ship-miranda-hub-c",
  title: "Miranda — second angle",
  background: "bg:ship-meeting",
  lines: [
    {
      speakerId: "narrator",
      text: "Her mistake story might explain why she swallowed Cressida's temper.",
    },
    {
      speakerId: "narrator",
      text: "What should I ask?",
      choices: [
        {
          id: "hub-c-choc",
          label: "Did you give her the chocolates?",
          nextSceneId: "ship-branch-chocolates",
          setFlags: ["path-from-c-choc"],
        },
      ],
    },
  ],
};

export const shipBranchChocolates: VnScene = {
  id: "ship-branch-chocolates",
  title: "The chocolates",
  background: "bg:ship-meeting",
  lines: [
    {
      speakerId: "detective",
      text: "Straight question—did you actually hand Cressida those chocolates?",
    },
    {
      speakerId: "miranda",
      text: "I… I left them outside her door in a tin. She didn't answer—I wasn't brave enough to knock twice.",
    },
    {
      speakerId: "titania",
      text: "Because knocking would've meant admitting you were crawling back.",
    },
    {
      speakerId: "miranda",
      text: "Because I didn't want another scene!",
    },
    {
      speakerId: "detective",
      text: "Anyone see her take them?",
    },
    {
      speakerId: "stephano",
      text: "Not me. I avoid hallway theater.",
    },
    {
      speakerId: "titania",
      text: "If she ate them, she didn't brag about it.",
    },
    {
      speakerId: "narrator",
      text: "Plenty of poison loves chocolate—too obvious to ignore later.",
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "For now I tuck the detail away—no sense flashing suspicion.",
      choices: [
        {
          id: "leave-choc-hub-b",
          label: "Step back",
          nextSceneId: "ship-miranda-hub-b",
          requireFlags: ["path-from-a-choc"],
        },
        {
          id: "leave-choc-hub-done",
          label: "Step back",
          nextSceneId: "ship-miranda-hub-done",
          requireFlags: ["path-from-c-choc"],
        },
      ],
    },
  ],
};

export const shipBranchMistake: VnScene = {
  id: "ship-branch-mistake",
  title: "The mistake",
  background: "bg:ship-meeting",
  lines: [
    {
      speakerId: "detective",
      text: "Back up—what mistake did you think you made?",
    },
    {
      speakerId: "miranda",
      text: "My wording on the galley roster. It looked like I shortened her sleep window on purpose.",
    },
    {
      speakerId: "miranda",
      text: "I wasn't—I swear—I fat-fingered the template and caught it late.",
    },
    {
      speakerId: "titania",
      text: "Cressida didn't care about intent. She cared about face.",
    },
    {
      speakerId: "detective",
      text: "So you apologized with dessert.",
    },
    {
      speakerId: "miranda",
      text: "It's… it's how my family always cooled fights. Sweet first, talk second.",
    },
    {
      speakerId: "stephano",
      text: "Biochemically sentimental. Interesting.",
    },
    {
      speakerId: "narrator",
      text: "Miranda shrinks under his tone anyway.",
      choices: [
        {
          id: "leave-mist-hub-c",
          label: "Step back",
          nextSceneId: "ship-miranda-hub-c",
          requireFlags: ["path-from-a-mist"],
        },
        {
          id: "leave-mist-hub-done",
          label: "Step back",
          nextSceneId: "ship-miranda-hub-done",
          requireFlags: ["path-from-b-mist"],
        },
      ],
    },
  ],
};

export const shipMirandaHubDone: VnScene = {
  id: "ship-miranda-hub-done",
  title: "Moving on",
  background: "bg:ship-meeting",
  lines: [
    {
      speakerId: "narrator",
      text: "Both threads chased—chocolates and shame—without saying what I really saw across the hall.",
    },
    {
      speakerId: "detective",
      text: "Thanks for the patience. I'll stay out of engine gossip.",
    },
    {
      speakerId: "titania",
      text: "See that you do.",
    },
    {
      speakerId: "narrator",
      text: "Whatever yesterday was, it's written on them tighter than the maintenance grid.",
      choices: [
        {
          id: "ship-to-briefing",
          label: "Continue",
          nextSceneId: "briefing",
        },
      ],
    },
  ],
};

export const shipDay2Scenes: VnScene[] = [
  shipDay2Room,
  shipDay2Crew,
  shipMirandaHubA,
  shipBranchChocolates,
  shipBranchMistake,
  shipMirandaHubB,
  shipMirandaHubC,
  shipMirandaHubDone,
];
