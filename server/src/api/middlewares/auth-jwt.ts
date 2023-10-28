import { Request, Response, NextFunction } from "express";
import { JwtPayload, sign, verify, VerifyErrors } from "jsonwebtoken";
import { secret } from "../config/auth.config";
import { db } from "../../mongodb/models/models.index";

export type TokenPayload = { user: string; password: string };
export type DecodedJwtPayload = TokenPayload & Pick<JwtPayload, "iat" | "exp">;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  console.log("verifyToken");

  let token = req.headers["x-access-token"] as any;
  console.log(token);

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  verify(token, secret, (err: VerifyErrors | null, decoded: any) => {
    console.log("decoded", decoded);
    console.log("req.userId", (req as any).userId);

    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    (req as any).userId = decoded.id;
    next();
  });
};

export const authJwt = {
  verifyToken,
};
