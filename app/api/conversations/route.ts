import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(
    request:Request
){
    try{
        const currentUser=await getCurrentUser();
        const body=await request.json();
        const {userId,isGroup,members,name}=body;
        
        if(!currentUser?.id || !currentUser?.email)
        {
            return new NextResponse('unauthorized',{status:401})
        }
        if(isGroup && (!members || members.length < 2 || !name))
        {
            return new NextResponse('Invalid Data',{status:400})
        }
        if(isGroup)
        {

            const newConversation=await db.conversation.create({
                data:{
                    name,
                    isGroup,
                    users:{
                        connect:[
                            ...members.map((member: {id: string})=>({
                                id:member.id
                            })),
                            {
                                id:currentUser.id
                            }
                        ]
                    }
                },
                include:{
                    users:true
                }
            })
            return NextResponse.json(newConversation);
        }

        const existingConversations=await db.conversation.findMany({
            where:{
                OR:[
                    {
                        userIds:{
                            equals: [currentUser.id,userId]
                        }
                    },
                    {
                        userIds:{
                            equals:[userId,currentUser.id]
                        }
                    }
                ]
            }
        })
        const singleConversation=existingConversations[0];

        if(singleConversation){return NextResponse.json(singleConversation)}
        
        const newConversation=await db.conversation.create({
            data:{
                users:{
                    connect:[
                        {
                            id:currentUser.id
                        },
                        {
                            id:userId
                        }
                    ]
                }
            },
            include:{
                users:true
            }
        })
        return NextResponse.json(newConversation);
        
    }
    catch(error)
    {
        return new NextResponse("INternal Error",{status: 500})
    }
}

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
        const updatedConversations=await db.conversation.delete({
            where:{
                id:conversationId
            },
        });

        const updatedMessage=await db.message.deleteMany({
            where:{
                id:conversationId
            }
        })
        return NextResponse.json(updatedConversations);

    }
    catch(error)
    {
        console.log("CLOSE_DM_Error",error);
        return new NextResponse("internal error",{status:500})
    }
}