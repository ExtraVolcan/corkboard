import type { VnScene } from "../../../types";
import { characterNameRevealFlag } from "../../../nameReveal";


export const holdItScene: VnScene = {
  id: "hold-it",
  title: "Hold It!",
  background: "bg:office-pause",
  lines: [
    {
      speakerId: "narrator",
      text: "I raise my voice, stopping everyone in their tracks.",
    },
    {
      speakerId: "narrator",
      text: "Well, I've got their attention now.",
    },
    {
      speakerId: "narrator",
      text: "Time to raise the stakes.",
    },
    {
      speakerId: "detective",
      text: "I need you all to stay with me!",
    },
    {
      speakerId: "detective",
      text: "I have reason to believe there's a saboteur on board, working to undermine our mission!",
    },
    {
      speakerId: "narrator",
      text: "If I leave it at that, the killer will be on edge...far too dangerous.",
    },
    {
      speakerId: "narrator",
      text: "Plus, if I look too competent, the killer might target me next. It would be disastrous to face them without learning how their catastrophe works.",
    },
    {
      speakerId: "narrator",
      text: "Don't worry little killer, I have just the thing to calm your nerves in one move.",
    },
    {
      speakerId: "detective",
      text: "My prime suspect is: ",
    },
    //TODO MCQ where correct answer is "Cressida"! Because only the killer would know she's dead.

    {
      speakerId: "detective",
      text: "Cressida!",
    },
    {
      speakerId: "narrator",
      text: "I'm publicly accusing Cressida. Her killer knows she's dead, so they know my accusation is wrong.",
    },
    {
      speakerId: "narrator",
      text: "I can steer the conversation by making Cressida look suspicious: she's the only crewmember active today who isn't in the room right now.",
    },
    {
      speakerId: "titania",
      text: "You...",
    },//TODO anger-talk and anger portraits
    {
      speakerId: "titania",
      text: "You pompous so-and-so, how dare you accuse Cress of what, of being a mole? A traitor? She's just a darling little girl!",
    },
    {
      speakerId: "titania",
      text: "I should burn you where you stand!",
    },
    {
      speakerId: "miranda",
      text: "H-hold on... we should hear Caliban out, at least...",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "titania",
      text: "Of course YOU would say that!",
    },
    {
      speakerId: "titania",
      text: "Well, Mr. Detective, why? Why do you hate Cress?",
    },
    {
      speakerId: "detective",
      text: "I don't hate Cress, I just suspect her.",
    },
    {
      speakerId: "detective",
      text: "So let me answer you, with my own question: ",
    },
    //TODO MCQ?
    // "Do you really know where Cressida is right now?"
    // maybe: "Cressida's been gone unusually long, hasn't she?"
    // maybe: "Are you aware of Cressida's catastrophe?"
    {
      speakerId: "detective",
      text: "Do you really know where Cressida is right now?",
    },
    {
      speakerId: "titania",
      text: "Of course I do! I was heading there before you so rudely interrupted me!",
    },
    {
      speakerId: "titania",
      text: "She's in my room!",
    },
    {
      speakerId: "narrator",
      text: "Bingo.",
    },
    {
      speakerId: "miranda",
      text: "C-Cressida's in your room?",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "stephano",
      text: "Care to explain, Titania?",
    },
    {
      speakerId: "titania",
      text: "Why are you making this such a big deal? Yes, I took her to my room.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      text: "I saw her sniffling, holding Miranda's cookies; she had just picked them up from outside her door. She came to me for comfort.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      text: "So I walked her to my room, wiped her tears, and told her to take as long as she needed.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      text: "When I left to come back here to the meeting room, Cress was unwrapping one of the cookies.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      text: "So she's not suspicious, okay?! She's just taking her time to process her emotions!",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },

  ],
};

