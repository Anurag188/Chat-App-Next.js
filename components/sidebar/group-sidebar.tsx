import { useModal } from "@/hooks/useModalStore";
import { FullConversationType } from "@/types";
import { Plus } from "lucide-react";
import ConversationItem from "./conversation-item";
import useConversation from "@/hooks/useConversation";

interface GroupSidebarProps {
    conversation: FullConversationType[];
}


const GroupSidebar: React.FC<GroupSidebarProps> = ({conversation}) => {

    const { conversationId, isOpen } = useConversation();
    const { onOpen } = useModal();

    return (
        <div className="flex flex-col h-full bg-gray-40 md:w-full w-screen">
            <div className="flex h-20 w-full justify-between">
                <div className="m-4 mt-4 text-[30px] font-sans font-semibold ">
                    Groups
                </div>
                <div className="m-4 mt-6 mr-0">
                    <button
                        onClick={() => onOpen("createGroup")}
                        className="group flex items-center"
                    >
                        <div className="flex mx-3 h-[28px] w-[28px] rounded-[24px] group-hover:rounded-[16] transition-all overflow-hidden items-center justify-center bg-[#1f1f70] hover:opacity-75">
                            <Plus
                                className="transition text-white"
                                size={20}
                            />

                        </div>
                    </button>
                </div>
            </div>
            <div className="space-y-2 flex flex-col md:w-full w-screen items-center">
                {conversation.map((item) => (
                    item.isGroup && (
                        <ConversationItem
                            key={item.id}
                            data={item}
                            selected={conversationId === item.id}
                        />
                    )
                ))}
            </div>
        </div>

    );
}

export default GroupSidebar;