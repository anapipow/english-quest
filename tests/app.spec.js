import { test, expect } from "@playwright/test";
test("oral practice, reflection, persistence and duplicate protection", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Sua próxima conversa/ }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: /Só tenho 5/ }).click();
  await page
    .getByRole("button", { name: "Na cidade onde cresceu", exact: true })
    .click();
  await page.getByRole("button", { name: /Preparar minha/ }).click();
  await expect(page.locator("#prompt")).toHaveValue(/filmmaker.*3 minutes/);
  await expect(
    page.getByRole("link", { name: /Abrir ChatGPT/ }),
  ).toHaveAttribute("href", "https://chatgpt.com/");
  await page.getByRole("button", { name: /Já voltei/ }).click();
  await expect(
    page.getByRole("button", { name: /Concluir prática/ }),
  ).toBeDisabled();
  await page.getByLabel("Pratiquei falando").check();
  await page.getByLabel(/Como foi/).fill("<img src=x onerror=alert(1)>");
  await page.getByRole("button", { name: /Concluir prática/ }).click();
  await expect(
    page.getByRole("heading", { name: "Primeira conversa" }),
  ).toBeVisible();
  await page.getByText("Minha reflexão").click();
  await expect(
    page.getByText("<img src=x onerror=alert(1)>", { exact: true }),
  ).toBeVisible();
  expect(await page.locator(".history img").count()).toBe(0);
  await page.reload();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("english-quest")).xp,
    ),
  ).toBe(20);
  await page.locator('[data-tab="today"]:visible').first().click();
  await page.getByRole("button", { name: /Só tenho 5/ }).click();
  await page
    .getByRole("button", { name: "Na cidade onde cresceu", exact: true })
    .click();
  await page.getByRole("button", { name: /Preparar minha/ }).click();
  await page.getByRole("button", { name: /Já voltei/ }).click();
  await page.getByLabel("Pratiquei falando").check();
  await page.getByRole("button", { name: /Concluir prática/ }).click();
  await expect(page.getByRole("status")).toContainText("já foi registrado");
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("english-quest")).xp,
    ),
  ).toBe(20);
  expect(errors).toEqual([]);
});
test("all topics accessible and wrong answers cannot advance", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('[data-tab="practice"]:visible').first().click();
  await page.getByRole("button", { name: /Negócios internacionais/ }).click();
  await page.getByRole("button", { name: /Começar minha missão/ }).click();
  await page
    .getByRole("button", { name: "Uma campanha global", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: /Preparar minha/ }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Uma avaliação do piloto", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: /Preparar minha/ }),
  ).toBeEnabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.getByRole("button", { name: "Fechar missão" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.screenshot({
    path: `test-results/${test.info().project.name}.png`,
    fullPage: true,
  });
});

test("responsive home at narrow mobile, mobile and tablet widths", async ({
  page,
}) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /Começar minha missão/ }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.screenshot({
      path: `test-results/home-${test.info().project.name}-${width}.png`,
      fullPage: true,
    });
  }
});
