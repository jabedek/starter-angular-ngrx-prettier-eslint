import puppeteer from "puppeteer";
import axios from "axios";
import { Pyszne_Restaurants } from "../models/pyszne-data-restaurants.model";
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "data.json");

const pageUrl = `https://www.pyszne.pl/na-dowoz/jedzenie/bialystok-bialystok-15-306`;
const resourceUrl = `https://cw-api.takeaway.com/api/v33/restaurants?deliveryAreaId=15-306&postalCode=15-306&lat=53.1216776&lng=23.152242&limit=0&isAccurate=true&filterShowTestRestaurants=false`;
const headers = {
  accept: "application/json, text/plain, */*",
  "accept-language": "pl",
  "sec-ch-ua":
    '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
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

// based on 'headers' object above, set axios headers in loop. Headers copied from real request in browser (copy as Node fetch)
Object.keys(headers).forEach(
  (key) => (axios.defaults.headers.common[key] = (headers as any)[key])
);

const intervalMinutes = 20;

function stringify(obj: any) {
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

      fs.writeFile(filePath, fileData, (err: any) =>
        fileWriteCb(
          err,
          "Empty file created successfully.\nFetching new data.\n"
        )
      );
    } else {
      const dataJson = JSON.parse(data);
      const restaurants: Pyszne_Restaurants = dataJson.restaurants;
      const requested: number = dataJson.requested;
      const now = Date.now();
      const diff = now - requested;
      const diffInMins = Math.floor(diff / 1000 / intervalMinutes);
      console.log("diffInMins: ", diffInMins);
      if (diffInMins > intervalMinutes || !restaurants) {
        // console.log("fetching new data");
        await scrapeAndSavePyszneData();
      } else {
        console.log("data is fresh");
        // console.log(restaurants);
      }
    }
  });
}

async function scrapeAndSavePyszneData() {
  console.log("scraping...");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  // page.on("request", (request) => {
  //   if (request.url().includes("restaurant")) {
  //     //   console.log(request.url());
  //   }

  //   if (request.url() === resourceUrl) {
  //     request.respond({
  //       status: 200,
  //       contentType: "application/json",
  //       body: JSON.stringify({ foo: "bar" }),
  //     });
  //   } else {
  //     request.continue();
  //   }
  // });

  await page.goto(pageUrl);

  const response = await axios.get(resourceUrl);
  const restaurants: Pyszne_Restaurants = response.data.restaurants;

  const fileData = stringify({
    requested: Date.now(),
    restaurants: restaurants,
  });

  fs.writeFile(filePath, fileData, (err: any) =>
    fileWriteCb(err, "File written successfully.\n")
  );

  await browser.close();
}
