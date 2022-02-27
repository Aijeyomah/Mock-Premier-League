import { Router } from 'express';
import { AuthMiddleware } from '../../middleware/auth';
import { createUser, loginUser } from '../../controllers/auth'

const router = Router();
const { validateSignUpField, validateLoginSchema, checkIfEmailExist, UserLoginEmailValidator } = AuthMiddleware;

router.post(
    '/signup',
    validateSignUpField,
    checkIfEmailExist,
    createUser
);


router.post(
    '/login',
    validateLoginSchema,
    UserLoginEmailValidator,
    loginUser
);

export default router;
