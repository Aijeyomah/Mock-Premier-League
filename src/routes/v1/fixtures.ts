import { fixtureId } from './../../validations/fixtures';
import { createFixture, deleteFixture, updateFixture, viewSingleFixture, viewAllFixture, fetchCompletedFixtures, fetchPendingFixture, searchFixture } from './../../controllers/fixtures';
import { Router } from 'express';
import { AuthMiddleware } from '../../middleware/auth';
import RoleMiddleware from '../../middleware/auth/role';
import TeamMiddleWare from '../../middleware/team/teams';


const { authenticate } = AuthMiddleware
const { roleAccessValidator } = RoleMiddleware
const { validateParams } = TeamMiddleWare

const router = Router();

router.post(
    '',
    authenticate,
    roleAccessValidator('Admin'),
    createFixture
);

router.delete(
    '/:fixtureId',
    authenticate,
    roleAccessValidator(['Admin']),
    validateParams(fixtureId),
    deleteFixture
);

router.put(
    '/:fixtureId',
    authenticate,
    roleAccessValidator(['Admin']),
    validateParams(fixtureId),
    updateFixture
);
router.get(
    '/completed',
    authenticate,
    fetchCompletedFixtures
);

router.get(
    '/pending',
    authenticate,
    fetchPendingFixture
);

router.get(
    '/search',
    searchFixture
);


router.get(
    '/all',
    authenticate,
    viewAllFixture
);

router.get(
    '/:fixtureId',
    authenticate,
    validateParams(fixtureId),
    viewSingleFixture
);








export default router;