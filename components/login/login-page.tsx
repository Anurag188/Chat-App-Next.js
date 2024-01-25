"use client"

import Image from "next/image"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "../ui/separator"
import { GoogleIcon } from "@/public"
import {signIn, useSession} from "next-auth/react"
import toast from "react-hot-toast"


const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})


export const Login = () => {

    const session= useSession();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(()=>{
        if(session?.status === 'authenticated')
        {
            router.push('/conversations')
        }

    },[session?.status])

    const onSignup = () => {
        router.push("/signup")
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        signIn('credentials', {
            ...values,
            redirect:false
        }).then((callback)=>{
            if(callback?.error){
                toast.error('Invalid Credentials')
            }
            if(callback?.ok && !callback?.error){
                toast.success('Logged In')
                router.push('/conversations')
            }
        }).finally(()=> setIsLoading(false))
        form.reset();
    }



    const socialAction = (action: string) => {
        setIsLoading(true);
        signIn(action, {redirect:false}).then((callback)=>{
            if(callback?.error){
                toast.error('Invalid Credentials')
            }
            if(callback?.ok && !callback?.error){
                toast.success('Logged In')
            }
        }).finally(()=> setIsLoading(false))
    }

    return (
        <div className="absolute md:h-[750px] md:w-[1500px] w-screen h-full bg-white flex md:rounded-[30px] rounded-none">
            <div className="flex-1 w-full">
                <div className="flex flex-col md:mt-[70px] md:m-[150px] m-[20px] mt-[40px] items-center ">
                    <div className="flex mb-[20px] gap-x-4">
                        <Image width="78" height="78" src="/images/logo.jpg" alt="logo" className="" />
                        <div className="mt-5 font-sans font-medium text-[38px] text-center">WeChat</div>
                    </div>
                    <div className="font-sans font-medium text-[28px] mb-6">
                        Welcome Back
                    </div>
                    <Button onClick={()=> socialAction('google')} className="flex justify-start md:w-[300px] w-full bg-white text-black border shadow-md hover:bg-white" >
                        <GoogleIcon className="mr-[50px]" />
                        Continue with Google
                    </Button>

                    <div className="m-5 flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-400 font-sans tracking-widest text-[14px]">
                            OR LOGIN WITH EMAIL
                        </span>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:w-[300px]">
                        
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormControl>
                                            <Input type="email" disabled={isLoading} placeholder="Your Email" {...field} className="text-center focus-visible:ring-0 focus-visible:ring-offset-0" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="mb-4">
                                        <FormControl>
                                            <Input type="password" disabled={isLoading} placeholder="Your Password" {...field} className="text-center focus-visible:ring-0 focus-visible:ring-offset-0 " />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button disabled={isLoading} type="submit" className="w-full bg-[#1f1f70] hover:bg-[#1f1f70]">Log in</Button>
                        </form>
                    </Form>
                    <Separator className="mt-5 w-full" />
                    <div className="text-gray-400 font-sans text-center text-[14px] mt-5">
                        Dont have account yet? <span className="text-[#6da8eb] m-2 underline cursor-pointer" onClick={onSignup}>Sign up</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 bg-[#cce4ff] rounded-r-3xl hidden lg:flex">
                <Image width="600" height="630" src="/images/pic.png" alt="pic" className="m-[70px]" />
            </div>
        </div>
    )
}