import { prisma } from '../config/prisma';
import { AppError } from '../utils/apiResponse';

const getDoctorId = async (userId: string) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) throw new AppError(404, 'Doctor profile not found');
  return doctor.id;
};

export const getPatientRecords = async (doctorUserId: string, patientId: string) => {
  const doctorId = await getDoctorId(doctorUserId);

  const hasAccess = await prisma.appointment.findFirst({ where: { doctorId, patientId } });
  if (!hasAccess) {
    throw new AppError(403, 'You do not have access to this patient');
  }

  return prisma.medicalRecord.findMany({
    where: { patientId },
    orderBy: { createdAt: 'desc' },
  });
};

export const createMedicalRecord = async (
  doctorUserId: string,
  data: { patientId: string; diagnosis: string; notes?: string; recommendations?: string }
) => {
  const doctorId = await getDoctorId(doctorUserId);

  const patient = await prisma.patient.findUnique({ where: { id: data.patientId } });
  if (!patient) {
    throw new AppError(404, 'Patient not found');
  }

  return prisma.medicalRecord.create({
    data: {
      doctorId,
      patientId: data.patientId,
      diagnosis: data.diagnosis,
      notes: data.notes,
      recommendations: data.recommendations,
    },
  });
};

export const updateMedicalRecord = async (
  doctorUserId: string,
  id: string,
  data: { diagnosis?: string; notes?: string; recommendations?: string }
) => {
  const doctorId = await getDoctorId(doctorUserId);

  const record = await prisma.medicalRecord.findUnique({ where: { id } });
  if (!record || record.doctorId !== doctorId) {
    throw new AppError(404, 'Medical record not found');
  }

  return prisma.medicalRecord.update({ where: { id }, data });
};
