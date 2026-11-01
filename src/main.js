import { ensureDailyPlan, nextActivity } from "./study-plan.js";
import "./style.css";
import { topics } from "./content.js";
import { activities, modes, activityPrompt } from "./activities.js";
import {
  readProgress,
  writeProgress,
  complete,
  level,
  localDate,
} from "./progress.js";
import {
  homeView,
  libraryView,
  progressView,
  escapeHTML as e,
} from "./views.js";
let storage;
try {
  storage = window.localStorage;
} catch {}
let { progress: p, error: storageError } = readProgress(storage);
let tab = "today",
  filters = { topic: "all", mode: "all", duration: "all" },
  attempt = null,
  toast = "",
  busy = false,
  audioPlaying = false;
const app = document.querySelector("#app");
// All tabs use the same lock when supported. Reads and writes inside the lock
// are synchronous; every update starts from the latest stored legacy-compatible data.
async function update(transform) {
  const work = () => {
    p = writeProgress(storage, (latest) => ensureDailyPlan(transform(latest)));
    storageError = "";
    return p;
  };
  try {
    return await (navigator.locks
      ? navigator.locks.request("english-quest-progress", work)
      : work());
  } catch (error) {
    storageError = error.message || "Não foi possível salvar neste navegador.";
    throw error;
  }
}
const validAttempt = (x) =>
  x &&
  typeof x.id === "string" &&
  activities.some((a) => a.id === x.activityId) &&
  [0, 1, 2].includes(x.phase) &&
  Array.isArray(x.answers);
function render(focusHeading = false) {
  const nav = [
    ["today", "Jornada", "⌂"],
    ["practice", "Praticar", "◌"],
    ["progress", "Progresso", "▥"],
  ];
  app.innerHTML = `<aside class="sidebar"><a class="brand" href="#" aria-label="English Quest início"><span class="brand-icon">eq<span>✦</span></span><span>english<span class="brand-light">quest</span></span></a><div class="side-label">SEU ESPAÇO DE PRÁTICA</div><nav>${nav.map(([id, label, icon]) => `<button data-tab="${id}" class="nav-button ${tab === id ? "active" : ""}" ${tab === id ? 'aria-current="page"' : ""}><span aria-hidden="true">${icon}</span>${label}</button>`).join("")}</nav><div class="side-note"><span>✧</span><strong>Pequenos passos.<br>Conversas maiores.</strong><p>A constância cresce com gentileza. Volte quando puder.</p></div><div class="profile"><span class="avatar">EU</span><div>Seu espaço pessoal<small>Aprendendo no seu ritmo</small></div></div></aside><main><header><span class="eyebrow">UM POUCO, TODOS OS DIAS</span><span class="level-pill">✦ Nível ${level(p.xp)} <span>· ${p.xp} XP</span></span></header>${toast ? `<p class="toast" role="status">${e(toast)}</p>` : ""}${storageError ? `<p class="storage-error" role="alert">${e(storageError)} Não apagamos seus dados. Novas práticas só serão registradas quando for possível salvar.</p>` : ""}${tab === "today" ? homeView(p) : tab === "practice" ? libraryView(filters) : progressView(p)}<footer>Feito para ir além do “I understand, but I can’t speak”. <span>Uma conversa de cada vez. ✦</span><small>Progresso salvo apenas neste navegador. Limpar os dados do navegador apaga seu histórico.</small></footer></main><nav class="mobile-nav" aria-label="Navegação principal">${nav.map(([id, label, icon]) => `<button data-tab="${id}" class="${tab === id ? "active" : ""}" ${tab === id ? 'aria-current="page"' : ""}><span aria-hidden="true">${icon}</span>${label}</button>`).join("")}</nav><dialog id="mission" aria-labelledby="mission-title"></dialog><dialog id="help" aria-labelledby="help-title"></dialog>`;
  app
    .querySelectorAll("[data-tab]")
    .forEach((b) => (b.onclick = () => navigate(b.dataset.tab)));
  app.querySelector(".brand").onclick = (event) => {
    event.preventDefault();
    navigate("today");
  };
  app
    .querySelectorAll("[data-activity]")
    .forEach((b) => (b.onclick = () => openActivity(b.dataset.activity)));
  app.querySelectorAll("[data-topic]").forEach(
    (b) =>
      (b.onclick = async () => {
        try {
          await update((latest) => ({ ...latest, topic: b.dataset.topic }));
          render();
        } catch {
          render();
        }
      }),
  );
  app
    .querySelector("#continue")
    ?.addEventListener("click", () => startNextActivity());
  app.querySelector("#resume")?.addEventListener("click", () => {
    if (validAttempt(p.activeAttempt)) openActivity(p.activeAttempt.activityId);
    else {
      toast =
        "Esta prática não está disponível nesta versão. Seus dados foram mantidos.";
      render();
    }
  });
  for (const key of ["mode", "topic", "duration"])
    app.querySelector(`#filter-${key}`)?.addEventListener("change", (event) => {
      filters[key] = event.target.value;
      render();
      app.querySelector(`#filter-${key}`).focus();
    });
  app.querySelector("#reset-filters")?.addEventListener("click", () => {
    filters = { topic: "all", mode: "all", duration: "all" };
    render();
  });
  app.querySelector("#voice-help")?.addEventListener("click", showHelp);
  if (focusHeading) {
    const heading = app.querySelector("h1");
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  }
}
function navigate(next) {
  stopAudio();
  tab = next;
  toast = "";
  render(true);
  window.scrollTo(0, 0);
}
async function openActivity(id, { fresh = false } = {}) {
  if (!activities.some((a) => a.id === id)) return;
  if (busy) return;
  busy = true;
  stopAudio();
  try {
    await update((latest) => {
      const drafts = { ...latest.practiceDrafts };
      if (
        validAttempt(latest.activeAttempt) &&
        latest.activeAttempt.activityId !== id
      )
        drafts[latest.activeAttempt.activityId] = latest.activeAttempt;
      const draft =
        latest.activeAttempt?.activityId === id
          ? latest.activeAttempt
          : drafts[id];
      const next =
        !fresh &&
        validAttempt(draft) &&
        !latest.sessions.some((s) => s?.id === draft.id)
          ? draft
          : {
              id:
                crypto.randomUUID?.() ||
                Array.from(crypto.getRandomValues(new Uint32Array(4)), (n) =>
                  n.toString(16).padStart(8, "0"),
                ).join(""),
              activityId: id,
              phase: 0,
              answers: [],
              spoken: false,
              reflection: "",
              startedAt: new Date().toISOString(),
            };
      attempt = next;
      delete drafts[id];
      return { ...latest, activeAttempt: next, practiceDrafts: drafts };
    });
    missionView();
    document.querySelector("#mission").showModal();
  } catch {
    render();
  } finally {
    busy = false;
  }
}
async function patchAttempt(patch) {
  const id = attempt.id;
  await update((latest) => {
    if (latest.sessions.some((s) => s?.id === id))
      throw new Error(
        "Esta prática já foi registrada. Feche e escolha uma nova atividade.",
      );
    if (latest.activeAttempt?.id !== id)
      throw new Error(
        "Outra atividade foi aberta em outra aba. Feche e retome pela Jornada.",
      );
    attempt = { ...latest.activeAttempt, ...patch };
    return { ...latest, activeAttempt: attempt };
  });
}
function stopAudio() {
  audioPlaying = false;
  window.speechSynthesis?.cancel();
  const button = document.querySelector("#listen");
  if (button) button.disabled = false;
}
function showHelp() {
  const d = document.querySelector("#help");
  d.innerHTML =
    '<button class="close" aria-label="Fechar">×</button><span class="eyebrow green">SUA PARCERIA DE CONVERSAÇÃO</span><h2 id="help-title">Do miniapp para a conversa.</h2><p>1. Abra uma atividade de Conversação e copie o roteiro.</p><p>2. Abra o ChatGPT, cole e envie o roteiro. Ative o modo de voz disponível na sua conta.</p><p>3. Converse em voz alta. Depois volte aqui e registre sua prática.</p><p class="muted">O English Quest não acessa seu microfone nem avalia sua fala. A conversa acontece separadamente no ChatGPT e depende dos limites e da disponibilidade do modo de voz. Listening usa a voz do dispositivo; pode exigir uma voz em inglês instalada.</p><a class="button" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Abrir ChatGPT →</a>';
  d.querySelector(".close").onclick = () => d.close();
  d.showModal();
}
function missionView(focus = false) {
  const a = activities.find((x) => x.id === attempt.activityId),
    d = document.querySelector("#mission"),
    isVoice = a.mode === "conversation",
    phase = attempt.phase;
  const questions = a.questions || [],
    correct = questions.every((q, i) => attempt.answers[i] === q.answer);
  const heading =
    phase === 0
      ? a.title
      : phase === 1
        ? "Agora é a sua voz."
        : "Uma prática a mais. Um pouco mais de confiança.";
  d.innerHTML = `<button class="close" aria-label="Fechar atividade">×</button><span class="eyebrow green">${modes[a.mode].name} · ${topics[a.topic].name}</span><div class="steps"><span class="${phase === 0 ? "on" : ""}">1 ${isVoice ? "Preparar" : "Praticar"}</span>${isVoice ? `<span class="${phase === 1 ? "on" : ""}">2 Conversar</span>` : ""}<span class="${phase === 2 ? "on" : ""}">${isVoice ? 3 : 2} Registrar</span></div><h2 id="mission-title" tabindex="-1">${heading}</h2><p class="muted small">A2–B1 · ${a.minutes} min estimados · +${a.xp} XP ao concluir</p>${phase === 0 ? (isVoice ? `<p>Imagine esta situação. Leia as expressões abaixo e experimente dizê-las em voz alta.</p><div class="reading" lang="en"><p>${a.situation}</p><ul>${a.lines.map((l) => `<li>${l}</li>`).join("")}</ul></div><p class="muted small">${a.minutes === 5 ? "1 minuto para preparar, 3 para conversar e 1 para refletir." : "Reserve cerca de 7 minutos para a conversa. O restante é para preparar e refletir."}</p><button class="button" id="next">Preparar minha conversa →</button>` : `${a.mode === "listening" ? `<p>Escute a mensagem e responda às perguntas. Pode ouvir quantas vezes quiser.</p><div class="audio-controls"><button class="button" id="listen">Ouvir em inglês</button><button class="text-button" id="stop-audio">Parar áudio</button></div><p id="audio-status" role="status"></p><p class="muted small">Áudio sintetizado pelo dispositivo, não uma gravação humana. Sem áudio? Use a transcrição para continuar.</p><details class="transcript" ${attempt.transcriptOpen ? "open" : ""}><summary>Mostrar transcrição</summary><p lang="en">${a.text}</p></details>` : a.mode === "reading" ? `<div class="reading" lang="en"><p>${a.text}</p></div>` : "<p>Escolha a frase que melhor funciona nesta situação. O feedback explica o porquê.</p>"}<div class="questions">${questions.map((q, qi) => `<section class="question" aria-labelledby="question-${qi}"><h3 id="question-${qi}">${qi + 1}. ${q.question}</h3><div class="answers">${q.options.map((option, i) => `<button data-question="${qi}" data-answer="${i}" aria-pressed="${attempt.answers[qi] === i}" class="${attempt.answers[qi] === i ? "chosen" : ""}">${option}</button>`).join("")}</div>${Number.isInteger(attempt.answers[qi]) ? `<p class="feedback" role="status">${attempt.answers[qi] === q.answer ? "✓ Isso mesmo! " + q.explanation : "Tente mais uma vez. " + (a.mode === "challenge" ? q.explanation : "Procure no texto a informação desta pergunta.")}</p>` : ""}</section>`).join("")}</div><button class="button" id="next" ${correct ? "" : "disabled"}>Registrar atividade →</button>`) : phase === 1 ? `<p>Copie o roteiro, envie no ChatGPT e ative o modo de voz. Converse por cerca de ${a.minutes === 5 ? 3 : 7} minutos, sem pressa.</p><label class="prompt-label" for="prompt">Seu roteiro de conversação</label><textarea id="prompt" lang="en" readonly>${activityPrompt(a)}</textarea><button class="button" id="copy">Copiar roteiro</button><p id="copy-status" role="status"></p><a class="button outline" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">Abrir ChatGPT →</a><p class="muted small">Volte a esta aba quando terminar. O miniapp não grava nem avalia sua voz. Se o modo de voz estiver indisponível, você pode praticar falando as respostas em voz alta.</p><button class="text-button" id="next">Já voltei da conversa →</button>` : `<p>${isVoice ? "Não precisa ter sido perfeito. O importante é ter tentado falar." : "Você concluiu as perguntas. Leve uma expressão nova para a próxima conversa."}</p>${isVoice ? `<label class="check"><input id="spoken" type="checkbox" ${attempt.spoken ? "checked" : ""}> Pratiquei falando em voz alta.</label>` : ""}<label class="prompt-label" for="reflection">Como foi? O que quer praticar de novo? <span>(opcional)</span></label><textarea id="reflection" maxlength="500" placeholder="Uma expressão nova, uma pequena vitória…">${e(attempt.reflection || "")}</textarea><p class="muted small">Sua reflexão fica apenas neste navegador.</p><button class="button" id="finish" ${isVoice && !attempt.spoken ? "disabled" : ""}>Concluir prática · +${a.xp} XP</button>`}<p id="mission-error" role="alert"></p>`;
  const safe = (fn) => async (event) => {
    try {
      await fn(event);
    } catch {
      if (d.querySelector("#mission-error"))
        d.querySelector("#mission-error").textContent =
          `${storageError} Seus dados anteriores foram mantidos. Tente novamente antes de sair.`;
    }
  };
  d.querySelector(".close").onclick = () => {
    stopAudio();
    d.close();
    render();
  };
  d.oncancel = () => {
    stopAudio();
    setTimeout(() => render(), 0);
  };
  d.querySelectorAll("[data-answer]").forEach(
    (b) =>
      (b.onclick = safe(async () => {
        if (busy) return;
        busy = true;
        try {
          const answers = [...attempt.answers];
          answers[Number(b.dataset.question)] = Number(b.dataset.answer);
          await patchAttempt({ answers });
          missionView();
          d.querySelector(
            `[data-question="${b.dataset.question}"][data-answer="${b.dataset.answer}"]`,
          ).focus();
        } finally {
          busy = false;
        }
      })),
  );
  d.querySelector(".transcript")?.addEventListener(
    "toggle",
    safe(async (event) => {
      if (attempt.transcriptOpen !== event.target.open)
        await patchAttempt({ transcriptOpen: event.target.open });
    }),
  );
  d.querySelector("#next")?.addEventListener(
    "click",
    safe(async () => {
      if (busy) return;
      if (!isVoice && !correct) return;
      busy = true;
      try {
        stopAudio();
        await patchAttempt({ phase: phase === 0 && isVoice ? 1 : 2 });
        missionView(true);
      } finally {
        busy = false;
      }
    }),
  );
  d.querySelector("#copy")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(activityPrompt(a));
      d.querySelector("#copy-status").textContent =
        "Roteiro copiado. Cole e envie no ChatGPT.";
    } catch {
      d.querySelector("#prompt").select();
      d.querySelector("#copy-status").textContent =
        "Selecione e copie o roteiro acima manualmente.";
    }
  });
  d.querySelector("#spoken")?.addEventListener(
    "change",
    safe(async (event) => {
      const checked = event.target.checked;
      d.querySelector("#finish").disabled = true;
      await patchAttempt({ spoken: checked });
      d.querySelector("#finish").disabled = !attempt.spoken;
    }),
  );
  d.querySelector("#reflection")?.addEventListener(
    "input",
    safe(async (event) => {
      await patchAttempt({ reflection: event.target.value });
    }),
  );
  d.querySelector("#finish")?.addEventListener(
    "click",
    safe(() => finishActivity(a)),
  );
  d.querySelector("#listen")?.addEventListener("click", () => playAudio(a, d));
  d.querySelector("#stop-audio")?.addEventListener("click", () => {
    stopAudio();
    d.querySelector("#audio-status").textContent =
      "Áudio parado. Você pode ouvir novamente.";
  });
  if (focus) d.querySelector("#mission-title").focus();
}
function playAudio(a, d) {
  const status = d.querySelector("#audio-status");
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    status.textContent =
      "Áudio indisponível neste navegador. Abra a transcrição para continuar.";
    return;
  }
  stopAudio();
  audioPlaying = true;
  const utterance = new SpeechSynthesisUtterance(a.text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => /^en[-_]/i.test(v.lang));
  if (voice) utterance.voice = voice;
  const button = d.querySelector("#listen");
  button.disabled = true;
  status.textContent = "Reproduzindo com a voz do dispositivo…";
  const ended = (message) => {
    if (!audioPlaying) return;
    audioPlaying = false;
    button.disabled = false;
    status.textContent = message;
  };
  utterance.onend = () => ended("Áudio concluído. Pode ouvir novamente.");
  utterance.onerror = () =>
    ended(
      "Não foi possível reproduzir. Verifique a voz em inglês do aparelho ou abra a transcrição.",
    );
  try {
    window.speechSynthesis.speak(utterance);
  } catch {
    ended("Não foi possível reproduzir. Abra a transcrição para continuar.");
  }
  // A new click after stopping should always be possible, even if cancellation
  // does not emit an end event on the Android speech engine.
  d.querySelector("#stop-audio").onclick = () => {
    stopAudio();
    button.disabled = false;
    status.textContent = "Áudio parado. Você pode ouvir novamente.";
  };
}
async function finishActivity(a) {
  if (busy || !attempt || attempt.phase !== 2) return;
  if (a.mode === "conversation" && !attempt.spoken) return;
  if (
    a.questions &&
    !a.questions.every((q, i) => attempt.answers[i] === q.answer)
  )
    return;
  busy = true;
  const finished = attempt;
  let awarded = false;
  const reflection = document.querySelector("#reflection").value;
  document.querySelector("#finish").disabled = true;
  try {
    await update((latest) => {
      const already = latest.sessions.some((s) => s?.id === finished.id);
      if (already) return latest;
      if (latest.activeAttempt?.id !== finished.id)
        throw new Error(
          "Esta atividade mudou em outra aba. Retome pela Jornada.",
        );
      awarded = true;
      const next = complete(latest, {
        id: finished.id,
        activityId: a.id,
        date: localDate(),
        topic: a.topic,
        mode: a.mode,
        minutes: a.minutes,
        quick: a.minutes === 5,
        xp: a.xp,
        reflection,
      });
      return { ...next, activeAttempt: null };
    });
    stopAudio();
    attempt = null;
    tab = "progress";
    toast = awarded
      ? `Prática registrada! Seu progresso está salvo. +${a.xp} XP por esta atividade.`
      : "Esta prática já foi registrada em outra aba. Seu XP foi mantido, sem duplicação.";
    render(true);
    window.scrollTo(0, 0);
    showCompletion(a, awarded);
  } finally {
    busy = false;
    document.querySelector("#finish")?.removeAttribute("disabled");
  }
}
function showCompletion(a, awarded = true) {
  const d = document.querySelector("#mission");
  d.innerHTML = `<button class="close" aria-label="Fechar conclusão">×</button><span class="eyebrow green">CADA PRÁTICA CONTA</span><h2 id="mission-title">Você deu mais um passo.</h2><p>${awarded ? `+${a.xp} XP registrados.` : "Prática já registrada. Nenhum XP duplicado."} Quer continuar ou deixar a próxima para outro dia?</p><button class="button" id="more">Mais uma atividade →</button><button class="button outline" id="choose">Escolher outra</button><button class="text-button" id="see-progress">Ver meu progresso</button>`;
  d.querySelector(".close").onclick = d.querySelector("#see-progress").onclick =
    () => {
      d.close();
      app.querySelector("#continue").focus();
    };
  d.querySelector("#more").onclick = () => {
    d.close();
    startNextActivity(a.id);
  };
  d.querySelector("#choose").onclick = () => {
    d.close();
    navigate("practice");
  };
  d.showModal();
}
window.addEventListener("storage", (event) => {
  if (event.key !== "english-quest") return;
  const snapshot = readProgress(storage);
  p = snapshot.progress;
  storageError = snapshot.error;
  if (!document.querySelector("#mission")?.open) render();
});
window.addEventListener("pagehide", stopAudio);
async function startNextActivity(previousId = p.sessions.at(-1)?.activityId) {
  const snapshot = readProgress(storage);
  if (!snapshot.error) p = snapshot.progress;
  const next = nextActivity(p, previousId);
  if (next) await openActivity(next.id, { fresh: true });
}
let refreshing = false;
async function refreshPlan() {
  if (refreshing || busy) return;
  refreshing = true;
  try {
    const before = JSON.stringify(p.dailyPlan);
    await update((latest) => latest);
    if (
      before !== JSON.stringify(p.dailyPlan) &&
      !document.querySelector("dialog[open]")
    )
      render();
  } catch {
    if (!document.querySelector("dialog[open]")) render();
  } finally {
    refreshing = false;
  }
}
// Timers cover a tab left open at midnight; focus/visibility cover suspended phones.
setInterval(refreshPlan, 15000);
window.addEventListener("focus", refreshPlan);
window.addEventListener("pageshow", refreshPlan);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) refreshPlan();
});
render();
refreshPlan();
