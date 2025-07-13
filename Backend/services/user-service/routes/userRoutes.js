import express from 'express';
import authController from '../controllers/userControllers.js';
import registerValidator from '../../../libs/validators/registerValidator.js';
import validateRequest from '../../../libs/validators/validateRequest.js';

const router = express.Router();

router.get('/', authController.home);
router.get('/api/register', authController.registerForm);
router.get('/api/login', authController.loginForm);
router.post('/api/register', registerValidator, validateRequest, authController.register);
router.post('/api/login', authController.login);
router.post('/api/logout', authController.logout);
router.get('/api/loggedin', authController.isLoggedIn);    

export default router;  