require("dotenv").config();
import { db } from "./models/models.index";

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PWD = process.env.MONGO_PWD;
const MONGO_DB = process.env.MONGO_DB;

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@cbbg-cluster.re9mwpk.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`;

export async function initMongoConnection() {
  return db?.mongoose
    ?.connect(uri)
    .then(() => {
      console.log("Successfully connect to MongoDB.");
      // initial();
    })
    .catch((err: any) => {
      console.error("Connection error", err);
      process.exit();
    });
}
