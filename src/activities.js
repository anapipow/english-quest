import { topics } from "./content.js";
export const modes = {
  conversation: {
    name: "Conversação",
    icon: "◌",
    description: "Sua voz em situações reais.",
  },
  listening: {
    name: "Listening",
    icon: "≋",
    description: "Escute e descubra os detalhes.",
  },
  reading: {
    name: "Reading",
    icon: "▤",
    description: "Leia histórias do seu mundo.",
  },
  challenge: {
    name: "Desafios rápidos",
    icon: "ϟ",
    description: "Uma expressão, uma nova possibilidade.",
  },
};
// Original A2–B1 texts. Every topic has two listening/reading passages, two
// distinct voice situations and a short challenge; no remote content required.
const passages = {
  festival: [
    {
      title: "Uma sessão para todos",
      text: "The festival has moved the outdoor screening to the town hall because rain is expected tonight. The film still starts at eight. Your original ticket is valid, and volunteers will guide visitors from the park to the new venue. There will be a short discussion with the director after the film.",
      questions: [
        [
          "Por que a sessão mudou de lugar?",
          [
            "Por causa da previsão de chuva",
            "Porque os ingressos acabaram",
            "Porque o filme foi cancelado",
          ],
          0,
          "“Rain is expected tonight” explica a mudança.",
        ],
        [
          "O que acontece depois do filme?",
          [
            "Uma festa no parque",
            "Uma conversa com a diretora",
            "Outra sessão ao ar livre",
          ],
          1,
          "“A short discussion with the director” acontece após o filme.",
        ],
      ],
    },
    {
      title: "O encontro entre sessões",
      text: "At a small festival, Jo meets a producer in the coffee queue. They discover that both are interested in stories about migration. Jo asks for an email address and offers to send a short summary of her documentary next week. The producer agrees to read it but explains that funding decisions will only be made in March.",
      questions: [
        [
          "O que Jo vai enviar?",
          [
            "O filme completo",
            "Um convite para uma festa",
            "Um resumo do documentário",
          ],
          2,
          "“A short summary of her documentary” é um resumo.",
        ],
        [
          "O produtor já prometeu financiamento?",
          [
            "Não, as decisões serão em março",
            "Sim, no próximo dia",
            "Sim, imediatamente",
          ],
          0,
          "Ele aceita ler o resumo, mas decisões sobre recursos ficam para março.",
        ],
      ],
    },
  ],
  travel: [
    {
      title: "Um plano para a conexão",
      text: "Your train arrives at the airport at ten thirty. Your flight leaves at one, but the airline asks passengers to arrive two hours before departure. The station is a ten-minute walk from the terminal. If you take the earlier train, you will have enough time to check your bag and find the gate without rushing.",
      questions: [
        [
          "A que horas a companhia pede que você chegue?",
          ["Às onze", "À uma", "Às dez e meia"],
          0,
          "Two hours before one: duas horas antes de uma são onze horas.",
        ],
        [
          "Qual é a vantagem do trem mais cedo?",
          [
            "Um voo gratuito",
            "Tempo para despachar a mala sem pressa",
            "Evitar caminhar até o terminal",
          ],
          1,
          "O trem anterior dá tempo para “check your bag” e achar o portão.",
        ],
      ],
    },
    {
      title: "O quarto tranquilo",
      text: "At check-in, Sam asks for a quiet room because he has an online interview in the morning. The receptionist offers a room away from the lift at no extra charge. Breakfast starts at seven, and the Wi-Fi password is on the card beside the bed. Sam thanks her and asks where he can fill his water bottle.",
      questions: [
        [
          "Por que Sam quer silêncio?",
          [
            "Para uma entrevista online",
            "Para uma festa",
            "Para gravar um show",
          ],
          0,
          "Ele tem “an online interview in the morning”.",
        ],
        [
          "O quarto mais silencioso custa mais?",
          ["Sim, o dobro", "Não, não há cobrança extra", "Só no fim de semana"],
          1,
          "“At no extra charge” significa sem custo adicional.",
        ],
      ],
    },
  ],
  interview: [
    {
      title: "Uma pergunta que abre portas",
      text: "Before interviewing the filmmaker, Maya watches her first short film and writes down three open questions. During the conversation, she listens carefully instead of reading every question on her list. When the filmmaker mentions a difficult editing decision, Maya asks for an example. This follow-up leads to a more personal story about the film.",
      questions: [
        [
          "Como Maya se prepara?",
          [
            "Assiste ao primeiro curta e escreve perguntas",
            "Decora todas as respostas",
            "Pede para cancelar",
          ],
          0,
          "Ela assiste ao curta e prepara três perguntas abertas.",
        ],
        [
          "O que torna a conversa mais pessoal?",
          [
            "Mudar de assunto",
            "Pedir um exemplo sobre a decisão de montagem",
            "Ler todas as perguntas sem ouvir",
          ],
          1,
          "O pedido de exemplo é a “follow-up” que abre uma história pessoal.",
        ],
      ],
    },
    {
      title: "O som da memória",
      text: "The director explains that the film uses very little music. Instead, she recorded familiar sounds from her childhood: buses, rain on a metal roof and people talking in the kitchen. She wanted the audience to feel close to the main character without being told exactly what to feel. The sound team spent six weeks building this quiet world.",
      questions: [
        [
          "O que substitui grande parte da música?",
          [
            "Sons familiares da infância",
            "Entrevistas de rádio",
            "Silêncio absoluto",
          ],
          0,
          "São os sons de ônibus, chuva e conversas na cozinha.",
        ],
        [
          "Qual era a intenção da diretora?",
          [
            "Explicar toda a história",
            "Aproximar o público da personagem",
            "Fazer um musical",
          ],
          1,
          "Ela queria que o público se sentisse próximo da personagem principal.",
        ],
      ],
    },
  ],
  business: [
    {
      title: "Um próximo passo claro",
      text: "During the call, the partners agree to test the new service with twenty customers before expanding it. The pilot will last three weeks. Ana will collect feedback, and David will prepare a cost estimate. They schedule a follow-up meeting for Friday to review the plan, not to make a final investment decision.",
      questions: [
        [
          "Qual é o próximo passo?",
          [
            "Expandir imediatamente",
            "Testar com vinte clientes",
            "Contratar cem pessoas",
          ],
          1,
          "Primeiro haverá um teste com vinte clientes.",
        ],
        [
          "Para que serve a reunião de sexta?",
          [
            "Revisar o plano",
            "Assinar o investimento final",
            "Cancelar o piloto",
          ],
          0,
          "A reunião é para “review the plan”, não para decidir o investimento final.",
        ],
      ],
    },
    {
      title: "Um prazo possível",
      text: "A client asks whether the team can deliver the first version by Monday. Lee explains that the full version needs another week, but offers to send a working demo on Monday. The client agrees because the demo will be enough for the internal presentation. Lee sends a short email confirming what is included and when the full version will be ready.",
      questions: [
        [
          "O que será entregue na segunda?",
          [
            "A versão completa",
            "Uma demonstração funcional",
            "Nenhuma entrega",
          ],
          1,
          "“A working demo” será entregue na segunda.",
        ],
        [
          "Por que Lee envia um email?",
          [
            "Para confirmar escopo e prazos",
            "Para mudar o preço em segredo",
            "Para cancelar a apresentação",
          ],
          0,
          "O email confirma o que está incluído e quando a versão completa fica pronta.",
        ],
      ],
    },
  ],
  everyday: [
    {
      title: "Um convite sem pressão",
      text: "After work, a few colleagues are going to a free photography exhibition. Nina invites a new teammate, who says she has to pick up her son first. Nina suggests meeting at the gallery at seven instead of going together from the office. Her teammate smiles and says she will send a message if she can join them.",
      questions: [
        [
          "Qual é o programa?",
          [
            "Uma exposição de fotografia",
            "Uma reunião obrigatória",
            "Um jantar caro",
          ],
          0,
          "Eles vão a uma “free photography exhibition”.",
        ],
        [
          "Como Nina facilita a participação?",
          [
            "Exige uma resposta imediata",
            "Sugere encontrar o grupo mais tarde",
            "Cancela tudo",
          ],
          1,
          "Ela propõe se encontrar na galeria às sete, sem pressão.",
        ],
      ],
    },
    {
      title: "Uma recomendação de filme",
      text: "Ben recommends a documentary to his neighbour. He says it is not a fast film, but the interviews are thoughtful and the landscapes are beautiful. His neighbour asks whether there are English subtitles. Ben checks the streaming page and confirms that subtitles are available. They decide to watch it separately and talk about it over coffee on Sunday.",
      questions: [
        [
          "O que a vizinha pergunta?",
          [
            "Se existem legendas em inglês",
            "Se o filme ganhou dez prêmios",
            "Se o filme é gratuito",
          ],
          0,
          "Ela pergunta sobre “English subtitles”.",
        ],
        [
          "Quando vão conversar sobre o filme?",
          ["Durante a sessão", "No domingo, tomando café", "Nunca"],
          1,
          "Eles combinam conversar “over coffee on Sunday”.",
        ],
      ],
    },
  ],
};
const alternatives = {
  festival: {
    title: "Um contato para o próximo projeto",
    role: "a documentary producer you meet between festival screenings",
    situation:
      "Introduce your documentary idea, ask what stories the producer is looking for, and politely suggest staying in touch.",
    lines: [
      "What kind of projects are you looking for?",
      "May I send you a short summary?",
      "It was lovely meeting you.",
    ],
  },
  travel: {
    title: "Mudança de planos no hotel",
    role: "a hotel receptionist helping a traveller",
    situation:
      "Explain that your flight was delayed, ask to change your check-in time and request a quiet room for an interview.",
    lines: [
      "My flight has been delayed.",
      "Would it be possible to check in later?",
      "Is there a quiet room available?",
    ],
  },
  interview: {
    title: "O que ficou fora do filme?",
    role: "a filmmaker discussing editing and sound choices",
    situation:
      "Ask why a scene was removed, how sound affects the story, and follow up on one surprising answer.",
    lines: [
      "How did you decide what to leave out?",
      "What role does sound play in this scene?",
      "Could you give me an example?",
    ],
  },
  business: {
    title: "Negociar um prazo com clareza",
    role: "an international client asking about a project deadline",
    situation:
      "Clarify what the client needs, explain a realistic deadline and agree on the scope of a first demo.",
    lines: [
      "What do you need for the first presentation?",
      "We could deliver a demo by Monday.",
      "Let me confirm what is included.",
    ],
  },
  everyday: {
    title: "Um convite para o fim de semana",
    role: "a new friend who enjoys films and photography",
    situation:
      "Invite your friend to an exhibition, discuss schedules and suggest an alternative if they are busy.",
    lines: [
      "Would you like to join us?",
      "What time works for you?",
      "No worries, we can meet another day.",
    ],
  },
};
const challenges = {
  festival: [
    "Um contato gentil",
    "Você quer enviar seu projeto depois do festival. Qual frase é mais adequada?",
    [
      "May I send you a short summary?",
      "You must buy my film now.",
      "I sending you yesterday.",
    ],
    0,
    "“May I…?” pede permissão de forma educada.",
  ],
  travel: [
    "Pedir ajuda na estação",
    "Qual frase pede uma informação com educação?",
    [
      "Where train go yesterday?",
      "Could you tell me which platform I need?",
      "You give platform now.",
    ],
    1,
    "“Could you tell me…?” é uma forma natural e educada de pedir informação.",
  ],
  interview: [
    "Ir além da primeira resposta",
    "Qual pergunta convida a cineasta a explicar melhor uma decisão?",
    [
      "Was it a film?",
      "Do you like things?",
      "Could you tell me more about that choice?",
    ],
    2,
    "“Tell me more about…” é um follow-up específico e aberto.",
  ],
  business: [
    "Confirmar o combinado",
    "Qual frase ajuda a alinhar o próximo passo de uma reunião?",
    [
      "Let me confirm the deadline and next steps.",
      "We has meeting tomorrow ago.",
      "Never explain the plan.",
    ],
    0,
    "Confirmar prazo e próximos passos reduz mal-entendidos.",
  ],
  everyday: [
    "Um convite natural",
    "Como convidar alguém para um café?",
    [
      "You drinking now.",
      "Would you like to grab a coffee?",
      "I coffee you yesterday.",
    ],
    1,
    "“Would you like to…?” faz um convite gentil.",
  ],
};
export const activities = Object.entries(topics).flatMap(([topic, t]) => {
  const voice = [t, alternatives[topic]].map((item, i) => ({
    id: `${topic}-conversation-${i + 1}`,
    topic,
    mode: "conversation",
    title: item.title,
    minutes: i ? 5 : 12,
    xp: i ? 20 : 40,
    role: item.role,
    situation: item.situation,
    lines: item.lines,
  }));
  const texts = passages[topic].flatMap((passage, i) =>
    ["listening", "reading"].map((mode) => ({
      id: `${topic}-${mode}-${i + 1}`,
      topic,
      mode,
      title: passage.title,
      minutes: mode === "listening" ? 7 : 4,
      xp: mode === "listening" ? 25 : 15,
      text: passage.text,
      questions: passage.questions.map(
        ([question, options, answer, explanation]) => ({
          question,
          options,
          answer,
          explanation,
        }),
      ),
    })),
  );
  const [title, question, options, answer, explanation] = challenges[topic];
  return [
    ...voice,
    ...texts,
    {
      id: `${topic}-challenge-1`,
      topic,
      mode: "challenge",
      title,
      minutes: 2,
      xp: 10,
      questions: [{ question, options, answer, explanation }],
    },
  ];
});
export function filterActivities({
  topic = "all",
  mode = "all",
  duration = "all",
} = {}) {
  return activities.filter(
    (a) =>
      (topic === "all" || a.topic === topic) &&
      (mode === "all" || a.mode === mode) &&
      (duration === "all" ||
        {
          short: a.minutes >= 2 && a.minutes <= 5,
          medium: a.minutes > 5 && a.minutes <= 10,
          long: a.minutes > 10 && a.minutes <= 15,
        }[duration]),
  );
}
export function activityPrompt(activity) {
  return `Act as ${activity.role}. Help me practice spoken English at A2–B1 level. Situation: ${activity.situation} Keep this practice to about ${activity.minutes === 5 ? 3 : 7} minutes. Ask one question at a time and wait for my spoken answer. If I get stuck, offer a simple hint. Encourage follow-up questions. At the end, give me two useful corrections, one strength and three expressions to practice. Start by greeting me in character.`;
}
