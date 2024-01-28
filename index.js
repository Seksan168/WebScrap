import puppeteer from "puppeteer";
import fs from "fs";
import LanguageDetect from "languagedetect";
import { setTimeout } from "timers/promises";

const checkLng = async (quote) => {
  if (quote) {
    const lngDetector = new LanguageDetect();
    const lng = lngDetector.detect(quote, 1);
    return lng[0][0];
  }
  return "";
};


const getQuotes = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("https://web.hungryhub.com/restaurants/see-fah-thonglor?locale=th", {
    waitUntil: "domcontentloaded",
  });
  

  try {
    const quotes = await page.evaluate(() => {
      // Fetch the first element with class "quote"
      // Get the displayed text and returns it

      const xpath = '/html/body/div[1]/div[1]/div[3]/div/div[2]/div[1]/div[1]/div[1]/div/div[1]/div/div/div[2]/h1';
      const elements = await page.$x(xpath);
      let text = '';
      if (elements.length > 0) {
      text = await page.evaluate(element => element.textContent, elements[0]);
      }

      console.log(text);

      
      const quoteList = document.querySelectorAll(".data-v-742204ba");
  
      // Convert the quoteList to an iterable array
      // For each quote fetch the text and author
      return Array.from(quoteList).map((quote) => {
        // Fetch the sub-elements from the previously fetched quote element
        // Get the displayed text and return it (`.innerText`)
        const location = quote.querySelector(".data-v-57b63d1e").innerText;
      //   const review = quote.querySelector(".location-string");
        //const author = quote.querySelector(".author").innerText;
  
        return { location };
      });
    });
    
  } catch (error) {
    console.log(error);
    
  }

  

  console.log(quotes);

  // await browser.close();
};

getQuotes();
