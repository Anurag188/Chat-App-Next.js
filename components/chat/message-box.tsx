"use client"

import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { FullMessageType } from "@/types";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {format} from "date-fns"

interface MessageBoxProps{
    data: FullMessageType,
    isLast?:boolean
}

const MessageBox = ({data,isLast}:MessageBoxProps) => {
    
    const session=useSession();

    const isOwn=session?.data?.user?.email ===data?.sender?.email
    const seenList=(data.seen || []).filter((user)=> user.email !== data?.sender?.email).map((user)=> user.name).join(',');

    const container=cn("flex gap-3 p-4 md:pl-4 pl-0", isOwn && ("justify-end pr-0 md:pr-4"))
    const avatar= cn(isOwn && "order-2");

    const body=cn("flex flex-col gap-2",isOwn && "items-end")

    const message = cn("text-sm w-fit max-w-[500px] overflow-hidden" ,isOwn ? "bg-[#1f1f70] text-white " : "bg-[#e7eff7]",data?.image ? "rounded-md p-0": "rounded-[20px] py-2 px-3" , isOwn && !data?.image && "rounded-tr-none")

    return ( 
        <div className={container}>
            <div className={avatar}>
                <Avatar img={data?.sender.image!} other={true}/>
            </div>
            <div className={body}>
                <div className="flex items-center gap-1 ">
                    <div className="text-sm text-gray-500">
                        {data.sender.name}
                    </div>
                    <div className="text-xs text-gray-400">
                        {format(new Date(data.createdAt),'p')}
                    </div>
                </div>
                <div className={message}>
                    {data.image ? (
                        <Image alt="Image" src={data?.image} width="288" height="288" className="object-cover cursor-pointer hover:scale-110 transition translate"/>
                    ): (
                        <div>{data.body}</div>
                    )}
                </div>
            </div>
                        
        </div>
     );
}
 
export default MessageBox;