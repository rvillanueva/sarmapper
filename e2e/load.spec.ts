import { test, expect } from "@playwright/test";

test("page loads and has title", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Lost Person Behavior Mapper")).toBeVisible();
});
