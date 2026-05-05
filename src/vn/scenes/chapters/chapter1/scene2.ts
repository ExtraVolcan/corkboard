import type { VnScene } from "../../../types";
import { characterNameRevealFlag } from "../../../nameReveal";

//TODO add a cat to the scene! ppl will pet it, it'll jump around and meow.
// BUT a much later reveal is that not only is the cat also a biomaton, but,
//  the cat can host consciousness, so
//  The Snatcher had been using it to swap consciousnesses in and out of the cat.
//  endgame challenge is to plot every swap that The Snatcher made.
//TODO: scene where Cal wonders what possible purpose a cat could serve,
// Titania says that relaxation is an essential for mental healthtoo!
// But, Cal thinks "No, mental health was not a priority for the ship, and I can prove it"
// ^ then the player chooses the proof: the barren room. if they cared about caressing the mental health of the biomata, they would've decorated.

//TODO: introduce "rampancy" like biomata going insane but in actuality it's The Snatcher swapping consciousness.

//TODO: add in suspicion of stephano (for knowing about biomata) & of titania?

//TODO: scene where Cal notices roundness of cookies?
// ^ like, he sees the baking sheet with holes in it & is like "There's no way..."



/** Picks up immediately after scene1’s closing beat; branches resolve via path flags (see hub scenes). */
export const shipDay2Room: VnScene = {
  id: "ship-day2-room",
  title: "Across the Hall",
  background: "bg:ship-cabin",
  lines: [
    {
      speakerId: "narrator",
      text: "I force myself to catalogue the room like evidence, because it is.",
    },
    {
      speakerId: "narrator",
      text: "One door. It opens onto a corridor: the only way in or out from here.",
    },
    {
      speakerId: "narrator",
      text: "My room is straight across the hall. First thing I saw when I woke and stepped out was… her.",
    },
    {
      speakerId: "narrator",
      text: "Not exactly the morning greeting you dream about.",
    },
    {
      speakerId: "narrator",
      text: "The door was ajar, so I saw her splayed on the floor like someone dropped a mannequin mid-pose.",
    },
    {
      speakerId: "narrator",
      text: "But I've already examined her, so focusing on her anymore is just a distraction.",
    },
    {
      speakerId: "narrator",
      text: "There's a bed pushed against the bulkhead.",
    },
    {
      speakerId: "narrator",
      text: "On top of the bed there's crumpled bedding, and a torn snack pouch: I can tell by the decorative foil & stains on the wrapper.",
    },
    {
      speakerId: "narrator",
      text: "Actually, there's more of those wrappers scattered around the floor too.",
    },
    {
      speakerId: "narrator",
      text: "Aside from that, not much. My room was pretty barren too.",
    },
    {
      speakerId: "narrator",
      text: "I step out the door and into the hall.",
      background: "bg:ship-hall",
    },
    {
      speakerId: "narrator",
      text: "No little plaques. No etched names by the frames. There's seriously no way to tell whose room this is?",
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
      text: "It's the same for my room. No labels. I guess I just have to remember that this one's mine.",
    },
    //TODO talk about how the locks on the doors work; have Cal test his own door.
    // ^ door can only lock or unlock by fingerscan of the room's inhabitant?
    {
      speakerId: "narrator",
      text: "Down the corridor: voices. Low chatter threaded with tension. Not close enough to make out words.",
    },
    {
      speakerId: "narrator",
      text: "Do they know about this yet?",
    },
    {
      speakerId: "narrator",
      text: "I follow the sound toward what feels like the belly of the ship: a big meeting area.",
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
      text: "The corridor spills into a communal wedge: console benches, a scratched table, dim overhead strips pretending to be daylight.",
    },
    {
      speakerId: "narrator",
      text: "Three people cluster like they've rehearsed this triangle before.",
    },
    {
      speakerId: "titania",
      text: "We need results, not spreadsheets. Tell me you did your job.",
      setFlags: [characterNameRevealFlag("titania")],
    },
    {
      speakerId: "stephano",
      text: "Telemetry says stable, for now. I'm allowed paranoia.",
      setFlags: [characterNameRevealFlag("stephano")],
    },
    {
      speakerId: "miranda",
      text: "P-please don't fight… we're all on the same mission.",
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
      text: "Caliban. Pretty much just woke up. I hope my hair looks okay. You are?",
    },
    {
      speakerId: "stephano",
      text: "Stephano. Systems biomata: mostly diagnostics and rebuild telemetry.",
      setFlags: [characterNameRevealFlag("stephano")],
    },
    {
      speakerId: "stephano",
      text: "And your hair will be just fine. It's designed that way.",
    },
    {
      speakerId: "titania",
      text: "Titania. I work the engine deck, when I'm allowed to be honest about it.",
      setFlags: [characterNameRevealFlag("titania")]
    },
    {
      speakerId: "miranda",
      text: "Miranda. I-I handle nutrient schedules and food prep.",
      setFlags: [characterNameRevealFlag("miranda")]
    },
    {
      speakerId: "titania",
      text: "She cooks lunch. It's pretty good!",
    },
    {
      speakerId: "titania",
      text: "Dinner, ehhhh, not so much.",
    },
    {
      speakerId: "narrator",
      text: "Three names. Three suspects.",
    },
    {
      speakerId: "narrator",
      text: "Ugh, I hate thinking like that.",
    },
    {
      speakerId: "narrator",
      text: "It'd be nice if we all got along, but...",
    },
    {
      speakerId: "narrator",
      text: "It's too likely that one of these people put that hole in the victim.",
    },
    {
      speakerId: "narrator",
      text: "Someone here is the culprit.",
    },
    {
      speakerId: "detective",
      text: "Sounds like you're all tight on procedure.",
    },
    {
      speakerId: "titania",
      text: "We have to be. Out here the mission isn't a slogan, it's the reason any of us wake up at all.",
    },
    {
      speakerId: "stephano",
      text: "Hard to forget when we look like this.",
    },
    {
      speakerId: "detective",
      text: "You mean our bodies?",
    },
    {
      speakerId: "stephano",
      text: "We're biomata. Skin and nerves behave like baseline humans, until they don't. When we lose one, the system queues a re-print.",
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
      text: "According to this schedule, Cressida was awake yesterday.",
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
      speakerId: "detective",
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
      text: "...so I made her cookies.",
    },
    {
      speakerId: "detective",
      text: "You made cookies for Cressida after she tore into you?",
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
      text: "Also, did she ever actually deliver the cookies?",
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
          label: "Did you give her the cookies?",
          nextSceneId: "ship-branch-cookies",
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
      text: "cookies accounted for, at least her version of events. There's still the other angle.",
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
      text: "Her mistake story at least explains why she swallowed Cressida's temper.",
    },
    {
      speakerId: "narrator",
      text: "What should I ask?",
      choices: [
        {
          id: "hub-c-choc",
          label: "Did you give her the cookies?",
          nextSceneId: "ship-branch-cookies",
          setFlags: ["path-from-c-choc"],
        },
      ],
    },
  ],
};

export const shipBranchcookies: VnScene = {
  id: "ship-branch-cookies",
  title: "The cookies",
  background: "bg:ship-meeting",
  lines: [
    {
      speakerId: "detective",
      text: "Miranda, did you actually hand Cressida those cookies?",
    },
    {
      speakerId: "miranda",
      text: "I… I left them outside her door. She didn't answer and I wasn't brave enough to knock twice.",
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
      text: "Plenty of poison loves cookie. Is it possible that poison was the actual cause of death?",
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "For now I tuck the detail away. No sense flashing suspicion.",
    },
    {
      speakerId: "titania",
      text: "Why are you so interested in the cookies anyway, Cal?",
    },
    {
      speakerId: "narrator",
      text: "Shit. Tread carefully.",
    },
    {
      speakerId: "detective",
      text: "I...",
    },
    {
      speakerId: "titania",
      text: "Did you want some?",
    },
    {
      speakerId: "narrator",
      text: "Titania pulls out some cookies, neatly wrapped.",
    },
    {
      speakerId: "detective",
      text: "I... would love some.",
    },
    {
      speakerId: "narrator",
      text: "Titania hands me the cookies.",
      //TODO create profile + entry for cookies: These are Miranda's cookies, wrapped & sealed in decorative foil.
      unlocks: [
        { type: "revealProfile", profileId: "cookies" },
        { type: "revealEntry", profileId: "cookies", entryId: "cookies" },
      ],
    },
    {
      speakerId: "narrator",
      text: "Dodged that bullet, I hope.",
    },
    {
      speakerId: "miranda",
      text: "I h-hope you like them. They're the same batch I left outside Cressida's door.",
    },
    {
      speakerId: "detective",
      text: "Thank you, Miranda, I'll be sure to try them late-",
    },
    {
      speakerId: "narrator",
      text: "My thoughts interrupt my own sentence.",
    },
    {
      speakerId: "narrator",
      text: "I didn't clock it earlier, but...",
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "Miranda left the cookies outside Cressida's door, huh?",
    },
    //TODO here put player choice of having to select the profile & entry that shows why this is suspicious.
    // ^ the correct entry is the one that says there are no labels on the doors
    {
      speakerId: "narrator",
      text: "How did she know where Cressida's room was?",
    },
    //TODO questioning after realizing that Miranda knew where Cressida's room was

    {
      speakerId: "narrator",
      text: "Okay, I think I've pulled on that thread enough.",
      choices: [
        {
          id: "leave-choc-hub-b",
          label: "Next question",
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
      text: "Miranda, what mistake did you think you made?",
    },
    //TODO change the mistake
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
    //TODO continue writing this scene. 
    {
      speakerId: "narrator",
      text: "Okay, now we're getting somewhere. Is it time to tell them about Cressida's death?",
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
  shipBranchcookies,
  shipBranchMistake,
  shipMirandaHubB,
  shipMirandaHubC,
  shipMirandaHubDone,
];
