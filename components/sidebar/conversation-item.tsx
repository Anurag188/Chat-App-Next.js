import useOtherUser from "@/hooks/useOtherUser";
import { cn } from "@/lib/utils";
import { FullConversationType } from "@/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import Avatar from "../Avatar";
import { format } from "date-fns";
import useConversation from "@/hooks/useConversation";
import getConversation from "@/lib/getConversation";


interface ConversationItemProps {
    data: FullConversationType,
    selected?: boolean
}

const ConversationItem = ({ data, selected }
    : ConversationItemProps
) => {

    const otherUser = useOtherUser(data);
    const session = useSession();
    const router = useRouter();


    const handleClick = useCallback(() => {
        if(data.isGroup)
        {
            router.push(`/groupchat/${data.id}`);
        }
        else if(!data.isGroup){
            router.push(`/conversations/${data.id}`);
        }
    }, [data.id, router])

    const lastMessage = useMemo(() => {
        const messages = data.messages || [];
        return messages[messages.length - 1];
    }, [data.messages])

    const userEmail = useMemo(() => {
        return session.data?.user?.email
    }, [session.data?.user?.email])

    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false;
        }
        const seenArray = lastMessage.seen || [];
        if (!userEmail) {
            return false;
        }
        return seenArray.filter((user) => user.email === userEmail).length !== 0;
    }, [userEmail, lastMessage])


    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return 'Sent an image';
        }
        if (lastMessage?.body) {
            return lastMessage.body;
        }
        if(data.isGroup)
        {
            return 'Joined a Group '
        }
        return 'Started a conversation '
    }, [lastMessage])

    return (
        <>
            {data.isGroup && (
                <button onClick={handleClick} className={cn(
                    "flex h-[70px] md:w-[360px] w-[300px] ml-[20px] mr-[20px] shadow-md rounded-[10px]",
                    selected ? 'bg-neutral-200' : 'bg-white hover:bg-gray-100'
                )}>
                    <div className="m-3 ml-4">
                        <Avatar img={data.image!} other={true} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="focus:outline-none">
                            <div
                                className="flex justify-between items-center"
                            >
                                <p className="mt-3 text-md font-semibold font-sans capitalize">
                                    {data.name}
                                </p>
                                {lastMessage?.createdAt && (
                                    <p className={cn(
                                        "text-[12px] mr-2 font-sans"
                                    )}>
                                        {format(new Date(lastMessage.createdAt), 'p')}
                                    </p>
                                )}
                            </div>
                            <p className={cn(
                                "pr-14 text-start text-[14px] overflow-hidden whitespace-nowrap overflow-ellipsis", hasSeen ? "" : "font-semibold"
                            )}>
                                {lastMessageText}
                            </p>
                        </div>
                    </div>
                </button>

            )}
            {!data.isGroup && (
                <button onClick={handleClick} className={cn(
                    "flex h-[70px] md:w-[360px] w-[300px] ml-[20px] mr-[20px] shadow-md rounded-[10px]",
                    selected ? 'bg-neutral-200' : 'bg-white hover:bg-gray-100'
                )}>
                    <div className="m-3 ml-4">
                        <Avatar img={otherUser.image!} other={true} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="focus:outline-none">
                            <div
                                className="flex justify-between items-center"
                            >
                                <p className="mt-3 text-md font-semibold font-sans capitalize">
                                    {otherUser.name}
                                </p>
                                {lastMessage?.createdAt && (
                                    <p className={cn(
                                        "text-[12px] mr-2 font-sans"
                                    )}>
                                        {format(new Date(lastMessage.createdAt), 'p')}
                                    </p>
                                )}
                            </div>
                            <p className={cn(
                                "pr-14 text-start text-[14px] overflow-hidden whitespace-nowrap overflow-ellipsis", hasSeen ? "" : "font-semibold"
                            )}>
                                {lastMessageText}
                            </p>
                        </div>
                    </div>
                </button>
            )}
        </>
    );
}

export default ConversationItem;