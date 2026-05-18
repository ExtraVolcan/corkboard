import type { VnScene } from "../../../types";
import { characterNameRevealFlag } from "../../../nameReveal";

//synopsis:
// introduce the protagonist, and a 'dead' body, (pixel-censored by heavily downscaling image)
// the murder is recent, and the perpetrator ends up being relatively obvious.
// introduction to the basic game systems like questions & corkboard.
// the protagonist detective likes old-school detective stuff like corkboards and polaroids. maybe he carries a camera?

//Why did we start from here?
// Because, the protagonist was 'asleep' during the first day!
// ^ in the 'maintenance schedule'

//TODO assign an image to each of these lines. Some can have none, like narration? 
// But we want to show the protag character making faces

    //TODO come up with ability for the other ppl

export const scene1: VnScene = {
  id: "opening",
  title: "An Unfinished Board",
  background: "bg:office-night",
  lines: [
    /*{
      speakerId: "detective",
      text: "\"A Mission to Defy Death\"",
    },
    {
      speakerId: "detective",
      text: "That's how it was marketed.",
    },
    {
      speakerId: "detective",
      text: "I should've known better than to believe it.",
    },
    {
      speakerId: "detective",
      text: "...",
    },*/
    {
      speakerId: "narrator",
      text: "The first thing I remember is the smell.",
    },
    {
      speakerId: "narrator",
      text: "It's that brand new car smell like fresh leather, fat tires, and stale air.",
    },
    {
      speakerId: "narrator",
      text: "It's unfamiliar, yet comforting.",
    },
    {
      speakerId: "narrator",
      text: "I haven't quite gotten used to it yet...",
    },
    {
      speakerId: "narrator",
      text: "...the smell of my own body.",
    },
    {
      speakerId: "narrator",
      text: "It must have looked a little funny to see me sniffing my own armpits.",
    },
    {
      speakerId: "narrator",
      text: "But I needed to reset my senses,",
    },
    {
      speakerId: "narrator",
      text: "Because even my armpits smell nicer than the corpse I'm staring at.",
      textEffect: "jitter",
      screenEffect: "catastrophe-vignette",
      screenEffectIntensity: 0.92,
      //TODO: change background to show pixelated body?
      //TODO: or, have Caliban do a quick sketch with X eyes and tongue out (funny)
    },
    {
      speakerId: "narrator",
      text: "Hell of a thing to wake up to, even for me.",
      screenEffect: null,
    },
    {
      speakerId: "narrator",
      text: "This reeks of foul play, and I won't let anyone compromise the success of the mission.",
    },//TODO describe the rooms here so the reader isn't lost?
    {
      speakerId: "narrator",
      text: "There's a small puddle of purple liquid surrounding the body.",
    },
    {
      speakerId: "narrator",
      text: "It's recent, because the purple liquid is still flowing.",
    },
    {
      speakerId: "detective",
      text: "...",
      emotion: "think"
    },
    {
      speakerId: "narrator",
      text: "This must be what's inside us.",
    },
    {
      speakerId: "narrator",
      text: "Blood.",
    },
    {
      speakerId: "narrator",
      text: "...",
    },
    {
      speakerId: "detective",
      text: "Yeah, obviously, moron."
    },
    {
      speakerId: "detective",
      text: "Of course there's blood inside the body."
    },
    {
      speakerId: "detective",
      text: "I really need to focus."
    },
    {
      speakerId: "detective",
      text: "To be fair, I did JUST wake up."
    },
    {
      speakerId: "detective",
      text: "Investigating a murder scene is basically a morning routine for me anyway, so let's get warmed up."
    },
    {
      speakerId: "narrator",
      text: "I slap myself lightly on both cheeks."
    },
    {
      speakerId: "narrator",
      text: "...or, I tried to, but my hand hit something hard instead."
    },
    {
      speakerId: "detective",
      text: "Ow."
    },
    {
      speakerId: "narrator",
      text: "Ah, is this, a helmet on my head?"
    },
    {
      speakerId: "narrator",
      text: "Not my usual fashion, and not something you typically wake up with. Must be part of the mission."
    },
    {
      speakerId: "narrator",
      text: "My eyes focus, but my head still hurts. I'm groggy & disoriented & my nose looks weird & maybe I have a fever?"
    },
    {
      speakerId: "narrator",
      text: "Can we even get fevers?"
    },
    {
      speakerId: "narrator",
      text: "I shake my head to try and clear the fog from my mind."
    },
    {
      speakerId: "narrator",
      text: "It doesn't help much, but I get back on task anyway."
    },
    {
      speakerId: "narrator",
      text: "I need to. I cannot allow this mission to be sabotaged."
    },
    {
      speakerId: "narrator",
      text: "I feel anything but normal, so maybe the most normal thing I can do is investigate a murder scene."
    },
    {
      speakerId: "narrator",
      text: "The body lays quietly on the floor in front of me."
    },
    {
      speakerId: "narrator",
      text: "If the wound is still fresh, the culprit can't be far."
    },
    {
      speakerId: "narrator",
      text: "But first, I need to learn a few things from you."
    },
    {
      speakerId: "narrator",
      text: "I turn to look at the body."
    },
    {
      speakerId: "detective",
      text: "Can I get your number?",
      emotion: "fingerbang"
    },
    {
      speakerId: "detective",
      text: "..."
    },
    {
      speakerId: "detective",
      text: "Your ID number, that is.",
      emotion: "think"
    },
    {
      speakerId: "narrator",
      text: "You see, that's my first question: "
    },
    {
      speakerId: "detective",
      text: "Who are you?",
      emotion: "point"
    },
    {
      speakerId: "narrator",
      text: "It's easy enough to answer that one.",
      emotion: "detective-think"
    },
    {
      speakerId: "narrator",
      text: "Luckily the face-down corpse hasn't been drowned in its own blood yet.",
    },
    {
      speakerId: "narrator",
      text: "The purple puddle hasn't reached its neck.",
    },
    {
      speakerId: "narrator",
      text: "Turning over the body, I get a good look at the face.",
      unlocks: [
        { type: "revealProfile", profileId: "cressida" },
        { type: "revealImage", profileId: "cressida" },
        {
          type: "setProfileDisplayName",
          profileId: "cressida",
          displayName: "Victim",
        },
        {
          type: "revealEntry",
          profileId: "cressida",
          entryId: "body-scene-initial",
        },
      ],
    },
    {
      speakerId: "tutorial",
      text: "That face and a new note just landed on the corkboard: a collection of evidence you can consult at any time.",
      corkboardTutorial: true,
    },
    {
      speakerId: "narrator",
      text: "...I don't know who this is.",
    },
    {
      speakerId: "narrator",
      text: "Makes sense; I don't think I've met any of the crew yet.",
    },
    {
      speakerId: "narrator",
      text: "At least I got a face for future reference!",
    },
    {
      speakerId: "narrator",
      text: "Next I look towards the body's right hand.",
    },
    {
      speakerId: "narrator",
      text: "The hand is relaxed, with an open palm.",
    },
    {
      speakerId: "narrator",
      text: "Not too much staining there.",
    },
    {
      speakerId: "narrator",
      text: "I gently hold the hand, lifting it up a bit with my own right hand.",
    },
    {
      speakerId: "narrator",
      text: "I change my grip to firmly grasp the hand.",
    },
    {
      speakerId: "detective",
      text: "I don't know your name, but...",
    },
    {
      speakerId: "detective",
      text: "My name is Caliban. It's nice to meet you!",
      emotion: "fingerbang",
      setFlags: [characterNameRevealFlag("detective")],
      unlocks: [
        { type: "revealProfile", profileId: "detective" },
        { type: "revealImage", profileId: "detective" },
        { type: "revealName", profileId: "detective" },
        {
          type: "revealEntry",
          profileId: "detective",
          entryId: "caliban-self-intro",
        },
      ],
    },
    {
      speakerId: "narrator",
      text: "Giving the limp hand a little shake, I let it drop back down to the floor.",
      emotion: "think"
    },
    {
      speakerId: "detective",
      text: "Maybe we can introduce ourselves properly sometime soon.",
    },
    {
      speakerId: "detective",
      text: "Right after I find who did this to you.",
    },
    {
      speakerId: "narrator",
      text: "Second question: ",
    },
    {
      speakerId: "detective",
      text: "How did you die?",
    },
    {
      speakerId: "narrator",
      text: "Well, there's one very obvious wound.",
    },
    {
      speakerId: "narrator",
      text: "It's a large hole in the chest, about the size of a basketball.",
    },
    {
      speakerId: "narrator",
      text: "The edges of the hole are coated in purple blood, & I can see... organs inside the body.",
    },
    {
      speakerId: "narrator",
      text: "But there's nothing in the area with the hole.",
    },
    {
      speakerId: "narrator",
      text: "I figured there'd be more, really.",
    },
    {
      speakerId: "narrator",
      text: "Like, isn't there supposed to be important stuff inside us?",
    },
    {
      speakerId: "narrator",
      text: "It's like they carved out this area, but at the same time I doubt something as crude as a knife could've done this.",
    },
    {
      speakerId: "narrator",
      text: "Even if the culprit removed the organs in the chest area...",
    },
    {
      speakerId: "narrator",
      text: "Does that mean they were meticulous enough to take the organs, but not to clean up the blood?",
    },
    {
      speakerId: "narrator",
      text: "Anyway,",
    },
    {
      speakerId: "narrator",
      text: "The hole wasn't visible when the body was still face-down,",
    },
    {
      speakerId: "narrator",
      text: "So whatever made this wound didn't penetrate the back.",
      unlocks: [
        { type: "revealEntry", profileId: "cressida", entryId: "chestWound" },
      ]
    },
    {
      speakerId: "narrator",
      text: "I should remember that.",
    },
    {
      speakerId: "narrator",
      text: "This is definitely not a normal murder scene.",
    },
    {
      speakerId: "narrator",
      text: "Could this be the work of a catastrophe?",
    },//TODO can we have rich text around the word 'catastrophe'?
    {
      speakerId: "narrator",
      text: "If it is...",
    },
    {
      speakerId: "narrator",
      text: "...then I need to learn everything I can right now.",
    },
    {
      speakerId: "narrator",
      text: "If I screw this up, I'll be the one with a hole in my chest.",
    },
    //TODO explain catastrophes here?
    {
      speakerId: "narrator",
      text: "So, onto my third question:",
    },
    {
      speakerId: "narrator",
      text: "Where am I?",
      choices: [
        {
          id: "continue-ship-day2",
          label: "Continue",
          nextSceneId: "ship-day2-room",
        },
      ],
    },

    /*
    {
      speakerId: "detective",
      text: "Let's start with the first witness summary.",
      choices: [
        {
          id: "open-corkboard-first",
          label: "Review corkboard first",
          nextSceneId: "review-pause",
          setFlags: ["reviewed-board-once"],
        },
        {
          id: "continue-briefing",
          label: "Continue briefing",
          nextSceneId: "briefing",
        },
      ],
      unlocks: [
        { type: "revealEntry", profileId: "sarah-chen", entryId: "e1" },
        { type: "revealProfile", profileId: "marcus-veil" },
      ],
    },*/
  ],
};

