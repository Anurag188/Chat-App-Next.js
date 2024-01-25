import {Conversation,Message,User} from "@prisma/client"
import { NextApiResponse } from "next";
import {Server as SocketIOServer} from "socket.io"
import {Server as NetServer,Socket} from "net"
export type FullMessageType=Message & {
    sender: User,
    seen: User[]
};

export type FullConversationType = Conversation & {
    users: User[],
    messages: FullMessageType[],

}


export type NextApiResponseServerIo=NextApiResponse & {
    socket: Socket &{
        server: NetServer & {
            io: SocketIOServer;
        }
    }
}