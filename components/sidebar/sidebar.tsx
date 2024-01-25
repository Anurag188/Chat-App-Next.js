"use client"

import { usePathname } from "next/navigation";
import GroupSidebar from "./group-sidebar";
import ConversationSidebar from "./conversation-sidebar";
import { FullConversationType } from "@/types";
import useConversation from "@/hooks/useConversation";
import { Suspense } from "react";

interface SidebarProps {
    conversation: FullConversationType[];
}

const Sidebar: React.FC<SidebarProps> = ({ conversation }) => {

    const { conversationId } = useConversation();
    const pathname = usePathname();

    const setOrHide=(pathname==='/conversations' || pathname==='/groupchat') ? 0 : 1;
    return (

        <div className={`flex-1 ${setOrHide ? 'hidden lg:flex' : ''} `}>

            {(pathname === `/conversations/${conversationId}` || pathname === "/conversations") && (
                <ConversationSidebar conversation={conversation} />
            )}
            {(pathname === "/groupchat" || pathname === `/groupchat/${conversationId}`) && (
                <GroupSidebar conversation={conversation} />
            )}


        </div>
    );
}

export default Sidebar;