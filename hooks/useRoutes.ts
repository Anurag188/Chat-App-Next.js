import { usePathname } from "next/navigation"
import useConversation from "./useConversation";
import { useMemo } from "react";
import { HiUserGroup } from "react-icons/hi2";
import { BsFillChatRightDotsFill } from "react-icons/bs";


const useRoutes = ()=>{
    const pathname=usePathname();
    const {conversationId} = useConversation();

    const routes= useMemo(()=> [
        {
            label: 'Chat',
            href: '/conversations',
            icon: BsFillChatRightDotsFill,
            active: (pathname === `/conversations/${conversationId}` || pathname==="/conversations")
        },
        {
            label: 'Group',
            href: '/groupchat',
            icon: HiUserGroup,
            active: (pathname === "/groupchat" || pathname === `/groupchat/${conversationId}`)
        }
        

    ],[pathname,conversationId])
    return routes;
}

export default useRoutes;