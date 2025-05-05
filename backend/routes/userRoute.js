import { update, registerUser, fetchUsers } from "../controllers/userController";
import express from "express";

const router = express.Router();

router.get('/', fetchUsers);
router.post('/', registerUser);
router.put('/:id', update);

export default router;