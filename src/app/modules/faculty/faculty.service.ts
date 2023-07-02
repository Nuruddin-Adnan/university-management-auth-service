/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import mongoose from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IFilters, IQueries } from '../../../interfaces/queryFilters';
import searcher from '../../../shared/searcher';
import { User } from '../user/user.model';
import { facultySearchableFields } from './faculty.constant';
import { IFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';

const getAllFaculties = async (
  filters: IFilters,
  queries: IQueries
): Promise<IGenericResponse<IFaculty[]>> => {
  const conditions = searcher(filters, facultySearchableFields);

  const { limit = 0, skip, fields, sort } = queries;

  const resultQuery = Faculty.find(conditions)
    .populate('academicDepartment')
    .skip(skip as number)
    .select(fields as string)
    .sort(sort)
    .limit(limit as number);

  const [result, total] = await Promise.all([
    resultQuery.exec(),
    Faculty.countDocuments(conditions),
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

const getSingleFaculty = async (id: string): Promise<IFaculty | null> => {
  const result = await Faculty.findOne({ id }).populate('academicDepartment');
  return result;
};

const updateFaculty = async (
  id: string,
  payload: Partial<IFaculty>
): Promise<IFaculty | null> => {
  const isExist = await Faculty.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found !');
  }

  const { name, ...FacultyData } = payload;

  const updatedFacultyData: Partial<IFaculty> = { ...FacultyData };

  // dynamically handling

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IFaculty>; // `name.fisrtName`
      (updatedFacultyData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Faculty.findOneAndUpdate({ id }, updatedFacultyData, {
    new: true,
  });

  return result;
};

const deleteFaculty = async (id: string): Promise<IFaculty | null> => {
  // check if the Faculty is exist
  const isExist = await Faculty.findOne({ id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found !');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //delete Faculty first
    const faculty = await Faculty.findOneAndDelete({ id }, { session });
    if (!faculty) {
      throw new ApiError(404, 'Failed to delete faculty');
    }
    //delete user
    await User.deleteOne({ id });
    session.commitTransaction();
    session.endSession();

    return faculty;
  } catch (error) {
    session.abortTransaction();
    throw error;
  }
};

export const FacultyService = {
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
