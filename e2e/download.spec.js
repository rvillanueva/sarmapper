import { test, expect } from "@playwright/test";

test("can download GPX", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Export").click();
  await page.waitForTimeout(2000);

  const downloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Download GPX" }).click();
  const download = await downloadPromise;
  // Wait for the download process to complete and save the downloaded file somewhere.
  await download.saveAs("temp/" + download.suggestedFilename());
});

test("can download KML", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Export").click();
  await page.waitForTimeout(2000);
  const downloadPromise = page.waitForEvent("download");

  await page.getByRole("button", { name: "Download KML" }).click();
  const download = await downloadPromise;
  // Wait for the download process to complete and save the downloaded file somewhere.
  await download.saveAs("temp/" + download.suggestedFilename());
});
