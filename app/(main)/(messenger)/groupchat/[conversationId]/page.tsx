import EmptyState from "@/components/EmptyState";
import Loading from "@/components/Loading";
import Body from "@/components/chat/body";
import BodyForm from "@/components/chat/form";
import Header from "@/components/chat/header";
import getConversationById from "@/lib/getConversationById";
import getMessages from "@/lib/getMessages";
import { Suspense } from "react";

interface IParams {
    conversationId: string
}


const GroupChatpage = async ({ params }: { params: IParams }) => {

    const conversation = await getConversationById(params.conversationId)
    const messages = await getMessages(params.conversationId);
    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col"><EmptyState /></div>
            </div>
        )
    }
    return (
        <>
            <Suspense fallback={<Loading/>}>
                <Header conversation={conversation} />
                <Body initialMessages={messages} />
                < BodyForm />
            </Suspense>
        </>
    );
}

export default GroupChatpage;