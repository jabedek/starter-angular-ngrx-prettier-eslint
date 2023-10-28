import { verifySignup } from "../middlewares/verify-signup";
import { Request, Response, Application, NextFunction } from "express";
import { authController } from "../controllers/auth.controller";

export function authRoutes(app: Application) {
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [verifySignup.checkDuplicateUsername],
    authController.signup
  );

  app.post("/api/auth/signin", authController.signin);
  app.post("/api/auth/signout", authController.signout);
  app.get("/api/auth/:id", authController.userData);
}
