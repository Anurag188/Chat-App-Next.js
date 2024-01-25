"use client"

import { useEffect, useState } from "react"
import { CreateChatModal } from "../modals/create-chat-modal"
import { EditProfileModal } from "../modals/edit-profile-modal"
import { CreateGroupModal } from "../modals/create-group-modal"
import { GroupSettingsModal } from "../modals/group-settings"
import { ManageMembersModal } from "../modals/manage-members"


export const ModalProvider = ()=>{

const [isMounted,setIsMounted] =useState(false)

useEffect(()=>{
    setIsMounted(true)
},[])

if(!isMounted)
{
    return null;
}

return(

    <>
        <CreateChatModal/>
        <EditProfileModal/>
        <CreateGroupModal/>
        <GroupSettingsModal/>
        <ManageMembersModal/>
    </>
)

}
