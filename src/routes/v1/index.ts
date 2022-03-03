import { rateLimiter } from './../../middleware/team/rate-limiter';
import { Router } from 'express';
import authRoutes from './auth';
import teamRoutes from './team';
import fixtureRoute from './fixtures';

const router = Router();

router.use('/auth', authRoutes);
router.use('/teams',  teamRoutes);
router.use('/fixture',rateLimiter, fixtureRoute); 

export default router;

