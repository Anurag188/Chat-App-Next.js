import { db } from "./db";
import { getCurrentUser } from "./getCurrentUser";

const getConversationById = async(
    conversationId:string
) => {
    try{
        const currentUser=getCurrentUser();

        if(!currentUser)
        {
            return null;
        }

        const conversation =await db.conversation.findUnique({
            where:{
                id:conversationId
            },
            include:{
                users:true
            }
        })
        return conversation;

    }
    catch(error:any)
    {
        return null;
    }
}
 
export default getConversationById;