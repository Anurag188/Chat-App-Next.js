"use client"

import Avatar from "@/components/Avatar";
import useOtherUser from "@/hooks/useOtherUser";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import { useMemo } from "react";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { Group, LogOut, Settings, Trash,User as UserIcon } from "lucide-react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModalStore";
import { IoArrowBackOutline } from "react-icons/io5";

interface HeaderProps {
    conversation: Conversation & {
        users: User[]
    }
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {


    const {onOpen}=useModal();
    const router = useRouter();
    const params = useParams();
    const otherUser = useOtherUser(conversation)
    const onDelete = async () => {
        await axios.patch("/api/conversations", {
            conversationId: params?.conversationId
        })
        router.push("/conversations")
        router.refresh();
    }

    const leaveGroup=async()=>{
        await axios.patch("/api/conversations/leave",{
            conversationId: params?.conversationId
        })
        router.push("/groupchat")
        router.refresh();
    }


    return (
        <>
            {conversation.isGroup && (
                <div className="flex h-[70px] md:w-full w-screen bg-white shadow-md mb-1 justify-between">
                     <IoArrowBackOutline size={25} className="md:hidden m-5 mr-2 cursor-pointer" onClick={()=> router.push('/groupchat')}/>
                    <div className="flex-1 flex m-3 gap-x-6 items-center">

                        <Avatar img={conversation.image!} other={true} />
                        <div className="focus:outline-none">
                            <div
                                className="flex justify-between"
                            >
                                <p className="text-md font-semibold font-sans capitalize">
                                    {conversation.name}
                                </p>
                            </div>
                            <div className="text-zinc-500 text-[14px]">
                                {conversation.users.length} Members
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="focus:outline-none"
                            asChild
                        >
                            <button className="flex w-[100px] items-center justify-end mr-6 transition">
                                <HiEllipsisHorizontal size={36} className="text-zinc-500" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[200px] text-xs font-medium dark:text-neutral-400 space-y-[2px] mr-2"

                        >
                            <DropdownMenuItem
                                onClick={()=> onOpen("groupSettings",{conversation:conversation})}
                                className="text-[#1f1f70] px-3 py-2 text-sm cursor-pointer"
                            >
                                Group Settings
                                <Settings className="h-4 w-4 ml-auto" />
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={()=>onOpen("manageMembers",{conversation})}
                                className="text-[#1f1f70] px-3 py-2 text-sm cursor-pointer "
                            >
                                Add Members
                                <UserIcon className="h-4 w-4 ml-auto" />
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={leaveGroup}
                                className="text-[#a33434] px-3 py-2 text-sm cursor-pointer "
                            >
                                Leave Group
                                <LogOut className="h-4 w-4 ml-auto" />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            )}
            {!conversation.isGroup && (
                <div className="flex h-[70px] md:w-full w-screen bg-white shadow-md mb-1 justify-between">
                     <IoArrowBackOutline size={25} className="md:hidden m-5 mr-2 cursor-pointer" onClick={()=> router.push('/conversations')}/>
                    <div className="flex-1 flex m-3 gap-x-6 items-center">

                        <Avatar img={otherUser.image!} other={true} />
                        <div className="focus:outline-none">
                            <div
                                className="flex justify-between"
                            >
                                <p className="text-md font-semibold font-sans capitalize">
                                    {otherUser.name}
                                </p>
                            </div>
                            <div className="text-zinc-500 text-[14px]">
                                last seen at {format(new Date(conversation.lastMessageAt), 'HH:mm')}
                            </div>
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="focus:outline-none"
                            asChild
                        >
                            <button className="flex w-[50px] items-center justify-end mr-6 transition">
                                <HiEllipsisHorizontal size={36} className="text-zinc-500" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[150px] text-xs font-medium dark:text-neutral-400 space-y-[2px]"

                        >
                            <DropdownMenuItem
                                onClick={onDelete}
                                className="text-[#a33434] px-3 py-2 text-sm cursor-pointer hover:text-[#ff0000]"
                            >
                                Close DM
                                <Trash className="h-4 w-4 ml-auto" />
                            </DropdownMenuItem>


                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            )}


        </>
    );
}

export default Header;