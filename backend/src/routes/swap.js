import { Router } from "express";

const swapRouter=Router();

import {
    initiateSwap,getUserSwaps,getSwapDetails,updateSwapStatus,deleteSwap
} from "../controllers/swap.js";
import { verifyJWT } from "../middlewares/auth.js";

swapRouter.route("/").post(verifyJWT,initiateSwap);

swapRouter.route("/:user_id").get(verifyJWT, getUserSwaps);

swapRouter.route("/swapi/:swap_id").get(verifyJWT, getSwapDetails);

swapRouter.route("/:swap_id/status").put(verifyJWT, updateSwapStatus);

swapRouter.route("/:swap_id").delete(verifyJWT, deleteSwap);

export {swapRouter};

