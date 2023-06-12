import config from '../../../config';
import { IUser } from './user.interface';
import { User } from './user.model';
import { generateUserId } from './user.utils';

export const createUserService = async (user: IUser): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.default_user_password as string;
  }

  const id = await generateUserId();
  user.id = id;

  const result = await User.create(user);

  if (!result) {
    throw new Error('Fail to create user');
  }
  return result;
};
