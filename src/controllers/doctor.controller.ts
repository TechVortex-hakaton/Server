import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { successResponse } from '../utils/apiResponse';
import * as doctorService from '../services/doctor.service';
import * as appointmentService from '../services/appointment.service';
import * as medicalRecordService from '../services/medicalRecord.service';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await doctorService.getDoctorByUserId(req.user!.id);
  successResponse(res, doctor);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await doctorService.updateDoctorProfile(req.user!.id, req.body);
  successResponse(res, doctor, 'Profile updated');
});

export const getAppointments = asyncHandler(async (req: Request, res: Response) => {
  const appointments = await appointmentService.listAppointments(req.user!);
  successResponse(res, appointments);
});

export const getPatients = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await doctorService.getDoctorByUserId(req.user!.id);
  const patients = await doctorService.getDoctorPatients(doctor.id);
  successResponse(res, patients);
});

export const getPatientById = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await doctorService.getDoctorByUserId(req.user!.id);
  const patient = await doctorService.getDoctorPatientById(doctor.id, req.params.id);
  successResponse(res, patient);
});

export const getPatientRecords = asyncHandler(async (req: Request, res: Response) => {
  const records = await medicalRecordService.getPatientRecords(req.user!.id, req.params.id);
  successResponse(res, records);
});

export const createRecord = asyncHandler(async (req: Request, res: Response) => {
  const record = await medicalRecordService.createMedicalRecord(req.user!.id, req.body);
  successResponse(res, record, 'Medical record created', 201);
});

export const updateRecord = asyncHandler(async (req: Request, res: Response) => {
  const record = await medicalRecordService.updateMedicalRecord(req.user!.id, req.params.id, req.body);
  successResponse(res, record, 'Medical record updated');
});

export const updateAppointmentStatus = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await appointmentService.updateAppointmentStatus(
    req.user!,
    req.params.id,
    req.body.status
  );
  successResponse(res, appointment, 'Appointment status updated');
});

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const doctor = await doctorService.getDoctorByUserId(req.user!.id);
  const stats = await doctorService.getDoctorDashboardStats(doctor.id);
  successResponse(res, stats);
});
