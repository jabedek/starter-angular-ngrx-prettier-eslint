import puppeteer from "puppeteer";
import axios from "axios";
import {
  PyszneLocaLJSON,
  Pyszne_Restaurants,
} from "./models/pyszne-data-restaurants.model";
import {
  Products,
  PyszneLocaLJSON_Restaurant,
} from "./models/pyszne-data-products.model";
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "data.json");

// file path for outside of src folder
const filePathClientCopy = path.join(
  __dirname,
  "../../../client/src/assets/pyszne",
  "data.json"
);

const pageUrl = `https://www.pyszne.pl/na-dowoz/jedzenie/bialystok-bialystok-15-306`;
const resourceUrl = `https://cw-api.takeaway.com/api/v33/restaurants?deliveryAreaId=15-306&postalCode=15-306&lat=53.1216776&lng=23.152242&limit=0&isAccurate=true&filterShowTestRestaurants=false`;
const headers = {
  accept: "application/json, text/plain, */*",
  "accept-language": "pl",
  "sec-ch-ua":
    '"Not_A Brand";v="99", "Chromium";v="121", "Google Chrome";v="121"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "cross-site",
  "x-country-code": "pl",
  "x-language-code": "pl",
  Referer: "https://www.pyszne.pl/",
  "Referrer-Policy": "strict-origin",
  "x-requested-with": "XMLHttpRequest",
  "x-datadog-origin": "rum",
  "x-datadog-sampling-priority": "1",
  //   "x-datadog-parent-id": "3405671257724153856",
  //   "x-datadog-trace-id": "5350524616940728062",
  //   "x-session-id": "35367ac5-1064-417c-9271-b363b44aea4d",
};

const pageUrl2 = `https://www.pyszne.pl/menu/`;
const resourceUrl2 = `https://cw-api.takeaway.com/api/v33/restaurant?slug=`;

// based on 'headers' object above, set axios headers in loop. Headers copied from real request in browser (copy as Node fetch)
Object.keys(headers).forEach(
  (key) => (axios.defaults.headers.common[key] = (headers as any)[key])
);

const intervalMinutes = 5;

function stringify(obj: PyszneLocaLJSON | PyszneLocaLJSON_Restaurant) {
  return JSON.stringify(obj, null, 4);
}

function fileWriteCb(err: any, successMsg: string) {
  if (err) {
    console.log(err);
  } else {
    console.log(successMsg);
  }
}

// Try to read data from json file - check if file exists, if not - create empty file
// Check if field 'restaurants' is not empty: undefined/null/empty-object/falsy
// If 'restaurants' are empty - fetch new data
// If 'restaurants' are not empty - check if 'requested' time is older than intervalMinutes; if it is older - fetch new data
// Fetch is done by scrapePyszne() function which also saves new data to the same file.
// "requested" field is used to check if data is fresh or not AND to set an interval so Pyszne won't ban our app if there are too many requests.
export async function providePyszneData() {
  fs.readFile(filePath, "utf8", async (err: any, data: any) => {
    if (err) {
      const fileData = stringify({
        requested: new Date("2000-01-01").getTime(),
        restaurants: null,
      });

      fs.writeFile(filePath, fileData, async (err: any) => {
        fileWriteCb(
          err,
          "Empty file created successfully.\nFetching new data.\n"
        );
        await scrapeAndSavePyszneData();
        return;
      });
    } else {
      const { requested, restaurants } = JSON.parse(data) as PyszneLocaLJSON;
      if (!restaurants || Object.keys(restaurants).length === 0) {
        await scrapeAndSavePyszneData();
        return;
      } else {
        const restaurantsFromFile: Pyszne_Restaurants = restaurants;
        const requestedFromFile: number = requested;
        const now = Date.now();
        const diff = now - requestedFromFile;
        const diffInMins = Math.floor(diff / 1000 / intervalMinutes);
        console.log("diffInMins: ", diffInMins);
        if (diffInMins > intervalMinutes || !restaurantsFromFile) {
          // console.log("fetching new data");
          await scrapeAndSavePyszneData();
          return;
        } else {
          console.log("data is fresh");
          // console.log(restaurantsFromFile);
        }
      }
    }
  });
}

async function scrapeAndSavePyszneData() {
  console.log("scraping...");
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 60000,
    // waitForInitialPage: true,
    // ignoreHTTPSErrors: true,
    product: "chrome",
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on("request", (request) => {
    if (request.url().includes("restaurant")) {
      //   console.log(request.url());
    }

    if (request.url() === resourceUrl) {
      request.respond({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ foo: "bar" }),
      });
    } else {
      request.continue();
    }
  });

  console.log("going to page", pageUrl, page);
  await page.goto(pageUrl);

  console.log("response");
  const response = await axios.get(resourceUrl);
  const restaurants: Pyszne_Restaurants = response.data.restaurants;

  const fileData = stringify({
    requested: Date.now(),
    restaurants: restaurants,
  });

  fs.writeFile(filePath, fileData, (err: any) =>
    fileWriteCb(err, "File written successfully.\n")
  );

  fs.writeFile(filePathClientCopy, fileData, (err: any) =>
    fileWriteCb(err, "File for Client also written successfully.\n")
  );

  await browser.close();

  await scrapeAndSavePyszneDataRESTAURANT("gorcy-trjkt-lipowa");
}

async function scrapeAndSavePyszneDataRESTAURANT(slug: string) {
  console.log("scraping restaurant products...");
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 60000,
    // waitForInitialPage: true,
    // ignoreHTTPSErrors: true,

    product: "chrome",
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on("request", (request) => {
    if (request.url().includes("restaurant")) {
      //   console.log(request.url());
    }

    if (request.url().includes(resourceUrl2)) {
      request.respond({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ foo: "bar" }),
      });
    } else {
      request.continue();
    }
  });

  await page.goto("https://www.pyszne.pl");

  console.log("getting", resourceUrl2 + slug);

  const response = await axios.get(resourceUrl2 + slug);
  const products: Products = response.data.menu.products;

  const fileData = stringify({
    requested: Date.now(),
    products,
  } as PyszneLocaLJSON_Restaurant);

  const jsonName = `data-${slug}.json`;

  const filePathRestaurant = path.join(__dirname, jsonName);
  const filePathClientCopy = path.join(
    __dirname,
    "../../../client/src/assets/pyszne",
    jsonName
  );

  fs.writeFile(filePathRestaurant, fileData, (err: any) =>
    fileWriteCb(err, "File written successfully.\n")
  );

  fs.writeFile(filePathClientCopy, fileData, (err: any) =>
    fileWriteCb(err, "File for Client also written successfully.\n")
  );

  await browser.close();
}
