import puppeteer from "puppeteer";

async function getTextFromXPath(page, xpath) {
  const elements = await page.$x(xpath);
  if (elements.length > 0) {
    return await page.evaluate(el => el.textContent, elements[0]);
  }
  return '';
}

async function scrollToBottom(page) {
  await page.evaluate(async () => {
    while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
      window.scrollBy(0, window.innerHeight);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay if needed
    }
  });
}

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });
    const page = await browser.newPage();
    await page.goto('https://web.hungryhub.com/restaurants/see-fah-thonglor?locale=th', { waitUntil: "domcontentloaded" });
    await page.setViewport({ width: 1200, height: 800 });
    await page.waitForTimeout(9000);
    await scrollToBottom(page);
    await page.waitForTimeout(15000);

    // Define the XPaths for each element you want to scrape
    let elements = [
      { locationXPath: '/html/body/div[1]/div[1]/div[3]/div/div[2]/div[1]/div[3]/div/div[3]/div[2]/div/div[3]/div[2]/div[1]/div/div[1]/div[2]/p',
        userXPath: '/html/body/div[1]/div[1]/div[3]/div/div[2]/div[1]/div[3]/div/div[3]/div[2]/div/div[3]/div[2]/div[1]/div/div[1]/div[1]/div/div[1]',
        commentXPath: '/html/body/div[1]/div[1]/div[3]/div/div[2]/div[1]/div[3]/div/div[3]/div[2]/div/div[3]/div[2]/div[1]/div/div[1]/div[2]/div[2]/span' },
      // Add more elements here if needed
    ];

    for (let element of elements) {
      // console.log("Processing element:", element);

      const location = await getTextFromXPath(page, element.locationXPath);
      const user = await getTextFromXPath(page, element.userXPath);
      const comment = await getTextFromXPath(page, element.commentXPath);

      console.log("location:", location);
      console.log("user:", user);
      console.log("comment:", comment);
    }

    await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
