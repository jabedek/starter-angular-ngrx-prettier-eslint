import { Request, Response, NextFunction } from "express";
import { BackendMessage } from "../../../../system-shared/models/backend-message";
import { db } from "../../mongodb/models/models.index";

const User = db.user;

export const checkDuplicateUsername = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Username

  User?.findOne({
    username: (req?.body as any)?.username,
  }).exec((err, user) => {
    const result: BackendMessage = { status: "", message: "" };

    if (err) {
      result.status = "failure";
      result.message = err;
      res.status(500).send({ ...result });
      return;
    } else if (user) {
      result.status = "failure";
      result.message = "Nazwa użytkownika jest zajęta!";
      res.status(400).send({ ...result });
      return;
    } else {
      next();
    }
  });
};

export const verifySignup = {
  checkDuplicateUsername,
};
