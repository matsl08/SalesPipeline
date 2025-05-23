//userRoute.js
import {
  checkUserInDatabase,
  registerUser,
  fetchUsers,
  updateUser,
  deleteUser
} from "../controllers/userController.js";
import express from "express";
import { check } from "express-validator";
import { loginUser } from "../controllers/authController.js";

const router = express.Router();

const validateUser = [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Email is required').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
];

router.get('/check', checkUserInDatabase);
router.get('/', fetchUsers);
router.post('/register', validateUser, registerUser);
router.post('/login', loginUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;