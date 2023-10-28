import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { secret } from "../config/auth.config";
import bcrypt from "bcryptjs";
import { Model } from "mongoose";
import logger from "node-color-log";
import { UserData } from "../../../../system-shared/models/user.model";
import { db } from "../../mongodb/models/models.index";
import { NewUser } from "../../mongodb/models/user.model";
import { BackendMessage } from "../../../../system-shared/models/backend-message";

const User: Model<NewUser> | undefined = db.user;

const signup = (req: Request, res: Response) => {
  const user = new User({
    username: (req?.body as any)?.username || "",
    password: bcrypt.hashSync((req?.body as any)?.password, 8),
    gainedPoints: req.body?.gainedPoints || 0,
    joinedAt: Date.now(),
    currentConnection: { userId: "", atGameId: "" },
    accessToken: undefined,
  });

  user.save((err: any, user: any) => {
    const result: BackendMessage = { status: "", message: "" };
    if (err) {
      result.status = "failure";
      result.message = err;
      res.status(500).send({ ...result });
      return;
    } else {
      result.status = "success";
      res.status(200).json({ ...result });
      logger.info(result);
    }
  });
};

const signin = (req: Request, res: Response) => {
  User.findOne({
    username: req.body.username,
  }).exec((err: any, data: unknown) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!data) {
      return res.status(404).send({ message: "Nie znaleziono użytkownika." });
    }

    const user = data as UserData;

    if (user && user.password) {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: undefined,
          message: "Niepoprawne hasło.",
        });
      }

      if (!err && passwordIsValid) {
        const token = sign({ id: user._id }, secret, {
          expiresIn: 86400, // 24 hours
        });

        const authUser: UserData = {
          _id: user._id,
          username: user.username,
          accessToken: token,
          gainedPoints: user.gainedPoints,
          joinedAt: user.joinedAt,
        };

        User.findByIdAndUpdate(
          `${user._id}`,
          { accessToken: token },
          (err: any, data: unknown) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            if (!data) {
              return res
                .status(404)
                .send({ message: "Nie znaleziono użytkownika." });
            }
            if (!err) {
              res.status(200).send(authUser);
            }
          }
        );
      }
    }
  });
};

const signout = (req: Request, res: Response) => {
  User.findOne({
    _id: req.body._id,
  }).exec((err: any, data: unknown) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!data) {
      return res.status(404).send({ message: "Nie znaleziono użytkownika." });
    }
    const user = data as UserData;
    if (user) {
      User.findByIdAndUpdate(
        user._id,
        { accessToken: "" },
        (err: any, freshData: unknown) => {
          console.log(freshData);

          if (err) {
            res.status(500).send({ message: err });
            return;
          } else {
            res.status(200).send(freshData);
          }
        }
      );
    }
  });
};

const userData = (req: Request, res: Response) => {
  User.findOne({
    _id: req.params.id,
  }).exec((err: any, data: unknown) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (!data) {
      return res.status(404).send({ message: "Nie znaleziono użytkownika." });
    }
    const user = data as UserData;
    res.status(200).send(user);
    // if (user) {
    //   User.findByIdAndUpdate(
    //     user._id,
    //     { accessToken: "" },
    //     (err: any, freshData: unknown) => {
    //       console.log(freshData);

    //       if (err) {
    //         res.status(500).send({ message: err });
    //         return;
    //       } else {
    //         res.status(200).send(freshData);
    //       }
    //     }
    //   );
    // }
  });
};

export const authController = {
  signup,
  signin,
  signout,
  userData,
};
