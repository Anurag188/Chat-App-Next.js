import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";

interface IParams{
    conversationId: string
}

export async function POST(request:Request,{params}:{params: IParams}) {
    try{

        const currentUser=await getCurrentUser();
        const {
            conversationId
        }=params;

        if(!currentUser?.name || !currentUser?.email)
        {
            return new NextResponse("Unauthorized",{status:401});
        }

        const conversation=await db.conversation.findUnique({
            where:{
                id:conversationId,
            },
            include:{
                messages:{
                    include:{
                        seen:true,
                    }
                },
                users:true,
            }
        })

        if(!conversation)
        {
            return new NextResponse("invalid conversationid",{status:400});
        }

        const lastMessage=conversation.messages[conversation.messages.length-1];

        if(!lastMessage){
            return NextResponse.json(conversation);
        }

        const updatedMessage=await db.message.update({
            where:{
                id: lastMessage.id
            },
            include:{
                sender:true,
                seen:true,
            },
            data:{
                seen:{
                    connect:{
                        id:currentUser.id
                    }
                }
            }
        })
        
        return NextResponse.json(updatedMessage);

    }catch(error)
    {
        console.log(error,"[ERROR_MESSAGE_SEEN]");
        return new NextResponse("internal error",{status:500})
    }
}