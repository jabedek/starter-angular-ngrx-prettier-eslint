import { Request, Response, Application, NextFunction } from "express";
// import { verifySignup } from "../middlewares/verify-signup";
import { scrapController } from "../controllers/scrap.controller";

export function scrapRoutes(app: Application) {
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/scrap/pyszne", scrapController.pyszne);
  app.post("/api/scrap/suki", scrapController.suki);
}
