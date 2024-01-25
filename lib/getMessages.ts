import { db } from "./db";


const getMessages =async (
    conversationId:string
) => {
    try{
        
        const messages=await db.message.findMany({
            where:{
                conversationId:conversationId
            },
            include:{
                sender:true,
                seen:true,
            },
            orderBy:{
                createdAt: 'asc'
            }
        })

        return messages;
    }
    catch(error)
    {
        return [];
    }
}
 
export default getMessages;