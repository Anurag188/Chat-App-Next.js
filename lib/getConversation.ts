import { db } from "./db";
import { getCurrentUser } from "./getCurrentUser"

const getConversation = async ()=>{
    const currentUser=await getCurrentUser();

    if(!currentUser?.id)
    {
        return [];
    }
    try{

        const conversation = await db.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc'
            },
            where:{
                userIds:{
                    has: currentUser.id
                }
            },
            include:{
                users:true,
                messages:{
                    include:{
                        sender: true,
                        seen: true
                    }
                }
            }
        })
        return conversation;
    }
    catch(error)
    {
        return [];
    }
}


export default getConversation