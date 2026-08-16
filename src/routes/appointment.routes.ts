import { Router } from 'express';
import * as appointmentController from '../controllers/appointment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { idParamSchema } from '../validators/common.validator';
import { createAppointmentSchema, updateAppointmentSchema } from '../validators/appointment.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', appointmentController.getAppointments);
router.post('/', validate(createAppointmentSchema), appointmentController.createAppointment);
router.get('/:id', validate(idParamSchema, 'params'), appointmentController.getAppointmentById);
router.put('/:id', validate(idParamSchema, 'params'), validate(updateAppointmentSchema), appointmentController.updateAppointment);
router.delete('/:id', validate(idParamSchema, 'params'), appointmentController.deleteAppointment);

export default router;
