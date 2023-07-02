/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IFilters, IQueries } from '../../../interfaces/queryFilters';
import searcher from '../../../shared/searcher';
import { User } from '../user/user.model';
import { adminSearchableFields } from './admin.constant';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const getAllAdmins = async (
  filters: IFilters,
  queries: IQueries
): Promise<IGenericResponse<IAdmin[]>> => {
  const conditions = searcher(filters, adminSearchableFields);

  const { limit = 0, skip, fields, sort } = queries;

  const resultQuery = Admin.find(conditions)
    .skip(skip as number)
    .select(fields as string)
    .sort(sort)
    .limit(limit as number);

  const [result, total] = await Promise.all([
    resultQuery.exec(),
    Admin.countDocuments(conditions),
  ]);

  const page = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleAdmin = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findOne({ id });
  return result;
};

const updateAdmin = async (
  id: string,
  payload: Partial<IAdmin>
): Promise<IAdmin | null> => {
  const isExist = await Admin.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found !');
  }

  const { name, ...AdminData } = payload;

  const updatedAdminData: Partial<IAdmin> = { ...AdminData };

  // dynamically handling

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>; // `name.fisrtName`
      (updatedAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Admin.findOneAndUpdate({ id }, updatedAdminData, {
    new: true,
  });

  return result;
};

const deleteAdmin = async (id: string): Promise<IAdmin | null> => {
  // check if the Admin is exist
  const isExist = await Admin.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete Admin first
    const admin = await Admin.findOneAndDelete({ id }, { session });
    if (!admin) {
      throw new ApiError(404, 'Failed to delete admin');
    }
    //delete user
    await User.deleteOne({ id });
    session.commitTransaction();
    session.endSession();

    return admin;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const AdminService = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
