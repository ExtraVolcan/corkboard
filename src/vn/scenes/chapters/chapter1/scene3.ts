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
      speakerId: "titania",
      text: "...",
      emotion: "neutral",
    },
    {
      speakerId: "miranda",
      text: "...",
      emotion: "neutral",
    },
    {
      speakerId: "stephano",
      text: "...",
      emotion: "neutral",
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
    },//TODO unlock/update "Victim's cabin" to "Titania's cabin"
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
    {
      speakerId: "narrator",
      text: "I'm sorry, Titania... I already knew Cressida was innocent.",
    },
    {
      speakerId: "narrator",
      text: "And you don't even know she's dead.",
    },
    {
      speakerId: "narrator",
      text: "In the heat of the moment, Titania showed us that she really does care.",
    },
    {
      speakerId: "narrator",
      text: "While everyone is sympathizing with Cressida, maybe I can use this momentum.",
    },
    {
      speakerId: "detective",
      text: "Thank you, Titania. You're a good friend, and thanks to you, we have less reason to be suspicious of Cressida.",
    },
    {
      speakerId: "detective",
      text: "There's just one more reason I suspected Cressida. Maybe you can help me clear her name.",
    },
    {
      speakerId: "detective",
      text: "Are you aware of Cressida's catastrophe?",
    },
    {
      speakerId: "titania",
      text: "No... I'm not.",
      emotion: "think-talk",
    },
    {
      speakerId: "titania",
      text: "Why are you asking me that?",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "Are you aware of anyone's catastrophe?",
    },
    {
      speakerId: "titania",
      text: "No.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "Well, that hardly seems fair, does it?",
    },
    {
      speakerId: "titania",
      text: "What are you getting at?",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "How is it fair that you know nothing about anyone's catastrophe, while I know yours has the ability to create fire?",
    },
    {
      speakerId: "titania",
      text: "Wha-?",
    },
    {
      speakerId: "titania",
      text: "Tch- you might know that, but you know nothing about its condition!",
    },
    {
      speakerId: "detective",
      text: "Do you really want me to reveal that in front of everyone?",
    },
    {
      speakerId: "detective",
      text: "If I did that, you'd be the only one who's exposed.",
    },
    {
      speakerId: "detective",
      text: "Wouldn't it be better if we all knew the truth?",
    },
    {
      speakerId: "detective",
      text: "I mean, I could keep this all to myself, but I think it's better for the mission that we all trust each other.",
    },
    {
      speakerId: "titania",
      text: "You want us to go around the room and do little icebreakers? Fun facts about our catastrophes?",
    },
    {
      speakerId: "detective",
      text: "Basically, yeah.",
    },
    {
      speakerId: "stephano",
      text: "What gives, Caliban? Why didn't you tell us this earlier?",
    },
    {
      speakerId: "detective",
      text: "Isn't it obvious?",
    },
    {
      speakerId: "detective",
      text: "I can trust you all now!",
    },
    {
      speakerId: "detective",
      text: "None of you are the saboteur. It's either Cressida, or some outside force.",
    },
    {
      speakerId: "narrator",
      text: "That's a lie, but it could give me the opening I need.",
    },
    {
      speakerId: "stephano",
      text: "I don't know about this, I'm not keen on sharing how my catastrophe works.",
    },
    {
      speakerId: "titania",
      text: "Right now, Cal is the only one who knows about all our catastrophes! Isn't it a way bigger problem for only one person to have all that knowledge?",
    },
    {
      speakerId: "stephano",
      text: "Weren't you the one who said you didn't want to share what abilities we had because it would expose our weaknesses?",
    },
    {
      speakerId: "titania",
      text: "I'm not gonna be the only one who gets outed!",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "Think of the mission. That's what I'm doing. It's the only reason I said anything about this.",
    },
    {
      speakerId: "stephano",
      text: "True, I guess you could've said nothing and kept quiet.",
    },
    {
      speakerId: "miranda",
      text: "...okay.",
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
      text: "Screw it, I'll go first. Follow me to the kitchen.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    // go to kitchen scene
    {
      speakerId: "narrator",
      text: "",
      choices: [
        {
          id: "continue-kitchen",
          label: "Follow Titania",
          nextSceneId: "kitchen",
        },
      ],
    },
  ],
};

export const kitchenScene: VnScene = {
  id: "kitchen",
  title: "Kitchen",
  background: "bg:ship-kitchen",
  lines: [
    {
      speakerId: "narrator",
      text: "We walk under an archway into a large kitchen with white walls and marble countertop.",
    },
    {
      speakerId: "titania",
      text: "Hah...",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      text: "You guys better keep your word, or I'll cook you alive, I swear!",
      emotion: "squint-talk",
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "narrator",
      text: "Titania reaches her hand and opens the oven door.",
    },
    {
      speakerId: "narrator",
      text: "Its off, and empty. I'm thankful we don't have to worry about gas leaks.",
    },
    {
      speakerId: "titania",
      text: "Listen up! With my catastrophe, I can create fire, yeah?",
      emotion: "neutral-talk",
    },
    {
      speakerId: "narrator",
      text: "I can feel a warmth emanating from her.",
    },
    {
      speakerId: "titania",
      text: "But it's not just anywhere. I create the sparks in the palm of my hand.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      text: "Then, I can throw those sparks to spread the flame.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "narrator",
      text: "She flicks her wrist, and the spark flies into the oven.",
    },
    {
      speakerId: "narrator",
      text: "The spark ignites into a fire that expands and lights up the oven with an intense heat.",
    },
    {
      speakerId: "stephano",
      text: "The destructive power of a catastrophe...",
    },
    {
      speakerId: "miranda",
      text: "I'm j-just happy you didn't burn the kitchen down.",
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
      text: "Titania looks at the fire with a satisfied smile.",
    },
    {
      speakerId: "titania",
      text: "Okay! Your turn!",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "miranda",
      text: "M-me? Mine's not that impressive. I just use it for baking.",
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
      text: "I mean, Titania's could be described that way too.",
    },
    {
      speakerId: "detective",
      text: "Her fire could definitely bake some cookies in an instant.",
    },
    {
      speakerId: "titania",
      text: "I'd rather not eat ash cookies, but thanks for the compliment.",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "stephano",
      text: "Yeah, I definitely prefer Miranda's!",
    },
    {
      speakerId: "narrator",
      text: "Stephano's taking a bite out of a cookie he unwrapped.",
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
      text: "Hey, Stephano, I haven't tried one yet! Don't finish them all!",
      emotion: "neutral-talk",
    },
    {
      speakerId: "titania",
      emotion: "neutral",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "narrator",
      text: "Stephano doesn't stop chewing, and points to the counter, where there are some more of Miranda's professionally wrapped cookies.",
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
      speakerId: "narrator",
      text: "Miranda is staring downward.",
    },
    {
      speakerId: "narrator",
      text: "Is she feeling self-conscious with all these eyes on her?",
    },
    {
      speakerId: "narrator",
      text: "My gaze moves to the countertop, where there's a baking sheet.",
    },
    {
      speakerId: "narrator",
      text: "The sheet is filled by a layer of cookie dough, and half of it has clearly already been used for cookies on account of all the holes in it.",
    },
    {
      speakerId: "narrator",
      text: "I hear Stephano loudly crunching on his cookie. Titania reaches for one of the untouched cookies on the counter.",
    },
    {
      speakerId: "narrator",
      text: "Miranda really must be a skilled baker. Maybe I should finally try the cookie Titania handed me?",
    },
    {
      speakerId: "narrator",
      text: "My mind wanders back to the baking sheet with the cookie dough.",
    },
    {
      speakerId: "narrator",
      text: "It makes my mouth water, but there's something else about it too.",
    },
    {
      speakerId: "narrator",
      text: "Perfectly circular holes for each cookie.",
    },
    {
      speakerId: "narrator",
      text: "...",
    },
    {
      speakerId: "detective",
      text: "There's no way...",
    },
    //TODO miranda crazy face and "Shh..."
    //TODO scene where Caliban tries to cry out to Titania, but Miranda lunges at him and shuts him up with her mouth.
    // TODO nickname Snatcher always uses for the Detective:
    //    "Detective Dearest"? "No-Good Detective"?
    //"Don't worry, detective, I won't hurt you..."
    //"I really do want to keep you alive, you know?"
    //"Try not to get in my way."
    // Cal tries to use his catastrophe, but fails.
    //"Aww, maybe if you had your catastrophe, you would've stood a chance."
    //"You understand so little..."
    //"It's almost cute how pathetic you are."
    //-
    //
    {
      speakerId: "narrator",
      text: "I look up, but it's too late.",
    },
    {
      speakerId: "narrator",
      text: "From one moment to the next, Stephano's head is gone.",
    },
    {
      speakerId: "narrator",
      text: "Like someone took a bite out of his neck.",
    },
    {
      speakerId: "narrator",
      text: "Like someone cut a perfect circle where his head used to be.",
    },
    {
      speakerId: "narrator",
      text: "I feel the adrenaline kick in.",
    },
    {
      speakerId: "narrator",
      text: "Titania screams.",
    },//TODO maybe Titania's hand got severed as well?
    {
      speakerId: "narrator",
      text: "One thing is clear to me: I know who the real threat is now.",
    },
    {
      speakerId: "detective",
      text: "MIRANDA!!!",
    },
    {
      speakerId: "miranda",
      text: "What's wrong, detective? You asked for a demonstration of my ability, didn't you?",
      emotion: "crazy-talk",
    },
    {
      speakerId: "miranda",
      emotion: "crazy",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "titania",
      text: "...Miranda?",
    },
    {
      speakerId: "narrator",
      text: "Her demeanor is completely different from before. Her sweetness is gone, & she's not tripping over a single word.",
    },
    {
      speakerId: "narrator",
      text: "Now she speaks with...confidence. Arrogance.",
    },
    {
      speakerId: "narrator",
      text: "Maybe it's earned, because we don't know how to counter her catastrophe.",
    },
    {
      speakerId: "detective",
      text: "Miranda's the saboteur, Titania! She can put holes in people!",
    },
    {
      speakerId: "titania",
      text: "She did that to Stephano?",
    },
    {
      speakerId: "titania",
      text: "...Why are you doing this, Miranda? What happened to you?",
    },
    {
      speakerId: "narrator",
      text: "Miranda only offers a wide smile in response.",
    },
    {
      speakerId: "narrator",
      text: "Titania's hands start to warm up, but they're shaking too.",
    },
    {
      speakerId: "titania",
      text: "What the hell do we do? She's just gonna put holes in us too!",
    },
    {
      speakerId: "detective",
      text: "No, she would've done it already if she could.",
    },
    {
      speakerId: "detective",
      text: "Every catastrophe has restrictions. What's Miranda's?",
    },
    {
      speakerId: "narrator",
      text: "She's preparing to attack. I need to do something!",
    },
    {
      speakerId: "narrator",
      text: "No, before that, I need to think.",
    },
    {
      speakerId: "narrator",
      text: "Cressida & Stephano died to her ability. What's the commonality between them?",
    },
    {
      speakerId: "narrator",
      text: "Something about their circumstances allowed Miranda to kill them, but not us!",
    },
    //MCQ: What did Cressida & Stephano have in common?
    // - Their rooms are across from each other (WRONG answer, technically true but irrelevant to the circumstances of their deaths)
    // - They were both active yesteday (WRONG, Titania was active yesterday too)
    // - They love cute animals (WRONG, Stephano didn't particularly care for cute animals)
    // - They love sweet treats
    //TODO in this fight, caliban has to figure out how miranda's ability works.
    // ^ piece together the commonalities between Cressida's and Stephano's deaths: they ate a cookie.
    {
      speakerId: "miranda",
      text: "Your mission is guaranteed to fail. So quit worrying and die already!",
      emotion: "crazy-talk",
    },
    {
      speakerId: "miranda",
      emotion: "crazy",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "narrator",
      text: "Miranda lunges forward, tray in hand, towards us.",
    },
    {
      speakerId: "detective",
      text: "Titania! Shoot the tray!",
    },
    {
      speakerId: "titania",
      text: "What? I was gonna go for the head!",
    },
    {
      speakerId: "detective",
      text: "We'd die before she does! Just trust me! Burn the cookies!",
    },
    {
      speakerId: "titania",
      text: "Aw, fine! Screw your cookies, you maniac!",
    },
    {
      speakerId: "narrator",
      text: "The spark shoots from Titania's palm.",
    },
    {
      speakerId: "narrator",
      text: "Miranda swings the tray, sending the cookies flying towards us.",
    },
    {
      speakerId: "narrator",
      text: "I brace myself for the worst.",
    },
    {
      speakerId: "narrator",
      text: "A torrent of flame bursts forth, engulfing the cookies in a bright light.",
    },
    {
      speakerId: "narrator",
      text: "The shockwave of heat sends the cookies right into the floor as they melt.",
    },
    {
      speakerId: "narrator",
      text: "Spherical holes appear where the cookies landed, cutting chunks out of the floor.",
    },
    {
      speakerId: "narrator",
      text: "Miranda still stands, but so do we.",
    },
    {
      speakerId: "narrator",
      text: "Ashes and smoke waft past as we stare at each other.",
    },
    {
      speakerId: "titania",
      text: "You, you were right!",
    },
    {
      speakerId: "titania",
      text: "Take that, you bitch!",
    },
    {
      speakerId: "miranda",
      text: "Well played, detective... You adapted better than I expected to losing your catastrophe.",
      emotion: "crazy-talk",
    },
    {
      speakerId: "miranda",
      emotion: "crazy",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "narrator",
      text: "I can't even see her eyes through the smoke.",
    },
    {
      speakerId: "miranda",
      text: "My success is inevitable.",
      emotion: "crazy-talk",
    },
    {
      speakerId: "miranda",
      emotion: "crazy",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "detective",
      text: "What the hell even is success to you?",
    },
    {
      speakerId: "narrator",
      text: "She smiles.",
    },
    {
      speakerId: "miranda",
      text: "Hey, lady. Did he mention how I killed your little girl?",
      emotion: "crazy-talk",
    },
    {
      speakerId: "miranda",
      emotion: "crazy",
      portraitOnly: true,
      text: "",
    },
    {
      speakerId: "titania",
      text: "...",
    },
    {
      speakerId: "titania",
      text: "What?",
    },
    {
      speakerId: "narrator",
      text: "Titania's expression turns from gloating to confusion to anger.",
    },
    {
      speakerId: "titania",
      text: "I'm searing your psycho face off!",
    },
    {
      speakerId: "detective",
      text: "No, wait!",
    },
    {
      speakerId: "narrator",
      text: "Miranda goaded Titania into this.",
    },
    {
      speakerId: "narrator",
      text: "She didn't even care for her own life.",
    },
    {
      speakerId: "narrator",
      text: "In an instant, the top half of her body is covered in a powerful yellow flash, consumed by flames.",
    },
    {
      speakerId: "narrator",
      text: "Smoke hides the brutality for a moment, but soon my eyes confirm the death...",
    },
    {
      speakerId: "narrator",
      text: "...A charred corpse, brought to its knees & blackened.",
    },
    {
      speakerId: "narrator",
      text: "No getting up from that. And no chance for interrogation.",
    },
    {
      speakerId: "narrator",
      text: "Titania is breathing heavily.",
    },
    {
      speakerId: "narrator",
      text: "She lowers her arm.",
    },
    //TODO titania runs to mourn Cressida
    //TODO they wonder if Miranda will be crazy when she resurrects
    
  ],
};