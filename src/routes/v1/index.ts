import { Router } from 'express';
import authRoutes from './auth';
import teamRoutes from './team';
import fixtureRoute from './fixtures';

const router = Router();

router.use('/auth', authRoutes);
router.use('/teams', teamRoutes);
router.use('/fixture', fixtureRoute);

export default router;

