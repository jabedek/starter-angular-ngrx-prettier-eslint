import { Request, Response, Application, NextFunction } from "express";
import { userController } from "../controllers/user.controller";
import { authJwt } from "../middlewares/auth-jwt";

export function userRoutes(app: Application) {
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", userController.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], userController.userBoard);
}
