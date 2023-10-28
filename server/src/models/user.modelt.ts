import { ObjectId } from "mongodb";

export interface UserData {
  _id: ObjectId;
  username: string;
  password?: string;
  gainedPoints: number;
  joinedAt: string | number; // timestamp
  accessToken?: string;
  activeSocketId?: string;
}
