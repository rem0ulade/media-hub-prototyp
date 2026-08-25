import { expect, test } from "@playwright/test";

const DEMO_URL =
  process.env.VANTURA_DEMO_URL ?? "http://localhost:3000/de/reporting/demo/";

test.describe("vantura public demo", () => {
  test.use({ baseURL: undefined });

  test("Demo starten logs in without a password", async ({ page }) => {
    test.skip(
      process.env.VANTURA_DEMO !== "1",
      "set VANTURA_DEMO=1 to verify the vantura embed",
    );

    await page.goto(DEMO_URL);
    const demo = page.frameLocator("iframe").first();

    await expect(
      demo.getByRole("button", { name: /Demo starten|Start demo/i }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(demo.getByLabel(/Passwort|Password/i)).toHaveCount(0);
    await expect(demo.getByText("MediaHub-Demo-7xK2mQ")).toHaveCount(0);
    await expect(demo.getByText("MediaHub-Editor-7xK2mQ")).toHaveCount(0);
    await expect(demo.getByText("MediaHub-Viewer-7xK2mQ")).toHaveCount(0);

    await demo
      .getByRole("button", { name: /Demo starten|Start demo/i })
      .click();

    const skipOnboarding = demo.getByRole("button", {
      name: /Überspringen|Skip/i,
    });
    if (await skipOnboarding.isVisible({ timeout: 8_000 }).catch(() => false)) {
      await skipOnboarding.click();
    }

    await expect(
      demo.getByRole("heading", {
        name: /Management-Übersicht|Management Summary/,
      }),
    ).toBeVisible({ timeout: 10_000 });
  });
});
