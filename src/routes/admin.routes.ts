import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { validate } from '../middleware/validation.middleware';
import { idParamSchema } from '../validators/common.validator';
import { updateUserStatusSchema } from '../validators/user.validator';
import { adminCreateDoctorSchema, adminUpdateDoctorSchema } from '../validators/doctor.validator';
import { adminSportRouter } from './sport.routes';
import { adminArticleRouter } from './article.routes';
import { adminCategoryRouter } from './category.routes';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', adminController.getDashboard);

router.get('/users', adminController.getUsers);
router.put('/users/:id/status', validate(idParamSchema, 'params'), validate(updateUserStatusSchema), adminController.updateUserStatus);
router.delete('/users/:id', validate(idParamSchema, 'params'), adminController.deleteUser);

router.get('/doctors', adminController.getDoctors);
router.post('/doctors', validate(adminCreateDoctorSchema), adminController.createDoctor);
router.put('/doctors/:id', validate(idParamSchema, 'params'), validate(adminUpdateDoctorSchema), adminController.updateDoctor);
router.delete('/doctors/:id', validate(idParamSchema, 'params'), adminController.deleteDoctor);

router.get('/patients', adminController.getPatients);

router.get('/appointments', adminController.getAppointments);

router.use('/sports', adminSportRouter);
router.use('/articles', adminArticleRouter);
router.use('/categories', adminCategoryRouter);

export default router;
