import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import * as appointmentService from '../services/appointment.service';

export const getAppointments = asyncHandler(async (req: Request, res: Response) => {
  const appointments = await appointmentService.listAppointments(req.user!);
  successResponse(res, appointments);
});

export const createAppointment = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await appointmentService.createAppointment(req.user!, req.body);
  successResponse(res, appointment, 'Appointment created', 201);
});

export const getAppointmentById = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await appointmentService.getAppointmentById(req.user!, req.params.id);
  successResponse(res, appointment);
});

export const updateAppointment = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await appointmentService.updateAppointment(req.user!, req.params.id, req.body);
  successResponse(res, appointment, 'Appointment updated');
});

export const deleteAppointment = asyncHandler(async (req: Request, res: Response) => {
  await appointmentService.deleteAppointment(req.user!, req.params.id);
  successResponse(res, null, 'Appointment deleted');
});
