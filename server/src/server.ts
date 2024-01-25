import { Request, Response, Application } from "express";
import { providePyszneData } from "./pyszne/pyszne-data-scraper";

const express = require("express");
const app: Application = express();
const http = require("http").createServer(app);
const cors = require("cors");

async function setup() {
  const frontendUrl = "http://localhost:4200";
  require("dotenv").config();

  const corsOptions = {
    origin: frontendUrl,
  };

  app
    .use(cors(corsOptions))
    .use(express.json())
    .use(express.urlencoded({ extended: true }));

  await providePyszneData();
  app.get("/", async (req: Request, res: Response) => {
    res.json({ message: "Hello" });
  });

  http.listen(process.env.PORT, () => console.log("listening on *:3000"));

  // fetch(
  //   "https://cw-api.takeaway.com/api/v33/restaurants?deliveryAreaId=15-306&postalCode=15-306&lat=53.1216776&lng=23.152242&limit=0&isAccurate=true&filterShowTestRestaurants=false",
  //   {
  //     headers: {
  //       accept: "application/json, text/plain, */*",
  //       "accept-language": "pl",
  //       "sec-ch-ua":
  //         '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  //       "sec-ch-ua-mobile": "?0",
  //       "sec-ch-ua-platform": '"Windows"',
  //       "sec-fetch-dest": "empty",
  //       "sec-fetch-mode": "cors",
  //       "sec-fetch-site": "cross-site",
  //       "x-country-code": "pl",
  //       "x-datadog-origin": "rum",
  //       "x-datadog-parent-id": "3405671257724153856",
  //       "x-datadog-sampling-priority": "1",
  //       "x-datadog-trace-id": "5350524616940728062",
  //       "x-language-code": "pl",
  //       "x-requested-with": "XMLHttpRequest",
  //       "x-session-id": "35367ac5-1064-417c-9271-b363b44aea4d",
  //       Referer: "https://www.pyszne.pl/",
  //       "Referrer-Policy": "strict-origin",
  //     },
  //     body: null,
  //     method: "GET",
  //   }
  // );
}

setup();
