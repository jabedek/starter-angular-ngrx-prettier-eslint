import { UserModel } from "./user.model";
import mongoose from "mongoose";
mongoose.Promise = global.Promise;

type MongooseType = typeof mongoose;

export const db: {
  mongoose: MongooseType;
  user: typeof UserModel;
  [key: string]: any;
} = {
  mongoose,
  user: UserModel,
};

// db.mongoose = mongoose;
// db.user = UserModel;
