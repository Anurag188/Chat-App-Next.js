import bcrypt from "bcrypt"
import NextAuth, {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import {PrismaAdapter} from "@next-auth/prisma-adapter"

import { db } from "@/lib/db"


const authOptions: NextAuthOptions= {
    adapter: PrismaAdapter(db),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name:'credentials',
            credentials:{
                email:{label: 'email' , types: 'text'},
                password: {label: 'password' , types: 'password'},
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error('Invalid Credentials')
                }

                const user = await db.user.findUnique({
                    where:{
                        email: credentials.email
                    }
                });

                if(!user || !user?.hashedPassword){
                    throw new Error('Invalid Credentials')
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                )
                if(!isCorrectPassword){
                    throw new Error('Invalid Credentials')  
                }
                return user;
            }
        })
    ],
    debug: process.env.NODE_ENV === "development",
    session : {
        strategy:"jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
