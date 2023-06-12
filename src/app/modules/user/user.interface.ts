// export type IUser = {
//   id: string
//   role: string
//   password: string
// }

import { Model } from 'mongoose';

export type IUser = {
  id: string;
  role: string;
  password: string;
  // student?: Types.ObjectId | IStudent;
  // faculty?:Types.ObjectId | IFaculty; Future
  // admin?:Types.ObjectId | IAdmin; Future
};
export type UserModel = Model<IUser, Record<string, unknown>>;
