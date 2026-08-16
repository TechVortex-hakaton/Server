import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import * as adminService from '../services/admin.service';
import * as doctorService from '../services/doctor.service';

export const getUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await adminService.listUsers();
  successResponse(res, users);
});

export const getDoctors = asyncHandler(async (_req: Request, res: Response) => {
  const doctors = await doctorService.listDoctors();
  successResponse(res, doctors);
});

export const createDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await doctorService.adminCreateDoctor(req.body);
  successResponse(res, doctor, 'Doctor created', 201);
});

export const updateDoctor = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await doctorService.adminUpdateDoctor(req.params.id, req.body);
  successResponse(res, doctor, 'Doctor updated');
});

export const deleteDoctor = asyncHandler(async (req: Request, res: Response) => {
  await doctorService.adminDeleteDoctor(req.params.id);
  successResponse(res, null, 'Doctor deleted');
});

export const getPatients = asyncHandler(async (_req: Request, res: Response) => {
  const patients = await adminService.listPatients();
  successResponse(res, patients);
});

export const getAppointments = asyncHandler(async (_req: Request, res: Response) => {
  const appointments = await adminService.listAppointmentsAdmin();
  successResponse(res, appointments);
});

export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { isActive } = req.body;
  const user = await adminService.updateUserStatus(req.params.id, isActive);
  successResponse(res, user, 'User status updated');
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await adminService.deleteUser(req.params.id);
  successResponse(res, null, 'User deleted');
});

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getDashboardStats();
  successResponse(res, stats);
});
