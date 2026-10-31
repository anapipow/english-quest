import "./style.css";
import { topics, voicePrompt } from "./content.js";
import { loadProgress, complete, level, localDate } from "./progress.js";
let p;
try {
  p = loadProgress(localStorage.getItem("english-quest"));
} catch {
  p = loadProgress(null);
}
if (!topics[p.topic]) p.topic = "festival";
let tab = "today",
  quick = false,
  stage = 0,
  choice = null,
  spoken = false,
  notice = "",
  storageWarning = false;
const app = document.querySelector("#app");
function save() {
  try {
    localStorage.setItem("english-quest", JSON.stringify(p));
  } catch {
    storageWarning = true;
  }
}
const icons = { today: "⌂", practice: "◌", progress: "▥" };
function render() {
  const t = topics[p.topic],
    today = localDate(),
    done = p.sessions.filter((s) => s.date === today).length;
  app.innerHTML = `<aside class="sidebar"><a class="brand" href="#" aria-label="English Quest início"><span class="brand-icon">eq<span>✦</span></span><span>english<span class="brand-light">quest</span></span></a><div class="side-label">SEU ESPAÇO DE PRÁTICA</div><nav>${[
    ["today", "Minha jornada"],
    ["practice", "Explorar temas"],
    ["progress", "Meu progresso"],
  ]
    .map(
      ([id, label]) =>
        `<button data-tab="${id}" class="nav-button ${tab === id ? "active" : ""}"><span>${icons[id]}</span>${label}</button>`,
    )
    .join(
      "",
    )}</nav><div class="side-note"><span>✧</span><strong>Pequenos passos.<br>Conversas maiores.</strong><p>A constância cresce com gentileza. Volte quando puder.</p></div><div class="profile"><span class="avatar">EU</span><div>Seu espaço pessoal<small>Aprendendo no seu ritmo</small></div></div></aside><main><header><span class="eyebrow">UM POUCO, TODOS OS DIAS</span><span class="level-pill">✦ Nível ${level(p.xp)} <span>· ${p.xp} XP</span></span></header>${
    tab === "today"
      ? `<section class="intro"><div class="eyebrow green">LET’S MAKE IT HAPPEN</div><h1>Sua próxima conversa<br>começa <em>aqui.</em></h1><p>Inglês para viver histórias, conhecer pessoas e abrir caminhos.</p></section><div class="dashboard"><div><section class="hero"><div class="hero-top"><span class="tag">✦ MISSÃO DO DIA</span><span>${quick ? "5" : "15"} MIN · CONVERSAÇÃO</span></div><div class="hero-art" aria-hidden="true"><span class="orbit"></span><span class="speech">Hello,<br><i>new world.</i><b>✦</b></span><span class="art-star">✧</span></div><div class="hero-content"><div class="hero-category">${t.icon} ${t.name}</div><h2>${t.title}</h2><p>Uma situação real. Algumas palavras novas.<br>E mais confiança para falar.</p><button class="button cream" id="start">${done ? "Praticar mais" : "Começar minha missão"} <span>→</span></button><div class="hero-foot">◷ No seu ritmo <span>+${quick ? 20 : 40} XP ao concluir</span></div></div></section><button class="quick-card" id="quick"><span class="quick-icon">ϟ</span><span><strong>Só tenho 5 minutinhos</strong><small>Uma conversa curta também conta.</small></span><span class="arrow">→</span></button><section class="themes"><div class="section-heading"><h2>Inglês para o seu mundo</h2><button data-tab="practice" class="text-button">Ver todos →</button></div><div class="theme-grid">${Object.entries(
          topics,
        )
          .slice(0, 3)
          .map(([id, x]) => themeCard(id, x))
          .join(
            "",
          )}</div></section></div><div class="right-column"><section class="progress-card"><div class="section-heading"><h2>Sua jornada</h2><span>✧</span></div><div class="xp-ring"><div><strong>${p.xp}</strong><span>XP CONQUISTADOS</span></div></div><div class="level-row"><strong>Nível ${level(p.xp)} · ${level(p.xp) === 1 ? "Primeiros passos" : "Novos horizontes"}</strong><span>${p.xp % 100}/100</span></div><div class="bar"><i style="width:${p.xp % 100}%"></i></div><p>Mais ${100 - (p.xp % 100)} XP para o próximo nível.<br>Cada conversa te leva um pouco além.</p><div class="week">${weekView()}</div><div class="gentle">♡ Sem pressão, sem perder progresso.</div></section><section class="voice-card"><span class="voice-icon">≋</span><span class="eyebrow">MENOS MEDO. MAIS VOZ.</span><h2>Seu inglês precisa<br>de espaço para sair.</h2><p>Pratique com o ChatGPT por voz. Erre, tente de novo e descubra seu jeito de falar.</p><button id="voice-help" class="text-button">Como funciona →</button></section></div></div>`
      : tab === "practice"
        ? `<section class="intro"><div class="eyebrow green">CONVERSAS COM PROPÓSITO</div><h1>O seu mundo,<br><em>em inglês.</em></h1><p>Escolha um tema para sua próxima missão.</p></section><div class="explore-grid">${Object.entries(
            topics,
          )
            .map(([id, x]) => themeCard(id, x))
            .join("")}</div>`
        : `<section class="intro"><div class="eyebrow green">CADA TENTATIVA CONTA</div><h1>Veja o quanto<br>você <em>já caminhou.</em></h1><p>Seu progresso fica com você, mesmo quando a rotina muda.</p></section><div class="stats"><div><strong>${p.xp}</strong> XP conquistados</div><div><strong>${p.sessions.length}</strong> conversas praticadas</div><div><strong>${new Set(p.sessions.map((s) => s.date)).size}</strong> dias de prática</div></div><h2 class="subheading">Suas conquistas</h2><div class="achievement-grid">${[
            [
              p.sessions.length >= 1,
              "✦",
              "Primeira conversa",
              "Complete sua primeira missão.",
            ],
            [
              p.sessions.length >= 5,
              "◈",
              "Voz em movimento",
              "Complete 5 missões.",
            ],
            [
              new Set(p.sessions.map((s) => s.topic)).size >= 3,
              "◎",
              "Sem fronteiras",
              "Pratique em 3 temas diferentes.",
            ],
          ]
            .map(
              ([yes, icon, title, desc]) =>
                `<article class="achievement ${yes ? "earned" : ""}"><span>${icon}</span><h3>${title}</h3><p>${desc}</p><small>${yes ? "Conquistada" : "Um passo de cada vez"}</small></article>`,
            )
            .join("")}</div><h2 class="subheading">Últimas práticas</h2>${
            p.sessions.length
              ? `<ul class="history">${p.sessions
                  .slice(-10)
                  .reverse()
                  .map(
                    (s) =>
                      `<li><span>${topics[s.topic]?.name || "Prática"} <small>${s.date.split("-").reverse().join("/")}${s.quick ? " · 5 minutos" : ""}</small></span><strong>+${s.xp} XP</strong></li>`,
                  )
                  .join("")}</ul>`
              : '<p class="muted">Sua história começa na primeira conversa. Vamos nessa?</p>'
          }`
  }<footer>Feito para ir além do “I understand, but I can’t speak”. <span>Uma conversa de cada vez. ✦</span><small>Progresso salvo apenas neste navegador. Limpar os dados do navegador apaga seu histórico.</small></footer>${storageWarning ? '<p role="alert">Não foi possível salvar neste navegador. Seu progresso pode se perder ao sair.</p>' : ""}</main><nav class="mobile-nav" aria-label="Navegação principal">${[
    ["today", "Jornada"],
    ["practice", "Temas"],
    ["progress", "Progresso"],
  ]
    .map(
      ([id, name]) =>
        `<button data-tab="${id}" class="${tab === id ? "active" : ""}"><span>${icons[id]}</span>${name}</button>`,
    )
    .join("")}</nav><dialog id="mission"></dialog><dialog id="help"></dialog>`;
  app.querySelectorAll(".history li > span").forEach((el, i) => {
    const reflection = p.sessions.slice(-10).reverse()[i]?.reflection;
    if (typeof reflection === "string" && reflection) {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = "Minha reflexão";
      const text = document.createElement("p");
      text.textContent = reflection;
      details.append(summary, text);
      el.append(details);
    }
  });
  app.querySelectorAll("[data-tab]").forEach(
    (b) =>
      (b.onclick = () => {
        tab = b.dataset.tab;
        render();
        window.scrollTo(0, 0);
      }),
  );
  app.querySelector(".brand").onclick = (e) => {
    e.preventDefault();
    tab = "today";
    render();
  };
  app.querySelectorAll("[data-topic]").forEach(
    (b) =>
      (b.onclick = () => {
        p.topic = b.dataset.topic;
        save();
        tab = "today";
        quick = false;
        render();
        window.scrollTo(0, 0);
      }),
  );
  app
    .querySelector("#start")
    ?.addEventListener("click", () => openMission(false));
  app
    .querySelector("#quick")
    ?.addEventListener("click", () => openMission(true));
  app.querySelector("#voice-help")?.addEventListener("click", () => {
    const d = document.querySelector("#help");
    d.innerHTML = `<button class="close" aria-label="Fechar">×</button><span class="eyebrow green">SUA PARCERIA DE CONVERSAÇÃO</span><h2>Do miniapp para a conversa.</h2><p>1. Inicie uma missão e copie o roteiro preparado para você.</p><p>2. Abra o ChatGPT, cole e envie o roteiro. Depois, ative o modo de voz disponível na sua conta.</p><p>3. Converse em voz alta e volte aqui para registrar sua prática.</p><p class="muted">O English Quest não acessa seu microfone nem avalia sua fala. A prática acontece separadamente no ChatGPT e depende da disponibilidade do modo de voz.</p><a class="button" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Abrir ChatGPT →</a>`;
    d.querySelector(".close").onclick = () => d.close();
    d.showModal();
  });
}
function themeCard(id, t) {
  return `<button class="theme-card ${p.topic === id ? "selected" : ""}" data-topic="${id}"><span class="theme-icon">${t.icon}</span><strong>${t.name}</strong><small>${p.topic === id ? "Tema selecionado" : "Explorar conversa"} →</small></button>`;
}
function weekView() {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - 6 + i);
    const yes = p.sessions.some((s) => s.date === localDate(d));
    return `<div class="day ${yes ? "done" : ""} ${i === 6 ? "current" : ""}"><span>${["D", "S", "T", "Q", "Q", "S", "S"][d.getDay()]}</span><b>${yes ? "✓" : d.getDate()}</b></div>`;
  }).join("");
}
function openMission(isQuick) {
  quick = isQuick;
  stage = 0;
  choice = null;
  spoken = false;
  notice = "";
  missionView();
  document.querySelector("#mission").showModal();
}
function missionView() {
  const d = document.querySelector("#mission"),
    t = topics[p.topic];
  d.innerHTML = `<button class="close" aria-label="Fechar missão">×</button><span class="eyebrow green">${quick ? "MODO 5 MINUTOS" : "MISSÃO DO DIA"} · ${t.name}</span><div class="steps"><span class="${stage === 0 ? "on" : ""}">1 Preparar</span><span class="${stage === 1 ? "on" : ""}">2 Conversar</span><span class="${stage === 2 ? "on" : ""}">3 Registrar</span></div>${stage === 0 ? `<h2>${t.title}</h2><p class="muted">${quick ? "1 minuto para se preparar, 3 para conversar e 1 para refletir." : "Leia, escute e leve estas expressões para uma conversa de verdade."}</p><div class="reading" lang="en"><p>${t.text}</p><button class="text-button" id="listen">▷ Ouvir em inglês</button><p id="audio-status" role="status"></p></div><h3>${t.question}</h3><div class="answers">${t.options.map((x, i) => `<button data-answer="${i}" class="${choice === i ? "chosen" : ""}">${x}</button>`).join("")}</div>${choice !== null ? `<p role="status" class="feedback">${choice === t.answer ? "✓ Isso mesmo!" : "Quase! Releia ou escute mais uma vez."}</p>` : ""}<button class="button" id="next" ${choice !== t.answer ? "disabled" : ""}>Preparar minha conversa →</button>` : stage === 1 ? `<h2>Agora é a sua voz.</h2><p>Copie o roteiro, envie no ChatGPT e ative o modo de voz. ${quick ? "Converse por cerca de 3 minutos." : "Tente conversar por cerca de 7 minutos."}</p><details><summary>Expressões para destravar</summary><ul lang="en">${t.lines.map((l) => `<li>${l}</li>`).join("")}</ul></details><label class="prompt-label" for="prompt">Seu roteiro de conversação</label><textarea id="prompt" readonly>${voicePrompt(t, quick)}</textarea><button class="button" id="copy">Copiar roteiro</button><p id="copy-status" role="status"></p><a class="button outline" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Abrir ChatGPT →</a><p class="muted small">A conversa acontece no ChatGPT. Volte a esta aba quando terminar. O miniapp não grava nem avalia sua voz.</p><button class="text-button" id="next">Já voltei da conversa →</button>` : `<h2>Uma conversa a mais.<br>Um pouco mais de confiança.</h2><p>Não precisa ter sido perfeito. O importante é ter tentado falar.</p><label class="check"><input id="spoken" type="checkbox" ${spoken ? "checked" : ""}> Pratiquei falando em voz alta.</label><label class="prompt-label" for="reflection">Como foi? O que quer praticar de novo? <span>(opcional)</span></label><textarea id="reflection" placeholder="Uma expressão nova, uma pequena vitória…" maxlength="500"></textarea><p class="muted small">Sua reflexão fica apenas neste navegador.</p><button class="button" id="finish" ${spoken ? "" : "disabled"}>Concluir prática · +${quick ? 20 : 40} XP</button>`}<p role="status">${notice}</p>`;
  d.querySelector(".close").onclick = () => {
    window.speechSynthesis?.cancel();
    d.close();
  };
  d.oncancel = () => window.speechSynthesis?.cancel();
  d.querySelectorAll("[data-answer]").forEach(
    (b) =>
      (b.onclick = () => {
        choice = Number(b.dataset.answer);
        window.speechSynthesis?.cancel();
        missionView();
      }),
  );
  d.querySelector("#listen")?.addEventListener("click", () => {
    const s = d.querySelector("#audio-status");
    if (!("speechSynthesis" in window)) {
      s.textContent =
        "Áudio indisponível neste navegador. Você pode ler o texto e praticá-lo no ChatGPT.";
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(t.text);
    u.lang = "en-US";
    u.rate = 0.85;
    u.onerror = () =>
      (s.textContent =
        "Não foi possível reproduzir o áudio. Tente uma voz em inglês nas configurações do aparelho ou leia o texto.");
    s.textContent = "Reproduzindo com a voz do seu dispositivo…";
    u.onend = () => (s.textContent = "Áudio concluído.");
    window.speechSynthesis.speak(u);
  });
  d.querySelector("#next")?.addEventListener("click", () => {
    window.speechSynthesis?.cancel();
    stage++;
    missionView();
  });
  d.querySelector("#copy")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(voicePrompt(t, quick));
      d.querySelector("#copy-status").textContent =
        "Roteiro copiado. Cole e envie no ChatGPT.";
    } catch {
      d.querySelector("#prompt").select();
      d.querySelector("#copy-status").textContent =
        "Selecione e copie o roteiro acima manualmente.";
    }
  });
  d.querySelector("#spoken")?.addEventListener("change", (e) => {
    spoken = e.target.checked;
    d.querySelector("#finish").disabled = !spoken;
  });
  d.querySelector("#finish")?.addEventListener("click", () => {
    if (!spoken) return;
    const date = localDate(),
      id = `${p.topic}-${quick ? "quick" : "full"}`,
      existing = p.sessions.some((s) => s.id === id && s.date === date);
    const reflection = d.querySelector("#reflection").value;
    p = complete(p, {
      id,
      date,
      topic: p.topic,
      quick,
      xp: quick ? 20 : 40,
      reflection,
    });
    save();
    d.close();
    tab = "progress";
    render();
    const msg = document.createElement("p");
    msg.className = "toast";
    msg.role = "status";
    msg.textContent = existing
      ? "Prática concluída! O XP desta missão já foi registrado hoje."
      : `Prática registrada! +${quick ? 20 : 40} XP. Sua voz está ganhando espaço.`;
    document.querySelector("main").prepend(msg);
    window.scrollTo(0, 0);
  });
}
render();
