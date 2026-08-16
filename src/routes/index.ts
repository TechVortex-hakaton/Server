import { Router } from 'express';
import authRoutes from './auth.routes';
import doctorRoutes from './doctor.routes';
import appointmentRoutes from './appointment.routes';
import sportRoutes from './sport.routes';
import articleRoutes from './article.routes';
import categoryRoutes from './category.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/doctor', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/sports', sportRoutes);
router.use('/articles', articleRoutes);
router.use('/categories', categoryRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

export default router;
