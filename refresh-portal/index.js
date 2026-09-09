const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const URL = "http://quickwave.wifi/login";

async function run() {
  const driver = await new Builder()
    .forBrowser("chrome")
    .build();

  try {
    let attempts = 3;

    while (attempts-- > 0) {
      try {
        await driver.get(URL);
        await driver.sleep(3000);

        const badgeElements = await driver.findElements(
          By.xpath("//span[contains(normalize-space(.), 'Free Trial')]")
        );

        if (badgeElements.length > 0) {
          const linkElements = await driver.findElements(
            By.xpath("//a[contains(normalize-space(.), 'Click Here To Start Free Trial')]")
          );
          if (linkElements.length > 0) {
            await linkElements[0].click();
            console.log("[+] Free trial clicked successfully");
            break;
          } else {
            console.log("[-] Badge found but link missing");
            break;
          }
        } else {
          console.log("[*] Portal not ready, retrying...");
          await driver.sleep(4000);
        }

      } catch (e) {
        console.log(`[-] Attempt failed: ${e.message}, retrying...`);
        await driver.sleep(4000);
      }
    }

  } catch (error) {
    console.error("[-] Fatal error:", error.message);
  } finally {
    await driver.quit();
  }
}

run();
