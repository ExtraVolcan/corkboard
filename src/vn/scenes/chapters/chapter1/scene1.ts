import type { VnScene } from "../../../types";

//synopsis:
// introduce the protagonist, and a 'dead' body, (pixel-censored by heavily downscaling image)
// the murder is recent, and the perpetrator ends up being relatively obvious.
// introduction to the basic game systems like questions & corkboard.
// the protagonist detective likes old-school detective stuff like corkboards and polaroids. maybe he carries a camera?

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
      speakerId: "detective-???",
      text: "It must have looked a little funny to see me sniffing my own armpits.",
    },
    {
      speakerId: "narrator",
      text: "But I needed to reset my senses,",
    },
    {
      speakerId: "narrator",
      text: "Because even my armpits smell nicer than the body I'm staring at.",
    },
    {
      speakerId: "narrator",
      text: "It's recent, because the blue liquid is still flowing from the wound.",
    },
    {
      speakerId: "narrator",
      text: "There's a small puddle of the blue liquid surrounding the body.",
    },
    {
      speakerId: "detective-???",
      text: "...",
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
      speakerId: "detective-???",
      text: "Yeah, no shit, dumbass."
    },
    {
      speakerId: "detective-???",
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
      text: "I turn to look at the body"
    },
    {
      speakerId: "detective-???",
      text: "Can I get your number?"
    },
    {
      speakerId: "detective-???",
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
      speakerId: "detective-???",
      text: "Who are you?"
    },
    {
      speakerId: "narrator",
      text: "It's easy enough to answer that one.",
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
      unlocks: [
       { type: "revealImage", profileId: "cressida" }
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

