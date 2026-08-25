import { expect, test } from "@playwright/test";
import { BASE_DEMO_ACCOUNTS } from "../shared/demo-credentials";

const PRIMARY_DEMO = BASE_DEMO_ACCOUNTS[0];

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("login");
  const userField = page.getByLabel(/E-Mail|Email|Benutzername|Username/i);
  await expect(userField).toBeVisible();
  await userField.clear();
  await userField.fill(PRIMARY_DEMO.username);
  const passField = page.getByLabel(/Passwort|Password/i);
  await passField.clear();
  await passField.fill(PRIMARY_DEMO.password);
  await page
    .getByRole("button", { name: /Anmelden|Sign in|Demo starten|Start demo/i })
    .click();
  const skipOnboarding = page.getByRole("button", {
    name: /Überspringen|Skip/i,
  });
  await expect(skipOnboarding).toBeVisible({ timeout: 10_000 });
  await skipOnboarding.click();
  await expect(
    page.getByRole("heading", {
      name: /Management-Übersicht|Management Summary/,
    }),
  ).toBeVisible({ timeout: 10_000 });
}

test("login with demo credentials", async ({ page }) => {
  await signIn(page);
  await expect(
    page.getByRole("heading", {
      name: /Management-Übersicht|Management Summary/,
    }),
  ).toBeVisible();
  await expect(page.getByText("Weischer")).toHaveCount(0);
  await expect(page.getByText("Vergütung")).toHaveCount(0);
  await expect(page.getByText("Added Value")).toHaveCount(0);
  await expect(page.getByText("IO & Programmatic")).toHaveCount(0);
  await expect(page.getByText("7,67 Mio. €").first()).toBeVisible();
  await expect(page.getByText("Partner-Fee gesamt")).toBeVisible();
  await expect(page.getByText(/Stand: 24\. August 2026/)).toBeVisible();
  await page
    .getByRole("button", { name: /Nur Demo-Zahlen|Demo figures only/ })
    .hover();
  await expect(page.getByText(/rein fiktiv|purely fictional/)).toBeVisible();
  await page.screenshot({
    path: "test-results/demo-desktop-dashboard.png",
    fullPage: true,
  });
});

test("partner, contracts and scorecard use generic labels", async ({
  page,
}) => {
  await signIn(page);
  await page
    .getByRole("link", { name: /^Partner/ })
    .first()
    .click();
  await expect(page.getByRole("heading", { name: /^Partner$/ })).toBeVisible();
  await expect(page.getByText("Partner-Fee")).toBeVisible();
  await expect(page.getByText("Zusatzleistungen")).toBeVisible();
  await expect(page.getByText("Payrate")).toHaveCount(0);

  await page.getByRole("link", { name: /Verträge|Contracts/ }).click();
  await expect(
    page.getByText(/Vertragsmanagement|Contract Management/),
  ).toBeVisible();

  await page.getByRole("link", { name: /Scorecard|Score Card/ }).click();
  await expect(
    page.getByRole("heading", { name: /Partner Scorecard/ }),
  ).toBeVisible();
  await expect(page.getByText("Horizon Group").first()).toBeVisible();
  await expect(page.getByText("8 Jahre").first()).toBeVisible();
  await expect(page.getByText("Share of Wallet").first()).toBeVisible();
});

test("mobile nav has four primary items plus more", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signIn(page);
  await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Partner" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Mehr" })).toBeVisible();
  await page.getByRole("button", { name: "Mehr" }).click();
  await expect(
    page.getByRole("menuitem", { name: /Archiv|Archive/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("menuitem", { name: /Abmelden|Sign out/ }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/demo-mobile-mehr.png",
    fullPage: true,
  });
});
