import { prisma } from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
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

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  birthDate?: string;
  gender?: string;
  phone?: string;
  address?: string;
};

export const registerUser = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError(409, 'Email already in use');
  }

  const hashed = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      password: hashed,
      role: 'PATIENT',
      patient: {
        create: {
          fullName: input.fullName,
          birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
          gender: input.gender,
          phone: input.phone,
          address: input.address,
        },
      },
    },
    select: publicUserSelect,
  });

  const token = signToken({ id: user.id, role: user.role });
  return { user, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new AppError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new AppError(403, 'Account is deactivated');
  }

  const token = signToken({ id: user.id, role: user.role });
  const { password: _password, ...safeUser } = user;
  return { user: safeUser, token };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return user;
};
