import { topics } from "./content.js";
import {
  activities,
  modes,
  filterActivities,
  dailyTrail,
} from "./activities.js";
import { level, localDate } from "./progress.js";
export const escapeHTML = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const e = escapeHTML;
export const isConversation = (s) =>
  s && (!s.mode || s.mode === "conversation");
export function activityCard(a, done = false) {
  return `<article class="activity-card"><div class="activity-meta"><span>${modes[a.mode].icon} ${modes[a.mode].name}</span><span>${a.minutes} min · A2–B1</span></div><h3>${a.title}</h3><p>${topics[a.topic].name}</p><div class="activity-bottom"><small>${done ? "✓ Praticada hoje · pode repetir" : `+${a.xp} XP ao concluir`}</small><button class="button" data-activity="${a.id}" aria-label="Praticar: ${a.title} · ${modes[a.mode].name}">Praticar →</button></div></article>`;
}
export function homeView(p) {
  const topic = Object.hasOwn(topics, p.topic) ? p.topic : "festival",
    t = topics[topic];
  const trail = dailyTrail(topic, localDate()),
    conversation = activities.find(
      (a) => a.topic === topic && a.mode === "conversation" && a.minutes === 12,
    );
  return `<section class="intro"><div class="eyebrow green">LET’S MAKE IT HAPPEN</div><h1>Sua próxima conversa<br>começa <em>aqui.</em></h1><p>Inglês para viver histórias, conhecer pessoas e abrir caminhos.</p></section>${p.activeAttempt ? '<section class="resume-banner"><span>Uma prática está esperando por você.</span><button class="text-button" id="resume">Retomar atividade →</button></section>' : ""}<div class="dashboard"><div><section class="hero"><div class="hero-top"><span class="tag">✦ ESPAÇO PARA SUA VOZ</span><span>12 MIN · CONVERSAÇÃO</span></div><div class="hero-art" aria-hidden="true"><span class="orbit"></span><span class="speech">Hello,<br><i>new world.</i><b>✦</b></span><span class="art-star">✧</span></div><div class="hero-content"><div class="hero-category">${t.icon} ${t.name}</div><h2>${conversation.title}</h2><p>Uma situação real. Algumas palavras novas.<br>E mais confiança para falar.</p><button class="button cream" id="start" data-activity="${conversation.id}">Começar minha conversa <span>→</span></button><div class="hero-foot">◷ No seu ritmo <span>+40 XP ao concluir</span></div></div></section><button class="quick-card" id="quick" data-activity="${trail[2].id}"><span class="quick-icon">ϟ</span><span><strong>Só tenho 5 minutinhos</strong><small>Preparar, conversar, refletir. Também conta.</small></span><span class="arrow">→</span></button><section class="themes"><div class="section-heading"><h2>Sua trilha de hoje</h2><button data-tab="practice" class="text-button">Escolher outra →</button></div><p class="muted small">Três passos sugeridos. Faça quantos quiser, na ordem que preferir.</p><div class="trail-list">${trail
    .map((a) =>
      activityCard(
        a,
        p.sessions.some(
          (s) => s?.date === localDate() && s.activityId === a.id,
        ),
      ),
    )
    .join(
      "",
    )}</div></section><section class="themes"><div class="section-heading"><h2>Inglês para o seu mundo</h2><button data-tab="practice" class="text-button">Ver biblioteca →</button></div><div class="theme-grid">${Object.entries(
    topics,
  )
    .map(
      ([id, x]) =>
        `<button class="theme-card ${topic === id ? "selected" : ""}" data-topic="${id}" aria-pressed="${topic === id}"><span class="theme-icon">${x.icon}</span><strong>${x.name}</strong><small>${topic === id ? "Tema selecionado" : "Selecionar tema"} →</small></button>`,
    )
    .join(
      "",
    )}</div></section></div><div class="right-column"><section class="progress-card"><div class="section-heading"><h2>Sua jornada</h2><span>✧</span></div><div class="xp-ring"><div><strong>${p.xp}</strong><span>XP CONQUISTADOS</span></div></div><div class="level-row"><strong>Nível ${level(p.xp)} · ${level(p.xp) === 1 ? "Primeiros passos" : "Novos horizontes"}</strong><span>${p.xp % 100}/100</span></div><div class="bar"><i style="width:${p.xp % 100}%"></i></div><p>Mais ${100 - (p.xp % 100)} XP para o próximo nível.<br>Cada prática te leva um pouco além.</p><div class="week">${weekView(p)}</div><div class="gentle">♡ Sem pressão, sem perder progresso.</div></section><section class="voice-card"><span class="voice-icon">≋</span><span class="eyebrow">MENOS MEDO. MAIS VOZ.</span><h2>Seu inglês precisa<br>de espaço para sair.</h2><p>Pratique com o ChatGPT por voz. Erre, tente de novo e descubra seu jeito de falar.</p><button id="voice-help" class="text-button">Como funciona →</button></section></div></div>`;
}
export function libraryView(filters) {
  const filtered = filterActivities(filters);
  return `<section class="intro"><div class="eyebrow green">UM PRÓXIMO PASSO, SEMPRE</div><h1>Vamos <em>praticar?</em></h1><p>Escolha seu tema, seu tempo e sua forma de aprender. Repetir também ensina.</p></section><section aria-label="Filtros de atividades" class="library-filters"><label>Modalidade<select id="filter-mode" aria-label="Modalidade"><option value="all">Todas as modalidades</option>${Object.entries(
    modes,
  )
    .map(
      ([id, m]) =>
        `<option value="${id}" ${filters.mode === id ? "selected" : ""}>${m.name}</option>`,
    )
    .join(
      "",
    )}</select></label><label>Tema<select id="filter-topic" aria-label="Tema"><option value="all">Todos os temas</option>${Object.entries(
    topics,
  )
    .map(
      ([id, t]) =>
        `<option value="${id}" ${filters.topic === id ? "selected" : ""}>${t.name}</option>`,
    )
    .join(
      "",
    )}</select></label><label>Duração<select id="filter-duration" aria-label="Duração">${[
    ["all", "Qualquer duração"],
    ["short", "2–5 min"],
    ["medium", "5–10 min"],
    ["long", "10–15 min"],
  ]
    .map(
      ([id, name]) =>
        `<option value="${id}" ${filters.duration === id ? "selected" : ""}>${name}</option>`,
    )
    .join(
      "",
    )}</select></label></section><p class="muted small" role="status">${filtered.length} atividades disponíveis · duração estimada</p>${filtered.length ? `<div class="library-grid">${filtered.map((a) => activityCard(a)).join("")}</div>` : '<section class="empty-state"><h2>Vamos abrir outras possibilidades?</h2><p>Não há atividades nessa combinação. Escolha outra duração ou modalidade.</p><button id="reset-filters" class="button">Limpar filtros</button></section>'}`;
}
export function progressView(p) {
  const conversations = p.sessions.filter(isConversation).length;
  const days = new Set(p.sessions.map((s) => s?.date).filter(Boolean)).size;
  const seenTopics = new Set(p.sessions.map((s) => s?.topic).filter(Boolean))
    .size;
  return `<section class="intro"><div class="eyebrow green">CADA TENTATIVA CONTA</div><h1>Veja o quanto<br>você <em>já caminhou.</em></h1><p>Seu progresso fica com você, mesmo quando a rotina muda.</p></section><section class="continue-card"><div><h2>Tem espaço para mais uma?</h2><p>Uma próxima atividade, no seu ritmo. Sem limite diário.</p></div><button class="button" id="continue">Continuar estudando →</button><button class="text-button" data-tab="practice">Escolher outra</button></section><div class="stats"><div><strong>${p.xp}</strong> XP conquistados</div><div><strong>${p.sessions.length}</strong> atividades concluídas <small>${conversations} de conversação</small></div><div><strong>${days}</strong> dias de prática</div></div><h2 class="subheading">Suas conquistas</h2><div class="achievement-grid">${[
    [
      conversations >= 1,
      "✦",
      "Primeira conversa",
      "Complete sua primeira conversa.",
    ],
    [conversations >= 5, "◈", "Voz em movimento", "Complete 5 conversas."],
    [seenTopics >= 3, "◎", "Sem fronteiras", "Pratique em 3 temas diferentes."],
  ]
    .map(
      ([yes, icon, title, description]) =>
        `<article class="achievement ${yes ? "earned" : ""}"><span>${icon}</span><h3>${title}</h3><p>${description}</p><small>${yes ? "Conquistada" : "Um passo de cada vez"}</small></article>`,
    )
    .join(
      "",
    )}</div><h2 class="subheading">Histórico de práticas</h2><p class="muted small">${p.sessions.length} registros preservados. Suas reflexões ficam só neste navegador.</p>${
    p.sessions.length
      ? `<ul class="history">${p.sessions
          .slice()
          .reverse()
          .map(
            (s) =>
              `<li><span>${e(activities.find((a) => a.id === s?.activityId)?.title || topics[s?.topic]?.name || "Prática")}<small>${e(typeof s?.date === "string" ? s.date.split("-").reverse().join("/") : "Data não informada")} · ${e(modes[s?.mode]?.name || "Conversação")}${s?.minutes ? ` · ${e(s.minutes)} min` : s?.quick ? " · 5 minutos" : ""}</small>${typeof s?.reflection === "string" && s.reflection ? `<details><summary>Minha reflexão</summary><p>${e(s.reflection)}</p></details>` : ""}</span><strong>+${e(s?.xp ?? 0)} XP</strong></li>`,
          )
          .join("")}</ul>`
      : '<p class="muted">Sua história começa na primeira prática. Vamos nessa?</p>'
  }`;
}
function weekView(p) {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - 6 + i);
    const yes = p.sessions.some((s) => s?.date === localDate(d));
    return `<div class="day ${yes ? "done" : ""} ${i === 6 ? "current" : ""}"><span>${["D", "S", "T", "Q", "Q", "S", "S"][d.getDay()]}</span><b>${yes ? "✓" : d.getDate()}</b></div>`;
  }).join("");
}
