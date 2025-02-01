import { asyncHandler } from "../utils/asyncHandler";

const createSkillCategory=asyncHandler(async(req,res)=>{
    const {name}=req.body;
    try{
        const [result]=await pool.query("INSERT INTO skill_categories (name) VALUES (?)",[name]);
        res.status(201).json({message:"Skill category created successfully",id:result.insertId});
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
});