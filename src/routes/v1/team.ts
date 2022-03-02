import { idParam } from './../../validations/teams';
import { addMembersToTeam, removeTeam, editTeam, getTeam, getAllTeams } from './../../controllers/teams';
import { Router } from 'express';
import { AuthMiddleware } from '../../middleware/auth';
import RoleMiddleware from 'middleware/auth/role';
import TeamMiddleWare from 'middleware/team/teams';


const { authenticate } = AuthMiddleware
const { roleAccessValidator } = RoleMiddleware
const { validateAddTeam , validateParams } = TeamMiddleWare

const router = Router();

router.post(
    '', 
   authenticate,
   roleAccessValidator(['Admin']),
   validateAddTeam,
   addMembersToTeam
);

router.delete(
    '/:teamId', 
   authenticate,
   roleAccessValidator(['Admin']),
   validateParams(idParam),
   removeTeam
);

router.put(
    '/:teamId', 
   authenticate,
   roleAccessValidator(['Admin']),
   validateParams(idParam),
   validateAddTeam,
   editTeam
);

router.get(
    '/all', 
   authenticate,
   roleAccessValidator(['Admin']),
   getAllTeams
);

router.get(
    '/:teamId', 
   authenticate,
   roleAccessValidator(['Admin']),
   validateParams(idParam),
   getTeam
);




export default router;




