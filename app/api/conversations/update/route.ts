import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
    request:Request
){
    try{

        const currentUser=await getCurrentUser();
        const body=await request.json();
        const {members,conversation}=body;
        
        if(!currentUser?.id || !currentUser?.email)
        {
            return new NextResponse('unauthorized',{status:401})
        }

        const updatedConversation=await db.conversation.update({
            where:{
                id:conversation.id
            },
            data:{
                users:{
                    connect:[
                        ...conversation.users.map((user: User) => ({ id: user.id })),
                        ...members.map((member: {id: string})=>({
                            id:member.id
                        }))
                    ]
                }
            },
            include:{
                users:true
            }
        })

        if(!conversation){
            return new NextResponse("No conversation Found",{status: 402})
        }


        return NextResponse.json(updatedConversation);


    }
    catch(error)
    {
        console.log("[GROUP UPDATE error]",error);
        return new NextResponse("internal error",{status:500});
    }
}