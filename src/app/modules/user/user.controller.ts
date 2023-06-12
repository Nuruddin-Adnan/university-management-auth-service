import { RequestHandler } from 'express';
import { createUserService } from './user.service';
import { errorlogger } from '../../../shared/logger';

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await createUserService(req.body);
    res.status(200).json({
      status: 'success',
      message: 'User created successfully',
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorlogger.error(error);
      next(error);
      // res.status(400).json({
      //   status: 'fail',
      //   message: "Couldn't create user",
      //   error: `${error.message}`,
      // });
    }
  }
};

export const userController = {
  createUser,
};
