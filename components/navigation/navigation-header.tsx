"use client"

import useRoutes from "@/hooks/useRoutes";
import NavigationItems from "./navigation-items";
import { User } from "@prisma/client";
import { useState } from "react";
import Avatar from "../Avatar";
import { signOut } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useModal } from "@/hooks/useModalStore";
import { LogOut, UserCog } from "lucide-react";
import { usePathname } from "next/navigation";


interface NavigationProps {
  currentUser: User,
}

const Navigation: React.FC<NavigationProps> = ({
  currentUser
}) => {

  const [isOpen, setIsOpen] = useState(false);
  const routes = useRoutes();
  const { onOpen } = useModal();
  const pathname=usePathname();
  const setOrHide=(pathname==='/conversations' || pathname==='/groupchat') ? 0 : 1;

  return (

    <div className={`flex h-[70px] shadow-md md:w-[400px] w-screen bg-white justify-between ${setOrHide ? 'hidden lg:flex' : ''} `}>
      <nav className="mt-4 flex">

        <ul role="list" className="flex items-center space-x-[30px] mb-4 ml-10">
          {routes.map((item) => (
            <NavigationItems key={item.label} href={item.href} label={item.label} active={item.active} icon={item.icon} />
          ))}
        </ul>
      </nav>
      <nav className="flex mt-4 mr-2">
        <div
          onClick={() => setIsOpen(true)}
          className="cursor-pointer hover:opacity-75 transition"
        >


          <DropdownMenu>
            <DropdownMenuTrigger
              className="focus:outline-none"
              asChild
            >
              <button
                className=""
              >
                <Avatar img={currentUser?.image!} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[150px] text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"

            >
              <DropdownMenuItem
                onClick={() => onOpen("editProfile", { user: currentUser })}
                className="text-[#1f1f70] px-3 py-2 text-sm cursor-pointer"
              >
                Edit Profile
                <UserCog className="h-4 w-4 ml-auto" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut()}
                className="text-rose-500 px-3 py-2 text-sm cursor-pointer "
              >
                Log out
                <LogOut className="h-4 w-4 ml-auto" />
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </nav>

    </div>
  );
}
export default Navigation;
