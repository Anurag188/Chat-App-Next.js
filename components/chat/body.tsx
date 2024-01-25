"use client"


import useConversation from "@/hooks/useConversation";

import { FullMessageType } from "@/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./message-box";
import axios from "axios";

import { useSocket } from "@/components/providers/socket-provider";
import { useRouter } from "next/navigation";

interface BodyProps {
    initialMessages: FullMessageType[],
}

const Body = ({ initialMessages}: BodyProps) => {


    const router = useRouter();
    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);
 
    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`)
    }, [conversationId])


    const { socket } = useSocket();
    useEffect(() => {
        if (!socket) { return };
        bottomRef?.current?.scrollIntoView();
        console.log(socket);
        socket.on(`chat:${conversationId}:messages`, (newMessage: FullMessageType) => {
            console.log(newMessage?.body);

            axios.post(`/api/conversations/${conversationId}/seen`);

            setMessages((current)=>{
                return [...current,newMessage]
            })
            bottomRef?.current?.scrollIntoView();
            router.refresh();
        })
        return () => {
            socket.off(`chat:${conversationId}:messages`)
        }

    }, [socket])


    return (
        <div  className="flex-1 overflow-y-auto bg-white shadow-md p-4 min-w-screen">
           
            {messages.map((message, i) => (
                <MessageBox
                    isLast={i === messages.length - 1}
                    key={message.id}
                    data={message}
                />
            ))}
            <div ref={bottomRef} className='pt-24'>
            </div>
        </div>
        
    );
}

export default Body;