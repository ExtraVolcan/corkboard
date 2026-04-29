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

export const scene1: VnScene = {
  id: "opening",
  title: "An Unfinished Board",
  background: "bg:office-night",
  lines: [
    {
      speakerId: "narrator",
      text: "The first thing I remember is the smell.",
      //unlocks: [
      //  { type: "revealProfile", profileId: "sarah-chen" },
      //  { type: "revealName", profileId: "sarah-chen" },
      // { type: "revealImage", profileId: "sarah-chen" }],
      //],
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
      text: "Because even my armpits smell nicer than the body I'm staring at.",
      //TODO: change background to show pixelated body
    },
    {
      speakerId: "narrator",
      text: "There's a small puddle of blue liquid surrounding the body.",
    },
    {
      speakerId: "narrator",
      text: "It's recent, because the blue liquid is still flowing.",
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
      text: "Yeah, no shit, dumbass."
    },
    {
      speakerId: "detective",
      text: "Of course there's blood inside the body."
    },
    {
      speakerId: "narrator",
      text: "I really need to focus."
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
      speakerId: "narrator",
      text: "I. Need. To. Focus."
    },
    {
      speakerId: "narrator",
      text: "Alright, first question: "
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
      text: "The blue puddle hasn't reached its neck.",
    },
    {
      speakerId: "narrator",
      text: "Turning over the body, I get a good look at the face.",
      //TODO: little tutorial about the corkboard here?
      //TODO: animation / alert for new intel? (NEW label?)
      unlocks: [
       { type: "revealImage", profileId: "cressida" }
      ],
    },
    {
      speakerId: "narrator",
      text: "I don't know who this is.",
    },
    {
      speakerId: "narrator",
      text: "Makes sense; I don't know anyone in this place.",
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
      setFlags: [characterNameRevealFlag("detective")],
    },
    {
      speakerId: "narrator",
      text: "Giving the limp hand a little shake, I let it drop back down to the floor.",
    },
    {
      speakerId: "detective",
      text: "Maybe we can introduce ourselves properly in a few days time.",
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
      text: "It's a large hole in the chest.",
    },
    {
      speakerId: "narrator",
      text: "The edges & insides of the hole are coated in blue blood.",
    },
    {
      speakerId: "narrator",
      text: "Aside from that, nothing else inside.",
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

