// Shared topic metadata and the first voice scenario for each topic.
export const topics = {
  festival: {
    icon: "✦",
    name: "Festivais de cinema",
    title: "Uma conversa depois da sessão",
    role: "a filmmaker at an international film festival",
    situation:
      "You have just watched an independent film. Introduce yourself to the director and ask about the story.",
    lines: [
      "What inspired you to tell this story?",
      "How did you choose the locations?",
      "Your film really stayed with me.",
    ],
  },
  travel: {
    icon: "→",
    name: "Viagens",
    title: "Seu primeiro café na cidade",
    role: "a friendly barista in London",
    situation:
      "Order a coffee, ask for a local recommendation and find out how to get there.",
    lines: [
      "Could I have a flat white, please?",
      "Is there a place nearby you would recommend?",
      "How do I get there from here?",
    ],
  },
  everyday: {
    icon: "☀",
    name: "Conversas cotidianas",
    title: "Uma nova conexão",
    role: "a new colleague on a lunch break",
    situation:
      "Introduce yourself, talk about your weekend and discover something you have in common.",
    lines: [
      "What do you like doing outside work?",
      "I watched a great film last weekend.",
      "Would you like to join us next time?",
    ],
  },
  interview: {
    icon: "◉",
    name: "Entrevistas com cineastas",
    title: "Por trás das câmeras",
    role: "an independent filmmaker being interviewed",
    situation:
      "Interview a filmmaker about creative choices, challenges and their next project. Ask follow-up questions.",
    lines: [
      "What was the biggest challenge during production?",
      "Could you tell me more about that decision?",
      "What are you working on next?",
    ],
  },
  business: {
    icon: "◇",
    name: "Negócios internacionais",
    title: "Sua ideia merece ser ouvida",
    role: "an international business partner in a project meeting",
    situation:
      "Present a project idea, clarify the timeline and agree on a practical next step.",
    lines: [
      "Let me walk you through our proposal.",
      "Could we clarify the timeline?",
      "What would be a good next step?",
    ],
  },
};
