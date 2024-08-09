import prisma from "../lib/prisma.js";

export const getChats=async(req,res)=>{
    const tokenUserId = req.userId;
    try{
        const chats = await prisma.chat.findMany({
            where:{
                userIDs:{
                    hasSome:[tokenUserId]
                }
            }
        });

        for(const chat of chats){
            const receiverId = chat.userIDs.find(id=> id!==tokenUserId)

            const receiver = await prisma.user.findUnique({
                where:{
                    id:receiverId,
                },

                select:{
                    id:true,
                    username:true,
                    avatar:true,
                }
            })
            chat.receiver=receiver
        }
        res.status(200).json(chats)
    }
    catch(err){
        console.log(err);
        res.status(500).json({Message:"Failed to get chats!"})
    }
};

export const getChat=async(req,res)=>{
    const chatId = req.params.id    
    const tokenUserId = req.userId
    
    try{
        const chat = await prisma.chat.findUnique({
            where:{
                id:chatId,
                userIDs:{
                    hasSome:
                    [tokenUserId],
                },
            },
            include :{
                messages:{
                    orderBy:{
                        createdAt:"asc"
                    },
                }
            }
        });

        await prisma.chat.update({
            where:{
                id:req.params.id
            },
            data:{
                seenBy:{
                    push:[tokenUserId]
                }
            }
        })
        res.status(200).json(chat)
    }
    catch(err){
        console.log(err);
        res.status(500).json({Message:"Failed to get chat!"})
    }
};
export const addChat=async(req,res)=>{
    const tokenUserId = req.userId
    try{
        const newChat = await prisma.chat.create({
            data:{
                userIDs:[tokenUserId,req.body.receiverId]
            }
        })
        res.status(200).json(newChat)
    }
    catch(err){
        console.log(err);
        res.status(500).json({Message:"Failed to add chats!"})
    }
};
export const readChat=async(req,res)=>{
    const tokenUserId = req.userId
    
    try{
        const chat = await prisma.chat.update({
            where:{
                id:req.params.id,
                uerIDs:{
                    hasSome:[tokenUserId]
                }
            },
            data:{
                seenBy:{
                    set:[tokenUserId]
                }
            }
        })
        res.status(200).json(chat)
    }
    catch(err){
        console.log(err);
        res.status(500).json({Message:"Failed to read chats!"})
    }
};