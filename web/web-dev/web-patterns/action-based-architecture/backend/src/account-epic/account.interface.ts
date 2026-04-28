import mongoose from "mongoose";
import { AccountModel } from "./account.model";
export const MongooseObjectId = new mongoose.Types.ObjectId()
export type MongooseTypeObjectId = mongoose.Types.ObjectId;

export interface IAccountModel extends AccountModel {
    _id: MongooseTypeObjectId;
}

