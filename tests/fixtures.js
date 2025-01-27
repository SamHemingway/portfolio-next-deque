const { playwrightTest } = require("@axe-core/watcher");

module.exports = playwrightTest({
  axe: {
    apiKey: "8c808cb9-ccf8-43c8-8536-c2e2dd070098",
  },
  headless: false,
  // Any other Playwright configuration you’d pass to `chromium.launchPersistentContext()` here
});
