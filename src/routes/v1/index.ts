import { Router } from 'express';
import authRoutes from './auth';
import teamRoutes from './team';

const router = Router();

router.use('/auth', authRoutes);
router.use('/teams', teamRoutes);


export default router;

