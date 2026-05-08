import type { VnScene } from "../../../types";
import { characterNameRevealFlag } from "../../../nameReveal";

//TODO add a cat "Puck" to the scene! ppl will pet it, it'll jump around.
// BUT a much later reveal is that not only is the cat also a biomaton, but,
//  the cat can host consciousness, so
//  The Snatcher had been using it to swap consciousnesses in and out of the cat.
//  endgame challenge is to plot every swap that The Snatcher made.
//  maybe the cat was the original host of the Snatcher's consciousness (and therefore, his catastrophe, because it turns out all catastrophes are physical, requiring the body to be used, which is how The Snatcher used other ppl's catastrophes)
//TODO: add the cat profile & add to maintenance schedule?
//TODO: scene where Cal wonders what possible purpose a cat could serve,
// Titania says that relaxation is an essential for mental healthtoo!
// But, Cal thinks "No, mental health was not a priority for the ship, and I can prove it"
// ^ then the player chooses the proof: the barren room. if they cared about caressing the mental health of the biomata, they would've decorated.

//TODO: introduce "rampancy" like biomata going insane but in actuality it's The Snatcher swapping consciousness.

//TODO: add in suspicion of stephano (for knowing about biomata) & of titania?

//TODO: scene where Cal notices roundness of cookies?
// ^ like, he sees the baking sheet with holes in it & is like "There's no way..."

//TODO: miranda rampancy? maybe she puts a hole in stephano too?
//TODO: tense scene of gathering and using intel to defeat her catastrophe (Her ability).

//TODO last scene in chapter 1:
// With Miranda dealt with, only Titania and Cal are left (and the cat?).
// They have a heart-to-heart for the rest of the day?
// ^ maybe they come up with nicknames for each other & the others

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
      text: "Come to think of it, I left my door open too.",
    },
    {
      speakerId: "narrator",
      text: "It didn't close on its own, & it didn't lock.",
    },
    {
      speakerId: "narrator",
      text: "Stepping towards the doorway, I take a closer look.",
    },
    {
      speakerId: "narrator",
      text: "Let's recall what I know about my own door.",
    },
    {
      speakerId: "narrator",
      text: "When I left my room right before discovering the corpse, I didn't push or pull the door open.",
    },
    {
      speakerId: "narrator",
      text: "I just walked up to it.",
    },
    {
      speakerId: "narrator",
      text: "It slid into the frame with barely a sound when I did that.",
    },
    {
      speakerId: "narrator",
      text: "Nifty feature, but I'm not sure I like this new tech.",
    },
    {
      speakerId: "narrator",
      text: "I prefer old-fashioned physical locks, & this thing doesn't have one.",
    },
    {
      speakerId: "narrator",
      text: "It doesn't even have a door-handle.",
    },
    {
      speakerId: "narrator",
      text: "Right now it's just a smooth, seamless entryway to my room.",
    },
    {
      speakerId: "narrator",
      text: "And directly behind it, the same kind of entryway to the victim's room.",
    },
    {
      speakerId: "narrator",
      text: "Hmm...",
    },
    {
      speakerId: "narrator",
      text: "In locked-room mysteries, knowing how the lock works is key.",
    },
    {
      speakerId: "narrator",
      text: "This is more of an unlocked-room mystery though.",
    },
    {
      speakerId: "narrator",
      text: "Even so, I still think learning about the lock is important.",
    },
    {
      speakerId: "narrator",
      text: "I think I can assume that my door & the victim's door are the same design.",
    },
    {
      speakerId: "narrator",
      text: "So if I test my own door, maybe I can learn something.",
    },
    {
      speakerId: "narrator",
      text: "Standing in the hallway, I stare at the door to my room.",
    },
    {
      speakerId: "detective",
      text: "Close sesame.",
    },
    {
      speakerId: "detective",
      text: "...",
    },
    {
      speakerId: "narrator",
      text: "So, no voice commands, I guess.",
    },
    {
      speakerId: "narrator",
      text: "I try waving my hands in front of it.",
    },
    {
      speakerId: "narrator",
      text: "I feel so stupid right now.",
    },
    {
      speakerId: "narrator",
      text: "Traditional doors are way easier to use. I would just grab the handle & pull it closed.",
    },
    {
      speakerId: "narrator",
      text: "Standing in the hallway, I try to close the door with my mind, but it won't budge.",
    },
    {
      speakerId: "narrator",
      text: "Scrunching my face & focusing doesn't seem to help either.",
    },
    {
      speakerId: "narrator",
      text: "Stupid new tech...",
    },
    {
      speakerId: "narrator",
      text: "It must be something simpler.",
    },
    {
      speakerId: "narrator",
      text: "I walk inside my room.",
    },
    {
      speakerId: "narrator",
      text: "The door closes behind me, sliding into the frame.",
    },
    {
      speakerId: "detective",
      text: "The hell? I didn't tell you to do that, door!",
    },
    {
      speakerId: "narrator",
      text: "Maybe it sensed my presence?",
    },
    {
      speakerId: "narrator",
      text: "Walking towards the door from inside my room, it opens again, just like when I woke up.",
    },
    {
      speakerId: "narrator",
      text: "Must be some kind of sensor.",
    },
    {
      speakerId: "narrator",
      text: "Huh. When I went inside the victim's room, the door didn't close; it's just been open this whole time.",
    },
    {
      speakerId: "narrator",
      text: "The corpse is definitely not close enough to the door for the sensor to keep the door open for them, I had to get pretty close to my door for it to open.",
    },
    {
      speakerId: "narrator",
      text: "In other words, I don't think the victim's door is just being polite.",
    },
    {
      speakerId: "narrator",
      text: "Could it be that the victim's door is just not functioning?",
    },
    {
      speakerId: "narrator",
      text: "Plausible, but somehow I doubt the ship's systems would break so early in the mission.",
    },
    {
      speakerId: "narrator",
      text: "And if someone broke it intentionally, I definitely don't see any damage; the doors & hallway are pristine.",
    },
    {
      speakerId: "narrator",
      text: "There's one more possibility.",
    },
    {
      speakerId: "narrator",
      text: "I walk down the corridor, around a corner until I find another set of doors.",
    },
    {
      speakerId: "narrator",
      text: "One of them is closed. The other is open.",
    },
    {
      speakerId: "narrator",
      text: "And walking up to them doesn't seem to do anything; they don't open or close at my presence.",
    },
    {
      speakerId: "narrator",
      text: "So, only my door has responded to me walking up to it.",
    },
    {
      speakerId: "narrator",
      text: "Maybe they're bound to their own occupants.",
    },
    {
      speakerId: "narrator",
      text: "I like this theory, but that still doesn't explain why the victim's door is open.",
    },
    {
      speakerId: "narrator",
      text: "That door being open is what let me discover the body as soon as I walked out of my room.",
    },
    {
      speakerId: "narrator",
      text: "Surely the culprit would've wanted to cover their tracks.",
    },
    {
      speakerId: "narrator",
      text: "In a perfect murder scene, the corpse would be locked behind a door, undiscoverable.",
    },
    {
      speakerId: "narrator",
      text: "And yet, the door is open.",
    },
    {
      speakerId: "narrator",
      text: "Well, I would love to keep talking about doors more, but...",
    },
    {
      speakerId: "narrator",
      text: "...I hear something.",
    },
    //Doors: 
    // close when occupant enters, open when occupant leaves.
    //There is no life-monitoring.
    //TODO: So, we can make the reveal into a sort of red herring:
    // The room with the victim is actually Titania's room,
    // so, this puts suspicion on Titania.
    // But really she is more caring than she appears, & went to talk to Cressida after her argument with Miranda.
    // Miranda *thought* that Cressida would return to her own room, but she actually went to Titania's room.
    // Her 'remote detonation' would have killed Cressida while she was locked inside her own room.
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
      text: "We don't even need to do that much to keep the ship running. Would it kill you to just be nice?",
    },
    {
      speakerId: "stephano",
      text: "Consoling a girl was not in my job description.",
    },
    {
      speakerId: "miranda",
      text: "P-please don't fight… we're all on the same mission.",
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
      text: "Stephano. Systems: mostly diagnostics and rebuild telemetry.",
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
      text: "We're synthetic now. Skin and nerves behave like baseline humans, until they don't. When we lose one, the system queues a re-print.",
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
      text: "My mind flashes back to picture the purple blood pooling on metal decking.",
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
      text: "Then, when you wake up in your room, you'll be in a brand-spanking-new body.",
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
      text: "Cookies accounted for, at least her version of events. There's still the other angle.",
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
      text: "Because knocking would've meant admitting your fault to her face.",
    },
    {
      speakerId: "miranda",
      text: "Because I didn't want another scene!",
    },
    {
      speakerId: "narrator",
      text: "A cookie is an easy poison target. Is it possible that poison was the actual cause of death?",
      emotion: "detective-think",
    },
    {
      speakerId: "detective",
      text: "Anyone see her take the cookies?",
    },
    {
      speakerId: "stephano",
      text: "Not me. I avoid hallway theater.",
    },
    {
      speakerId: "titania",
      text: "She was holding them when I talked to her earlier.",
    },
    {
      speakerId: "detective",
      text: "When was that?",
    },
    {
      speakerId: "titania",
      text: "Uh, like 15 minutes ago?",
    },
    {
      speakerId: "narrator",
      text: "Wait, did she say...?",
    },
    {
      speakerId: "narrator",
      text: "...15 minutes ago?! Was Titania the last person to see Cressida alive?",
    },
    {
      speakerId: "titania",
      text: "Why are you so interested in the cookies anyway, Cal?",
    },
    {
      speakerId: "narrator",
      text: "Shit. I need to tread carefully.",
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
      text: "Dodged that bullet, I think.",
    },
    {
      speakerId: "narrator",
      text: "I just hope Titania isn't as suspicious of me as I am of her.",
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
    //TODO Stephano actually bails Miranda out, saying
    // "I showed her"
    // Detective: "Okay, well how did you know, Stephano?"
    // "It's a funny story, actually."
    // "Yesterday morning, Cressida & I opened our doors at the same time."
    // "So the first thing we saw was each other's faces!"
    // "So you see, Cressida's room is directly across from mine."
    {
      speakerId: "narrator",
      text: "what.",
    },
    {
      speakerId: "narrator",
      text: "WHAT?!?",
    },
    {
      speakerId: "narrator",
      text: "Stephano's statement doesn't line up with what I know.",
    },
    {
      speakerId: "narrator",
      text: "Stephano's room can't be directly across from Cressida's",
    },
    {
      speakerId: "narrator",
      text: "Because MY room is directly across from Cressida's!",
    },
    {
      speakerId: "narrator",
      text: "It's impossible for both of those to be true!",
    },
    //TODO: player question: 
    // "I'm sure Stephano is lying."
    // "I can't be sure that Stephano is lying."

    //-
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
    //TODO: Titania expands on her story about talking to Cressida, 
    // ^ and taking Cressida to Titania's room!
    // ^ then Titania left & went back to the meeting room.
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
