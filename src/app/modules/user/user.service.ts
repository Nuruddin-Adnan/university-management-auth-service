import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { IUser } from './user.interface';
import { User } from './user.model';
import { generateUserId } from './user.utils';
import { IFilters, IQueries } from '../../../interfaces/queryFilters';
import searcher from '../../../shared/searcher';
import { IGenericResponse } from '../../../interfaces/common';

export const createUser = async (user: IUser): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.default_user_password as string;
  }

  const id = await generateUserId();
  user.id = id;

  const result = await User.create(user);

  if (!result) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Fail to create user');
  }
  return result;
};

const getAllUsers = async (
  filters: IFilters,
  queries: IQueries
): Promise<IGenericResponse<IUser[]>> => {
  const conditions = searcher(filters, ['role', 'id']);
  const { limit = 0, skip, fields, sort } = queries;

  const resultQuery = User.find(conditions)
    .skip(skip as number)
    .select(fields as string)
    .sort(sort)
    .limit(limit as number);

  const [result, total] = await Promise.all([
    resultQuery.exec(),
    User.countDocuments(conditions),
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

export const UserService = {
  createUser,
  getAllUsers,
};
