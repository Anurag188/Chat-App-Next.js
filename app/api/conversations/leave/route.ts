import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";

export async function PATCH(
    request:Request
){
    try{
        const currentUser=await getCurrentUser();
        const body=await request.json();
        const {conversationId}=body;
        
        if(!currentUser?.id || !currentUser?.email)
        {
            return new NextResponse('unauthorized',{status:401})
        }

        const conversation=await db.conversation.findUnique({
            where:{
                id:conversationId
            }
        })
        if(!conversation)
        {
            return new NextResponse("error in conversation id",{status:402})
        }

        const updatedConversations=await db.conversation.update({
            where:{
                id:conversationId,
            },
            data:{
                userIds:{
                    set: conversation.userIds.filter(userId => userId !== currentUser.id)
                }
            }
        });

        return NextResponse.json(updatedConversations);

    }
    catch(error)
    {
        console.log("CLOSE_DM_Error",error);
        return new NextResponse("internal error",{status:500})
    }
}