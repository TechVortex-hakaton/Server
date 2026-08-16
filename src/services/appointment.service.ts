import { prisma } from '../config/prisma';
import { AppError } from '../utils/apiResponse';
import { AppointmentStatus } from '@prisma/client';

type AuthUser = { id: string; role: 'ADMIN' | 'DOCTOR' | 'PATIENT' };

const getDoctorId = async (userId: string) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw new AppError(404, 'Doctor profile not found');
  return doctor.id;
};

const getPatientId = async (userId: string) => {
  const patient = await prisma.patient.findUnique({ where: { userId } });
  if (!patient) throw new AppError(404, 'Patient profile not found');
  return patient.id;
};

export const listAppointments = async (user: AuthUser) => {
  if (user.role === 'ADMIN') {
    return prisma.appointment.findMany({
      include: { doctor: true, patient: true },
      orderBy: { date: 'desc' },
    });
  }
  if (user.role === 'DOCTOR') {
    const doctorId = await getDoctorId(user.id);
    return prisma.appointment.findMany({
      where: { doctorId },
      include: { patient: true },
      orderBy: { date: 'desc' },
    });
  }
  const patientId = await getPatientId(user.id);
  return prisma.appointment.findMany({
    where: { patientId },
    include: { doctor: true },
    orderBy: { date: 'desc' },
  });
};

export const createAppointment = async (
  user: AuthUser,
  data: { doctorId: string; date: string; time: string; reason?: string }
) => {
  const patientId = await getPatientId(user.id);

  const doctor = await prisma.doctor.findUnique({ where: { id: data.doctorId } });
  if (!doctor) {
    throw new AppError(404, 'Doctor not found');
  }

  return prisma.appointment.create({
    data: {
      doctorId: data.doctorId,
      patientId,
      date: new Date(data.date),
      time: data.time,
      reason: data.reason,
    },
  });
};

const assertAppointmentAccess = async (user: AuthUser, appointmentId: string) => {
  const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
  if (!appointment) {
    throw new AppError(404, 'Appointment not found');
  }
  if (user.role === 'ADMIN') return appointment;

  if (user.role === 'DOCTOR') {
    const doctorId = await getDoctorId(user.id);
    if (appointment.doctorId !== doctorId) {
      throw new AppError(403, 'You do not have access to this appointment');
    }
  } else {
    const patientId = await getPatientId(user.id);
    if (appointment.patientId !== patientId) {
      throw new AppError(403, 'You do not have access to this appointment');
    }
  }
  return appointment;
};

export const getAppointmentById = async (user: AuthUser, id: string) => {
  const appointment = await assertAppointmentAccess(user, id);
  return prisma.appointment.findUnique({
    where: { id: appointment.id },
    include: { doctor: true, patient: true },
  });
};

export const updateAppointment = async (
  user: AuthUser,
  id: string,
  data: { date?: string; time?: string; reason?: string; notes?: string; status?: AppointmentStatus }
) => {
  await assertAppointmentAccess(user, id);

  return prisma.appointment.update({
    where: { id },
    data: {
      date: data.date ? new Date(data.date) : undefined,
      time: data.time,
      reason: data.reason,
      notes: data.notes,
      status: data.status,
    },
  });
};

export const deleteAppointment = async (user: AuthUser, id: string) => {
  await assertAppointmentAccess(user, id);
  await prisma.appointment.delete({ where: { id } });
};

export const updateAppointmentStatus = async (user: AuthUser, id: string, status: AppointmentStatus) => {
  await assertAppointmentAccess(user, id);
  return prisma.appointment.update({ where: { id }, data: { status } });
};
