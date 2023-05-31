import { Request, Response } from 'express'
import { createUserService } from './users.service'

export const createUser = async (req: Request, res: Response) => {
  try {
    const result = await createUserService(req.body)
    res.status(200).json({
      status: 'success',
      message: 'User created successfully',
      data: result,
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({
        status: 'fail',
        message: "Couldn't create user",
        error: `${error.message}`,
      })
    }
  }
}
