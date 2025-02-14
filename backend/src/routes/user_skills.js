
import { Router } from "express";
import {
   
    getAllUserSkills,
    getUserSkillsByUserId,
    addSkillToUser,
    updateUserSkill,
    deleteUserSkill
} from "../controllers/user_skills.js";

import { verifyJWT } from "../middlewares/auth.js";

const user_skillsRouter=Router();

user_skillsRouter.route("/").post(verifyJWT,addSkillToUser);

user_skillsRouter.route("/:user_id").get(verifyJWT,getUserSkillsByUserId);
user_skillsRouter.route("/").get(verifyJWT,getAllUserSkills);

user_skillsRouter
  .route("/:user_skill_id")
  .delete(verifyJWT, deleteUserSkill);

user_skillsRouter
  .route("/:user_skill_id")
  .put(verifyJWT, updateUserSkill);


export default user_skillsRouter;

