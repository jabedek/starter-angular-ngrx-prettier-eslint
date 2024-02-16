import { Request, Response } from "express";
import { getProducts } from "../../pyszne/pyszne-products-scraper";

const pyszne = async (req: Request, res: Response) => {
  console.log(req.body);

  // check if request body is an array of strings
  if (!Array.isArray(req.body)) {
    res.status(400).send("Bad request. Expected an array of strings.");
    return;
  }

  const result = await getProducts(req.body);
  console.log(result);

  //   const user = new User({
  //     username: (req?.body as any)?.username || "",
  //     password: bcrypt.hashSync((req?.body as any)?.password, 8),
  //     gainedPoints: req.body?.gainedPoints || 0,
  //     joinedAt: Date.now(),
  //     currentConnection: { userId: "", atGameId: "" },
  //     accessToken: undefined,
  //   });

  //   user.save((err: any, user: any) => {
  //     const result: BackendMessage = { status: "", message: "" };
  //     if (err) {
  //       result.status = "failure";
  //       result.message = err;
  //       res.status(500).send({ ...result });
  //       return;
  //     } else {
  //       result.status = "success";
  //       res.status(200).json({ ...result });
  //       logger.info(result);
  //     }
  //   });
  res.status(200).json(result);
  return;
};

const suki = (req: Request, res: Response) => {
  console.log(req.params);

  //   const user = new User({
  //     username: (req?.body as any)?.username || "",
  //     password: bcrypt.hashSync((req?.body as any)?.password, 8),
  //     gainedPoints: req.body?.gainedPoints || 0,
  //     joinedAt: Date.now(),
  //     currentConnection: { userId: "", atGameId: "" },
  //     accessToken: undefined,
  //   });

  //   user.save((err: any, user: any) => {
  //     const result: BackendMessage = { status: "", message: "" };
  //     if (err) {
  //       result.status = "failure";
  //       result.message = err;
  //       res.status(500).send({ ...result });
  //       return;
  //     } else {
  //       result.status = "success";
  //       res.status(200).json({ ...result });
  //       logger.info(result);
  //     }
  //   });
  res.status(200).send("oksuki");
};

export const scrapController = {
  pyszne,
  suki,
};
