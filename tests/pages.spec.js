import { test, expect } from "@playwright/test";
test("production build works at the GitHub Pages subpath and preserves existing progress", async ({
  page,
}) => {
  const failures = [];
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()} ${response.url()}`);
  });
  await page.addInitScript(() => {
    localStorage.setItem(
      "english-quest",
      JSON.stringify({
        xp: 40,
        topic: "festival",
        sessions: [
          {
            id: "festival-full",
            topic: "festival",
            date: "2026-10-30",
            xp: 40,
            reflection: "Keep this memory",
          },
        ],
      }),
    );
  });
  const response = await page.goto("./");
  expect(response.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/english-quest/");
  await expect(
    page.getByRole("heading", { name: /Sua próxima conversa/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        !!Array.from(document.styleSheets).find((s) =>
          s.href?.includes("/english-quest/assets/"),
        ),
    ),
  ).toBeTruthy();
  await page.locator('[data-tab="practice"]:visible').first().click();
  await page
    .getByLabel("Modalidade", { exact: true })
    .selectOption("challenge");
  await page.getByLabel("Tema", { exact: true }).selectOption("festival");
  await page
    .getByRole("button", { name: /Praticar: Um contato gentil/ })
    .click();
  await page
    .getByRole("button", {
      name: "May I send you a short summary?",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: /Registrar atividade/ }).click();
  await page.locator("#finish").click();
  await expect(
    page.getByRole("heading", { name: "Você deu mais um passo." }),
  ).toBeVisible();
  const p = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("english-quest")),
  );
  expect(p.xp).toBe(50);
  expect(p.sessions[0].reflection).toBe("Keep this memory");
  expect(p.sessions).toHaveLength(2);
  expect(failures).toEqual([]);
});
