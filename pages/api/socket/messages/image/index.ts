import authOptions from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
){
    if(req.method!=="POST")
    {
        return res.status(405).json({error: "method not allowed"});
    }

    try{

    const session = await getServerSession(req,res,authOptions)

    if(!session?.user?.email)
    {
        return null;
    }

    const currentUser = await db.user.findUnique({
        where:{
        email: session.user.email as string
        }
    })
    if(!currentUser){
        return null;
    }

        const {conversationId,values} = req.body;
        const {imageUrl}=values;

        if(!currentUser)
        {
            return res.status(401).json({error: "Unauthorized"});
        }
        if(!conversationId)
        {
            return res.status(400).json({error: "conversation id missing"});
        }

        const newMessage=await db.message.create({
                        data:{
                            image:imageUrl,
                            conversation:{
                                connect:{
                                    id:conversationId as string,
                                }
                            },
                            sender:{
                                connect:{
                                    id: currentUser.id
                                }
                            },
                            seen:{
                                connect:{
                                    id: currentUser.id
                                }
                            }
                        },
                        include:{
                            seen:true,
                            sender:true,
                        }
                    })
            
                    const updatedConversation = await db.conversation.update({
                        where:{
                            id:conversationId as string
                        },
                        data:{
                            lastMessageAt: new Date(),
                            messages:{
                                connect:{
                                    id: newMessage.id
                                }
                            }
                        },
                        include:{
                            users:true,
                            messages:{
                                include:{
                                    seen:true,
                                }
                            }
                        }
                        
                    })

        const channelKey= `chat:${conversationId}:messages`;

        res?.socket?.server?.io?.emit(channelKey,newMessage);

        return res.status(200).json(imageUrl);

    }
    catch(error)
    {
        console.log("[DIRECT_MESSGAE_POST]",error);
        return res.status(500).json({message: "Internal error"});
    }

}




// import { db } from "@/lib/db";
// import { getCurrentUser } from "@/lib/getCurrentUser";
// import { NextResponse } from "next/server";

// export async function POST(
//     request: Request
// ){
//     try{
//         const currentUser=await getCurrentUser();
//         const body= await request.json();
//         const {
//             message,image,conversationId
//         }= body;

//         if(!currentUser?.id || !currentUser?.email)
//         {
//             return new NextResponse("unauthoried" , {status: 401});
//         }

//         const newMessage=await db.message.create({
//             data:{
//                 body: message,
//                 image:image,
//                 conversation:{
//                     connect:{
//                         id:conversationId,
//                     }
//                 },
//                 sender:{
//                     connect:{
//                         id: currentUser.id
//                     }
//                 },
//                 seen:{
//                     connect:{
//                         id: currentUser.id
//                     }
//                 }
//             },
//             include:{
//                 seen:true,
//                 sender:true,
//             }
//         })

//         const updatedConversation = await db.conversation.update({
//             where:{
//                 id:conversationId
//             },
//             data:{
//                 lastMessageAt: new Date(),
//                 messages:{
//                     connect:{
//                         id: newMessage.id
//                     }
//                 }
//             },
//             include:{
//                 users:true,
//                 messages:{
//                     include:{
//                         seen:true,
//                     }
//                 }
//             }
            
//         })

//         return NextResponse.json(newMessage);

//     }   
//     catch(error){
//         return new NextResponse("Internal errror" , {status: 500});
//     }
// }