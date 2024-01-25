"use client"

import { cn } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import { Suspense } from "react";

interface NavigationItemsProps{
    label: string,
    href: string,
    icon:any,
    onClick?: ()=> void,
    active?: boolean,
}

const NavigationItems = ({
    href,active,icon:Icon
}:NavigationItemsProps) => {

    return ( 
        <li>
            <Link href={href}
                className={cn(
                    "text-gray-400",
                    active && "text-[#1f1f70]"
                )}
            >
                <Icon className="h-6 w-6 shrink-0"/>
                
            </Link>
        </li>
     
     );
}
 
export default NavigationItems;