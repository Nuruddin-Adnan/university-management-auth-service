import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import queryFilters from '../../../shared/queryFilters';
import sendResponse from '../../../shared/sendResponse';
import { IStudent } from './student.interface';
import { StudentService } from './student.service';

const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const filters = queryFilters(
    req.query as Record<string, string | undefined>,
    req
  );
  const result = await StudentService.getAllStudents(
    filters.filters,
    filters.queries
  );
  sendResponse<IStudent[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get students successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.getSingleStudent(req.params.id);

  sendResponse<IStudent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrieved successfully !',
    data: result,
  });
});

const updateStudent = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await StudentService.updateStudent(id, updatedData);

  sendResponse<IStudent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully !',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentService.deleteStudent(id);
  sendResponse<IStudent>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student delete successfully !',
    data: result,
  });
});

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};
