import { Router } from 'express';
import * as doctorController from '../controllers/doctor.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { doctorMiddleware } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';
import { idParamSchema } from '../validators/common.validator';
import { updateDoctorProfileSchema } from '../validators/doctor.validator';
import { createMedicalRecordSchema, updateMedicalRecordSchema } from '../validators/medicalRecord.validator';
import { updateAppointmentStatusSchema } from '../validators/appointment.validator';

const router = Router();

router.use(authMiddleware, doctorMiddleware);

router.get('/profile', doctorController.getProfile);
router.put('/profile', validate(updateDoctorProfileSchema), doctorController.updateProfile);

router.get('/appointments', doctorController.getAppointments);
router.get('/patients', doctorController.getPatients);

router.get('/patients/:id', validate(idParamSchema, 'params'), doctorController.getPatientById);
router.get('/patients/:id/records', validate(idParamSchema, 'params'), doctorController.getPatientRecords);

router.post('/records', validate(createMedicalRecordSchema), doctorController.createRecord);
router.put('/records/:id', validate(idParamSchema, 'params'), validate(updateMedicalRecordSchema), doctorController.updateRecord);

router.put(
  '/appointments/:id/status',
  validate(idParamSchema, 'params'),
  validate(updateAppointmentStatusSchema),
  doctorController.updateAppointmentStatus
);

router.get('/dashboard', doctorController.getDashboard);

export default router;
