import { test, expect, type Page } from "@playwright/test";

// Increase test timeout to 60 seconds
test.setTimeout(60000);

test("the modal should close when pressing the ESC key", async ({
  page,
  context,
}: {
  page: Page;
  context: any;
}) => {
  let currentStep = "starting";

  try {
    console.log("Starting test...");
    currentStep = "navigation";

    // Use hardcoded URL for CI, localhost for local development
    const url = process.env.CI
      ? "https://samsales.pro"
      : "http://localhost:3000";

    console.log("Navigating to:", url);
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");
    console.log("Page loaded");

    // Wait for header navigation to be interactive
    await page.waitForSelector("nav", { state: "visible" });
    console.log("Navigation visible");

    // Look for the button within the navigation
    currentStep = "button-search";
    console.log("Looking for Let's talk button...");

    // Try multiple selectors to find the button
    const talkButton = page
      .locator("a, button")
      .filter({ hasText: /let's talk/i })
      .first();

    // Wait for button to be visible and clickable
    console.log("Waiting for button to be visible...");
    await expect(talkButton).toBeVisible({ timeout: 30000 });
    await expect(talkButton).toBeEnabled();

    currentStep = "button-click";
    console.log("Button found, clicking...");
    await talkButton.click();
    console.log("Button clicked");

    // Wait for the iframe to be visible
    currentStep = "iframe-wait";
    console.log("Waiting for iframe...");
    await page.waitForSelector('iframe.cal-embed[name="cal-embed=meet"]', {
      state: "visible",
      timeout: 30000,
    });
    const iframe = page.frameLocator('iframe.cal-embed[name="cal-embed=meet"]');
    console.log("iframe found");

    // Add a small delay after iframe is found to ensure it's fully loaded
    await page.waitForTimeout(2000);

    // Press escape in the iframe
    currentStep = "escape-press";
    console.log("Pressing escape...");
    await iframe.locator("body").press("Escape");
    console.log("Escape pressed");

    // Verify the modal is closed
    currentStep = "modal-check";
    console.log("Verifying modal is closed...");
    await expect(page.locator("cal-modal-box")).not.toBeVisible({
      timeout: 5000,
    });
    console.log("Test complete");
  } catch (error) {
    console.error(`Test failed during step: ${currentStep}`);
    console.error("Error details:", error);
    throw error;
  }
});
