import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt"

export const getUsers=async(req,res)=>{
    
    try{
        const users = await prisma.user.findMany();
        res.status(200).json(users)
    }
    catch(err){
        console.log(err);
        res.status(500).json({Message:"Failed to get users!"})
    }
}
export const getUser=async(req,res)=>{
    const id = req.params.id
    try{
        const user = await prisma.user.findUnique({
            where:{id:id},
        });
        res.status(200).json(user)
    }
    catch(err){
        console.log(err);
        res.status(500).json({Message:"Failed to get user!"})
    }


}
export const updateUser=async(req,res)=>{
    const id = req.params.id
    const tokenUserId = req.userId
    const {password, avatar, ...inputs} = req.body
    if(tokenUserId!==id){
        return res.status(403).json({Message: "Not Authorized!"})
    }
    let updatedPassword = null;
    try{
        if(password){
            updatedPassword=await bcrypt.hash(password,10);
        }
        const updatedUser = await prisma.user.update({
            where:{id},
            data:{
                ...inputs,
                ...(updatedPassword && {password:updatedPassword}),
                ...(avatar && {avatar})
            },
        })
        const{password:userPassword,...rest} = updatedUser
        
        res.status(200).json(rest)
    }
    catch(err){
        console.log(err);
        res.status(500).json({Message:"Failed to update users!"})
    }



}
export const deleteUser=async(req,res)=>{
    const id = req.params.id
    const tokenUserId = req.userId
    if(tokenUserId!==id){
        return res.status(403).json({Message: "Not Authorized!"})
    }
    try{
        await prisma.user.delete({
            where:{id}
        })
        res.status(200).json({Message:"User deleted!"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({Message:"Failed to delete users!"})
    }
}