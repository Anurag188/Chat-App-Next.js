"use client"

import { FullConversationType } from "@/types";
import { User } from "@prisma/client";
import Image from "next/image";

interface AvatarProps {
    img?: string,
    other?: boolean,
}

const Avatar = ({ img, other }:
    AvatarProps
) => {
    return (
        <div className="relative">
            <div className="relative inline-block rounded-full overflow-hidden w-10 h-10">
              {!!img ? <Image alt="Avatar" src={img} fill /> : <Image alt="Avatar" src='/images/placeholder.jpg' fill />} 
            </div>
            {!other && <span
                className="absolute block rounded-full bg-green-500 ring-2 ring-white top-0 right-0 h-2 w-2"
            />}
        </div>
    );
}

export default Avatar;