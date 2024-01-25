import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(
    request: Request
){
    try{
        const currentUser=await getCurrentUser();
        const body= await request.json();
        const {
            email
        }= body;

        if(!currentUser?.id || !currentUser?.email)
        {
            return new NextResponse("unauthoried" , {status: 401});
        }
        
        const user=await db.user.findUnique({
            where:{
                email:email as string
            }
        })
   
        return NextResponse.json(user?.id);

    }   
    catch(error){
        return new NextResponse("Internal errror" , {status: 500});
    }
}

export async function PATCH(
    request:Request
){
    try{
        const currentUser=await getCurrentUser();
        const body= await request.json();

        const {name,imageUrl}=body;
        if(!currentUser?.id || !currentUser?.email)
        {
            return new NextResponse("unauthoried" , {status: 401});
        }
        
        const updatedUser=await db.user.update({
            where:{
                id: currentUser?.id
            },
            data:{
                image:imageUrl,
                name:name
            }
        })
   
        return NextResponse.json(updatedUser);

    }   
    catch(error){
        return new NextResponse("Internal errror" , {status: 500});
    }

}