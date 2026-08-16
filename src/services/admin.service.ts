import { prisma } from '../config/prisma';
import { AppError } from '../utils/apiResponse';

const publicUserSelect = {
  id: true,
  fullName: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

export const listUsers = () => {
  return prisma.user.findMany({ select: publicUserSelect, orderBy: { createdAt: 'desc' } });
};

export const listPatients = () => {
  return prisma.patient.findMany({ orderBy: { createdAt: 'desc' } });
};

export const listAppointmentsAdmin = () => {
  return prisma.appointment.findMany({
    include: { doctor: true, patient: true },
    orderBy: { date: 'desc' },
  });
};

export const updateUserStatus = async (id: string, isActive: boolean) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return prisma.user.update({
    where: { id },
    data: { isActive },
    select: publicUserSelect,
  });
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  await prisma.user.delete({ where: { id } });
};

export const getDashboardStats = async () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const [totalUsers, totalDoctors, totalPatients, totalAppointments, todayAppointments] =
    await Promise.all([
      prisma.user.count(),
      prisma.doctor.count(),
      prisma.patient.count(),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { date: today } }),
    ]);

  return { totalUsers, totalDoctors, totalPatients, totalAppointments, todayAppointments };
};
