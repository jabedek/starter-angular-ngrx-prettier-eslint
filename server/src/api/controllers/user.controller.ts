import { Request, Response, Application, NextFunction } from "express";

const allAccess = (req: Request, res: Response) => {
  res.status(200).send("Public Content.");
};

const userBoard = (req: Request, res: Response) => {
  res.status(200).send("User Content.");
};

export const userController = {
  allAccess,
  userBoard,
};
