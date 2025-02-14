import { Router } from "express";

const skillRouter=Router();

import {
    getAllSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill
} from "../controllers/skill.js"

import { verifyJWT, isAdmin } from "../middlewares/auth.js";

skillRouter.route("/").post(verifyJWT,isAdmin,createSkill);

skillRouter.route("/").get(verifyJWT,getAllSkills);

skillRouter.route("/:skill_id").get(verifyJWT, getSkillById);

skillRouter.route("/:skill_id").put(verifyJWT, isAdmin, updateSkill);

skillRouter.route("/:skill_id").delete(verifyJWT, isAdmin, deleteSkill);

export default skillRouter;