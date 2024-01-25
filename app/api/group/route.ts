import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";

export async function PATCH(
    request:Request
){
    try{
        const currentUser=await getCurrentUser();
        const body= await request.json();

        const {values,conversationId}=body;
        const {name,imageUrl}=values;
        console.log(name,imageUrl,conversationId);
        if(!currentUser?.id || !currentUser?.email)
        {
            return new NextResponse("unauthoried" , {status: 401});
        }
        
        const updatedConversation=await db.conversation.update({
            where:{
                id: conversationId
            },
            data:{
                image:imageUrl,
                name:name
            }
        })
    //    console.log(updatedConversation)   
        return NextResponse.json(updatedConversation);

    }   
    catch(error){
        return new NextResponse("Internal errror" , {status: 500});
    }

}