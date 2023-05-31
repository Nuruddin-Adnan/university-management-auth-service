import config from '../../../config'
import { IUser } from './users.interface'
import { User } from './users.model'
import { generateUserId } from './users.utils'

export const createUserService = async (user: IUser): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.default_user_password as string
  }

  const id = await generateUserId()
  user.id = id

  const result = await User.create(user)

  if (!result) {
    throw new Error('Fail to create user')
  }
  return result
}
