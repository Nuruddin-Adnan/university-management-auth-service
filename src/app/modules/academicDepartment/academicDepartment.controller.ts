import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AcademicDepartmentService } from './academicDepartment.service';
import sendResponse from '../../../shared/sendResponse';
import { IAcademicDepartment } from './academicDepartment.interfacae';
import httpStatus from 'http-status';
import queryFilters from '../../../shared/queryFilters';

const createDepartment = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicDepartmentService.createDepartment(req.body);

  sendResponse<IAcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department create successfully!',
    data: result,
  });
});

const getAllDepartments = catchAsync(async (req: Request, res: Response) => {
  const filters = queryFilters(
    req.query as Record<string, string | undefined>,
    req
  );

  const result = await AcademicDepartmentService.getAllDepartments(
    filters.filters,
    filters.queries
  );

  sendResponse<IAcademicDepartment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department retrieved successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleDepartment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AcademicDepartmentService.getSingleDepartment(id);

  sendResponse<IAcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department retrieved successfully!',
    data: result,
  });
});

const updateDepartment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;
  const result = await AcademicDepartmentService.updateDepartment(
    id,
    updatedData
  );

  sendResponse<IAcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department update successfully !',
    data: result,
  });
});

const deleteDepartment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AcademicDepartmentService.deleteDepartment(id);
  sendResponse<IAcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department delete successfully !',
    data: result,
  });
});

export const AcademicDepartmentController = {
  createDepartment,
  getAllDepartments,
  getSingleDepartment,
  updateDepartment,
  deleteDepartment,
};
