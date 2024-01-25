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
            emails
        }= body;

        if(!currentUser?.id || !currentUser?.email)
        {
            return new NextResponse("unauthoried" , {status: 401});
        }
        
        const users=await db.user.findMany({
            where: {
              email: {
                in: emails,
              },
            },
            select: {
              id: true,
            },
          });
   
        return NextResponse.json(users);

    }   
    catch(error){
        return new NextResponse("Internal errror" , {status: 500});
    }
}
