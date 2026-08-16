import { prisma } from '../config/prisma';
import { hashPassword } from '../utils/password';
import { AppError } from '../utils/apiResponse';

type CreateDoctorInput = {
  fullName: string;
  email: string;
  password: string;
  specialization: string;
  experience?: number;
  phone?: string;
  bio?: string;
  avatar?: string;
};

type UpdateDoctorInput = Partial<{
  fullName: string;
  specialization: string;
  experience: number;
  phone: string;
  email: string;
  bio: string;
  avatar: string;
  isActive: boolean;
}>;

export const listDoctors = () => {
  return prisma.doctor.findMany({ orderBy: { createdAt: 'desc' } });
};

export const adminCreateDoctor = async (input: CreateDoctorInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError(409, 'Email already in use');
  }

  const hashed = await hashPassword(input.password);

  return prisma.doctor.create({
    data: {
      fullName: input.fullName,
      specialization: input.specialization,
      experience: input.experience,
      phone: input.phone,
      email: input.email,
      bio: input.bio,
      avatar: input.avatar,
      user: {
        create: {
          fullName: input.fullName,
          email: input.email,
          password: hashed,
          role: 'DOCTOR',
        },
      },
    },
  });
};

export const adminUpdateDoctor = async (id: string, data: UpdateDoctorInput) => {
  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) {
    throw new AppError(404, 'Doctor not found');
  }
  return prisma.doctor.update({ where: { id }, data });
};

export const adminDeleteDoctor = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({ where: { id } });
  if (!doctor) {
    throw new AppError(404, 'Doctor not found');
  }
  await prisma.user.delete({ where: { id: doctor.userId } });
};

export const getDoctorByUserId = async (userId: string) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) {
    throw new AppError(404, 'Doctor profile not found');
  }
  return doctor;
};

export const updateDoctorProfile = async (userId: string, data: UpdateDoctorInput) => {
  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) {
    throw new AppError(404, 'Doctor profile not found');
  }
  return prisma.doctor.update({ where: { userId }, data });
};

export const getDoctorPatients = async (doctorId: string) => {
  const appointments = await prisma.appointment.findMany({
    where: { doctorId },
    select: { patient: true },
    distinct: ['patientId'],
  });
  return appointments.map((a) => a.patient);
};

export const getDoctorPatientById = async (doctorId: string, patientId: string) => {
  const appointment = await prisma.appointment.findFirst({
    where: { doctorId, patientId },
    include: { patient: true },
  });
  if (!appointment) {
    throw new AppError(403, 'You do not have access to this patient');
  }
  return appointment.patient;
};

export const getDoctorDashboardStats = async (doctorId: string) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const [todayAppointments, totalPatients, completedAppointments] = await Promise.all([
    prisma.appointment.count({ where: { doctorId, date: today } }),
    prisma.appointment.findMany({ where: { doctorId }, distinct: ['patientId'], select: { patientId: true } }),
    prisma.appointment.count({ where: { doctorId, status: 'COMPLETED' } }),
  ]);

  return {
    todayAppointments,
    totalPatients: totalPatients.length,
    completedAppointments,
  };
};
