import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import queryFilters from '../../../shared/queryFilters';
import sendResponse from '../../../shared/sendResponse';
import { IAdmin } from './admin.interface';
import { AdminService } from './admin.service';

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const filters = queryFilters(
    req.query as Record<string, string | undefined>,
    req
  );
  const result = await AdminService.getAllAdmins(
    filters.filters,
    filters.queries
  );
  sendResponse<IAdmin[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get admin successfully !',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getSingleAdmin(req.params.id);

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin retrieved successfully !',
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await AdminService.updateAdmin(id, updatedData);

  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin updated successfully !',
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminService.deleteAdmin(id);
  sendResponse<IAdmin>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin delete successfully !',
    data: result,
  });
});

export const AdminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
