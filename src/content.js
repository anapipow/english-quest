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
    text: "The director spent two years developing the story. She filmed in her hometown with a small crew. After the screening, she invited the audience to share their own experiences.",
    question: "Onde a diretora filmou?",
    options: [
      "Na cidade onde cresceu",
      "Em um grande estúdio",
      "Em três países",
    ],
    answer: 0,
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
    text: "The café is next to the station. The barista recommends a quiet market ten minutes away on foot. It closes at six, so you have time to explore before dinner.",
    question: "Como chegar ao mercado?",
    options: ["De trem", "A pé, em dez minutos", "De ônibus, em uma hora"],
    answer: 1,
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
    text: "Alex recently moved to the city. On weekends, he enjoys cooking and watching documentaries. He is looking for a film club and would love to meet people with similar interests.",
    question: "O que Alex gostaria de encontrar?",
    options: [
      "Um novo emprego",
      "Um clube de cinema",
      "Uma escola de culinária",
    ],
    answer: 1,
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
    text: "During production, the team lost access to their main location. Instead of stopping, they rewrote two scenes and filmed outdoors. The director says this change made the film feel more honest.",
    question: "Como a equipe resolveu o problema?",
    options: [
      "Cancelou o filme",
      "Trocou toda a equipe",
      "Reescreveu cenas e filmou ao ar livre",
    ],
    answer: 2,
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
    text: "The partners agree to start with a small pilot in November. They will review the results after four weeks before discussing a larger investment. Maria will send the proposal on Friday.",
    question: "O que acontece antes de um investimento maior?",
    options: [
      "Uma avaliação do piloto",
      "A abertura de um escritório",
      "Uma campanha global",
    ],
    answer: 0,
  },
};
export function voicePrompt(t, quick) {
  return `Act as ${t.role}. Help me practice spoken English at A2–B1 level. Situation: ${t.situation} Keep this practice to about ${quick ? 3 : 7} minutes. Ask one question at a time and wait for my spoken answer. If I get stuck, offer a simple hint. Encourage follow-up questions. At the end, give me two useful corrections, one strength and three expressions to practice. Start by greeting me in character.`;
}
