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
import {
  SimpleProduct,
  SimpleProductsData,
} from "./models/restaurant-products.model";
import { log } from "console";
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

export async function getProducts(slugs: string[]) {
  console.log(slugs);

  const items: SimpleProductsData[] = [];
  // for each slug, scrape and save data, add delay between calls

  for (const slug of slugs) {
    // setTimeout(async () => {
    // }, (items.length + 1) * 200);
    const item = await scrapeAndSavePyszneDataRESTAURANT(slug);
    items.push(item);
  }
  //   slugs.forEach((slug, i) => {
  //     setTimeout(async () => {

  //     }, i * 200);
  //   });
  // } catch (err) {
  //   console.log(err);
  // }

  console.log("items", items);

  return items;
}

async function scrapeAndSavePyszneDataRESTAURANT(slug: string) {
  console.log("scraping restaurant products...", slug);
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 20000,

    product: "chrome",
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);

  page.on("request", (request) => {
    if (request.url().includes("restaurant")) {
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

  const response = await axios.get(resourceUrl2 + slug);
  const products: Products = response.data.menu.products;

  const fileData = stringify({
    requested: Date.now(),
    products,
  } as PyszneLocaLJSON_Restaurant);

  const jsonName = `data-${slug}-products.json`;

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

  const simpleProducts: Record<string, SimpleProduct> = {};

  Object.entries(products).map(([key, value]) => {
    const { name, variants } = value;
    simpleProducts[key] = { name, variants };
  });

  console.log("returning", slug);

  return <SimpleProductsData>{
    slug,
    products: simpleProducts,
  };
}
