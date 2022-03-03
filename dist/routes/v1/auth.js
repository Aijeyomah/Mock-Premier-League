"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const auth_2 = require("../../controllers/auth");
const router = (0, express_1.Router)();
const { validateSignUpField, validateLoginSchema, checkIfEmailExist, UserLoginEmailValidator } = auth_1.AuthMiddleware;
router.post('/signup', validateSignUpField, checkIfEmailExist, auth_2.createUser);
router.post('/login', validateLoginSchema, UserLoginEmailValidator, auth_2.loginUser);
exports.default = router;
//# sourceMappingURL=auth.js.map