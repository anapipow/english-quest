import { test, expect } from "@playwright/test";
const legacy = {
  xp: 40,
  topic: "festival",
  sessions: [
    {
      id: "festival-full",
      date: "2026-10-30",
      topic: "festival",
      quick: false,
      xp: 40,
      reflection: "My first interview",
    },
  ],
  achievements: ["first-conversation"],
  settings: { voice: "en-GB" },
};
const snapshot = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("english-quest")));
async function seed(page, value = legacy) {
  await page.addInitScript((value) => {
    if (localStorage.getItem("english-quest") === null)
      localStorage.setItem("english-quest", JSON.stringify(value));
    localStorage.setItem("unrelated-key", "keep");
  }, value);
}
async function nav(page, tab) {
  await page.locator(`[data-tab="${tab}"]:visible`).first().click();
}
async function library(page, mode, topic = "festival", duration = "all") {
  await nav(page, "practice");
  await page.getByLabel("Modalidade", { exact: true }).selectOption(mode);
  await page.getByLabel("Tema", { exact: true }).selectOption(topic);
  await page.getByLabel("Duração", { exact: true }).selectOption(duration);
}
async function finishVoice(page) {
  await page.getByRole("button", { name: /Preparar minha conversa/ }).click();
  await page.getByRole("button", { name: /Já voltei/ }).click();
  await expect(page.locator("#finish")).toBeDisabled();
  await page.getByLabel("Pratiquei falando").check();
  await expect(page.locator("#finish")).toBeEnabled();
  await page.locator("#finish").click();
  await expect(
    page.getByRole("heading", { name: "Você deu mais um passo." }),
  ).toBeVisible();
}
async function answerReading(page) {
  await page
    .getByRole("button", {
      name: "Por causa da previsão de chuva",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Uma conversa com a diretora", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Registrar atividade →", exact: true })
    .click();
  await expect(page.locator("#finish")).toBeVisible();
}
test("legacy data survives multiple activities, progress continuation, same-day repetition and reopening", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await seed(page);
  await page.goto("/");
  await nav(page, "progress");
  await expect(
    page.getByRole("heading", { name: "Primeira conversa" }),
  ).toBeVisible();
  await expect(page.locator(".achievement.earned")).toHaveCount(1);
  await page.getByRole("button", { name: /Continuar estudando/ }).click();
  const first = await page.locator("#mission-title").textContent();
  await finishVoice(page);
  let p = await snapshot(page);
  expect(p.xp).toBe(80);
  expect(p.sessions[0]).toEqual(legacy.sessions[0]);
  expect(p.settings).toEqual(legacy.settings);
  expect(p.achievements).toEqual(legacy.achievements);
  await page.getByRole("button", { name: "Ver meu progresso" }).click();
  await page.getByRole("button", { name: /Continuar estudando/ }).click();
  expect(await page.locator("#mission-title").textContent()).not.toBe(first);
  await finishVoice(page);
  await page
    .getByRole("button", { name: "Escolher outra", exact: true })
    .filter({ visible: true })
    .last()
    .click();
  await expect(page.getByLabel("Modalidade", { exact: true })).toBeVisible();
  await library(page, "reading", "festival", "short");
  await page
    .getByRole("button", {
      name: "Praticar: Uma sessão para todos · Reading",
      exact: true,
    })
    .click();
  await answerReading(page);
  await page.getByLabel(/Como foi/).fill("<img src=x onerror=alert(1)>");
  await page.locator("#finish").click();
  await page.getByRole("button", { name: "Ver meu progresso" }).click();
  await page.getByText("Minha reflexão").first().click();
  await expect(
    page.getByText("<img src=x onerror=alert(1)>", { exact: true }),
  ).toBeVisible();
  expect(await page.locator(".history img").count()).toBe(0);
  await library(page, "reading");
  await page
    .getByRole("button", {
      name: "Praticar: Uma sessão para todos · Reading",
      exact: true,
    })
    .click();
  await answerReading(page);
  await page.locator("#finish").click();
  await expect.poll(async () => (await snapshot(page)).xp).toBe(130);
  p = await snapshot(page);
  expect(p.xp).toBe(130);
  expect(p.sessions).toHaveLength(5);
  expect(new Set(p.sessions.map((s) => s.id)).size).toBe(5);
  await page.reload();
  const saved = await snapshot(page);
  expect(saved).toEqual(p);
  expect(await page.evaluate(() => localStorage.getItem("unrelated-key"))).toBe(
    "keep",
  );
  await nav(page, "progress");
  await expect(page.locator(".history li")).toHaveCount(5);
  expect(errors).toEqual([]);
});
test("unfinished attempt resumes after refresh, answers and reflection persist and finish cannot duplicate XP", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/");
  await library(page, "reading");
  await page
    .getByRole("button", {
      name: "Praticar: Uma sessão para todos · Reading",
      exact: true,
    })
    .click();
  await answerReading(page);
  await page.getByLabel(/Como foi/).fill("A useful new expression");
  await expect
    .poll(async () => (await snapshot(page)).activeAttempt.reflection)
    .toBe("A useful new expression");
  const id = (await snapshot(page)).activeAttempt.id;
  await page.reload();
  await page.getByRole("button", { name: /Retomar atividade/ }).click();
  await expect(page.getByLabel(/Como foi/)).toHaveValue(
    "A useful new expression",
  );
  expect((await snapshot(page)).activeAttempt.id).toBe(id);
  await page.locator("#finish").evaluate((button) => {
    button.click();
    button.click();
  });
  await expect(
    page.getByRole("heading", { name: "Você deu mais um passo." }),
  ).toBeVisible();
  expect((await snapshot(page)).xp).toBe(55);
  expect((await snapshot(page)).sessions).toHaveLength(2);
  await page.reload();
  expect((await snapshot(page)).xp).toBe(55);
  expect((await snapshot(page)).sessions).toHaveLength(2);
  await expect(
    page.getByRole("button", { name: /Retomar atividade/ }),
  ).toHaveCount(0);
});
test("all modalities, combined filters, empty state and challenge feedback are functional", async ({
  page,
}) => {
  await page.goto("/");
  await library(page, "reading", "business", "long");
  await expect(
    page.getByText("Não há atividades nessa combinação.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.locator(".activity-card")).toHaveCount(35);
  await page
    .getByLabel("Modalidade", { exact: true })
    .selectOption("challenge");
  await page.getByLabel("Tema", { exact: true }).selectOption("business");
  await page
    .getByRole("button", { name: /Praticar: Confirmar o combinado/ })
    .click();
  await page
    .getByRole("button", { name: "We has meeting tomorrow ago.", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: /Registrar atividade/ }),
  ).toBeDisabled();
  await expect(page.locator(".feedback")).toContainText("Confirmar prazo");
  await page
    .getByRole("button", {
      name: "Let me confirm the deadline and next steps.",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: /Registrar atividade/ }).click();
  await page.locator("#finish").click();
  await expect(
    page.getByRole("heading", { name: "Você deu mais um passo." }),
  ).toBeVisible();
  expect((await snapshot(page)).xp).toBe(10);
  await page
    .getByRole("button", { name: "Mais uma atividade →", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect((await snapshot(page)).activeAttempt.activityId).not.toBe(
    "business-challenge-1",
  );
});
test("listening uses device speech with stop and transcript fallback without forcing audio availability", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__spoken = [];
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        getVoices: () => [],
        cancel: () => {},
        speak: (utterance) => {
          window.__spoken.push({ text: utterance.text, lang: utterance.lang });
        },
      },
    });
  });
  await page.goto("/");
  await library(page, "listening");
  await page
    .getByRole("button", {
      name: "Praticar: Uma sessão para todos · Listening",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Ouvir em inglês", exact: true })
    .click();
  expect(await page.evaluate(() => window.__spoken.length)).toBe(1);
  await expect(page.locator("#audio-status")).toContainText("Reproduzindo");
  await page.getByRole("button", { name: "Parar áudio", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Ouvir em inglês", exact: true }),
  ).toBeEnabled();
  await page.getByText("Mostrar transcrição", { exact: true }).click();
  await expect(page.locator(".transcript p")).toBeVisible();
  await answerReading(page);
  await page.locator("#finish").click();
  await expect(
    page.getByRole("heading", { name: "Você deu mais um passo." }),
  ).toBeVisible();
  expect((await snapshot(page)).xp).toBe(25);
});
test("unsupported audio and unavailable clipboard have honest, usable fallback", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "speechSynthesis", { value: undefined });
    Object.defineProperty(navigator, "clipboard", { value: undefined });
  });
  await page.goto("/");
  await library(page, "listening");
  await page
    .getByRole("button", {
      name: "Praticar: Uma sessão para todos · Listening",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Ouvir em inglês", exact: true })
    .click();
  await expect(page.locator("#audio-status")).toContainText(
    "Áudio indisponível",
  );
  await page.getByRole("button", { name: "Fechar atividade" }).click();
  await nav(page, "today");
  await page.getByRole("button", { name: /Só tenho 5/ }).click();
  await page.getByRole("button", { name: /Preparar minha conversa/ }).click();
  await page.getByRole("button", { name: "Copiar roteiro" }).click();
  await expect(page.locator("#copy-status")).toContainText("manualmente");
  await expect(page.locator("#prompt")).toHaveValue(/3 minutes/);
  await expect(
    page.getByRole("link", { name: /Abrir ChatGPT/ }),
  ).toHaveAttribute("href", "https://chatgpt.com/");
});
test("two tabs completing the same resumed attempt cannot award XP twice", async ({
  page,
  context,
}) => {
  await seed(page);
  await page.goto("/");
  await library(page, "reading");
  await page
    .getByRole("button", {
      name: "Praticar: Uma sessão para todos · Reading",
      exact: true,
    })
    .click();
  await answerReading(page);
  const second = await context.newPage();
  await second.goto("/");
  await second.getByRole("button", { name: /Retomar atividade/ }).click();
  await Promise.all([
    page.locator("#finish").click(),
    second.locator("#finish").click(),
  ]);
  await expect.poll(async () => (await snapshot(page)).sessions.length).toBe(2);
  expect((await snapshot(page)).xp).toBe(55);
  await second.close();
});
test("corrupt preexisting data and storage failures are never overwritten or reported as successful", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("english-quest", "do not erase"),
  );
  await page.goto("/");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: /Só tenho 5/ }).click();
  expect(await page.evaluate(() => localStorage.getItem("english-quest"))).toBe(
    "do not erase",
  );
  await expect(page.getByRole("dialog")).not.toBeVisible();
});
test("320, 390 and 768 px: home, library, activity and progress have no horizontal overflow", async ({
  page,
}) => {
  await seed(page);
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    for (const tab of ["today", "practice", "progress"]) {
      await nav(page, tab);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      await page.screenshot({
        path: `test-results/${test.info().project.name}-${tab}-${width}.png`,
        fullPage: tab !== "practice",
      });
    }
    await page.getByRole("button", { name: /Continuar estudando/ }).click();
    expect(
      await page
        .locator("#mission")
        .evaluate((d) => d.scrollWidth <= d.clientWidth),
    ).toBeTruthy();
    await page.getByRole("button", { name: "Fechar atividade" }).click();
  }
});

test("quota failure at completion preserves saved data and does not show success", async ({
  page,
}) => {
  await seed(page);
  await page.goto("/");
  await library(page, "reading");
  await page
    .getByRole("button", {
      name: "Praticar: Uma sessão para todos · Reading",
      exact: true,
    })
    .click();
  await answerReading(page);
  const before = await snapshot(page);
  await page.evaluate(() => {
    Storage.prototype.setItem = function () {
      throw new DOMException("Storage is full", "QuotaExceededError");
    };
  });
  await page.locator("#finish").click();
  await expect(page.locator("#mission-error")).toContainText("mantidos");
  await expect(
    page.getByRole("heading", { name: "Você deu mais um passo." }),
  ).toHaveCount(0);
  expect(await snapshot(page)).toEqual(before);
});
