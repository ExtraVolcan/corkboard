import type { VnScene } from "../../../types";
import { characterNameRevealFlag } from "../../../nameReveal";

//TODO add a cat "Puck" to the scene! ppl will pet it, it'll jump around.
// BUT a later reveal is that not only is the cat also a synth, but,
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

//TODO: scene where Cal notices roundness of cookies?
// ^ like, he sees the baking sheet with holes in it & is like "There's no way..."

//TODO: miranda rampancy? maybe she puts a hole in stephano too?
//TODO: tense scene of gathering and using intel to defeat her catastrophe (Her ability).

//TODO last scene in chapter 1:
// With Miranda dealt with, only Titania and Cal are left (and the cat?).
// They have a heart-to-heart for the rest of the day?
// ^ maybe they come up with nicknames for each other & the others

//TODO endgame twist: 
// Snatcher's original body is what Caliban has been inside all this time!
// On "Day 0" (far in the past) (add a black row right before Day 1 on schedule),
// The Snatcher swaps consciousnesses with Caliban (and kills him immediately, leaving no memory backup),
// setting up for Day 1's events, with Snatcher in Caliban's original body: the cat!
// TODO write Caliban's headaches, confusion, difficulty walking (taller than usual), wonder at why he's wearing a helmet.
// TODO-[kinda done] write lack of mirrors while not drawing too much attention to it (something about not being able to wash up?)
// [DONE] Caliban commenting on similarity to Puck, and Titania responds "Uh, what? You look nothing alike."
//  ^ play it off like it's a joke, but Caliban actually notices how the cat is like a twin brother (it's actually what was supposed to be his original synth body!)
//    my nose looks a little weird, guess they didn't get that quite right.
// TODO - possibility: Cat's current form is a shrunk-down version of Caliban's OG body.
//  ^ to make this twist more guessable, maybe Ariel or Bianca is a cat-person of human stature?
// -
// A catastrophe is a physical ability: it can only be activated while the host body is alive/online.
// But its effects stay while the body is offline. (EX: burns, holes, swapped consciousnesses)
// This explains why Snatcher can use other people's abilities while inhabiting them.
//   (But, despite being in Snatcher's original body, Caliban can't use the swap ability)
//   (Because Snatcher also uses his catastrophe while inhabiting another body, as long as the host is online ("Caliban's portrait"))
// Effectively leaving Caliban without access to a catastrophe: why Caliban fails to use his catastrophe in this first chapter when fighting Miranda
// ^ TODO write that scene
// - 
// At some point, Caliban does get to see his face, and freaks out.
//  (in a previously closed-off area with a pool of reflective liquid?)
// Instigated by Titania running up to the liquid and fixing her hair in the reflection.
// "This... isn't right..." "No... no no no no no no"
// "Something's wrong with this liquid... It has to be..."
// "Why is it showing me this?"
// (maybe) "Titania, this isn't how I normally look, right?"
// Titania tries to calm him down, commenting how his face looks the same as it always has.
// "No, no, it's wrong, it's all wrong!"
// "This isn't how I'm supposed to look!"
// T: "Cal, what's going on? You're scaring me!"
// "This face... isn't mine!"
// (Maybe?) Narrator: Worse yet, it's a face I've seen before...

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
      unlocks: [
        { type: "revealProfile", profileId: "victim-room-titania" },
        { type: "revealImage", profileId: "victim-room-titania" },
        { type: "revealName", profileId: "victim-room-titania" },
        {
          type: "revealEntry",
          profileId: "victim-room-titania",
          entryId: "cabin-layout",
        },
      ],
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
      unlocks: [
        {
          type: "revealEntry",
          profileId: "victim-room-titania",
          entryId: "foil-wrappers",
        },
      ],
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
        { type: "revealProfile", profileId: "ship-doors" },
        { type: "revealImage", profileId: "ship-doors" },
        { type: "revealName", profileId: "ship-doors" },
        {
          type: "revealEntry",
          profileId: "ship-doors",
          entryId: "noDoorLabels",
        },
      ],
    },
    {
      speakerId: "narrator",
      text: "It's the same for my room. No labels. I guess I just have to remember that this one's mine.",
    },
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
      unlocks: [
        { type: "revealProfile", profileId: "ship-doors" },
        { type: "revealImage", profileId: "ship-doors" },
        {
          type: "revealEntry",
          profileId: "ship-doors",
          entryId: "uniform-design",
        },
      ],
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
      unlocks: [
        {
          type: "revealEntry",
          profileId: "ship-doors",
          entryId: "sensor-walkthrough",
        },
      ],
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
      unlocks: [
        {
          type: "revealEntry",
          profileId: "victim-room-titania",
          entryId: "victim-door-open",
        },
      ],
    },
    {
      speakerId: "narrator",
      text: "There's one more possibility.",
    },
    {
      speakerId: "narrator",
      text: "I walk down the corridor, around a corner. I'm looking for another set of doors.",
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
      text: "So, only my door has responded to me walking in & out of my room.",
    },
    {
      speakerId: "narrator",
      text: "Maybe they're bound to their own occupants.",
      unlocks: [
        {
          type: "revealEntry",
          profileId: "ship-doors",
          entryId: "occupant-bound",
        },
      ],
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
      text: "Something moved.",
    },
    {
      speakerId: "narrator",
      text: "My eyes dart to its position, and I instinctively brace myself, hiding my body around the corner walls like I'm taking cover from gunfire.",
    },
    {
      speakerId: "narrator",
      text: "Luckily, it's nothing so dangerous.",
    },
    {
      speakerId: "narrator",
      text: "It's a cat.",
    },
    {
      speakerId: "narrator",
      text: "And it's also staring at me from behind a corner, poking its tiny head out.",
    },
    {
      speakerId: "narrator",
      text: "An old-school house cat, by the looks of it. Not that I'd ever seen one in person before; it's before my time.",
    },
    {
      speakerId: "narrator",
      text: "For a moment, we're both just staring at each other, hiding behind our corners.",
    },
    {
      speakerId: "narrator",
      text: "It's like we're mimicking each other, in a way.",
    },
    {
      speakerId: "narrator",
      text: "Heh, it's like a mini version of me.",
    },
    {
      speakerId: "narrator",
      text: "After that awkward standoff, the cat disappears behind the corner as it scampers away.",
      unlocks: [
        { type: "revealProfile", profileId: "puck" },
        { type: "revealImage", profileId: "puck" },
        {
          type: "setProfileDisplayName",
          profileId: "puck",
          displayName: "Cat",
        },
        {
          type: "revealEntry",
          profileId: "puck",
          entryId: "cat-first-sighting-corridor",
        },
      ],
    },
    {
      speakerId: "detective",
      text: "Huh.",
    },
    {
      speakerId: "detective",
      text: "Why is there a cat here?",
    },
    {
      speakerId: "narrator",
      text: "I slowly approach the corner where I saw the cat.",
    },
    {
      speakerId: "narrator",
      text: "Down the corridor: voices. Low chatter threaded with tension. Not close enough to make out words.",
    },
    {
      speakerId: "narrator",
      text: "Do they know about the corpse yet?",
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
      speakerId: "narrator",
      text: "...and I see one of them has already scooped up the cat: a chick with messy orange hair.",
    },
    {
      speakerId: "titania",
      text: "We don't even need to do that much to keep the ship running. Would it kill you to just be nice?",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "narrator",
      text: "With the cat trapped in her arms, she scratches behind its ears. Its expression can only be described as terror & confusion.",
    },
    {
      speakerId: "stephano",
      text: "Consoling a girl was not in my job description.",
    },
    {
      speakerId: "miranda",
      text: "P-please don't fight… we're all on the same mission.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "Morning.",
    },
    {
      speakerId: "titania",
      text: "New face. You lost?",
      emotion: "think-talk"
    },
    {
      speakerId: "titania",
      emotion: "think",
      portraitOnly: true,
      text: "",
    },//TODO use portraitOnly on all other xxx-talk lines
    {
      speakerId: "detective",
      text: "Caliban. Pretty much just woke up. I hope my face looks okay; I didn't get to wash up. You are?",
    },
    {
      speakerId: "titania",
      text: "Titania. I can fix the engine if it breaks, but let's hope that doesn't happen.",
      emotion: "neutral-talk",
      setFlags: [characterNameRevealFlag("titania")],
      unlocks: [
        { type: "revealProfile", profileId: "titania" },
        { type: "revealImage", profileId: "titania" },
        { type: "revealName", profileId: "titania" },
      ],
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "miranda",
      text: "Miranda. I-I handle food prep.",
      emotion: "neutral-talk",
      setFlags: [characterNameRevealFlag("miranda")],
      unlocks: [
        { type: "revealProfile", profileId: "miranda" },
        { type: "revealImage", profileId: "miranda" },
        { type: "revealName", profileId: "miranda" },
      ],
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "titania",
      text: "She cooks lunch. It's pretty good!",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      text: "Dinner, ehhhh, not so much.",
      emotion: "squint-talk"
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "stephano",
      text: "My name's Stephano. I worked on the synthetic systems before this mission got off the ground.",
      setFlags: [characterNameRevealFlag("stephano")],
      unlocks: [
        { type: "revealProfile", profileId: "stephano" },
        { type: "revealImage", profileId: "stephano" },
        { type: "revealName", profileId: "stephano" },
      ],
    },
    {
      speakerId: "stephano",
      text: "And, Caliban? Your face looks just fine. It's designed to stay that way.",
    },
    {
      speakerId: "stephano",
      text: "You'll have to do without wash rooms, because, well, you won't find any on the ship.",
    },
    {
      speakerId: "titania",
      text: "I'd say new-guy looks cute enough. This kitty wins the cuteness war though!",
      emotion: "neutral-talk"//TODO replace with smile-talk?
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "narrator",
      text: "She snuggles her chin into the cat's fur. It still looks so scared.",
    },
    {
      speakerId: "detective",
      text: "The hell? I better be close in the rankings at least. It could basically be my little brother!",
    },
    {
      speakerId: "titania",
      text: "Uh, what? No way. You look nothing alike!",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "titania",
      text: "His name is Puck, I'll have you know. And he's a proper crewmember just like us.",
      emotion: "neutral-talk",
      setFlags: [characterNameRevealFlag("puck")],
      unlocks: [
        { type: "revealName", profileId: "puck" },
        { type: "setProfileDisplayName", profileId: "puck", displayName: "" },
      ],
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "...",
    },
    {
      speakerId: "titania",
      text: "Puck is the cutest, end of story.",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "narrator",
      text: "...Maybe she doesn't think so, but I'd like to think Puck and I bear a resemblance.",
    },
    {
      speakerId: "narrator",
      text: "Or maybe I just want cuddles.",
    },
    {
      speakerId: "narrator",
      text: "Grr, focus! There's a saboteur on board, and it's my responsibility to stop them.",
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
      speakerId: "narrator",
      text: "The orange-haired girl, Titania, strokes a delicate hand down the cat's fur.",
    },
    {
      speakerId: "titania",
      text: "We have to be. Out here the mission isn't a slogan, it's the reason any of us wake up at all.",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "stephano",
      text: "Hard to forget when we look like this.",
    },
    {
      speakerId: "detective",
      text: "You mean our bodies? I'd say we look pretty human. Smells different though.",
    },
    {
      speakerId: "stephano",
      text: "We're synthetic now. Skin and nerves behave like baseline humans, until they don't. When we lose one, the system queues a re-print.",
      unlocks: [
        { type: "revealProfile", profileId: "synthetic-bodies" },
        { type: "revealImage", profileId: "synthetic-bodies" },
        { type: "revealName", profileId: "synthetic-bodies" },
        {
          type: "revealEntry",
          profileId: "synthetic-bodies",
          entryId: "synthetic-body-overview",
        },
      ],
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
      unlocks: [
        {
          type: "revealEntry",
          profileId: "synthetic-bodies",
          entryId: "backup-frequency",
        },
      ],
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
      speakerId: "narrator",
      text: "There's a lot of questions on my mind, but one has me so curious it keeps bubbling up to the surface like an intrusive thought.",
    },
    {
      speakerId: "detective",
      text: "Hey, quick question: why is there a cat here?",
    },
    {
      speakerId: "narrator",
      text: "The cat, Puck, still looks absolutely terrified. A hilarious contrast to Titania's loving embrace.",
    },
    {
      speakerId: "detective",
      text: "It's cute, but what purpose could it possibly serve?",
    },
    {
      speakerId: "titania",
      text: "Maybe his purpose IS to be cute.",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      text: "Relaxation is an essential for mental health, y'know.",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      text: "",
      emotion: "neutral",
      portraitOnly: true,
    },
    {
      speakerId: "narrator",
      text: "Her fingers furiously jiggle the cat's belly. I still can't tell if it's enjoying this.",
    },
    {
      speakerId: "stephano",
      text: "The cat is synthetic too."
    },
    {
      speakerId: "detective",
      text: "Really? How can you tell?",
    },
    {
      speakerId: "stephano",
      text: "It's written right here, alongside all our names."
    },
    {
      speakerId: "narrator",
      text: "So Puck really is a crewmember on this mission. Wouldn't have expected that.",
    },
    {
      speakerId: "narrator",
      text: "Stephano is looking at a sheet as he explains.",
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
        { type: "revealName", profileId: "maintenance-schedule" },
        {
          type: "revealEntry",
          profileId: "maintenance-schedule",
          entryId: "rotation-columns",
        },
        {
          type: "revealEntry",
          profileId: "maintenance-schedule",
          entryId: "day-1-active",
        },
        {
          type: "revealEntry",
          profileId: "maintenance-schedule",
          entryId: "day-2-active",
        },
        {
          type: "revealEntry",
          profileId: "maintenance-schedule",
          entryId: "day-3-active",
        },
        {
          type: "revealEntry",
          profileId: "maintenance-schedule",
          entryId: "day-4-active",
        },
        {
          type: "revealEntry",
          profileId: "maintenance-schedule",
          entryId: "day-5-active",
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
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "",
      emotion: "detective-think",
      interaction: {
        kind: "corkboardEntry",
        prompt:
          "On the Maintenance Schedule dossier, tap the day note that tells me which day is today.",
        question: "Which day is today?",
        profileId: "maintenance-schedule",
        correctEntryId: "day-2-active",
        openBoardButtonLabel: "Open Maintenance Schedule",
        submitLabel: "This is it!",
        wrongFeedbackDefault:
          "That doesn't tell me which day is today.",
        wrongFeedbackByEntryId: {
          "rotation-columns":
            "That's the overview of the grid, not the day-by-day roster. I can figure out which day is today from the maintenance schedule & the names of everyone I've met today.",
          "day-1-active":
            "Day 1 would be the first column; I'm not listed on that day.",
          "day-3-active":
            "Day 3 doesn't line up; who's active today doesn't match that list.",
          "day-4-active":
            "Too far forward; the Day 4 roster doesn't match who's in front of me.",
          "day-5-active":
            "That day's roster doesn't fit what I've seen today.",
        },
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
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "",
      emotion: "detective-think",
      interaction: {
        kind: "mcq",
        prompt: "What is the victim's name?",
        options: [
          {
            id: "guess-miranda",
            label: "Miranda",
            wrongFeedback:
              "Miranda is literally standing right there. The victim's name is something else.",
          },
          {
            id: "guess-titania",
            label: "Titania",
            wrongFeedback:
              "Titania is right in front of me! She's not the victim.",
          },
          {
            id: "guess-stephano",
            label: "Stephano",
            wrongFeedback:
              "Stephano is the one who gave me the maintenance schedule. He also doesn't have a hole in his chest, last I checked.",
          },
          {
            id: "guess-cressida",
            label: "Cressida",
            correct: true,
          },
          {
            id: "guess-ariel",
            label: "Ariel",
            wrongFeedback: "I don't know an Ariel, but that name doesn't appear as active on Day 1 or 2.",
          },
          {
            id: "guess-bianca",
            label: "Bianca",
            wrongFeedback: "I don't know a Bianca, but that name doesn't appear as active on Day 1 or 2.",
          },
          {
            id: "guess-detective",
            label: "Caliban",
            wrongFeedback: "That's me! I don't plan on being a victim today.",
          },
          {
            id: "guess-puck",
            label: "Puck",
            wrongFeedback: "Puck is the cat! He's not the victim. He's a valuable crewmember, according to Titania at least.",
          },
        ],
      },
    },
    {
      speakerId: "narrator",
      text: "So your name's Cressida.",
      unlocks: [
        { type: "revealName", profileId: "cressida" },
        {
          type: "setProfileDisplayName",
          profileId: "cressida",
          displayName: "",
        },
      ],
    },
    {
      speakerId: "narrator",
      text: "According to this schedule, Cressida was awake yesterday.",
    },
    {
      speakerId: "narrator",
      text: "Maintenance slots her rebuild two days out, so she should wake up on Day 5.",
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
      text: "So... what abilities does everyone have?",
    },
    {
      speakerId: "titania",
      text: "Why? So you can get to know our weaknesses better?",
      emotion: "squint-talk"
    },
    {
      speakerId: "titania",
      emotion: "squint",
      portraitOnly: true,
      text: "",
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
      text: "That's diplomat speak. It was a damn knife fight with words.",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      text: "Cressida carved Miranda up!",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      text: "Not literally.",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      text: "Figuratively.",
      emotion: "squint-talk"
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "...",
    },
    {
      speakerId: "titania",
      text: "Ugh, come on, if they actually drew blood there's no way I'd keep that gossip to myself.",
      emotion: "squint-talk"
    },
    {
      speakerId: "titania",
      text: "But like, Cressida really laid into Miranda, she had some... choice words.",
      emotion: "think-talk"
    },
    {
      speakerId: "titania",
      emotion: "think",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "miranda",
      text: "Y-yes, and I didn't want us to fight, so...",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "miranda",
      text: "...so I made her cookies.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "You made cookies for Cressida after she tore into you?",
    },
    {
      speakerId: "titania",
      text: "Figuratively.",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "Yeah, figuratively.",
    },
    {
      speakerId: "miranda",
      text: "Th-that's right. It was a peace offering.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "miranda",
      text: "I was the one who made the mistake anyway, so...",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
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
      emotion: "neutral-talk",
      unlocks: [
        {
          type: "revealEntry",
          profileId: "miranda",
          entryId: "cookies-left-at-door",
        },
      ],
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "titania",
      text: "Because waiting would've meant admitting your fault to her face.",
      emotion: "squint-talk"
    },
    {
      speakerId: "titania",
      emotion: "squint",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "miranda",
      text: "Because I didn't want another scene!",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
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
      emotion: "think-talk"
    },
    {
      speakerId: "titania",
      emotion: "think",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "When was that?",
    },
    {
      speakerId: "titania",
      text: "Uh, like 15 minutes ago?",
      emotion: "think-talk"
    },
    {
      speakerId: "titania",
      emotion: "think",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "narrator",
      text: "Wait, did she say...?",
      unlocks: [
        {
          type: "revealEntry",
          profileId: "titania",
          entryId: "last-seen-cressida-timing",
        },
      ],
    },
    {
      speakerId: "narrator",
      text: "...15 minutes ago?! Was Titania the last person to see Cressida alive?",
    },
    {
      speakerId: "titania",
      text: "Why are you so interested in the cookies anyway, Cal?",
      emotion: "squint-talk"
    },
    {
      speakerId: "titania",
      emotion: "squint",
      portraitOnly: true,
      text: "",
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
      emotion: "neutral-talk"//TODO make smile-talk?
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
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
      unlocks: [
        { type: "revealProfile", profileId: "cookies" },
        { type: "revealImage", profileId: "cookies" },
        { type: "revealName", profileId: "cookies" },
        { type: "revealEntry", profileId: "cookies", entryId: "cookies" },
        {
          type: "revealEntry",
          profileId: "cookies",
          entryId: "cookie-handoff",
        },
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
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
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
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "",
      emotion: "detective-think",
      interaction: {
        kind: "corkboardEntry",
        prompt:
          "Select the dossier clue that puts Miranda's claim into question.",
        question:
          "Miranda says she left the cookies outside Cressida's door. Why is that suspicious?",
        profileId: "ship-doors",
        correctEntryId: "noDoorLabels",
        openBoardButtonLabel: "Open corkboard dossier",
        submitLabel: "This is it!",
        wrongFeedbackDefault:
          "That tidbit doesn't collide with Miranda's claim. Her claim sounds plausible, but from what I know so far, it should be nigh-impossible.",
        wrongFeedbackByEntryId: {
          "uniform-design":
            "Every door looks and acts the same... That relates to the point I want to make, but we can be more specific.",
          "sensor-walkthrough":
            "No, knowing how the doors open and close doesn't make Miranda suspicious. According to her, she knocked on a closed door. But to get there, there's a crucial point that I believe she couldn't have known.",
          "occupant-bound":
            "No, my theory that the doors only respond to their occupants doesn't make Miranda suspicious. It matches up with her statement, because she says she knocked on a closed door she believed was occupied. But to get there, there's crucial information that I believe only the occupant would know.",
        },
      },
    },
    {
      speakerId: "narrator",
      text: "Yeah, that's it! There are no labels on the doors, so...",
    },
    {
      speakerId: "narrator",
      text: "How did she know where Cressida's room was?",
      emotion: "detective-think",
    },
    {
      speakerId: "detective",
      text: "Miranda...",
    },
    {
      speakerId: "miranda",
      text: "Y-yes?",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "You said you left the cookies outside Cressida's door.",
    },
    {
      speakerId: "detective",
      text: "But none of the doors I've seen have any labels on them.",
    },
    {
      speakerId: "detective",
      text: "In fact, they all look the same.",
    },
    {
      speakerId: "detective",
      text: "So how did you know which door was Cressida's?",
    },
    {
      speakerId: "miranda",
      text: "Well...I-",
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
      text: "I showed her.",
    },
    {
      speakerId: "narrator",
      text: "He's covering for her?",
      emotion: "detective-think",
    },
    {
      speakerId: "detective",
      text: "Okay, well how did you know, Stephano?",
    },
    {
      speakerId: "stephano",
      text: "It's a funny story, actually.",
    },
    {
      speakerId: "stephano",
      text: "Yesterday morning, Cressida & I opened our doors at the same time.",
    },
    {
      speakerId: "stephano",
      text: "The first thing we saw was each other's faces!",
    },
    {
      speakerId: "stephano",
      text: "So you see, Cressida's room is directly across from mine.",
    },
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
      text: "Hold up.",
    },
    {
      speakerId: "narrator",
      text: "Stephano's statement doesn't line up with what I know.",
    },
    {
      speakerId: "narrator",
      text: "Stephano's room can't be directly across from Cressida's...",
    },
    {
      speakerId: "narrator",
      text: "Because MY room is directly across from Cressida's!",
    },
    {
      speakerId: "narrator",
      text: "It's impossible for both of those to be true!",
    },
    {
      speakerId: "narrator",
      text: "My spotlight is on Stephano now. Is he lying to me? Maybe to cover for Miranda?",
    },
    {
      speakerId: "narrator",
      text: "",
      emotion: "detective-think",
      interaction: {
        kind: "mcq",
        prompt: "Is Stephano lying?",
        options: [
          {
            id: "stephano-lie",
            label: "I'm sure Stephano is lying.",
            wrongFeedback:
              "No, hold on... I know there's a contradiction, but that doesn't necessarily mean he's lying.",
          },
          {
            id: "stephano-truth",
            label: "I can't be sure that Stephano is lying.",
            correct: true,
          },
        ],
      },
    },
    {
      speakerId: "narrator",
      text: "I'm not sure if Stephano is lying yet, but I am sure there's a contradiction here.",
      emotion: "detective-think",
    },
    {
      speakerId: "narrator",
      text: "Cressida's room can't be in two places at once.",
    },
    {
      speakerId: "narrator",
      text: "Two possibilities: either Stephano's room is across from Cressida's, or mine is.",
    },
    {
      speakerId: "narrator",
      text: "And I was pretty damn sure my room was across from Cressida's until just a second ago.",
    },
    {
      speakerId: "narrator",
      text: "But I need to explore every possiblity to find the truth.",
    },
    {
      speakerId: "narrator",
      text: "Is it even possible that Stephano is right about this?",
    },
    {
      speakerId: "narrator",
      text: "Let's think this through step by step.",
    },
    {
      speakerId: "narrator",
      text: "I need to examine all my assumptions.",
    },
    {
      speakerId: "narrator",
      text: "The room I walked out of this morning is where I woke up, and the door responded to my presence unlike any other door.",
    },
    {
      speakerId: "narrator",
      text: "When I walked inside that room, the door closed behind me.",
    },
    {
      speakerId: "narrator",
      text: "I think it's still safe to assume that it's my room.",
    },
    {
      speakerId: "narrator",
      text: "What about across the hallway, the room where I found Cressida's corpse?",
    },
    {
      speakerId: "narrator",
      text: "That door didn't respond to my presence, and it was open when I walked out of my room. That's why I saw the corpse immediately.",
    },
    {
      speakerId: "narrator",
      text: "Earlier I walked past a closed door, which actually proves something to me.",
    },
    {
      speakerId: "narrator",
      text: "Since I've seen everyone on the maintenance schedule today, that means the closed door must belong to a crewmember who's offline today.",
    },
    {
      speakerId: "narrator",
      text: "That tracks with what I know, it seems my door was closed until I woke up & walked towards it.",
    },
    {
      speakerId: "narrator",
      text: "So, a door remains closed if someone is offline inside their room?",
    },
    {
      speakerId: "narrator",
      text: "That does make sense with what I already know about how the doors work. Simple logic: if the occupant enters then the door closes, and if the occupant leaves, it stays open.",
    },
    {
      speakerId: "narrator",
      text: "Just one problem: Cressida's door is open despite her being inside.",
    },
    {
      speakerId: "narrator",
      text: "Even when she was alive, her door should've closed behind her when she entered, and her going offline shouldn't have made the door open.",
    },
    {
      speakerId: "narrator",
      text: "Ah... I get it now.",
    },
    {
      speakerId: "narrator",
      text: "So I AM right about how the doors work...",
    },
    {
      speakerId: "narrator",
      text: "...but there's an assumption I made early on that I can't prove.",
    },
    {
      speakerId: "narrator",
      text: "",
      emotion: "detective-think",
      interaction: {
        kind: "mcq",
        prompt: "Which assumption isn't supported by the evidence?",
        options: [
          {
            id: "assumption-no-proof-corpse",
            label: "That the corpse belongs to Cressida",
            wrongFeedback:
              "No, everything I have still points at the body being Cressida's: She was listed on the roster for today.",
          },
          {
            id: "assumption-no-proof-room",
            label: "That the room belongs to Cressida",
            correct: true,
          },
          {
            id: "assumption-no-proof-day1",
            label: "That Cressida was active on Day 1",
            wrongFeedback:
              "Cressida was active on Day 1: The maintenance schedule backs that one up, plus everyone talked about her.",
          },
          {
            id: "assumption-no-proof-my-room",
            label: "That the room that responds to my presence is mine",
            wrongFeedback:
              "No, that assumption has backing. No other door responds to my presence.",
          },
        ],
      },
    },
    {
      speakerId: "narrator",
      text: "I assumed the room belonged to Cressida because that's where her body was.",
    },
    {
      speakerId: "narrator",
      text: "There's no evidence to show that the room belongs to Cressida.",
    },
    {
      speakerId: "narrator",
      text: "But there is evidence to show that the room DOESN'T belong to Cressida.",
    },
    {
      speakerId: "narrator",
      text: "It's the damn door.",
    },
    {
      speakerId: "narrator",
      text: "It makes total sense why the door is open if its occupant isn't inside.",
    },
    {
      speakerId: "narrator",
      text: "Cressida died in someone else's room.",
    },
    {
      speakerId: "narrator",
      text: "Well, I guess that means Stephano wasn't lying: his room really could be directly across from Cressida's actual room.",
    },
    {
      speakerId: "narrator",
      text: "I'd rather not draw attention to the room with a corpse in it right now, so I think I can end my line of questioning here.",
    },
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
    {
      speakerId: "miranda",
      text: "...",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "miranda",
      text: "I wasn't- I swear- I just wanted to be nice-",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "Hey, it's okay. No matter what it is, you can always make up for past mistakes. So, please tell me what happened.",
    },
    {
      speakerId: "narrator",
      text: "I'm not lying, I do believe that, but I'm also saying it because I need her to calm down so she can open up.",
    },
    {
      speakerId: "miranda",
      text: "I- ",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "miranda",
      text: "I-I gave the cat a bite of my cooking.",
      emotion: "neutral-talk",
      unlocks: [
        {
          type: "revealEntry",
          profileId: "miranda",
          entryId: "fed-puck-cooking",
        },
      ],
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "titania",
      text: "...",
      emotion: "think"
    },
    {
      speakerId: "miranda",
      text: "Cressida saw me, and-and she scolded me.",
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
      text: "Go on.",
      emotion: "squint-talk"
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "miranda",
      text: "I- Cressida said that cats don't digest in the same way we do, and-.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "miranda",
      text: "-and that I could've killed it.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "miranda",
      text: "...",
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
      text: "...",
      emotion: "neutral"
    },
    {
      speakerId: "titania",
      text: "She's still leaving out one part.",
      emotion: "squint-talk"
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "miranda",
      text: "Well... I-I- I didn't know what to do, so-",
      emotion: "neutral-talk",
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "miranda",
      text: "The tears started flowing, and- I couldn't spit the words out. I heard Cressida run away after that.",
      emotion: "neutral-talk",
      unlocks: [
        {
          type: "revealEntry",
          profileId: "miranda",
          entryId: "cressida-fled-after-sobbing",
        },
      ],
    },
    {
      speakerId: "miranda",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "I see.",
    },
    {
      speakerId: "detective",
      text: "So you apologized with dessert.",
    },
    {
      speakerId: "miranda",
      text: "It's… it's how my family always cooled fights. Sweet first, talk second.",
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
      text: "Biochemically sentimental. Interesting.",
    },
    {
      speakerId: "detective",
      text: "Hey Stephano, what's up with that cat anyway? It's synthetic, right? Would it be poisoned by our food?",
    },
    {
      speakerId: "stephano",
      text: "I'm more focused on the human synthetic process, not felines, but...",
    },
    {
      speakerId: "stephano",
      text: "Human synthetic bodies are made to be exact copies of the original body. Anytime we tried to alter parts, it didn't work well.",
    },
    {
      speakerId: "stephano",
      text: "I would've preferred if we could've removed base urges like hunger & sex, but improvising new forms of life is far more difficult than just copying the old.",
    },
    {
      speakerId: "stephano",
      text: "So, I think the cat is a perfect replica of an original cat back home.",
    },
    {
      speakerId: "detective",
      text: "In other words, Puck is susceptible to the same problems as any other cat.",
    },
    {
      speakerId: "titania",
      text: "Cress was right to yell at you.",
      emotion: "squint-talk"
    },
    {
      speakerId: "titania",
      emotion: "squint",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "narrator",
      text: "Titania stares intently at Miranda.",
    },
    {
      speakerId: "narrator",
      text: "Miranda shrinks under her tone.",
    },
    {
      speakerId: "titania",
      text: "But...",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      text: "...She felt bad for making you cry like that.",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "narrator",
      text: "Hah, so Titania does have a heart.",
    },
    {
      speakerId: "titania",
      text: "Cress was crying too, y'know? So I'm staying mad at you until I see you two make up face to face, got it?",
      emotion: "neutral-talk"
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "narrator",
      text: "Miranda nods wordlessly.",
    },
    {
      speakerId: "narrator",
      text: "Good, I've learned more about what happened while I was asleep.",
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
      speakerId: "narrator",
      text: "",
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
