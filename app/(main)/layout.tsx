import Navigation from "@/components/navigation/navigation-header"
import Sidebar from "@/components/sidebar/sidebar"
import getConversation from "@/lib/getConversation"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { usePathname } from "next/navigation"

const Messsenger = async ({ children }: { children: React.ReactNode }) => {
    const currentUser = await getCurrentUser();
    const conversation = await getConversation();
    const showMainContent=0;
    return (
        <div className="flex flex-col h-full bg-[#f9fbfc]">
            <div className="h-[80px] flex justify-between shadow-md mb-3 bg-white" >
                <div className="m-5 mr-0 ml-[35px] font-sans text-[24px] font-semibold">
                    WE CHAT
                </div>
                <div className="md:mr-[35px] mr-[5px] ml-1  m-[25px] text-[18px] font-sans text-zinc-500">
                    Create Memorable Talks
                </div>

            </div>
            <div className="h-[calc(100vh-92px)] flex">
                <div className={`flex-col h-full`}>
                    <Navigation currentUser={currentUser!} />
                    <Sidebar conversation={conversation!} />
                </div>
                <main className="flex-1 md:h-full h-screen flex flex-col">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Messsenger