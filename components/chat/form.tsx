"use client"

import qs from "query-string"
import useConversation from "@/hooks/useConversation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SlPaperClip } from "react-icons/sl";
import { Sendicon } from "@/public";
import { useRouter } from "next/navigation";
import { CldUploadButton } from "next-cloudinary"
import { EmojiPicker } from "../emoji-picker";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useSocket } from "@/components/providers/socket-provider";

const formSchema = z.object({
    message: z.string(),
})

const BodyForm = () => {
    const { conversationId } = useConversation();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            message: "",
        }
    })


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try{
            const url=qs.stringifyUrl({
                url:"/api/socket/messages",
            })
            await axios.post(url,{values,conversationId})
            form.reset();
            router.refresh();
        }
        catch(error){
            console.log(error)
        }
        setIsLoading(false);
        form.setValue("message", "");
        
        router.refresh();

    }

    const handleUpload = async(result: any) => {
        setIsLoading(true);
        try{
            const url=qs.stringifyUrl({
                url:"/api/socket/messages/image",
            })
            await axios.post(url,{values:{imageUrl: result?.info?.secure_url},conversationId})
            form.reset();
            router.refresh();
        }
        catch(error){
            console.log(error)
        }
        setIsLoading(false);
        router.refresh();

    }    
    

    return (
        <div className="md:px-4 py-4 px-1 h-[100px] w-full shadow-inner bg-white ">
            <div className="flex h-[60px] items-center m-1 ml-4 bg-[#f4f8fa] rounded-3xl">

                <CldUploadButton

                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset="lehwukid"
                >
                    <SlPaperClip size={25} className="text-zinc-500 ml-4" />
                </CldUploadButton>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex-1 flex items-center gap-2 lg:gap-4 w-full h-full"
                    >
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div className="flex items-center">
                                            <div className="flex px-4"><EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)} /></div>
                                            
                                                <Input
                                                    disabled={isLoading}
                                                    className="flex-1 border-none w-full bg-[#f4f8fa] focus-visible:ring-0 focus-visible:ring-offset-0 text-[16px]"
                                                    placeholder={`Type a message here...`}
                                                    {...field}
                                                />
                                            
                                            <button
                                                type="submit"
                                                className="md:w-[60px] md:h-[60px] w-[50px] h-[50px] rounded-full p-2 bg-[#1f1f70] transition"
                                            >
                                                <Sendicon className="md:h-7 md:w-7 h-5 w-5 ml-1"/>
                                            </button>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
        </div>

    );
}

export default BodyForm;